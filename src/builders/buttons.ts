///////////////////////////////////////
//BUTTON BUILDERS
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const buttons = opendiscord.builders.buttons
const lang = opendiscord.languages
const generalConfig = opendiscord.configs.get("opendiscord:general")

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
    buttons.add(new api.ODButton("opendiscord:verifybar-success"))
    buttons.get("opendiscord:verifybar-success").workers.add(
        new api.ODWorker("opendiscord:verifybar-success",0,async (instance,params) => {
            const {verifybar,customData,customColor,customLabel,customEmoji} = params

            if (customData && customData.length > 40) throw new api.ODSystemError("ODButton:opendiscord:verifybar-success => customData exceeds 40 characters limit!")

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
    buttons.add(new api.ODButton("opendiscord:verifybar-failure"))
    buttons.get("opendiscord:verifybar-failure").workers.add(
        new api.ODWorker("opendiscord:verifybar-failure",0,async (instance,params) => {
            const {verifybar,customData,customColor,customLabel,customEmoji} = params

            if (customData && customData.length > 40) throw new api.ODSystemError("ODButton:opendiscord:verifybar-success => customData exceeds 40 characters limit!")

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
    buttons.add(new api.ODButton("opendiscord:error-ticket-deprecated-transcript"))
    buttons.get("opendiscord:error-ticket-deprecated-transcript").workers.add(
        new api.ODWorker("opendiscord:error-ticket-deprecated-transcript",0,async (instance,params) => {
            
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
    buttons.add(new api.ODButton("opendiscord:help-menu-page"))
    buttons.get("opendiscord:help-menu-page").workers.add(
        new api.ODWorker("opendiscord:help-menu-page",0,async (instance,params) => {
            const {mode,page} = params
            const totalPages = (await opendiscord.helpmenu.render(mode)).length
            const pageText = (page+1).toString()+"/"+totalPages.toString()

            instance.setCustomId("od:help-menu-page_"+page.toString())
            instance.setMode("button")
            instance.setColor("gray")
            instance.setLabel(lang.getTranslationWithParams("actions.buttons.helpPage",[pageText]))
            instance.setDisabled(true)
        })
    )

    //HELP MENU SWITCH
    buttons.add(new api.ODButton("opendiscord:help-menu-switch"))
    buttons.get("opendiscord:help-menu-switch").workers.add(
        new api.ODWorker("opendiscord:help-menu-switch",0,async (instance,params) => {
            const {mode} = params

            instance.setCustomId("od:help-menu-switch_"+mode)
            instance.setMode("button")
            instance.setColor("gray")
            if (mode == "slash") instance.setLabel(lang.getTranslation("actions.buttons.helpSwitchText"))
            else instance.setLabel(lang.getTranslation("actions.buttons.helpSwitchSlash"))
        })
    )

    //HELP MENU PREVIOUS
    buttons.add(new api.ODButton("opendiscord:help-menu-previous"))
    buttons.get("opendiscord:help-menu-previous").workers.add(
        new api.ODWorker("opendiscord:help-menu-previous",0,async (instance,params) => {
            const {page} = params
            
            instance.setCustomId("od:help-menu-previous")
            instance.setMode("button")
            instance.setColor("gray")
            instance.setEmoji("◀️")
            if (page == 0) instance.setDisabled(true)
        })
    )

    //HELP MENU NEXT
    buttons.add(new api.ODButton("opendiscord:help-menu-next"))
    buttons.get("opendiscord:help-menu-next").workers.add(
        new api.ODWorker("opendiscord:help-menu-next",0,async (instance,params) => {
            const {mode,page} = params
            const totalPages = (await opendiscord.helpmenu.render(mode)).length
            
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
    buttons.add(new api.ODButton("opendiscord:ticket-option"))
    buttons.get("opendiscord:ticket-option").workers.add(
        new api.ODWorker("opendiscord:ticket-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setCustomId("od:ticket-option_"+panel.id.value+"_"+option.id.value)
            instance.setMode("button")
            instance.setColor(option.get("opendiscord:button-color").value)
            if (option.get("opendiscord:button-emoji").value) instance.setEmoji(option.get("opendiscord:button-emoji").value)
            if (option.get("opendiscord:button-label").value) instance.setLabel(option.get("opendiscord:button-label").value)
            if (!option.get("opendiscord:button-emoji").value && !option.get("opendiscord:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )

    //WEBSITE OPTION
    buttons.add(new api.ODButton("opendiscord:website-option"))
    buttons.get("opendiscord:website-option").workers.add(
        new api.ODWorker("opendiscord:website-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setMode("url")
            instance.setUrl(option.get("opendiscord:url").value)
            if (option.get("opendiscord:button-emoji").value) instance.setEmoji(option.get("opendiscord:button-emoji").value)
            if (option.get("opendiscord:button-label").value) instance.setLabel(option.get("opendiscord:button-label").value)
            if (!option.get("opendiscord:button-emoji").value && !option.get("opendiscord:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )

    //ROLE OPTION
    buttons.add(new api.ODButton("opendiscord:role-option"))
    buttons.get("opendiscord:role-option").workers.add(
        new api.ODWorker("opendiscord:role-option",0,async (instance,params) => {
            const {panel,option} = params
            
            instance.setCustomId("od:role-option_"+panel.id.value+"_"+option.id.value)
            instance.setMode("button")
            instance.setColor(option.get("opendiscord:button-color").value)
            if (option.get("opendiscord:button-emoji").value) instance.setEmoji(option.get("opendiscord:button-emoji").value)
            if (option.get("opendiscord:button-label").value) instance.setLabel(option.get("opendiscord:button-label").value)
            if (!option.get("opendiscord:button-emoji").value && !option.get("opendiscord:button-label").value) instance.setLabel("<"+option.id.value+">")
        })
    )
}

const ticketButtons = () => {
    //VISIT TICKET
    buttons.add(new api.ODButton("opendiscord:visit-ticket"))
    buttons.get("opendiscord:visit-ticket").workers.add(
        new api.ODWorker("opendiscord:visit-ticket",0,async (instance,params) => {
            const {guild,channel,ticket} = params
            
            instance.setMode("url")
            instance.setUrl(channel.url)
            instance.setEmoji("🎫")
            instance.setLabel(lang.getTranslation("actions.buttons.create"))
        })
    )

    //CLOSE TICKET
    buttons.add(new api.ODButton("opendiscord:close-ticket"))
    buttons.get("opendiscord:close-ticket").workers.add(
        new api.ODWorker("opendiscord:close-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:close-ticket_"+source)
            instance.setColor("gray")
            instance.setEmoji("🔒")
            instance.setLabel(lang.getTranslation("actions.buttons.close"))
        })
    )

    //DELETE TICKET
    buttons.add(new api.ODButton("opendiscord:delete-ticket"))
    buttons.get("opendiscord:delete-ticket").workers.add(
        new api.ODWorker("opendiscord:delete-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:delete-ticket_"+source)
            instance.setColor("red")
            instance.setEmoji("✖")
            instance.setLabel(lang.getTranslation("actions.buttons.delete"))
        })
    )

    //REOPEN TICKET
    buttons.add(new api.ODButton("opendiscord:reopen-ticket"))
    buttons.get("opendiscord:reopen-ticket").workers.add(
        new api.ODWorker("opendiscord:reopen-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:reopen-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("🔓")
            instance.setLabel(lang.getTranslation("actions.buttons.reopen"))
        })
    )

    //CLAIM TICKET
    buttons.add(new api.ODButton("opendiscord:claim-ticket"))
    buttons.get("opendiscord:claim-ticket").workers.add(
        new api.ODWorker("opendiscord:claim-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:claim-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("👋")
            instance.setLabel(lang.getTranslation("actions.buttons.claim"))
        })
    )

    //UNCLAIM TICKET
    buttons.add(new api.ODButton("opendiscord:unclaim-ticket"))
    buttons.get("opendiscord:unclaim-ticket").workers.add(
        new api.ODWorker("opendiscord:unclaim-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:unclaim-ticket_"+source)
            instance.setColor("green")
            instance.setEmoji("↩️")
            instance.setLabel(lang.getTranslation("actions.buttons.unclaim"))
        })
    )

    //PIN TICKET
    buttons.add(new api.ODButton("opendiscord:pin-ticket"))
    buttons.get("opendiscord:pin-ticket").workers.add(
        new api.ODWorker("opendiscord:pin-ticket",0,async (instance,params,source) => {
            const {guild,channel,ticket} = params

            instance.setMode("button")
            instance.setCustomId("od:pin-ticket_"+source)
            instance.setColor("gray")
            instance.setEmoji("📌")
            instance.setLabel(lang.getTranslation("actions.buttons.pin"))
        })
    )

    //UNPIN TICKET
    buttons.add(new api.ODButton("opendiscord:unpin-ticket"))
    buttons.get("opendiscord:unpin-ticket").workers.add(
        new api.ODWorker("opendiscord:unpin-ticket",0,async (instance,params,source) => {
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
    buttons.add(new api.ODButton("opendiscord:transcript-html-visit"))
    buttons.get("opendiscord:transcript-html-visit").workers.add(
        new api.ODWorker("opendiscord:transcript-html-visit",0,async (instance,params,source) => {
            const {result} = params
            instance.setMode("url")
            if (result.data) instance.setUrl(result.data.url)
            else throw new api.ODSystemError("ODButton:opendiscord:transcript-html-visit => Missing Transcript Result Data!")
            instance.setEmoji("📄")
            instance.setLabel(lang.getTranslation("transcripts.success.visit"))
        })
    )

    //TRANSCRIPT ERROR RETRY
    buttons.add(new api.ODButton("opendiscord:transcript-error-retry"))
    buttons.get("opendiscord:transcript-error-retry").workers.add(
        new api.ODWorker("opendiscord:transcript-error-retry",0,async (instance,params,source) => {
            instance.setMode("button")
            instance.setCustomId("od:transcript-error-retry_"+source)
            instance.setColor("gray")
            instance.setEmoji("🔄")
            instance.setLabel(lang.getTranslation("transcripts.errors.retry"))
        })
    )

    //TRANSCRIPT ERROR CONTINUE
    buttons.add(new api.ODButton("opendiscord:transcript-error-continue"))
    buttons.get("opendiscord:transcript-error-continue").workers.add(
        new api.ODWorker("opendiscord:transcript-error-continue",0,async (instance,params,source) => {
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
    buttons.add(new api.ODButton("opendiscord:clear-continue"))
    buttons.get("opendiscord:clear-continue").workers.add(
        new api.ODWorker("opendiscord:clear-continue",0,async (instance,params,source) => {
            instance.setMode("button")
            instance.setCustomId("od:clear-continue_"+source+"_"+params.filter)
            instance.setColor("red")
            instance.setEmoji("✖")
            instance.setLabel(lang.getTranslation("actions.buttons.clear"))
        })
    )
}