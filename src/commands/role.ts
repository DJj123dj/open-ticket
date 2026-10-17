///////////////////////////////////////
//ROLE BUTTON (not command)
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const panelMsgState = opendiscord.states.get("opendiscord:panel-message")
const lang = opendiscord.languages

export async function registerButtonResponders() {
    //ROLE OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:role-option", /^od:role-option\|([^|]+)/))
    opendiscord.responders.buttons.get("opendiscord:role-option").workers.add(new api.ODWorker("opendiscord:role-option", 0, async (instance, params, origin, cancel) => {
        const {guild, channel, user, message} = instance

        const match = /^od:role-option\|([^|]+)/.exec(instance.interaction.customId)
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
    }))
}