const discord = require("discord.js")
const bot = require("../../index")
const config = bot.config
const l = bot.language

const configParser = require("./configParser")
/**
 * 
 * @param {String[]} ids
 * @returns {discord.SelectMenuBuilder|false}
 */
exports.getDropdown = (ids) => {
    const dropdown = new discord.SelectMenuBuilder()
        .setCustomId("OTdropdownMenu")
        .setDisabled(false)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Choose a ticket")
        .addOptions(
            new discord.SelectMenuOptionBuilder()
                .setDefault(true)
                .setLabel("Choose a ticket")
                .setValue("OTChooseTicket")
        )
        
    ids.forEach((id) => {
        const option = configParser.getTicketById(id,true)
        if (option){
            const selectComponent = new discord.SelectMenuOptionBuilder()
            .setDefault(false)
            .setValue("OTnewT"+option.id)

            if (!option.label && !option.icon){
                selectComponent.setLabel("OT ERROR: no description/emoji")
            }else{
                if (option.label) selectComponent.setLabel(option.label)
                if (option.icon) selectComponent.setEmoji(option.icon)
            }

            dropdown.addOptions(selectComponent)
        }
    })
    

    return dropdown
}