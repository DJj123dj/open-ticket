const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage
const pfb = discord.PermissionFlagsBits

/**
     * 
     * @param {discord.Guild} guild 
     * @param {discord.TextBasedChannel} channel 
     * @param {discord.User} user 
     * @returns 
     */
const reopenTicket = (guild,channel,user) => {
    log("system","re-opened a ticket",[{key:"ticket",value:channel.name},{key:"user",value:user.tag}])

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
}
exports.reopenTicket = reopenTicket