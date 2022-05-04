const discord = require('discord.js')
const intents = discord.Intents
const client = new discord.Client({intents:[intents.FLAGS.GUILDS,intents.FLAGS.GUILD_MESSAGES,intents.FLAGS.GUILD_MEMBERS],partials:["CHANNEL"]})
exports.client = client

client.setMaxListeners(20)

//change to FALSE on release
const isDev = true
//!!!!!!!!!!!
//test for discord webhook

if (isDev){
    try {
        var config = require('./devConfig.json')
    }catch{
        console.log("devConfig.json not found! Trying the normal config...")
        var config = require("./config.json")
    }
}else{var config = require('./config.json')}
exports.config = config

client.on('ready',async () => {
    const chalk = await (await import("chalk")).default
    if (process.argv[2] != "slash"){
        console.log(chalk.green("open-ticket ready!"))
        if (config.logs){console.log(chalk.white("\n\nlogs:\n============"))}
        if (config.status.enabled){
            client.user.setActivity(config.status.text,{type:config.status.type})
        }
    }else{
        console.log(chalk.red("STARTING IN ")+chalk.blue("SLASH MODE")+chalk.red("..."))
        console.log("logs:\n================")
        console.log("client logged in...")
        console.log("loading files...")
        if (process.argv[3] == "enable"){
            console.log(chalk.green("switching to slashEnable.js"))
            require("./core/slashSystem/slashEnable")()
        }else if (process.argv[3] == "disable"){
            console.log(chalk.green("switching to slashDisable.js"))
            require("./core/slashSystem/slashDisable")()
        }else{
            console.log(chalk.red("Internal Error: unknown slash mode!"))
            process.exit(1)
        }
    }
})

//checker.js must stand HERE
//before the "if slash"

if (process.argv[2] != "slash"){
    var storage = require('./core/dynamicdatabase/storage')
    exports.TicketStorage = storage.ticketStorage
    exports.userTicketStorage = storage.userTicketStorage
    exports.transcriptStorage = storage.transcriptStorage
    exports.ticketNumberStorage = storage.ticketNumberStorage

    //commands
    require('./commands/ticket')()
    require("./commands/help")()
    require("./commands/close")()
    require("./commands/delete")()
    require("./commands/rename")()

    //core
    require('./core/ticketOpener')()
    require("./core/ticketCloser").runThis()
    require("./core/closebuttons")()

    /**
     * We need:
     * - checker.js
     * - extracmds.js
     */

}

//process.on('unhandledRejection',async (error) => {
//    const chalk = await (await import("chalk")).default
//    console.log(chalk.red("ERROR: ")+error)
//})

client.login(config.auth_token)