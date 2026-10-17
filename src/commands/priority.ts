///////////////////////////////////////
//PRIORITY COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerCommandResponders() {
    //PRIORITY COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:priority", generalConfig.data.prefix, "priority"))
    opendiscord.responders.commands.get("opendiscord:priority").workers.add([
        new api.ODWorker("opendiscord:priority", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "priority")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //subcommands
            const scope = instance.options.getSubCommand()
            if (!scope || (scope !== "set" && scope !== "get")) return

            if (scope === "set"){
                const priorityName = instance.options.getString("priority", true)
                const reason = instance.options.getString("reason", false)

                const priority = opendiscord.priorities.getAll().find((lvl) => lvl.rawName === priorityName) ?? null
                if (!priority){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, layout:"simple", error:"Please provide a valid priority level.", customTitle:"Unknown Priority Level"}))
                    return cancel()
                }

                //start changing ticket priority
                await instance.defer(false)
                await opendiscord.actions.get("opendiscord:update-ticket-priority").run(origin, {guild, channel, user, ticket, newPriority:priority, sendMessage:false, reason})
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:priority-set").build(origin, {guild, channel, user, ticket, priority, reason}))

            }else if (scope === "get"){
                const priority = opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value)
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:priority-get").build(origin, {guild, channel, user, ticket, priority}))
            }
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            const scope = instance.options.getSubCommand()
            opendiscord.log(instance.user.displayName + " used the 'priority " + scope + "' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerDropdownResponders() {
    //PRIORITY DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.add(new api.ODDropdownResponder("opendiscord:priority-dropdown", /^od:priority-dropdown/))
    opendiscord.responders.dropdowns.get("opendiscord:priority-dropdown").workers.add(new api.ODWorker("opendiscord:priority-dropdown", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        const match = /^od:select-priority\|([^|]+)/.exec(instance.values.getStringValues()[0])
        if (!match) return
        const priorityName = match[1]

        const priority = opendiscord.priorities.getAll().find((lvl) => lvl.rawName === priorityName) ?? null
        if (!priority){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button", {guild, channel, user, layout:"simple", error:"Please select a valid priority level.", customTitle:"Unknown Priority Level"}))
            return cancel()
        }

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "priority")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/priority")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        //fetch state details
        const originalMsgOrigin = state.data.messageOrigin
        const originalMsgType = state.data.messageType

        //start changing ticket priority
        await instance.defer("reply", false)
        await opendiscord.actions.get("opendiscord:update-ticket-priority").run("other", {guild, channel, user, ticket, newPriority:priority, sendMessage:false, reason:null})
        await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:priority-set").build("other", {guild, channel, user, ticket, priority, reason:null}))
    }))
}