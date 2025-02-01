///////////////////////////////////////
//TICKET CREATION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:create-ticket-permissions"))
    opendiscord.actions.get("opendiscord:create-ticket-permissions").workers.add([
        new api.ODWorker("opendiscord:check-blacklist",4,(instance,params,source,cancel) => {
            if (!params.option.get("opendiscord:allow-blacklisted-users").value && opendiscord.blacklist.exists(params.user.id)){
                instance.valid = false
                instance.reason = "blacklist"
                opendiscord.log(params.user.displayName+" tried to create a ticket but is blacklisted!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value}
                ])
                return cancel()
            }
        }),
        new api.ODWorker("opendiscord:check-cooldown",3,(instance,params,source,cancel) => {
            const cooldown = opendiscord.cooldowns.get("opendiscord:option-cooldown_"+params.option.id.value)
            if (cooldown && cooldown instanceof api.ODTimeoutCooldown && cooldown.use(params.user.id)){
                instance.valid = false
                instance.reason = "cooldown"
                const remaining = cooldown.remaining(params.user.id) ?? 0
                instance.cooldownUntil = new Date(new Date().getTime() + remaining)

                opendiscord.log(params.user.displayName+" tried to create a ticket but is on cooldown!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value},
                    {key:"remaining",value:(remaining/1000).toString()+"sec"}
                ])
                return cancel()
            }
        }),
        new api.ODWorker("opendiscord:check-global-limits",2,(instance,params,source,cancel) => {
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            if (!generalConfig.data.system.limits.enabled) return

            const allTickets = opendiscord.tickets.getAll()
            const globalTicketCount = allTickets.length
            const userTickets = opendiscord.tickets.getFiltered((ticket) => ticket.exists("opendiscord:opened-by") && (ticket.get("opendiscord:opened-by").value == params.user.id))
            const userTicketCount = userTickets.length

            if (globalTicketCount >= generalConfig.data.system.limits.globalMaximum){
                instance.valid = false
                instance.reason = "global-limit"
                opendiscord.log(params.user.displayName+" tried to create a ticket but reached the limit!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value},
                    {key:"limit",value:"global"}
                ])
                return cancel()
            }else if (userTicketCount >= generalConfig.data.system.limits.userMaximum){
                instance.valid = false
                instance.reason = "global-user-limit"
                opendiscord.log(params.user.displayName+" tried to create a ticket, but reached the limit!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value},
                    {key:"limit",value:"global-user"}
                ])
                return cancel()
            }
        }),
        new api.ODWorker("opendiscord:check-option-limits",1,(instance,params,source,cancel) => {
            if (!params.option.exists("opendiscord:limits-enabled") || !params.option.get("opendiscord:limits-enabled").value) return

            const allTickets = opendiscord.tickets.getFiltered((ticket) => ticket.option.id.value == params.option.id.value)
            const globalTicketCount = allTickets.length
            const userTickets = opendiscord.tickets.getFiltered((ticket) => ticket.option.id.value == params.option.id.value && ticket.exists("opendiscord:opened-by") && (ticket.get("opendiscord:opened-by").value == params.user.id))
            const userTicketCount = userTickets.length

            if (globalTicketCount >= params.option.get("opendiscord:limits-maximum-global").value){
                instance.valid = false
                instance.reason = "option-limit"
                opendiscord.log(params.user.displayName+" tried to create a ticket, but reached the limit!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value},
                    {key:"limit",value:"option"}
                ])
                return cancel()
            }else if (userTicketCount >= params.option.get("opendiscord:limits-maximum-user").value){
                instance.valid = false
                instance.reason = "option-user-limit"
                opendiscord.log(params.user.displayName+" tried to create a ticket, but reached the limit!","info",[
                    {key:"user",value:params.user.username},
                    {key:"userid",value:params.user.id,hidden:true},
                    {key:"option",value:params.option.id.value},
                    {key:"limit",value:"option-user"}
                ])
                return cancel()
            }
        }),
        new api.ODWorker("opendiscord:valid",0,(instance,params,source,cancel) => {
            instance.valid = true
            instance.reason = null
            cancel()
        })
    ])
}