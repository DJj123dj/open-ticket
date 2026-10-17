///////////////////////////////////////
//TRANSFER COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //TRANSFER COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:transfer", generalConfig.data.prefix, "transfer"))
    opendiscord.responders.commands.get("opendiscord:transfer").workers.add([
        new api.ODWorker("opendiscord:transfer", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "transfer")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const oldCreator = await opendiscord.tickets.getTicketUser(ticket, "creator") ?? opendiscord.client.client.user
            const newCreator = instance.options.getUser("user", true)
            const reason = instance.options.getString("reason", false)

            //start transferring ticket ownership
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:transfer-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, newCreator})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:transfer-message").build(origin, {guild, channel, user, ticket, oldCreator, newCreator, reason}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'transfer' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}