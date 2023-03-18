const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const logo = require("fs").readFileSync("./core/logo.txt").toString()

/**@param {import('chalk').ChalkInstance} chalk */
const showFlags = async (chalk) => {
    var isFlag = false
    if (process.argv.some((v) => v == "--devconfig")) console.log(chalk.blue("[FLAGS] => used dev config instead of normal config")); isFlag = true
    if (process.argv.some((v) => v == "--nochecker")) console.log(chalk.blue("[FLAGS] => disabled checker.js")); isFlag = true
    if (process.argv.some((v) => v == "--tsoffline")) console.log(chalk.blue("[FLAGS] => offline check for html transcripts disabled!")); isFlag = true
    if (process.argv.some((v) => v == "--debug")) console.log(chalk.blue("[FLAGS] => enabled DEBUG mode")); isFlag = true
    if (process.argv.some((v) => v == "--noslash")) console.log(chalk.blue("[FLAGS] => slash commands disabled")); isFlag = true
    if (process.argv.some((v) => v == "--localstatus")) console.log(chalk.blue("[FLAGS] => using local livestatus.json")); isFlag = true
    if (process.argv.some((v) => v == "--noerrorupload")) console.log(chalk.blue("[FLAGS] => not uploading errors to liveStatus")); isFlag = true

    if (!isFlag) console.log(chalk.blue("no flags!"))
}

exports.run = async () => {
    const chalk = await (await import("chalk")).default
    console.log(chalk.hex("f8ba00")(logo))
    const version = require("../package.json").version
    var headertext = "v"+version+"  -  Support: https://discord.dj-dj.be  -  Language: "+config.languageFile
    const spaceamount = (84-headertext.length)/2
    var i = 0
    while (i < spaceamount){
        headertext = " "+headertext
        i++
    }
    console.log(chalk.bold(headertext+"\n"))
    console.log(chalk.bold(chalk.underline("FLAGS:")))
    showFlags(chalk)
}

/**
 * @param {import('chalk').ChalkInstance} chalk
 * @param {{type:String,text:String,enabled:Boolean}} status
 * @param {Boolean} updatingslash
 * @param {Boolean} slashmode
 * 
*/
exports.headerDataReady = (chalk,status,updatingslash,slashmode) => {
    console.log("\n"+chalk.bold(chalk.underline("STARTUP INFO:")))
    if (status.enabled) console.log(chalk.hex("f8ba00")("status: ")+chalk.bold(status.type.toLowerCase())+" "+status.text)
    if (slashmode){
        console.log("\n\n"+chalk.red(chalk.underline("STARTING IN SLASH CMD CONFIGURATION MODE!")))
        return
    }
    console.log(chalk.hex("f8ba00")("updating slash cmds: ")+chalk.bold(updatingslash))
}

var languageMSG = ""
var languageErr = false
/**
 * @param {String} message
 * @param {Boolean} err
*/
exports.headerDataLanguage = async (message,err) => {
    languageMSG = message
    languageErr = err
}

/**@param {{total:Number,error:Number,success:Number}} plugins*/
exports.headerDataPlugins = async (plugins) => {
    const chalk = await (await import("chalk")).default
    const lmsg = languageErr ? chalk.red(languageMSG) : languageMSG
    console.log(chalk.hex("f8ba00")("language: ")+lmsg)
    console.log(chalk.hex("f8ba00")("plugins loaded: ")+chalk.bold(plugins.total+" total ")+"("+plugins.success+"✅ "+plugins.error+"❌)")

    console.log("\n"+chalk.bold(chalk.underline("LIVESTATUS:")))
    await require("./utils/liveStatus").run(plugins)

    console.log("\n"+chalk.bold(chalk.underline("LOGS:")))
}