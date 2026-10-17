///////////////////////////////////////
//TICKET REMOVE USER SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:remove-ticket-user"))
    opendiscord.actions.get("opendiscord:remove-ticket-user").workers.add([
        new api.ODWorker("opendiscord:remove-ticket-user", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to remove user from ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketUserRemove").emit([ticket, user, data, channel, reason])

            //update ticket
            const index = ticket.get("opendiscord:participants").value.findIndex((p) => p.type === "user" && p.id === data.id)
            if (index < 0) return cancel()
            ticket.get("opendiscord:participants").value.splice(index, 1)
            ticket.get("opendiscord:participants").refreshDatabase()
            ticket.get("opendiscord:busy").value = true

            //update channel permissions
            try {
                await channel.permissionOverwrites.delete(data)
            }catch {
                opendiscord.log("Failed to remove channel permission overwrites on remove-ticket-user", "error")
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:remove-message").build(origin, {guild, channel, user, ticket, reason, data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketUserRemoved").emit([ticket, user, data, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.removing.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"remove", reason, additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.removing.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"remove", reason, additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, data} = params

            opendiscord.log(user.displayName + " removed " + data.displayName + " from a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:remove-ticket-user").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}