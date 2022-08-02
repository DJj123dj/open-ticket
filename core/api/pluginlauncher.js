const fs = require("fs")
const bot = require("../../index")
const log = bot.errorLog.log

module.exports = () => {
    const files = fs.readdirSync("./plugins")

    var totalcount = 0
    var successcount = 0
    var failcount = 0
    files.forEach((file) => {
        if (file.endsWith(".plugin.js")){
            try {
                require("../../plugins/"+file)()

                successcount++
                totalcount++
            }catch{
                failcount++
                totalcount++
            }
        }
    })

    log("info","loaded plugins",[{key:"success",value:successcount},{key:"error",value:failcount},{key:"total",value:totalcount}])
}