///////////////////////////////////////
//TICKET CREATION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:create-ticket"))
    opendiscord.actions.get("opendiscord:create-ticket").workers.add([
        new api.ODWorker("opendiscord:create-ticket",3,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params

            await opendiscord.events.get("onTicketCreate").emit([user])
            await opendiscord.events.get("onTicketChannelCreation").emit([option,user])

            //get channel properties
            const channelPrefix = option.get("opendiscord:channel-prefix").value
            const channelCategory = option.get("opendiscord:channel-category").value
            const channelBackupCategory = option.get("opendiscord:channel-category-backup").value
            const channelDescription = option.get("opendiscord:channel-description").value
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
            const globalAdmins = opendiscord.configs.get("opendiscord:general").data.globalAdmins
            const optionAdmins = option.get("opendiscord:admins").value
            const readonlyAdmins = option.get("opendiscord:admins-readonly").value

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
                new api.ODTicketData("opendiscord:busy",false),
                new api.ODTicketData("opendiscord:ticket-message",null),
                new api.ODTicketData("opendiscord:participants",participants),
                new api.ODTicketData("opendiscord:channel-suffix",channelSuffix),
                
                new api.ODTicketData("opendiscord:open",true),
                new api.ODTicketData("opendiscord:opened-by",user.id),
                new api.ODTicketData("opendiscord:opened-on",new Date().getTime()),
                new api.ODTicketData("opendiscord:closed",false),
                new api.ODTicketData("opendiscord:closed-by",null),
                new api.ODTicketData("opendiscord:closed-on",null),
                new api.ODTicketData("opendiscord:claimed",false),
                new api.ODTicketData("opendiscord:claimed-by",null),
                new api.ODTicketData("opendiscord:claimed-on",null),
                new api.ODTicketData("opendiscord:pinned",false),
                new api.ODTicketData("opendiscord:pinned-by",null),
                new api.ODTicketData("opendiscord:pinned-on",null),
                new api.ODTicketData("opendiscord:for-deletion",false),

                new api.ODTicketData("opendiscord:category",category),
                new api.ODTicketData("opendiscord:category-mode",categoryMode),

                new api.ODTicketData("opendiscord:autoclose-enabled",option.get("opendiscord:autoclose-enable-hours").value),
                new api.ODTicketData("opendiscord:autoclose-hours",(option.get("opendiscord:autoclose-enable-hours").value ? option.get("opendiscord:autoclose-hours").value : 0)),
                new api.ODTicketData("opendiscord:autoclosed",false),
                new api.ODTicketData("opendiscord:autodelete-enabled",option.get("opendiscord:autodelete-enable-days").value),
                new api.ODTicketData("opendiscord:autodelete-days",(option.get("opendiscord:autodelete-enable-days").value ? option.get("opendiscord:autodelete-days").value : 0)),

                new api.ODTicketData("opendiscord:answers",answers)
            ])

            //manage stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:tickets-created",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:tickets-created",user.id,1,"increase")

            //manage bot permissions
            await opendiscord.events.get("onTicketPermissionsCreated").emit([option,opendiscord.permissions,channel,user])
            await (await import("../data/framework/permissionLoader.js")).addTicketPermissions(ticket)
            await opendiscord.events.get("afterTicketPermissionsCreated").emit([option,opendiscord.permissions,channel,user])

            //export channel & ticket
            instance.channel = channel
            instance.ticket = ticket
            opendiscord.tickets.add(ticket)
        }),
        new api.ODWorker("opendiscord:send-ticket-message",2,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params
            const {ticket,channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to send ticket message. Previous worker failed!","error")
            
            await opendiscord.events.get("onTicketMainMessageCreated").emit([ticket,channel,user])
            //check if ticket message is enabled
            if (!option.get("opendiscord:ticket-message-enabled").value) return
            try {
                const msg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build(source,{guild,channel,user,ticket})).message)
                
                ticket.get("opendiscord:ticket-message").value = msg.id
                
                //manage stats
                await opendiscord.stats.get("opendiscord:ticket").setStat("opendiscord:messages-sent",ticket.id.value,1,"increase")
                
                await opendiscord.events.get("afterTicketMainMessageCreated").emit([ticket,msg,channel,user])
        }catch(err){
                process.emit("uncaughtException",err)
                //something went wrong while sending the ticket message
                channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error").build("other",{guild,channel,user,error:"Ticket Message: Creation Error!\n=> Ticket Is Still Created Succesfully",layout:"advanced"})).message)
            }
            await opendiscord.events.get("afterTicketCreated").emit([ticket,user,channel])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,user,answers,option} = params
            const {ticket,channel} = instance

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.creation.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created-logs").build(source,{guild,channel,user,ticket}))
            }

            //to dm
            if (generalConfig.data.system.messages.creation.dm) await opendiscord.client.sendUserDm(user,await opendiscord.builders.messages.getSafe("opendiscord:ticket-created-dm").build(source,{guild,channel,user,ticket}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
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