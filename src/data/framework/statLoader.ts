import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"

const stats = openticket.stats
const lang = openticket.languages

export const loadAllStatScopes = async () => {
    stats.add(new api.ODStatGlobalScope("openticket:global",utilities.emojiTitle("📊",lang.getTranslation("stats.scopes.global"))))
    stats.add(new api.ODStatGlobalScope("openticket:system",utilities.emojiTitle("⚙️",lang.getTranslation("stats.scopes.system"))))
    stats.add(new api.ODStatScope("openticket:user",utilities.emojiTitle("📊",lang.getTranslation("stats.scopes.user"))))
    stats.add(new api.ODStatScope("openticket:ticket",utilities.emojiTitle("📊",lang.getTranslation("stats.scopes.ticket"))))
    stats.add(new api.ODStatScope("openticket:participants",utilities.emojiTitle("👥",lang.getTranslation("stats.scopes.participants"))))
}

export const loadAllStats = async () => {
    const generalConfig = openticket.configs.get("openticket:general")
    if (!generalConfig) return

    const global = stats.get("openticket:global")
    if (global){
        global.add(new api.ODBasicStat("openticket:tickets-created",10,lang.getTranslation("stats.properties.ticketsCreated"),0))
        global.add(new api.ODBasicStat("openticket:tickets-closed",9,lang.getTranslation("stats.properties.ticketsClosed"),0))
        global.add(new api.ODBasicStat("openticket:tickets-deleted",8,lang.getTranslation("stats.properties.ticketsDeleted"),0))
        global.add(new api.ODBasicStat("openticket:tickets-reopened",7,lang.getTranslation("stats.properties.ticketsReopened"),0))
        global.add(new api.ODBasicStat("openticket:tickets-autoclosed",6,lang.getTranslation("stats.properties.ticketsAutoclosed"),0))
        global.add(new api.ODBasicStat("openticket:tickets-autodeleted",5,"Tickets Autodeleted",0)) //TODO TRANSLATION!!!
        global.add(new api.ODBasicStat("openticket:tickets-claimed",4,lang.getTranslation("stats.properties.ticketsClaimed"),0))
        global.add(new api.ODBasicStat("openticket:tickets-pinned",3,lang.getTranslation("stats.properties.ticketsPinned"),0))
        global.add(new api.ODBasicStat("openticket:tickets-moved",2,lang.getTranslation("stats.properties.ticketsMoved"),0))
        global.add(new api.ODBasicStat("openticket:users-blacklisted",1,lang.getTranslation("stats.properties.usersBlacklisted"),0))
        global.add(new api.ODBasicStat("openticket:transcripts-created",0,lang.getTranslation("stats.properties.transcriptsCreated"),0))
    }

    const system = stats.get("openticket:system")
    if (system){
        system.add(new api.ODDynamicStat("openticket:startup-date",1,() => {
            return lang.getTranslation("params.uppercase.startupDate")+": "+discord.time(new Date(),"f")
        }))
        system.add(new api.ODDynamicStat("openticket:version",0,() => {
            return lang.getTranslation("params.uppercase.version")+": `"+openticket.versions.get("openticket:version").toString()+"`"
        }))
    }

    const user = stats.get("openticket:user")
    if (user){
        user.add(new api.ODDynamicStat("openticket:name",11,async (scopeId,guild,channel,user) => {
            return lang.getTranslation("params.uppercase.name")+": "+discord.userMention(scopeId)
        }))
        user.add(new api.ODDynamicStat("openticket:role",10,async (scopeId,guild,channel,user) => {
            try{
                const scopeMember = await guild.members.fetch(scopeId)
                if (!scopeMember) return ""

                const permissions = await openticket.permissions.getPermissions(scopeMember.user,channel,guild)
                if (permissions.type == "developer") return lang.getTranslation("params.uppercase.role")+": 💻 `Developer`" //TODO TRANSLATION!!!
                if (permissions.type == "owner") return lang.getTranslation("params.uppercase.role")+": 👑 `Server Owner`" //TODO TRANSLATION!!!
                if (permissions.type == "admin") return lang.getTranslation("params.uppercase.role")+": 💼 `Server Admin`" //TODO TRANSLATION!!!
                if (permissions.type == "moderator") return lang.getTranslation("params.uppercase.role")+": 🚔 `Moderator Team`" //TODO TRANSLATION!!!
                if (permissions.type == "support") return lang.getTranslation("params.uppercase.role")+": 💬 `Support Team`" //TODO TRANSLATION!!!
                else return lang.getTranslation("params.uppercase.role")+": 👤 `Member`" //TODO TRANSLATION!!!
            }catch{
                return ""
            }
        }))
        user.add(new api.ODBasicStat("openticket:tickets-created",8,lang.getTranslation("stats.properties.ticketsCreated"),0))
        user.add(new api.ODBasicStat("openticket:tickets-closed",7,lang.getTranslation("stats.properties.ticketsClosed"),0))
        user.add(new api.ODBasicStat("openticket:tickets-deleted",6,lang.getTranslation("stats.properties.ticketsDeleted"),0))
        user.add(new api.ODBasicStat("openticket:tickets-reopened",5,lang.getTranslation("stats.properties.ticketsReopened"),0))
        user.add(new api.ODBasicStat("openticket:tickets-claimed",4,lang.getTranslation("stats.properties.ticketsClaimed"),0))
        user.add(new api.ODBasicStat("openticket:tickets-pinned",3,lang.getTranslation("stats.properties.ticketsPinned"),0))
        user.add(new api.ODBasicStat("openticket:tickets-moved",2,lang.getTranslation("stats.properties.ticketsMoved"),0))
        user.add(new api.ODBasicStat("openticket:users-blacklisted",1,lang.getTranslation("stats.properties.usersBlacklisted"),0))
        user.add(new api.ODBasicStat("openticket:transcripts-created",0,lang.getTranslation("stats.properties.transcriptsCreated"),0))
    }

    const ticket = stats.get("openticket:ticket")
    if (ticket){
        ticket.add(new api.ODDynamicStat("openticket:name",5,async (scopeId,guild,channel,user) => {
            return lang.getTranslation("params.uppercase.ticket")+": "+discord.channelMention(scopeId)
        }))
        ticket.add(new api.ODDynamicStat("openticket:status",4,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""

            const closed = ticket.exists("openticket:closed") ? ticket.get("openticket:closed").value : false
            
            return closed ? lang.getTranslation("params.uppercase.status")+": 🔒 `Closed`" : lang.getTranslation("params.uppercase.status")+": 🔓 `Open`" //TODO TRANSLATION!!!
        }))
        ticket.add(new api.ODDynamicStat("openticket:claimed",3,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""
            
            const claimed = ticket.exists("openticket:claimed") ? ticket.get("openticket:claimed").value : false
            return claimed ? lang.getTranslation("params.uppercase.claimed")+": 🟢 `Yes`" : lang.getTranslation("params.uppercase.claimed")+": 🔴 `No`"
        }))
        ticket.add(new api.ODDynamicStat("openticket:pinned",2,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""
            
            const pinned = ticket.exists("openticket:pinned") ? ticket.get("openticket:pinned").value : false
            return pinned ? lang.getTranslation("params.uppercase.pinned")+": 🟢 `Yes`" : lang.getTranslation("params.uppercase.pinned")+": 🔴 `No`"
        }))
        ticket.add(new api.ODDynamicStat("openticket:creation-date",1,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""
            
            const rawDate = ticket.get("openticket:opened-on").value ?? new Date().getTime()
            return lang.getTranslation("params.uppercase.creationDate")+": "+discord.time(new Date(rawDate),"f")
        }))
        ticket.add(new api.ODDynamicStat("openticket:creator",0,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""
            
            const creator = ticket.get("openticket:opened-by").value
            return lang.getTranslation("params.uppercase.creator")+": "+ (creator ? discord.userMention(creator) : "`unknown`")
        }))
    }

    const participants = stats.get("openticket:participants")
    if (participants){
        participants.add(new api.ODDynamicStat("openticket:participants",0,async (scopeId,guild,channel,user) => {
            const ticket = openticket.tickets.get(scopeId)
            if (!ticket) return ""

            const participants = ticket.exists("openticket:participants") ? ticket.get("openticket:participants").value : []
            
            return participants.map((p) => {
                return (p.type == "role") ? discord.roleMention(p.id) : discord.userMention(p.id)
            }).join("\n")
        }))
        
    }
}