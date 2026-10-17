///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //STATS COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:stats", generalConfig.data.prefix, /^stats/))
    opendiscord.responders.commands.get("opendiscord:stats").workers.add([
        new api.ODWorker("opendiscord:stats", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance

            //check permissions
            if (instance.options.getSubCommand() === "reset" && !opendiscord.permissions.hasPermissions("owner", await opendiscord.permissions.getPermissions(instance.user, instance.channel, instance.guild))){
                //reset --> owner/developer role is required
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user, permissions:["owner", "developer"]}))
                return cancel()
            }else{
                //default permissions check
                const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "stats")
                if (!hasPerms) return cancel()
            }

            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //subcommands
            const scope = instance.options.getSubCommand()
            if (!scope || (scope !== "global" && scope !== "ticket" && scope !== "user" && scope !== "reset")) return

            if (scope === "global"){
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-global").build(origin, {guild, channel, user}))

            }else if (scope === "ticket"){
                const id = instance.options.getChannel("ticket", false)?.id ?? channel.id
                const ticket = opendiscord.tickets.get(id)

                if (ticket) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-ticket").build(origin, {guild, channel, user, scopeData:ticket}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-ticket-unknown").build(origin, {guild, channel, user, id}))

            }else if (scope === "user"){
                const statsUser = instance.options.getUser("user", false) ?? user
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-user").build(origin, {guild, channel, user, scopeData:statsUser}))

            }else if (scope === "reset"){
                const reason = instance.options.getString("reason", false)
                opendiscord.statistics.reset()
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-reset").build(origin, {guild, channel, user, reason}))
            }
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            const scope = instance.options.getSubCommand()
            let data: string
            if (scope === "ticket"){
                data = instance.options.getChannel("ticket", false)?.id ?? instance.channel.id
            }else if (scope === "user"){
                data = instance.options.getUser("user", false)?.id ?? instance.user.id
            }else data = "/"
            opendiscord.log(instance.user.displayName + " used the 'stats " + scope + "' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin},
                {key:"data", value:data}
            ])
        })
    ])
}