const fs = require("fs")
const bot = require("../../index")
const log = bot.errorLog.log

module.exports = () => {
    const files = fs.readdirSync("./plugins")
    const api = require("./api.json")
    var totalcount = 0
    var successcount = 0
    var failcount = 0
    files.forEach((file) => {
        if (file.endsWith(".plugin.js")){
            try {
                require("../../plugins/"+file)()

                successcount++
                totalcount++
            }catch(err){
                /**@type {Error} */
                const theError = err
                if (api.enableAPIdebug){
                    try {
                        const data = fs.readFileSync("./apiDebug.txt")
                        const newData = data ? data.toString() : ""
                        fs.writeFileSync("./apiDebug.txt",newData+"ERROR: "+theError.name+": "+theError.message+"\n"+theError.stack+"\n\n")
                    }catch{
                        fs.writeFileSync("./apiDebug.txt","ERROR: "+theError.name+": "+theError.message+"\n"+theError.stack+"\n\n")
                    }
                }
                failcount++
                totalcount++
            }
        }
    })

    require("../startscreen").headerDataPlugins({total:totalcount,success:successcount,error:failcount})
}