///////////////////////////////////////
//CLOSE COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerCommandResponders() {
    //CLOSE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:close", generalConfig.data.prefix, "close"))
    opendiscord.responders.commands.get("opendiscord:close").workers.add([
        new api.ODWorker("opendiscord:close", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "close")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
            if (!isTicketOpen) return cancel()

            const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "close")
            if (!messagesHaveBeenSent) return cancel()

            //start closing ticket
            await instance.defer(false)
            const reason = instance.options.getString("reason", false)
            await opendiscord.actions.get("opendiscord:close-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false})

            //send message & set state
            const sentMsg = await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build(origin, {guild, channel, user, ticket, reason}))
            if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                messageType:"close-message",
                messageOrigin:origin,
                messageAuthor:user.id,
                messageReason:reason
            }, sentMsg.ephemeral)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'close' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //CLOSE TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:close-ticket", /^od:close-ticket/))
    opendiscord.responders.buttons.get("opendiscord:close-ticket").workers.add(new api.ODWorker("opendiscord:close-ticket", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, message, user, member} = instance

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "close")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/close")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
        if (!isTicketOpen) return cancel()

        const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "close")
        if (!messagesHaveBeenSent) return cancel()

        //fetch state details
        const verifybar = opendiscord.verifybars.get("opendiscord:close-ticket")
        const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
        const originalReason = state.data.messageReason ?? null
        const originalMsgType = state.data.messageType

        //send verifybar
        if (generalConfig.data.ticketSystem.disableVerifyBars){
            //verifybar disabled, directly run response
            await verifybar.activate(instance, "accept")

        }else if (originalMsgType === "ticket-message"){
            //ticket message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:close-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:ticket-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user, ticket}))
        }else if (originalMsgType === "reopen-message"){
            //reopen message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:close-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:reopen-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }
    }))
}

export async function registerVerifyBars() {
    //CLOSE TICKET VERIFYBAR
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:close-ticket"))
    opendiscord.verifybars.get("opendiscord:close-ticket").workers.add([
        new api.ODWorker("opendiscord:close-ticket", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild, message} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "close")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/close")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
            if (!isTicketOpen) return cancel()

            const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "close")
            if (!messagesHaveBeenSent) return cancel()

            //fetch state details
            const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
            const originalReason = state.data.messageReason ?? null
            const originalMsgType = state.data.messageType

            //start closing ticket
            if (params.selectedButtonId === "cancel"){
                //CANCEL
                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "reopen-message"){
                    //reopen message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }
            }else if (params.selectedButtonId === "accept"){
                //CLOSE TICKET
                await instance.defer("update", false)

                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await opendiscord.actions.get("opendiscord:close-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "reopen-message"){
                    //converted to close message
                    await opendiscord.actions.get("opendiscord:close-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                    const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build("verifybar", {guild, channel, user, ticket, reason:null}))
                    if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                        messageType:"close-message",
                        messageOrigin:origin,
                        messageAuthor:user.id,
                        messageReason:null
                    }, sentMsg.ephemeral)
                }
            }else if (params.selectedButtonId === "accept-with-reason"){
                //CLOSE WITH REASON (MODAL)
                instance.modal(await opendiscord.components.modals.get("opendiscord:close-ticket-reason").build("other", {guild, channel, user, ticket, message}))
            }
        })
    ])
}

export async function registerModalResponders() {
    //CLOSE WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:close-ticket-reason", /^od:close-ticket-reason\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:close-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:close-ticket-reason", 0, async (instance, params, origin, cancel) => {
            const {guild, user} = instance

            const match = /^od:close-ticket-reason\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const channel = await opendiscord.client.fetchTextChannel(match[1])
            const message = await opendiscord.client.fetchChannelMessage(match[1], match[2])

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "close")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/close")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
            if (!isTicketOpen) return cancel()

            //fetch state details
            const reason = instance.values.getTextField("reason", true)
            const originalMsgOrigin = state.data.messageOrigin
            const originalMsgType = state.data.messageType

            //start closing ticket
            await instance.defer("update", false)

            if (originalMsgType === "ticket-message"){
                //ticket message
                await opendiscord.actions.get("opendiscord:close-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

            }else if (originalMsgType === "reopen-message"){
                //converted to close message
                await opendiscord.actions.get("opendiscord:close-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build(originalMsgType, {guild, channel, user, ticket, reason}))
                if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                    messageType:"close-message",
                    messageOrigin:originalMsgOrigin,
                    messageAuthor:user.id,
                    messageReason:reason
                }, sentMsg.ephemeral)
            }
        })
    ])
}