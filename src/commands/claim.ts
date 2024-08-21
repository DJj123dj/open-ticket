///////////////////////////////////////
//CLAIM COMMAND
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //CLAIM COMMAND RESPONDER
    openticket.responders.commands.add(new api.ODCommandResponder("openticket:claim",generalConfig.data.prefix,"claim"))
    openticket.responders.commands.get("openticket:claim").workers.add([
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
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await openticket.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:claim",0,async (instance,params,source,cancel) => {
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

            const claimUser = instance.options.getUser("user",false) ?? user
            const reason = instance.options.getString("reason",false)

            //start claiming ticket
            await instance.defer(false)
            await openticket.actions.get("openticket:claim-ticket").run(source,{guild,channel,user:claimUser,ticket,reason,sendMessage:false})
            await instance.reply(await openticket.builders.messages.getSafe("openticket:claim-message").build(source,{guild,channel,user:claimUser,ticket,reason}))
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            openticket.log(instance.user.displayName+" used the 'claim' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //CLAIM TICKET BUTTON RESPONDER
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:claim-ticket",/^od:claim-ticket/))
    openticket.responders.buttons.get("openticket:claim-ticket").workers.add(
        new api.ODWorker("openticket:claim-ticket",0,async (instance,params,source,cancel) => {
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "ticket-message" && originalSource != "unclaim-message") return
            
            if (originalSource == "ticket-message") await openticket.verifybars.get("openticket:claim-ticket-ticket-message").activate(instance)
            else await openticket.verifybars.get("openticket:claim-ticket-unclaim-message").activate(instance)
        })
    )
}

export const registerModalResponders = async () => {
    //CLAIM WITH REASON MODAL RESPONDER
    openticket.responders.modals.add(new api.ODModalResponder("openticket:claim-ticket-reason",/^od:claim-ticket-reason_/))
    openticket.responders.modals.get("openticket:claim-ticket-reason").workers.add([
        new api.ODWorker("openticket:claim-ticket-reason",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!channel) return
            if (!guild){
                //error
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build(source,{channel,user:instance.user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(instance.interaction.customId.split("_")[1])
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }

            const originalSource = instance.interaction.customId.split("_")[2] as ("ticket-message"|"unclaim-message"|"other")
            const reason = instance.values.getTextField("reason",true)

            //claim with reason
            if (originalSource == "ticket-message"){
                await instance.defer("update",false)
                await openticket.actions.get("openticket:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
                await instance.update(await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
            }else if (originalSource == "unclaim-message"){
                await instance.defer("update",false)
                await openticket.actions.get("openticket:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false})
                await instance.update(await openticket.builders.messages.getSafe("openticket:claim-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "other"){
                await instance.defer("update",false)
                await openticket.actions.get("openticket:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
            }
            
        })
    ])
}