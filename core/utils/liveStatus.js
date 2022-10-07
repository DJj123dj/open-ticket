const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

const loadChalk = async () => {
    return await (await import("chalk")).default
}

module.exports = async () => {
    const chalk = await loadChalk()
    
    //LIVESTATUS SOON
}