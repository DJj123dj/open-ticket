///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const panelMsgState = opendiscord.states.get("opendiscord:panel-message")
const lang = opendiscord.languages

export async function registerCommandResponders() {
    //PANEL COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:panel", generalConfig.data.prefix, /^panel/))
    opendiscord.responders.commands.get("opendiscord:panel").workers.add([
        new api.ODWorker("opendiscord:panel", 0, async (instance, params, origin, cancel) => {
            const {guild, channel, user, member} = instance

            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance, origin, "panel")
            if (!hasPerms) return cancel()

            const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //fetch data
            const id = instance.options.getString("id", true)
            const panel = opendiscord.panels.get(id)
            if (!panel){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(origin, {guild, channel, user}))
                return cancel()
            }

            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:panel-ready").build(origin, {guild, channel, user, panel}))
            const panelMessage = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:panel").build(origin, {guild, channel, user, panel, isSubPanel:false})).message)
            if (panelMessage) await panelMsgState.setMsgState({channel, message:panelMessage}, {
                messageOrigin:origin,
                panelId:panel.id.value,
                panelOptionIds:panel.get("opendiscord:options").value,
                panelAutoUpdate:(instance.options.getBoolean("auto-update", false) ?? false),
                isSubPanel:false
            }, panelMessage.flags.has("Ephemeral"))
        }),
        new api.ODWorker("opendiscord:logs", -1, (instance, params, origin, cancel) => {
            opendiscord.log(instance.user.displayName + " used the 'panel' command!", "info", [
                {key:"user", value:instance.user.username},
                {key:"userid", value:instance.user.id, hidden:true},
                {key:"channelid", value:instance.channel.id, hidden:true},
                {key:"method", value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders() {
    //SUBPANEL OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:subpanel-option", /^od:subpanel-option\|([^|]+)/))
    opendiscord.responders.buttons.get("opendiscord:subpanel-option").workers.add(new api.ODWorker("opendiscord:subpanel-option", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        const match = /^od:subpanel-option\|([^|]+)/.exec(instance.interaction.customId)
        if (!match) return cancel()
        const optionId = match[1]

        //check message state
        const state = await panelMsgState.getMsgState({channel, message})
        if (!state){
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.panelStateExpired", ["/panel"]), layout:"simple", customTitle:"Message State Expired"}))
            return cancel()
        }

        //responder checks
        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        //get option data
        const option = opendiscord.options.get(optionId)
        if (!option || !(option instanceof api.ODSubPanelOption)){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
            return cancel()
        }

        //get panel data
        const subPanel = opendiscord.panels.get(option.get("opendiscord:panel-id").value)
        if (!subPanel){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(origin, {guild, channel, user}))
            return cancel()
        }

        //send sub-panel message (ephemeral)
        const panelMessage = await instance.reply((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("sub-panel", {guild, channel, user, panel:subPanel, isSubPanel:true})))
        if (panelMessage.success) await panelMsgState.setMsgState({channel, message:panelMessage.message}, {
            messageOrigin:"sub-panel",
            panelId:subPanel.id.value,
            panelOptionIds:subPanel.get("opendiscord:options").value,
            panelAutoUpdate:false,
            isSubPanel:true
        }, panelMessage.ephemeral)

        opendiscord.log(instance.user.displayName + " created a sub-panel!", "info", [
            {key:"user", value:instance.user.username},
            {key:"userid", value:instance.user.id, hidden:true},
            {key:"channelid", value:instance.channel.id, hidden:true},
            {key:"method", value:origin}
        ])
    }))
}

export async function registerDropdownResponders() {
    opendiscord.responders.dropdowns.add(new api.ODDropdownResponder("opendiscord:panel-dropdown", /^od:panel-dropdown/))

    //TICKET DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.get("opendiscord:panel-dropdown").workers.add(new api.ODWorker("opendiscord:dropdown-ticket", 2, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //RETURN WHEN NOT OF TYPE TICKET (role or sub-panel responders might catch it)
        const match = /^od:ticket-option\|([^|]+)/.exec(instance.values.getStringValues()[0])
        if (!match) return
        const optionId = match[1]

        //check message state
        const state = await panelMsgState.getMsgState({channel, message})
        if (!state){
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.panelStateExpired", ["/panel"]), layout:"simple", customTitle:"Message State Expired"}))
            return cancel()
        }

        //responder checks
        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        //get option data

        const option = opendiscord.options.get(optionId)
        if (!option || !(option instanceof api.ODTicketOption)){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
            return cancel()
        }

        //start ticket creation
        if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
            //SEND MODAL
            instance.modal(await opendiscord.components.modals.get("opendiscord:ticket-questions").build("panel-dropdown", {guild, channel, user, option}))
        }else{
            //check ticket permissions (modals need check after submit)
            if (!(await openticketUtils.checkTicketCreationPerms(instance, "panel-dropdown", guild, user, option))) return cancel()

            //CREATE TICKET
            await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update", true)

            const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-dropdown", {guild, user, answers:[], option})
            if (!res.channel || !res.ticket){
                //error
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel:instance.channel, user, error:"Unable to receive ticket or channel from callback! #1", layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-dropdown", {guild, channel:res.channel, user, ticket:res.ticket}))
        }

        //update panel after dropdown usage (reset panel choice)
        const panel = opendiscord.panels.get(state.data.panelId)
        if (panel){
            const panelMessage = await instance.message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update", {guild, channel, user, panel, isSubPanel:state.data.isSubPanel})).message)
            if (panelMessage) await panelMsgState.setMsgState({channel, message:panelMessage}, {
                messageOrigin:"auto-update",
                panelId:panel.id.value,
                panelOptionIds:panel.get("opendiscord:options").value,
                panelAutoUpdate:state.data.panelAutoUpdate, //same value
                isSubPanel:state.data.isSubPanel //same value
            }, panelMessage.flags.has("Ephemeral"))
        }
    }))

    //ROLE DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.get("opendiscord:panel-dropdown").workers.add(new api.ODWorker("opendiscord:dropdown-role", 1, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //RETURN WHEN NOT OF TYPE ROLE (ticket or sub-panel responders might catch it)
        const match = /^od:role-option\|([^|]+)/.exec(instance.values.getStringValues()[0])
        if (!match) return
        const optionId = match[1]

        //check message state
        const state = await panelMsgState.getMsgState({channel, message})
        if (!state){
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.panelStateExpired", ["/panel"]), layout:"simple", customTitle:"Message State Expired"}))
            return cancel()
        }

        //responder checks
        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        //get option data
        const option = opendiscord.options.get(optionId)
        if (!option || !(option instanceof api.ODRoleOption)){
            //error
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
            return cancel()
        }

        //reaction role
        await instance.defer(generalConfig.data.ticketSystem.replyOnReactionRole ? "reply" : "update", true)
        const res = await opendiscord.actions.get("opendiscord:reaction-role").run("panel-button", {guild, user, option, overwriteMode:null})
        if (!res.result || !res.role){
            //error
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel:instance.channel, user, error:"Unable to receive role update data from worker!", layout:"advanced"}))
            return cancel()
        }
        if (generalConfig.data.ticketSystem.replyOnReactionRole) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:reaction-role").build("panel-button", {guild, user, role:res.role, result:res.result}))

        //update panel after dropdown usage (reset panel choice)
        const panel = opendiscord.panels.get(state.data.panelId)
        if (panel){
            const panelMessage = await instance.message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update", {guild, channel, user, panel, isSubPanel:state.data.isSubPanel})).message)
            if (panelMessage) await panelMsgState.setMsgState({channel, message:panelMessage}, {
                messageOrigin:"auto-update",
                panelId:panel.id.value,
                panelOptionIds:panel.get("opendiscord:options").value,
                panelAutoUpdate:state.data.panelAutoUpdate, //same value
                isSubPanel:state.data.isSubPanel //same value
            }, panelMessage.flags.has("Ephemeral"))
        }
    }))

    //SUB-PANEL DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.get("opendiscord:panel-dropdown").workers.add(new api.ODWorker("opendiscord:dropdown-subpanel", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        //RETURN WHEN NOT OF TYPE SUB-PANEL (ticket or role responders might catch it)
        const match = /^od:subpanel-option\|([^|]+)/.exec(instance.values.getStringValues()[0])
        if (!match) return
        const optionId = match[1]

        //check message state
        const state = await panelMsgState.getMsgState({channel, message})
        if (!state){
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin, {guild, channel, user, error:lang.getTranslationWithParams("errors.descriptions.panelStateExpired", ["/panel"]), layout:"simple", customTitle:"Message State Expired"}))
            return cancel()
        }

        //responder checks
        const isInGuild = await openticketUtils.replyIsInGuild(instance, origin)
        if (!isInGuild || !guild || channel.isDMBased()) return cancel()

        //get option data
        const option = opendiscord.options.get(optionId)
        if (!option || !(option instanceof api.ODSubPanelOption)){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
            return cancel()
        }

        //get panel data
        const subPanel = opendiscord.panels.get(option.get("opendiscord:panel-id").value)
        if (!subPanel){
            instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(origin, {guild, channel, user}))
            return cancel()
        }

        //send sub-panel message (ephemeral)
        const panelMessage = await instance.reply((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("sub-panel", {guild, channel, user, panel:subPanel, isSubPanel:true})))
        if (panelMessage.success) await panelMsgState.setMsgState({channel, message:panelMessage.message}, {
            messageOrigin:"sub-panel",
            panelId:subPanel.id.value,
            panelOptionIds:subPanel.get("opendiscord:options").value,
            panelAutoUpdate:false,
            isSubPanel:true
        }, panelMessage.ephemeral)

        opendiscord.log(instance.user.displayName + " created a sub-panel!", "info", [
            {key:"user", value:instance.user.username},
            {key:"userid", value:instance.user.id, hidden:true},
            {key:"channelid", value:instance.channel.id, hidden:true},
            {key:"method", value:origin}
        ])

        //update panel after dropdown usage (reset panel choice)
        const panel = opendiscord.panels.get(state.data.panelId)
        if (panel){
            const panelMessage = await instance.message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update", {guild, channel, user, panel, isSubPanel:state.data.isSubPanel})).message)
            if (panelMessage) await panelMsgState.setMsgState({channel, message:panelMessage}, {
                messageOrigin:"auto-update",
                panelId:panel.id.value,
                panelOptionIds:panel.get("opendiscord:options").value,
                panelAutoUpdate:state.data.panelAutoUpdate, //same value
                isSubPanel:state.data.isSubPanel //same value
            }, panelMessage.flags.has("Ephemeral"))
        }
    }))
}