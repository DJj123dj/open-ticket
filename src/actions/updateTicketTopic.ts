///////////////////////////////////////
//TICKET TOPIC SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:update-ticket-topic"))
    opendiscord.actions.get("opendiscord:update-ticket-topic").workers.add([
        new api.ODWorker("opendiscord:update-ticket-topic", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newTopic} = params
            if (channel.isThread() || !(channel instanceof discord.TextChannel)) throw new api.ODSystemError("Unable to set topic of ticket! Open Ticket doesn't support threads!")

            const oldTopic = ticket.get("opendiscord:topic").value
            if (newTopic) await opendiscord.events.get("onTicketTopicChange").emit([ticket, user, channel, oldTopic, newTopic])

            //update ticket
            ticket.get("opendiscord:busy").value = true
            if (newTopic) ticket.get("opendiscord:topic").value = newTopic

            //get ticket data
            const closed = ticket.get("opendiscord:closed").value
            const claimedBy = ticket.get("opendiscord:claimed-by").value
            const pinned = ticket.get("opendiscord:pinned").value
            const creator = ticket.get("opendiscord:opened-by").value ?? opendiscord.client.client.user.id

            //handle channel topic
            const channelTopics: string[] = []
            if (generalConfig.data.ticketSystem.channelTopic.showOptionName) channelTopics.push(ticket.option.get("opendiscord:name").value)
            if (generalConfig.data.ticketSystem.channelTopic.showOptionDescription) channelTopics.push(ticket.option.get("opendiscord:description").value)
            if (generalConfig.data.ticketSystem.channelTopic.showOptionTopic) channelTopics.push(ticket.get("opendiscord:topic").value)
            if (generalConfig.data.ticketSystem.channelTopic.showPriority) channelTopics.push("**" + lang.getTranslation("params.uppercase.priority") + ":** " + opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value).renderDisplayName())
            if (generalConfig.data.ticketSystem.channelTopic.showClosed) channelTopics.push("**" + lang.getTranslation("params.uppercase.status") + ":** " + (closed ? lang.getTranslation("params.uppercase.closed") : lang.getTranslation("params.uppercase.open")))
            if (generalConfig.data.ticketSystem.channelTopic.showClaimed) channelTopics.push("**" + lang.getTranslation("stats.properties.claimedBy") + ":** " + (claimedBy ? discord.userMention(claimedBy) : lang.getTranslation("params.uppercase.noone")))
            if (generalConfig.data.ticketSystem.channelTopic.showPinned) channelTopics.push("**" + lang.getTranslation("params.uppercase.pinned") + ":** " + (pinned ? lang.getTranslation("params.uppercase.yes") : lang.getTranslation("params.uppercase.no")))
            if (generalConfig.data.ticketSystem.channelTopic.showCreator) channelTopics.push("**" + lang.getTranslation("params.uppercase.creator") + ":** " + discord.userMention(creator))
            if (generalConfig.data.ticketSystem.channelTopic.showParticipants) channelTopics.push("**" + lang.getTranslation("params.uppercase.participants") + ":** " + ticket.get("opendiscord:participants").value.map((p) => (p.type === "user") ? discord.userMention(p.id) : discord.roleMention(p.id)).join(", "))

            //update channel
            channel.setTopic(channelTopics.join(" • "), "Topic Changed")

            //reply with new message
            if (params.sendMessage && newTopic) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:topic-set").build(origin, {guild, channel, user, ticket, topic:newTopic})).message)
            ticket.get("opendiscord:busy").value = false
            if (newTopic) await opendiscord.events.get("afterTicketTopicChanged").emit([ticket, user, channel, oldTopic, newTopic])

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newTopic} = params

            if (!newTopic) return //only log when topic actually changed

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.topicChange.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build("topic-message", {guild, channel, user, ticket, mode:"topic", reason:null, additionalData:newTopic}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.topicChange.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build("topic-message", {guild, channel, user, ticket, mode:"topic", reason:null, additionalData:newTopic}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newTopic} = params

            if (newTopic) opendiscord.log(user.displayName + " changed the topic of a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"topic", value:newTopic},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:update-ticket-topic").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}