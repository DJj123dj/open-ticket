const bot = require("../../index")
const config = bot.config
const l = bot.language

exports.getTicketMessage = (input) => {
    var returned = config.messages.find(a => a.id == input)
    if (returned){
        return returned
    }
    var result = config.messages[0]
    if (!result){
        throw new Error("'messages' object in config.json is empty")
        return
    }
    return result
}