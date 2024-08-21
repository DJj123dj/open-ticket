///////////////////////////////////////
//DROPDOWN BUILDERS
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const dropdowns = openticket.builders.dropdowns

export const registerAllDropdowns = async () => {
    panelDropdowns()
}

const panelDropdowns = () => {
    //TICKET OPTION
    dropdowns.add(new api.ODDropdown("openticket:panel-dropdown-tickets"))
    dropdowns.get("openticket:panel-dropdown-tickets").workers.add(
        new api.ODWorker("openticket:panel-dropdown-tickets",0,async (instance,params) => {
            const {panel,options} = params
            
            const parsedOptions = options.map((option) => {
                return {
                    label:option.get("openticket:button-label").value.substring(0,100),
                    value:"od:ticket-option_"+panel.id.value+"_"+option.id.value,
                    emoji:option.get("openticket:button-emoji").value,
                    description:option.get("openticket:description").value.substring(0,100)
                }
            })

            instance.setCustomId("od:panel-dropdown_"+panel.id.value)
            instance.setType("string")
            instance.setMaxValues(1)
            instance.setMinValues(0)
            instance.setPlaceholder(panel.get("openticket:dropdown-placeholder").value)
            instance.setOptions(parsedOptions)
        })
    )
}