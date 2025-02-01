import {opendiscord, api, utilities} from "../../index"

const optionDatabase = opendiscord.databases.get("opendiscord:options")

export const loadAllTickets = async () => {
    const ticketDatabase = opendiscord.databases.get("opendiscord:tickets")
    if (!ticketDatabase) return

    const tickets = await ticketDatabase.getCategory("opendiscord:ticket")
    if (!tickets) return
    for (const ticket of tickets){
        try {
            opendiscord.tickets.add(await loadTicket(ticket.value))
        }catch (err){
            process.emit("uncaughtException",err)
            process.emit("uncaughtException",new api.ODSystemError("Failed to load ticket from database! => id: "+ticket.key+"\n ===> "+err))
        }
    }
}

export const loadTicket = async (ticket:api.ODTicketJson) => {
    const backupOption = (await optionDatabase.exists("opendiscord:used-option",ticket.option)) ? api.ODTicketOption.fromJson(await optionDatabase.get("opendiscord:used-option",ticket.option) as api.ODOptionJson) : null
    const configOption = opendiscord.options.get(ticket.option)
    
    //check if option is of type "ticket"
    if (configOption && !(configOption instanceof api.ODTicketOption)) throw new api.ODSystemError("Unable to load ticket because option is not of 'ticket' type!")

    //manage backup option
    if (configOption) await optionDatabase.set("opendiscord:used-option",configOption.id.value,configOption.toJson(opendiscord.versions.get("opendiscord:version")))
    else if (backupOption) opendiscord.options.add(backupOption)
    else throw new api.ODSystemError("Unable to use backup option! Normal option not found in config!")

    //load ticket & option
    const option = (configOption ?? backupOption) as api.ODTicketOption
    return api.ODTicket.fromJson(ticket,option)
}