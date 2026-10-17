///////////////////////////////////////
//RENAME COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //RENAME COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:rename", generalConfig.data.prefix, "rename"))
    opendiscord.responders.commands.get("opendiscord:rename").workers.add([
        new api.ODWorker("opendiscord:rename", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "rename")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const name = instance.options.getString("name", true)
            const reason = instance.options.getString("reason", false)

            //start renaming ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:rename-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, data:name})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:rename-message").build(origin, {guild, channel, user, ticket, reason, data:name}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'rename' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}