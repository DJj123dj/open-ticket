///////////////////////////////////////
//TICKET DELETION SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:delete-ticket"))
    opendiscord.actions.get("opendiscord:delete-ticket").workers.add([
        new api.ODWorker("opendiscord:delete-ticket", 3, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to delete ticket! Open Ticket doesn't support threads!")

            //set for deletion
            ticket.get("opendiscord:for-deletion").value = true

            await opendiscord.events.get("onTicketDelete").emit([ticket, user, channel, reason])

            //update ticket
            ticket.get("opendiscord:busy").value = true

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(origin, {guild, channel, user, ticket, reason})).message)

            //create transcript
            if (!params.withoutTranscript){
                const transcriptRes = await opendiscord.actions.get("opendiscord:create-transcript").run(origin, {guild, channel, user, ticket})
                //transcript failure
                if (typeof transcriptRes.success === "boolean" && !transcriptRes.success && transcriptRes.compiler){
                    const {compiler} = transcriptRes
                    await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:transcript-error").build(origin, {guild, channel, user, ticket, compiler, reason:transcriptRes.errorReason ?? null})).message)
                        .catch((reason) => opendiscord.log("Unable to send transcript failure to ticket channel!", "error", [{key:"id", value:channel.id}]))

                    //undo deletion
                    ticket.get("opendiscord:for-deletion").value = false
                    ticket.get("opendiscord:busy").value = false
                    opendiscord.log("Canceled ticket deletion because of transcript system malfunction!", "warning", [
                        {key:"compiler", value:compiler.id.value},
                        {key:"reason", value:transcriptRes.errorReason ?? "/"}
                    ])
                    return cancel()
                }
            }

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-deleted", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-deleted", user.id, 1, "increase")

            //delete ticket from manager
            opendiscord.tickets.remove(ticket.id)

            //delete permissions from manager
            await (await import("../data/framework/permissionLoader.js")).removeTicketPermissions(ticket)
        }),
        new api.ODWorker("opendiscord:discord-logs", 2, async (instance, params, origin, cancel) => {
            //logs before channel deletion => channel might still be used in log embeds
            const {guild, channel, user, ticket, reason} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.deleting.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"delete", reason, additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.deleting.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"delete", reason, additionalData:null}))
        }),
        new api.ODWorker("opendiscord:delete-channel", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params
            //delete channel & events
            await opendiscord.events.get("onTicketChannelDeletion").emit([ticket, channel, user])
            await channel.delete("Ticket Deleted").catch((reason) => opendiscord.log("Unable to delete ticket channel!", "error", [{key:"id", value:channel.id}]))
            await opendiscord.events.get("afterTicketChannelDeleted").emit([ticket, user])

            //delete permissions from manager
            await (await import("../data/framework/permissionLoader.js")).removeTicketPermissions(ticket)

            await opendiscord.events.get("afterTicketDeleted").emit([ticket, user, reason])
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket} = params

            opendiscord.log(user.displayName + " deleted a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin},
                {key:"transcript", value:(!params.withoutTranscript).toString()}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:delete-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
        params.ticket.get("opendiscord:for-deletion").value = false
    })
}