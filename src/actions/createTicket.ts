///////////////////////////////////////
//TICKET CREATION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("openticket:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("openticket:create-ticket"))
    opendiscord.actions.get("openticket:create-ticket").workers.add([
        new api.ODWorker("openticket:create-ticket",3,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params

            await opendiscord.events.get("onTicketCreate").emit([user])
            await opendiscord.events.get("onTicketChannelCreation").emit([option,user])

            //get channel properties
            const channelPrefix = option.get("openticket:channel-prefix").value
            const channelCategory = option.get("openticket:channel-category").value
            const channelBackupCategory = option.get("openticket:channel-category-backup").value
            const channelDescription = option.get("openticket:channel-description").value
            const channelSuffix = opendiscord.options.suffix.getSuffixFromOption(option,user)
            const channelName = channelPrefix+channelSuffix

            //handle category
            let category: string|null = null
            let categoryMode: "backup"|"normal"|null = null
            if (channelCategory != ""){
                //category enabled
                const normalCategory = await opendiscord.client.fetchGuildCategoryChannel(guild,channelCategory)
                if (!normalCategory){
                    //default category was not found
                    opendiscord.log("Ticket Creation Error: Unable to find category! #1","error",[
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
                            opendiscord.log("Ticket Creation Error: Unable to find category! #2","error",[
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

            //handle permissions
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel","SendMessages","ReadMessageHistory"]
            }]
            const globalAdmins = opendiscord.configs.get("openticket:general").data.globalAdmins
            const optionAdmins = option.get("openticket:admins").value
            const readonlyAdmins = option.get("openticket:admins-readonly").value

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
            permissions.push({
                type:discord.OverwriteType.Member,
                id:user.id,
                allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory"],
                deny:[]
            })
            
            //create channel
            const channel = await guild.channels.create({
                type:discord.ChannelType.GuildText,
                name:channelName,
                nsfw:false,
                topic:channelDescription,
                parent:category,
                reason:"Ticket Created By "+user.displayName,
                permissionOverwrites:permissions
            })

            await opendiscord.events.get("afterTicketChannelCreated").emit([option,channel,user])

            //create participants
            const participants: {type:"role"|"user",id:string}[] = []
            permissions.forEach((permission,index) => {
                if (index == 0) return //don't include @everyone
                const type = (permission.type == discord.OverwriteType.Role) ? "role" : "user"
                const id = permission.id as string
                participants.push({type,id})
            })

            //create ticket
            const ticket = new api.ODTicket(channel.id,option,[
                new api.ODTicketData("openticket:busy",false),
                new api.ODTicketData("openticket:ticket-message",null),
                new api.ODTicketData("openticket:participants",participants),
                new api.ODTicketData("openticket:channel-suffix",channelSuffix),
                
                new api.ODTicketData("openticket:open",true),
                new api.ODTicketData("openticket:opened-by",user.id),
                new api.ODTicketData("openticket:opened-on",new Date().getTime()),
                new api.ODTicketData("openticket:closed",false),
                new api.ODTicketData("openticket:closed-by",null),
                new api.ODTicketData("openticket:closed-on",null),
                new api.ODTicketData("openticket:claimed",false),
                new api.ODTicketData("openticket:claimed-by",null),
                new api.ODTicketData("openticket:claimed-on",null),
                new api.ODTicketData("openticket:pinned",false),
                new api.ODTicketData("openticket:pinned-by",null),
                new api.ODTicketData("openticket:pinned-on",null),
                new api.ODTicketData("openticket:for-deletion",false),

                new api.ODTicketData("openticket:category",category),
                new api.ODTicketData("openticket:category-mode",categoryMode),

                new api.ODTicketData("openticket:autoclose-enabled",option.get("openticket:autoclose-enable-hours").value),
                new api.ODTicketData("openticket:autoclose-hours",(option.get("openticket:autoclose-enable-hours").value ? option.get("openticket:autoclose-hours").value : 0)),
                new api.ODTicketData("openticket:autoclosed",false),
                new api.ODTicketData("openticket:autodelete-enabled",option.get("openticket:autodelete-enable-days").value),
                new api.ODTicketData("openticket:autodelete-days",(option.get("openticket:autodelete-enable-days").value ? option.get("openticket:autodelete-days").value : 0)),

                new api.ODTicketData("openticket:answers",answers)
            ])

            //manage stats
            await opendiscord.stats.get("openticket:global").setStat("openticket:tickets-created",1,"increase")
            await opendiscord.stats.get("openticket:user").setStat("openticket:tickets-created",user.id,1,"increase")

            //manage bot permissions
            await opendiscord.events.get("onTicketPermissionsCreated").emit([option,opendiscord.permissions,channel,user])
            await (await import("../data/framework/permissionLoader.js")).addTicketPermissions(ticket)
            await opendiscord.events.get("afterTicketPermissionsCreated").emit([option,opendiscord.permissions,channel,user])

            //export channel & ticket
            instance.channel = channel
            instance.ticket = ticket
            opendiscord.tickets.add(ticket)
        }),
        new api.ODWorker("openticket:send-ticket-message",2,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params
            const {ticket,channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to send ticket message. Previous worker failed!","error")
            
            await opendiscord.events.get("onTicketMainMessageCreated").emit([ticket,channel,user])
            //check if ticket message is enabled
            if (!option.get("openticket:ticket-message-enabled").value) return
            try {
                const msg = await channel.send((await opendiscord.builders.messages.getSafe("openticket:ticket-message").build(source,{guild,channel,user,ticket})).message)
                
                ticket.get("openticket:ticket-message").value = msg.id
                
                //manage stats
                await opendiscord.stats.get("openticket:ticket").setStat("openticket:messages-sent",ticket.id.value,1,"increase")
                
                await opendiscord.events.get("afterTicketMainMessageCreated").emit([ticket,msg,channel,user])
        }catch(err){
                process.emit("uncaughtException",err)
                //something went wrong while sending the ticket message
                channel.send((await opendiscord.builders.messages.getSafe("openticket:error").build("other",{guild,channel,user,error:"Ticket Message: Creation Error!\n=> Ticket Is Still Created Succesfully",layout:"advanced"})).message)
            }
            await opendiscord.events.get("afterTicketCreated").emit([ticket,user,channel])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params
            const {ticket,channel} = instance

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.creation.logs){
                const logChannel = opendiscord.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("openticket:ticket-created-logs").build(source,{guild,channel,user,ticket}))
            }

            //to dm
            if (generalConfig.data.system.messages.creation.dm) await opendiscord.client.sendUserDm(user,await opendiscord.builders.messages.getSafe("openticket:ticket-created-dm").build(source,{guild,channel,user,ticket}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,user,answers,option} = params
            const {ticket,channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to create logs. Previous worker failed!","error")

            opendiscord.log(user.displayName+" created a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"method",value:source},
                {key:"option",value:option.id.value}
            ])
        })
    ])
}