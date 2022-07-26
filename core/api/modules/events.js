const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage


//EVENT API:
const ticketOpenListeners = []
const ticketCloseListeners = []
const ticketDeleteListeners = []

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

    ticketOpenListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata)
        }catch{}
    })

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

    ticketCloseListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata)
        }catch{}
    })

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

    ticketDeleteListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata)
        }catch{}
    })

}

//EVENT CALLBACKS:

/**
 * @callback TicketActionEvent
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */

//EVENT EXPORT:

/**@param {TicketActionEvent} callback */
const onTicketOpen = (callback) => {
    ticketOpenListeners.push(callback)
}

/**@param {TicketActionEvent} callback */
const onTicketClose = (callback) => {
    ticketCloseListeners.push(callback)
}

/**@param {TicketActionEvent} callback */
const onTicketDelete = (callback) => {
    ticketDeleteListeners.push(callback)
}

exports.events = {
    onTicketOpen:onTicketOpen,
    onTicketClose:onTicketClose,
    onTicketDelete:onTicketDelete
}