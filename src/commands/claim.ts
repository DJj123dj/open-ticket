///////////////////////////////////////
//CLAIM COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //CLAIM COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:claim",generalConfig.data.prefix,"claim"))
    opendiscord.responders.commands.get("opendiscord:claim").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.claim

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:claim",0,async (instance,params,source,cancel) => {
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
            //return when already claimed
            if (ticket.get("opendiscord:claimed").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.claim"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const claimUser = instance.options.getUser("user",false) ?? user
            const reason = instance.options.getString("reason",false)

            //start claiming ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:claim-ticket").run(source,{guild,channel,user:claimUser,ticket,reason,sendMessage:false})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build(source,{guild,channel,user:claimUser,ticket,reason}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'claim' command!","info",[
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
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:claim-ticket",/^od:claim-ticket/))
    opendiscord.responders.buttons.get("opendiscord:claim-ticket").workers.add(
        new api.ODWorker("opendiscord:claim-ticket",0,async (instance,params,source,cancel) => {
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "ticket-message" && originalSource != "unclaim-message") return
            
            if (originalSource == "ticket-message") await opendiscord.verifybars.get("opendiscord:claim-ticket-ticket-message").activate(instance)
            else await opendiscord.verifybars.get("opendiscord:claim-ticket-unclaim-message").activate(instance)
        })
    )
}

export const registerModalResponders = async () => {
    //CLAIM WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:claim-ticket-reason",/^od:claim-ticket-reason_/))
    opendiscord.responders.modals.get("opendiscord:claim-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:claim-ticket-reason",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!channel) return
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel,user:instance.user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(instance.interaction.customId.split("_")[1])
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }

            const originalSource = instance.interaction.customId.split("_")[2] as ("ticket-message"|"unclaim-message"|"other")
            const reason = instance.values.getTextField("reason",true)

            //claim with reason
            if (originalSource == "ticket-message"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }else if (originalSource == "unclaim-message"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "other"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:claim-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
            }
            
        })
    ])
}