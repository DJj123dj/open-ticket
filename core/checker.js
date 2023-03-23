exports.checker = async () => {
    const chalk = await (await import("chalk")).default

    if (process.argv.some((v) => v == "--nochecker")) return 
    if (process.argv.some((v) => v == "--devconfig")){
        //console.log(chalk.blue("=> used dev config instead of normal config"))
        try{
            var tempconfig = require("../devconfig.json")
        }catch(err){console.log(err);var tempconfig = require("../config.json")}
    }else{
        var tempconfig = require("../config.json")
    }

    const config = tempconfig
    var errorList = []
    var isError = false
    var warnList = []
    var isWarn = false
    const createError = (message) => {
        isError = true
        errorList.push("open-ticket CONFIG ERROR: "+message)
    }
    const createWarn = (message) => {
        isWarn = true
        warnList.push("open-ticket CONFIG WARNING: "+message)
    }

    //validators
    /**@param {"userid"|"roleid"|"channelid"|"serverid"|"categoryid"} mode @param {String} value @param {String} path */
    const checkDiscord = (mode,value,path) => {
        if (mode == "userid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this user id is invalid")
            }
        }else if (mode == "channelid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this channel id is invalid")
            }
        }else if (mode == "roleid"){    
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this role id is invalid")
            }
        }else if (mode == "serverid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this server id is invalid")
            }
        }else if (mode == "categoryid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this category id is invalid")
            }
        }
    }
    /**@param {String} value */
    const checkToken = (value) => {
        if (value.length < 40){
            createError("'token/value' | your token is invalid")
        }
        if (value.includes(" ")) createError("'token/value' | your token includes spaces!")
    }

    /**@param {String} value @param {String} path */
    const checkHexColor = (value,path) => {
        if (!/^#[a-fA-F0-9]{3,6}$/.test(value)){
            if (value.length < 4) return createError("'"+path+"' | hex color too short! (example: #123abc)")
            if (value.length > 7) return createError("'"+path+"' | hex color too long! (example: #123abc)")
            createError("'"+path+"' | invalid color! (example: #123abc)")
        }
    }

    /**@param {String} value @param {String} path */
    const checkEmbedColor = (value,path) => {
        if (!['DEFAULT','WHITE','AQUA','GREEN','BLUE','YELLOW','PURPLE','LUMINOUS_VIVID_PINK','FUCHSIA','GOLD','ORANGE','RED','GREY','DARKER_GREY','NAVY','DARK_AQUA','DARK_GREEN','DARK_BLUE','DARK_PURPLE','DARK_VIVID_PINK','DARK_GOLD','DARK_ORANGE','DARK_RED','DARK_GREY','LIGHT_GREY','DARK_NAVY','BLURPLE','GREYPLE','DARK_BUT_NOT_BLACK','NOT_QUITE_BLACK','RANDOM'].includes(value)){
            return createError("'"+path+"' | invalid color, must be a hex code or default color (more info in the wiki)")
        }
    }

    /**@param {String} value @param {String} path @param {Number} minLength @param {Number} maxLength @param {String} name */
    const checkString = (value,minLength,maxLength,path,name) => {
        if (value.length < minLength){
            createError("'"+path+"' | "+name+" is too short!")
        }else if (value.length > maxLength){
            createError("'"+path+"' | "+name+" is too long!")
        }
    }

    /**@param {"userid"|"roleid"|"channelid"|"serverid"} mode @param {String[]} arrayValue @param {String} path */
    const checkDiscordArray = (mode,arrayValue,path) => {
        if (!Array.isArray(arrayValue)){
            return createError("'"+path+"' | this needs to be an Array!")
        }
        if (mode == "userid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this user id is invalid")
                }
            })
        }else if (mode == "channelid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this channel id is invalid")
                }
            })
        }else if (mode == "roleid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this role id is invalid")
                }
            })
        }else if (mode == "serverid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this server id is invalid")
                }
            })
        }
    }
    /**@param {String} value @param {"string"|"boolean"|"number"|"array"|"object"} type */
    const checkType = (value,type,path) => {
        if (type == "boolean"){
            if (typeof value != "boolean"){
                createError("'"+path+"' | invalid type, this must be a boolean!")
                return true
            }else return false
        }else if (type == "number"){
            if (typeof value != "number"){
                createError("'"+path+"' | invalid type, this must be a number!")
                return true
            }else return false
        }else if (type == "string"){
            if (typeof value != "string"){
                createError("'"+path+"' | invalid type, this must be a string!")
                return true
            }else return false
        }else if (type == "array"){
            if (!Array.isArray(value)){
                createError("'"+path+"' | invalid type, this must be an array!")
                return true
            }else return false
        }else if (type == "object"){
            if (typeof value != "object"){
                createError("'"+path+"' | invalid type, this must be an object!")
                return true
            }else return false
        }else return false
    }

    const checkButtonColor = (value,path) => {
        if (value != "none" && value != "grey" && value != "gray" && value != "black" && value != "red" && value != "green" && value != "blue" && value != "blurple"){
            createError("'"+path+"' | invalid color, it must be one of these: none, gray, red, green, blue!")
        }
    }

    const configParser = require("./utils/configParser")
    /**
     * @param {configParser.OTAllOptions} option
     * @param {String} path
     */

    const checkOption = (option,path) => {

        //id
        checkType(option.id,"string",path+"/id")
        if (option.id.includes(" ")){
            createError("'"+path+"/id' | option id can't contain space characters!")
        }
        if (option.id.length > 20){
            createError("'"+path+"/id' | option id max lenght is 20!")
        }
        
        //name
        checkType(option.name,"string",path+"/name")
        if (option.name.length > 100){
            createWarn("'"+path+"/name' | if your name is too long it maybe doesn't look so good!")
        }else if (option.name.length < 1){
            createError("'"+path+"/name' | there is no name!")
        }

        //description
        checkType(option.description,"string",path+"/description")

        //icon
        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        if (option.icon.length > 0){

            const isEmoji = emojiRegex.test(option.icon)

            if (isEmoji == false){
                createError("'"+path+"/icon' | invalid emoji or custom discord emoji")
            }
        }
        checkType(option.icon,"string",path+"/icon")

        //label
        checkType(option.label,"string",path+"/label")
        if (option.label.length < 1 && option.icon.length < 1){
            createError("'"+path+"' | you need at least one of these: label, icon!")
        }

        //type
        checkType(option.type,"string",path+"/type")
        if (option.type != "ticket" && option.type != "website" && option.type != "role"){
            createError("'"+path+"/type' | the type must be one of these: ticket, website, role!")
        }
        /**@type {"ticket"|"website"|"role"} */
        const type = option.type

        if (type == "ticket"){
            //color
            checkType(option.color,"string",path+"/color")
            checkButtonColor(option.color,path+"/color")

            //adminroles
            checkType(option.adminroles,"array",path+"/adminroles")
            checkDiscordArray("roleid",option.adminroles,path+"/adminroles")
            
            //channelprefix
            checkType(option.channelprefix,"string",path+"/channelprefix")
            if (option.channelprefix.includes(" ")){
                createWarn("'"+path+"/channelprefix' | this prefix can't contain spaces!")
            }

            //category
            checkType(option.category,"string",path+"/category")
            if (option.category.length > 0){
                checkDiscord("categoryid",option.category,path+"/category")
            }

            //message
            checkType(option.message,"string",path+"/message")

            //enableDmOnOpen
            checkType(option.enableDmOnOpen,"boolean",path+"/enableDmOnOpen")

            //ticketmessage
            checkType(option.ticketmessage,"string",path+"/ticketmessage")

            //thumbnail
            if (option.thumbnail){
                checkType(option.thumbnail.enable,"boolean",path+"/thumbnail/enable")
                checkType(option.thumbnail.url,"string",path+"/thumbnail/url")
            }else{
                createError("'"+path+"/thumbnail' | there is no thumbnail object!")
            }

            //image
            if (option.image){
                checkType(option.image.enable,"boolean",path+"/image/enable")
                checkType(option.image.url,"string",path+"/image/url")
            }else{
                createError("'"+path+"/image' | there is no image object!")
            }

            //closedCategory
            if (option.closedCategory){
                checkType(option.closedCategory.enable,"boolean",path/"/closedCategory/enable")
                checkType(option.closedCategory.id,"string",path/"/closedCategory/id")
                if (option.closedCategory.enable){
                    checkDiscord("roleid",option.closedCategory.id,path+"/closedCategory/id")
                }
            }else{
                createError("'"+path+"/closedCategory' | there is no closedCategory object!")
            }

            //autoclose
            if (option.autoclose){
                checkType(option.autoclose.enable,"boolean",path/"/autoclose/enable")
                checkType(option.autoclose.inactiveHours,"number",path/"/autoclose/id")
            }else{
                createError("'"+path+"/autoclose' | there is no autoclose object!")
            }

        }else if (type == "website"){
            //url
            checkType(option.url,"string",path+"/url")
            if (option.url.includes(" ")){
                createWarn("'"+path+"/url' | a url can't contain spaces")
            }
            if (option.url.length < 1){
                createError("'"+path+"/url' | there is no url!")
            }
            if (!option.url.startsWith("https://") && !option.url.startsWith("http://") && !option.url.startsWith("discord://")){
                createWarn("'"+path+"/url' | your url doesn't start with https or http!")
            }
            if (option.url.startsWith("http://")){
                createWarn("'"+path+"/url' | your url is not a HTTPS link! discord can block this url!")
            }
        }else if (type == "role"){
            //color
            checkType(option.color,"string",path+"/color")
            checkButtonColor(option.color,path+"/color")

            //roles
            checkDiscordArray("roleid",option.roles,path+"/roles")

            //mode
            checkType(option.mode,"string",path+"/mode")
            if (option.mode != "add&remove" && option.mode != "add" && option.mode != "remove"){
                createError("'"+path+"/mode' | mode must be one of these: add, remove, add&remove")
            }

            //enableDmOnOpen
            checkType(option.enableDmOnOpen,"boolean",path+"/enableDmOnOpen")
        }
    }

    /**
     * 
     * @param {configParser.OTConfigMessage} input 
     * @param {String} path 
     */
    const checkMessage = (input,path) => {
        //id
        if (!input.id) createError("'"+path+"/id' | this embed doesn't have an id!")
        if (input.id.length > 50) createError("'"+path+"/id' | the id can't be longer than 50")
        if (input.id.includes(" ") || input.id.includes("\n")) createError("'"+path+"/id' | the id can't contain spaces!")

        //name
        if (input.name.length < 1){
            createWarn("'"+path+"/name' | this embed has no name!")
        }else if (input.name.length > 99) {
            createError("'"+path+"/name' | the name can't be longer than 100")
        }

        //description
        if (input.description.length < 0){
            createWarn("'"+path+"/description' | this embed doesn't have a description!")
        }

        //dropdown
        checkType(input.dropdown,"boolean",path+"/dropdown")

        //footer
        checkType(input.enableFooter,"boolean",path+"/enableFooter")
        if (input.enableFooter){
            if (input.footer.length < 1) createError("'"+path+"/footer' | no footer!")
            if (input.footer.length > 200) createError("'"+path+"/footer' | footer length can't be more than 200!")
        }

        //thumbnail
        checkType(input.enableThumbnail,"boolean",path+"/enableThumbnail")
        if (input.enableThumbnail){
            if (input.thumbnail.length < 1) createError("'"+path+"/thumbnail' | no thumbnail url!")
        }

        //customColor
        checkType(input.enableCustomColor,"boolean",path+"/enableCustomColor")
        if (input.enableCustomColor){
            if (input.color.length < 1) createError("'"+path+"/color' | no color!")
            checkHexColor(input.color,path+"/color")
        }

        //OPTIONS!!!
        if (checkType(input.options,"array",path+"/options")){
            var counter = 0
            input.options.forEach((option) => {if (!configParser.optionExists(option)){counter++}})

            if (counter == input.options.length){
                createWarn("'"+path+"/options' | insert the option ids here!")
            }else{
                input.options.forEach((option,index) => {
                    if (!configParser.optionExists(option)){
                        createWarn("'"+path+"/options:"+index+"' | this option doesnt exist!")
                    }
                })
            }
        }

        //other
        //ticket explaination & max tickets warning
        if (typeof input.other != "object"){
            createError("'"+path+"/other' | this object doesn't exist!")
        }else{
            checkType(input.other.enableTicketExplaination,"boolean",path+"/other/enableTicketExplaination")
            checkType(input.other.enableMaxTicketsWarning,"boolean",path+"/other/enableMaxTicketsWarning")

            //customDropdownPlaceholder
            if (typeof input.other.customDropdownPlaceholder != "object"){
                createError("'"+path+"/other/customDropdownPlaceholder' | this object doesn't exist!")
            }else{
                checkType(input.other.customDropdownPlaceholder.enable,"boolean",path+"/other/customDropdownPlaceholder/enable")
                checkType(input.other.customDropdownPlaceholder.text,"string",path+"/other/customDropdownPlaceholder/text")
                if (input.other.customDropdownPlaceholder.enable && input.other.customDropdownPlaceholder.text.length < 1){createError("'"+path+"/other/customDropdownPlaceholder/text' | there is no placeholder text!")}
            }

            //customCategoryText
            if (typeof input.other.customCategoryText != "object"){
                createError("'"+path+"/other/customCategoryText' | this object doesn't exist!")
            }else{
                checkType(input.other.customCategoryText.enable,"boolean",path+"/other/customCategoryText/enable")
                checkType(input.other.customCategoryText.text,"string",path+"/other/customCategoryText/text")
                if (input.other.customCategoryText.enable && input.other.customCategoryText.text.length < 1){createError("'"+path+"/other/customCategoryText/text' | there is no category text!")}
            }

            //embedTitleURL
            if (typeof input.other.embedTitleURL != "object"){
                createError("'"+path+"/other/embedTitleURL' | this object doesn't exist!")
            }else{
                checkType(input.other.embedTitleURL.enable,"boolean",path+"/other/embedTitleURL/enable")
                checkType(input.other.embedTitleURL.url,"string",path+"/other/embedTitleURL/text")
                if (input.other.embedTitleURL.enable && input.other.embedTitleURL.url.length < 1){createError("'"+path+"/other/embedTitleURL/url' | there is no url!")}
            }
        }
    }

    //--------------------------|
    //--------------------------|
    //checker => START HERE     |
    //--------------------------|
    //--------------------------|

    var configArray = ["color","serverId","token","adminRoles","prefix","languageFile","status","system","options","messages"]
    configArray.forEach((item) => {
        if (config[item] == undefined){
            throw new Error("\n\nMAIN ERROR: the item '"+item+"' doesn't exist in config.json")
        }
    })
    
    checkHexColor(config.color,"main_color")
    checkDiscord("serverid",config.serverId,"server_id")

    if (!require("./api/api.json").disable.checkerjs.token && !config.token.fromENV) checkToken(config.token.value)

    checkType(config.adminRoles,"array","/main_adminroles")
    checkDiscordArray("roleid",config.adminRoles,"main_adminroles")
    checkString(config.prefix,1,15,"prefix","prefix")
    //languagefile
    checkType(config.languageFile,"string","languagefile")
    const lf = config.languageFile
    
    if (!lf.startsWith("custom") && !lf.startsWith("english") && !lf.startsWith("dutch") && !lf.startsWith("romanian") && !lf.startsWith("german") && !lf.startsWith("arabic") && !lf.startsWith("spanish") && !lf.startsWith("portuguese") && !lf.startsWith("french") && !lf.startsWith("italian") && !lf.startsWith("czech") && !lf.startsWith("danish") && !lf.startsWith("russian") && !lf.startsWith("turkish") && !lf.startsWith("polish") && !lf.startsWith("slovenian")){
        createError("'languagefile' | invalid language, more info in the wiki")
    }

    //status:
        checkType(config.status.enabled,"boolean","status/enabled")
        if (config.status.enabled){
            if (config.status.type != "PLAYING" && config.status.type != "LISTENING" && config.status.type != "WATCHING"){
                createError("'status/type' | not a valid status type! (LISTENING,WATCHING,PLAYING)")
            }
            if (config.status.text.length < 1){
                createError("'status/text' | there is no status text!")
            }
            if (config.status.text.length > 50) createError("'status/text' | text too long!")
        }

    
    //system:
        //max tickets
        checkType(config.system.maxAmountOfTickets,"number","system/maxAmountOfTickets")

        //enableDMmessages
        checkType(config.system.dmMessages,"boolean","system/dmMessages")

        //memberRole
        checkType(config.system.memberRole,"string","system/memberRole")
        if (config.system.memberRole && ![" ","0","false","null","undefined"].includes(config.system.memberRole)){
            checkDiscord("roleid",config.system.memberRole,"system/memberRole")
        }else{
            createWarn("'system/memberRole' | You don't have a member role, but it's recommended!")
        }

        //closemode
        checkType(config.system.closeMode,"string","system/closeMode")
        if (!["normal","adminonly"].includes(config.system.closeMode)){
            createError("'system/closeMode' | the close mode must be adminonly or normal")
        }

        checkType(config.system.showSlashcmdsInHelp,"boolean","system/showSlashcmdsInHelp")
        checkType(config.system.answerInEphemeralOnOpen,"boolean","system/answerInEphemeralOnOpen")

    //options

    config.options.forEach((option,index) => {
        checkOption(option,"options/"+index)
    })

    //messages
    config.messages.forEach((message,index) => {
        checkMessage(message,"messages/"+index)
    })


    //the end
    if (errorList.length > 0 || warnList.length > 0){
        console.log("REPORT:\n===========================")
    }
    warnList.forEach((w) => {
        const splitw = w.split("'")
        if (splitw.length > 1){
            var splitstring = chalk.yellow(splitw[0])+chalk.blue("'"+splitw[1]+"'")+chalk.yellow(splitw[2])
            if (splitw[3]){splitstring = splitstring+chalk.yellow(splitw[3])}
            if (splitw[4]){splitstring = splitstring+chalk.yellow(splitw[4])}
            if (splitw[5]){splitstring = splitstring+chalk.yellow(splitw[5])}
        }else {var splitstring = chalk.yellow(splitw[0])}
        console.log(splitstring)
    })
    errorList.forEach((e) => {
        const splite = e.split("'")
        if (splite.length > 1){
            var splitstring = chalk.red(splite[0])+chalk.blue("'"+splite[1]+"'")+chalk.red(splite[2])
        }else {var splitstring = chalk.red(splite[0])}
        console.log(splitstring)
    })
    if (isError){
        console.log("===========================")
        console.log("=> "+chalk.bgRed("your bot doesn't work if you don't fix the above errors!"))
        if (isWarn){
            console.log("\n=> "+chalk.bgYellow("if you ignore warns, some things may work differently than expected!"))
        }
        process.exit(0)
    }else if (isWarn == true && isError == false){
        console.log("===========================")
        console.log("=> "+chalk.bgYellow("if you ignore warns, some things may work differently than expected!"))
    }

}
