const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage
const pfb = discord.PermissionFlagsBits
const permsChecker = require("../utils/permisssionChecker")

/**
     * 
     * @param {discord.Guild} guild 
     * @param {discord.TextBasedChannel} channel 
     * @param {discord.User} user 
     * @param {String} ticketId option id
     * @returns 
     */
const reopenTicket = (guild,channel,user,ticketId) => {
    //check perms
    if (config.system.closeMode == "adminonly"){
        if (!guild) return
        if (!permsChecker.ticket(user.id,guild.id,ticketId)){
            permsChecker.sendUserNoPerms(user)
            return
        }
    }

    log("system","re-opened a ticket",[{key:"ticket",value:channel.name},{key:"user",value:user.username}])

    var permissionsArray = []

    //set @everyone no ticket access
    permissionsArray.push({
        id:guild.roles.everyone,
        type:"role",
        allow:[],
        deny:[pfb.ViewChannel]
    })

    channel.permissionOverwrites.cache.forEach((p) => {
        if (p.type == 1){
            permissionsArray.push({
                id:p.id,
                type:"member",
                allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel],
                deny:[]
            })
        }else{
            if (p.id != guild.roles.everyone){
                permissionsArray.push({
                    id:p.id,
                    type:"role",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel],
                    deny:[]
                })
            }
        }
    })
    channel.permissionOverwrites.set(permissionsArray)

    require("../api/modules/events").onTicketReopen(user,channel,guild,new Date(),{name:channel.name,status:"reopened",ticketOptions:false})
    
    //STATS
    bot.statsManager.updateGlobalStats("TICKETS_REOPENED",(current) => {
        if (typeof current != "undefined") return current+1
        return 1
    })
    bot.statsManager.updateUserStats("TICKETS_REOPENED",user.id,(current) => {
        if (typeof current != "undefined") return current+1
        return 1
    })
    bot.statsManager.updateTicketStats("STATUS",channel.id,(current) => {
        return "reopened"
    })
}
exports.reopenTicket = reopenTicket