const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const getButton = require("./getButton")
const l = bot.language

/**
 * 
 * @param {String} id the id from an open-ticket embed
 * @returns {{embed:discord.EmbedBuilder,componentRows:discord.MessageActionRow[]}} discord embed
 */



exports.createEmbed = (id) => {
    bot.actionRecorder.push({
        category:"ot.managers.utils",
        file:"./core/utils/getEmbed.js",
        time:new Date().getTime(),
        type:"getembed"
    })
    //-----------------------------------
    //general importing
    const data = require("./configParser").getConfigMessage(id)
    /**@type {discord.ButtonBuilder[]}*/
    var buttons = []
    /**@type {import('./configParser').OTAllOptions[]} */
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
        .setTitle(data.name)
    
    try {
        const footerimg = (data.enableFooter && data.enableFooterImage) ? data.footerImage : undefined
        if (data.enableFooter) embed.setFooter({text:data.footer,iconURL:footerimg})
    }catch{
        bot.errorLog.log("info","FOOTER FAILED TO LOAD, probably invalid url!")
    }

    try {
        if (data.enableThumbnail) embed.setThumbnail(data.thumbnail)
    }catch{
        bot.errorLog.log("info","THUMBNAIL FAILED TO LOAD, probably invalid url!")
    }

    try {
        if (data.enableImage) embed.setImage(data.image)
    }catch{
        bot.errorLog.log("info","IMAGE FAILED TO LOAD, probably invalid url!")
    }

    if (data.enableCustomColor){
        embed.setColor(data.color)
    }else{
        embed.setColor(config.color)
    }

    if (data.other.embedTitleURL.enable) embed.setURL(data.other.embedTitleURL.url)

    var description = data.description
    if (data.other.enableTicketExplaination){
        const chooseCategoryMSG = data.other.customCategoryText.enable ? data.other.customCategoryText.text : l.messages.chooseATicket
        description = description+"\n\n__"+chooseCategoryMSG+"__\n"

        var ticketExplainations = []
        buttonData.forEach((button) => {
            var explaination = button.icon+" **"+button.name+":**\n"+button.description
            ticketExplainations.push(explaination)
        })

        description = description+ticketExplainations.join("\n\n")
    }

    if (data.other.enableMaxTicketsWarning){
        description = description+"\n\n"+l.commands.maxTicketWarning.replace("{0}",config.system.maxAmountOfTickets)
    }

    if (description) embed.setDescription(description)

    //-----------------------------------


    //-----------------------------------
    //create the components IF DROPDOWN IS FALSE
    if (!data.dropdown){
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

    //create the component IF DROPDOWN is true
    }else{
        const ids = data.options
        const customPlaceholder = data.other.customDropdownPlaceholder.enable ? data.other.customDropdownPlaceholder.text : false
        const dropdown = require("./getDropdown").getDropdown(ids,customPlaceholder)
        var componentRows = [
            new discord.ActionRowBuilder()
                .setComponents(dropdown)
        ]
    }
    //-----------------------------------



    //return everything
    /**
     * @type {{embed:discord.EmbedBuilder,componentRows:discord.MessageActionRow[]}}
     */
    const returnedData = {embed:embed,componentRows:componentRows}
    return returnedData
}