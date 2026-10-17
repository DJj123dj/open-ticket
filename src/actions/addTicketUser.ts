///////////////////////////////////////
//TICKET ADD USER SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:add-ticket-user"))
    opendiscord.actions.get("opendiscord:add-ticket-user").workers.add([
        new api.ODWorker("opendiscord:add-ticket-user", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to add user to ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketUserAdd").emit([ticket, user, data, channel, reason])

            //update ticket
            ticket.get("opendiscord:participants").value.push({type:"user", id:data.id})
            ticket.get("opendiscord:participants").refreshDatabase()
            ticket.get("opendiscord:busy").value = true

            //update channel permissions
            try {
                await channel.permissionOverwrites.create(data, {
                    ViewChannel:true,
                    SendMessages:true,
                    AddReactions:true,
                    AttachFiles:true,
                    SendPolls:true,
                    ReadMessageHistory:true
                })
            }catch {
                opendiscord.log("Failed to add channel permission overwrites on add-ticket-user", "error")
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:add-message").build(origin, {guild, channel, user, ticket, reason, data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketUserAdded").emit([ticket, user, data, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.adding.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"add", reason, additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.adding.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"add", reason, additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, data} = params

            opendiscord.log(user.displayName + " added " + data.displayName + " to a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:add-ticket-user").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}