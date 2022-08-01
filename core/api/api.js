//base
const bot = require("../../index")

exports.client = bot.client
exports.config = bot.config
exports.utils = {
    log:bot.errorLog.log(),
    storage:bot.storage
}

//events
const events = require("./modules/events").events
exports.events = events

//actions
const actions = require("./modules/actions").actions
//comming soon
//exports.actions = actions