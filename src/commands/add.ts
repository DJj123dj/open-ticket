///////////////////////////////////////
//ADD COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //ADD COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:add", generalConfig.data.prefix, "add"))
    opendiscord.responders.commands.get("opendiscord:add").workers.add([
        new api.ODWorker("opendiscord:add", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "add")
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

            //return when user already added to ticket
            const participants = await opendiscord.tickets.getAllTicketParticipants(ticket)
            if (!participants || participants.find((p) => p.user.id === data.id)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.add"), layout:"simple"}))
                return cancel()
            }

            //start adding user to ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:add-ticket-user").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, data})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:add-message").build(origin, {guild, channel, user, ticket, reason, data}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'add' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}