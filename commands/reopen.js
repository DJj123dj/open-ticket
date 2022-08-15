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
        if (!msg.content.startsWith(config.prefix+"reopen")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            msg.channel.send({embeds:[bot.embeds.commands.reopenEmbed(msg.author)],components:[bot.buttons.close.openRowNormal]})

            require("../core/ticketReopener").reopenTicket(msg.guild,msg.channel,msg.author)
            
            log("command","someone used the 'reopen' command",[{key:"user",value:msg.author.tag}])
            APIEvents.onCommand("reopen",true,msg.author,msg.channel,msg.guild,new Date())
        })
        
    })

    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "reopen") return

        //interaction.deferReply()

        interaction.channel.messages.fetchPinned().then(async msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            await interaction.reply({embeds:[bot.embeds.commands.reopenEmbed(interaction.user)],components:[bot.buttons.close.openRowNormal]})

            require("../core/ticketReopener").reopenTicket(interaction.guild,interaction.channel,interaction.user)
            
            log("command","someone used the 'reopen' command",[{key:"user",value:interaction.user.tag}])
            APIEvents.onCommand("reopen",true,interaction.user,interaction.channel,interaction.guild,new Date())
        })

       
    })
}