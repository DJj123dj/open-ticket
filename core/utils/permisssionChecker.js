const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

/**
 * 
 * @param {String} memberid
 * @param {String} guildid
 * @returns {Boolean} has permissions?
 */
exports.command = (memberid,guildid) => {
    const permsmember = client.guilds.cache.find(g => g.id == guildid).members.cache.find(m => m.id == memberid)
    if (config.adminRoles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("ManageGuild")){
        return false
    }else {return true}
}

/**
 * 
 * @param {discord.User} user 
 * @returns {Boolean}
 */
exports.sendUserNoPerms = (user) => {
    try {
        user.send({embeds:[bot.errorLog.noPermsMessage(user)]})
        return true
    }catch{
        return false
    }
}

/**
 * 
 * @param {discord.User} user 
 * @returns {Boolean}
 */
 exports.sendUserNoTicket = (user) => {
    try {
        user.send({embeds:[bot.errorLog.notInATicket]})
        return true
    }catch{
        return false
    }
}

/**
 * 
 * @param {discord.User} user 
 * @returns {Boolean}
 */
 exports.sendUserNoDelete = (user) => {
    try {
        user.send({embeds:[bot.errorLog.noPermsDelete(user)]})
        return true
    }catch{
        return false
    }
}

/**
 * 
 * @param {discord.TextChannel} channel 
 * @param {discord.User} user
 * @returns {Boolean}
 */
 exports.sendChannelNoPerms = (channel,user) => {
    try {
        channel.send({embeds:[bot.errorLog.noPermsMessage(user)]})
        return true
    }catch{
        return false
    }
}

/**
 * 
 * @param {discord.TextChannel} channel 
 * @param {discord.User} user
 * @returns {Boolean}
 */
 exports.sendChannelNoTicket = (channel,user) => {
    try {
        channel.send({embeds:[bot.errorLog.notInATicket]})
        return true
    }catch{
        return false
    }
}

/**
 * 
 * @param {discord.TextChannel} channel 
 * @param {discord.User} user
 * @returns {Boolean}
 */
 exports.sendChannelNoDelete = (channel,user) => {
    try {
        channel.send({embeds:[bot.errorLog.noPermsDelete(user)]})
        return true
    }catch{
        return false
    }
}
