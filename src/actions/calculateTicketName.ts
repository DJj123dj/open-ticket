///////////////////////////////////////
//CALCULATE TICKET NAME SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:calculate-ticket-name"))
    opendiscord.actions.get("opendiscord:calculate-ticket-name").workers.add([
        new api.ODWorker("opendiscord:calculate-ticket-name", 0, async (instance, params, origin, cancel) => {
            const {guild, user, channel, option, ticket, currentChannelName} = params

            //calculate base channel name
            const channelPrefix = option.get("opendiscord:channel-prefix").value
            const channelSuffix = (ticket) ? ticket.get("opendiscord:channel-suffix").value : (await opendiscord.options.suffix.getSuffixFromOption(option, user, guild) ?? "unknown")
            const channelRenamed = (ticket && ticket.exists("opendiscord:channel-renamed")) ? ticket.get("opendiscord:channel-renamed").value : null
            const baseChannelName = (channelRenamed) ? channelRenamed : channelPrefix + channelSuffix

            //calculate status emojis
            const pinEmoji = (ticket && ticket.get("opendiscord:pinned").value) ? generalConfig.data.ticketSystem.pinEmoji : ""
            const closeEmoji = (ticket && ticket.get("opendiscord:closed").value) ? generalConfig.data.ticketSystem.closeEmoji : ""
            const priorityEmoji = (ticket) ? (opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value).channelEmoji ?? "") : ""

            instance.newChannelName = pinEmoji + closeEmoji + priorityEmoji + baseChannelName
            instance.newChannelSuffix = channelSuffix
            instance.shouldChangeName = (instance.newChannelName !== currentChannelName)
        })
    ])
}