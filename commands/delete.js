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
    bot.errorLog.log("debug","COMMANDS: loaded delete.js")

    if (!DISABLE.commands.text.delete) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"delete")) return

        if (!msg.guild) return
        if (!permsChecker.command(msg.author.id,msg.guild.id)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            msg.channel.send({embeds:[bot.embeds.commands.deleteEmbed(msg.author)]})

            var name = msg.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketActions/ticketCloser").closeManager(msg.member,msg.channel,prefix,"delete",false,true)

            log("command","someone used the 'delete' command",[{key:"user",value:msg.author.tag}])
            APIEvents.onCommand("delete",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        })
        
        
    })

    if (!DISABLE.commands.slash.delete) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "delete") return

        if (!interaction.guild) return
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
            return interaction.reply({embeds:[bot.errorLog.noPermsDelete(interaction.user)]})
        }

        await interaction.deferReply()

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            interaction.editReply({embeds:[bot.embeds.commands.deleteEmbed(interaction.user)]})

            var name = interaction.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketActions/ticketCloser").closeManager(interaction.member,interaction.channel,prefix,"delete",false,true)

            log("command","someone used the 'delete' command",[{key:"user",value:interaction.user.tag}])
            APIEvents.onCommand("delete",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
            
        })
    })
}