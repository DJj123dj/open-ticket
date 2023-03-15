const discord = require("discord.js")
const bot = require("../../index")
const client = require("../../index").client
const config = bot.config
const configParser = require("../utils/configParser")

const act = discord.ApplicationCommandType
const acot = discord.ApplicationCommandOptionType

module.exports = async () => {
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
    },sid)

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
    },sid)

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
    },sid)
}