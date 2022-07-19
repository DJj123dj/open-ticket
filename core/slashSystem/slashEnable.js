const discord = require("discord.js")
const bot = require("../../index")
const client = require("../../index").client
const config = bot.config
const getoptions = require("../getoptions")

const act = discord.ApplicationCommandType
const acot = discord.ApplicationCommandOptionType

module.exports = async () => {
    const chalk = (await import("chalk")).default
    const sid = config.server_id

    const ids = getoptions.getTicketValues("id")
    /**@type {[{name:String,value:String}]} */
    var choices = []
    ids.forEach((id) => {
        const option = getoptions.getOptionsById(id)
        if (option.type == "ticket"){
            choices.push({name:option.name,value:option.id})
        }
    })

    /**@type {[{name:String,value:String}]} */
    var msgchoices = []
    config.messages.forEach((msg) => {
        msgchoices.push({name:msg.id,value:msg.id})
    })

    var readystats = 0

    process.stdout.write("[status] there are "+chalk.blue("0 out of 10")+" commands ready! (this can take up to 40 seconds)")
    setInterval(() => {
        process.stdout.cursorTo(0)
        process.stdout.write("[status] there are "+chalk.blue(readystats+" out of 9")+" commands ready! (this can take up to 40 seconds)")
        if (readystats >= 10){
            console.log(chalk.green("\nready!"))
            console.log(chalk.bgBlue("you can now start the bot with 'npm start'!"))
            process.exit(1)
        }
    },100)

    //create a ticket (/new or /ticket)
    client.application.commands.create({
        name:"ticket",
        description:"Create a ticket!",
        defaultPermission:true,
        type:act.ChatInput,
        options:[
            {
                type:acot.String,
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
        type:act.ChatInput,
        options:[
            {
                type:acot.String,
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
        type:act.ChatInput
    },sid).then(() => {
        readystats++

    })

    //close
    client.application.commands.create({
        name:"close",
        description:"Close the current ticket.",
        defaultPermission:true,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

    //delete
    client.application.commands.create({
        name:"delete",
        description:"Delete the current ticket.",
        defaultPermission:true,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

    //msg
    client.application.commands.create({
        name:"message",
        description:"Create a ticket message.",
        defaultPermission:true,
        type:act.ChatInput,
        options:[
            {
                type:acot.String,
                name:"id",
                description:"The message id.",
                required:true,
                choices:msgchoices,
                max_length:30

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
        type:act.ChatInput,
        options:[
            {
                type:acot.User,
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
        type:act.ChatInput,
        options:[
            {
                type:acot.User,
                name:"user",
                description:"The user to remove.",
                required:true
            }
        ]
    },sid).then(() => {
        readystats++
    })

    //rename
    client.application.commands.create({
        name:"rename",
        description:"Rename this ticket.",
        defaultPermission:true,
        type:act.ChatInput,
        options:[
            {
                type:acot.String,
                name:"name",
                description:"The new name (without prefix).",
                required:true
            }
        ]
    },sid).then(() => {
        readystats++
    })

    //reopen
    client.application.commands.create({
        name:"reopen",
        description:"Reopen this ticket.",
        defaultPermission:true,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

}