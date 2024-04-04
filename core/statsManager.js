const { EmbedBuilder, Guild, TextChannel, Message, User } = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permissionChecker = require("./utils/permisssionChecker")

/**@typedef {"TICKETS_CREATED"|"TICKETS_CLOSED"|"TICKETS_DELETED"|"TICKETS_REOPENED"|"TICKETS_AUTOCLOSED"|"TRANSCRIPTS_CREATED"|"TIME_SINCE_UPDATE"|"LAST_VERSION"} OTGlobalStatsType */
/**@typedef {"CREATED_AT"|"CREATED_BY"|"STATUS"} OTTicketStatsType */
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
    const currentstat = bot.statsStorage.get("ticket"+id,type)
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
    const newScope = (scope == "global") ? scope : scope+id
    bot.statsStorage.delete(newScope,type)
}

/**
 * 
 * @param {"global"|"ticket"|"user"} scope 
 * @param {OTGlobalStatsType|OTTicketStatsType|OTUserStatsType} type 
 * @param {String} [id] 
 */
const existStats = (scope,type,id) => {
    const newScope = (scope == "global") ? scope : scope+id
    return (typeof bot.statsStorage.get(newScope,type) == "undefined") ? false : true
}

/**
 * 
 * @param {"global"|"ticket"|"user"} scope 
 * @param {OTGlobalStatsType|OTTicketStatsType|OTUserStatsType} type 
 * @param {String} [id] 
 */
const getStats = (scope,type,id) => {
    const newScope = (scope == "global") ? scope : scope+id
    return bot.statsStorage.get(newScope,type)
}

const startupStatsManager = () => {
    //UPDATE LAST UPDATE DATE
    if (!existStats("global","TIME_SINCE_UPDATE")){
        updateGlobalStats("TIME_SINCE_UPDATE",(current) => {
            return new Date().getTime()
        })
        updateGlobalStats("LAST_VERSION",(current) => {
            return (require("../package.json")).version
        })
    }
    if ((require("../package.json")).version != getStats("global","LAST_VERSION")){
        updateGlobalStats("TIME_SINCE_UPDATE",(current) => {
            return new Date().getTime()
        })
        updateGlobalStats("LAST_VERSION",(current) => {
            return (require("../package.json")).version
        })
    }

    //UPDATE THE OTHER STATS
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

    //HANDLE MEMBER LEAVE (clear the database)
    client.on("guildMemberRemove",(member) => {
        if (existStats("user","TICKETS_CREATED",member.id)){
            removeStats("user","TICKETS_CREATED",member.id)
        }
        if (existStats("user","TICKETS_CLOSED",member.id)){
            removeStats("user","TICKETS_CLOSED",member.id)
        }
        if (existStats("user","TICKETS_DELETED",member.id)){
            removeStats("user","TICKETS_DELETED",member.id)
        }
        if (existStats("user","TICKETS_REOPENED",member.id)){
            removeStats("user","TICKETS_REOPENED",member.id)
        }
    })
}

/**
 * @returns {Promise<{startDate:Number, updateDate:Number, version:String, ticketsCreated:Number, ticketsClosed:Number, ticketsDeleted:Number, ticketsReopened:Number, ticketsAutoclosed:Number, transcriptsCreated:Number}>}
 */
const getGlobalStats = async () => {
    //live data
    const startDate = new Date().getTime() - client.uptime
    const version = (require("../package.json")).version
    
    //saved data
    const ticketsCreated = getStats("global","TICKETS_CREATED")
    const ticketsClosed = getStats("global","TICKETS_CLOSED")
    const ticketsDeleted = getStats("global","TICKETS_DELETED")
    const ticketsReopened = getStats("global","TICKETS_REOPENED")
    const ticketsAutoclosed = getStats("global","TICKETS_AUTOCLOSED")
    const transcriptsCreated = getStats("global","TRANSCRIPTS_CREATED")
    const timeSinceUpdate = getStats("global","TIME_SINCE_UPDATE")

    return {
        startDate,
        updateDate: (typeof timeSinceUpdate == "undefined") ? new Date().getTime() : timeSinceUpdate,
        version,

        ticketsCreated: (typeof ticketsCreated == "undefined") ? 0 : ticketsCreated,
        ticketsClosed: (typeof ticketsClosed == "undefined") ? 0 : ticketsClosed,
        ticketsDeleted: (typeof ticketsDeleted == "undefined") ? 0 : ticketsDeleted,
        ticketsReopened: (typeof ticketsReopened == "undefined") ? 0 : ticketsReopened,
        ticketsAutoclosed: (typeof ticketsAutoclosed == "undefined") ? 0 : ticketsAutoclosed,
        transcriptsCreated: (typeof transcriptsCreated == "undefined") ? 0 : transcriptsCreated,
    }
}

/**
     * 
     * @param {discord.TextChannel} channel 
     * @param {Number} limit 
     * @returns {Promise<Message[]>}
     */
const getmessages = async (channel,limit) => {
    const final = []
    var lastId = ""

    while (true) {
        const options = {limit:100}
        if (lastId) options.before = lastId

        const messages = await channel.messages.fetch(options)
        messages.forEach(msg => {final.push(msg)})
        lastId = messages.last().id

        if (messages.size != 100 || final >= limit) {
            break
        }
    }
    return final
}

/**
 * @param {Guild} guild
 * @param {String} channelid
 * @returns {Promise<{createdAt:Number, createdBy:String, messageAmount:Number, participants:String[], ticketName:String, status:"open"|"closed"|"reopened"|"autoclosed"}>}
 */
const getTicketStats = async (guild,channelid) => {
    //live data
    /**@type {TextChannel|undefined} */
    const channel = guild.channels.cache.find((c) => c.id == channelid)
    const messageAmount = (channel) ? (await getmessages(channel,5000)).length : 0
    const participants = (channel) ? channel.members.map((m) => "<@"+m.user.id+">") : []

    //saved data
    const createdAt = getStats("ticket","CREATED_AT",channelid)
    const status = getStats("ticket","STATUS",channelid)

    const TEMPcreatedBy = getStats("ticket","CREATED_BY",channelid)
    const TEMPcreatedByUser = (TEMPcreatedBy) ? guild.members.cache.find((m) => m.id == TEMPcreatedBy) : undefined
    const createdBy = (TEMPcreatedByUser) ? "<@"+TEMPcreatedByUser.user.id+">" : "an unknown person 😄"

    return {
        createdAt: (typeof createdAt == "undefined") ? new Date().getTime() : createdAt,
        createdBy: (typeof createdBy == "undefined") ? 0 : createdBy,
        messageAmount,
        participants:participants.slice(0,50),
        ticketName:channel.name,
        status: (typeof status == "undefined") ? "open" : status
    }
}

/**
 * @param {Guild} guild
 * @param {User} user
 * @param {String} [channelid]
 * @returns {Promise<{ticketsCreated:Number, ticketsClosed:Number, ticketsDeleted:Number, ticketsReopened:Number, role:"globaladmin"|"ticketadmin"|"member", userName:String}>}
 */
const getUserStats = async (guild,user,channelid) => {
    //live data
    const hiddendata = bot.hiddenData.readHiddenData(channelid)
    const ticketId = (hiddendata.length < 1) ? false : hiddendata.find(d => d.key == "type").value

    const isGlobalAdmin = permissionChecker.global(user.id,guild.id)
    const isTicketAdmin = (ticketId) ? permissionChecker.ticket(user.id,guild.id,ticketId) : false
    const role = (isGlobalAdmin) ? "globaladmin" : ((isTicketAdmin) ? "ticketadmin" : "member")

    //saved data
    const ticketsCreated = getStats("user","TICKETS_CREATED",user.id)
    const ticketsClosed = getStats("user","TICKETS_CLOSED",user.id)
    const ticketsDeleted = getStats("user","TICKETS_DELETED",user.id)
    const ticketsReopened = getStats("user","TICKETS_REOPENED",user.id)

    return {
        ticketsCreated: (typeof ticketsCreated == "undefined") ? 0 : ticketsCreated,
        ticketsClosed: (typeof ticketsClosed == "undefined") ? 0 : ticketsClosed,
        ticketsDeleted: (typeof ticketsDeleted == "undefined") ? 0 : ticketsDeleted,
        ticketsReopened: (typeof ticketsReopened == "undefined") ? 0 : ticketsReopened,
        role,
        userName:user.username
    }
}

const createGlobalStatsEmbed = async () => {
    const stats = await getGlobalStats()

    const sentences = [
        `${l.stats.ticketsCreated}: \`${stats.ticketsCreated}\``,
        `${l.stats.ticketsClosed}: \`${stats.ticketsClosed}\``,
        `${l.stats.ticketsDeleted}: \`${stats.ticketsDeleted}\``,
        `${l.stats.ticketsReopened}: \`${stats.ticketsReopened}\``,
        `${l.stats.ticketsAutoclosed}: \`${stats.ticketsAutoclosed}\``,
        
        `${l.stats.startupDate}: <t:${Math.round(stats.startDate/1000)}:f>`,
        `${l.stats.latestUpdate}: <t:${Math.round(stats.updateDate/1000)}:D>`
    ]

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`📊 ${l.stats.globalTitle}!`)
        .setDescription(sentences.slice(0,5).join("\n"))
        .addFields({
            name:`${l.stats.systemTitle}:`,
            value:sentences.slice(5,7).join("\n")
        })
        .setFooter({text:`${l.stats.versionTitle}: v${stats.version}`})
    return embed
}

/**
 * @param {Guild} guild
 * @param {String} channelid
 */
const createTicketStatsEmbed = async (guild,channelid) => {
    const stats = await getTicketStats(guild,channelid)

    if (stats.status == "open"){
        var newStatus = `🟢 \`${l.stats.switches.open}\``
    }else if (stats.status == "reopened"){
        var newStatus = `🟢 \`${l.stats.switches.reopened}\``
    }else if (stats.status == "closed"){
        var newStatus = `🔴 \`${l.stats.switches.closed}\``
    }else if (stats.status == "autoclosed"){
        var newStatus = `🔴 \`${l.stats.switches.autoclosed}\``
    }

    const sentences = [
        `${l.stats.ticketCreatedOn}: <t:${Math.round(stats.createdAt/1000)}:f>`,
        `${l.stats.ticketCreatedBy}: ${stats.createdBy}`,
        `${l.stats.messagesSent}: \`${stats.messageAmount}\``,
        `${l.stats.status}: ${newStatus}`
    ]

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`📊 ${l.stats.ticketTitle}`.replace("{0}",`#${stats.ticketName}!`))
        .setDescription(sentences.join("\n"))
        .addFields({
            name:`${l.stats.participants}:`,
            value:stats.participants.join("\n")
        })
    return embed
}

/**
 * @param {Guild} guild
 * @param {User} user
 * @param {String} channelid
 */
const createUserStatsEmbed = async (guild,user,channelid) => {
    const stats = await getUserStats(guild,user,channelid)

    if (stats.role == "globaladmin"){
        var newRole = `🟢 \`${l.stats.switches.globalAdmin}\``
    }else if (stats.role == "ticketadmin"){
        var newRole = `🟡 \`${l.stats.switches.ticketAdmin}\``
    }else if (stats.role == "member"){
        var newRole = `🔴 \`${l.stats.switches.member}\``
    }

    const sentences = [
        `${l.stats.role}: ${newRole}`,
        `${l.stats.ticketsCreated}: \`${stats.ticketsCreated}\``,
        `${l.stats.ticketsClosed}: \`${stats.ticketsClosed}\``,
        `${l.stats.ticketsDeleted}: \`${stats.ticketsDeleted}\``,
        `${l.stats.ticketsReopened}: \`${stats.ticketsReopened}\``
    ]

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`📊 ${l.stats.userTitle}`.replace("{0}",`${stats.userName}!`))
        .setDescription(sentences.join("\n"))
    return embed
}

module.exports = {
    updateGlobalStats,
    updateTicketStats,
    updateUserStats,

    removeStats,
    existStats,
    getStats,

    startupStatsManager,

    getGlobalStats,
    getTicketStats,
    getUserStats,
    createGlobalStatsEmbed,
    createTicketStatsEmbed,
    createUserStatsEmbed
}