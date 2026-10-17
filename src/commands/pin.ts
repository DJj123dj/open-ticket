///////////////////////////////////////
//PIN COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerCommandResponders() {
    //PIN COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:pin", generalConfig.data.prefix, "pin"))
    opendiscord.responders.commands.get("opendiscord:pin").workers.add([
        new api.ODWorker("opendiscord:pin", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "pin")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnpinned = await openticketUtils.replyTicketMustBeUnpinned(instance, origin, ticket)
            if (!isTicketUnpinned) return cancel()

            //start pinning ticket
            await instance.defer(false)
            const reason = instance.options.getString("reason", false)
            await opendiscord.actions.get("opendiscord:pin-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false})

            //send message & set state
            const sentMsg = await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:pin-message").build(origin, {guild, channel, user, ticket, reason}))
            if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                messageType:"pin-message",
                messageOrigin:origin,
                messageAuthor:user.id,
                messageReason:reason
            }, sentMsg.ephemeral)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'pin' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //PIN TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:pin-ticket", /^od:pin-ticket/))
    opendiscord.responders.buttons.get("opendiscord:pin-ticket").workers.add(new api.ODWorker("opendiscord:pin-ticket", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "pin")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/pin")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        const isTicketUnpinned = await openticketUtils.replyTicketMustBeUnpinned(instance, origin, ticket)
        if (!isTicketUnpinned) return cancel()

        //fetch state details
        const verifybar = opendiscord.verifybars.get("opendiscord:pin-ticket")
        const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
        const originalReason = state.data.messageReason ?? null
        const originalMsgType = state.data.messageType

        //send verifybar
        if (generalConfig.data.ticketSystem.disableVerifyBars){
            //verifybar disabled, directly run response
            await verifybar.activate(instance, "accept")

        }else if (originalMsgType === "ticket-message"){
            //ticket message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:pin-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:ticket-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user, ticket}))
        }else if (originalMsgType === "unpin-message"){
            //unpin message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:pin-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:unpin-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }
    }))
}


export async function registerVerifyBars() {
    //PIN TICKET
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:pin-ticket"))
    opendiscord.verifybars.get("opendiscord:pin-ticket").workers.add([
        new api.ODWorker("opendiscord:pin-ticket", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild, message} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "pin")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/pin")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnpinned = await openticketUtils.replyTicketMustBeUnpinned(instance, origin, ticket)
            if (!isTicketUnpinned) return cancel()

            //fetch state details
            const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
            const originalReason = state.data.messageReason ?? null
            const originalMsgType = state.data.messageType

            //start pinning ticket
            if (params.selectedButtonId === "cancel"){
                //CANCEL
                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "unpin-message"){
                    //unpin message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:unpin-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }
            }else if (params.selectedButtonId === "accept"){
                //PIN TICKET
                await instance.defer("update", false)

                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await opendiscord.actions.get("opendiscord:pin-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "unpin-message"){
                    //converted to pin message
                    await opendiscord.actions.get("opendiscord:pin-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                    const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:pin-message").build("verifybar", {guild, channel, user, ticket, reason:null}))
                    if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                        messageType:"pin-message",
                        messageOrigin:origin,
                        messageAuthor:user.id,
                        messageReason:null
                    }, sentMsg.ephemeral)
                }
            }else if (params.selectedButtonId === "accept-with-reason"){
                //PIN WITH REASON (MODAL)
                instance.modal(await opendiscord.components.modals.get("opendiscord:pin-ticket-reason").build("other", {guild, channel, user, ticket, message}))
            }
        })
    ])
}

export async function registerModalResponders() {
    //PIN WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:pin-ticket-reason", /^od:pin-ticket-reason\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:pin-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:pin-ticket-reason", 0, async (instance, params, origin, cancel) => {
            const {guild, user} = instance

            const match = /^od:pin-ticket-reason\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const channel = await opendiscord.client.fetchTextChannel(match[1])
            const message = await opendiscord.client.fetchChannelMessage(match[1], match[2])

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "pin")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/pin")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnpinned = await openticketUtils.replyTicketMustBeUnpinned(instance, origin, ticket)
            if (!isTicketUnpinned) return cancel()

            //fetch state details
            const reason = instance.values.getTextField("reason", true)
            const originalMsgOrigin = state.data.messageOrigin
            const originalMsgType = state.data.messageType

            //start pinning ticket
            await instance.defer("update", false)

            if (originalMsgType === "ticket-message"){
                //ticket message
                await opendiscord.actions.get("opendiscord:pin-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

            }else if (originalMsgType === "unpin-message"){
                //converted to pin message
                await opendiscord.actions.get("opendiscord:pin-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false})
                const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:pin-message").build(originalMsgType, {guild, channel, user, ticket, reason}))
                if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                    messageType:"pin-message",
                    messageOrigin:originalMsgOrigin,
                    messageAuthor:user.id,
                    messageReason:reason
                }, sentMsg.ephemeral)
            }
        })
    ])
}