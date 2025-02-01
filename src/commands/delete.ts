///////////////////////////////////////
//DELETE COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //DELETE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("openticket:delete",generalConfig.data.prefix,"delete"))
    opendiscord.responders.commands.get("openticket:delete").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:delete",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const reason = instance.options.getString("reason",false)
            const withoutTranscript = instance.options.getBoolean("notranscript",false) ?? false

            //start deleting ticket
            await instance.defer(false)
            await instance.reply(await opendiscord.builders.messages.getSafe("openticket:delete-message").build(source,{guild,channel,user,ticket,reason}))
            await opendiscord.actions.get("openticket:delete-ticket").run(source,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript})
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'delete' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //DELETE TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("openticket:delete-ticket",/^od:delete-ticket/))
    opendiscord.responders.buttons.get("openticket:delete-ticket").workers.add(
        new api.ODWorker("openticket:delete-ticket",0,async (instance,params,source,cancel) => {
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "ticket-message" && originalSource != "reopen-message" && originalSource != "close-message" && originalSource != "autoclose-message") return
            
            if (originalSource == "ticket-message") await opendiscord.verifybars.get("openticket:delete-ticket-ticket-message").activate(instance)
            else if (originalSource == "close-message") await opendiscord.verifybars.get("openticket:delete-ticket-close-message").activate(instance)
            else if (originalSource == "reopen-message") await opendiscord.verifybars.get("openticket:delete-ticket-reopen-message").activate(instance)
            else if (originalSource == "autoclose-message") await opendiscord.verifybars.get("openticket:delete-ticket-autoclose-message").activate(instance)
        })
    )
}

export const registerModalResponders = async () => {
    //REOPEN WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("openticket:delete-ticket-reason",/^od:delete-ticket-reason_/))
    opendiscord.responders.modals.get("openticket:delete-ticket-reason").workers.add([
        new api.ODWorker("openticket:delete-ticket-reason",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!channel) return
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-not-in-guild").build(source,{channel,user:instance.user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(instance.interaction.customId.split("_")[1])
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }

            const originalSource = instance.interaction.customId.split("_")[2] as ("ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"other")
            const reason = instance.values.getTextField("reason",true)

            //delete with reason
            if (originalSource == "ticket-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true,withoutTranscript:false})
                //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
                ticket.get("openticket:for-deletion").value = true
                await instance.update(await opendiscord.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
            }else if (originalSource == "close-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("openticket:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "reopen-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("openticket:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "autoclose-message"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:false,withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("openticket:delete-message").build("other",{guild,channel,user,ticket,reason}))
            }else if (originalSource == "other"){
                await instance.defer("update",false)
                //don't await DELETE action => else it will update the message after the channel has been deleted
                opendiscord.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason,sendMessage:true,withoutTranscript:false})
            }
        })
    ])
}