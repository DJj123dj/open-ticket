const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

/**@typedef {"TICKETS_CREATED"|"TICKETS_CLOSED"|"TICKETS_DELETED"|"TICKETS_REOPENED"|"TICKETS_AUTOCLOSED"|"TRANSCRIPTS_CREATED"|"TIME_SINCE_UPDATE"} OTGlobalStatsType */
/**@typedef {"TICKET_AGE"|"CREATED_BY"} OTTicketStatsType */
/**@typedef {"TICKETS_CREATED"|"TICKETS_CLOSED"|"TICKETS_DELETED"|"TICKETS_REOPENED"} OTUserStatsType */
/**
 * @callback OTStatsCallback
 * @param {Boolean|Number|String|undefined} current
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

/**
 * 
 * @param {"global"|"ticket"|"user"} scope 
 * @param {OTGlobalStatsType|OTTicketStatsType|OTUserStatsType} type 
 * @param {String} [id] 
 */
const existStats = (scope,type,id) => {
    const newScope = (scope == "global") ? scope : scope+"_"+id
    return (typeof bot.statsStorage.get(newScope,type) == "undefined") ? false : true
}

/**
 * 
 * @param {"global"|"ticket"|"user"} scope 
 * @param {OTGlobalStatsType|OTTicketStatsType|OTUserStatsType} type 
 * @param {String} [id] 
 */
const getStats = (scope,type,id) => {
    const newScope = (scope == "global") ? scope : scope+"_"+id
    return bot.statsStorage.get(newScope,type)
}

const startupStatsManager = () => {
    if (!existStats("global","TIME_SINCE_UPDATE")){
        updateGlobalStats("TIME_SINCE_UPDATE",(current) => {
            return new Date().getTime()
        })
    }
    if (!existStats("global","TICKETS_CREATED")){
        updateGlobalStats("TICKETS_CREATED",(current) => {
            return 0
        })
    }
    if (!existStats("global","TICKETS_CLOSED")){
        updateGlobalStats("TICKETS_CLOSED",(current) => {
            return 0
        })
    }
    if (!existStats("global","TICKETS_DELETED")){
        updateGlobalStats("TICKETS_DELETED",(current) => {
            return 0
        })
    }
    if (!existStats("global","TICKETS_AUTOCLOSED")){
        updateGlobalStats("TICKETS_AUTOCLOSED",(current) => {
            return 0
        })
    }
    if (!existStats("global","TICKETS_REOPENED")){
        updateGlobalStats("TICKETS_REOPENED",(current) => {
            return 0
        })
    }if (!existStats("global","TRANSCRIPTS_CREATED")){
        updateGlobalStats("TRANSCRIPTS_CREATED",(current) => {
            return 0
        })
    }
}

module.exports = {
    updateGlobalStats,
    updateTicketStats,
    updateUserStats,

    removeStats,
    existStats,
    getStats,

    startupStatsManager
}