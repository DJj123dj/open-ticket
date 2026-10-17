///////////////////////////////////////
//VERIFYBAR SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

export async function registerButtonResponders() {
    //HANDLE VERIFYBAR BUTTON
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:verifybar-button", /^od:verifybar\|([^|]+)\|([^|]+)/))
    opendiscord.responders.buttons.get("opendiscord:verifybar-button").workers.add(new api.ODWorker("opendiscord:handle-verifybar", 0, async (instance, params, origin, cancel) => {
        const match = /^od:verifybar\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
        if (!match) return cancel()
        const verifyBarId = match[1]
        const verifyButtonId = match[2]

        const verifybar = opendiscord.verifybars.get(verifyBarId)
        if (!verifybar) return
        await verifybar.activate(instance, verifyButtonId)
    }))
}