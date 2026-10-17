///////////////////////////////////////
//CLAIM COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerCommandResponders() {
    //CLAIM COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:claim", generalConfig.data.prefix, "claim"))
    opendiscord.responders.commands.get("opendiscord:claim").workers.add([
        new api.ODWorker("opendiscord:claim", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "claim")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnclaimed = await openticketUtils.replyTicketMustBeUnclaimed(instance, origin, ticket)
            if (!isTicketUnclaimed) return cancel()

            //start claiming ticket
            await instance.defer(false)
            const reason = instance.options.getString("reason", false)
            const claimUser = instance.options.getUser("user", false) ?? user
            await opendiscord.actions.get("opendiscord:claim-ticket").run(origin, {guild, channel, user:claimUser, ticket, reason, sendMessage:false})

            //send message & set state
            const sentMsg = await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build(origin, {guild, channel, user:claimUser, ticket, reason}))
            if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                messageType:"claim-message",
                messageOrigin:origin,
                messageAuthor:claimUser.id,
                messageReason:reason
            }, sentMsg.ephemeral)
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'claim' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //CLAIM TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:claim-ticket", /^od:claim-ticket/))
    opendiscord.responders.buttons.get("opendiscord:claim-ticket").workers.add(new api.ODWorker("opendiscord:claim-ticket", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "claim")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/claim")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        const isTicketUnclaimed = await openticketUtils.replyTicketMustBeUnclaimed(instance, origin, ticket)
        if (!isTicketUnclaimed) return cancel()

        //fetch state details
        const verifybar = opendiscord.verifybars.get("opendiscord:claim-ticket")
        const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
        const originalReason = state.data.messageReason ?? null
        const originalMsgType = state.data.messageType

        //send verifybar
        if (generalConfig.data.ticketSystem.disableVerifyBars){
            //verifybar disabled, directly run response
            await verifybar.activate(instance, "accept")

        }else if (originalMsgType === "ticket-message"){
            //ticket message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:claim-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:ticket-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user, ticket}))
        }else if (originalMsgType === "unclaim-message"){
            //unclaim message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:claim-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:unclaim-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }
    }))
}

export async function registerVerifyBars() {
    //CLAIM TICKET
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:claim-ticket"))
    opendiscord.verifybars.get("opendiscord:claim-ticket").workers.add([
        new api.ODWorker("opendiscord:claim-ticket", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild, message} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "claim")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/claim")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnclaimed = await openticketUtils.replyTicketMustBeUnclaimed(instance, origin, ticket)
            if (!isTicketUnclaimed) return cancel()

            //fetch state details
            const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
            const originalReason = state.data.messageReason ?? null
            const originalMsgType = state.data.messageType

            //start claiming ticket
            if (params.selectedButtonId === "cancel"){
                //CANCEL
                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "unclaim-message"){
                    //unclaim message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:unclaim-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }
            }else if (params.selectedButtonId === "accept"){
                //CLAIM TICKET
                await instance.defer("update", false)

                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await opendiscord.actions.get("opendiscord:claim-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "unclaim-message"){
                    //converted to claim message
                    await opendiscord.actions.get("opendiscord:claim-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false})
                    const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build("verifybar", {guild, channel, user, ticket, reason:null}))
                    if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                        messageType:"claim-message",
                        messageOrigin:origin,
                        messageAuthor:user.id,
                        messageReason:null
                    }, sentMsg.ephemeral)
                }
            }else if (params.selectedButtonId === "accept-with-reason"){
                //CLAIM WITH REASON (MODAL)
                instance.modal(await opendiscord.components.modals.get("opendiscord:claim-ticket-reason").build("other", {guild, channel, user, ticket, message}))
            }
        })
    ])
}

export async function registerModalResponders() {
    //CLAIM WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:claim-ticket-reason", /^od:claim-ticket-reason\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:claim-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:claim-ticket-reason", 0, async (instance, params, origin, cancel) => {
            const {guild, user} = instance

            const match = /^od:claim-ticket-reason\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const channel = await opendiscord.client.fetchTextChannel(match[1])
            const message = await opendiscord.client.fetchChannelMessage(match[1], match[2])

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "claim")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/claim")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketUnclaimed = await openticketUtils.replyTicketMustBeUnclaimed(instance, origin, ticket)
            if (!isTicketUnclaimed) return cancel()

            //fetch state details
            const reason = instance.values.getTextField("reason", true)
            const originalMsgOrigin = state.data.messageOrigin
            const originalMsgType = state.data.messageType

            //start claiming ticket
            await instance.defer("update", false)

            if (originalMsgType === "ticket-message"){
                //ticket message
                await opendiscord.actions.get("opendiscord:claim-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:true})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

            }else if (originalMsgType === "unclaim-message"){
                //converted to claim message
                await opendiscord.actions.get("opendiscord:claim-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false})
                const sentMsg = await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:claim-message").build(originalMsgType, {guild, channel, user, ticket, reason}))
                if (sentMsg.success) await interactiveMsgState.setMsgState({channel, message:sentMsg.message}, {
                    messageType:"claim-message",
                    messageOrigin:originalMsgOrigin,
                    messageAuthor:user.id,
                    messageReason:reason
                }, sentMsg.ephemeral)
            }
        })
    ])
}