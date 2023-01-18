const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

const configParser = require("../../utils/configParser")


//EVENT API:
const ticketOpenListeners = []
const ticketCloseListeners = []
const ticketDeleteListeners = []
const ticketReopenListeners = []

const ticketAddListeners = []
const ticketRemoveListeners = []

const ticketClaimListeners = []
const ticketUnclaimListeners = []
const ticketChangeListeners = []


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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 * @param {String} reason
 */
exports.onTicketClose = (user,channel,guild,date,ticketdata,reason) => {
    //system
    bot.errorLog.log("api","ticket closed",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)},{key:"reason",value:reason}])

    ticketCloseListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata,reason)
        }catch{}
    })

}

/**
 * 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
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
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */
exports.onTicketClaim = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","user claimed a ticket",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketClaimListeners.forEach((func) => {
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */
exports.onTicketUnclaim = (user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","user unclaimed a ticket",[{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketUnclaimListeners.forEach((func) => {
        try {
            func(user,channel,guild,date,ticketdata)
        }catch{}
    })

}

/**
 * @param {String} newtype
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */
exports.onTicketChange = (newtype,user,channel,guild,date,ticketdata) => {
    //system
    bot.errorLog.log("api","user changed ticket type",[{key:"newtype",value:newtype},{key:"userid",value:user.id},{key:"channelid",value:channel.id},{key:"guildid",value:guild.id},{key:"ticketdata",value:JSON.stringify(ticketdata)}])

    ticketChangeListeners.forEach((func) => {
        try {
            func(newtype,user,channel,guild,date,ticketdata)
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

/**@typedef {"help"|"message"|"close"|"delete"|"reopen"|"rename"|"add"|"remove"|"claim"|"unclaim"|"change"} OTCommandType */

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

    const newguild = guild ? guild : false
    //system
    bot.errorLog.log("api","someone used a command",[{key:"type",value:type},{key:"hasPerms",value:hasPerms},{key:"userid",value:user},{key:"channelid",value:channel.id},{key:"guildid",value:newguild.id}])

    commandListeners.forEach((func) => {
        try {
            func(type,hasPerms,user,channel,newguild,date)
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */

/**
 * @callback TicketCloseEvent
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 * @param {String} reason
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
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */

/**
 * @callback TicketTypeChangeEvent
 * @param {String} newtype
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild} guild
 * @param {Date} date 
 * @param {{name:String,status:"open"|"closed"|"deleted"|"reopened",ticketOptions:configParser.OTTicketOptions}} ticketdata 
 */

/**
 * @callback CommandEvent
 * @param {OTCommandType} type 
 * @param {Boolean} hasPerms 
 * @param {discord.User} user 
 * @param {discord.TextChannel} channel 
 * @param {discord.Guild|false} guild 
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

/**@param {TicketCloseEvent} callback */
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

/**@param {TicketActionEvent} callback */
const onTicketClaim = (callback) => {
    ticketClaimListeners.push(callback)
}

/**@param {TicketActionEvent} callback */
const onTicketUnclaim = (callback) => {
    ticketUnclaimListeners.push(callback)
}

/**@param {TicketTypeChangeEvent} callback */
const onTicketChange = (callback) => {
    ticketChangeListeners.push(callback)
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
    onTicketClaim,
    onTicketUnclaim,
    onTicketChange,
    onTranscriptCreation,
    onCommand,
    onReactionRole,
    onError
}