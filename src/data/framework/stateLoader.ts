import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllStates() {
    const stateDatabase = opendiscord.databases.get("opendiscord:message-states")

    opendiscord.states.add(new api.ODInteractiveMessageState("opendiscord:interactive-message", opendiscord.client, stateDatabase))
    opendiscord.states.add(new api.ODClearMessageState("opendiscord:clear-message", opendiscord.client, stateDatabase))
    opendiscord.states.add(new api.ODPanelMessageState("opendiscord:panel-message", opendiscord.client, stateDatabase))
}