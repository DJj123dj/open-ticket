import {opendiscord, api, utilities} from "../../index"
import * as discord from "discord.js"

export const loadAllPermissions = async () => {
    const generalConfig = opendiscord.configs.get("openticket:general")
    if (!generalConfig) return
    const mainServer = opendiscord.client.mainServer
    if (!mainServer) return

    //DEVELOPER & OWNER
    const developer = (await opendiscord.client.client.application.fetch()).owner
    if (developer instanceof discord.User){
        opendiscord.permissions.add(new api.ODPermission("openticket:developer-"+developer.id,"global-user","developer",developer))
    }else if (developer instanceof discord.Team){
        developer.members.forEach((member) => {
            opendiscord.permissions.add(new api.ODPermission("openticket:developer-"+member.user.id,"global-user","developer",member.user))
        })
    }
    const owner = (await mainServer.members.fetch(mainServer.ownerId)).user
    opendiscord.permissions.add(new api.ODPermission("openticket:owner-"+owner.id,"global-user","owner",owner))

    //GLOBAL ADMINS
    generalConfig.data.globalAdmins.forEach(async (admin) => {
        const role = await mainServer.roles.fetch(admin)
        if (!role) return opendiscord.log("Unable to register permission for global admin!","error",[
            {key:"roleid",value:admin}
        ])

        opendiscord.permissions.add(new api.ODPermission("openticket:global-admin-"+admin,"global-role","admin",role))
    })

    //TICKET ADMINS
    await opendiscord.tickets.loopAll(async (ticket) => {
        try {
            const channel = await opendiscord.client.fetchGuildTextChannel(mainServer,ticket.id.value)
            if (!channel) return

            const admins = ticket.option.exists("openticket:admins") ? ticket.option.get("openticket:admins").value : []
            const readAdmins = ticket.option.exists("openticket:admins-readonly") ? ticket.option.get("openticket:admins-readonly").value : []

            for (const admin of admins.concat(readAdmins)){
                if (opendiscord.permissions.exists("openticket:ticket-admin_"+ticket.id.value+"_"+admin)) return
                const role = await mainServer.roles.fetch(admin)
                if (!role) return opendiscord.log("Unable to register permission for ticket admin!","error",[
                    {key:"roleid",value:admin}
                ])
                
                opendiscord.permissions.add(new api.ODPermission("openticket:ticket-admin_"+ticket.id.value+"_"+admin,"channel-role","support",role,channel))
            }
        }catch(err){
            process.emit("uncaughtException",err)
            opendiscord.log("Ticket Admin Loading Permissions Error (see above)","error")
        }
    })
}

export const addTicketPermissions = async (ticket:api.ODTicket) => {
    const mainServer = opendiscord.client.mainServer
    if (!mainServer) return
    const channel = await opendiscord.client.fetchGuildTextChannel(mainServer,ticket.id.value)
    if (!channel) return

    const admins = ticket.option.exists("openticket:admins") ? ticket.option.get("openticket:admins").value : []
    const readAdmins = ticket.option.exists("openticket:admins-readonly") ? ticket.option.get("openticket:admins-readonly").value : []

    for (const admin of admins.concat(readAdmins)){
        if (opendiscord.permissions.exists("openticket:ticket-admin_"+ticket.id.value+"_"+admin)) return
        const role = await mainServer.roles.fetch(admin)
        if (!role) return opendiscord.log("Unable to register permission for ticket admin!","error",[
            {key:"roleid",value:admin}
        ])
        
        opendiscord.permissions.add(new api.ODPermission("openticket:ticket-admin_"+ticket.id.value+"_"+admin,"channel-role","support",role,channel))
    }
}

export const removeTicketPermissions = async (ticket:api.ODTicket) => {
    const admins = ticket.option.exists("openticket:admins") ? ticket.option.get("openticket:admins").value : []
    const readAdmins = ticket.option.exists("openticket:admins-readonly") ? ticket.option.get("openticket:admins-readonly").value : []

    admins.concat(readAdmins).forEach(async (admin) => {
        if (!opendiscord.permissions.exists("openticket:ticket-admin_"+ticket.id.value+"_"+admin)) return
        opendiscord.permissions.remove("openticket:ticket-admin_"+ticket.id.value+"_"+admin)
    })
}