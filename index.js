//    __________       __________       ___________     ____       ____
//   /   ____   \     /  ______  \     /          |     |   \      |  |
//   |  /    \  |     |  |    |  |     |  |_______|     |    \     |  |
//   |  |    |  |     |  |____|  |     |  |             |  |\ \    |  |
//   |  |    |  |     |  ________/     |  |______       |  | \ \   |  |
//   |  |    |  |     |  |             |   _____|       |  |  \ \  |  |
//   |  |    |  |     |  |             |  |             |  |   \ \ |  |
//   |  |    |  |     |  |             |  |________     |  |    \ \|  |
//   |  \____/  |     |  |             |          |     |  |     \    |
//   \__________/     |__|             \__________|     |__|      \___|


const discord = require('discord.js')
const fs = require('fs')
const {GatewayIntentBits,Partials} = discord
const client = new discord.Client({
    intents:[
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    partials:[Partials.Channel,Partials.Message]
})
exports.client = client

client.setMaxListeners(50)

if (process.argv[2]){
    if (process.argv[2].endsWith("d")){
        var isDev = true
        console.log("starting in dev mode...")
    }else{var isDev = false}
}else{var isDev = false}

exports.developerMode = isDev
const language = require("./core/languageManager").language
exports.language = language

if (isDev){
    try {
        var config = require('./devConfig.json')
    }catch{
        console.log("devConfig.json not found! Trying the normal config...")
        var config = require("./config.json")
    }
}else{var config = require('./config.json')}
exports.config = config
exports.storage = require('./core/dynamicdatabase/storage')

exports.errorLog = require("./core/errorLogSystem")
const log = this.errorLog.log

exports.hiddenData = require("./core/utils/hiddendata")

exports.embeds = {
    commands:require("./core/interactionHandlers/embeds/commands")
}
exports.buttons = {
    close:require("./core/interactionHandlers/buttons/close"),
    firstmsg:require("./core/interactionHandlers/buttons/firstmsg"),
    verifybars:require("./core/interactionHandlers/buttons/verifyBars")
}

client.on('ready',async () => {
    var statusSet = false
    const setStatus = (type,text) => {
        if (statusSet == true) return
        const getTypeEnum = (text) => {
            if (text.toLowerCase() == "playing") return discord.ActivityType.Playing
            else if (text.toLowerCase() == "listening") return discord.ActivityType.Listening
            else if (text.toLowerCase() == "watching") return discord.ActivityType.Watching
            else return discord.ActivityType.Listening
        }
        client.user.setActivity(text,{type:getTypeEnum(type)})
        statusSet = true
        log("system","loaded status",[{key:"type",value:type},{key:"text",value:text}])
    }

    const chalk = await (await import("chalk")).default

    if (!process.argv[2]){
        console.log(chalk.red("WELCOME TO OPEN TICKET!"))
        log("info","open ticket ready",[{key:"version",value:require("./package.json").version},{key:"language",value:config.languagefile}])

        console.log(chalk.blue("\n\nlogs:")+"\n============")
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }

        log("system","bot logged in!")

        await client.guilds.cache.find((g) => g.id == config.server_id).members.fetch()
        return
    }

    if (process.argv[2] == "d"){
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }
    }

    if (!process.argv[2].startsWith("slash")){
        console.log(chalk.red("WELCOME TO OPEN TICKET!"))
        log("info","open ticket ready",[{key:"version",value:require("./package.json").version},{key:"language",value:config.languagefile}])

        console.log(chalk.blue("\n\nlogs:")+"\n============")
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
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

    //load plugins
    require("./core/api/pluginlauncher")()
})

if (!isDev){
    require("./core/checker").checker()
}

if (process.argv[2] && process.argv[2].startsWith("slash")){
    //do nothing
}else{

    //commands
    require('./commands/ticket')(this)
    require("./commands/help")(this)
    require("./commands/close")(this)
    require("./commands/delete")(this)
    require("./commands/rename")(this)
    require("./commands/add")(this)
    require("./commands/remove")(this)
    require("./commands/reopen")(this)

    //core
    require('./core/ticketOpener')(this)
    require("./core/ticketCloser").runThis(this)
    require("./core/closebuttons")(this)
    require("./core/reactionRoles")(this)
    require("./core/ticketReopener").runThis(this)

    //InteractionHandlers
    require("./core/interactionHandlers/handlers/handlers")()

}

const APIEvents = require("./core/api/modules/events")

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

process.on("uncaughtException",async (error,origin) => {
    const chalk = await (await import("chalk")).default
    console.log(chalk.red("\nOPEN TICKET ERROR: ")+error+"\n"+chalk.green("\nCreate a ticket in our support server for more information!\nIf you do this, you might help us to avoid a future bug!\n"))
    errorLog(error.name+": "+error.message+" | origin: "+origin,error.stack)

    APIEvents.onError(error.name+": "+error.message,new Date())
})

client.login(config.auth_token)