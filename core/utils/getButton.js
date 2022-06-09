const discord = require("discord.js")
const bot = require("../../index")
const config = bot.config
const getoptions = require("../getoptions")

/**@returns {"DANGER"|"SUCCESS"|"PRIMARY"|"SECONDARY"} */
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

const getOption = (id) => {
    const result = config.options.find((option) => option.id == id)
    if (!result){return false}else return result
}
exports.getOption = getOption
/**
 * 
 * @param {String} id 
 * @returns {discord.MessageButton|false}
 */
exports.getButton = (id) => {
    const option = getOption(id)
    if (!option) return false
    if (option.type == "ticket"){
        var button = new discord.MessageButton()
            .setCustomId("newT"+option.id)
            .setDisabled(false)
            .setStyle(getColor(option.color))
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }else if (option.type == "website"){
        var button = new discord.MessageButton()
            .setDisabled(false)
            .setStyle("LINK")
            .setURL(option.url)
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }else if (option.type == "role"){
        var button = new discord.MessageButton()
            .setCustomId("newR"+option.id)
            .setDisabled(false)
            .setStyle(getColor(option.color))
        
        if (option.label){button.setLabel(option.label)}
        if (option.icon){button.setEmoji(option.icon)}
        if (!option.label && !option.icon){button.setLabel("no label or emoji")}

    }

    return button
}


exports.rawButtonData = class {
    constructor() {
        this.id = ""
        this.name = ""
        this.description = ""
        this.icon = ""
        this.label = ""
        this.type = ""

        this.color = ""
        this.enableDMMessage = true
        this.url = ""
        this.roles = ["",""]
        this.mode = ""
        this.adminroles = ["",""]
        this.channelprefix = ""
        this.category = ""
        this.message = ""
        this.ticketmessage = ""
        
    }
}