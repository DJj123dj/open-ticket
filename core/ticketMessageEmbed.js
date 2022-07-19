const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const getButton = require("./utils/getButton")
const l = bot.language

/**
 * 
 * @param {String} id the id from an open-ticket embed
 * @returns {{embed:discord.EmbedBuilder,componentRows:discord.MessageActionRow[]}} discord embed
 */



exports.createEmbed = (id) => {
    //-----------------------------------
    //general importing
    const data = require("./utils/getTicketMessages").getTicketMessage(id)
    /**@type {discord.ButtonBuilder[]}*/
    var buttons = []
    /**@type {getButton.rawButtonData[]} */
    var buttonData = []

    data.options.forEach((option) => {
        var button = getButton.getButton(option)
        var localButtonData = getButton.getOption(option)
        if (button) buttons.push(button)
        if (localButtonData) buttonData.push(localButtonData)
    })
    //-----------------------------------

    //-----------------------------------
    //create the embed
    const embed = new discord.EmbedBuilder()
        .setColor(data.color)
        .setTitle(data.name)
    if (data.enableFooter) embed.setFooter({text:data.footer})
    if (data.enableThumbnail) embed.setThumbnail(data.thumbnail)

    var description = data.description
    if (data.enableTicketExplaination){
        description = description+"\n\n__"+l.messages.chooseCategory+"__\n"

        var ticketExplainations = []
        buttonData.forEach((button) => {
            var explaination = button.icon+" **"+button.name+":**\n"+button.description
            ticketExplainations.push(explaination)
        })

        description = description+ticketExplainations.join("\n\n")
    }

    if (data.enableMaxTicketsWarning){
        description = description+"\n\n"+l.commands.maxTicketWarning.replace("{0}",config.system.max_allowed_tickets)
    }

    embed.setDescription(description)
    //-----------------------------------

    //-----------------------------------
    //create the components
    var AmountOfRows = Math.ceil(buttons.length / 4)
    var currentRow = 0

    /**
     * @type {discord.MessageActionRow[]}
     */
    var componentRows = []

    for (let i = AmountOfRows; i > 0; i--){

        componentRows.push(new discord.ActionRowBuilder())
    }

    buttons.forEach((button,index) => {
        componentRows[currentRow].addComponents([button])

        if (index == 3 || index == 7 ||  index == 11 ||  index == 15 ||  index == 19 ||  index == 23 ||  index == 27 ||  index == 31 ||  index == 35 ||  index == 39){
            currentRow = currentRow + 1
        }
    })
    //-----------------------------------



    //return everything
    /**
     * @type {{embed:discord.EmbedBuilder,componentRows:discord.MessageActionRow[]}}
     */
    const returnedData = {embed:embed,componentRows:componentRows}
    return returnedData
}


this.createEmbed()