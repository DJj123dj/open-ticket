///////////////////////////////////////
//TICKET REOPENING SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:reopen-ticket"))
    opendiscord.actions.get("opendiscord:reopen-ticket").workers.add([
        new api.ODWorker("opendiscord:reopen-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to reopen ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketReopen").emit([ticket,user,channel,reason])

            //update ticket
            ticket.get("opendiscord:closed").value = false
            ticket.get("opendiscord:open").value = true
            ticket.get("opendiscord:autoclosed").value = false
            ticket.get("opendiscord:closed-by").value = null
            ticket.get("opendiscord:closed-on").value = null
            ticket.get("opendiscord:busy").value = true

            //update stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:tickets-reopened",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:tickets-reopened",user.id,1,"increase")

            //update category
            const channelCategory = ticket.option.get("opendiscord:channel-category").value
            const channelBackupCategory = ticket.option.get("opendiscord:channel-category-backup").value
            if (channelCategory !== ""){
                //category enabled
                try {
                    const normalCategory = await opendiscord.client.fetchGuildCategoryChannel(guild,channelCategory)
                    if (!normalCategory){
                        //default category was not found
                        opendiscord.log("Ticket Reopening Error: Unable to find category! #1","error",[
                            {key:"categoryid",value:channelCategory},
                            {key:"backup",value:"false"}
                        ])
                    }else{
                        //default category was found
                        if (normalCategory.children.cache.size >= 49 && channelBackupCategory != ""){
                            //use backup category
                            const backupCategory = await opendiscord.client.fetchGuildCategoryChannel(guild,channelBackupCategory)
                            if (!backupCategory){
                                //default category was not found
                                opendiscord.log("Ticket Reopening Error: Unable to find category! #2","error",[
                                    {key:"categoryid",value:channelBackupCategory},
                                    {key:"backup",value:"true"}
                                ])
                            }else{
                                //use backup category
                                channel.setParent(backupCategory,{lockPermissions:false})
                                ticket.get("opendiscord:category-mode").value = "backup"
                                ticket.get("opendiscord:category").value = backupCategory.id
                            }
                        }else{
                            //use default category
                            channel.setParent(normalCategory,{lockPermissions:false})
                            ticket.get("opendiscord:category-mode").value = "normal"
                            ticket.get("opendiscord:category").value = normalCategory.id
                        }
                    }
                }catch(e){
                    opendiscord.log("Unable to move ticket to 'reopened category'!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }else{
                channel.setParent(null,{lockPermissions:false})
                ticket.get("opendiscord:category-mode").value = null
                ticket.get("opendiscord:category").value = null
            }

            //update permissions
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
            ticket.get("opendiscord:participants").value.forEach((participant) => {
                //all participants that aren't roles/admins
                if (participant.type == "user"){
                    permissions.push({
                        type:discord.OverwriteType.Member,
                        id:participant.id,
                        allow:["ViewChannel","SendMessages","AddReactions","AttachFiles","SendPolls","ReadMessageHistory"],
                        deny:[]
                    })
                }
            })
            channel.permissionOverwrites.set(permissions)

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket reopening!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build(source,{guild,channel,user,ticket,reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketReopened").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.reopening.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"reopen",reason,additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.reopening.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"reopen",reason,additionalData:null}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            opendiscord.log(user.displayName+" reopened a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerVerifyBars = async () => {
    //REOPEN TICKET TICKET MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:reopen-ticket-ticket-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-ticket-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:reopen-ticket-ticket-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("opendiscord:closed").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:reopen-ticket-reason").build("ticket-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run("ticket-message",{guild,channel,user,ticket,reason:null,sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:reopen-ticket-ticket-message").failure.add([
        new api.ODWorker("opendiscord:back-to-ticket-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
        })
    ])

    //REOPEN TICKET CLOSE MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:reopen-ticket-close-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-close-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:reopen-ticket-close-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("opendiscord:closed").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:reopen-ticket-reason").build("close-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run("close-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("close-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:reopen-ticket-close-message").failure.add([
        new api.ODWorker("opendiscord:back-to-close-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const {verifybarMessage} = params
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            const rawReason = (verifybarMessage && verifybarMessage.embeds[0] && verifybarMessage.embeds[0].fields[0]) ? verifybarMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build("other",{guild,channel,user,ticket,reason}))
        })
    ])

    //REOPEN TICKET AUTOCLOSE MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:reopen-ticket-autoclose-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-autoclose-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:reopen-ticket-autoclose-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("opendiscord:closed").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:reopen-ticket-reason").build("autoclose-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run("autoclose-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("autoclose-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:reopen-ticket-autoclose-message").failure.add([
        new api.ODWorker("opendiscord:back-to-autoclose-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const {verifybarMessage} = params
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:autoclose-message").build("other",{guild,channel,user,ticket}))
        })
    ])
    opendiscord.actions.get("opendiscord:reopen-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}