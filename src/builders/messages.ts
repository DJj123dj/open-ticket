///////////////////////////////////////
//MESSAGE BUILDERS
///////////////////////////////////////
import { opendiscord, api, utilities } from "../index.js"
import * as discord from "discord.js"

const messages = opendiscord.builders.messages
const buttons = opendiscord.builders.buttons
const dropdowns = opendiscord.builders.dropdowns
const files = opendiscord.builders.files
const embeds = opendiscord.builders.embeds
const lang = opendiscord.languages
const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerAllMessages() {
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
    extraMessages()
}

const errorMessages = () => {
    //ERROR
    messages.add(new api.ODMessage("opendiscord:error"))
    messages.get("opendiscord:error").workers.add(new api.ODWorker("opendiscord:error", 0, async (instance, params, origin) => {
        const {guild, channel, user, error, layout, customTitle} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error").build(origin, {guild, channel, user, error, layout, customTitle}))
        instance.setEphemeral(true)
    }))

    //ERROR OPTION MISSING
    messages.add(new api.ODMessage("opendiscord:error-option-missing"))
    messages.get("opendiscord:error-option-missing").workers.add(new api.ODWorker("opendiscord:error-option-missing", 0, async (instance, params, origin) => {
        const {guild, channel, user, error} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-option-missing").build(origin, {guild, channel, user, error}))
        instance.setEphemeral(true)
    }))

    //ERROR OPTION INVALID
    messages.add(new api.ODMessage("opendiscord:error-option-invalid"))
    messages.get("opendiscord:error-option-invalid").workers.add(new api.ODWorker("opendiscord:error-option-invalid", 0, async (instance, params, origin) => {
        const {guild, channel, user, error} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-option-invalid").build(origin, {guild, channel, user, error}))
        instance.setEphemeral(true)
    }))

    //ERROR UNKNOWN COMMAND
    messages.add(new api.ODMessage("opendiscord:error-unknown-command"))
    messages.get("opendiscord:error-unknown-command").workers.add(new api.ODWorker("opendiscord:error-unknown-command", 0, async (instance, params, origin) => {
        const {guild, channel, user, error} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-unknown-command").build(origin, {guild, channel, user, error}))
        instance.setEphemeral(true)
    }))

    //ERROR NO PERMISSIONS
    messages.add(new api.ODMessage("opendiscord:error-no-permissions"))
    messages.get("opendiscord:error-no-permissions").workers.add(new api.ODWorker("opendiscord:error-no-permissions", 0, async (instance, params, origin) => {
        const {guild, channel, user, permissions} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-no-permissions").build(origin, {guild, channel, user, permissions}))
        instance.setEphemeral(true)
    }))

    //ERROR NO PERMISSIONS COOLDOWN
    messages.add(new api.ODMessage("opendiscord:error-no-permissions-cooldown"))
    messages.get("opendiscord:error-no-permissions-cooldown").workers.add(new api.ODWorker("opendiscord:error-no-permissions-cooldown", 0, async (instance, params, origin) => {
        const {guild, channel, user, until} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-no-permissions-cooldown").build(origin, {guild, channel, user, until}))
        instance.setEphemeral(true)
    }))

    //ERROR NO PERMISSIONS BLACKLISTED
    messages.add(new api.ODMessage("opendiscord:error-no-permissions-blacklisted"))
    messages.get("opendiscord:error-no-permissions-blacklisted").workers.add(new api.ODWorker("opendiscord:error-no-permissions-blacklisted", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-no-permissions-blacklisted").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR NO PERMISSIONS LIMITS
    messages.add(new api.ODMessage("opendiscord:error-no-permissions-limits"))
    messages.get("opendiscord:error-no-permissions-limits").workers.add(new api.ODWorker("opendiscord:error-no-permissions-limits", 0, async (instance, params, origin) => {
        const {guild, channel, user, limit} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-no-permissions-limits").build(origin, {guild, channel, user, limit}))
        instance.setEphemeral(true)
    }))

    //ERROR RESPONDER TIMEOUT
    messages.add(new api.ODMessage("opendiscord:error-responder-timeout"))
    messages.get("opendiscord:error-responder-timeout").workers.add(new api.ODWorker("opendiscord:error-responder-timeout", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-responder-timeout").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR TICKET UNKNOWN
    messages.add(new api.ODMessage("opendiscord:error-ticket-unknown"))
    messages.get("opendiscord:error-ticket-unknown").workers.add(new api.ODWorker("opendiscord:error-ticket-unknown", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-ticket-unknown").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR TICKET DEPRECATED
    messages.add(new api.ODMessage("opendiscord:error-ticket-deprecated"))
    messages.get("opendiscord:error-ticket-deprecated").workers.add(new api.ODWorker("opendiscord:error-ticket-deprecated", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-ticket-deprecated").build(origin, {guild, channel, user}))
        instance.addComponent(await buttons.getSafe("opendiscord:error-ticket-deprecated-transcript").build(origin, {}))
        instance.setEphemeral(true)
    }))

    //ERROR OPTION UNKNOWN
    messages.add(new api.ODMessage("opendiscord:error-option-unknown"))
    messages.get("opendiscord:error-option-unknown").workers.add(new api.ODWorker("opendiscord:error-option-unknown", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-option-unknown").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR PANEL UNKNOWN
    messages.add(new api.ODMessage("opendiscord:error-panel-unknown"))
    messages.get("opendiscord:error-panel-unknown").workers.add(new api.ODWorker("opendiscord:error-panel-unknown", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-panel-unknown").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR NOT IN GUILD
    messages.add(new api.ODMessage("opendiscord:error-not-in-guild"))
    messages.get("opendiscord:error-not-in-guild").workers.add(new api.ODWorker("opendiscord:error-not-in-guild", 0, async (instance, params, origin) => {
        const {channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-not-in-guild").build(origin, {channel, user}))
        instance.setEphemeral(true)
    }))

    //ERROR CHANNEL RENAME
    messages.add(new api.ODMessage("opendiscord:error-channel-rename"))
    messages.get("opendiscord:error-channel-rename").workers.add(new api.ODWorker("opendiscord:error-channel-rename", 0, async (instance, params, origin) => {
        const {guild, channel, user, originalName, newName} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-channel-rename").build(origin, {guild, channel, user, originalName, newName}))
        instance.setEphemeral(true)
    }))

    //ERROR CHANNEL CATEGORY
    messages.add(new api.ODMessage("opendiscord:error-channel-category"))
    messages.get("opendiscord:error-channel-category").workers.add(new api.ODWorker("opendiscord:error-channel-category", 0, async (instance, params, origin) => {
        const {guild, channel, user, originalCategory, newCategory} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-channel-category").build(origin, {guild, channel, user, originalCategory, newCategory}))
        instance.setEphemeral(true)
    }))

    //ERROR TICKET BUSY
    messages.add(new api.ODMessage("opendiscord:error-ticket-busy"))
    messages.get("opendiscord:error-ticket-busy").workers.add(new api.ODWorker("opendiscord:error-ticket-busy", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:error-ticket-busy").build(origin, {guild, channel, user}))
        instance.setEphemeral(true)
    }))
}

const helpMenuMessages = () => {
    //HELP MENU
    messages.add(new api.ODMessage("opendiscord:help-menu"))
    messages.get("opendiscord:help-menu").workers.add(new api.ODWorker("opendiscord:help-menu", 0, async (instance, params, origin) => {
        const {mode, page} = params
        const totalPages = (await opendiscord.helpmenu.render(mode)).length

        const embed = await embeds.getSafe("opendiscord:help-menu").build(origin, {mode, page})
        instance.addEmbed(embed)
        if (totalPages > 1){
            //when more than 1 page
            instance.addComponent(await buttons.getSafe("opendiscord:help-menu-previous").build(origin, {mode, page}))
            instance.addComponent(await buttons.getSafe("opendiscord:help-menu-page").build(origin, {mode, page}))
            instance.addComponent(await buttons.getSafe("opendiscord:help-menu-next").build(origin, {mode, page}))
            instance.addComponent(buttons.getNewLine("opendiscord:help-menu-divider"))
        }
        if (generalConfig.data.textCommands && generalConfig.data.slashCommands) instance.addComponent(await buttons.get("opendiscord:help-menu-switch").build(origin, {mode, page}))
    }))
}

const statsMessages = () => {
    //STATS GLOBAL
    messages.add(new api.ODMessage("opendiscord:stats-global"))
    messages.get("opendiscord:stats-global").workers.add(new api.ODWorker("opendiscord:stats-global", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:stats-global").build(origin, {guild, channel, user}))
    }))

    //STATS TICKET
    messages.add(new api.ODMessage("opendiscord:stats-ticket"))
    messages.get("opendiscord:stats-ticket").workers.add(new api.ODWorker("opendiscord:stats-ticket", 0, async (instance, params, origin) => {
        const {guild, channel, user, scopeData} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:stats-ticket").build(origin, {guild, channel, user, scopeData}))
    }))

    //STATS USER
    messages.add(new api.ODMessage("opendiscord:stats-user"))
    messages.get("opendiscord:stats-user").workers.add(new api.ODWorker("opendiscord:stats-user", 0, async (instance, params, origin) => {
        const {guild, channel, user, scopeData} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:stats-user").build(origin, {guild, channel, user, scopeData}))
    }))

    //STATS RESET
    messages.add(new api.ODMessage("opendiscord:stats-reset"))
    messages.get("opendiscord:stats-reset").workers.add(new api.ODWorker("opendiscord:stats-reset", 0, async (instance, params, origin) => {
        const {guild, channel, user, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:stats-reset").build(origin, {guild, channel, user, reason}))
    }))

    //STATS TICKET UNKNOWN
    messages.add(new api.ODMessage("opendiscord:stats-ticket-unknown"))
    messages.get("opendiscord:stats-ticket-unknown").workers.add(new api.ODWorker("opendiscord:stats-ticket-unknown", 0, async (instance, params, origin) => {
        const {guild, channel, user, id} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:stats-ticket-unknown").build(origin, {guild, channel, user, id}))
        instance.setEphemeral(true)
    }))
}

const panelMessages = () => {
    //PANEL
    messages.add(new api.ODMessage("opendiscord:panel"))
    messages.get("opendiscord:panel").workers.add([
        new api.ODWorker("opendiscord:panel-layout", 1, async (instance, params, origin) => {
            const {guild, channel, user, panel, isSubPanel} = params

            //ephemeral if sub-panel
            if (isSubPanel) instance.setEphemeral(true)

            //add text
            const text = panel.get("opendiscord:text").value
            if (panel.get("opendiscord:describe-options-in-text").value){
                //describe options in text
                const describeText = (await import("../data/openticket/panelLoader.js")).describePanelOptions("text", panel)
                instance.setContent(text + "\n\n" + describeText)
            }else if (text){
                instance.setContent(text)
            }

            if (panel.get("opendiscord:enable-max-tickets-warning-text").value && generalConfig.data.ticketSystem.limits.enabled){
                instance.setContent(instance.data.content + "\n\n*" + lang.getTranslationWithParams("actions.descriptions.ticketMessageLimit", [generalConfig.data.ticketSystem.limits.userMaximum.toString()]) + "*")
            }

            //add embed
            const embedOptions = panel.get("opendiscord:embed").value
            if (embedOptions.enabled) instance.addEmbed(await embeds.getSafe("opendiscord:panel").build(origin, {guild, channel, user, panel, isSubPanel}))
        }),
        new api.ODWorker("opendiscord:panel-components", 0, async (instance, params, origin) => {
            const {guild, channel, user, panel} = params
            const options: api.ODOption[] = []
            panel.get("opendiscord:options").value.forEach((id) => {
                const opt = opendiscord.options.get(id)
                if (opt) options.push(opt)
            })

            if (panel.get("opendiscord:dropdown").value){
                //dropdown
                const ticketOptions: (api.ODTicketOption|api.ODRoleOption|api.ODSubPanelOption)[] = []
                options.forEach((option) => {
                    if (option instanceof api.ODTicketOption) ticketOptions.push(option)
                    if (option instanceof api.ODRoleOption) ticketOptions.push(option)
                    if (option instanceof api.ODSubPanelOption) ticketOptions.push(option)
                })
                instance.addComponent(await dropdowns.getSafe("opendiscord:panel-dropdown").build(origin, {guild, channel, user, panel, options:ticketOptions}))
            }else{
                //buttons
                let rowButtonCount: number = 0
                for (const option of options){
                    if (rowButtonCount >= panel.get("opendiscord:maximum-buttons-per-row").value){
                        instance.addComponent({id:new api.ODId("opendiscord:new-row"), component:"\n"})
                        rowButtonCount = 0
                    }
                    if (option instanceof api.ODTicketOption) instance.addComponent(await buttons.getSafe("opendiscord:ticket-option").build(origin, {guild, channel, user, panel, option}))
                    else if (option instanceof api.ODWebsiteOption) instance.addComponent(await buttons.getSafe("opendiscord:website-option").build(origin, {guild, channel, user, panel, option}))
                    else if (option instanceof api.ODRoleOption) instance.addComponent(await buttons.getSafe("opendiscord:role-option").build(origin, {guild, channel, user, panel, option}))
                    else if (option instanceof api.ODSubPanelOption) instance.addComponent(await buttons.getSafe("opendiscord:subpanel-option").build(origin, {guild, channel, user, panel, option}))

                    rowButtonCount++
                }
            }
        })
    ])

    //PANEL READY
    messages.add(new api.ODMessage("opendiscord:panel-ready"))
    messages.get("opendiscord:panel-ready").workers.add(new api.ODWorker("opendiscord:panel-ready", 0, async (instance, params, origin) => {
        instance.setContent("## " + lang.getTranslation("actions.descriptions.panelReady"))
        instance.setEphemeral(true)
    }))
}

const ticketMessages = () => {
    //TICKET CREATED
    messages.add(new api.ODMessage("opendiscord:ticket-created"))
    messages.get("opendiscord:ticket-created").workers.add(new api.ODWorker("opendiscord:ticket-created", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket} = params

        instance.addEmbed(await embeds.getSafe("opendiscord:ticket-created").build(origin, {guild, channel, user, ticket}))
        instance.addComponent(await buttons.getSafe("opendiscord:visit-ticket").build("ticket-created", {guild, channel, user, ticket}))
        instance.setEphemeral(true)
    }))

    //TICKET CREATED DM
    messages.add(new api.ODMessage("opendiscord:ticket-created-dm"))
    messages.get("opendiscord:ticket-created-dm").workers.add(new api.ODWorker("opendiscord:ticket-created-dm", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket} = params

        //add text
        const text = ticket.option.get("opendiscord:dm-message-text").value
        if (text !== "") instance.setContent(text)

        //add embed
        if (ticket.option.get("opendiscord:dm-message-embed").value.enabled) instance.addEmbed(await embeds.getSafe("opendiscord:ticket-created-dm").build(origin, {guild, channel, user, ticket}))

        //add components
        instance.addComponent(await buttons.getSafe("opendiscord:visit-ticket").build("ticket-created", {guild, channel, user, ticket}))
    }))

    //TICKET CREATED LOGS
    messages.add(new api.ODMessage("opendiscord:ticket-created-logs"))
    messages.get("opendiscord:ticket-created-logs").workers.add(new api.ODWorker("opendiscord:ticket-created-logs", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket} = params

        instance.addEmbed(await embeds.getSafe("opendiscord:ticket-created-logs").build(origin, {guild, channel, user, ticket}))
        instance.addComponent(await buttons.getSafe("opendiscord:visit-ticket").build("ticket-created", {guild, channel, user, ticket}))
    }))

    //TICKET MESSAGE
    messages.add(new api.ODMessage("opendiscord:ticket-message"))
    messages.get("opendiscord:ticket-message").workers.add([
        new api.ODWorker("opendiscord:ticket-message-layout", 0, async (instance, params, origin) => {
            const {guild, channel, user, ticket} = params

            //add pings
            const pingOptions = ticket.option.get("opendiscord:ticket-message-ping").value
            const pings: string[] = []
            const creator = ticket.get("opendiscord:opened-by").value
            if (creator) pings.push(discord.userMention(creator))
            if (pingOptions["@everyone"]) pings.push("@everyone")
            if (pingOptions["@here"]) pings.push("@here")
            pingOptions.custom.forEach((ping) => pings.push(discord.roleMention(ping)))
            const pingText = (pings.length > 0) ? pings.join(" ") + "\n" : ""

            //add text
            const text = ticket.option.get("opendiscord:ticket-message-text").value
            if (text !== "") instance.setContent(pingText + text)
            else instance.setContent(pingText)

            //add embed
            if (ticket.option.get("opendiscord:ticket-message-embed").value.enabled) instance.addEmbed(await embeds.getSafe("opendiscord:ticket-message").build(origin, {guild, channel, user, ticket}))
        }),
        new api.ODWorker("opendiscord:ticket-message-components", 1, async (instance, params, origin) => {
            const {guild, channel, user, ticket} = params
            //add components
            if (generalConfig.data.ticketSystem.enableTicketClaimButtons && !ticket.get("opendiscord:closed").value){
                //enable ticket claiming
                if (ticket.get("opendiscord:claimed").value){
                    instance.addComponent(await buttons.getSafe("opendiscord:unclaim-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("opendiscord:claim-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }
            }
            if (generalConfig.data.ticketSystem.enableTicketPinButtons && !ticket.get("opendiscord:closed").value){
                //enable ticket pinning
                if (ticket.get("opendiscord:pinned").value){
                    instance.addComponent(await buttons.getSafe("opendiscord:unpin-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("opendiscord:pin-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }
            }
            if (generalConfig.data.ticketSystem.enableTicketCloseButtons){
                //enable ticket closing
                if (ticket.get("opendiscord:closed").value){
                    instance.addComponent(await buttons.getSafe("opendiscord:reopen-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }else{
                    instance.addComponent(await buttons.getSafe("opendiscord:close-ticket").build("ticket-message", {guild, channel, user, ticket}))
                }
            }
            //enable ticket deletion
            if (generalConfig.data.ticketSystem.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("opendiscord:delete-ticket").build("ticket-message", {guild, channel, user, ticket}))

            //add priority dropdown
            if (generalConfig.data.ticketSystem.askPriorityOnTicketCreation) instance.addComponent(await dropdowns.getSafe("opendiscord:priority-dropdown").build(origin, {guild, channel, user, ticket}))
        }),
        new api.ODWorker("opendiscord:ticket-message-disable-components", 2, async (instance, params, origin) => {
            const {ticket} = params
            if (ticket.get("opendiscord:for-deletion").value){
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
    messages.add(new api.ODMessage("opendiscord:close-message"))
    messages.get("opendiscord:close-message").workers.add(new api.ODWorker("opendiscord:close-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:close-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("opendiscord:reopen-ticket").build("close-message", {guild, channel, user, ticket}))
        if (generalConfig.data.ticketSystem.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("opendiscord:delete-ticket").build("close-message", {guild, channel, user, ticket}))
    }))

    //TICKET REOPENED
    messages.add(new api.ODMessage("opendiscord:reopen-message"))
    messages.get("opendiscord:reopen-message").workers.add(new api.ODWorker("opendiscord:reopen-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:reopen-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("opendiscord:close-ticket").build("reopen-message", {guild, channel, user, ticket}))
        if (generalConfig.data.ticketSystem.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("opendiscord:delete-ticket").build("reopen-message", {guild, channel, user, ticket}))
    }))

    //TICKET DELETED
    messages.add(new api.ODMessage("opendiscord:delete-message"))
    messages.get("opendiscord:delete-message").workers.add(new api.ODWorker("opendiscord:delete-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:delete-message").build(origin, {guild, channel, user, ticket, reason}))
    }))

    //TICKET CLAIMED
    messages.add(new api.ODMessage("opendiscord:claim-message"))
    messages.get("opendiscord:claim-message").workers.add(new api.ODWorker("opendiscord:claim-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:claim-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketClaimButtons) instance.addComponent(await buttons.getSafe("opendiscord:unclaim-ticket").build("claim-message", {guild, channel, user, ticket}))
    }))

    //TICKET UNCLAIMED
    messages.add(new api.ODMessage("opendiscord:unclaim-message"))
    messages.get("opendiscord:unclaim-message").workers.add(new api.ODWorker("opendiscord:unclaim-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:unclaim-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketClaimButtons) instance.addComponent(await buttons.getSafe("opendiscord:claim-ticket").build("unclaim-message", {guild, channel, user, ticket}))
    }))

    //TICKET PINNED
    messages.add(new api.ODMessage("opendiscord:pin-message"))
    messages.get("opendiscord:pin-message").workers.add(new api.ODWorker("opendiscord:pin-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:pin-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketPinButtons) instance.addComponent(await buttons.getSafe("opendiscord:unpin-ticket").build("pin-message", {guild, channel, user, ticket}))
    }))

    //TICKET UNPINNED
    messages.add(new api.ODMessage("opendiscord:unpin-message"))
    messages.get("opendiscord:unpin-message").workers.add(new api.ODWorker("opendiscord:unpin-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:unpin-message").build(origin, {guild, channel, user, ticket, reason}))
        if (generalConfig.data.ticketSystem.enableTicketPinButtons) instance.addComponent(await buttons.getSafe("opendiscord:pin-ticket").build("unpin-message", {guild, channel, user, ticket}))
    }))

    //TICKET RENAMED
    messages.add(new api.ODMessage("opendiscord:rename-message"))
    messages.get("opendiscord:rename-message").workers.add(new api.ODWorker("opendiscord:rename-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, data} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:rename-message").build(origin, {guild, channel, user, ticket, reason, data}))
    }))

    //TICKET MOVED
    messages.add(new api.ODMessage("opendiscord:move-message"))
    messages.get("opendiscord:move-message").workers.add(new api.ODWorker("opendiscord:move-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, data} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:move-message").build(origin, {guild, channel, user, ticket, reason, data}))
    }))

    //TICKET USER ADDED
    messages.add(new api.ODMessage("opendiscord:add-message"))
    messages.get("opendiscord:add-message").workers.add(new api.ODWorker("opendiscord:add-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, data} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:add-message").build(origin, {guild, channel, user, ticket, reason, data}))
    }))

    //TICKET USER REMOVED
    messages.add(new api.ODMessage("opendiscord:remove-message"))
    messages.get("opendiscord:remove-message").workers.add(new api.ODWorker("opendiscord:remove-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, data} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:remove-message").build(origin, {guild, channel, user, ticket, reason, data}))
    }))

    //TICKET ACTION DM
    messages.add(new api.ODMessage("opendiscord:ticket-action-dm"))
    messages.get("opendiscord:ticket-action-dm").workers.add(new api.ODWorker("opendiscord:ticket-action-dm", 0, async (instance, params, origin) => {
        const {guild, channel, user, mode, ticket, reason, additionalData, additionalData2} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, mode, ticket, reason, additionalData, additionalData2}))
    }))

    //TICKET ACTION LOGS
    messages.add(new api.ODMessage("opendiscord:ticket-action-logs"))
    messages.get("opendiscord:ticket-action-logs").workers.add(new api.ODWorker("opendiscord:ticket-action-logs", 0, async (instance, params, origin) => {
        const {guild, channel, user, mode, ticket, reason, additionalData, additionalData2} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, mode, ticket, reason, additionalData, additionalData2}))
    }))
}

const blacklistMessages = () => {
    //BLACKLIST VIEW
    messages.add(new api.ODMessage("opendiscord:blacklist-view"))
    messages.get("opendiscord:blacklist-view").workers.add(new api.ODWorker("opendiscord:blacklist-view", 0, async (instance, params, origin) => {
        const {guild, channel, user} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-view").build(origin, {guild, channel, user}))
    }))

    //BLACKLIST GET
    messages.add(new api.ODMessage("opendiscord:blacklist-get"))
    messages.get("opendiscord:blacklist-get").workers.add(new api.ODWorker("opendiscord:blacklist-get", 0, async (instance, params, origin) => {
        const {guild, channel, user, data} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-get").build(origin, {guild, channel, user, data}))
    }))

    //BLACKLIST ADD
    messages.add(new api.ODMessage("opendiscord:blacklist-add"))
    messages.get("opendiscord:blacklist-add").workers.add(new api.ODWorker("opendiscord:blacklist-add", 0, async (instance, params, origin) => {
        const {guild, channel, user, data, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-add").build(origin, {guild, channel, user, data, reason}))
    }))

    //BLACKLIST REMOVE
    messages.add(new api.ODMessage("opendiscord:blacklist-remove"))
    messages.get("opendiscord:blacklist-remove").workers.add(new api.ODWorker("opendiscord:blacklist-remove", 0, async (instance, params, origin) => {
        const {guild, channel, user, data, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-remove").build(origin, {guild, channel, user, data, reason}))
    }))

    //BLACKLIST DM
    messages.add(new api.ODMessage("opendiscord:blacklist-dm"))
    messages.get("opendiscord:blacklist-dm").workers.add(new api.ODWorker("opendiscord:blacklist-dm", 0, async (instance, params, origin) => {
        const {guild, channel, user, mode, data, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-dm").build(origin, {guild, channel, user, mode, data, reason}))
    }))

    //BLACKLIST LOGS
    messages.add(new api.ODMessage("opendiscord:blacklist-logs"))
    messages.get("opendiscord:blacklist-logs").workers.add(new api.ODWorker("opendiscord:blacklist-logs", 0, async (instance, params, origin) => {
        const {guild, channel, user, mode, data, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:blacklist-logs").build(origin, {guild, channel, user, mode, data, reason}))
    }))
}

const transcriptMessages = () => {
    //TRANSCRIPT TEXT READY
    messages.add(new api.ODMessage("opendiscord:transcript-text-ready"))
    messages.get("opendiscord:transcript-text-ready").workers.add(new api.ODWorker("opendiscord:transcript-text-ready", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, compiler, result} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transcript-text-ready").build(origin, {guild, channel, user, ticket, compiler, result}))
        instance.addFile(await files.getSafe("opendiscord:text-transcript").build(origin, {guild, channel, user, ticket, compiler, result}))
    }))

    //TRANSCRIPT HTML READY
    messages.add(new api.ODMessage("opendiscord:transcript-html-ready"))
    messages.get("opendiscord:transcript-html-ready").workers.add(new api.ODWorker("opendiscord:transcript-html-ready", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, compiler, result} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transcript-html-ready").build(origin, {guild, channel, user, ticket, compiler, result}))
        instance.addComponent(await buttons.getSafe("opendiscord:transcript-html-visit").build(origin, {guild, channel, user, ticket, compiler, result}))
    }))

    //TRANSCRIPT HTML PROGRESS
    messages.add(new api.ODMessage("opendiscord:transcript-html-progress"))
    messages.get("opendiscord:transcript-html-progress").workers.add(new api.ODWorker("opendiscord:transcript-html-progress", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, compiler, remaining} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transcript-html-progress").build(origin, {guild, channel, user, ticket, compiler, remaining}))
    }))

    //TRANSCRIPT ERROR
    messages.add(new api.ODMessage("opendiscord:transcript-error"))
    messages.get("opendiscord:transcript-error").workers.add(new api.ODWorker("opendiscord:transcript-error", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, compiler, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transcript-error").build(origin, {guild, channel, user, ticket, compiler, reason}))
        instance.addComponent(await buttons.getSafe("opendiscord:transcript-error-retry").build(origin, {guild, channel, user, ticket, compiler, reason}))
        instance.addComponent(await buttons.getSafe("opendiscord:transcript-error-continue").build(origin, {guild, channel, user, ticket, compiler, reason}))
    }))

    //TRANSCRIPT HISTORY
    messages.add(new api.ODMessage("opendiscord:transcript-history"))
    messages.get("opendiscord:transcript-history").workers.add(new api.ODWorker("opendiscord:transcript-history", 0, async (instance, params, origin) => {
        const {guild, channel, user, transcriptUser, transcriptList} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transcript-history").build(origin, {guild, channel, user, transcriptUser, transcriptList}))
        instance.setEphemeral(true)
    }))
}

const roleMessages = () => {
    //REACTION ROLE
    messages.add(new api.ODMessage("opendiscord:reaction-role"))
    messages.get("opendiscord:reaction-role").workers.add(new api.ODWorker("opendiscord:reaction-role", 0, async (instance, params, origin) => {
        const {guild, user, role, result} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:reaction-role").build(origin, {guild, user, role, result}))
        instance.setEphemeral(true)
    }))

    //REACTION ROLE DM
    messages.add(new api.ODMessage("opendiscord:reaction-role-dm"))
    messages.get("opendiscord:reaction-role-dm").workers.add(new api.ODWorker("opendiscord:reaction-role-dm", 0, async (instance, params, origin) => {
        const {guild, user, role, result} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:reaction-role-dm").build(origin, {guild, user, role, result}))
    }))

    //REACTION ROLE LOGS
    messages.add(new api.ODMessage("opendiscord:reaction-role-logs"))
    messages.get("opendiscord:reaction-role-logs").workers.add(new api.ODWorker("opendiscord:reaction-role-logs", 0, async (instance, params, origin) => {
        const {guild, user, role, result} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:reaction-role-logs").build(origin, {guild, user, role, result}))
    }))
}

const clearMessages = () => {
    //CLEAR VERIFY MESSAGE
    messages.add(new api.ODMessage("opendiscord:clear-verify-message"))
    messages.get("opendiscord:clear-verify-message").workers.add(new api.ODWorker("opendiscord:clear-verify-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, filter, list, inProgress} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:clear-verify-message").build(origin, {guild, channel, user, filter, list, inProgress}))
        instance.addComponent(await buttons.getSafe("opendiscord:clear-continue").build(origin, {guild, channel, user, filter, list, inProgress}))
        instance.setEphemeral(true)
    }))

    //CLEAR MESSAGE
    messages.add(new api.ODMessage("opendiscord:clear-message"))
    messages.get("opendiscord:clear-message").workers.add(new api.ODWorker("opendiscord:clear-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, filter, list} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:clear-message").build(origin, {guild, channel, user, filter, list}))
        instance.setEphemeral(true)
    }))

    //CLEAR LOGS
    messages.add(new api.ODMessage("opendiscord:clear-logs"))
    messages.get("opendiscord:clear-logs").workers.add(new api.ODWorker("opendiscord:clear-logs", 0, async (instance, params, origin) => {
        const {guild, channel, user, filter, list} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:clear-logs").build(origin, {guild, channel, user, filter, list}))
    }))
}

const autoMessages = () => {
    //AUTOCLOSE MESSAGE
    messages.add(new api.ODMessage("opendiscord:autoclose-message"))
    messages.get("opendiscord:autoclose-message").workers.add(new api.ODWorker("opendiscord:autoclose-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autoclose-message").build(origin, {guild, channel, user, ticket}))
        if (generalConfig.data.ticketSystem.enableTicketCloseButtons) instance.addComponent(await buttons.getSafe("opendiscord:reopen-ticket").build("autoclose-message", {guild, channel, user, ticket}))
        if (generalConfig.data.ticketSystem.enableTicketDeleteButtons) instance.addComponent(await buttons.getSafe("opendiscord:delete-ticket").build("autoclose-message", {guild, channel, user, ticket}))
    }))

    //AUTODELETE MESSAGE
    messages.add(new api.ODMessage("opendiscord:autodelete-message"))
    messages.get("opendiscord:autodelete-message").workers.add(new api.ODWorker("opendiscord:autodelete-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autodelete-message").build(origin, {guild, channel, user, ticket}))
    }))

    //AUTOCLOSE ENABLE
    messages.add(new api.ODMessage("opendiscord:autoclose-enable"))
    messages.get("opendiscord:autoclose-enable").workers.add(new api.ODWorker("opendiscord:autoclose-enable", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, time} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autoclose-enable").build(origin, {guild, channel, user, ticket, reason, time}))
    }))

    //AUTODELETE ENABLE
    messages.add(new api.ODMessage("opendiscord:autodelete-enable"))
    messages.get("opendiscord:autodelete-enable").workers.add(new api.ODWorker("opendiscord:autodelete-enable", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason, time} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autodelete-enable").build(origin, {guild, channel, user, ticket, reason, time}))
    }))

    //AUTOCLOSE DISABLE
    messages.add(new api.ODMessage("opendiscord:autoclose-disable"))
    messages.get("opendiscord:autoclose-disable").workers.add(new api.ODWorker("opendiscord:autoclose-disable", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autoclose-disable").build(origin, {guild, channel, user, ticket, reason}))
    }))

    //AUTODELETE DISABLE
    messages.add(new api.ODMessage("opendiscord:autodelete-disable"))
    messages.get("opendiscord:autodelete-disable").workers.add(new api.ODWorker("opendiscord:autodelete-disable", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:autodelete-disable").build(origin, {guild, channel, user, ticket, reason}))
    }))
}

const extraMessages = () => {
    //TOPIC SET
    messages.add(new api.ODMessage("opendiscord:topic-set"))
    messages.get("opendiscord:topic-set").workers.add(new api.ODWorker("opendiscord:topic-set", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, topic} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:topic-set").build(origin, {guild, channel, user, ticket, topic}))
    }))

    //PRIORITY SET
    messages.add(new api.ODMessage("opendiscord:priority-set"))
    messages.get("opendiscord:priority-set").workers.add(new api.ODWorker("opendiscord:priority-set", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, priority, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:priority-set").build(origin, {guild, channel, user, ticket, priority, reason}))
    }))

    //PRIORITY GET
    messages.add(new api.ODMessage("opendiscord:priority-get"))
    messages.get("opendiscord:priority-get").workers.add(new api.ODWorker("opendiscord:priority-get", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, priority} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:priority-get").build(origin, {guild, channel, user, ticket, priority}))
    }))

    //TRANSFER MESSAGE
    messages.add(new api.ODMessage("opendiscord:transfer-message"))
    messages.get("opendiscord:transfer-message").workers.add(new api.ODWorker("opendiscord:transfer-message", 0, async (instance, params, origin) => {
        const {guild, channel, user, ticket, oldCreator, newCreator, reason} = params
        instance.addEmbed(await embeds.getSafe("opendiscord:transfer-message").build(origin, {guild, channel, user, ticket, oldCreator, newCreator, reason}))
    }))
}