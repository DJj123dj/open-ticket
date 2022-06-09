const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"delete")) return


        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("❌")
            ])

            msg.channel.send({embeds:[bot.errorLog.success("Delete this ticket!","You can delete this ticket by clicking on the button below!")],components:[closebutton]})

            log("command","someone used the 'delete' command",[{key:"user",value:msg.author.tag}])
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "delete") return

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("❌")
            ])

            interaction.reply({embeds:[bot.errorLog.success("Delete this ticket!","You can delete this ticket by clicking on the button below!")],components:[closebutton]})

            log("command","someone used the 'close' command",[{key:"user",value:interaction.user.tag}])
            
        })
    })
}