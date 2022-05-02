const discord = require("discord.js")
const client = require("../../index").client
const config = require("../../config.json")
const getoptions = require("../getoptions")

module.exports = async () => {
    const chalk = (await import("chalk")).default
    const sid = config.server_id

    const ids = getoptions.getTicketValues("id")
    /**@type {[{name:String,value:String}]} */
    var choices = []
    ids.forEach((id) => {
        const option = getoptions.getOptionsById(id)
        console.log(option.id)
        choices.push({name:option.name,value:option.id})
    })

    /**@type {[{name:String,value:String}]} */
    var msgchoices = []
    config.messages.forEach((msg) => {
        msgchoices.push({name:msg.id,value:msg.id})
    })

    var readystats = 0

    setInterval(() => {
        console.log("[status] there are "+chalk.blue(readystats+" out of 8")+" commands ready! (this can take some time)")
        if (readystats >= 8){
            console.log(chalk.green("ready!"))
            console.log(chalk.blue("you can now start the bot with 'npm start'!"))
            process.exit(1)
        }
    },1000)

    //create a ticket (/new or /ticket)
    client.application.commands.create({
        name:"ticket",
        description:"Create a ticket!",
        defaultPermission:true,
        type:"CHAT_INPUT",
        options:[
            {
                type:"STRING",
                name:"type",
                description:"The type of ticket.",
                required:true,
                choices:choices

            }
        ]
    },sid).then(() => {
        readystats++
    })

    client.application.commands.create({
        name:"new",
        description:"Create a ticket!",
        defaultPermission:true,
        type:"CHAT_INPUT",
        options:[
            {
                type:"STRING",
                name:"type",
                description:"The type of ticket.",
                required:true,
                choices:choices

            }
        ]
    },sid).then(() => {
        readystats++
    })

    //help
    client.application.commands.create({
        name:"help",
        description:"The help menu",
        defaultPermission:true,
        type:"CHAT_INPUT"
    },sid).then(() => {
        readystats++

    })

    //close
    client.application.commands.create({
        name:"close",
        description:"Close the current ticket.",
        defaultPermission:true,
        type:"CHAT_INPUT"
    },sid).then(() => {
        readystats++
    })

    //delete
    client.application.commands.create({
        name:"delete",
        description:"Delete the current ticket.",
        defaultPermission:true,
        type:"CHAT_INPUT"
    },sid).then(() => {
        readystats++
    })

    //msg
    client.application.commands.create({
        name:"message",
        description:"Create a ticket message.",
        defaultPermission:true,
        type:"CHAT_INPUT",
        options:[
            {
                type:"STRING",
                name:"id",
                description:"The message id.",
                required:true,
                choices:msgchoices

            }
        ]
    },sid).then(() => {
        readystats++
    })

    //add
    client.application.commands.create({
        name:"add",
        description:"Add people to this ticket.",
        defaultPermission:true,
        type:"CHAT_INPUT",
        options:[
            {
                type:"USER",
                name:"user",
                description:"The user to add.",
                required:true
            }
        ]
    },sid).then(() => {
        readystats++
    })

    //remove
    client.application.commands.create({
        name:"remove",
        description:"Remove people from this ticket.",
        defaultPermission:true,
        type:"CHAT_INPUT",
        options:[
            {
                type:"USER",
                name:"user",
                description:"The user to remove.",
                required:true
            }
        ]
    },sid).then(() => {
        readystats++
    })

}