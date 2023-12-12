const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

/**@typedef {"TICKETS_CREATED"|"TICKETS_CLOSED"|"TICKETS_DELETED"|"TICKETS_REOPENED"|"TICKETS_AUTOCLOSED"|"TRANSCRIPTS_CREATED"|"TIME_SINCE_UPDATE"} OTGlobalStatsType */
/**@typedef {"TICKET_AGE"} OTTicketStatsType */
/**@typedef {"TICKETS_CREATED"} OTUserStatsType */
/**
 * @callback OTStatsCallback
 * @param {Boolean|Number|String} current
 * @returns {Boolean|Number|String|undefined}
 */


/**
 * @param {OTGlobalStatsType} type 
 * @param {OTStatsCallback} callback 
 */
const updateGlobalStats = (type,callback) => {
    const currentstat = bot.statsStorage.get("global",type)
    const newstat = callback(currentstat)
    if (["string","number","boolean"].includes(typeof newstat)){
        bot.statsStorage.set("global",type,newstat)
    }
}

/**
 * @param {OTTicketStatsType} type 
 * @param {String} id
 * @param {OTStatsCallback} callback 
 */
const updateTicketStats = (type,id,callback) => {
    const currentstat = bot.statsStorage.get("ticket_"+id,type)
    const newstat = callback(currentstat)
    if (["string","number","boolean"].includes(typeof newstat)){
        bot.statsStorage.set("ticket"+id,type,newstat)
    }
}

/**
 * @param {OTUserStatsType} type 
 * @param {String} id
 * @param {OTStatsCallback} callback 
 */
const updateUserStats = (type,id,callback) => {
    const currentstat = bot.statsStorage.get("user"+id,type)
    const newstat = callback(currentstat)
    if (["string","number","boolean"].includes(typeof newstat)){
        bot.statsStorage.set("user"+id,type,newstat)
    }
}

/**
 * 
 * @param {"global"|"ticket"|"user"} scope 
 * @param {OTGlobalStatsType|OTTicketStatsType|OTUserStatsType} type 
 * @param {String} [id] 
 */
const removeStats = (scope,type,id) => {
    const newScope = (scope == "global") ? scope : scope+"_"+id
    bot.statsStorage.delete(newScope,type)
}

module.exports = {
    updateGlobalStats,
    updateTicketStats,
    updateUserStats,
    removeStats
}