///////////////////////////////////////
//TICKET PINNING SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:pin-ticket"))
    opendiscord.actions.get("opendiscord:pin-ticket").workers.add([
        new api.ODWorker("opendiscord:pin-ticket", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to pin ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketPin").emit([ticket, user, channel, reason])

            //update ticket
            ticket.get("opendiscord:pinned").value = true
            ticket.get("opendiscord:pinned-by").value = user.id
            ticket.get("opendiscord:pinned-on").value = new Date().getTime()
            ticket.get("opendiscord:busy").value = true

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-pinned", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-pinned", user.id, 1, "increase")

            //move to top of category
            if (channel.parent){
                await channel.setPosition(0, {reason:"Ticket Pinned!"})
            }

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("pin-ticket", {guild, user, option:ticket.option, channel, ticket, currentChannelName:channel.name})
            if (channelNameResult && channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined"){
                const originalName = channel.name
                const newName = channelNameResult.newChannelName
                try {
                    await utilities.timedAwait(channel.setName(newName), 2500, (err) => {
                        opendiscord.log("Failed to rename channel on ticket pin", "error")
                    })
                }catch(err){
                    opendiscord.log("Unable to rename channel while pinning ticket! Waiting until ratelimit expires...", "warning", [
                        {key:"oldName", value:originalName},
                        {key:"newName", value:newName}
                    ])
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-pin", {guild, channel, user, originalName, newName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                }
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage){
                const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:pin-message").build(origin, {guild, channel, user, ticket, reason})).message)
                if (sentMsg) await interactiveMsgState.setMsgState({channel, message:sentMsg}, {
                    messageType:"pin-message",
                    messageOrigin:"other",
                    messageAuthor:user.id,
                    messageReason:reason
                }, false)
            }
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketPinned").emit([ticket, user, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.pinning.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"pin", reason, additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.pinning.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"pin", reason, additionalData:null}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket} = params

            opendiscord.log(user.displayName + " pinned a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
}