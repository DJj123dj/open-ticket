const index = require("../index")

if (index.developerMode){
    var config = require("../devConfig.json")
}else{var config = require("../config.json")}


var localLanguage = require("../language/english.json")
if (config.languagefile.startsWith("custom")) localLanguage = require("../language/custom.json")
else if (config.languagefile.startsWith("dutch")) localLanguage = require("../language/dutch.json")
else if (config.languagefile.startsWith("english")) localLanguage = require("../language/english.json")
else if (config.languagefile.startsWith("german")) localLanguage = require("../language/german.json")
else if (config.languagefile.startsWith("french")) localLanguage = require("../language/french.json")
else if (config.languagefile.startsWith("romanian")) localLanguage = require("../language/romanian.json")
else if (config.languagefile.startsWith("arabic")) localLanguage = require("../language/arabic.json")
else if (config.languagefile.startsWith("spanish")) localLanguage = require("../language/spanish.json")

const errorLog = async () => {
    const chalk = await (await import("chalk")).default

    console.log(chalk.red("Something went wrong when loading the language!")+"\nCheck the config file or create a ticket in our server!")
}

const successLog = async (language) => {
    const chalk = await (await import("chalk")).default

    console.log(chalk.green("loaded language "+language+"..."))
}

if (!localLanguage){
    const runError = async () => {
        await errorLog()
        process.exit(1)
    }
    runError()
}else{
    exports.language = localLanguage
    successLog(config.languagefile)
}