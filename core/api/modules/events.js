const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

/**
 * 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
exports.onTicketOpen = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","new ticket created",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    //custom code

}

/**
 * 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
exports.onTicketClose = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","ticket closed",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    //custom code

}

/**
 * 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
exports.onTicketDelete = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","ticket deleted",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    //custom code

}