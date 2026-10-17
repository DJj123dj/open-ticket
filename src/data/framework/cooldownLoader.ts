import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllCooldowns() {
    await opendiscord.options.loopAll((option) => {
        if (!(option instanceof api.ODTicketOption)) return
        loadTicketOptionCooldown(option)
    })
}

export const loadTicketOptionCooldown = (option:api.ODTicketOption) => {
    if (option.get("opendiscord:cooldown-enabled").value){
        //option has cooldown
        const minutes = option.get("opendiscord:cooldown-minutes").value
        const milliseconds = minutes * 60000
        opendiscord.cooldowns.add(new api.ODTimeoutCooldown("opendiscord:option-cooldown_" + option.id.value, milliseconds))
    }
}