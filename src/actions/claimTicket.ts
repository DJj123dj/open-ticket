///////////////////////////////////////
//TICKET CLAIMING SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:claim-ticket"))
    opendiscord.actions.get("opendiscord:claim-ticket").workers.add([
        new api.ODWorker("opendiscord:claim-ticket", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to claim ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketClaim").emit([ticket, user, channel, reason])

            //update ticket
            ticket.get("opendiscord:claimed").value = true
            ticket.get("opendiscord:claimed-by").value = user.id
            ticket.get("opendiscord:claimed-on").value = new Date().getTime()
            ticket.get("opendiscord:busy").value = true

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-claimed", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-claimed", user.id, 1, "increase")

            //calculate & update category
            if (typeof params.allowCategoryChange === "boolean" ? params.allowCategoryChange : true){
                const categoryResult = await opendiscord.actions.get("opendiscord:calculate-ticket-category").run("claim-ticket", {guild, user, option:ticket.option, channel, ticket, currentCategoryId:channel.parentId})
                if (categoryResult && categoryResult.shouldChangeCategory && typeof categoryResult.newCategoryId !== "undefined" && typeof categoryResult.newCategoryMode !== "undefined" && typeof categoryResult.newCategory !== "undefined"){
                    const originalCategoryName = channel.parent?.name ?? "<unknown>"
                    const newCategoryName = categoryResult.newCategory?.name ?? "<unknown>"
                    try {
                        await utilities.timedAwait(channel.setParent(categoryResult.newCategoryId, {lockPermissions:false}), 3000, (err) => {
                            process.emit("uncaughtException", new Error("Error: Unable to change channel parent: " + err))
                        })
                        ticket.get("opendiscord:category-mode").value = categoryResult.newCategoryMode
                        ticket.get("opendiscord:category").value = categoryResult.newCategoryId
                    }catch(err){
                        const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-category").build("ticket-claim", {guild, channel, user, originalCategory:originalCategoryName, newCategory:newCategoryName})).message)
                        setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                        opendiscord.log("Unable to move ticket to claimed category.", "error", [
                            {key:"channel", value:"#" + channel.name},
                            {key:"channelid", value:channel.id, hidden:true},
                            {key:"categoryid", value:categoryResult.newCategoryId ?? "/"}
                        ])
                    }
                }
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage){
                const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build(origin, {guild, channel, user, ticket, reason})).message)
                if (sentMsg) await interactiveMsgState.setMsgState({channel, message:sentMsg}, {
                    messageType:"claim-message",
                    messageOrigin:"other",
                    messageAuthor:user.id,
                    messageReason:reason
                }, false)
            }
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketClaimed").emit([ticket, user, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.claiming.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"claim", reason, additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.claiming.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"claim", reason, additionalData:null}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket} = params

            opendiscord.log(user.displayName + " claimed a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:claim-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}