import {openticket, api, utilities} from "../../index"

export const loadAllCooldowns = async () => {
    await openticket.options.loopAll((option) => {
        if (!(option instanceof api.ODTicketOption)) return
        loadTicketOptionCooldown(option)
    })
}

export const loadTicketOptionCooldown = (option:api.ODTicketOption) => {
    if (option.get("openticket:cooldown-enabled").value){
        //option has cooldown
        const minutes = option.get("openticket:cooldown-minutes").value
        const milliseconds = minutes*60000
        openticket.cooldowns.add(new api.ODTimeoutCooldown("openticket:option-cooldown_"+option.id.value,milliseconds))
    }
}