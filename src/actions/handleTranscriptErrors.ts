///////////////////////////////////////
//TRANSCRIPT ERROR SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities, openticketUtils} from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerButtonResponders(){
    //TRANSCRIPT ERROR RETRY
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:transcript-error-retry",/^od:transcript-error-retry_([^_]+)/))
    opendiscord.responders.buttons.get("opendiscord:transcript-error-retry").workers.add([
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user,member} = instance
            await instance.defer("update",false)
            
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance,origin,"delete")
            if (!hasPerms) return cancel()
            
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()
            
            const ticket = await openticketUtils.replyIsTicket(instance,origin)
            if (!ticket) return cancel()
            
            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance,origin,ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const originalOrigin = instance.interaction.customId.split("_")[1] as api.ODActionManagerIdMappings["opendiscord:delete-ticket"]["origin"]
            
            //start deleting ticket (without reason)
            //don't await DELETE action => else it will update the message after the channel has been deleted
            opendiscord.actions.get("opendiscord:delete-ticket").run(originalOrigin,{guild,channel,user,ticket,reason:"Transcript Error (Retried)",sendMessage:false,withoutTranscript:false})
            
            ticket.get("opendiscord:for-deletion").value = true //disable ticket message buttons
            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("other",{guild,channel,user,ticket,reason:"Transcript Error (Retried)"}))
        }),
        new api.ODWorker("opendiscord:logs",-1,async (instance,params,origin,cancel) => {
            const {user,channel} = instance
            if (channel.isDMBased()) return
            opendiscord.log(user.displayName+" retried deleting a ticket with transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"method",value:origin}
            ])
        })
    ])

    //TRANSCRIPT ERROR CONTINUE
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:transcript-error-continue",/^od:transcript-error-continue_([^_]+)/))
    opendiscord.responders.buttons.get("opendiscord:transcript-error-continue").workers.add([
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user} = instance
            await instance.defer("update",false)
            
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance,origin,"delete")
            if (!hasPerms) return cancel()
            
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()
            
            const ticket = await openticketUtils.replyIsTicket(instance,origin)
            if (!ticket) return cancel()
            
            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance,origin,ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const originalOrigin = instance.interaction.customId.split("_")[1] as api.ODActionManagerIdMappings["opendiscord:delete-ticket"]["origin"]

            //start deleting ticket (without reason & without transcript)
            //don't await DELETE action => else it will update the message after the channel has been deleted
            opendiscord.actions.get("opendiscord:delete-ticket").run(originalOrigin,{guild,channel,user,ticket,reason:"Transcript Error (Continued)",sendMessage:false,withoutTranscript:true})

            ticket.get("opendiscord:for-deletion").value = true //disable ticket message buttons
            await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build("other",{guild,channel,user,ticket,reason:"Transcript Error (Continued)"}))
        
        }),
        new api.ODWorker("opendiscord:logs",-1,async (instance,params,origin,cancel) => {
            const {user,channel} = instance
            if (channel.isDMBased()) return
            opendiscord.log(user.displayName+" continued deleting a ticket without transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"method",value:origin}
            ])
        })
    ])
}