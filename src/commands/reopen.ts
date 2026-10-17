///////////////////////////////////////
//REOPEN COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerCommandResponders() {
    //REOPEN COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:reopen", generalConfig.data.prefix, "reopen"))
    opendiscord.responders.commands.get("opendiscord:reopen").workers.add([
        new api.ODWorker("opendiscord:reopen", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "reopen")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketClosed = await openticketUtils.replyTicketMustBeClosed(instance, origin, ticket)
            if (!isTicketClosed) return cancel()

            //start reopening ticket
            await instance.defer(false)
            const reason = instance.options.getString("reason", false)
            await opendiscord.actions.get("opendiscord:reopen-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false})

            //send message & set state
            const sentMsg = await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build(origin, {guild, channel, user, ticket, reason}))
            if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                messageType:"reopen-message",
                messageOrigin:origin,
                messageAuthor:user.id,
                messageReason:reason
            }, sentMsg.ephemeral)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'reopen' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //REOPEN TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:reopen-ticket", /^od:reopen-ticket/))
    opendiscord.responders.buttons.get("opendiscord:reopen-ticket").workers.add(new api.ODWorker("opendiscord:reopen-ticket", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, message, user, member} = instance

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "reopen")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/reopen")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        const isTicketClosed = await openticketUtils.replyTicketMustBeClosed(instance, origin, ticket)
        if (!isTicketClosed) return cancel()

        //fetch state details
        const verifybar = opendiscord.verifybars.get("opendiscord:reopen-ticket")
        const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
        const originalReason = state.data.messageReason ?? null
        const originalMsgType = state.data.messageType

        //send verifybar
        if (generalConfig.data.ticketSystem.disableVerifyBars){
            //verifybar disabled, directly run response
            await verifybar.activate(instance, "accept")

        }else if (originalMsgType === "ticket-message"){
            //ticket message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:reopen-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:ticket-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user, ticket}))
        }else if (originalMsgType === "close-message"){
            //close message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:reopen-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:close-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }else if (originalMsgType === "autoclose-message"){
            //autoclose message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:reopen-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:autoclose-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket}))
        }
    }))
}

export async function registerVerifyBars() {
    //REOPEN TICKET
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:reopen-ticket"))
    opendiscord.verifybars.get("opendiscord:reopen-ticket").workers.add([
        new api.ODWorker("opendiscord:reopen-ticket", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild, message} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "reopen")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/reopen")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketClosed = await openticketUtils.replyTicketMustBeClosed(instance, origin, ticket)
            if (!isTicketClosed) return cancel()

            //fetch state details
            const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
            const originalReason = state.data.messageReason ?? null
            const originalMsgType = state.data.messageType

            //start reopening ticket
            if (params.selectedButtonId === "cancel"){
                //CANCEL
                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "close-message"){
                    //close message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }else if (originalMsgType === "autoclose-message"){
                    //autoclose message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:autoclose-message").build("verifybar", {guild, channel, user:originalUser, ticket}))
                }
            }else if (params.selectedButtonId === "accept"){
                //REOPEN TICKET
                await instance.defer("update", false)

                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "close-message"){
                    //converted to reopen message
                    await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                    const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("verifybar", {guild, channel, user, ticket, reason:null}))
                    if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                        messageType:"reopen-message",
                        messageOrigin:origin,
                        messageAuthor:user.id,
                        messageReason:null
                    }, sentMsg.ephemeral)
                }else if (originalMsgType === "autoclose-message"){
                    //converted to reopen message
                    await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                    const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("verifybar", {guild, channel, user, ticket, reason:null}))
                    if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                        messageType:"reopen-message",
                        messageOrigin:origin,
                        messageAuthor:user.id,
                        messageReason:null
                    }, sentMsg.ephemeral)
                }
            }else if (params.selectedButtonId === "accept-with-reason"){
                //REOPEN WITH REASON (MODAL)
                instance.modal(await opendiscord.components.modals.get("opendiscord:reopen-ticket-reason").build("other", {guild, channel, user, ticket, message}))
            }
        })
    ])
}

export async function registerModalResponders() {
    //REOPEN WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:reopen-ticket-reason", /^od:reopen-ticket-reason\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:reopen-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:reopen-ticket-reason", 0, async (instance, params, origin, cancel) => {
            const {guild, user} = instance

            const match = /^od:reopen-ticket-reason\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const channel = await opendiscord.client.fetchTextChannel(match[1])
            const message = await opendiscord.client.fetchChannelMessage(match[1], match[2])

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "reopen")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/reopen")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketClosed = await openticketUtils.replyTicketMustBeClosed(instance, origin, ticket)
            if (!isTicketClosed) return cancel()

            //fetch state details
            const reason = instance.values.getTextField("reason", true)
            const originalMsgOrigin = state.data.messageOrigin
            const originalMsgType = state.data.messageType

            //start reopening ticket
            await instance.defer("update", false)

            if (originalMsgType === "ticket-message"){
                //ticket message
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

            }else if (originalMsgType === "close-message"){
                //converted to reopen message
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false})
                const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build(originalMsgType, {guild, channel, user, ticket, reason}))
                if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                    messageType:"reopen-message",
                    messageOrigin:originalMsgOrigin,
                    messageAuthor:user.id,
                    messageReason:reason
                }, sentMsg.ephemeral)
            }else if (originalMsgType === "autoclose-message"){
                //converted to reopen message
                await opendiscord.actions.get("opendiscord:reopen-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false})
                const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build(originalMsgType, {guild, channel, user, ticket, reason}))
                if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                    messageType:"reopen-message",
                    messageOrigin:originalMsgOrigin,
                    messageAuthor:user.id,
                    messageReason:reason
                }, sentMsg.ephemeral)
            }
        })
    ])
}