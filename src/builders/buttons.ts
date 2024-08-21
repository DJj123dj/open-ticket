///////////////////////////////////////
//BUTTON BUILDERS
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const buttons = openticket.builders.buttons
const lang = openticket.languages
const generalConfig = openticket.configs.get("openticket:general")

export const registerAllButtons = async () => {
    verifybarButtons()
    errorButtons()
    helpMenuButtons()
    panelButtons()
    ticketButtons()
    transcriptButtons()
    clearButtons()
}

const verifybarButtons = () => {
    //VERIFYBAR SUCCESS
    buttons.add(new api.ODButton("openticket:verifybar-success"))
    buttons.get("openticket:verifybar-success").workers.add(
        new api.ODWorker("openticket:verifybar-success",0,async (instance,params) => {
            const {verifybar,customData,customColor,customLabel,customEmoji} = params

            if (customData && customData.length > 40) throw new api.ODSystemError("ODButton:openticket:verifybar-success => customData exceeds 40 characters limit!")

            const newData = (customData) ? "_"+customData : ""
            const newColor = customColor ?? "gray"
            const newLabel = customLabel ?? ""
            const newEmoji = customEmoji ?? "✅"

            instance.setCustomId("od:verifybar-success_"+verifybar.id.value+newData)
            instance.setMode("button")
            instance.setColor(newColor)
            if (newLabel) instance.setLabel(newLabel)
            if (newEmoji) instance.setEmoji(newEmoji)
        })
    )

    //VERIFYBAR FAILURE
    buttons.add(new api.ODButton("openticket:verifybar-failure"))
    buttons.get("openticket:verifybar-failure").workers.add(
        new api.ODWorker("openticket:verifybar-failure",0,async (instance,params) => {
            const {verifybar,customData,customColor,customLabel,customEmoji} = params

            if (customData && customData.length > 40) throw new api.ODSystemError("ODButton:openticket:verifybar-success => customData exceeds 40 characters limit!")

            const newData = (customData) ? "_"+customData : ""
            const newColor = customColor ?? "gray"
            const newLabel = customLabel ?? ""
            const newEmoji = customEmoji ?? "❌"

            instance.setCustomId("od:verifybar-failure_"+verifybar.id.value+newData)
            instance.setMode("button")
            instance.setColor(newColor)
            if (newLabel) instance.setLabel(newLabel)
            if (newEmoji) instance.setEmoji(newEmoji)
        })
    )
}

const errorButtons = () => {
    //ERROR TICKET DEPRECATED TRANSCRIPT
    buttons.add(new api.ODButton("openticket:error-ticket-deprecated-transcript"))
    buttons.get("openticket:error-ticket-deprecated-transcript").workers.add(
        new api.ODWorker("openticket:error-ticket-deprecated-transcript",0,async (instance,params) => {
            
            instance.setCustomId("od:error-ticket-deprecated-transcript")
            instance.setMode("button")
            instance.setColor("gray")
            instance.setLabel(lang.getTranslation("transcripts.errors.backup"))
            instance.setEmoji("📄")
        })
    )
}

const helpMenuButtons = () => {
    //HELP MENU PAGE
    buttons.add(new api.ODButton("openticket:help-menu-page"))
    buttons.get("openticket:help-menu-page").workers.add(
        new api.ODWorker("openticket:help-menu-page",0,async (instance,params) => {
            const {mode,page} = params
            const totalPages = (await openticket.helpmenu.render(mode)).length
            const pageText = (page+1).toString()+"/"+totalPages.toString()

            instance.setCustomId("od:help-menu-page_"+page.toString())
            instance.setMode("button")
            instance.setColor("gray")
            instance.setLabel(lang.getTranslationWithParams("actions.buttons.helpPage",[pageText]))
            instance.setDisabled(true)
        })
    )

    //HELP MENU SWITCH
    buttons.add(new api.ODButton("openticket:help-menu-switch"))
    buttons.get("openticket:help-menu-switch").workers.add(
        new api.ODWorker("openticket:help-menu-switch",0,async (instance,params) => {
            const {mode} = params

            instance.setCustomId("od:help-menu-switch_"+mode)
            instance.setMode("button")
            instance.setColor("gray")
            if (mode == "slash") instance.setLabel(lang.getTranslation("actions.buttons.helpSwitchText"))
            else instance.setLabel(lang.getTranslation("actions.buttons.helpSwitchSlash"))
        })
    )

    //HELP MENU PREVIOUS
    buttons.add(new api.ODButton("openticket:help-menu-previous"))
    buttons.get("openticket:help-menu-previous").workers.add(
        new api.ODWorker("openticket:help-menu-previous",0,async (instance,params) => {
            const {page} = params
            
            instance.setCustomId("od:help-menu-previous")
            instance.setMode("button")
            instance.setColor("gray")
            instance.setEmoji("◀️")
            if (page == 0) instance.setDisabled(true)
        })
    )

    //HELP MENU NEXT
    buttons.add(new api.ODButton("openticket:help-menu-next"))
    buttons.get("openticket:help-menu-next").workers.add(
        new api.ODWorker("openticket:help-menu-next",0,async (instance,params) => {
            const {mode,page} = params
            const totalPages = (await openticket.helpmenu.render(mode)).length
            
            instance.setCustomId("od:help-menu-next")
            instance.setMode("button")
            instance.setColor("gray")
            instance.setEmoji("▶️")
            if (page == totalPages-1) instance.setDisabled(true)
        })
    )
}

const panelButtons = () => {
    //TICKET OPTION
    buttons.add(new api.ODButton("openticket:ticket-option"))
    buttons.get("openticket:ticket-option").workers.add(
        new api.ODWorker("openticket:ticket-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setCustomId("od:ticket-option_"+panel.id.value+"_"+option.id.value)
            instance.setMode("button")
            instance.setColor(option.get("openticket:button-color").value)
            if (option.get("openticket:button-emoji").value) instance.setEmoji(option.get("openticket:button-emoji").value)
            if (option.get("openticket:button-label").value) instance.setLabel(option.get("openticket:button-label").value)
            if (!option.get("openticket:button-emoji").value && !option.get("openticket:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )

    //WEBSITE OPTION
    buttons.add(new api.ODButton("openticket:website-option"))
    buttons.get("openticket:website-option").workers.add(
        new api.ODWorker("openticket:website-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setMode("url")
            instance.setUrl(option.get("openticket:url").value)
            if (option.get("openticket:button-emoji").value) instance.setEmoji(option.get("openticket:button-emoji").value)
            if (option.get("openticket:button-label").value) instance.setLabel(option.get("openticket:button-label").value)
            if (!option.get("openticket:button-emoji").value && !option.get("openticket:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )

    //ROLE OPTION
    buttons.add(new api.ODButton("openticket:role-option"))
    buttons.get("openticket:role-option").workers.add(
        new api.ODWorker("openticket:role-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setCustomId("od:role-option_"+panel.id.value+"_"+option.id.value)
            instance.setMode("button")
            instance.setColor(option.get("openticket:button-color").value)
            if (option.get("openticket:button-emoji").value) instance.setEmoji(option.get("openticket:button-emoji").value)
            if (option.get("openticket:button-label").value) instance.setLabel(option.get("openticket:button-label").value)
            if (!option.get("openticket:button-emoji").value && !option.get("openticket:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )
}

const ticketButtons = () => {
    //VISIT TICKET
    buttons.add(new api.ODButton("openticket:visit-ticket"))
    buttons.get("openticket:visit-ticket").workers.add(
        new api.ODWorker("openticket:visit-ticket",0,async (instance,params) => {
            const {guild,channel,ticket} = params
            
            instance.setMode("url")
            instance.setUrl(channel.url)
            instance.setEmoji("🎫")
            instance.setLabel(lang.getTranslation("actions.buttons.create"))
        })
    )

    //CLOSE TICKET
    buttons.add(new api.ODButton("openticket:close-ticket"))
    buttons.get("openticket:close-ticket").workers.add(
        new api.ODWorker("openticket:close-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:close-ticket_"+source)
            instance.setColor("gray")
            instance.setEmoji("🔒")
            instance.setLabel(lang.getTranslation("actions.buttons.close"))
        })
    )

    //DELETE TICKET
    buttons.add(new api.ODButton("openticket:delete-ticket"))
    buttons.get("openticket:delete-ticket").workers.add(
        new api.ODWorker("openticket:delete-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:delete-ticket_"+source)
            instance.setColor("red")
            instance.setEmoji("✖")
            instance.setLabel(lang.getTranslation("actions.buttons.delete"))
        })
    )

    //REOPEN TICKET
    buttons.add(new api.ODButton("openticket:reopen-ticket"))
    buttons.get("openticket:reopen-ticket").workers.add(
        new api.ODWorker("openticket:reopen-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:reopen-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("🔓")
            instance.setLabel(lang.getTranslation("actions.buttons.reopen"))
        })
    )

    //CLAIM TICKET
    buttons.add(new api.ODButton("openticket:claim-ticket"))
    buttons.get("openticket:claim-ticket").workers.add(
        new api.ODWorker("openticket:claim-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:claim-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("👋")
            instance.setLabel(lang.getTranslation("actions.buttons.claim"))
        })
    )

    //UNCLAIM TICKET
    buttons.add(new api.ODButton("openticket:unclaim-ticket"))
    buttons.get("openticket:unclaim-ticket").workers.add(
        new api.ODWorker("openticket:unclaim-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:unclaim-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("↩️")
            instance.setLabel(lang.getTranslation("actions.buttons.unclaim"))
        })
    )

    //PIN TICKET
    buttons.add(new api.ODButton("openticket:pin-ticket"))
    buttons.get("openticket:pin-ticket").workers.add(
        new api.ODWorker("openticket:pin-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:pin-ticket_"+source)
            instance.setColor("gray")
            instance.setEmoji("📌")
            instance.setLabel(lang.getTranslation("actions.buttons.pin"))
        })
    )

    //UNPIN TICKET
    buttons.add(new api.ODButton("openticket:unpin-ticket"))
    buttons.get("openticket:unpin-ticket").workers.add(
        new api.ODWorker("openticket:unpin-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:unpin-ticket_"+source)
            instance.setColor("gray")
            instance.setEmoji("📌")
            instance.setLabel(lang.getTranslation("actions.buttons.unpin"))
        })
    )
}

const transcriptButtons = () => {
    //TRANSCRIPT HTML VISIT
    buttons.add(new api.ODButton("openticket:transcript-html-visit"))
    buttons.get("openticket:transcript-html-visit").workers.add(
        new api.ODWorker("openticket:transcript-html-visit",0,async (instance,params,source) => {
            const {result} = params
            instance.setMode("url")
            if (result.data) instance.setUrl(result.data.url)
            else throw new api.ODSystemError("ODButton:openticket:transcript-html-visit => Missing Transcript Result Data!")
            instance.setEmoji("📄")
            instance.setLabel(lang.getTranslation("transcripts.success.visit"))
        })
    )

    //TRANSCRIPT ERROR RETRY
    buttons.add(new api.ODButton("openticket:transcript-error-retry"))
    buttons.get("openticket:transcript-error-retry").workers.add(
        new api.ODWorker("openticket:transcript-error-retry",0,async (instance,params,source) => {
            instance.setMode("button")
            instance.setCustomId("od:transcript-error-retry_"+source)
            instance.setColor("gray")
            instance.setEmoji("🔄")
            instance.setLabel(lang.getTranslation("transcripts.errors.retry"))
        })
    )

    //TRANSCRIPT ERROR CONTINUE
    buttons.add(new api.ODButton("openticket:transcript-error-continue"))
    buttons.get("openticket:transcript-error-continue").workers.add(
        new api.ODWorker("openticket:transcript-error-continue",0,async (instance,params,source) => {
            instance.setMode("button")
            instance.setCustomId("od:transcript-error-continue_"+source)
            instance.setColor("red")
            instance.setEmoji("✖")
            instance.setLabel(lang.getTranslation("transcripts.errors.continue"))
        })
    )
}

const clearButtons = () => {
    //CLEAR CONTINUE
    buttons.add(new api.ODButton("openticket:clear-continue"))
    buttons.get("openticket:clear-continue").workers.add(
        new api.ODWorker("openticket:clear-continue",0,async (instance,params,source) => {
            instance.setMode("button")
            instance.setCustomId("od:clear-continue_"+source+"_"+params.filter)
            instance.setColor("red")
            instance.setEmoji("✖")
            instance.setLabel(lang.getTranslation("actions.buttons.clear"))
        })
    )
}