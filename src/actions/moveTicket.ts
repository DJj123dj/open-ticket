///////////////////////////////////////
//TICKET MOVING SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:move-ticket"))
    opendiscord.actions.get("opendiscord:move-ticket").workers.add([
        new api.ODWorker("opendiscord:move-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to move ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketMove").emit([ticket,user,channel,reason])
            ticket.option = data

            //update stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:tickets-moved",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:tickets-moved",user.id,1,"increase")

            //get new channel properties
            const channelPrefix = ticket.option.get("opendiscord:channel-prefix").value
            const channelSuffix = ticket.get("opendiscord:channel-suffix").value
            const channelCategory = ticket.option.get("opendiscord:channel-category").value
            const channelBackupCategory = ticket.option.get("opendiscord:channel-category-backup").value
            const rawClaimCategory = ticket.option.get("opendiscord:channel-categories-claimed").value.find((c) => c.user == user.id)
            const claimCategory = (rawClaimCategory) ? rawClaimCategory.category : null
            const closeCategory = ticket.option.get("opendiscord:channel-category-closed").value
            const channelDescription = ticket.option.get("opendiscord:channel-description").value
            const channelName = channelPrefix+channelSuffix

            //handle category
            let category: string|null = null
            let categoryMode: "backup"|"normal"|"closed"|"claimed"|null = null
            if (claimCategory){
                //use claim category
                category = claimCategory
                categoryMode = "claimed"
            }else if (closeCategory != "" && ticket.get("opendiscord:closed").value){
                //use close category
                category = closeCategory
                categoryMode = "closed"
            }else if (channelCategory != ""){
                //category enabled
                const normalCategory = await opendiscord.client.fetchGuildCategoryChannel(guild,channelCategory)
                if (!normalCategory){
                    //default category was not found
                    opendiscord.log("Ticket Move Error: Unable to find category! #1","error",[
                        {key:"categoryid",value:channelCategory},
                        {key:"backup",value:"false"}
                    ])
                }else{
                    //default category was found
                    if (normalCategory.children.cache.size >= 50 && channelBackupCategory != ""){
                        //use backup category
                        const backupCategory = await opendiscord.client.fetchGuildCategoryChannel(guild,channelBackupCategory)
                        if (!backupCategory){
                            //default category was not found
                            opendiscord.log("Ticket Move Error: Unable to find category! #2","error",[
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
                    opendiscord.log("Failed to change channel category on ticket move","error")
                })
                ticket.get("opendiscord:category-mode").value = categoryMode
                ticket.get("opendiscord:category").value = category
            }catch(e){
                opendiscord.log("Unable to move ticket to 'moved category'!","error",[
                    {key:"channel",value:"#"+channel.name},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"categoryid",value:category ?? "/"}
                ])
                opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
            }

            //handle permissions
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel","SendMessages","ReadMessageHistory"]
            }]
            const globalAdmins = opendiscord.configs.get("opendiscord:general").data.globalAdmins
            const optionAdmins = ticket.option.get("opendiscord:admins").value
            const readonlyAdmins = ticket.option.get("opendiscord:admins-readonly").value

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
            ticket.get("opendiscord:participants").value.forEach((p) => {
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
                opendiscord.log("Failed to reset channel permissions on ticket move!","error")
            }

            //handle participants
            const participants: {type:"role"|"user",id:string}[] = []
            permissions.forEach((permission,index) => {
                if (index == 0) return //don't include @everyone
                const type = (permission.type == discord.OverwriteType.Role) ? "role" : "user"
                const id = permission.id as string
                participants.push({type,id})
            })
            ticket.get("opendiscord:participants").value = participants
            ticket.get("opendiscord:participants").refreshDatabase()

            //rename channel (and give error when crashed)
            const originalName = channel.name
            try{
                await utilities.timedAwait(channel.setName(channelName),2500,(err) => {
                    opendiscord.log("Failed to rename channel on ticket move","error")
                })
            }catch(err){
                await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-move",{guild,channel,user,originalName,newName:channelName})).message)
            }
            try{
                if (channel.type == discord.ChannelType.GuildText) channel.setTopic(channelDescription)
            }catch{}

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket renaming!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:move-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketMoved").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.moving.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"move",reason,additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.moving.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"move",reason,additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            opendiscord.log(user.displayName+" moved a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:move-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}