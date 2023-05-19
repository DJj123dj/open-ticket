const discord = require('discord.js')

const bot = require("../../../index")
const tsconfig = bot.tsconfig
const tsembeds = require("../embeds")
const tsdb = require("../tsdb")

/**
 * 
 * @param {String} text 
 * @param {discord.Guild} guild 
 */
exports.replacementions = (text,guild) => {
    const userregex = /<@([0-9]+)>(\s)?/g
    const usertext = text.replace(userregex,(x) => {
        var res = userregex.exec(x)
        userregex.lastIndex = 0

        var member = guild.members.cache.find((m) => m.id == res[1])
        var text = member ? member.user.username.replace(/\s/g,"&nbsp;") : res[1]
        return "<@"+text+"> "
    })

    const channelregex = /<#([0-9]+)>(\s)?/g
    const channeltext = usertext.replace(channelregex,(x) => {
        var res = channelregex.exec(x)
        channelregex.lastIndex = 0

        var channel = guild.channels.cache.find((c) => c.id == res[1])
        var text = channel ? channel.name.replace(/\s/g,"&nbsp;") : res[1]
        return "<#"+text+"> "
    })

    const roleregex = /<@&([0-9]+)>(\s)?/g
    const roletext = channeltext.replace(roleregex,(x) => {
        var res = roleregex.exec(x)
        roleregex.lastIndex = 0

        var role = guild.roles.cache.find((r) => r.id == res[1])
        var text = role ? role.name.replace(/\s/g,"&nbsp;") : res[1]
        
        var color = role ? ((role.hexColor == "#000000") ? "regular" : role.hexColor) : "regular"

        return "<@&"+text+"::"+color+"> "
    })

    const defaultroleregex = /@(everyone|here)(\s)?/g
    const defaultroletext = roletext.replace(defaultroleregex,(x) => {
        var res = defaultroleregex.exec(x)
        defaultroleregex.lastIndex = 0

        var text = res[1]
        return "<@&"+text+"::regular> "
    })

    return defaultroletext
}