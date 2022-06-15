const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

module.exports = () => {
    var reopenCommandBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("reopenTicket1")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("🔓")
        )
    
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"reopen")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            msg.channel.send({embeds:[bot.errorLog.success("Re-Open this ticket!","You can re-open this ticket by clicking on the button below!")],components:[reopenCommandBar]})

            
            log("command","someone used the 'reopen' command",[{key:"user",value:msg.author.tag}])
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "reopen") return

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            interaction.reply({embeds:[bot.errorLog.success("Re-Open this ticket!","You can re-open this ticket by clicking on the button below!")],components:[reopenCommandBar]})

            
            log("command","someone used the 'reopen' command",[{key:"user",value:interaction.user.tag}])
        })

       
    })
}