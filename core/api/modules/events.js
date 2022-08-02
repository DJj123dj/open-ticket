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

const ticketAddListeners = []
const ticketRemoveListeners = []


const transcriptCreationListeners = []
const commandListeners = []
const reactionRoleListeners = []
const errorListeners = []

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
 * @param {discord.User} user 
 * @param {discord.User} editeduser
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
exports.onTicketAdd = (user,editeduser,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","user added to ticket",[{key:"userid",value:user.id},{key:"editeduser",value:editeduser.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketAddListeners.forEach((func) => {
        try {
            func(user,editeduser,channel,guild,date,ticketdata)
        }catch{}
    })

}

/**
 * 
 * @param {discord.User} user 
 * @param {discord.User} editeduser
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */
exports.onTicketRemove = (user,editeduser,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","user removed from ticket",[{key:"userid",value:user.id},{key:"editeduser",value:editeduser.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketRemoveListeners.forEach((func) => {
        try {
            func(user,editeduser,channel,guild,date,ticketdata)
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
exports.onTranscriptCreation = (messages,channel,guild,date) => {
    //system
    bot.errorLog.log("api","transcript created",[{key:"messages",value:JSON.stringify(messages)},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id}])

    transcriptCreationListeners.forEach((func) => {
        try {
            func(messages,channel,guild,date)
        }catch{}
    })

}

/**@typedef {"help"|"message"|"close"|"delete"|"reopen"|"rename"|"add"|"remove"} OTCommandType */

/**
 * 
 * @param {OTCommandType} type 
 * @param {Boolean} hasPerms 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild 
 * @param {Date} date 
 */
exports.onCommand = (type,hasPerms,user,channel,guild,date) => {
    //system
    bot.errorLog.log("api","someone used a command",[{key:"type",value:type},{key:"hasPerms",value:hasPerms},{key:"userid",value:user},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id}])

    commandListeners.forEach((func) => {
        try {
            func(type,hasPerms,user,channel,guild,date)
        }catch{}
    })

}

/**@typedef {"add"|"remove"|"add&remove"} OTReactionRoleType */
/**@typedef {"add"|"remove"} OTReactionRoleMode */

/**
 * @param {OTReactionRoleMode} mode
 * @param {OTReactionRoleType} type 
 * @param {discord.Role} role
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild 
 * @param {Date} date 
 */
 exports.onReactionRole = (mode,type,role,user,channel,guild,date) => {
    //system
    bot.errorLog.log("api","someone used a reaction role",[{key:"mode",value:mode},{key:"type",value:type},{key:"roleid",value:role.id},{key:"userid",value:user},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id}])

    reactionRoleListeners.forEach((func) => {
        try {
            func(mode,type,role,user,channel,guild,date)
        }catch{}
    })

}

/**
 * @param {String} err
 * @param {Date} date 
 */
 exports.onError = (err,date) => {
    //system
    bot.errorLog.log("api","there is an error",[{key:"error",value:err}])

    errorListeners.forEach((func) => {
        try {
            func(err,date)
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

/**
 * @callback TranscriptCreationEvent
 * @param {discord.Message[]} messages 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date
 */

/**
 * @callback TicketUserChangeEvent
 * @param {discord.User} user 
 * @param {discord.User} editeduser
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:Object|false}} ticketdata 
 */

/**
 * @callback CommandEvent
 * @param {OTCommandType} type 
 * @param {Boolean} hasPerms 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild 
 * @param {Date} date 
 */

/**
 * @callback ReactionRoleEvent
 * @param {OTReactionRoleMode} mode
 * @param {OTReactionRoleType} type 
 * @param {discord.Role} role
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild 
 * @param {Date} date 
 */

/**
 * @callback ErrorEvent
 * @param {String} error
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

/**@param {TicketUserChangeEvent} callback */
const onTicketAdd = (callback) => {
    ticketAddListeners.push(callback)
}

/**@param {TicketUserChangeEvent} callback */
const onTicketRemove = (callback) => {
    ticketRemoveListeners.push(callback)
}

/**@param {TranscriptCreationEvent} callback */
const onTranscriptCreation = (callback) => {
    transcriptCreationListeners.push(callback)
}

/**@param {CommandEvent} callback */
const onCommand = (callback) => {
    commandListeners.push(callback)
}

/**@param {ReactionRoleEvent} callback */
const onReactionRole = (callback) => {
    commandListeners.push(callback)
}

/**@param {ErrorEvent} callback */
const onError = (callback) => {
    errorListeners.push(callback)
}

exports.events = {
    onTicketOpen,
    onTicketClose,
    onTicketDelete,
    onTicketReopen,
    onTicketAdd,
    onTicketRemove,
    onTranscriptCreation,
    onCommand,
    onReactionRole,
    onError
}