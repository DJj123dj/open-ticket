///////////////////////////////////////
//TOPIC COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //TOPIC COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:topic", generalConfig.data.prefix, "topic"))
    opendiscord.responders.commands.get("opendiscord:topic").workers.add([
        new api.ODWorker("opendiscord:topic", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "topic")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //subcommands
            const scope = instance.options.getSubCommand()
            if (!scope || (scope !== "set")) return

            if (scope === "set"){
                const topic = instance.options.getString("topic", true)
                //start changing ticket topic
                await instance.defer(false)
                await opendiscord.actions.get("opendiscord:update-ticket-topic").run(origin, {guild, channel, user, ticket, newTopic:topic, sendMessage:false})
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:topic-set").build(origin, {guild, channel, user, ticket, topic}))
            }
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'topic set' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}