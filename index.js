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

const discord = require("discord.js")
const fs = require('fs')
const {GatewayIntentBits,Partials} = discord
const APIBase = require("./core/api/modules/base")
if (APIBase.embeddedMode){
    var tempClient = APIBase.clientLocation
}else{
    var tempClient = new discord.Client({
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
}
/**@type {discord.Client} */
const client = tempClient
exports.client = client
client.setMaxListeners(50)
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","created client")

var tempconfig = require("./config.json")
/**@type {Boolean} */
var isDevConfig = false

if (process.argv.some((v) => v == "--devconfig")){
    async function logFLAGS(){
        const chalk = await (await import("chalk")).default
        console.log(chalk.blue("[FLAGS] => used dev config instead of normal config"))
    }; logFLAGS()
    isDevConfig = true
    try{
    tempconfig = require("./devConfig.json")
    }catch{tempconfig = require("./config.json")}
}else{
    tempconfig = require("./config.json")
}
if (process.argv.some((v) => v == "--nochecker")){
    async function logFLAGS(){
        const chalk = await (await import("chalk")).default
        console.log(chalk.blue("[FLAGS] => disabled checker.js"))
    }; logFLAGS()
}
if (process.argv.some((v) => v == "--debug")){
    async function logFLAGS(){
        const chalk = await (await import("chalk")).default
        console.log(chalk.blue("[FLAGS] => enabled DEBUG mode"))
    }; logFLAGS()
}
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded flags")

exports.developerConfig = isDevConfig
const language = require("./core/languageManager").language
exports.language = language
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded language")


const config = tempconfig
exports.config = config

const tsconfig = require("./transcriptconfig.json")
exports.tsconfig = tsconfig

if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded config")
exports.storage = require('./core/dynamicdatabase/storage')
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded storage")

exports.errorLog = require("./core/errorLogSystem")
const log = this.errorLog.log
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","LOADED LOGGING SYSTEM")
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","switching to new logs")
this.errorLog.log("debug","loaded new logs")

exports.hiddenData = require("./core/utils/hiddendata")
this.errorLog.log("debug","loaded hiddendataTM")

exports.embeds = {
    commands:require("./core/interactionHandlers/embeds/commands")
}
exports.buttons = {
    close:require("./core/interactionHandlers/buttons/close"),
    firstmsg:require("./core/interactionHandlers/buttons/firstmsg"),
    verifybars:require("./core/interactionHandlers/buttons/verifyBars")
}
this.errorLog.log("debug","loaded buttons & embeds")

client.on('ready',async () => {
    this.errorLog.log("debug","client logged in")
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
    this.errorLog.log("debug","bot status loaded")

    const chalk = await (await import("chalk")).default

    if (!process.argv[2]){
        console.log(chalk.red("WELCOME TO OPEN TICKET!"))
        this.errorLog.log("debug","loaded console interface")
        log("info","open ticket ready",[{key:"version",value:require("./package.json").version},{key:"language",value:config.languagefile}])
        require("./core/utils/liveStatus")()

        console.log(chalk.blue("\n\nlogs:")+"\n============")
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }

        if (fs.existsSync("./storage/slashcmdEnabled.txt")){
            /**@type {"true"|"false"} */
            const data = fs.readFileSync("./storage/slashcmdEnabled.txt").toString()
            if (data === "true"){require("./core/slashSystem/autoSlashUpdate")()}
        }else{fs.writeFileSync("./storage/slashcmdEnabled.txt","false")}

        log("system","bot logged in!")

        try {
            await client.guilds.cache.find((g) => g.id == config.server_id).members.fetch()
        }catch{
            this.errorLog.log("info","tried to cache user information, failed!")
        }
        return
    }

    if (process.argv[2] == "d"){
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }
    }

    if (!process.argv[2].startsWith("slash")){
        console.log(chalk.red("WELCOME TO OPEN TICKET!"))
        this.errorLog.log("debug","loaded console interface")
        log("info","open ticket ready",[{key:"version",value:require("./package.json").version},{key:"language",value:config.languagefile}])
        require("./core/utils/liveStatus")()

        console.log(chalk.blue("\n\nlogs:")+"\n============")
        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }
        if (fs.existsSync("./storage/slashcmdEnabled.txt")){
            /**@type {"true"|"false"} */
            const data = fs.readFileSync("./storage/slashcmdEnabled.txt").toString()
            if (data === "true"){require("./core/slashSystem/autoSlashUpdate")()}
        }else{fs.writeFileSync("./storage/slashcmdEnabled.txt","false")}

        log("system","bot logged in!")

        try {
            await client.guilds.cache.find((g) => g.id == config.server_id).members.fetch()
        }catch{
            this.errorLog.log("info","tried to cache user information, failed!")
        }
    }else{
        console.log(chalk.red("STARTING IN ")+chalk.blue("SLASH MODE")+chalk.red("..."))
        this.errorLog.log("debug","slashmode activated")
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
            console.log(chalk.red("[SLASH CMD MANAGER]: unknown slash mode!"))
            process.exit(1)
        }
    }

    //load plugins
    require("./core/api/pluginlauncher")()
    this.errorLog.log("debug","loading plugins")
})
if (!require("./core/api/api.json").disable.checkerjs.all) require("./core/checker").checker()
    this.errorLog.log("debug","loading checker.js")
    this.errorLog.log("debug","checking config...")

if (process.argv[2] && process.argv[2].startsWith("slash")){
    //do nothing
}else{

    this.errorLog.log("debug","LOADING COMMANDS")
    //commands
    require('./commands/ticket')()
    require("./commands/help")()
    require("./commands/close")()
    require("./commands/delete")()
    require("./commands/rename")()
    require("./commands/add")()
    require("./commands/remove")()
    require("./commands/reopen")()
    require("./commands/claim")()
    require("./commands/unclaim")()
    require("./commands/change")()

    this.errorLog.log("debug","LOADING CORE")
    //core
    require('./core/ticketActions/ticketOpener')()
    require("./core/reactionRoles")()

    this.errorLog.log("debug","LOADING INTERACTION HANDLERS")
    //InteractionHandlers
    require("./core/interactionHandlers/handlers/handlers")()

    //require("./test")()
}

this.errorLog.log("debug","loading api")
const APIEvents = require("./core/api/modules/events")
const APIConfig = require("./core/api/api.json")

const debugLog = (debugString) => {
    if (!APIConfig.disable.debug.all && !APIConfig.disable.debug.debuglogs){
    const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
    fs.writeFileSync("./openticketdebug.txt",content+"\nDEBUG: "+debugString)
    }
    this.errorLog.clearDebugFile()
}
const errorLog = (errorString,stack) => {
    if (!APIConfig.disable.debug.all){
    const content = fs.existsSync("./openticketdebug.txt") ? fs.readFileSync("./openticketdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
    fs.writeFileSync("./openticketdebug.txt",content+"\nERROR: "+errorString+" STACK: "+stack)
    }
    this.errorLog.clearDebugFile()
}
this.errorLog.log("debug","OT error system loaded successfully")

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

if (!APIBase.embeddedMode) client.login(config.auth_token)
this.errorLog.log("debug","login with token")