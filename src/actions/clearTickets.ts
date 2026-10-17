///////////////////////////////////////
//CLEAR TICKETS SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:clear-tickets"))
    opendiscord.actions.get("opendiscord:clear-tickets").workers.add([
        new api.ODWorker("opendiscord:clear-tickets", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, filter, list} = params

            await opendiscord.events.get("onTicketsClear").emit([list, user, channel, filter])
            const nameList: string[] = []

            //split tickets into smaller groups of 10 (to decrease ratelimit chances for HTML Transcripts & discord API)
            const subGroupList: api.ODTicket[][] = []
            let tempSubGroup: api.ODTicket[] = []
            list.forEach((ticket, index) => {
                tempSubGroup.push(ticket)
                if (tempSubGroup.length >= 10){
                    subGroupList.push(tempSubGroup)
                    tempSubGroup = []
                }
            })
            if (tempSubGroup.length > 0) subGroupList.push(tempSubGroup)

            let groupIndex = 0
            for (const ticketGroup of subGroupList){
                for (const ticket of ticketGroup){
                    const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
                    if (!ticketChannel) return
                    nameList.push("#" + ticketChannel.name)
                    await opendiscord.actions.get("opendiscord:delete-ticket").run("clear", {guild, channel:ticketChannel, user, ticket, reason:"Cleared Ticket", sendMessage:true, withoutTranscript:false})
                    await utilities.timer(2000) //wait 2sec between each deletion
                }
                if (groupIndex < subGroupList.length - 1) await utilities.timer(45 * 1000) //wait 45sec between each group deletion (10 tickets)
                groupIndex++
            }

            instance.list = nameList
            await opendiscord.events.get("afterTicketsCleared").emit([list, user, channel, filter])
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, filter, list} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.deleting.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:clear-logs").build(origin, {guild, channel, user, filter, list:instance.list ?? []}))
            }
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, user, filter, list} = params
            opendiscord.log(user.displayName + " cleared " + list.length + " tickets!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"method", value:origin},
                {key:"filter", value:filter}
            ])
        })
    ])
}