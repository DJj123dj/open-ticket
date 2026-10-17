///////////////////////////////////////
//AUTOCOMPLETE COMMAND UTILS
///////////////////////////////////////
import { opendiscord, api, utilities } from "../index.js"
import * as discord from "discord.js"

export async function registerAutocompleteResponders() {
    //PANEL ID AUTOCOMPLETE
    opendiscord.responders.autocomplete.add(new api.ODAutocompleteResponder("opendiscord:panel-id", "panel", "id"))
    opendiscord.responders.autocomplete.get("opendiscord:panel-id").workers.add(new api.ODWorker("opendiscord:panel-id", 0, async (instance, params, origin, cancel) => {
        //create panel choices
        const panelChoices : {name:string, value:string}[] = []
        opendiscord.configs.get("opendiscord:panels").data.forEach((panel) => {
            panelChoices.push({name:panel.name, value:panel.id})
        })

        await instance.filteredAutocomplete(panelChoices)
    }))

    //OPTION ID AUTOCOMPLETE
    opendiscord.responders.autocomplete.add(new api.ODAutocompleteResponder("opendiscord:option-id", /ticket|move/, "id"))
    opendiscord.responders.autocomplete.get("opendiscord:option-id").workers.add(new api.ODWorker("opendiscord:option-id", 0, async (instance, params, origin, cancel) => {
        //create ticket choices
        const ticketChoices : {name:string, value:string}[] = []
        opendiscord.configs.get("opendiscord:options").data.forEach((option) => {
            if (option.type !== "ticket") return
            ticketChoices.push({name:option.name, value:option.id})
        })

        instance.filteredAutocomplete(ticketChoices)
    }))
}