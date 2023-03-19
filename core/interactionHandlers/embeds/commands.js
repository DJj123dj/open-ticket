const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.color

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
 * @param {discord.User} closer 
 * @param {Number} time
 * @returns {discord.EmbedBuilder}
 */
exports.autocloseSignalEmbed = (closer,time) => {
    const embd = new embed()
        .setTitle("⏰ This ticket got closed by Autoclose!")
        .setColor(mc)
        .setFooter({text:closer.tag,iconURL:closer.displayAvatarURL()})
        .setDescription("This ticket has been inactive for `"+time+"h`!")
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
 * @param {discord.User} claimer 
 * @param {discord.User} user
 * @returns {discord.EmbedBuilder}
 */
 exports.claimEmbed = (claimer,user) => {
    return new embed()
        .setTitle("📌 "+l.commands.claimTitle.replace("{0}",claimer.username))
        .setColor(mc)
        .setFooter({text:user.tag,iconURL:user.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} unclaimer 
 * @returns {discord.EmbedBuilder}
 */
 exports.unclaimEmbed = (unclaimer) => {
    return new embed()
        .setTitle("🆓 "+l.commands.unclaimTitle)
        .setColor(mc)
        .setFooter({text:unclaimer.tag,iconURL:unclaimer.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} changer 
 * @param {String} newtype
 * @returns {discord.EmbedBuilder}
 */
exports.changeEmbed = (changer,newtype) => {
    return new embed()
        .setTitle("🔄 "+l.commands.changeTitle.replace("{0}",newtype))
        .setColor(mc)
        .setFooter({text:changer.tag,iconURL:changer.displayAvatarURL()})
}