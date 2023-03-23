const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const axios = require("axios").default
const fs = require("fs")

const loadChalk = async () => {
    return await (await import("chalk")).default
}

//OTLiveStatus
/**@typedef {[{style:[{title:String,titleColor:"normal"|"red"|"green"|"blue"|"yellow"|"white"|"gray"|"magenta"|"cyan",description:String,descriptionColor:"normal"|"red"|"green"|"blue"|"yellow"|"white"|"gray"|"magenta"|"cyan"}],active:{versions:String[],languages:String[],usingPlugins:["yes"|"no"|"both"],usingSlashCommands:["yes"|"no"|"both"],transcripts:["html"|"text"|"both"]}}]} OTLiveStatus */

//OTLiveStatusError
/**@typedef {{bot:{id:String,pfp:String,name:String}, openticket:{version:String,language:String, slashcmds:Boolean,transcripts:false|"text"|"html",config:{system:{},options:{},messages:{},transcripts:{}},plugins:String[],pluginload:{success:Number,error:Number,total:Number}}, details:{actions:[{type:String,category:String,file:String,time:Number}],errortime:Number}, error:String}} OTLiveStatusError */

/**@type {[{type:String, category:String, file:String, time:Number}]} */
exports.actionRecorder = []

//================================================================
//=========================FUNCTIONS==============================
//================================================================

const getSlashEnabled = () => {
    if (!fs.existsSync("./storage/slashcmdEnabled.txt")) return false
    if (fs.readFileSync("./storage/slashcmdEnabled.txt").toString() == require("../../package.json").version){
        return true
    }else return false
}

/**
 * @param {Boolean} [local=false]
 * @returns {Promise<OTLiveStatus|false>}
*/
const getLivestatus = (local) => {
    return new Promise((resolve,reject) => {
        if (local){
            try {
                const livestatus = require("../../livestatus.json")
                if (!livestatus) return resolve(false)
                resolve(livestatus)
            }catch{
                return resolve(false)
            }
        }else{
            try {
                axios.get("https://livestatus.dj-dj.be/openticket.json").then((res) => {
                    const livestatus = res.data
                    if (!Array.isArray(livestatus)) return resolve(false)
                    if (!livestatus) return resolve(false)
                    resolve(livestatus)
                })
            }catch{
                return resolve(false)
            }
        }
    })
}

var globalPluginData = {total:0,error:0,success:0}

//announcer
/**@param {{total:Number,error:Number,success:Number}} pluginData*/
exports.run = async (pluginData) => {
    const chalk = await loadChalk()
    globalPluginData = pluginData
    const res = await getLivestatus(process.argv.some((v) => v == "--localstatus"))
    if (!res) return false
    if (res.length == 0) return

    /**@type {[{title:String,titleColor:"normal"|"red"|"green"|"blue"|"yellow"|"white"|"gray"|"magenta"|"cyan",description:String,descriptionColor:"normal"|"red"|"green"|"blue"|"yellow"|"white"|"gray"|"magenta"|"cyan"}]} */
    const activeStyles = []
    res.forEach((announcement) => {
        const a = announcement.active
        
        const isLanguage = a.languages.includes(config.languageFile) || a.languages.includes("all")
        const isVersion = a.versions.includes(require("../../package.json").version)

        var tsenabled = (bot.tsconfig.sendTranscripts.enableChannel || bot.tsconfig.sendTranscripts.enableDM)
        var tsmode = bot.tsconfig.sendTranscripts.useHTMLtranscripts ? "html" : "text"
        const isTranscript = (a.transcripts.includes("html") && tsmode == "html" && tsenabled) || (a.transcripts.includes("text") && tsmode == "text" && tsenabled) || (a.transcripts.includes("both") && tsenabled)
        const isPlugins = (a.usingPlugins.includes("yes") && pluginData.total > 0) || (a.usingPlugins.includes("no") && pluginData.total == 0) || (a.usingPlugins.includes("both"))
        const isSlashCMD = (a.usingSlashCommands.includes("yes") && getSlashEnabled()) || (a.usingSlashCommands.includes("no") && !getSlashEnabled()) || (a.usingSlashCommands.includes("both"))

        if (!isLanguage || !isVersion || !isTranscript || !isPlugins || !isSlashCMD) return
        announcement.style.forEach((s) => activeStyles.push(s))
    })
    const final = []
    activeStyles.forEach((style) => {
        const dc = style.descriptionColor
        const tempd = style.description.split("\n")
        const tc = style.titleColor
        const t = "["+style.title+"]"
        const tempd2 = []
        tempd.forEach((tmpd,i) => {
            if (i > 0){
                var newtext = tmpd
                var i2 = 0
                while(i2 < t.length+1){
                    newtext = " "+newtext
                    i2++
                }
                tempd2.push(newtext)
            }else{
                tempd2.push(tmpd)
            }
        })
        const d = tempd2.join("\n")


        var fd = d
        if (dc == "normal" || dc == "white") fd = chalk.white(d)
        if (dc == "red") fd = chalk.red(d)
        if (dc == "yellow") fd = chalk.yellow(d)
        if (dc == "green") fd = chalk.green(d)
        if (dc == "blue") fd = chalk.blue(d)
        if (dc == "gray") fd = chalk.gray(d)
        if (dc == "magenta") fd = chalk.magenta(d)
        if (dc == "cyan") fd = chalk.cyan(d)

        var ft = t
        if (tc == "normal" || tc == "white") ft = chalk.white(t)
        if (tc == "red") ft = chalk.red(t)
        if (tc == "yellow") ft = chalk.yellow(t)
        if (tc == "green") ft = chalk.green(t)
        if (tc == "blue") ft = chalk.blue(t)
        if (tc == "gray") ft = chalk.gray(t)
        if (tc == "magenta") ft = chalk.magenta(t)
        if (tc == "cyan") ft = chalk.cyan(t)

        final.push(ft+" "+fd)
    })

    console.log(final.join("\n\n"))
}

var waitTime = new Date().getTime()
var waitTimeEnabled = false

/**@param {OTLiveStatusError} options @returns {Promise<Boolean>} */
const uploadLiveStatus = (options) => {
    return new Promise((resolve,reject) => {
        if (process.argv.some((v) => v == "--noerrorupload")) return resolve(true)
        try {
            var data = encodeURIComponent(JSON.stringify(options))
            axios.get("https://livestatus.dj-dj.be/openticket?auth=openticketLIVESTATUS1234&data="+data).then((res) => {
                if (res.status == 200) resolve(true)
                else resolve(false)
            })
        }catch{
            resolve(false)
        }
    })
}

/**@param {String} err @returns {Promise<Boolean>}*/
exports.liveStatusUploadManager = async (err) => {
    return new Promise(async (resolve) => {
        
        if (process.argv.some((v) => v == "--noerrorupload")) return resolve(true)
        else{
            var tsenabled = (bot.tsconfig.sendTranscripts.enableChannel || bot.tsconfig.sendTranscripts.enableDM)
            var tsmode = bot.tsconfig.sendTranscripts.useHTMLtranscripts ? "html" : "text"
            const transcriptMode = tsenabled ? tsmode : false
            const slashMode = getSlashEnabled()

            try {
                if (waitTimeEnabled){
                    if (new Date().getTime() < waitTime){
                        waitTimeEnabled = false
                        return resolve(false)
                    }
                }
                const result = await uploadLiveStatus({
                    bot:{
                        id:client.user.id,
                        name:client.user.tag,
                        pfp:client.user.displayAvatarURL()
                    },
                    error:err,
                    openticket:{
                        config:{
                            messages:config.messages,
                            options:config.options,
                            transcripts:bot.tsconfig,
                            system:config.system
                        },
                        language:config.languageFile,
                        version:require("../../package.json").version,
                        slashcmds:slashMode,
                        transcripts:transcriptMode,
                        plugins:fs.readdirSync("./plugins"),
                        pluginload:globalPluginData
                    },
                    details:{
                        errortime:new Date().getTime(),
                        actions:this.actionRecorder,
                        database:fs.readFileSync("./storage/database.json").toString()
                    }
                })
                if (!result){
                    waitTime = new Date().getTime()+30000
                    waitTimeEnabled = true
                }
                resolve(result)
            }catch{resolve(false)}
        }
    })
}