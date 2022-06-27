const bot = require("../index")
const config = bot.config

/**
 * @param {Number} index
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"adminroles"|"channelprefix"|"category"|"message"|"enableDMMessage"|"ticketmessage"} value 
 */
exports.getTicketValue = (index,value) => {
    if (value == "id"){
        return "newT"+config.options[index][value]
    }
    return config.options[index][value]
}

/**
 * @param {Number} index
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"url"} value 
 */
 exports.getWebsiteValue = (index,value) => {
    return config.options[index][value]
}

/**
 * @param {Number} index
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"roles"|"mode"|"enableDMMessage"} value 
 */
exports.getRoleValue = (index,value) => {
    return config.options[index][value]
}

/**
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"adminroles"|"channelprefix"|"category"|"message"|"enableDMMessage"|"ticketmessage"} value 
 */
 exports.getTicketValues = (value) => {
    var result = []
    config.options.forEach((o) => {
        if (value == "id"){
            result.push("newT"+o[value])
        }else{
        result.push(o[value])
        }
     })
    return result
}

/**
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"url"} value 
 */
 exports.getWebsiteValues = (value) => {
    var result = []
    config.options.forEach((o) => {
        result.push(o[value])
     })
    return result
}

/**
 * @param {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"roles"|"mode"|"enableDMMessage""} value 
 */
exports.getRoleValues = (value) => {
    var result = []
    config.options.forEach((o) => {
        result.push(o[value])
     })
    return result
}

class TicketOptions {
    constructor() {
        this.id = ""
        this.name = ""
        this.description = ""
        this.icon = ""
        this.label = ""
        this.type = ""
        this.color = ""
        this.adminroles = ["",""]
        this.channelprefix = ""
        this.category = ""
        this.message = ""
        this.enableDMMessage = true
        this.ticketmessage = ""
    }
}
/**
 * 
 * @param {String} id 
 * @returns {TicketOptions|false}
 */
exports.getOptionsById = (id) => {
    var result = false
    config.options.forEach((option) => {
        if ("newT"+option.id == id){
            result = option
        }
    })
    return result
}

exports.exportedOptionClass = class {
    constructor() {
        this.id = ""
        this.name = ""
        this.description = ""
        this.icon = ""
        this.label = ""
        this.type = ""
        this.color = ""
        this.adminroles = ["",""]
        this.channelprefix = ""
        this.category = ""
        this.message = ""
        this.enableDMMessage = true
        this.ticketmessage = ""
    }
}