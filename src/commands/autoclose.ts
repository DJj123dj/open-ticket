///////////////////////////////////////
//AUTOCLOSE COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //AUTOCLOSE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:autoclose", generalConfig.data.prefix, /^autoclose/))
    opendiscord.responders.commands.get("opendiscord:autoclose").workers.add([
        new api.ODWorker("opendiscord:autoclose", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "autoclose")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
            if (!isTicketOpen) return cancel()

            //subcommands
            const scope = instance.options.getSubCommand()
            if (!scope || (scope !== "disable" && scope !== "enable")) return

            if (scope === "disable"){
                const reason = instance.options.getString("reason", false)
                ticket.get("opendiscord:autoclose-enabled").value = false
                ticket.get("opendiscord:autoclose-hours").value = 0
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:autoclose-disable").build(origin, {guild, channel, user, ticket, reason}))

            }else if (scope === "enable"){
                const time = instance.options.getNumber("time", true)
                const reason = instance.options.getString("reason", false)
                ticket.get("opendiscord:autoclose-enabled").value = true
                ticket.get("opendiscord:autoclose-hours").value = time
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:autoclose-enable").build(origin, {guild, channel, user, ticket, reason, time}))
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            const scope = instance.options.getSubCommand()
            const reason = instance.options.getString("reason", false)
            opendiscord.log(instance.user.displayName + " used the 'autoclose " + scope + "' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin},
                {key:"reason", value:reason ?? "/"}
            ])
        })
    ])
}