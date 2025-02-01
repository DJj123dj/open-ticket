///////////////////////////////////////
//REOPEN COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //REOPEN COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:reopen",generalConfig.data.prefix,"reopen"))
    opendiscord.responders.commands.get("opendiscord:reopen").workers.add([
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
        new api.ODWorker("opendiscord:reopen",0,async (instance,params,source,cancel) => {
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

            const reason = instance.options.getString("reason",false)

            //start reopening ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:reopen-ticket").run(source,{guild,channel,user,ticket,reason,sendMessage:false})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build(source,{guild,channel,user,ticket,reason}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'reopen' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //REOPEN TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:reopen-ticket",/^od:reopen-ticket/))
    opendiscord.responders.buttons.get("opendiscord:reopen-ticket").workers.add(
        new api.ODWorker("opendiscord:reopen-ticket",0,async (instance,params,source,cancel) => {
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "ticket-message" && originalSource != "close-message" && originalSource != "autoclose-message") return
            
            if (originalSource == "ticket-message") await opendiscord.verifybars.get("opendiscord:reopen-ticket-ticket-message").activate(instance)
            else if (originalSource == "close-message") await opendiscord.verifybars.get("opendiscord:reopen-ticket-close-message").activate(instance)
            else await opendiscord.verifybars.get("opendiscord:reopen-ticket-autoclose-message").activate(instance)
        })
    )
}

export const registerModalResponders = async () => {
    //REOPEN WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:reopen-ticket-reason",/^od:reopen-ticket-reason_/))
    opendiscord.responders.modals.get("opendiscord:reopen-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:reopen-ticket-reason",0,async (instance,params,source,cancel) => {
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

            const originalSource = instance.interaction.customId.split("_")[2] as ("ticket-message"|"close-message"|"autoclose-message"|"other")
            const reason = instance.values.getTextField("reason",true)

            //reopen with reason
            if (originalSource == "ticket-message"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket}))
            }else if (originalSource == "close-message"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "autoclose-message"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "other"){
                await instance.defer("update",false)
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true})
            }
            
        })
    ])
}