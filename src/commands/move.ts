///////////////////////////////////////
//MOVE COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //MOVE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:move", generalConfig.data.prefix, "move"))
    opendiscord.responders.commands.get("opendiscord:move").workers.add([
        new api.ODWorker("opendiscord:move", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "move")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //fetch data
            const id = instance.options.getString("id", true)
            const reason = instance.options.getString("reason", false)
            const option = opendiscord.options.get(id)

            //return if unknown option
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, error:opendiscord.languages.getTranslation("errors.titles.unknownOption"), layout:"simple"}))
                return cancel()
            }
            //return if option is the same
            if (ticket.option.id.value === option.id.value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, error:"This ticket is already the same as the chosen option!", layout:"simple"}))
                return cancel()
            }

            //start moving ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:move-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, data:option})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:move-message").build(origin, {guild, channel, user, ticket, reason, data:option}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'move' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}