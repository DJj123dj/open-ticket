///////////////////////////////////////
//TICKET RENAMING SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerActions = async () => {
    openticket.actions.add(new api.ODAction("openticket:rename-ticket"))
    openticket.actions.get("openticket:rename-ticket").workers.add([
        new api.ODWorker("openticket:rename-ticket",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to rename ticket! Open Ticket doesn't support threads!")

            await openticket.events.get("onTicketRename").emit([ticket,user,channel,reason])

            //rename channel (and give error when crashed)
            const originalName = channel.name
            try{
                await utilities.timedAwait(channel.setName(data),2500,(err) => {
                    openticket.log("Failed to rename channel on ticket rename","error")
                })
            }catch(err){
                await channel.send((await openticket.builders.messages.getSafe("openticket:error-channel-rename").build("ticket-rename",{guild,channel,user,originalName,newName:data})).message)
            }

            //update ticket message
            const ticketMessage = await openticket.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    openticket.log("Unable to edit ticket message on ticket renaming!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await openticket.builders.messages.getSafe("openticket:rename-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("openticket:busy").value = false
            await openticket.events.get("afterTicketRenamed").emit([ticket,user,channel,reason])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.renaming.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"rename",reason,additionalData:data}))
            }

            //to dm
            const creator = await openticket.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.renaming.dm) await openticket.client.sendUserDm(creator,await openticket.builders.messages.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"rename",reason,additionalData:data}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket} = params

            openticket.log(user.displayName+" renamed a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    openticket.actions.get("openticket:rename-ticket").workers.backupWorker = new api.ODWorker("openticket:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("openticket:busy").value = false
    })
}