const discord = require("discord.js")
const bot = require("../../index")
const config = bot.config
const l = bot.language

const configParser = require("./configParser")
/**
 * 
 * @param {String[]} ids
 * @param {String|undefined|false} placeholder
 * @returns {discord.StringSelectMenuBuilder|false}
 */
exports.getDropdown = (ids,placeholder) => {
    bot.actionRecorder.push({
        category:"ot.managers.utils",
        file:"./core/utils/getDropdown.js",
        time:new Date().getTime(),
        type:"getdropdown"
    })
    const dropdown = new discord.StringSelectMenuBuilder()
        .setCustomId("OTdropdownMenu")
        .setDisabled(false)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder(placeholder || l.messages.chooseATicket)
        .addOptions(
            new discord.StringSelectMenuOptionBuilder()
                .setDefault(true)
                .setLabel(placeholder || l.messages.chooseATicket)
                .setValue("OTChooseTicket")
        )
        
    ids.forEach((id) => {
        const option = configParser.getTicketById(id,true)
        const roleoption = configParser.getRoleById(id,true)
        if (option){
            const selectComponent = new discord.StringSelectMenuOptionBuilder()
            .setDefault(false)
            .setValue("OTnewT"+option.id)

            if (!option.label && !option.icon){
                selectComponent.setLabel("OT ERROR: no description/emoji")
            }else{
                if (option.label) selectComponent.setLabel(option.label)
                if (option.icon) selectComponent.setEmoji(option.icon)
                if (option.description) selectComponent.setDescription(option.description)
            }

            dropdown.addOptions(selectComponent)

        }else if (roleoption){
            const selectComponent = new discord.StringSelectMenuOptionBuilder()
            .setDefault(false)
            .setValue("OTnewR"+roleoption.id)

            if (!roleoption.label && !roleoption.icon){
                selectComponent.setLabel("OT ERROR: no description/emoji")
            }else{
                if (roleoption.label) selectComponent.setLabel(roleoption.label)
                if (roleoption.icon) selectComponent.setEmoji(roleoption.icon)
            }

            dropdown.addOptions(selectComponent)
        }
        
    })
    

    return dropdown
}