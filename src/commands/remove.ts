///////////////////////////////////////
//REMOVE COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //REMOVE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:remove", generalConfig.data.prefix, "remove"))
    opendiscord.responders.commands.get("opendiscord:remove").workers.add([
        new api.ODWorker("opendiscord:remove", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "remove")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const data = instance.options.getUser("user", true)
            const reason = instance.options.getString("reason", false)

            //return when user is not a participant of the ticket (admins & creator can't be removed)
            const participants = await opendiscord.tickets.getAllTicketParticipants(ticket)
            if (!participants || !participants.find((p) => p.user.id === data.id && p.role === "participant")){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.remove"), layout:"simple"}))
                return cancel()
            }

            //start removing user from ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:remove-ticket-user").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, data})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:remove-message").build(origin, {guild, channel, user, ticket, reason, data}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'remove' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}