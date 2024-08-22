///////////////////////////////////////
//MESSAGE BUILDERS
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const messages = openticket.builders.messages
const buttons = openticket.builders.buttons
const dropdowns = openticket.builders.dropdowns
const files = openticket.builders.files
const embeds = openticket.builders.embeds
const lang = openticket.languages
const generalConfig = openticket.configs.get("openticket:general")

export const registerAllMessages = async () => {
    verifyBarMessages()
    errorMessages()
    helpMenuMessages()
    statsMessages()
    panelMessages()
    ticketMessages()
    blacklistMessages()
    transcriptMessages()
    roleMessages()
    clearMessages()
    autoMessages()
}

const verifyBarMessages = () => {
    //VERIFYBAR TICKET MESSAGE
    messages.add(new api.ODMessage("openticket:verifybar-ticket-message"))
    messages.get("openticket:verifybar-ticket-message").workers.add(
        new api.ODWorker("openticket:verifybar-ticket-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-ticket-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-ticket-message`")
                return
            }
            const option = ticket.option

            //add pings
            const pingOptions = option.get("openticket:ticket-message-ping").value
            const pings: string[] = [discord.userMention(user.id)]
            if (pingOptions["@everyone"]) pings.push("@everyone")
            if (pingOptions["@here"]) pings.push("@here")
            pingOptions.custom.forEach((ping) => pings.push(discord.roleMention(ping)))
            const pingText = (pings.length > 0) ? pings.join(" ")+"\n" : ""

            //add text
            const text = option.get("openticket:ticket-message-text").value
            if (text !== "") instance.setContent(pingText+text)
            else instance.setContent(pingText)

            //add embed
            if (option.get("openticket:ticket-message-embed").value.enabled) instance.addEmbed(await embeds.getSafe("openticket:ticket-message").build("other",{guild,channel,user,ticket}))
        
            //add verifybar components
            if (verifybar.id.value == "openticket:claim-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            
            }else if (verifybar.id.value == "openticket:unclaim-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            
            }else if (verifybar.id.value == "openticket:pin-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:unpin-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:close-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:reopen-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:delete-ticket-ticket-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
                if (generalConfig.data.system.enableDeleteWithoutTranscript) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"no-transcript",customEmoji:"📄",customLabel:lang.getTranslation("actions.buttons.withoutTranscript"),customColor:"red"}))
            }
        })
    )

    //TICKET CLOSED
    messages.add(new api.ODMessage("openticket:verifybar-close-message"))
    messages.get("openticket:verifybar-close-message").workers.add(
        new api.ODWorker("openticket:verifybar-close-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-close-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-close-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:close-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:reopen-ticket-close-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:delete-ticket-close-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
                if (generalConfig.data.system.enableDeleteWithoutTranscript) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"no-transcript",customEmoji:"📄",customLabel:lang.getTranslation("actions.buttons.withoutTranscript"),customColor:"red"}))
            }
        })
    )

    //TICKET REOPENED
    messages.add(new api.ODMessage("openticket:verifybar-reopen-message"))
    messages.get("openticket:verifybar-reopen-message").workers.add(
        new api.ODWorker("openticket:verifybar-reopen-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-reopen-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-reopen-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:reopen-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:close-ticket-reopen-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:delete-ticket-reopen-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
                if (generalConfig.data.system.enableDeleteWithoutTranscript) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"no-transcript",customEmoji:"📄",customLabel:lang.getTranslation("actions.buttons.withoutTranscript"),customColor:"red"}))
            }
        })
    )

    //TICKET CLAIM
    messages.add(new api.ODMessage("openticket:verifybar-claim-message"))
    messages.get("openticket:verifybar-claim-message").workers.add(
        new api.ODWorker("openticket:verifybar-claim-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-claim-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-claim-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:claim-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:unclaim-ticket-claim-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            }
        })
    )

    //TICKET UNCLAIM
    messages.add(new api.ODMessage("openticket:verifybar-unclaim-message"))
    messages.get("openticket:verifybar-unclaim-message").workers.add(
        new api.ODWorker("openticket:verifybar-unclaim-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-unclaim-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-unclaim-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:unclaim-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:claim-ticket-unclaim-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            }
        })
    )

    //TICKET PIN
    messages.add(new api.ODMessage("openticket:verifybar-pin-message"))
    messages.get("openticket:verifybar-pin-message").workers.add(
        new api.ODWorker("openticket:verifybar-pin-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-pin-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-pin-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:pin-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:unpin-ticket-pin-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            }
        })
    )

    //TICKET UNPIN
    messages.add(new api.ODMessage("openticket:verifybar-unpin-message"))
    messages.get("openticket:verifybar-unpin-message").workers.add(
        new api.ODWorker("openticket:verifybar-unpin-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-unpin-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-unpin-message`")
                return
            }

            const rawReason = (originalMessage.embeds[0] && originalMessage.embeds[0].fields[0]) ? originalMessage.embeds[0].fields[0].value : null
            const reason = (rawReason == null) ? null : rawReason.substring(3,rawReason.length-3)

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:unpin-message").build("other",{guild,channel,user,ticket,reason}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:pin-ticket-unpin-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
            }
        })
    )

    //TICKET AUTOCLOSED
    messages.add(new api.ODMessage("openticket:verifybar-autoclose-message"))
    messages.get("openticket:verifybar-autoclose-message").workers.add(
        new api.ODWorker("openticket:verifybar-autoclose-message",0,async (instance,params,source) => {
            const {guild,channel,user,verifybar,originalMessage} = params
            if (!guild || channel.isDMBased()){
                instance.setContent("ODError: Not In Guild => `openticket:verifybar-autoclose-message`")
                return
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket){
                instance.setContent("ODError: Unknown Ticket => `openticket:verifybar-autoclose-message`")
                return
            }

            //add embed
            instance.addEmbed(await embeds.getSafe("openticket:autoclose-message").build("other",{guild,channel,user,ticket}))
            
            //add verifybar components
            if (verifybar.id.value == "openticket:reopen-ticket-autoclose-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))

            }else if (verifybar.id.value == "openticket:delete-ticket-autoclose-message"){
                instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar}))
                instance.addComponent(await buttons.getSafe("openticket:verifybar-failure").build("verifybar",{guild,channel,user,verifybar}))
                if (generalConfig.data.system.enableTicketActionWithReason) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"reason",customEmoji:"✏️",customLabel:lang.getTranslation("actions.buttons.withReason"),customColor:"blue"}))
                if (generalConfig.data.system.enableDeleteWithoutTranscript) instance.addComponent(await buttons.getSafe("openticket:verifybar-success").build("verifybar",{guild,channel,user,verifybar,customData:"no-transcript",customEmoji:"📄",customLabel:lang.getTranslation("actions.buttons.withoutTranscript"),customColor:"red"}))
            }
        })
    )
}

const errorMessages = () => {
    //ERROR
    messages.add(new api.ODMessage("openticket:error"))
    messages.get("openticket:error").workers.add(
        new api.ODWorker("openticket:error",0,async (instance,params,source) => {
            const {guild,channel,user,error,layout} = params
            instance.addEmbed(await embeds.getSafe("openticket:error").build(source,{guild,channel,user,error,layout}))
            instance.setEphemeral(true)
        })
    )

    //ERROR OPTION MISSING
    messages.add(new api.ODMessage("openticket:error-option-missing"))
    messages.get("openticket:error-option-missing").workers.add(
        new api.ODWorker("openticket:error-option-missing",0,async (instance,params,source) => {
            const {guild,channel,user,error} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-option-missing").build(source,{guild,channel,user,error}))
            instance.setEphemeral(true)
        })
    )

    //ERROR OPTION INVALID
    messages.add(new api.ODMessage("openticket:error-option-invalid"))
    messages.get("openticket:error-option-invalid").workers.add(
        new api.ODWorker("openticket:error-option-invalid",0,async (instance,params,source) => {
            const {guild,channel,user,error} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-option-invalid").build(source,{guild,channel,user,error}))
            instance.setEphemeral(true)
        })
    )

    //ERROR UNKNOWN COMMAND
    messages.add(new api.ODMessage("openticket:error-unknown-command"))
    messages.get("openticket:error-unknown-command").workers.add(
        new api.ODWorker("openticket:error-unknown-command",0,async (instance,params,source) => {
            const {guild,channel,user,error} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-unknown-command").build(source,{guild,channel,user,error}))
            instance.setEphemeral(true)
        })
    )

    //ERROR NO PERMISSIONS
    messages.add(new api.ODMessage("openticket:error-no-permissions"))
    messages.get("openticket:error-no-permissions").workers.add(
        new api.ODWorker("openticket:error-no-permissions",0,async (instance,params,source) => {
            const {guild,channel,user,permissions} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-no-permissions").build(source,{guild,channel,user,permissions}))
            instance.setEphemeral(true)
        })
    )

    //ERROR NO PERMISSIONS COOLDOWN
    messages.add(new api.ODMessage("openticket:error-no-permissions-cooldown"))
    messages.get("openticket:error-no-permissions-cooldown").workers.add(
        new api.ODWorker("openticket:error-no-permissions-cooldown",0,async (instance,params,source) => {
            const {guild,channel,user,until} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-no-permissions-cooldown").build(source,{guild,channel,user,until}))
            instance.setEphemeral(true)
        })
    )

    //ERROR NO PERMISSIONS BLACKLISTED
    messages.add(new api.ODMessage("openticket:error-no-permissions-blacklisted"))
    messages.get("openticket:error-no-permissions-blacklisted").workers.add(
        new api.ODWorker("openticket:error-no-permissions-blacklisted",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-no-permissions-blacklisted").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR NO PERMISSIONS LIMITS
    messages.add(new api.ODMessage("openticket:error-no-permissions-limits"))
    messages.get("openticket:error-no-permissions-limits").workers.add(
        new api.ODWorker("openticket:error-no-permissions-limits",0,async (instance,params,source) => {
            const {guild,channel,user,limit} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-no-permissions-limits").build(source,{guild,channel,user,limit}))
            instance.setEphemeral(true)
        })
    )

    //ERROR RESPONDER TIMEOUT
    messages.add(new api.ODMessage("openticket:error-responder-timeout"))
    messages.get("openticket:error-responder-timeout").workers.add(
        new api.ODWorker("openticket:error-responder-timeout",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-responder-timeout").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR TICKET UNKNOWN
    messages.add(new api.ODMessage("openticket:error-ticket-unknown"))
    messages.get("openticket:error-ticket-unknown").workers.add(
        new api.ODWorker("openticket:error-ticket-unknown",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-ticket-unknown").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR TICKET DEPRECATED
    messages.add(new api.ODMessage("openticket:error-ticket-deprecated"))
    messages.get("openticket:error-ticket-deprecated").workers.add(
        new api.ODWorker("openticket:error-ticket-deprecated",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-ticket-deprecated").build(source,{guild,channel,user}))
            instance.addComponent(await buttons.getSafe("openticket:error-ticket-deprecated-transcript").build(source,{}))
            instance.setEphemeral(true)
        })
    )

    //ERROR OPTION UNKNOWN
    messages.add(new api.ODMessage("openticket:error-option-unknown"))
    messages.get("openticket:error-option-unknown").workers.add(
        new api.ODWorker("openticket:error-option-unknown",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-option-unknown").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR PANEL UNKNOWN
    messages.add(new api.ODMessage("openticket:error-panel-unknown"))
    messages.get("openticket:error-panel-unknown").workers.add(
        new api.ODWorker("openticket:error-panel-unknown",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-panel-unknown").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR NOD IN GUILD
    messages.add(new api.ODMessage("openticket:error-not-in-guild"))
    messages.get("openticket:error-not-in-guild").workers.add(
        new api.ODWorker("openticket:error-not-in-guild",0,async (instance,params,source) => {
            const {channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-not-in-guild").build(source,{channel,user}))
            instance.setEphemeral(true)
        })
    )

    //ERROR CHANNEL RENAME
    messages.add(new api.ODMessage("openticket:error-channel-rename"))
    messages.get("openticket:error-channel-rename").workers.add(
        new api.ODWorker("openticket:error-channel-rename",0,async (instance,params,source) => {
            const {guild,channel,user,originalName,newName} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-channel-rename").build(source,{guild,channel,user,originalName,newName}))
            instance.setEphemeral(true)
        })
    )

    //ERROR TICKET BUSY
    messages.add(new api.ODMessage("openticket:error-ticket-busy"))
    messages.get("openticket:error-ticket-busy").workers.add(
        new api.ODWorker("openticket:error-ticket-busy",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:error-ticket-busy").build(source,{guild,channel,user}))
            instance.setEphemeral(true)
        })
    )
}

const helpMenuMessages = () => {
    //HELP MENU
    messages.add(new api.ODMessage("openticket:help-menu"))
    messages.get("openticket:help-menu").workers.add(
        new api.ODWorker("openticket:help-menu",0,async (instance,params,source) => {
            const {mode,page} = params
            const totalPages = (await openticket.helpmenu.render(mode)).length
            
            const embed = await embeds.getSafe("openticket:help-menu").build(source,{mode,page})
            instance.addEmbed(embed)
            if (totalPages > 1){
                //when more than 1 page
                instance.addComponent(await buttons.getSafe("openticket:help-menu-previous").build(source,{mode,page}))
                instance.addComponent(await buttons.getSafe("openticket:help-menu-page").build(source,{mode,page}))
                instance.addComponent(await buttons.getSafe("openticket:help-menu-next").build(source,{mode,page}))
                instance.addComponent(buttons.getNewLine("openticket:help-menu-divider"))
            }
            if (generalConfig.data.textCommands && generalConfig.data.slashCommands) instance.addComponent(await buttons.get("openticket:help-menu-switch").build(source,{mode,page}))
        })
    )
}

const statsMessages = () => {
    //STATS GLOBAL
    messages.add(new api.ODMessage("openticket:stats-global"))
    messages.get("openticket:stats-global").workers.add(
        new api.ODWorker("openticket:stats-global",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:stats-global").build(source,{guild,channel,user}))
        })
    )

    //STATS TICKET
    messages.add(new api.ODMessage("openticket:stats-ticket"))
    messages.get("openticket:stats-ticket").workers.add(
        new api.ODWorker("openticket:stats-ticket",0,async (instance,params,source) => {
            const {guild,channel,user,scopeData} = params
            instance.addEmbed(await embeds.getSafe("openticket:stats-ticket").build(source,{guild,channel,user,scopeData}))
        })
    )

    //STATS USER
    messages.add(new api.ODMessage("openticket:stats-user"))
    messages.get("openticket:stats-user").workers.add(
        new api.ODWorker("openticket:stats-user",0,async (instance,params,source) => {
            const {guild,channel,user,scopeData} = params
            instance.addEmbed(await embeds.getSafe("openticket:stats-user").build(source,{guild,channel,user,scopeData}))
        })
    )

    //STATS RESET
    messages.add(new api.ODMessage("openticket:stats-reset"))
    messages.get("openticket:stats-reset").workers.add(
        new api.ODWorker("openticket:stats-reset",0,async (instance,params,source) => {
            const {guild,channel,user,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:stats-reset").build(source,{guild,channel,user,reason}))
        })
    )

    //STATS TICKET UNKNOWN
    messages.add(new api.ODMessage("openticket:stats-ticket-unknown"))
    messages.get("openticket:stats-ticket-unknown").workers.add(
        new api.ODWorker("openticket:stats-ticket-unknown",0,async (instance,params,source) => {
            const {guild,channel,user,id} = params
            instance.addEmbed(await embeds.getSafe("openticket:stats-ticket-unknown").build(source,{guild,channel,user,id}))
            instance.setEphemeral(true)
        })
    )
}

const panelMessages = () => {
    //PANEL
    messages.add(new api.ODMessage("openticket:panel"))
    messages.get("openticket:panel").workers.add([
        new api.ODWorker("openticket:panel-layout",1,async (instance,params,source) => {
            const {guild,channel,user,panel} = params

            //add text
            const text = panel.get("openticket:text").value
            if (panel.get("openticket:describe-options-in-text").value){
                //describe options in text
                const describeText = (await import("../data/openticket/panelLoader.js")).describePanelOptions("text",panel)
                instance.setContent(text+"\n\n"+describeText)
            }else if (text){
                instance.setContent(text)
            }

            if (panel.get("openticket:enable-max-tickets-warning-text").value && generalConfig.data.system.limits.enabled){
                instance.setContent(instance.data.content+"\n\n*"+lang.getTranslationWithParams("actions.descriptions.ticketMessageLimit",[generalConfig.data.system.limits.userMaximum.toString()])+"*")
            }

            //add embed
            const embedOptions = panel.get("openticket:embed").value
            if (embedOptions.enabled) instance.addEmbed(await embeds.getSafe("openticket:panel").build(source,{guild,channel,user,panel}))
        }),
        new api.ODWorker("openticket:panel-components",0,async (instance,params,source) => {
            const {guild,channel,user,panel} = params
            const options: api.ODOption[] = []
            panel.get("openticket:options").value.forEach((id) => {
                const opt = openticket.options.get(id)
                if (opt) options.push(opt)
            })

            if (panel.get("openticket:dropdown").value){
                //dropdown
                const ticketOptions: api.ODTicketOption[] = []
                options.forEach((option) => {
                    if (option instanceof api.ODTicketOption) ticketOptions.push(option)
                })
                instance.addComponent(await dropdowns.getSafe("openticket:panel-dropdown-tickets").build(source,{guild,channel,user,panel,options:ticketOptions}))
            }else{
                //buttons
                for (const option of options){
                    if (option instanceof api.ODTicketOption) instance.addComponent(await buttons.getSafe("openticket:ticket-option").build(source,{guild,channel,user,panel,option}))
                    else if (option instanceof api.ODWebsiteOption) instance.addComponent(await buttons.getSafe("openticket:website-option").build(source,{guild,channel,user,panel,option}))
                    else if (option instanceof api.ODRoleOption) instance.addComponent(await buttons.getSafe("openticket:role-option").build(source,{guild,channel,user,panel,option}))
                }
            }
        })
    ])

    //PANEL READY
    messages.add(new api.ODMessage("openticket:panel-ready"))
    messages.get("openticket:panel-ready").workers.add(
        new api.ODWorker("openticket:panel-ready",0,async (instance,params,source) => {
            instance.setContent("## "+lang.getTranslation("actions.descriptions.panelReady"))
            instance.setEphemeral(true)
        })
    )
}

const ticketMessages = () => {
    //TICKET CREATED
    messages.add(new api.ODMessage("openticket:ticket-created"))
    messages.get("openticket:ticket-created").workers.add(
        new api.ODWorker("openticket:ticket-created",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params

            instance.addEmbed(await embeds.getSafe("openticket:ticket-created").build(source,{guild,channel,user,ticket}))
            instance.addComponent(await buttons.getSafe("openticket:visit-ticket").build("ticket-created",{guild,channel,user,ticket}))
            instance.setEphemeral(true)
        })
    )

    //TICKET CREATED DM
    messages.add(new api.ODMessage("openticket:ticket-created-dm"))
    messages.get("openticket:ticket-created-dm").workers.add(
        new api.ODWorker("openticket:ticket-created-dm",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params

            //add text
            const text = ticket.option.get("openticket:dm-message-text").value
            if (text !== "") instance.setContent(text)

            //add embed
            if (ticket.option.get("openticket:dm-message-embed").value.enabled) instance.addEmbed(await embeds.getSafe("openticket:ticket-created-dm").build(source,{guild,channel,user,ticket}))
            
            //add components
            instance.addComponent(await buttons.getSafe("openticket:visit-ticket").build("ticket-created",{guild,channel,user,ticket}))
        })
    )

    //TICKET CREATED LOGS
    messages.add(new api.ODMessage("openticket:ticket-created-logs"))
    messages.get("openticket:ticket-created-logs").workers.add(
        new api.ODWorker("openticket:ticket-created-logs",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params

            instance.addEmbed(await embeds.getSafe("openticket:ticket-created-logs").build(source,{guild,channel,user,ticket}))
            instance.addComponent(await buttons.getSafe("openticket:visit-ticket").build("ticket-created",{guild,channel,user,ticket}))
        })
    )

    //TICKET MESSAGE
    messages.add(new api.ODMessage("openticket:ticket-message"))
    messages.get("openticket:ticket-message").workers.add([
        new api.ODWorker("openticket:ticket-message-layout",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params

            //add pings
            const pingOptions = ticket.option.get("openticket:ticket-message-ping").value
            const pings: string[] = [discord.userMention(user.id)]
            if (pingOptions["@everyone"]) pings.push("@everyone")
            if (pingOptions["@here"]) pings.push("@here")
            pingOptions.custom.forEach((ping) => pings.push(discord.roleMention(ping)))
            const pingText = (pings.length > 0) ? pings.join(" ")+"\n" : ""

            //add text
            const text = ticket.option.get("openticket:ticket-message-text").value
            if (text !== "") instance.setContent(pingText+text)
            else instance.setContent(pingText)

            //add embed
            if (ticket.option.get("openticket:ticket-message-embed").value.enabled) instance.addEmbed(await embeds.getSafe("openticket:ticket-message").build(source,{guild,channel,user,ticket}))
        
            
        }),
        new api.ODWorker("openticket:ticket-message-components",1,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params
            //add components
            if (generalConfig.data.system.enableTicketClaimButtons && !ticket.get("openticket:closed").value){
                //enable ticket claiming
                if (ticket.get("openticket:claimed").value){
                    instance.addComponent(await buttons.getSafe("openticket:unclaim-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("openticket:claim-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }
            }
            if (generalConfig.data.system.enableTicketPinButtons && !ticket.get("openticket:closed").value){
                //enable ticket pinning
                if (ticket.get("openticket:pinned").value){
                    instance.addComponent(await buttons.getSafe("openticket:unpin-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("openticket:pin-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }
            }
            if (generalConfig.data.system.enableTicketCloseButtons){
                //enable ticket closing
                if (ticket.get("openticket:closed").value){
                    instance.addComponent(await buttons.getSafe("openticket:reopen-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("openticket:close-ticket").build("ticket-message",{guild,channel,user,ticket}))
                }
            }
            //enable ticket deletion
            if (generalConfig.data.system.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("openticket:delete-ticket").build("ticket-message",{guild,channel,user,ticket}))
        }),
        new api.ODWorker("openticket:ticket-message-disable-components",2,async (instance,params,source) => {
            const {ticket} = params
            if (ticket.get("openticket:for-deletion").value){
                //disable all buttons when ticket is being prepared for deletion
                instance.data.components.forEach((component) => {
                    if ((component.component instanceof discord.ButtonBuilder) || (component.component instanceof discord.BaseSelectMenuBuilder)){
                        component.component.setDisabled(true)
                    }
                })
            }
        })
    ])

    //TICKET CLOSED
    messages.add(new api.ODMessage("openticket:close-message"))
    messages.get("openticket:close-message").workers.add(
        new api.ODWorker("openticket:close-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:close-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("openticket:reopen-ticket").build("close-message",{guild,channel,user,ticket}))
            if (generalConfig.data.system.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("openticket:delete-ticket").build("close-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET REOPENED
    messages.add(new api.ODMessage("openticket:reopen-message"))
    messages.get("openticket:reopen-message").workers.add(
        new api.ODWorker("openticket:reopen-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:reopen-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("openticket:close-ticket").build("reopen-message",{guild,channel,user,ticket}))
            if (generalConfig.data.system.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("openticket:delete-ticket").build("reopen-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET DELETED
    messages.add(new api.ODMessage("openticket:delete-message"))
    messages.get("openticket:delete-message").workers.add(
        new api.ODWorker("openticket:delete-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:delete-message").build(source,{guild,channel,user,ticket,reason}))
        })
    )

    //TICKET CLAIMED
    messages.add(new api.ODMessage("openticket:claim-message"))
    messages.get("openticket:claim-message").workers.add(
        new api.ODWorker("openticket:claim-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:claim-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketClaimButtons) instance.addComponent(await buttons.getSafe("openticket:unclaim-ticket").build("claim-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET UNCLAIMED
    messages.add(new api.ODMessage("openticket:unclaim-message"))
    messages.get("openticket:unclaim-message").workers.add(
        new api.ODWorker("openticket:unclaim-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:unclaim-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketClaimButtons) instance.addComponent(await buttons.getSafe("openticket:claim-ticket").build("unclaim-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET PINNED
    messages.add(new api.ODMessage("openticket:pin-message"))
    messages.get("openticket:pin-message").workers.add(
        new api.ODWorker("openticket:pin-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:pin-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketPinButtons) instance.addComponent(await buttons.getSafe("openticket:unpin-ticket").build("pin-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET UNPINNED
    messages.add(new api.ODMessage("openticket:unpin-message"))
    messages.get("openticket:unpin-message").workers.add(
        new api.ODWorker("openticket:unpin-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:unpin-message").build(source,{guild,channel,user,ticket,reason}))
            if (generalConfig.data.system.enableTicketPinButtons) instance.addComponent(await buttons.getSafe("openticket:pin-ticket").build("unpin-message",{guild,channel,user,ticket}))
        })
    )

    //TICKET RENAMED
    messages.add(new api.ODMessage("openticket:rename-message"))
    messages.get("openticket:rename-message").workers.add(
        new api.ODWorker("openticket:rename-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,data} = params
            instance.addEmbed(await embeds.getSafe("openticket:rename-message").build(source,{guild,channel,user,ticket,reason,data}))
        })
    )

    //TICKET MOVED
    messages.add(new api.ODMessage("openticket:move-message"))
    messages.get("openticket:move-message").workers.add(
        new api.ODWorker("openticket:move-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,data} = params
            instance.addEmbed(await embeds.getSafe("openticket:move-message").build(source,{guild,channel,user,ticket,reason,data}))
        })
    )

    //TICKET USER ADDED
    messages.add(new api.ODMessage("openticket:add-message"))
    messages.get("openticket:add-message").workers.add(
        new api.ODWorker("openticket:add-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,data} = params
            instance.addEmbed(await embeds.getSafe("openticket:add-message").build(source,{guild,channel,user,ticket,reason,data}))
        })
    )

    //TICKET USER REMOVED
    messages.add(new api.ODMessage("openticket:remove-message"))
    messages.get("openticket:remove-message").workers.add(
        new api.ODWorker("openticket:remove-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,data} = params
            instance.addEmbed(await embeds.getSafe("openticket:remove-message").build(source,{guild,channel,user,ticket,reason,data}))
        })
    )

    //TICKET ACTION DM
    messages.add(new api.ODMessage("openticket:ticket-action-dm"))
    messages.get("openticket:ticket-action-dm").workers.add(
        new api.ODWorker("openticket:ticket-action-dm",0,async (instance,params,source) => {
            const {guild,channel,user,mode,ticket,reason,additionalData} = params
            instance.addEmbed(await embeds.getSafe("openticket:ticket-action-dm").build(source,{guild,channel,user,mode,ticket,reason,additionalData}))
        })
    )

    //TICKET ACTION LOGS
    messages.add(new api.ODMessage("openticket:ticket-action-logs"))
    messages.get("openticket:ticket-action-logs").workers.add(
        new api.ODWorker("openticket:ticket-action-logs",0,async (instance,params,source) => {
            const {guild,channel,user,mode,ticket,reason,additionalData} = params
            instance.addEmbed(await embeds.getSafe("openticket:ticket-action-logs").build(source,{guild,channel,user,mode,ticket,reason,additionalData}))
        })
    )
}

const blacklistMessages = () => {
    //BLACKLIST VIEW
    messages.add(new api.ODMessage("openticket:blacklist-view"))
    messages.get("openticket:blacklist-view").workers.add(
        new api.ODWorker("openticket:blacklist-view",0,async (instance,params,source) => {
            const {guild,channel,user} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-view").build(source,{guild,channel,user}))
        })
    )

    //BLACKLIST GET
    messages.add(new api.ODMessage("openticket:blacklist-get"))
    messages.get("openticket:blacklist-get").workers.add(
        new api.ODWorker("openticket:blacklist-get",0,async (instance,params,source) => {
            const {guild,channel,user,data} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-get").build(source,{guild,channel,user,data}))
        })
    )

    //BLACKLIST ADD
    messages.add(new api.ODMessage("openticket:blacklist-add"))
    messages.get("openticket:blacklist-add").workers.add(
        new api.ODWorker("openticket:blacklist-add",0,async (instance,params,source) => {
            const {guild,channel,user,data,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-add").build(source,{guild,channel,user,data,reason}))
        })
    )

    //BLACKLIST REMOVE
    messages.add(new api.ODMessage("openticket:blacklist-remove"))
    messages.get("openticket:blacklist-remove").workers.add(
        new api.ODWorker("openticket:blacklist-remove",0,async (instance,params,source) => {
            const {guild,channel,user,data,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-remove").build(source,{guild,channel,user,data,reason}))
        })
    )

    //BLACKLIST DM
    messages.add(new api.ODMessage("openticket:blacklist-dm"))
    messages.get("openticket:blacklist-dm").workers.add(
        new api.ODWorker("openticket:blacklist-dm",0,async (instance,params,source) => {
            const {guild,channel,user,mode,data,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-dm").build(source,{guild,channel,user,mode,data,reason}))
        })
    )

    //BLACKLIST LOGS
    messages.add(new api.ODMessage("openticket:blacklist-logs"))
    messages.get("openticket:blacklist-logs").workers.add(
        new api.ODWorker("openticket:blacklist-logs",0,async (instance,params,source) => {
            const {guild,channel,user,mode,data,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:blacklist-logs").build(source,{guild,channel,user,mode,data,reason}))
        })
    )
}

const transcriptMessages = () => {
    //TRANSCRIPT TEXT READY
    messages.add(new api.ODMessage("openticket:transcript-text-ready"))
    messages.get("openticket:transcript-text-ready").workers.add(
        new api.ODWorker("openticket:transcript-text-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            instance.addEmbed(await embeds.getSafe("openticket:transcript-text-ready").build(source,{guild,channel,user,ticket,compiler,result}))
            instance.addFile(await files.getSafe("openticket:text-transcript").build(source,{guild,channel,user,ticket,compiler,result}))
        })
    )

    //TRANSCRIPT HTML READY
    messages.add(new api.ODMessage("openticket:transcript-html-ready"))
    messages.get("openticket:transcript-html-ready").workers.add(
        new api.ODWorker("openticket:transcript-html-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            instance.addEmbed(await embeds.getSafe("openticket:transcript-html-ready").build(source,{guild,channel,user,ticket,compiler,result}))
            instance.addComponent(await buttons.getSafe("openticket:transcript-html-visit").build(source,{guild,channel,user,ticket,compiler,result}))
        })
    )

    //TRANSCRIPT HTML PROGRESS
    messages.add(new api.ODMessage("openticket:transcript-html-progress"))
    messages.get("openticket:transcript-html-progress").workers.add(
        new api.ODWorker("openticket:transcript-html-progress",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,remaining} = params
            instance.addEmbed(await embeds.getSafe("openticket:transcript-html-progress").build(source,{guild,channel,user,ticket,compiler,remaining}))
        })
    )

    //TRANSCRIPT ERROR
    messages.add(new api.ODMessage("openticket:transcript-error"))
    messages.get("openticket:transcript-error").workers.add(
        new api.ODWorker("openticket:transcript-error",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:transcript-error").build(source,{guild,channel,user,ticket,compiler,reason}))
            instance.addComponent(await buttons.getSafe("openticket:transcript-error-retry").build(source,{guild,channel,user,ticket,compiler,reason}))
            instance.addComponent(await buttons.getSafe("openticket:transcript-error-continue").build(source,{guild,channel,user,ticket,compiler,reason}))
        })
    )
}

const roleMessages = () => {
    //REACTION ROLE
    messages.add(new api.ODMessage("openticket:reaction-role"))
    messages.get("openticket:reaction-role").workers.add(
        new api.ODWorker("openticket:reaction-role",0,async (instance,params,source) => {
            const {guild,user,role,result} = params
            instance.addEmbed(await embeds.getSafe("openticket:reaction-role").build(source,{guild,user,role,result}))
            instance.setEphemeral(true)
        })
    )
}

const clearMessages = () => {
    //CLEAR VERIFY MESSAGE
    messages.add(new api.ODMessage("openticket:clear-verify-message"))
    messages.get("openticket:clear-verify-message").workers.add(
        new api.ODWorker("openticket:clear-verify-message",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            instance.addEmbed(await embeds.getSafe("openticket:clear-verify-message").build(source,{guild,channel,user,filter,list}))
            instance.addComponent(await buttons.getSafe("openticket:clear-continue").build(source,{guild,channel,user,filter,list}))
            instance.setEphemeral(true)
        })
    )

    //CLEAR MESSAGE
    messages.add(new api.ODMessage("openticket:clear-message"))
    messages.get("openticket:clear-message").workers.add(
        new api.ODWorker("openticket:clear-message",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            instance.addEmbed(await embeds.getSafe("openticket:clear-message").build(source,{guild,channel,user,filter,list}))
            instance.setEphemeral(true)
        })
    )

    //CLEAR LOGS
    messages.add(new api.ODMessage("openticket:clear-logs"))
    messages.get("openticket:clear-logs").workers.add(
        new api.ODWorker("openticket:clear-logs",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            instance.addEmbed(await embeds.getSafe("openticket:clear-logs").build(source,{guild,channel,user,filter,list}))
        })
    )
}

const autoMessages = () => {
    //AUTOCLOSE MESSAGE
    messages.add(new api.ODMessage("openticket:autoclose-message"))
    messages.get("openticket:autoclose-message").workers.add(
        new api.ODWorker("openticket:autoclose-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params
            instance.addEmbed(await embeds.getSafe("openticket:autoclose-message").build(source,{guild,channel,user,ticket}))
            if (generalConfig.data.system.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("openticket:reopen-ticket").build("autoclose-message",{guild,channel,user,ticket}))
            if (generalConfig.data.system.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("openticket:delete-ticket").build("autoclose-message",{guild,channel,user,ticket}))
        })
    )

    //AUTODELETE MESSAGE
    messages.add(new api.ODMessage("openticket:autodelete-message"))
    messages.get("openticket:autodelete-message").workers.add(
        new api.ODWorker("openticket:autodelete-message",0,async (instance,params,source) => {
            const {guild,channel,user,ticket} = params
            instance.addEmbed(await embeds.getSafe("openticket:autodelete-message").build(source,{guild,channel,user,ticket}))
        })
    )

    //AUTOCLOSE ENABLE
    messages.add(new api.ODMessage("openticket:autoclose-enable"))
    messages.get("openticket:autoclose-enable").workers.add(
        new api.ODWorker("openticket:autoclose-enable",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,time} = params
            instance.addEmbed(await embeds.getSafe("openticket:autoclose-enable").build(source,{guild,channel,user,ticket,reason,time}))
        })
    )

    //AUTODELETE ENABLE
    messages.add(new api.ODMessage("openticket:autodelete-enable"))
    messages.get("openticket:autodelete-enable").workers.add(
        new api.ODWorker("openticket:autodelete-enable",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason,time} = params
            instance.addEmbed(await embeds.getSafe("openticket:autodelete-enable").build(source,{guild,channel,user,ticket,reason,time}))
        })
    )

    //AUTOCLOSE DISABLE
    messages.add(new api.ODMessage("openticket:autoclose-disable"))
    messages.get("openticket:autoclose-disable").workers.add(
        new api.ODWorker("openticket:autoclose-disable",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:autoclose-disable").build(source,{guild,channel,user,ticket,reason}))
        })
    )

    //AUTODELETE DISABLE
    messages.add(new api.ODMessage("openticket:autodelete-disable"))
    messages.get("openticket:autodelete-disable").workers.add(
        new api.ODWorker("openticket:autodelete-disable",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,reason} = params
            instance.addEmbed(await embeds.getSafe("openticket:autodelete-disable").build(source,{guild,channel,user,ticket,reason}))
        })
    )
}