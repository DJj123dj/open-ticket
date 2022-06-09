const discord = require('discord.js')
const fs = require('fs')
const intents = discord.Intents
const client = new discord.Client({intents:[intents.FLAGS.GUILDS,intents.FLAGS.GUILD_MESSAGES,intents.FLAGS.GUILD_MEMBERS],partials:["CHANNEL"]})
exports.client = client

client.setMaxListeners(20)

if (process.argv[2]){
    if (process.argv[2].endsWith("d")){
        var isDev = true
        console.log("starting in dev mode...")
    }else{var isDev = false}
}else{var isDev = false}


if (isDev){
    try {
        var config = require('./devConfig.json')
    }catch{
        console.log("devConfig.json not found! Trying the normal config...")
        var config = require("./config.json")
    }
}else{var config = require('./config.json')}
exports.config = config
exports.errorLog = require("./core/errorLogSystem")
const log = this.errorLog.log

client.on('ready',async () => {
    const chalk = await (await import("chalk")).default

    if (!process.argv[2].startsWith("slash")){
        console.log(chalk.red("WELCOME TO OPEN TICKET!"))
        log("info","open ticket ready")

        console.log(chalk.blue("\n\nlogs:")+"\n============")
        if (config.status.enabled){
            client.user.setActivity(config.status.text,{type:config.status.type})
        }

        log("system","bot logged in!")

        await client.guilds.cache.find((g) => g.id == config.server_id).members.fetch()
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

if (!isDev){
    require("./core/checker").checker()
}

if (process.argv[2] && !process.argv[2].startsWith("slash")){
    var storage = require('./core/dynamicdatabase/storage')
    exports.storage = storage

    //commands
    require('./commands/ticket')()
    require("./commands/help")()
    require("./commands/close")()
    require("./commands/delete")()
    require("./commands/rename")()
    require("./commands/add")()
    require("./commands/remove")()

    //core
    require('./core/ticketOpener')()
    require("./core/ticketCloser").runThis()
    require("./core/closebuttons")()
    require("./core/reactionRoles")()
    require("./core/ticketReopener")()

}


//=====================================================================
//=====================================================================
//ERROR DEBUG MODE: turn not on exept when you know what you are doing!
var errorDebugMode = false
//ERROR DEBUG MODE: turn not on exept when you know what you are doing!
//=====================================================================
//=====================================================================



if (!errorDebugMode){
    process.on("uncaughtException",async (error,origin) => {
        const chalk = await (await import("chalk")).default
        console.log(chalk.red("\nOPEN TICKET ERROR: ")+error+"\n"+chalk.green("\nCreate a ticket in our support server for more information!\nIf you do this, you might help us to avoid a future bug!\n"))
    })
}
if (errorDebugMode) {
    const debugLog = (debugString) => {
        const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
        fs.writeFileSync("./openticketdebug.txt",content+"\nDEBUG: "+debugString)
    }
    const errorLog = (errorString,stack) => {
        const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
        fs.writeFileSync("./openticketdebug.txt",content+"\nERROR: "+errorString+" STACK: "+stack)
    }

    client.on("debug", async (message) => {
        if (message.startsWith("Provided token:")){
            debugLog("Provided token: ***********bot token is invisible**************...")
            return
        }
        debugLog(message)
    });

    const asyncfunction = async () => {
        const chalk = await (await import("chalk")).default
        console.log("\n\nopen-ticket debug:\n"+chalk.bgYellow("ENTERING DEBUG MODE:"))
    }
    asyncfunction()

    process.on("uncaughtException",async (error,origin) => {
        const chalk = await (await import("chalk")).default
        console.log(chalk.red("\nMAIN ERROR: ")+"this error is saved in the debug file!")
        errorLog(error.name+": "+error.message+" | origin: "+origin,error.stack)
    })
}

client.login(config.auth_token)