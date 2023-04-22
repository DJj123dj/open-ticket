/**
   ____  _____  ______ _   _     _______ _____ _____ _  ________ _______ 
  / __ \|  __ \|  ____| \ | |   |__   __|_   _/ ____| |/ /  ____|__   __|
 | |  | | |__) | |__  |  \| |      | |    | || |    | ' /| |__     | |   
 | |  | |  ___/|  __| | . ` |      | |    | || |    |  < |  __|    | |   
 | |__| | |    | |____| |\  |      | |   _| || |____| . \| |____   | |   
  \____/|_|    |______|_| \_|      |_|  |_____\_____|_|\_\______|  |_|   
                                                                       
                      Hey! we are looking for you!
    Do you speak a language that isn't yet in our /languages directory
        or do you speak one that isn't up-to-date? Open Ticket needs
            translators for lots of different languages!
  Feel free to join our translator team and help us improve Open Ticket!



    
    SUGGESTING NEW FEATURES:
    =====================
    Open Ticket is a community project. This means that 
    almost all feature ideas come from our community. 
    Are you missing something you want in open ticket? 
    Then join our Discord server and we will add it (if possible)

    Did you know that 80% of all features in OT were ideas from our community?



    INFORMATION:
    ============
    Open Ticket v3.3.3  -  © DJdj Development

    discord: https://discord.dj-dj.be
    website: https://www.dj-dj.be
    github: https://openticket.dj-dj.be
    support e-mail: support@dj-dj.be

    Config files:
    ./config.json
    ./transcriptconfig.json

    Send ./openticketdebug.txt when there are errors!
 */

const discord = require("discord.js")
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
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","created client")

var tempconfig = require("./config.json")
/**@type {Boolean} */
var isDevConfig = false

if (process.argv.some((v) => v == "--devconfig")){
    isDevConfig = true
    try{
    tempconfig = require("./devconfig.json")
    }catch{tempconfig = require("./config.json")}
}else{
    tempconfig = require("./config.json")
}
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded flags")

exports.developerConfig = isDevConfig

const config = tempconfig
exports.config = config

const tsconfig = isDevConfig ? require("./devtsconfig.json") : require("./transcriptconfig.json")
exports.tsconfig = tsconfig

const language = require("./core/languageManager").language
exports.language = language
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded language")

if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded config")
exports.storage = require('./core/dynamicdatabase/storage')
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","loaded storage")

exports.errorLog = require("./core/errorLogSystem")
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","LOADED LOGGING SYSTEM")
if (process.argv.some((v) => v == "--debug")) console.log("[TEMP_DEBUG]","switching to new logs")
this.errorLog.log("debug","loaded new logs")

exports.actionRecorder = require("./core/utils/liveStatus").actionRecorder

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
    this.actionRecorder.push({
        category:"ot.managers.djs",
        file:"index.js",
        time:new Date().getTime(),
        type:"client.loggedin.success"
    })
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
    }
    this.errorLog.log("debug","bot status loaded")
    this.actionRecorder.push({
        category:"ot.managers.djs",
        file:"index.js",
        time:new Date().getTime(),
        type:"client.setstatus.success"
    })

    const chalk = await (await import("chalk")).default

    require("./core/startscreen").run()
    this.actionRecorder.push({
        category:"ot.managers.main",
        file:"index.js",
        time:new Date().getTime(),
        type:"startscreen.success"
    })

    if (!process.argv[2] || (process.argv[2] && !process.argv[2].startsWith("slash"))){
        //normal start
        this.errorLog.log("debug","loaded console interface")

        if (config.status.enabled){
            setStatus(config.status.type,config.status.text)
        }

        this.actionRecorder.push({
            category:"ot.managers.main",
            file:"index.js",
            time:new Date().getTime(),
            type:"startmode.normal"
        })

        var updatingSlash = false
        if (fs.existsSync("./storage/slashcmdEnabled.txt")){
            /**@type {"true"|"false"|String} */
            const data = fs.readFileSync("./storage/slashcmdEnabled.txt").toString()
            if (data === require("./package.json").version){
                require("./core/slashSystem/autoSlashUpdate")()
                updatingSlash = true

            }else if ((data != require("./package.json").version) && (data != "false")){
                require("./core/slashSystem/slashEnable")(true)
                updatingSlash = true
            }
        }else{
            if (process.argv.some((v) => v == "--noslash")){
                fs.writeFileSync("./storage/slashcmdEnabled.txt","false")
            }else{
                fs.writeFileSync("./storage/slashcmdEnabled.txt",require("./package.json").version)
                require("./core/slashSystem/slashEnable")(true)
                updatingSlash = true
            }
        }
        this.actionRecorder.push({
            category:"ot.managers.main",
            file:"index.js",
            time:new Date().getTime(),
            type:"slashcmd.autoupdate.success"
        })

        try {
            await client.guilds.cache.find((g) => g.id == config.serverId).members.fetch()
        }catch{
            this.errorLog.log("info","tried to cache user information, failed!")
        }
        require("./core/startscreen").headerDataReady(chalk,config.status,updatingSlash,false)

    }else{
        //slash command activation using node index.js slash (enable|disable)
        require("./core/startscreen").headerDataReady(chalk,config.status,updatingSlash,true)
        this.errorLog.log("debug","slashmode activated")
        if (process.argv[3] == "enable"){
            console.log(chalk.green("switching to slashEnable.js"))
            this.actionRecorder.push({
                category:"ot.managers.main",
                file:"index.js",
                time:new Date().getTime(),
                type:"startmode.slash.enable"
            })
            require("./core/slashSystem/slashEnable")()
        }else if (process.argv[3] == "disable"){
            console.log(chalk.green("switching to slashDisable.js"))
            this.actionRecorder.push({
                category:"ot.managers.main",
                file:"index.js",
                time:new Date().getTime(),
                type:"startmode.slash.disable"
            })
            require("./core/slashSystem/slashDisable")()
        }else{
            console.log(chalk.bgRed("[SLASH CMD MANAGER]: unknown slash command action!"))
            process.exit(1)
        }
    }

    //load plugins
    this.actionRecorder.push({
        category:"ot.managers.plugins",
        file:"./core/api/pluginlauncher.js",
        time:new Date().getTime(),
        type:"plugins.loading"
    })
    require("./core/api/pluginlauncher")()
    this.actionRecorder.push({
        category:"ot.managers.plugins",
        file:"./core/api/pluginlauncher.js",
        time:new Date().getTime(),
        type:"plugins.success"
    })
    this.errorLog.log("debug","loading plugins")
})
if (!require("./core/api/api.json").disable.checkerjs.all){
    this.actionRecorder.push({
        category:"ot.managers.main",
        file:"./core/checker.js",
        time:new Date().getTime(),
        type:"checker.loading"
    })
    require("./core/checker").checker()
    this.errorLog.log("debug","loading checker.js")
    this.errorLog.log("debug","checking config...")
    this.actionRecorder.push({
        category:"ot.managers.main",
        file:"./core/checker.js",
        time:new Date().getTime(),
        type:"checker.success"
    })
}

if (process.argv[2] && process.argv[2].startsWith("slash")){
    //do nothing
}else{

    this.actionRecorder.push({
        category:"ot.managers.loader",
        file:"./index.js",
        time:new Date().getTime(),
        type:"commands.loading"
    })
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
    this.actionRecorder.push({
        category:"ot.managers.loader",
        file:"./index.js",
        time:new Date().getTime(),
        type:"commands.success"
    })

    this.actionRecorder.push({
        category:"ot.managers.loader",
        file:"./index.js",
        time:new Date().getTime(),
        type:"core.loading"
    })
    this.errorLog.log("debug","LOADING CORE")
    //core
    require('./core/ticketActions/ticketOpener')()
    require("./core/reactionRoles")()
    require("./core/ticketActions/ticketAutoclose")()

    this.errorLog.log("debug","LOADING INTERACTION HANDLERS")
    //InteractionHandlers
    require("./core/interactionHandlers/handlers/handlers")()

    this.actionRecorder.push({
        category:"ot.managers.loader",
        file:"./index.js",
        time:new Date().getTime(),
        type:"core.success"
    })
}

this.actionRecorder.push({
    category:"ot.managers.loader",
    file:"./index.js",
    time:new Date().getTime(),
    type:"api.loading"
})
this.errorLog.log("debug","loading api")
const APIEvents = require("./core/api/modules/events")
const APIConfig = require("./core/api/api.json")

this.actionRecorder.push({
    category:"ot.managers.loader",
    file:"./index.js",
    time:new Date().getTime(),
    type:"api.success"
})

this.actionRecorder.push({
    category:"ot.managers.loader",
    file:"./index.js",
    time:new Date().getTime(),
    type:"debugsystem.loading"
})

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

    //TEMPORARY INTEGRATION FOR LIVESTATUS ERROR UPLOADER:
    await require("./core/utils/liveStatus").liveStatusUploadManager(error.name+": "+error.message+" | origin: "+origin+"\n"+error.stack)
})

this.actionRecorder.push({
    category:"ot.managers.loader",
    file:"./index.js",
    time:new Date().getTime(),
    type:"debugsystem.success"
})

const token = config.token.fromENV ? process.env.TOKEN : config.token.value
client.login(token)
this.errorLog.log("debug","login with token")