const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")
const getOptions = require("./getoptions")
const getbyId = getOptions.getOptionsById

/**
 * 
 * @param {String} id the id from an open-ticket embed
 * @returns {{embed:discord.MessageEmbed,componentRows:discord.MessageActionRow[]}} discord embed
 */



exports.createEmbed = (id) => {
    //general importing
    const data = require("./utils/getTicketMessages").getTicketMessage(id)
    /**@type {getOptions.exportedOptionClass[]}*/
    var buttons = []

    data.options.forEach((option) => {
        var optionIdStats = getbyId("newT"+option)

        if (!optionIdStats){
            var optionIdStats = {
                id:"NOTICKET",
                name:"ERROR",
                description:"There is a ticket in your config.json/messages that doesn't exist.",
                icon:"",
                label:"ERROR",
                type:"ticket",
                color:"red",
                adminroles:["0"],
                channelprefix:"error-",
                category:"",
                message:"ERROR!",
                enableDMMessage:false
                
            }
            return
        }
        buttons.push(optionIdStats)
    })

    //create the embed
    const embed = new discord.MessageEmbed()
        .setColor(data.color)
        .setTitle(data.name)
    if (data.enableFooter) embed.setFooter({text:data.footer})
    if (data.enableThumbnail) embed.setThumbnail(data.thumbnail)

    var description = data.description
    if (data.enableTicketExplaination){
        description = description+"\n\n__choose a category:__\n"

        var ticketExplainations = []
        buttons.forEach((button) => {
            var explaination = button.icon+" **"+button.name+":**\n"+button.description
            ticketExplainations.push(explaination)
        })

        description = description+ticketExplainations.join("\n\n")
    }

    if (data.enableMaxTicketsWarning){
        description = description+"\n\n**Warning:** _You can only create "+config.system.max_allowed_tickets+" ticket(s) at a time!_"
    }

    embed.setDescription(description)

    //create the components
    var AmountOfRows = Math.ceil(buttons.length / 4)
    var currentRow = 0

    /**
     * @type {discord.MessageActionRow[]}
     */
    var componentRows = []

    for (let i = AmountOfRows; i > 0; i--){

        componentRows.push(new discord.MessageActionRow())
    }

    const getColor = (color) => {
        if (color.toLowerCase() == "red"){
            return "DANGER"
        }else if (color.toLowerCase() == "green"){
            return "SUCCESS"
        }else if (color.toLowerCase() == "blue" || color.toLowerCase() == "blurple"){
            return "PRIMARY"
        }else if (color.toLowerCase() == "black" || color.toLowerCase() == "gray" || color.toLowerCase() == "grey"){
            return "SECONDARY"
        }else if (color == "DANGER" || color == "SECONDARY" || color == "SUCCESS" || color == "PRIMARY"){
            return color
        }else if (color.toLowerCase() == "none" || color.toLowerCase() == "false" || color.toLowerCase() == ""){
            return "SECONDARY"
        }else return "SECONDARY"
    }

    buttons.forEach((button,index) => {
        if (button.label){var label = button.label}else{var label = null}
        if (button.icon){var icon = button.icon}else{var icon = null}

        var color = getColor(button.color)

        componentRows[currentRow].addComponents([
            new discord.MessageButton()
                .setCustomId("newT"+button.id)
                .setLabel(label)
                .setEmoji(icon)
                .setStyle(color)
                .setDisabled(false)
        ])

        if (index == 3 || index == 7 ||  index == 11 ||  index == 15 ||  index == 19 ||  index == 23 ||  index == 27 ||  index == 31 ||  index == 35 ||  index == 39){
            currentRow = currentRow + 1
        }
    })



    //return everything
    /**
     * @type {{embed:discord.MessageEmbed,componentRows:discord.MessageActionRow[]}}
     */
    const returnedData = {embed:embed,componentRows:componentRows}
    return returnedData
}


this.createEmbed()