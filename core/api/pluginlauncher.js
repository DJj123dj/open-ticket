const fs = require("fs")
const bot = require("../../index")
const log = bot.errorLog.log

module.exports = () => {
    const args = process.argv
    const debugMode = args.includes("--debug")

    const files = fs.readdirSync("./plugins")
    const api = require("./api.json")
    var totalcount = 0
    var successcount = 0
    var failcount = 0
    files.forEach((file) => {
        if (file.endsWith(".plugin.js")){
            try {
                require("../../plugins/" + file)()

                successcount++
                totalcount++
            }catch(err){
                /**@type {Error} */
                const theError = err
                if (api.enableAPIdebug || debugMode) {
                    console.error(theError)
                }

                try {
                    const data = fs.readFileSync("./openticketdebug.txt")
                    const newData = data ? data.toString() : ""
                    fs.writeFileSync("./openticketdebug.txt", newData + "\nPLUGIN "+file+" ERROR: " + theError.name + ": " + theError.message + "\n" + theError.stack + "\n\n")
                } catch {
                    fs.writeFileSync("./openticketdebug.txt", "\nPLUGIN "+file+" ERROR: " + theError.name + ": " + theError.message + "\n" + theError.stack + "\n\n")
                }

                failcount++
                totalcount++
            }
        }
    })

    require("../startscreen").headerDataPlugins({ total: totalcount, success: successcount, error: failcount })
}