///////////////////////////////////////
//TICKET CLAIMING SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerActions = async () => {
    openticket.actions.add(new api.ODAction("openticket:claim-ticket"))
    openticket.actions.get("openticket:claim-ticket").workers.add([
        new api.ODWorker("openticket:claim-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to claim ticket! Open Ticket doesn't support threads!")

            await openticket.events.get("onTicketClaim").emit([ticket,user,channel,reason])
            
            //update ticket
            ticket.get("openticket:claimed").value = true
            ticket.get("openticket:claimed-by").value = user.id
            ticket.get("openticket:claimed-on").value = new Date().getTime()
            ticket.get("openticket:busy").value = true

            //update stats
            await openticket.stats.get("openticket:global").setStat("openticket:tickets-claimed",1,"increase")
            await openticket.stats.get("openticket:user").setStat("openticket:tickets-claimed",user.id,1,"increase")

            //update category
            const rawClaimCategory = ticket.option.get("openticket:channel-categories-claimed").value.find((c) => c.user == user.id)
            const claimCategory = (rawClaimCategory) ? rawClaimCategory.category : null
            if (claimCategory){
                try {
                    channel.setParent(claimCategory,{lockPermissions:false})
                    ticket.get("openticket:category-mode").value = "claimed"
                    ticket.get("openticket:category").value = claimCategory
                }catch(e){
                    openticket.log("Unable to move ticket to 'claimed category'!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"categoryid",value:claimCategory}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //update ticket message
            const ticketMessage = await openticket.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    openticket.log("Unable to edit ticket message on ticket claiming!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await openticket.builders.messages.getSafe("openticket:claim-message").build(source,{guild,channel,user,ticket,reason})).message)
            ticket.get("openticket:busy").value = false
            await openticket.events.get("afterTicketClaimed").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.claiming.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"claim",reason,additionalData:null}))
            }

            //to dm
            if (generalConfig.data.system.messages.claiming.dm) await openticket.client.sendUserDm(user,await openticket.builders.messages.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"claim",reason,additionalData:null}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            openticket.log(user.displayName+" claimed a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    openticket.actions.get("openticket:claim-ticket").workers.backupWorker = new api.ODWorker("openticket:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("openticket:busy").value = false
    })
}

export const registerVerifyBars = async () => {
    //CLAIM TICKET TICKET MESSAGE
    openticket.verifybars.add(new api.ODVerifyBar("openticket:claim-ticket-ticket-message",openticket.builders.messages.getSafe("openticket:verifybar-ticket-message"),!generalConfig.data.system.disableVerifyBars))
    openticket.verifybars.get("openticket:claim-ticket-ticket-message").success.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.claim

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
        new api.ODWorker("openticket:claim-ticket",0,async (instance,params,source,cancel) => {
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
            //return when already claimed
            if (ticket.get("openticket:claimed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.claim"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start claiming ticket
            if (params.data == "reason"){
                //claim with reason
                instance.modal(await openticket.builders.modals.getSafe("openticket:claim-ticket-reason").build("ticket-message",{guild,channel,user,ticket}))
            }else{
                //claim without reason
                await instance.defer("update",false)
                await openticket.actions.get("openticket:claim-ticket").run("ticket-message",{guild,channel,user,ticket,reason:null,sendMessage:true})
                await instance.update(await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
            }
        })
    ])
    openticket.verifybars.get("openticket:claim-ticket-ticket-message").failure.add([
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

    //CLAIM TICKET UNCLAIM MESSAGE
    openticket.verifybars.add(new api.ODVerifyBar("openticket:claim-ticket-unclaim-message",openticket.builders.messages.getSafe("openticket:verifybar-unclaim-message"),!generalConfig.data.system.disableVerifyBars))
    openticket.verifybars.get("openticket:claim-ticket-unclaim-message").success.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.claim

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
        new api.ODWorker("openticket:claim-ticket",0,async (instance,params,source,cancel) => {
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
            //return when already claimed
            if (ticket.get("openticket:claimed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.claim"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start claiming ticket
            if (params.data == "reason"){
                //claim with reason
                instance.modal(await openticket.builders.modals.getSafe("openticket:claim-ticket-reason").build("unclaim-message",{guild,channel,user,ticket}))
            }else{
                //claim without reason
                await instance.defer("update",false)
                await openticket.actions.get("openticket:claim-ticket").run("unclaim-message",{guild,channel,user,ticket,reason:null,sendMessage:false})
                await instance.update(await openticket.builders.messages.getSafe("openticket:claim-message").build("unclaim-message",{guild,channel,user,ticket,reason:null}))
            }
        })
    ])
    openticket.verifybars.get("openticket:claim-ticket-unclaim-message").failure.add([
        new api.ODWorker("openticket:back-to-unclaim-message",0,async (instance,params,source,cancel) => {
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

            await instance.update(await openticket.builders.messages.getSafe("openticket:unclaim-message").build("other",{guild,channel,user,ticket,reason}))
        })
    ])
}