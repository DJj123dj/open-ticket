const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage
const tsconfig = bot.tsconfig

/**
 * 
 * @param {String} name 
 * @param {String} id 
 * @param {Number} rawprocesstime milliseconds
 * @param {discord.User} user 
 */
exports.beingprocessed = (name,id,rawprocesstime,user) => {

    const newtime = rawprocesstime

    const processtime = "<t:"+newtime.getTime().toString().substring(0,newtime.getTime().toString().length-3)+":R>"

    const embed = new discord.EmbedBuilder()
        .setTitle("🧾 "+l.transcripts.title)
        .setColor(config.color)
        .setAuthor({name:user.username,iconURL:user.displayAvatarURL()})
        .setFooter({text:name})

        .setDescription("`"+l.transcripts.processed+"...`\n"+l.transcripts.wait+"\n\n"+l.transcripts.estimated+": "+processtime)

    return embed
}


/**
 * 
 * @param {String} name channel name
 * @param {String} url transcript url
 * @param {discord.User} user transcript closer
 * @param {discord.User} creator transcript creator
 */
exports.tsready = (name,url,user,creator) => {
    const embed = new discord.EmbedBuilder()
        .setTitle("🧾 "+l.transcripts.title)
        .setColor(config.color)
        .setAuthor({name:user.username,iconURL:user.displayAvatarURL()})
        .setFooter({text:name})
        
        if (creator) embed.setFields([{name:"Ticket Creator", value:"<@"+creator.id+">"}])

        if (url){
            embed.setURL(url)
            embed.setDescription("\n["+l.transcripts.available+"]("+url+")\n")
        }else{
            embed.setDescription("\n"+l.transcripts.available+"\n")   
        }

    return embed
}

/**
 * 
 * @param {String} name 
 * @param {String} id 
 * @param {discord.User} user 
 * @param {undefined|String} err
 */
exports.tserror = (name,id,user,err) => {
    const embed = new discord.EmbedBuilder()
        .setTitle("❌ "+l.transcripts.title)
        .setColor(discord.Colors.Red)
        .setAuthor({name:user.username,iconURL:user.displayAvatarURL()})
        .setFooter({text:name})

        const errDesc = (typeof err == "string") ? "\n"+err : ""

        embed.setDescription("Something went wrong while creating the HTML transcript.\n\n[possible reasons](https://otdocs.dj-dj.be/docs/current/docs/system/transcripts)"+errDesc)
    
    return embed
}
