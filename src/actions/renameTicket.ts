///////////////////////////////////////
//TICKET RENAMING SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:rename-ticket"))
    opendiscord.actions.get("opendiscord:rename-ticket").workers.add([
        new api.ODWorker("opendiscord:rename-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to rename ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketRename").emit([ticket,user,channel,reason])

            //rename channel (and give error when crashed)
            const originalName = channel.name
            try{
                await utilities.timedAwait(channel.setName(data),2500,(err) => {
                    opendiscord.log("Failed to rename channel on ticket rename","error")
                })
            }catch(err){
                await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-rename",{guild,channel,user,originalName,newName:data})).message)
            }

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket renaming!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:rename-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketRenamed").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.renaming.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"rename",reason,additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.renaming.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"rename",reason,additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            opendiscord.log(user.displayName+" renamed a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:rename-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}