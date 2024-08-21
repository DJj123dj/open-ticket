///////////////////////////////////////
//TRANSCRIPT ERROR SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"

const generalConfig = openticket.configs.get("openticket:general")

export const registerButtonResponders = async () => {
    //TRANSCRIPT ERROR RETRY
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:transcript-error-retry",/^od:transcript-error-retry_([^_]+)/))
    openticket.responders.buttons.get("openticket:transcript-error-retry").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("openticket:delete-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "slash" && originalSource != "text" && originalSource != "ticket-message" && originalSource != "reopen-message" && originalSource != "close-message" && originalSource != "other") return
            
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket (without reason)
            await instance.defer("update",false)
            //don't await DELETE action => else it will update the message after the channel has been deleted
            openticket.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason:"Transcript Error (Retried)",sendMessage:false,withoutTranscript:false})
            //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
            ticket.get("openticket:for-deletion").value = true
            await instance.update(await openticket.builders.messages.getSafe("openticket:delete-message").build("other",{guild,channel,user,ticket,reason:"Transcript Error (Retried)"}))
        
        }),
        new api.ODWorker("openticket:logs",-1,async (instance,params,source,cancel) => {
            const {user,channel} = instance
            if (channel.isDMBased()) return
            openticket.log(user.displayName+" retried deleting a ticket with transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])

    //TRANSCRIPT ERROR CONTINUE
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:transcript-error-continue",/^od:transcript-error-continue_([^_]+)/))
    openticket.responders.buttons.get("openticket:transcript-error-continue").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.delete

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
        new api.ODWorker("openticket:delete-ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "slash" && originalSource != "text" && originalSource != "ticket-message" && originalSource != "reopen-message" && originalSource != "close-message" && originalSource != "other") return
            
            if (!guild){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            //start deleting ticket (without reason)
            await instance.defer("update",false)
            //don't await DELETE action => else it will update the message after the channel has been deleted
            openticket.actions.get("openticket:delete-ticket").run(originalSource,{guild,channel,user,ticket,reason:"Transcript Error (Continued)",sendMessage:false,withoutTranscript:true})
            //update ticket (for ticket message) => no-await doesn't wait for the action to set this variable
            ticket.get("openticket:for-deletion").value = true
            await instance.update(await openticket.builders.messages.getSafe("openticket:delete-message").build("other",{guild,channel,user,ticket,reason:"Transcript Error (Continued)"}))
        
        }),
        new api.ODWorker("openticket:logs",-1,async (instance,params,source,cancel) => {
            const {user,channel} = instance
            if (channel.isDMBased()) return
            openticket.log(user.displayName+" continued deleting a ticket without transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}