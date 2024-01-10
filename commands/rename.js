const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permsChecker = require("../core/utils/permisssionChecker")

const APIEvents = require("../core/api/modules/events")
const DISABLE = require("../core/api/api.json").disable

module.exports = () => {
    bot.errorLog.log("debug","COMMANDS: loaded rename.js")

    if (!DISABLE.commands.text.rename) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"rename")) return

        if (!msg.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(msg.channel.id)
        if (hiddendata.length < 1) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(msg.author.id,msg.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }
            
        var newname = msg.content.split(config.prefix+"rename")[1].substring(1)

        if (!newname) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<name>`:\n`"+config.prefix+"rename <name>`")]})

        var name = msg.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        if (!prefix) prefix = "noprefix-"
        msg.channel.setName(prefix+newname)
        msg.channel.send({embeds:[bot.embeds.commands.renameEmbed(msg.author,prefix+newname)]})

        log("command","someone used the 'rename' command",[{key:"user",value:msg.author.username}])
        log("system","ticket renamed",[{key:"user",value:msg.author.username},{key:"ticket",value:name},{key:"newname",value:newname}])
        APIEvents.onCommand("rename",permsChecker.ticket(msg.author.id,msg.guild.id,ticketId),msg.author,msg.channel,msg.guild,new Date())
    })

    if (!DISABLE.commands.slash.rename) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "rename") return

        if (!interaction.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        await interaction.deferReply()
            
        var newname = interaction.options.getString("name")
        var name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        if (!prefix) prefix = "noprefix-"

        interaction.channel.setName(prefix+newname)
        interaction.editReply({embeds:[bot.embeds.commands.renameEmbed(interaction.user,prefix+newname)]})

        log("command","someone used the 'rename' command",[{key:"user",value:interaction.user.username}])
        log("system","ticket renamed",[{key:"user",value:interaction.user.username},{key:"ticket",value:name},{key:"newname",value:newname}])

        APIEvents.onCommand("rename",permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId),interaction.user,interaction.channel,interaction.guild,new Date())
    })
}