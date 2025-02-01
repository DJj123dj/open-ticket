///////////////////////////////////////
//TICKET UNPINNING SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:unpin-ticket"))
    opendiscord.actions.get("opendiscord:unpin-ticket").workers.add([
        new api.ODWorker("opendiscord:unpin-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to unpin ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketUnpin").emit([ticket,user,channel,reason])
            
            //update ticket
            ticket.get("opendiscord:pinned").value = false
            ticket.get("opendiscord:pinned-by").value = null
            ticket.get("opendiscord:pinned-on").value = null
            ticket.get("opendiscord:busy").value = true

            //rename channel (and give error when crashed)
            const originalName = channel.name
            if (originalName.startsWith("📌")){
                const newName = originalName.replace("📌","");
                try{
                    await utilities.timedAwait(channel.setName(newName),2500,(err) => {
                        opendiscord.log("Failed to rename channel on ticket unpin","error")
                    })
                }catch(err){
                    await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-unpin",{guild,channel,user,originalName,newName})).message)
                }
            }

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket unpinning!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:unpin-message").build(source,{guild,channel,user,ticket,reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketUnpinned").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.pinning.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"unpin",reason,additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.pinning.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"unpin",reason,additionalData:null}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            opendiscord.log(user.displayName+" unpinned a ticket!","info",[
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
    //UNPIN TICKET TICKET MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:unpin-ticket-ticket-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-ticket-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:unpin-ticket-ticket-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.unpin

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
        new api.ODWorker("opendiscord:unpin-ticket",0,async (instance,params,source,cancel) => {
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
            //return when not pinned
            if (!ticket.get("opendiscord:pinned").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.unpin"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start unpining ticket
            if (params.data == "reason"){
                //unpin with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:unpin-ticket-reason").build("ticket-message",{guild,channel,user,ticket}))
            }else{
                //unpin without reason
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:unpin-ticket").run("ticket-message",{guild,channel,user,ticket,reason:null,sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:unpin-ticket-ticket-message").failure.add([
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

    //UNPIN TICKET PIN MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:unpin-ticket-pin-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-pin-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:unpin-ticket-pin-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.unpin

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
        new api.ODWorker("opendiscord:unpin-ticket",0,async (instance,params,source,cancel) => {
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
            //return when not pinned
            if (!ticket.get("opendiscord:pinned").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.unpin"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start unpinning ticket
            if (params.data == "reason"){
                //unpin with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:unpin-ticket-reason").build("pin-message",{guild,channel,user,ticket}))
            }else{
                //unpin without reason
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:unpin-ticket").run("pin-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:unpin-message").build("pin-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:unpin-ticket-pin-message").failure.add([
        new api.ODWorker("opendiscord:back-to-pin-message",0,async (instance,params,source,cancel) => {
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

            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:pin-message").build("other",{guild,channel,user,ticket,reason}))
        })
    ])
    opendiscord.actions.get("opendiscord:unpin-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}