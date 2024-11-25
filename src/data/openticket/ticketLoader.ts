import {openticket, api, utilities} from "../../index"

const optionDatabase = openticket.databases.get("openticket:options")

export const loadAllTickets = async () => {
    const ticketDatabase = openticket.databases.get("openticket:tickets")
    if (!ticketDatabase) return

    const tickets = await ticketDatabase.getCategory("openticket:ticket")
    if (!tickets) return
    for (const ticket of tickets){
        try {
            openticket.tickets.add(await loadTicket(ticket.value))
        }catch (err){
            process.emit("uncaughtException",err)
            process.emit("uncaughtException",new api.ODSystemError("Failed to load ticket from database! => id: "+ticket.key+"\n ===> "+err))
        }
    }
}

export const loadTicket = async (ticket:api.ODTicketJson) => {
    const backupOption = (await optionDatabase.exists("openticket:used-option",ticket.option)) ? api.ODTicketOption.fromJson(await optionDatabase.get("openticket:used-option",ticket.option) as api.ODOptionJson) : null
    const configOption = openticket.options.get(ticket.option)
    
    //check if option is of type "ticket"
    if (configOption && !(configOption instanceof api.ODTicketOption)) throw new api.ODSystemError("Unable to load ticket because option is not of 'ticket' type!")

    //manage backup option
    if (configOption) await optionDatabase.set("openticket:used-option",configOption.id.value,configOption.toJson(openticket.versions.get("openticket:version")))
    else if (backupOption) openticket.options.add(backupOption)
    else throw new api.ODSystemError("Unable to use backup option! Normal option not found in config!")

    //load ticket & option
    const option = (configOption ?? backupOption) as api.ODTicketOption
    return api.ODTicket.fromJson(ticket,option)
}