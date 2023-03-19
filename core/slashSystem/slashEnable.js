const discord = require("discord.js")
const bot = require("../../index")
const client = require("../../index").client
const config = bot.config
const configParser = require("../utils/configParser")

const act = discord.ApplicationCommandType
const acot = discord.ApplicationCommandOptionType

/**@param {Boolean|undefined} invisible*/
module.exports = async (invisible) => {
    const chalk = (await import("chalk")).default
    const sid = config.serverId

    const ids = configParser.getTicketValuesArray("id")
    /**@type {[{name:String,value:String}]} */
    var choices = []
    ids.forEach((id) => {
        const option = configParser.getTicketById(id)
        if (option){
            choices.push({name:option.name,value:option.id})
        }
    })

    /**@type {[{name:String,value:String}]} */
    var msgchoices = []
    config.messages.forEach((msg) => {
        msgchoices.push({name:msg.id,value:msg.id})
    })

    var readystats = 0

    //process.stdout.write("[status] there are "+chalk.blue("0 out of 10")+" commands ready! (this can take up to 40 seconds)")
    if (!invisible){
        setInterval(() => {
            process.stdout.cursorTo(0)
            process.stdout.write("[status] there are "+chalk.blue(readystats+" out of 13")+" commands ready! (this can take up to 40 seconds)")
            if (readystats >= 13){
                console.log(chalk.green("\nready!"))
                console.log(chalk.blue("you can now start the bot with "+chalk.bgBlue("'npm start'")+"!"))
                process.exit(1)
            }
        },100)
    }

    const fs = require("fs")
    fs.writeFileSync("./storage/slashcmdEnabled.txt",require("../../package.json").version)

    //slashtranslation
    const ST = require("../../language/slashcmds/slash.json").data

    //create a ticket (/new or /ticket)
    client.application.commands.create({
        name:"ticket",
        description:"Create a ticket!",
        descriptionLocalizations:ST.newticket,
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
        descriptionLocalizations:ST.newticket,
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
        description:"View the available commands.",
        defaultPermission:true,
        descriptionLocalizations:ST.help,
        type:act.ChatInput
    },sid).then(() => {
        readystats++

    })

    //close
    client.application.commands.create({
        name:"close",
        description:"Close the current ticket.",
        defaultPermission:true,
        descriptionLocalizations:ST.close,
        type:act.ChatInput,
        options:[{
            name:"reason",
            type:discord.ApplicationCommandOptionType.String,
            required:false,
            description:"The reason to close this ticket.",
            maxLength:100
        }]
    },sid).then(() => {
        readystats++
    })

    //delete
    client.application.commands.create({
        name:"delete",
        description:"Delete the current ticket.",
        defaultPermission:true,
        descriptionLocalizations:ST.delete,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

    //msg
    client.application.commands.create({
        name:"message",
        description:"Create a ticket message.",
        defaultPermission:true,
        descriptionLocalizations:ST.message,
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
        descriptionLocalizations:ST.add,
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
        descriptionLocalizations:ST.remove,
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
        descriptionLocalizations:ST.rename,
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
        descriptionLocalizations:ST.reopen,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

    //claim
    client.application.commands.create({
        name:"claim",
        description:"Claim this ticket / claim it for someone else.",
        defaultPermission:true,
        type:act.ChatInput,
        options:[
            {
                name:"user",
                type:acot.User,
                required:false,
                description:"The user to claim for."
            }
        ]
        
    },sid).then(() => {
        readystats++
    })

    //unclaim
    client.application.commands.create({
        name:"unclaim",
        description:"Unclaim this ticket.",
        defaultPermission:true,
        type:act.ChatInput
    },sid).then(() => {
        readystats++
    })

    //category
    client.application.commands.create({
        name:"change",
        description:"Change ticket type.",
        defaultPermission:true,
        type:act.ChatInput,
        options:[
            {
                type:acot.String,
                name:"type",
                description:"The new ticket type.",
                required:true,
                choices:choices
            }
        ]
    },sid).then(() => {
        readystats++
    })

}