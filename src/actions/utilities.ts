///////////////////////////////////////
//OPEN TICKET UTILITY FUNCTIONS
///////////////////////////////////////
import { opendiscord, api, utilities } from "../index.js"
import * as discord from "discord.js"

/**Check the ticket creation permissions like: cooldown, limits, blacklist, ... */
export async function checkTicketCreationPerms(instance:api.ODButtonResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance|api.ODCommandResponderInstance, origin:api.ODActionManagerIdMappings["opendiscord:create-ticket-permissions"]["origin"], guild:discord.Guild, user:discord.User, option:api.ODTicketOption) {
    //check ticket permissions
    const lang = opendiscord.languages
    const permsRes = await opendiscord.actions.get("opendiscord:create-ticket-permissions").run(origin, {guild, user, option})
    if (!permsRes.valid && instance.channel){
        //error
        const newOrigin = (origin === "slash" || origin === "text") ? origin : "other"
        if (permsRes.reason === "blacklist") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-blacklisted").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
        else if (permsRes.reason === "cooldown") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-cooldown").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, until:permsRes.cooldownUntil}))
        else if (permsRes.reason === "global-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, limit:"global"}))
        else if (permsRes.reason === "global-user-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, limit:"global-user"}))
        else if (permsRes.reason === "option-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, limit:"option"}))
        else if (permsRes.reason === "option-user-limit") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, limit:"option-user"}))
        else if (permsRes.reason === "custom") await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, layout:"simple", error:permsRes.customReason ?? lang.getTranslation("errors.descriptions.unableToCreateTicket") + " `Unknown invalid_permission_reason => no reason specified by plugin`", customTitle:lang.getTranslation("errors.titles.permissionError")}))
        else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(newOrigin, {guild:instance.guild, channel:instance.channel, user:instance.user, error:"Unknown invalid_permission reason => calculation failed #1", layout:"advanced"}))
        return false
    }else return true
}

/**Fetch the interactive message state. If not present, auto replies with error and returns `null`. When `null` is received, the worker should be returned and canceled. */
export async function replyInteractiveMessageState(instance:api.ODButtonResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", channel:discord.TextBasedChannel, message:discord.Message|null, replacementCommandName:string) {
    //check message state
    const {user, member, guild} = instance
    const lang = opendiscord.languages
    const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

    if (!message){
        await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.messageMissing", [replacementCommandName]), layout:"simple", customTitle:"Message State Error"}))
        return null
    }

    const state = await interactiveMsgState.getMsgState({channel, message})
    if (!state){
        await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.stateExpired", [replacementCommandName]), layout:"simple", customTitle:"Message State Expired"}))
        return null
    }else return state
}

/**Check the permissions for this command. If not allowed, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyHasPermissions(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", commandName:keyof api.ODGeneralJsonConfig_SystemPermissions, settings?:api.ODPermissionSettings) {
    //check permissions
    const {user, member, channel, guild} = instance
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.permissions[commandName], "support", user, member, channel, guild, settings)

    if (!permsResult.hasPerms){
        if (permsResult.reason === "not-in-server" && channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button", {channel, user}))
        else if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(origin, {guild, channel, user, permissions:["support"]}))
        return false
    }else return true
}

/**Check if channel is in guild/server. If not, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyIsInGuild(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other") {
    //check is in guild/server
    const {user, member, channel, guild} = instance

    if (!guild){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(origin, {channel, user}))
        return false
    }else return true
}

/**Check if channel is valid ticket. If not, auto replies with error and returns `null`. When `null` is received, the worker should be returned and canceled. */
export async function replyIsTicket(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other") {
    //check if ticket exists
    const {user, member, channel, guild} = instance
    if (!channel) return null
    const ticket = opendiscord.tickets.get(channel.id)

    if (!ticket || channel.isDMBased()){
        await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build(origin, {guild, channel, user}))
        return null
    }else return ticket
}

/**Check if ticket is not busy and available. If not, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketIsAvailable(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when busy
    const {user, member, channel, guild} = instance

    if (ticket.get("opendiscord:busy").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build(origin, {guild, channel, user}))
        return false
    }else return true
}

/**Check if ticket is open. If closed, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBeOpen(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already closed
    const {user, member, channel, guild} = instance
    if (ticket.get("opendiscord:closed").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.close"), layout:"simple"}))
        return false
    }else return true
}

/**Check if ticket is closed. If open, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBeClosed(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already open
    const {user, member, channel, guild} = instance
    if (!ticket.get("opendiscord:closed").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.reopen"), layout:"simple"}))
        return false
    }else return true
}

/**Check if ticket is unclaimed. If claimed, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBeUnclaimed(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already claimed
    const {user, member, channel, guild} = instance
    if (ticket.get("opendiscord:claimed").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.claim"), layout:"simple"}))
        return false
    }else return true
}

/**Check if ticket is claimed. If unclaimed, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBeClaimed(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already unclaimed
    const {user, member, channel, guild} = instance
    if (!ticket.get("opendiscord:claimed").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.unclaim"), layout:"simple"}))
        return false
    }else return true
}

/**Check if ticket is unpinned. If pinned, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBeUnpinned(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already pinned
    const {user, member, channel, guild} = instance
    if (ticket.get("opendiscord:pinned").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.pin"), layout:"simple"}))
        return false
    }else return true
}

/**Check if ticket is pinned. If unpinned, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyTicketMustBePinned(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance|api.ODModalResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket) {
    //return when already unpinned
    const {user, member, channel, guild} = instance
    if (!ticket.get("opendiscord:pinned").value){
        if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:opendiscord.languages.getTranslation("errors.actionInvalid.unpin"), layout:"simple"}))
        return false
    }else return true
}

/**Check if the ticket can be closed/deleted before a message has been sent by an admin or user. If not passing the test, auto replies with error and returns `false`. When `false` is received, the worker should be returned and canceled. */
export async function replyMessageMustBeSentBeforeClose(instance:api.ODButtonResponderInstance|api.ODCommandResponderInstance|api.ODDropdownResponderInstance, origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", ticket:api.ODTicket, commandName:keyof api.ODGeneralJsonConfig_SystemPermissions) {
    //return when not allowed because of missing messages
    const {user, member, channel, guild} = instance
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    const lang = opendiscord.languages
    const permsResult = await opendiscord.permissions.checkCommandPerms(generalConfig.data.permissions[commandName], "support", user, member, channel, guild)

    if (!permsResult.hasPerms) throw new api.ODSystemError("Please check permissions before using replyMessageMustBeSentBeforeClose()")
    if (!guild || channel.isDMBased()) throw new api.ODSystemError("replyMessageMustBeSentBeforeClose() must be used in a guild and not a DM channel.")

    if (!permsResult.isAdmin && (!generalConfig.data.ticketSystem.allowCloseBeforeMessage || !generalConfig.data.ticketSystem.allowCloseBeforeAdminMessage)){
        const analysis = await opendiscord.transcripts.collector.ticketUserMessagesAnalysis(ticket, guild, channel)
        if (analysis && !generalConfig.data.ticketSystem.allowCloseBeforeMessage && analysis.totalMessages < 1){
            if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, layout:"simple", error:lang.getTranslation("errors.descriptions.closeBeforeMessage"), customTitle:lang.getTranslation("errors.titles.noPermissions")}))
            return false
        }
        if (analysis && !generalConfig.data.ticketSystem.allowCloseBeforeAdminMessage && analysis.adminMessages < 1){
            if (channel) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, layout:"simple", error:lang.getTranslation("errors.descriptions.closeBeforeAdminMessage"), customTitle:lang.getTranslation("errors.titles.noPermissions")}))
            return false
        }
        return true
    }else return true
}

/**Update the ticket message from a given ticket channel. This should be used after every change to the `ODTicket` after an action. */
export async function updateTicketMessage(guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:api.ODTicket) {
    const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
    if (!ticketMessage || !user || !channel || !guild || channel.isDMBased()) return
    try {
        await ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket})).message)
    }catch(e){
        opendiscord.log("Unable to edit ticket message!", "error", [
            {key:"channel", value:"#" + channel.name},
            {key:"channelid", value:channel.id, hidden:true},
            {key:"messageid", value:ticketMessage.id},
            {key:"option", value:ticket.option.id.value}
        ])
        opendiscord.debugfile.writeErrorMessage(new api.ODError(e, "uncaughtException"))
    }
}