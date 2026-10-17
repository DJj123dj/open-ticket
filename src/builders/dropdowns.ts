///////////////////////////////////////
//DROPDOWN BUILDERS
///////////////////////////////////////
import { opendiscord, api, utilities } from "../index.js"
import * as discord from "discord.js"

const dropdowns = opendiscord.builders.dropdowns
const lang = opendiscord.languages

export async function registerAllDropdowns() {
    panelDropdowns()
}

const panelDropdowns = () => {
    //PANEL DROPDOWN
    dropdowns.add(new api.ODDropdown("opendiscord:panel-dropdown"))
    dropdowns.get("opendiscord:panel-dropdown").workers.add(new api.ODWorker("opendiscord:panel-dropdown", 0, async (instance, params) => {
        const {panel, options} = params

        const parsedOptions: api.ODDropdownData["options"] = options.map((option) => {
            if (option instanceof api.ODTicketOption){
                const label = option.get("opendiscord:button-label").value.substring(0, 100)
                const desc = option.get("opendiscord:description").value.substring(0, 100)
                const emoji = option.get("opendiscord:button-emoji").value

                return {
                    label:(label.length > 0) ? label : "<no-label-provided>",
                    value:"od:ticket-option|" + option.id.value,
                    emoji:(emoji.length > 0) ? emoji : undefined,
                    description:(desc.length > 0) ? desc : undefined,
                    default:false
                }
            }else if (option instanceof api.ODRoleOption){
                const label = option.get("opendiscord:button-label").value.substring(0, 100)
                const desc = option.get("opendiscord:description").value.substring(0, 100)
                const emoji = option.get("opendiscord:button-emoji").value

                return {
                    label:(label.length > 0) ? label : "<no-label-provided>",
                    value:"od:role-option|" + option.id.value,
                    emoji:(emoji.length > 0) ? emoji : undefined,
                    description:(desc.length > 0) ? desc : undefined,
                    default:false
                }
            }else if (option instanceof api.ODSubPanelOption){
                const label = option.get("opendiscord:button-label").value.substring(0, 100)
                const desc = option.get("opendiscord:description").value.substring(0, 100)
                const emoji = option.get("opendiscord:button-emoji").value

                return {
                    label:(label.length > 0) ? label : "<no-label-provided>",
                    value:"od:subpanel-option|" + option.id.value,
                    emoji:(emoji.length > 0) ? emoji : undefined,
                    description:(desc.length > 0) ? desc : undefined,
                    default:false
                }
            }else throw new api.ODSystemError("Unable to create panel dropdown with options that don't match: ticket, role, sub-panel!")
        })

        instance.setCustomId("od:panel-dropdown")
        instance.setType("string")
        instance.setMaxValues(1)
        instance.setMinValues(0)
        instance.setPlaceholder(panel.get("opendiscord:dropdown-placeholder").value)
        instance.setOptions(parsedOptions)
    }))

    //PRIORITY DROPDOWN
    dropdowns.add(new api.ODDropdown("opendiscord:priority-dropdown"))
    dropdowns.get("opendiscord:priority-dropdown").workers.add(new api.ODWorker("opendiscord:priority-dropdown", 0, async (instance, params) => {
        const {ticket} = params

        const parsedOptions: api.ODDropdownData["options"] = opendiscord.priorities.getAll().sort((a, b) => b.priority - a.priority).map((prio) => ({
            label:prio.displayName,
            emoji:prio.displayEmoji ?? undefined,
            value:"od:select-priority|" + prio.rawName
        }))

        const currentPriority = opendiscord.priorities.getFromPriorityLevel(ticket.get("opendiscord:priority").value)
        const placeholder = (currentPriority.priority < 0) ? lang.getTranslation("panel.selectPriorityLevel") : (lang.getTranslation("params.uppercase.priority") + ": " + currentPriority.renderDisplayName())

        instance.setCustomId("od:priority-dropdown")
        instance.setType("string")
        instance.setMaxValues(1)
        instance.setMinValues(0)
        instance.setPlaceholder(placeholder)
        instance.setOptions(parsedOptions)
    }))
}