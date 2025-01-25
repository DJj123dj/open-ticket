///////////////////////////////////////
//TICKET MOVING SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerActions = async () => {
    openticket.actions.add(new api.ODAction("openticket:move-ticket"))
    openticket.actions.get("openticket:move-ticket").workers.add([
        new api.ODWorker("openticket:move-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to move ticket! Open Ticket doesn't support threads!")

            await openticket.events.get("onTicketMove").emit([ticket,user,channel,reason])
            ticket.option = data

            //update stats
            await openticket.stats.get("openticket:global").setStat("openticket:tickets-moved",1,"increase")
            await openticket.stats.get("openticket:user").setStat("openticket:tickets-moved",user.id,1,"increase")

            //get new channel properties
            const channelPrefix = ticket.option.get("openticket:channel-prefix").value
            const channelSuffix = ticket.get("openticket:channel-suffix").value
            const channelCategory = ticket.option.get("openticket:channel-category").value
            const channelBackupCategory = ticket.option.get("openticket:channel-category-backup").value
            const rawClaimCategory = ticket.option.get("openticket:channel-categories-claimed").value.find((c) => c.user == user.id)
            const claimCategory = (rawClaimCategory) ? rawClaimCategory.category : null
            const closeCategory = ticket.option.get("openticket:channel-category-closed").value
            const channelDescription = ticket.option.get("openticket:channel-description").value
            const channelName = channelPrefix+channelSuffix

            //handle category
            let category: string|null = null
            let categoryMode: "backup"|"normal"|"closed"|"claimed"|null = null
            if (claimCategory){
                //use claim category
                category = claimCategory
                categoryMode = "claimed"
            }else if (closeCategory != "" && ticket.get("openticket:closed").value){
                //use close category
                category = closeCategory
                categoryMode = "closed"
            }else if (channelCategory != ""){
                //category enabled
                const normalCategory = await openticket.client.fetchGuildCategoryChannel(guild,channelCategory)
                if (!normalCategory){
                    //default category was not found
                    openticket.log("Ticket Move Error: Unable to find category! #1","error",[
                        {key:"categoryid",value:channelCategory},
                        {key:"backup",value:"false"}
                    ])
                }else{
                    //default category was found
                    if (normalCategory.children.cache.size >= 50 && channelBackupCategory != ""){
                        //use backup category
                        const backupCategory = await openticket.client.fetchGuildCategoryChannel(guild,channelBackupCategory)
                        if (!backupCategory){
                            //default category was not found
                            openticket.log("Ticket Move Error: Unable to find category! #2","error",[
                                {key:"categoryid",value:channelBackupCategory},
                                {key:"backup",value:"true"}
                            ])
                        }else{
                            category = backupCategory.id
                            categoryMode = "backup"
                        }
                    }else{
                        //use default category
                        category = normalCategory.id
                        categoryMode = "normal"
                    }
                }
            }

            try {
                //only move category when not the same.
                if (channel.parentId != category) await utilities.timedAwait(channel.setParent(category,{lockPermissions:false}),2500,(err) => {
                    openticket.log("Failed to change channel category on ticket move","error")
                })
                ticket.get("openticket:category-mode").value = categoryMode
                ticket.get("openticket:category").value = category
            }catch(e){
                openticket.log("Unable to move ticket to 'moved category'!","error",[
                    {key:"channel",value:"#"+channel.name},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"categoryid",value:category ?? "/"}
                ])
                openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
            }

            //handle permissions
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel","SendMessages","ReadMessageHistory"]
            }]
            const globalAdmins = openticket.configs.get("openticket:general").data.globalAdmins
            const optionAdmins = ticket.option.get("openticket:admins").value
            const readonlyAdmins = ticket.option.get("openticket:admins-readonly").value

            globalAdmins.forEach((admin) => {
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory","ManageMessages"],
                    deny:[]
                })
            })
            optionAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory","ManageMessages"],
                    deny:[]
                })
            })
            readonlyAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                if (optionAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel","ReadMessageHistory"],
                    deny:["SendMessages","AddReactions","AttachFiles","SendPolls"]
                })
            })
            //transfer all old user-participants over to the new ticket (creator & participants)
            ticket.get("openticket:participants").value.forEach((p) => {
                if (p.type == "user") permissions.push({
                    type:discord.OverwriteType.Member,
                    id:p.id,
                    allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory"],
                    deny:[]
                })
            })
            try{
                await channel.permissionOverwrites.set(permissions)
            }catch{
                openticket.log("Failed to reset channel permissions on ticket move!","error")
            }

            //handle participants
            const participants: {type:"role"|"user",id:string}[] = []
            permissions.forEach((permission,index) => {
                if (index == 0) return //don't include @everyone
                const type = (permission.type == discord.OverwriteType.Role) ? "role" : "user"
                const id = permission.id as string
                participants.push({type,id})
            })
            ticket.get("openticket:participants").value = participants
            ticket.get("openticket:participants").refreshDatabase()

            //rename channel (and give error when crashed)
            const originalName = channel.name
            try{
                await utilities.timedAwait(channel.setName(channelName),2500,(err) => {
                    openticket.log("Failed to rename channel on ticket move","error")
                })
            }catch(err){
                await channel.send((await openticket.builders.messages.getSafe("openticket:error-channel-rename").build("ticket-move",{guild,channel,user,originalName,newName:channelName})).message)
            }
            try{
                if (channel.type == discord.ChannelType.GuildText) channel.setTopic(channelDescription)
            }catch{}

            //update ticket message
            const ticketMessage = await openticket.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    openticket.log("Unable to edit ticket message on ticket renaming!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await openticket.builders.messages.getSafe("openticket:move-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("openticket:busy").value = false
            await openticket.events.get("afterTicketMoved").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.moving.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"move",reason,additionalData:data}))
            }

            //to dm
            const creator = await openticket.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.moving.dm) await openticket.client.sendUserDm(creator,await openticket.builders.messages.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"move",reason,additionalData:data}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            openticket.log(user.displayName+" moved a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    openticket.actions.get("openticket:move-ticket").workers.backupWorker = new api.ODWorker("openticket:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("openticket:busy").value = false
    })
}