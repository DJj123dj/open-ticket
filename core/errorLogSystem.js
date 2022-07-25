const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language

const loadChalk = async () => {
    return await (await import("chalk")).default
}
const embed = discord.EmbedBuilder
const c = discord.Colors

exports.noPermsMessage = new embed()
    .setColor(c.Red)
    .setTitle(":x: "+l.errors.noPermsTitle+" :x:")
    .setDescription(l.errors.noPermsDescription)

/**@param {String} message */
exports.invalidArgsMessage = (message) => {
    var x =  new embed()
        .setColor(c.Red)
        .setTitle(":x: "+l.errors.missingArgsTitle+" :x:")
        .setDescription(message)

    return x
}

/**@param {String} message */
exports.serverError = (message) => {
    var x = new embed()
        .setColor(c.Orange)
        .setTitle(":warning: "+l.errors.boterror+" :warning:")
        .setDescription(message)

    return x
}

/**@param {String[]} list */
exports.invalidIdChooseFromList = (list) => {
    var x = new embed()
        .setColor(c.Red)
        .setTitle(":x: "+l.errors.chooseFromListTitle+" :x:")
        .setDescription(l.errors.chooseFromListDescription+"\n`"+list.join("`\n`")+"`")
    return x
}

exports.notInATicket = new embed()
    .setColor(c.Red)
    .setTitle(":x: "+l.errors.notInTicketTitle+" :x:")
    .setDescription(l.errors.notInTicketDescription)


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
        .setColor(c.Orange)
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

const normalLog = (debugString) => {
    const fs = require("fs")
    const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
    fs.writeFileSync("./openticketdebug.txt",content+"\nSYSTEM: "+debugString)
}

/**
 * 
 * @param {"system"|"command"|"info"|"api"} type 
 * @param {String} message 
 * @param {[{key:String,value:String}]} params
 */
exports.log = async (ptype,message,params) => {
    var type = ptype
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
    }else if (type == "api"){
        if (require("./api/base").enableApiLogs == true){
            console.log(chalk.red("[api v"+require("./api/api.json").version+"] ")+message+" "+chalk.yellow(parameters))
        }
        type = "api v"+require("./api/api.json").version
    }

    const cd = new Date()
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    normalLog("["+cd.getDate()+" "+months[cd.getMonth()-1]+" "+cd.getFullYear()+" - "+cd.getSeconds()+":"+cd.getMinutes()+":"+cd.getHours()+"] ["+type+"] "+message+" "+parameters)
}