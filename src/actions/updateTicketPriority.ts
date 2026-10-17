///////////////////////////////////////
//TICKET TOPIC SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:update-ticket-priority"))
    opendiscord.actions.get("opendiscord:update-ticket-priority").workers.add([
        new api.ODWorker("opendiscord:update-ticket-priority", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newPriority, reason} = params
            if (channel.isThread() || !(channel instanceof discord.TextChannel)) throw new api.ODSystemError("Unable to set priority of ticket! Open Ticket doesn't support threads!")

            const oldPriority = opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value)
            await opendiscord.events.get("onTicketPriorityChange").emit([ticket, user, channel, oldPriority, newPriority, reason])

            //update ticket
            ticket.get("opendiscord:busy").value = true
            if (newPriority) ticket.get("opendiscord:priority").value = newPriority.priority

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("priority-change", {guild, user, option:ticket.option, channel, ticket, currentChannelName:channel.name})
            if (channelNameResult && channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined"){
                const originalName = channel.name
                const newName = channelNameResult.newChannelName
                try {
                    await utilities.timedAwait(channel.setName(newName), 2500, (err) => {
                        opendiscord.log("Failed to rename channel on priority change", "error")
                    })
                }catch(err){
                    opendiscord.log("Unable to rename channel while updating ticket priority! Waiting until ratelimit expires...", "warning", [
                        {key:"oldName", value:originalName},
                        {key:"newName", value:newName}
                    ])
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-priority", {guild, channel, user, originalName, newName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                }
            }

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:priority-set").build(origin, {guild, channel, user, ticket, priority:newPriority, reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketPriorityChanged").emit([ticket, user, channel, oldPriority, newPriority, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, newPriority} = params

            const renderedPriority = newPriority.renderDisplayName()

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.priorityChange.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"priority", reason, additionalData:renderedPriority}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.priorityChange.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"priority", reason, additionalData:renderedPriority}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newPriority} = params

            opendiscord.log(user.displayName + " changed the priority of a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"priority", value:newPriority.id.value},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:update-ticket-priority").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}