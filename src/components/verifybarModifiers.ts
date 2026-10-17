///////////////////////////////////////
//VERIFYBAR MESSAGE MODIFIERS
///////////////////////////////////////
import { opendiscord, api, utilities } from "../index.js"
import * as discord from "discord.js"

const modifiers = opendiscord.components.modifiers
const lang = opendiscord.languages
const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function addVerifyButton(instance:api.ODMessageInstance|api.ODComponentFactoryInstance<api.ODMessageComponent>, params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, defaultButtonType:"✅"|"❌", useDefaultLabels:boolean, verifyButtonId:string, customLabel?:string, customColor?:api.ODValidButtonColor, customEmoji?:string) {
    const {guild, channel, user, verifybar} = params
    if (instance instanceof api.ODMessageInstance){
        //message builders
        instance.addComponent(await opendiscord.builders.buttons.getSafe("opendiscord:verifybar-button").build("verifybar", {
            guild, channel, user, verifybar,
            defaultButtonType, useDefaultLabels, customColor, customEmoji, customLabel,
            verifyButtonId
        }))
    }else{
        //message components
        throw new api.ODSystemError("registerAllVerifyBarModifiers addVerifyButton() => verifybar doesn't support ODComponents v2 yet!")
        //const message = instance.getComponent()
        //if (!message) return
        //const actionRow: api.ODActionRowComponent|null = message.getComponentsOfType("action-row")[0]
        //if (actionRow) actionRow.addComponent(new api.ODButtonComponent("opendiscord:verifybar-button",{
        ////TODO
        //}),"end")
    }
}

export async function registerAllVerifyBarModifiers() {
    //CLOSE TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:close-ticket-verifybar"))
    modifiers.get("opendiscord:close-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:close-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or close with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.close"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))

    //REOPEN TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:reopen-ticket-verifybar"))
    modifiers.get("opendiscord:reopen-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:reopen-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or reopen with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.reopen"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))

    //DELETE TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:delete-ticket-verifybar"))
    modifiers.get("opendiscord:delete-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:delete-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or delete with reason or without transcript
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.delete"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
        if (generalConfig.data.ticketSystem.enableDeleteWithoutTranscript) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithoutTranscript, lang.getTranslation("actions.buttons.withoutTranscript"), "red", "📄")
    }))

    //CLAIM TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:claim-ticket-verifybar"))
    modifiers.get("opendiscord:claim-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:claim-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or claim with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.claim"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))

    //UNCLAIM TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:unclaim-ticket-verifybar"))
    modifiers.get("opendiscord:unclaim-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:unclaim-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or unclaim with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.unclaim"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))

    //PIN TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:pin-ticket-verifybar"))
    modifiers.get("opendiscord:pin-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:pin-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or pin with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.pin"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))

    //UNPIN TICKET VERIFYBAR
    modifiers.add(new api.ODMessageComponentModifier("opendiscord:unpin-ticket-verifybar"))
    modifiers.get("opendiscord:unpin-ticket-verifybar").workers.add(new api.ODWorker("opendiscord:unpin-ticket-verifybar", 100, async (instance, params, origin, cancel) => {
        if (instance instanceof api.ODMessageInstance){
            instance.data.components = [] //clear actionrow
        }else{
            throw new api.ODSystemError("registerAllVerifyBarModifiers()... => verifybars don't support ODComponents v2 yet!")
        }

        //cancel, accept or unpin with reason
        await addVerifyButton(instance, params, "❌", true, api.ODVerifyButtonId.Cancel)
        await addVerifyButton(instance, params, "✅", true, api.ODVerifyButtonId.Accept, lang.getTranslation("actions.buttons.unpin"))
        if (generalConfig.data.ticketSystem.enableTicketActionWithReason) await addVerifyButton(instance, params, "✅", false, api.ODVerifyButtonId.AcceptWithReason, lang.getTranslation("actions.buttons.withReason"), "blue", "✏️")
    }))
}