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
const ticketReopenListeners = []

const transcriptCreationListeners = []
const commandListeners = []
const reactionRoleListeners = []

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

/**
 * 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
 exports.onTicketReopen = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","ticket reopened",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketReopenListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata)
        }catch{}
    })

}

/**
 * 
 * @param {discord.Message[]} messages 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 */
 exports.transcriptCreation = (messages,channel,guild,date) => {
    //system
    bot.errorLog.log("api","transcript created",[{key:"messages",value:JSON.stringify(messages)},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id}])

    transcriptCreationListeners.forEach((func) => {
        try {
            func(messages,channel,guild,date)
        }catch{}
    })

}

//onTicketAdd
//onTicketRemove
//command
//reactionrole
//error

//EVENT CALLBACKS:

/**
 * @callback TicketActionEvent
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */

/**
 * @callback TranscriptCreationEvent
 * @param {discord.Message[]} messages 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date
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

/**@param {TicketActionEvent} callback */
const onTicketReopen = (callback) => {
    ticketReopenListeners.push(callback)
}

/**@param {TranscriptCreationEvent} callback */
const onTranscriptCreation = (callback) => {
    transcriptCreationListeners.push(callback)
}

exports.events = {
    onTicketOpen,
    onTicketClose,
    onTicketDelete,
    onTicketReopen,
    onTranscriptCreation
}