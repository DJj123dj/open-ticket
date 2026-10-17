///////////////////////////////////////
//TRANSCRIPTS COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const transcriptsDatabase = opendiscord.databases.get("opendiscord:transcripts")

export async function registerCommandResponders() {
    //TRANSCRIPTS COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:transcripts", generalConfig.data.prefix, "transcripts"))
    opendiscord.responders.commands.get("opendiscord:transcripts").workers.add([
        new api.ODWorker("opendiscord:transcripts", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "transcripts")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //fetch data
            const transcriptUser = instance.options.getUser("user", true)

            const transcriptList = (await transcriptsDatabase.getCategory("opendiscord:transcript") ?? [])
                .filter((t) => t.value.ticketCreatorId === transcriptUser.id)
                .map((t) => t.value)
                .sort((a, b) => (b.ticketDeletedDate ?? 0) - (a.ticketDeletedDate ?? 0))
                .slice(0, 20)

            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:transcript-history").build(origin, {guild, channel, user, transcriptUser, transcriptList}))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'transcripts' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}