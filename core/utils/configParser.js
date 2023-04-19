const bot = require("../../index")
const config = bot.config
const l = bot.language

//TYPEDEFS:
//==================

//OTTicketOptions
/**@typedef {{id: String,name: String,description: String,icon: String,label: String,type: "ticket"|"role"|"website",color: "red"|"green"|"blue"|"gray",adminroles: String[], readonlyAdminroles: String[], channelprefix: String,category: String,message: String,enableDmOnOpen: Boolean,ticketmessage: String, thumbnail:{enable:Boolean,url:String}, image:{enable:Boolean,url:String}, closedCategory:{enable:Boolean,id:String}, autoclose:{enable:Boolean,inactiveHours:Number} }} OTTicketOptions */

//OTRoleOptions
/**@typedef {{id: String,name: String,description: String,icon: String,label: String,type: "ticket"|"role"|"website",color:"red"|"green"|"blue"|"gray"|"none",roles:String[],mode:"add&remove"|"remove"|"add",enableDmOnOpen:Boolean}} OTRoleOptions */

//OTWebsiteOptions
/**@typedef {{id: String,name: String,description: String,icon: String,label: String,type: "ticket"|"role"|"website",url:String}} OTWebsiteOptions */


//OTConfigMessage
/**@typedef {{id: string, name: string, description: string, dropdown: boolean, enableFooter: boolean, footer: string, enableFooterImage: boolean, footerImage: string, enableThumbnail: boolean, thumbnail: string, enableImage: boolean, image: string, enableCustomColor: boolean, color: string, options: string[], other:{enableTicketExplaination: boolean, enableMaxTicketsWarning: boolean, customDropdownPlaceholder:{enable:Boolean,text:String}, customCategoryText:{enable:Boolean,text:String}, embedTitleURL:{enable:Boolean,url:String} } }} OTConfigMessage*/

//OTAllOptions
/**@typedef {{id: String,name: String,description: String,icon: String,label: String,type: "ticket"|"role"|"website",color:"red"|"green"|"blue"|"gray"|"none",roles:String[],mode:"add&remove"|"remove"|"add",adminroles: String[],channelprefix: String,category: String,message: String,enableDmOnOpen: Boolean,ticketmessage: String, thumbnail:{enable:Boolean,url:String}, image:{enable:Boolean,url:String}, url:String, closedCategory:{enable:Boolean,id:String}, autoclose:{enable:Boolean,inactiveHours:Number}, readonlyAdminroles: String[]}} OTAllOptions */

//StringOptions
/**@typedef {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"adminroles"|"channelprefix"|"category"|"message"|"enableDmOnOpen"|"ticketmessage"|"thumbnail"|"image"|"closedCategory"|"adminroles"|"autoclose"} OTTicketStringOptions */
/**@typedef {"id"|"name"|"description"|"icon"|"label"|"type"|"color"|"roles"|"mode"|"enableDmOnOpen"} OTRoleStringOptions */
/**@typedef {"id"|"name"|"description"|"icon"|"label"|"type"|"url"} OTWebsiteStringOptions */

//FUNCTIONS:
//==================

/** @param {String} id the id of the embed @returns {OTConfigMessage}*/
exports.getConfigMessage = (id) => {
    var returned = config.messages.find(a => a.id == id)
    if (returned){
        return returned
    }
    var result = config.messages[0]
    if (!result){
        throw new Error("'messages' object in config.json is empty")
        return
    }
    return result
}

/**
 * 
 * @param {String} id 
 * @param {Boolean} withoutOTnewT
 * @returns {OTTicketOptions|false}
 */
 exports.getTicketById = (id,withoutOTnewT) => {
    var result = false
    if (withoutOTnewT){
        config.options.forEach((option) => {
            if (option.id == id && option.type == "ticket"){
                result = option
            }
        })
    }else{
        config.options.forEach((option) => {
            if ("OTnewT"+option.id == id && option.type == "ticket"){
                result = option
            }
        })
    }
    return result
}

/**
 * 
 * @param {String} id 
 * @param {Boolean} withoutOTnewR
 * @returns {OTRoleOptions|false}
 */
 exports.getRoleById = (id,withoutOTnewR) => {
    var result = false
    if (withoutOTnewR){
        config.options.forEach((option) => {
            if (option.id == id && option.type == "role"){
                result = option
            }
        })
    }else{
        config.options.forEach((option) => {
            if ("OTnewR"+option.id == id && option.type == "role"){
                result = option
            }
        })
    }
    return result
}

/**
 * 
 * @param {String} id 
 * @returns {OTWebsiteOptions|false}
 */
 exports.getWebsiteById = (id) => {
    var result = false
    config.options.forEach((option) => {
        if (option.id == id && option.type == "website"){
            result = option
        }
    })
    return result
}

/**
 * @param {OTTicketStringOptions} value 
 * @returns {String[]}
 */
exports.getTicketValuesArray = (value,idWithoutOTnewT) => {
    var result = []
    const prefix = idWithoutOTnewT ? "" : "OTnewT"
    config.options.forEach((opt) => {
        if (opt.type == "ticket"){
            if (value == "id"){
                result.push(prefix+opt[value])
            }else{
                result.push(opt[value])
            }
        }
     })
    return result
}

/**
 * @param {OTRoleStringOptions} value 
 * @returns {String[]}
 */
 exports.getRoleValuesArray = (value,idWithoutOTnewR) => {
    var result = []
    const prefix = idWithoutOTnewR ? "" : "OTnewR"
    config.options.forEach((opt) => {
        if (o.type == "role"){
            if (value == "id"){
                result.push(prefix+opt[value])
            }else{
                result.push(opt[value])
            }
        }
     })
    return result
}

/**
 * @param {OTWebsiteStringOptions} value 
 * @returns {String[]}
 */
 exports.getWebsiteValuesArray = (value) => {
    var result = []
    config.options.forEach((opt) => {
        if (o.type == "website"){
                result.push(opt[value])
        }
     })
    return result
}

/**@type {OTTicketOptions} */
this.ticketType = {}

/**@type {OTRoleOptions} */
this.roleType = {}

/**@type {OTWebsiteOptions} */
this.websiteType = {}

/**@type {OTConfigMessage} */
this.messageType = {}



/**
 * 
 * @param {String} id 
 * @returns {Boolean}
 */
 exports.optionExists = (id) => {
    var result = false
    config.options.forEach((option) => {
        if (option.id == id){
            result = true
        }
    })
    return result
}