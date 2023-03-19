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
    bot.errorLog.log("debug","COMMANDS: loaded close.js")

    if (!DISABLE.commands.text.close) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"close")) return

        const args = msg.content.substring((config.prefix+"close").length).split(" ")
        args.shift()
        /**@type {String|false} */
        var tempreason = args.join(" ")
        if (!tempreason || tempreason == " " || tempreason == "  "){
            tempreason = false
        }
        const reason = tempreason

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            if (hiddendata.data.find(h => h.key == "pendingdelete")) return msg.channel.send({embeds:[bot.errorLog.warning("Warning!","You can't close a ticket while it's being deleted!")]})

            const descriptionReason = reason ? "**"+l.messages.reason+":** "+reason : false
            msg.channel.send({embeds:[bot.embeds.commands.closeEmbed(msg.author,descriptionReason)],components:[bot.buttons.close.closeCommandRow]})

            var name = msg.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketActions/ticketCloser").closeManager(msg.member,msg.channel,prefix,"close",reason,true)

            log("command","someone used the 'close' command",[{key:"user",value:msg.author.tag}])
            APIEvents.onCommand("close",true,msg.author,msg.channel,msg.guild,new Date())
            
        })
        
        
    })

    if (!DISABLE.commands.slash.close) client.on("interactionCreate",async(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "close") return

        //interaction.deferReply()

        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : false

        await interaction.deferReply()

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            if (hiddendata.data.find(h => h.key == "pendingdelete")) return interaction.editReply({embeds:[bot.errorLog.warning("Warning!","You can't close a ticket while it's being deleted!")]})

            const descriptionReason = reason ? "**"+l.messages.reason+":** "+reason : false
            interaction.editReply({embeds:[bot.embeds.commands.closeEmbed(interaction.user,descriptionReason)],components:[bot.buttons.close.closeCommandRow]})

            var name = interaction.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            require("../core/ticketActions/ticketCloser").closeManager(interaction.member,interaction.channel,prefix,"close",false,true)

            log("command","someone used the 'close' command",[{key:"user",value:interaction.user.tag}])
            APIEvents.onCommand("close",true,interaction.user,interaction.channel,interaction.guild,new Date())
            
        })
    })
}