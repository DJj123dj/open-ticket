const discord = require('discord.js')
const bot = require("../../../index")
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

/** FOR DEVELOPERS ONLY!!
 * Don't change anything in this file, read the api documentation first!
 * look into "api docs.md" for the docs!
 */

//used when creating plugins!
exports.enableApiLogs = false

//this is used when embedding open ticket into another bot
exports.embeddedMode = false
exports.clientLocation = require("../../../index").client

/** !! WARNING !!
 * Only edit or extend the code when you know what you are doing!
 * If open ticket crashes while you change the code, then we can't help you!
 * 
 * DO IT ON YOUR OWN RISK!
 */