/** =============================
 ** NOT READY YET
 ** =============================*/

module.exports = async () => {
    const chalk = await (await import("chalk")).default
    const config = require("../config.json")
    var errorList = []
    var isError = false
    var warnList = []
    var isWarn = false
    const createError = (message) => {
        isError = true
        errorList.push("open-ticket ERROR: "+message)
    }
    const createWarn = (message) => {
        isWarn = true
        warnList.push("open-ticket WARNING: "+message)
    }

    //checker

    //token
    if (config.auth_token.includes(" ")){
        createError("invalid token | there are spaces in your token!")
    }
    if (config.auth_token.length < 40){
        createError("invalid token | length not correct!")
    }

    //color
    if (!config.main_color.startsWith("#")){
        createError("color not detected | 'main_color' doesn't start with a '#'!")
    }
    if (config.main_color.length > 7 || config.main_color.length < 7){
        createError("color not detected | 'main_color' is not a valid hex color!")
    }

    //admin
    if (config.botperms_role.includes(" ")){
        createError("invalid role id | 'botperms_role' is not a valid role id!")
    }
    if (config.botperms_role.length > 20|| config.botperms_role.length < 16){
        createError("invalid role id | 'botperms_role' is not a valid role id!")
    }

    //prefix
    if (config.prefix == ""){
        createError("no prefix | 'prefix' is empty!")
    }
    if (config.prefix.length > 3){
        createWarn("long prefix | your prefix is a little bit long!")
    }

    //status
    if (config.status.enabled && (config.status.type != "PLAYING" && config.status.type != "LISTENING" && config.status.type != "WATCHING" && config.status.type != "CUSTOM")){
        createError("status error | 'status/type' is invalid!")
    }
    if (config.status.enabled && config.status.text.length < 1){
        createError("status error | 'status/text' must be at least 1 character long!")
    }

    //ticketchannel
    if (config.system.ticket_channel.includes(" ")){
        createWarn("invalid channel id | 'system/ticket_channel' is not a valid channel id!")
    }
    if (config.system.ticket_channel.length < 1){
        createWarn("no ticket channel | 'system/ticket_channel' is empty")
    }else if (config.system.ticket_channel.length > 20|| config.system.ticket_channel.length < 16){
        createWarn("invalid channel id | 'system/ticket_channel' is not a valid channel id!")
    }

    //maxticket
    if (config.system.max_allowed_tickets < 1){
        createWarn("no tickets | if 'system/max_allowed_tickets' is under 1 you can't create any ticket")
    }

    //category
    if (config.system.enable_category == true && config.system.ticket_category.includes(" ")){
        createError("invalid category id | 'system/ticket_category' is not a valid category id!")
    }
    if (config.system.enable_category && config.system.ticket_category.length > 20 || config.system.ticket_category.length < 16){
        createError("invalid category id | 'system/ticket_category' is not a valid category id!")
    }

    //everyoneaccess
    if (config.system["has@everyoneaccess"] == true){
        createWarn("access | everyone has access to the tickets!")
    }

    //memberrole
    if (config.system.member_role.includes(" ")){
        createError("invalid role id | 'system/member_role' is not a valid role id!")
    }
    if (config.system.member_role.length > 20){
        createError("invalid role id | 'system/member_role' is not a valid role id!")
    }
    if (config.system.member_role == "" || config.system.member_role == " " || config.system.member_role == "false" || config.system.member_role == "null" || config.system.member_role == "0"){
        createWarn("no member role | 'system/member_role' is not valid so technically everyone can view a ticket!")
    }

    //transcript
    if (config.system.enable_transcript && config.system.transcript_channel.includes(" ")){
        createError("invalid channel id | 'system/transcript_channel' is not a valid channel id!")
    }
    if (config.system.enable_transcript && config.system.transcript_channel.length > 20 || config.system.transcript_channel.length < 16){
        createError("invalid channel id | 'system/transcript_channel' is not a valid channel id!")
    }

    //messages
    if (config.messages.general.nopermissions.length < 1){
        createError("no message | 'messages/general/nopermissions' is empty!")
    }
    if (config.messages.ticket.newTicketEmbed.length < 1){
        createError("no message | 'messages/ticket/newTicketEmbed' is empty!")
    }
    if (config.messages.dm.alreadyCreated.length < 1){
        createError("no message | 'messages/dm/alreadyCreated' is empty!")
    }
    if (config.messages.dm.newTicket.length < 1){
        createError("no message | 'messages/dm/newTicket' is empty!")
    }
    if (config.messages.dm.closeTicket.length < 1){
        createError("no message | 'messages/dm/closeTicket' is empty!")
    }

    //layout
    const checkLayout = (layout,layoutname,color,footer,thumbnail) => {
        if (color){
            if (!layout.customColor.startsWith("#")){
                createError("color not detected | 'layout/"+layoutname+"/customColor' doesn't start with a '#'!")
            }
            if (layout.customColor.length > 7 || layout.customColor.length < 7){
                createError("color not detected | 'layout/"+layoutname+"/customColor' is not a valid hex color!")
            }
        }
        if (footer){
            if (layout.footer.length < 1){
                createError("no footer | 'layout/"+layoutname+"/footer' doesn't have a footer!")
            }
        }
        if (thumbnail){
            if (!layout.thumbnailURL.startsWith("https://") && !layout.thumbnailURL.startsWith("http://")){
                createError("thumbnail | the thumbnail url in 'layout/"+layoutname+"/thumbnailURL' is not a valid url!")
            }
        }
    }
    checkLayout(config.layout.ticketEmbed,"ticketEmbed",config.layout.ticketEmbed.customColorEnabled,config.layout.ticketEmbed.footerEnabled,config.layout.ticketEmbed.thumbnailEnabled)
    checkLayout(config.layout.ticketMsg,"ticketMsg",config.layout.ticketMsg.customColorEnabled,config.layout.ticketMsg.footerEnabled,config.layout.ticketMsg.thumbnailEnabled)
    checkLayout(config.layout.transcripts,"transcripts",config.layout.transcripts.customColorEnabled,false,config.layout.transcripts.thumbnailEnabled)

    const checkOption = (ticket,ticketname,enabled,urlmode) => {
        if (enabled){
            if (ticket.icon.length > 0){
                const emojiRegex = /\p{Emoji}/u
                const isEmoji = emojiRegex.test(ticket.icon)
                if (isEmoji == false){
                    createWarn("invalid emoji | 'options/"+ticketname+"/icon' is not a valid emoji (code can be wrong)")
                }
            }
            if (ticket.description.length < 1){
                createWarn("no description | 'options/"+ticketname+"/description' is empty")
            }
            if (ticket.name.length < 1){
                createWarn("no description | 'options/"+ticketname+"/name' is empty")
            }
            if (ticket.channel_prefix.length < 1){
                createWarn("no description | 'options/"+ticketname+"/channel_prefix' is empty")
            }
            if (ticket.isURL == true && ticket.color != "red" && ticket.color != "blue" && ticket.color != "green" && ticket.color != "gray" && ticket.color != "none"){
                createWarn("invalid button color | 'options/"+ticketname+"/color' must be one of (red,green,blue,gray,none)")
            }

            if (urlmode && (!ticket.url.startsWith("https://") && !ticket.url.startsWith("http://"))){
                createError("url invalid | the url in 'options/"+ticketname+"/url' is not a valid url!")
            }
        }
        return
    }

    checkOption(config.options.ticket1,"ticket1",config.options.ticket1.enabled,config.options.ticket1.isURL)
    checkOption(config.options.ticket2,"ticket2",config.options.ticket2.enabled,config.options.ticket2.isURL)
    checkOption(config.options.ticket3,"ticket3",config.options.ticket3.enabled,config.options.ticket3.isURL)
    checkOption(config.options.ticket4,"ticket4",config.options.ticket4.enabled,config.options.ticket4.isURL)
    checkOption(config.options.ticket5,"ticket5",config.options.ticket5.enabled,config.options.ticket5.isURL)
    checkOption(config.options.ticket6,"ticket6",config.options.ticket6.enabled,config.options.ticket6.isURL)

    //the end
    if (errorList.length > 0 || warnList.length > 0){
        console.log("REPORT:\n===========================")
    }
    warnList.forEach((w) => {
        const splitw = w.split("'")
        if (splitw.length > 1){
            var splitstring = chalk.yellow(splitw[0])+chalk.blue("'"+splitw[1]+"'")+chalk.yellow(splitw[2])
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