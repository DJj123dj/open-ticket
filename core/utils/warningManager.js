const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

const loadChalk = async () => {
    return await (await import("chalk")).default
}

//ENABLE message for when there is too less translation
const enableNoTranslationMessage = true

module.exports = async () => {
    const chalk = await loadChalk()
    if (enableNoTranslationMessage){
        console.log(chalk.red("[warning]"),"WARNING!!\n"+chalk.blue("We have a small problem with translation atm, so it can be that "+chalk.redBright("some translations are in English!")+"\n\nYou can help us if you want by joining our server!\n"))
    }
}