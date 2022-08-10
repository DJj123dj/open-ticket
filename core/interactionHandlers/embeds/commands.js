const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("../../getoptions")
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.main_color

/**
 * 
 * @param {discord.User} addedUser 
 * @returns {discord.EmbedBuilder}
 */
exports.addEmbed = (addedUser) => {
    return new embed()
        .setTitle("⬆️ "+l.commands.userAddedTitle.replace("{0}",addedUser.username))
        .setColor(mc)
        .setFooter({text:addedUser.tag,iconURL:addedUser.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} removedUser 
 * @returns {discord.EmbedBuilder}
 */
exports.removeEmbed = (removedUser) => {
    return new embed()
        .setTitle("⬇️ "+l.commands.userRemovedTitle.replace("{0}",removedUser.username))
        .setColor(mc)
        .setFooter({text:removedUser.tag,iconURL:removedUser.displayAvatarURL()})
}

/**
 * 
 * @param {discord.User} closer 
 * @returns {discord.EmbedBuilder}
 */
exports.closeEmbed = (closer) => {
    return new embed()
        .setTitle("🔒 "+l.commands.closeTitle)
        .setColor(mc)
        .setFooter({text:closer.tag,iconURL:closer.displayAvatarURL()})
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