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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"command"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendusernoperms"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendusernoticket"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendusernodelete"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendchannelnoperms"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendchannelnoticket"
    })
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
    bot.actionRecorder.push({
        category:"ot.managers.permissionChecker",
        file:"./core/permissionChecker.js",
        time:new Date().getTime(),
        type:"sendchannelnodelete"
    })
    try {
        channel.send({embeds:[bot.errorLog.noPermsDelete(user)]})
        return true
    }catch{
        return false
    }
}
