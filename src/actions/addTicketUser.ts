///////////////////////////////////////
//TICKET ADD USER SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerActions = async () => {
    openticket.actions.add(new api.ODAction("openticket:add-ticket-user"))
    openticket.actions.get("openticket:add-ticket-user").workers.add([
        new api.ODWorker("openticket:add-ticket-user",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to add user to ticket! Open Ticket doesn't support threads!")

            await openticket.events.get("onTicketUserAdd").emit([ticket,user,data,channel,reason])
            
            //update ticket
            ticket.get("openticket:participants").value.push({type:"user",id:data.id})
            ticket.get("openticket:participants").refreshDatabase()
            ticket.get("openticket:busy").value = true

            //update channel permissions
            try{
                await channel.permissionOverwrites.create(data,{
                    ViewChannel:true,
                    SendMessages:true,
                    AddReactions:true,
                    AttachFiles:true,
                    SendPolls:true,
                    ReadMessageHistory:true
                })
            }catch{
                openticket.log("Failed to add channel permission overwrites on add-ticket-user","error")
            }

            //update ticket message
            const ticketMessage = await openticket.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await openticket.builders.messages.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    openticket.log("Unable to edit ticket message on ticket user adding!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value,hidden:true}
                    ])
                    openticket.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await openticket.builders.messages.getSafe("openticket:add-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("openticket:busy").value = false
            await openticket.events.get("afterTicketUserAdded").emit([ticket,user,data,channel,reason])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.adding.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"add",reason,additionalData:data}))
            }

            //to dm
            if (generalConfig.data.system.messages.adding.dm) await openticket.client.sendUserDm(user,await openticket.builders.messages.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"add",reason,additionalData:data}))
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket,data} = params

            openticket.log(user.displayName+" added "+data.displayName+" to a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    openticket.actions.get("openticket:add-ticket-user").workers.backupWorker = new api.ODWorker("openticket:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("openticket:busy").value = false
    })
}