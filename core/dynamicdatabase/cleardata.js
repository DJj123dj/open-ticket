const fs = require('fs')
const readline = require("readline")
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
    terminal:true
})

const ask = async () => {
    const chalk = await (await import("chalk")).default
    rl.question(chalk.yellow("WARNING: are you sure that there are",chalk.red("no tickets open"),"at the moment? ")+chalk.green("(yes/no)")+"\n",(answer) => {
        if (answer != "1" && !answer.toLowerCase().startsWith("yes")){
            console.log(chalk.red("invalid answer"))
            ask()
            return
        }
        console.log(chalk.green("clearing data..."))
        runClear()
        rl.close()
    })
}
ask()

const runClear = async () => {
    const chalk = await (await import("chalk")).default
    //console.log(chalk.blue("You can get a node.js warning below, just ignore that, it's not important!"))
    const dataPaths = ["./storage/dynamicDB"]

    var index = 0

    dataPaths.forEach((path) => {
        try {
        fs.rmSync(path,{recursive:true,force:true})
        }catch{
            //console.log(path,"doesn't exist")
        }
        setTimeout(() => {
            try{
            fs.mkdirSync(path)
            }catch{
                //console.log(path,"already exists")
            }
            index++
        },500)
    })

    setInterval(() => {
        if (index >= 1){
            console.log(chalk.bgGreen("All local data is cleared!"))
            process.exit(1)
        }
    },500)
}