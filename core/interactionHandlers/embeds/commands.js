const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.main_color

/**
 * 
 * @param {discord.User} addedUser 
 * @param {discord.User} adder
 * @returns {discord.EmbedBuilder}
 */
exports.addEmbed = (addedUser,adder) => {
    return new embed()
        .setTitle("⬆️ "+l.commands.userAddedTitle.replace("{0}",addedUser.username))
        .setColor(mc)
        .setFooter({text:adder.tag,iconURL:adder.displayAvatarURL()})
        .setThumbnail(addedUser.displayAvatarURL({extension:"png"}))
}

/**
 * 
 * @param {discord.User} removedUser 
 * @param {discord.User} remover
 * @returns {discord.EmbedBuilder}
 */
exports.removeEmbed = (removedUser,remover) => {
    return new embed()
        .setTitle("⬇️ "+l.commands.userRemovedTitle.replace("{0}",removedUser.username))
        .setColor(mc)
        .setFooter({text:remover.tag,iconURL:remover.displayAvatarURL()})
        .setThumbnail(removedUser.displayAvatarURL({extension:"png"}))
}

/**
 * 
 * @param {discord.User} closer 
 * @param {String} description
 * @returns {discord.EmbedBuilder}
 */
exports.closeEmbed = (closer,description) => {
    const embd = new embed()
        .setTitle("🔒 "+l.commands.closeTitle)
        .setColor(mc)
        .setFooter({text:closer.tag,iconURL:closer.displayAvatarURL()})

    if (description) embd.setDescription(description)
    return embd
}

/**
 * 
 * @param {discord.User} deleter 
 * @returns {discord.EmbedBuilder}
 */
exports.deleteEmbed = (deleter) => {
    return new embed()
        .setTitle("❌ "+l.commands.deleteTitle)
        .setColor(mc)
        .setFooter({text:deleter.tag,iconURL:deleter.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} renamer 
 * @param {String} newname
 * @returns {discord.EmbedBuilder}
 */
exports.renameEmbed = (renamer,newname) => {
    return new embed()
        .setTitle("🔄 "+l.commands.renameTitle.replace("{0}",newname))
        .setColor(mc)
        .setFooter({text:renamer.tag,iconURL:renamer.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} reopener 
 * @returns {discord.EmbedBuilder}
 */
 exports.reopenEmbed = (reopener) => {
    return new embed()
        .setTitle("🔓 "+l.commands.reopenTitle)
        .setColor(mc)
        .setFooter({text:reopener.tag,iconURL:reopener.displayAvatarURL()})
}

/**
 * 
 * @param {Boolean} done 
 * @param {discord.TextChannel} channel
 * @param {discord.User} author
 * @returns {discord.EmbedBuilder}
 */
 exports.sendTranscriptEmbed = (done,channel,author) => {
    if (done){
        return new embed()
            .setTitle("📄 "+l.messages.hereIsTheTranscript)
            .setColor(mc)
            .setDescription("Ticket: "+channel.name)
            .setFooter({text:author.tag,iconURL:author.displayAvatarURL()})
    }else{
        return new embed()
            .setTitle("📄 "+l.messages.hereIsTheTranscript)
            .setColor(mc)
            .setDescription("Loading...")
            .setFooter({text:author.tag,iconURL:author.displayAvatarURL()})
    }
}