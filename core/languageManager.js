const index = require("../index")

if (index.developerConfig){
    var config = require("../devconfig.json")
}else{var config = require("../config.json")}


var localLanguage = require("../language/english.json")
const fs = require("fs")
const lfexists = fs.existsSync("./language/"+config.languagefile+".json")
if (lfexists) localLanguage = require("../language/"+config.languagefile+".json")

const errorLog = async () => {
    const chalk = await (await import("chalk")).default

    require("./startscreen").headerDataLanguage("Something went wrong when loading the language!",true)
}

const successLog = async (language) => {
    const chalk = await (await import("chalk")).default

    require("./startscreen").headerDataLanguage("sucessfully loaded language "+language,false)
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