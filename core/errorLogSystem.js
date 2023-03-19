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

/**@param {discord.User} user*/
exports.noPermsMessage = (user) => {
    return new embed()
    .setColor(c.Red)
    .setTitle(":x: "+l.errors.noPermsTitle)
    .setDescription(l.errors.noPermsDescription)
    .setFooter({iconURL:user.displayAvatarURL(),text:user.tag})
}

/**@param {discord.User} user*/
exports.noPermsDelete = (user) => {
    return new embed()
    .setColor(c.Red)
    .setTitle(":x: "+l.errors.noPermsTitle)
    .setDescription(l.errors.noPermsDelete)
    .setFooter({iconURL:user.displayAvatarURL(),text:user.tag})
}

/**@param {String} message */
exports.invalidArgsMessage = (message) => {
    var x =  new embed()
        .setColor(c.Red)
        .setTitle(":x: "+l.errors.missingArgsTitle)
        .setDescription(message)

    return x
}

/**@param {String} message */
exports.serverError = (message) => {
    var x = new embed()
        .setColor(c.Orange)
        .setTitle(":warning: "+l.errors.boterror)
        .setDescription(message)

    return x
}

/**@param {String[]} list @param {String|undefined} message */
exports.invalidIdChooseFromList = (list,message) => {
    const beforemsg = message ? message+"\n\n" : ""
    var x = new embed()
        .setColor(c.Red)
        .setTitle(":x: "+l.errors.chooseFromListTitle)
        .setDescription(beforemsg+l.errors.chooseFromListDescription+"\n`"+list.join("`\n`")+"`")
    return x
}

exports.notInATicket = new embed()
    .setColor(c.Red)
    .setTitle(":x: "+l.errors.notInTicketTitle)
    .setDescription(l.errors.notInTicketDescription)


/**@param {String} message @param {String} title */
exports.success = (title,message) => {
    var x = new embed()
        .setColor(config.color)
        .setTitle(":white_check_mark: "+title)
        .setDescription(message)

    return x
}

/**@param {String} message @param {String} title */
exports.warning = (title,message) => {
    var x = new embed()
        .setColor(c.Orange)
        .setTitle(":warning: "+title)
        .setDescription(message)

    return x
}

/**@param {String} message the message @param {String} title the title @param {String} emoji an discord emoji @param {discord.ColorResolvable} color the embed color*/
exports.custom = (title,message,emoji,color) => {
    var x = new embed()
        .setColor(color)
        .setTitle(emoji+" "+title)
        .setDescription(message)

    return x
}

exports.clearDebugFile = () => {
    const fs = require("fs")
    if (!fs.existsSync("./openticketdebug.txt")) return
    const content = fs.readFileSync("./openticketdebug.txt").toString().split("\n")
    if (content.length < 5000) return
    for (let i = 0; i < 4000; i++) {
        content.shift()
    }

    const newContent = "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="+content.join("\n")
    fs.writeFileSync("./openticketdebug.txt",newContent)
}

const normalLog = (debugString) => {
    const fs = require("fs")
    const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
    fs.writeFileSync("./openticketdebug.txt",content+"\nSYSTEM: "+debugString)
    this.clearDebugFile()
}

/**
 * 
 * @param {"system"|"command"|"info"|"api"|"debug"} type 
 * @param {String} message 
 * @param {[{key:String,value:String}]} params
 */
exports.log = async (type,message,params) => {
    var ptype = type
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
    
    if (ptype == "command"){
        console.log(chalk.green("[command] ")+message+" "+chalk.yellow(parameters))
    }else if (ptype == "info"){
        console.log(chalk.blue("[info] ")+message+" "+chalk.yellow(parameters))
    }else if (ptype == "system"){
        console.log(chalk.green("[system] ")+message+" "+chalk.yellow(parameters))
    }else if (ptype == "api"){
        if (require("./api/api.json").enableAPIconsolelogs == true){
            console.log(chalk.red("[api v"+require("./api/api.json").version+"] ")+message+" "+chalk.yellow(parameters))
        }
        ptype = "api v"+require("./api/api.json").version
    }else if (ptype == "debug"){
        if (!process.argv.some((v) => v == "--debug")) return
        console.log(chalk.redBright("[DEBUG] ")+message+" "+chalk.yellow(parameters))
    }

    const cd = new Date()
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    normalLog("["+cd.getDate()+" "+months[cd.getMonth()-1]+" "+cd.getFullYear()+" - "+cd.getSeconds()+":"+cd.getMinutes()+":"+cd.getHours()+"] ["+ptype+"] "+message+" "+parameters)
}