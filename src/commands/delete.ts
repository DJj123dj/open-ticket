///////////////////////////////////////
//DELETE COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerCommandResponders() {
    //DELETE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:delete", generalConfig.data.prefix, "delete"))
    opendiscord.responders.commands.get("opendiscord:delete").workers.add([
        new api.ODWorker("opendiscord:delete", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "delete")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const isTicketOpen = await openticketUtils.replyTicketMustBeOpen(instance, origin, ticket)
            if (!isTicketOpen) return cancel()

            const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "delete")
            if (!messagesHaveBeenSent) return cancel()

            //don't allow deleteWithoutTranscript to non-global-admins when enabled
            const withoutTranscript = instance.options.getBoolean("notranscript", false) ?? false
            if (withoutTranscript && generalConfig.data.ticketSystem.adminOnlyDeleteWithoutTranscript){
                if (!opendiscord.permissions.hasPermissions("support", await opendiscord.permissions.getPermissions(instance.user, instance.channel, instance.guild, {allowChannelRoleScope:false, allowChannelUserScope:false, allowGlobalRoleScope:true, allowGlobalUserScope:true}))){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button", {guild:instance.guild, channel:instance.channel, user:instance.user, permissions:["support"]}))
                    return cancel()
                }
            }

            //start deleting ticket
            await instance.defer(false)
            const reason = instance.options.getString("reason", false)
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(origin, {guild, channel, user, ticket, reason}))
            await opendiscord.actions.get("opendiscord:delete-ticket").run(origin, {guild, channel, user, ticket, reason, sendMessage:false, withoutTranscript})
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'delete' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //DELETE TICKET BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:delete-ticket", /^od:delete-ticket/))
    opendiscord.responders.buttons.get("opendiscord:delete-ticket").workers.add(new api.ODWorker("opendiscord:delete-ticket", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, message, user, member} = instance

        //responder checks
        const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "delete")
        if (!hasPerms) return cancel()

        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/delete")
        if (!state) return cancel()

        const ticket = await openticketUtils.replyIsTicket(instance, origin)
        if (!ticket) return cancel()

        const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
        if (!isAvailable) return cancel()

        const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "delete")
        if (!messagesHaveBeenSent) return cancel()

        //fetch state details
        const verifybar = opendiscord.verifybars.get("opendiscord:delete-ticket")
        const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
        const originalReason = state.data.messageReason ?? null
        const originalMsgType = state.data.messageType

        //send verifybar
        if (generalConfig.data.ticketSystem.disableVerifyBars){
            //verifybar disabled, directly run response
            await verifybar.activate(instance, "accept")

        }else if (originalMsgType === "ticket-message"){
            //ticket message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:delete-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:ticket-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user, ticket}))
        }else if (originalMsgType === "close-message"){
            //close message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:delete-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:close-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }else if (originalMsgType === "reopen-message"){
            //reopen message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:delete-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:reopen-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
        }else if (originalMsgType === "autoclose-message"){
            //autoclose message verifybar
            const modifiedMsg = opendiscord.components.modifiers.get("opendiscord:delete-ticket-verifybar").modify(opendiscord.builders.messages.getSafe("opendiscord:autoclose-message"), originalMsgType, {guild, channel, user, verifybar})
            await instance.update(await modifiedMsg.build("verifybar", {guild, channel, user:originalUser, ticket}))
        }
    }))
}

export async function registerVerifyBars() {
    //DELETE TICKET
    opendiscord.verifybars.add(new api.ODVerifyBar("opendiscord:delete-ticket"))
    opendiscord.verifybars.get("opendiscord:delete-ticket").workers.add([
        new api.ODWorker("opendiscord:delete-ticket", 0, async (instance, params, origin, cancel) => {
            const {user, member, channel, guild, message} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "delete")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/delete")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            const messagesHaveBeenSent = await openticketUtils.replyMessageMustBeSentBeforeClose(instance, origin, ticket, "delete")
            if (!messagesHaveBeenSent) return cancel()

            //don't allow deleteWithoutTranscript to non-global-admins when enabled
            const withoutTranscript = (params.selectedButtonId === "accept-without-transcript")
            if (withoutTranscript && generalConfig.data.ticketSystem.adminOnlyDeleteWithoutTranscript){
                if (!opendiscord.permissions.hasPermissions("support", await opendiscord.permissions.getPermissions(instance.user, instance.channel, instance.guild, {allowChannelRoleScope:false, allowChannelUserScope:false, allowGlobalRoleScope:true, allowGlobalUserScope:true}))){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button", {guild:instance.guild, channel:instance.channel, user:instance.user, permissions:["support"]}))
                    return cancel()
                }
            }

            //fetch state details
            const originalUser = ((state.data.messageAuthor) ? await opendiscord.client.fetchUser(state.data.messageAuthor) : user) ?? user
            const originalReason = state.data.messageReason ?? null
            const originalMsgType = state.data.messageType

            //start deleting ticket
            if (params.selectedButtonId === "cancel"){
                //CANCEL
                if (originalMsgType === "ticket-message"){
                    //ticket message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("verifybar", {guild, channel, user, ticket}))
                }else if (originalMsgType === "close-message"){
                    //close message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:close-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }else if (originalMsgType === "reopen-message"){
                    //reopen message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:reopen-message").build("verifybar", {guild, channel, user:originalUser, ticket, reason:originalReason}))
                }else if (originalMsgType === "autoclose-message"){
                    //autoclose message
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:autoclose-message").build("verifybar", {guild, channel, user:originalUser, ticket}))
                }
            }else if (params.selectedButtonId === "accept" || params.selectedButtonId === "accept-without-transcript"){
                //DELETE TICKET
                await instance.defer("update", false)

                if (originalMsgType === "ticket-message"){
                    //ticket message
                    opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:true, withoutTranscript})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

                }else if (originalMsgType === "close-message"){
                    //converted to delete message
                    opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false, withoutTranscript})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason:null}))

                }else if (originalMsgType === "reopen-message"){
                    //converted to delete message
                    opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false, withoutTranscript})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason:null}))

                }else if (originalMsgType === "autoclose-message"){
                    //converted to delete message
                    opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason:null, sendMessage:false, withoutTranscript})
                    await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason:null}))

                }
            }else if (params.selectedButtonId === "accept-with-reason"){
                //DELETE WITH REASON (MODAL)
                instance.modal(await opendiscord.components.modals.get("opendiscord:delete-ticket-reason").build("other", {guild, channel, user, ticket, message}))
            }
        })
    ])
}

export async function registerModalResponders() {
    //DELETE WITH REASON MODAL RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:delete-ticket-reason", /^od:delete-ticket-reason\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:delete-ticket-reason").workers.add([
        new api.ODWorker("opendiscord:delete-ticket-reason", 0, async (instance, params, origin, cancel) => {
            const {guild, user} = instance

            const match = /^od:delete-ticket-reason\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const channel = await opendiscord.client.fetchTextChannel(match[1])
            const message = await opendiscord.client.fetchChannelMessage(match[1], match[2])

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "delete")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            const state = await openticketUtils.replyInteractiveMessageState(instance, origin, channel, message, "/delete")
            if (!state) return cancel()

            const ticket = await openticketUtils.replyIsTicket(instance, origin)
            if (!ticket) return cancel()

            const isAvailable = await openticketUtils.replyTicketIsAvailable(instance, origin, ticket)
            if (!isAvailable) return cancel()

            //fetch state details
            const reason = instance.values.getTextField("reason", true)
            const originalMsgOrigin = state.data.messageOrigin
            const originalMsgType = state.data.messageType

            //start deleting ticket
            //don't await DELETE action => else it will update the message after the channel has been deleted
            await instance.defer("update", false)

            if (originalMsgType === "ticket-message"){
                //ticket message
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:true, withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other", {guild, channel, user, ticket}))

            }else if (originalMsgType === "close-message"){
                //converted to delete message
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false, withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason}))

            }else if (originalMsgType === "reopen-message"){
                //converted to delete message
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false, withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason}))

            }else if (originalMsgType === "autoclose-message"){
                //converted to delete message
                opendiscord.actions.get("opendiscord:delete-ticket").run(originalMsgType, {guild, channel, user, ticket, reason, sendMessage:false, withoutTranscript:false})
                await instance.update(await opendiscord.builders.messages.getSafe("opendiscord:delete-message").build(originalMsgType, {guild, channel, user, ticket, reason}))

            }
        })
    ])
}