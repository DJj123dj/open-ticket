const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

const loadChalk = async () => {
    return await (await import("chalk")).default
}
const embed = discord.MessageEmbed

exports.noPermsMessage = new embed()
    .setColor("RED")
    .setTitle(":x: No Permissions! :x:")
    .setDescription("You don't have the correct roles to run this command!\nYou need the `ADMINISTRATOR` permission or be in the list of allowed roles!")

/**@param {String} message */
exports.invalidArgsMessage = (message) => {
    var x =  new embed()
        .setColor("RED")
        .setTitle(":x: Invalid Arguments! :x:")
        .setDescription(message)

    return x
}

/**@param {String} message */
exports.serverError = (message) => {
    var x = new embed()
        .setColor("ORANGE")
        .setTitle(":warning: Bot Error! :warning:")
        .setDescription(message)

    return x
}

/**@param {String[]} list */
exports.invalidIdChooseFromList = (list) => {
    var x = new embed()
        .setColor("RED")
        .setTitle(":x: Invalid ID :x:")
        .setDescription("Choose one of the id's below:\n`"+list.join("`\n`")+"`")
    return x
}


//seves
exports.notInATicket = new embed()
    .setColor("RED")
    .setTitle(":x: You are not in a ticket! :x:")
    .setDescription("This command doesn't work outside tickets!")


exports.success = (title,message) => {
    var x = new embed()
        .setColor(config.main_color)
        .setTitle(":white_check_mark: "+title+" :white_check_mark:")
        .setDescription(message)

    return x
}