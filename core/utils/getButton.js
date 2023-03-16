const discord = require("discord.js")
const bot = require("../../index")
const config = bot.config
const l = bot.language

/**@returns {"DANGER"|"SUCCESS"|"PRIMARY"|"SECONDARY"} */
const getColor = (color) => {
    const b = discord.ButtonStyle
    if (color.toLowerCase() == "red"){
        return b.Danger
    }else if (color.toLowerCase() == "green"){
        return b.Success
    }else if (color.toLowerCase() == "blue" || color.toLowerCase() == "blurple"){
        return b.Primary
    }else if (color.toLowerCase() == "black" || color.toLowerCase() == "gray" || color.toLowerCase() == "grey"){
        return b.Secondary
    }else if (color == "DANGER" || color == "SECONDARY" || color == "SUCCESS" || color == "PRIMARY"){
        return color
    }else if (color.toLowerCase() == "none" || color.toLowerCase() == "false" || color.toLowerCase() == ""){
        return b.Secondary
    }else return b.Secondary
}

const getOption = (id) => {
    const result = config.options.find((option) => option.id == id)
    if (!result){return false}else return result
}
exports.getOption = getOption
/**
 * 
 * @param {String} id 
 * @returns {discord.ButtonBuilder|false}
 */
exports.getButton = (id) => {
    bot.actionRecorder.push({
        category:"ot.managers.utils",
        file:"./core/utils/getButton.js",
        time:new Date().getTime(),
        type:"getbutton"
    })
    const option = getOption(id)
    if (!option) return false
    if (option.type == "ticket"){
        var button = new discord.ButtonBuilder()
            .setCustomId("OTnewT"+option.id)
            .setDisabled(false)
            .setStyle(getColor(option.color))
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }else if (option.type == "website"){
        var button = new discord.ButtonBuilder()
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Link)
            .setURL(option.url)
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }else if (option.type == "role"){
        var button = new discord.ButtonBuilder()
            .setCustomId("newR"+option.id)
            .setDisabled(false)
            .setStyle(getColor(option.color))
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }

    return button
}