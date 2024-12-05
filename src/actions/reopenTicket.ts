///////////////////////////////////////
//TICKET REOPENING SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerActions = async () => {
    openticket.actions.add(new api.ODAction("openticket:reopen-ticket"))
    openticket.actions.get("openticket:reopen-ticket").workers.add([
        new api.ODWorker("openticket:reopen-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to reopen ticket! Open Ticket doesn't support threads!")

            await openticket.events.get("onTicketReopen").emit([ticket,user,channel,reason])

            //update ticket
            ticket.get("openticket:closed").value = false
            ticket.get("openticket:open").value = true
            ticket.get("openticket:autoclosed").value = false
            ticket.get("openticket:closed-by").value = null
            ticket.get("openticket:closed-on").value = null
            ticket.get("openticket:busy").value = true

            //update stats
            await openticket.stats.get("openticket:global").setStat("openticket:tickets-reopened",1,"increase")
            await openticket.stats.get("openticket:user").setStat("openticket:tickets-reopened",user.id,1,"increase")

            //update category
            const channelCategory = ticket.option.get("openticket:channel-category").value
            const channelBackupCategory = ticket.option.get("openticket:channel-category-backup").value
            if (channelCategory !== ""){
                //category enabled
                try {
                    const normalCategory = await openticket.client.fetchGuildCategoryChannel(guild,channelCategory)
                    if (!normalCategory){
                        //default category was not found
                        openticket.log("Ticket Reopening Error: Unable to find category! #1","error",[
                            {key:"categoryid",value:channelCategory},
                            {key:"backup",value:"false"}
                        ])
                    }else{
                        //default category was found
                        if (normalCategory.children.cache.size >= 49 && channelBackupCategory != ""){
                            //use backup category
                            const backupCategory = await openticket.client.fetchGuildCategoryChannel(guild,channelBackupCategory)
                            if (!backupCategory){
                                //default category was not found
                                openticket.log("Ticket Reopening Error: Unable to find category! #2","error",[
                                    {key:"categoryid",value:channelBackupCategory},
                                    {key:"backup",value:"true"}
                                ])
                            }else{
                                //use backup category
                                channel.setParent(backupCategory,{lockPermissions:false})
                                ticket.get("openticket:category-mode").value = "backup"
                                ticket.get("openticket:category").value = backupCategory.id
                            }
                        }else{
                            //use default category
                            channel.setParent(normalCategory,{lockPermissions:false})
                            ticket.get("openticket:category-mode").value = "normal"
                            ticket.get("openticket:category").value = normalCategory.id
                        }
                    }
                }catch(e){
                    openticket.log("Unable to move ticket to 'reopened category'!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }else{
                channel.setParent(null,{lockPermissions:false})
                ticket.get("openticket:category-mode").value = null
                ticket.get("openticket:category").value = null
            }

            //update permissions
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
            ticket.get("openticket:participants").value.forEach((participant) => {
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
            const ticketMessage = await openticket.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    openticket.log("Unable to edit ticket message on ticket reopening!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            if (params.sendMessage) await channel.send((await openticket.builders.messages.getSafe("openticket:reopen-message").build(source,{guild,channel,user,ticket,reason})).message)
            ticket.get("openticket:busy").value = false
            await openticket.events.get("afterTicketReopened").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.reopening.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"reopen",reason,additionalData:null}))
            }

            //to dm
            if (generalConfig.data.system.messages.reopening.dm) await openticket.client.sendUserDm(user,await openticket.builders.messages.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"reopen",reason,additionalData:null}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            openticket.log(user.displayName+" reopened a ticket!","info",[
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
    openticket.verifybars.add(new api.ODVerifyBar("openticket:reopen-ticket-ticket-message",openticket.builders.messages.getSafe("openticket:verifybar-ticket-message"),!generalConfig.data.system.disableVerifyBars))
    openticket.verifybars.get("openticket:reopen-ticket-ticket-message").success.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!openticket.permissions.hasPermissions("support",await openticket.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await openticket.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("openticket:closed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await openticket.builders.modals.getSafe("openticket:reopen-ticket-reason").build("ticket-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await openticket.actions.get("openticket:reopen-ticket").run("ticket-message",{guild,channel,user,ticket,reason:null,sendMessage:true})
                await instance.update(await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
            }
        })
    ])
    openticket.verifybars.get("openticket:reopen-ticket-ticket-message").failure.add([
        new api.ODWorker("openticket:back-to-ticket-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            await instance.update(await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
        })
    ])

    //REOPEN TICKET CLOSE MESSAGE
    openticket.verifybars.add(new api.ODVerifyBar("openticket:reopen-ticket-close-message",openticket.builders.messages.getSafe("openticket:verifybar-close-message"),!generalConfig.data.system.disableVerifyBars))
    openticket.verifybars.get("openticket:reopen-ticket-close-message").success.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!openticket.permissions.hasPermissions("support",await openticket.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await openticket.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("openticket:closed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await openticket.builders.modals.getSafe("openticket:reopen-ticket-reason").build("close-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await openticket.actions.get("openticket:reopen-ticket").run("close-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await openticket.builders.messages.getSafe("openticket:reopen-message").build("close-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    openticket.verifybars.get("openticket:reopen-ticket-close-message").failure.add([
        new api.ODWorker("openticket:back-to-close-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const {verifybarMessage} = params
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            const rawReason = (verifybarMessage && verifybarMessage.embeds[0] && verifybarMessage.embeds[0].fields[0]) ? verifybarMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            await instance.update(await openticket.builders.messages.getSafe("openticket:close-message").build("other",{guild,channel,user,ticket,reason}))
        })
    ])

    //REOPEN TICKET AUTOCLOSE MESSAGE
    openticket.verifybars.add(new api.ODVerifyBar("openticket:reopen-ticket-autoclose-message",openticket.builders.messages.getSafe("openticket:verifybar-autoclose-message"),!generalConfig.data.system.disableVerifyBars))
    openticket.verifybars.get("openticket:reopen-ticket-autoclose-message").success.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.reopen

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!openticket.permissions.hasPermissions("support",await openticket.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await openticket.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:reopen-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when not closed
            if (!ticket.get("openticket:closed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.reopen"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start reopening ticket
            if (params.data == "reason"){
                //reopen with reason
                instance.modal(await openticket.builders.modals.getSafe("openticket:reopen-ticket-reason").build("autoclose-message",{guild,channel,user,ticket}))
            }else{
                //reopen without reason
                await instance.defer("update",false)
                await openticket.actions.get("openticket:reopen-ticket").run("autoclose-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await openticket.builders.messages.getSafe("openticket:reopen-message").build("autoclose-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    openticket.verifybars.get("openticket:reopen-ticket-autoclose-message").failure.add([
        new api.ODWorker("openticket:back-to-autoclose-message",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const {verifybarMessage} = params
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }

            await instance.update(await openticket.builders.messages.getSafe("openticket:autoclose-message").build("other",{guild,channel,user,ticket}))
        })
    ])
    openticket.actions.get("openticket:reopen-ticket").workers.backupWorker = new api.ODWorker("openticket:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("openticket:busy").value = false
    })
}