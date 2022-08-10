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
        if (!msg.content.startsWith(config.prefix+"close")) return


        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type")

            msg.channel.send({embeds:[bot.embeds.commands.closeEmbed(msg.author)],components:[bot.buttons.close.closeCommandRow]})

            var name = msg.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketCloser").NEWcloseTicket(msg.member,msg.channel,prefix,"close",false,true)

            log("command","someone used the 'close' command",[{key:"user",value:msg.author.tag}])
            APIEvents.onCommand("close",true,msg.author,msg.channel,msg.guild,new Date())
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "close") return

        //interaction.deferReply()

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type")

            interaction.reply({embeds:[bot.embeds.commands.closeEmbed(interaction.user)],components:[bot.buttons.close.closeCommandRow]})

            var name = interaction.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketCloser").NEWcloseTicket(interaction.member,interaction.channel,prefix,"close",false,true)

            log("command","someone used the 'close' command",[{key:"user",value:interaction.user.tag}])
            APIEvents.onCommand("close",true,interaction.user,interaction.channel,interaction.guild,new Date())
            
        })
    })
}