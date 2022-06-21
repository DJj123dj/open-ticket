const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language

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

exports.notInATicket = new embed()
    .setColor("RED")
    .setTitle(":x: You are not in a ticket! :x:")
    .setDescription("This command doesn't work outside tickets!")


/**@param {String} message @param {String} title */
exports.success = (title,message) => {
    var x = new embed()
        .setColor(config.main_color)
        .setTitle(":white_check_mark: "+title+" :white_check_mark:")
        .setDescription(message)

    return x
}

/**@param {String} message @param {String} title */
exports.warning = (title,message) => {
    var x = new embed()
        .setColor("ORANGE")
        .setTitle(":warning: "+title+" :warning:")
        .setDescription(message)

    return x
}

/**@param {String} message the message @param {String} title the title @param {String} emoji an discord emoji @param {discord.ColorResolvable} color the embed color*/
exports.custom = (title,message,emoji,color) => {
    var x = new embed()
        .setColor(color)
        .setTitle(emoji+" "+title+" "+emoji)
        .setDescription(message)

    return x
}

/**
 * 
 * @param {"system"|"command"|"info"} type 
 * @param {String} message 
 * @param {[{key:String,value:String}]} params
 */
exports.log = async (type,message,params) => {
    const chalk = await loadChalk()
    var paramstring = ""
    if (params){
        if (params.length > 0){
            params.forEach((p) => {
                paramstring = paramstring+p.key+": "+p.value+" "
            })
        }
    }
    const parameters = params ? "("+paramstring+")" : " "
    
    if (type == "command"){
        console.log(chalk.green("[command] ")+message+" "+chalk.yellow(parameters))
    }else if (type == "info"){
        console.log(chalk.blue("[info] ")+message+" "+chalk.yellow(parameters))
    }else if (type == "system"){
        console.log(chalk.green("[system] ")+message+" "+chalk.yellow(parameters))
    }
}