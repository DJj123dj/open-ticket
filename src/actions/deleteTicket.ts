///////////////////////////////////////
//TICKET DELETION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:delete-ticket"))
    opendiscord.actions.get("opendiscord:delete-ticket").workers.add([
        new api.ODWorker("opendiscord:delete-ticket",3,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to delete ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketDelete").emit([ticket,user,channel,reason])

            //update ticket
            ticket.get("opendiscord:for-deletion").value = true
            ticket.get("opendiscord:busy").value = true

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket deletion!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(source,{guild,channel,user,ticket,reason})).message)
        
            //create transcript
            if (!params.withoutTranscript){
                const transcriptRes = await opendiscord.actions.get("opendiscord:create-transcript").run(source,{guild,channel,user,ticket})
                //transcript failure
                if (typeof transcriptRes.success == "boolean" && !transcriptRes.success && transcriptRes.compiler){
                    const {compiler} = transcriptRes
                    await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:transcript-error").build(source,{guild,channel,user,ticket,compiler,reason:transcriptRes.errorReason ?? null})).message)
                        .catch((reason) => opendiscord.log("Unable to send transcript failure to ticket channel!","error",[{key:"id",value:channel.id}]))
                
                    //undo deletion
                    ticket.get("opendiscord:for-deletion").value = false
                    ticket.get("opendiscord:busy").value = false
                    opendiscord.log("Canceled ticket deletion because of transcript system malfunction!","warning",[
                        {key:"compiler",value:compiler.id.value},
                        {key:"reason",value:transcriptRes.errorReason ?? "/"},
                    ])
                    return cancel()
                }
            }

            //update stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:tickets-deleted",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:tickets-deleted",user.id,1,"increase")

            //delete ticket from manager
            opendiscord.tickets.remove(ticket.id)

            //delete permissions from manager
            await (await import("../data/framework/permissionLoader.js")).removeTicketPermissions(ticket)
        }),
        new api.ODWorker("opendiscord:discord-logs",2,async (instance,params,source,cancel) => {
            //logs before channel deletion => channel might still be used in log embeds
            const {guild,channel,user,ticket,reason} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.deleting.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"delete",reason,additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.deleting.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"delete",reason,additionalData:null}))
        }),
        new api.ODWorker("opendiscord:delete-channel",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            //delete channel & events
            await opendiscord.events.get("onTicketChannelDeletion").emit([ticket,channel,user])
            await channel.delete("Ticket Deleted").catch((reason) => opendiscord.log("Unable to delete ticket channel!","error",[{key:"id",value:channel.id}]))
            await opendiscord.events.get("afterTicketChannelDeleted").emit([ticket,user])

            //delete permissions from manager
            await (await import("../data/framework/permissionLoader.js")).removeTicketPermissions(ticket)

            await opendiscord.events.get("afterTicketDeleted").emit([ticket,user,reason])
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            opendiscord.log(user.displayName+" deleted a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source},
                {key:"transcript",value:(!params.withoutTranscript).toString()},
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:delete-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
        params.ticket.get("opendiscord:for-deletion").value = false
    })
}

export const registerVerifyBars = async () => {
    //DELETE TICKET TICKET MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:delete-ticket-ticket-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-ticket-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:delete-ticket-ticket-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source,cancel) => {
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
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket
            if (params.data == "reason"){
                //delete with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:delete-ticket-reason").build("ticket-message",{guild,channel,user,ticket}))
            }else{
                //delete without reason
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run("ticket-message",{guild,channel,user,ticket,reason:null,sendMessage:true,withoutTranscript:(params.data == "no-transcript")})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("opendiscord:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:delete-ticket-ticket-message").failure.add([
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

    //DELETE TICKET CLOSE MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:delete-ticket-close-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-close-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:delete-ticket-close-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source,cancel) => {
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
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket
            if (params.data == "reason"){
                //delete with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:delete-ticket-reason").build("close-message",{guild,channel,user,ticket}))
            }else{
                //delete without reason
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run("close-message",{guild,channel,user,ticket,reason:null,sendMessage:false,withoutTranscript:(params.data == "no-transcript")})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("opendiscord:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("close-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:delete-ticket-close-message").failure.add([
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

    //DELETE TICKET REOPEN MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:delete-ticket-reopen-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-reopen-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:delete-ticket-reopen-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source,cancel) => {
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
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket
            if (params.data == "reason"){
                //delete with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:delete-ticket-reason").build("reopen-message",{guild,channel,user,ticket}))
            }else{
                //delete without reason
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run("reopen-message",{guild,channel,user,ticket,reason:null,sendMessage:false,withoutTranscript:(params.data == "no-transcript")})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("opendiscord:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("reopen-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:delete-ticket-reopen-message").failure.add([
        new api.ODWorker("opendiscord:back-to-reopen-message",0,async (instance,params,source,cancel) => {
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

            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("other",{guild,channel,user,ticket,reason}))
        })
    ])

    //DELETE TICKET AUTOCLOSE MESSAGE
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:delete-ticket-autoclose-message",opendiscord.builders.messages.getSafe("opendiscord:verifybar-autoclose-message"),!generalConfig.data.system.disableVerifyBars))
    opendiscord.verifybars.get("opendiscord:delete-ticket-autoclose-message").success.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source,cancel) => {
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
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket
            if (params.data == "reason"){
                //delete with reason
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:delete-ticket-reason").build("autoclose-message",{guild,channel,user,ticket}))
            }else{
                //delete without reason
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("opendiscord:delete-ticket").run("autoclose-message",{guild,channel,user,ticket,reason:null,sendMessage:false,withoutTranscript:(params.data == "no-transcript")})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("opendiscord:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("autoclose-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    opendiscord.verifybars.get("opendiscord:delete-ticket-autoclose-message").failure.add([
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
}