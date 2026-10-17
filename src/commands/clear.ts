///////////////////////////////////////
//CLEAR COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const clearMsgState = opendiscord.states.get("opendiscord:clear-message")
const lang = opendiscord.languages

export async function registerCommandResponders() {
    //CLEAR COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:clear", generalConfig.data.prefix, "clear"))
    opendiscord.responders.commands.get("opendiscord:clear").workers.add([
        new api.ODWorker("opendiscord:clear", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance

            //responder checks
            //check permissions (only allow global admins: ticket admins aren't allowed to clear tickets)
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "clear", {allowChannelUserScope:false, allowChannelRoleScope:false})
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //fetch data
            const tempFilter = instance.options.getString("filter", false)
            const filter = (tempFilter) ? tempFilter.toLowerCase() as api.ODTicketClearFilter : "all"
            const channelNameList: string[] = []
            const ticketList = opendiscord.tickets.getAll().filter((ticket) => {
                if (filter === "all") return true
                else if (filter === "open" && ticket.get("opendiscord:open").value) return true
                else if (filter === "closed" && ticket.get("opendiscord:closed").value) return true
                else if (filter === "claimed" && ticket.get("opendiscord:claimed").value) return true
                else if (filter === "pinned" && ticket.get("opendiscord:pinned").value) return true
                else if (filter === "unclaimed" && !ticket.get("opendiscord:claimed").value) return true
                else if (filter === "unpinned" && !ticket.get("opendiscord:pinned").value) return true
                else if (filter === "autoclosed" && ticket.get("opendiscord:closed").value) return true
                else return false
            })
            for (const ticket of ticketList){
                const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
                if (ticketChannel) channelNameList.push("#" + ticketChannel.name)
            }

            //reply with clear verify
            await instance.defer(true)
            const sentMsg = await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:clear-verify-message").build(origin, {guild, channel, user, filter, list:channelNameList, inProgress:false}))
            if (sentMsg.success) await clearMsgState.setMsgState({channel, message:sentMsg.message, user}, {
                messageOrigin:origin,
                clearFilter:filter,
                clearChannelNameList:channelNameList
            }, sentMsg.ephemeral)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'clear' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //CLEAR CONTINUE BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:clear-continue", "od:clear-continue"))
    opendiscord.responders.buttons.get("opendiscord:clear-continue").workers.add(new api.ODWorker("opendiscord:clear-continue", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //check message state
        const state = await clearMsgState.getMsgState({channel, message, user})
        if (!state){
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.stateExpired", ["/clear"]), layout:"simple", customTitle:"Message State Expired"}))
            return cancel()
        }

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "clear")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

        //fetch state details
        const originalUser = ((state.userId) ? await opendiscord.client.fetchUser(state.userId) : user) ?? user
        const originalOrigin = state.data.messageOrigin
        const originalClearFilter = state.data.clearFilter
        const originalClearChannelNameList = state.data.clearChannelNameList

        //start ticket clear
        await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:clear-verify-message").build(originalOrigin, {guild, channel, user:originalUser, filter:originalClearFilter, list:originalClearChannelNameList, inProgress:true}))

        const list: string[] = []
        const ticketList = opendiscord.tickets.getAll().filter((ticket) => {
            if (originalClearFilter === "all") return true
            else if (originalClearFilter === "open" && ticket.get("opendiscord:open").value) return true
            else if (originalClearFilter === "closed" && ticket.get("opendiscord:closed").value) return true
            else if (originalClearFilter === "claimed" && ticket.get("opendiscord:claimed").value) return true
            else if (originalClearFilter === "pinned" && ticket.get("opendiscord:pinned").value) return true
            else if (originalClearFilter === "unclaimed" && !ticket.get("opendiscord:claimed").value) return true
            else if (originalClearFilter === "unpinned" && !ticket.get("opendiscord:pinned").value) return true
            else if (originalClearFilter === "autoclosed" && ticket.get("opendiscord:closed").value) return true
            else return false
        })
        for (const ticket of ticketList){
            const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
            if (ticketChannel) list.push("#" + ticketChannel.name)
        }

        await opendiscord.actions.get("opendiscord:clear-tickets").run(originalOrigin, {guild, channel, user, filter:originalClearFilter, list:ticketList})
        await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:clear-message").build(originalOrigin, {guild, channel, user, filter:originalClearFilter, list}))
    }))
}