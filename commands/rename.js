const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permsChecker = require("../core/utils/permisssionChecker")

const APIEvents = require("../core/api/modules/events")

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"rename")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            if (!msg.guild) return
            if (!permsChecker.command(msg.author.id,msg.guild.id)){
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
            msg.channel.send({embeds:[bot.errorLog.success(l.commands.renameTitle,l.commands.renameWarning)]})

            log("command","someone used the 'rename' command",[{key:"user",value:msg.author.tag}])
            log("system","ticket renamed",[{key:"user",value:msg.author.tag},{key:"ticket",value:name},{key:"newname",value:newname}])
            APIEvents.onCommand("rename",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "rename") return

        interaction.deferReply()

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id)return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            if (!interaction.guild) return
            if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
                permsChecker.sendUserNoPerms(interaction.user)
                return
            }
            
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
            interaction.reply({embeds:[bot.errorLog.success(l.commands.renameTitle,l.commands.renameWarning)]})

            log("command","someone used the 'rename' command",[{key:"user",value:interaction.user.tag}])
            log("system","ticket renamed",[{key:"user",value:interaction.user.tag},{key:"ticket",value:name},{key:"newname",value:newname}])

            APIEvents.onCommand("rename",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
        })
    })
}