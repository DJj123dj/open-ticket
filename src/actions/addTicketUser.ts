///////////////////////////////////////
//TICKET ADD USER SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:add-ticket-user"))
    opendiscord.actions.get("opendiscord:add-ticket-user").workers.add([
        new api.ODWorker("opendiscord:add-ticket-user",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to add user to ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketUserAdd").emit([ticket,user,data,channel,reason])
            
            //update ticket
            ticket.get("opendiscord:participants").value.push({type:"user",id:data.id})
            ticket.get("opendiscord:participants").refreshDatabase()
            ticket.get("opendiscord:busy").value = true

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
                opendiscord.log("Failed to add channel permission overwrites on add-ticket-user","error")
            }

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on ticket user adding!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value,hidden:true}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:add-message").build(source,{guild,channel,user,ticket,reason,data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketUserAdded").emit([ticket,user,data,channel,reason])
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,ticket,reason,data} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.adding.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(source,{guild,channel,user,ticket,mode:"add",reason,additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
            if (creator && generalConfig.data.system.messages.adding.dm) await opendiscord.client.sendUserDm(creator,await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(source,{guild,channel,user,ticket,mode:"add",reason,additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {guild,channel,user,ticket,data} = params

            opendiscord.log(user.displayName+" added "+data.displayName+" to a ticket!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"reason",value:params.reason ?? "/"},
                {key:"method",value:source}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:add-ticket-user").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy",0,(instance,params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}