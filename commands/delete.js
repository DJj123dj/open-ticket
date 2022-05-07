const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"delete")) return


        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                msg.channel.send({content:"You are not in a ticket!"})
                return
            }
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("❌")
            ])

            msg.channel.send({content:"**Click on the button below to delete this ticket!**",components:[closebutton]})

            console.log("[system] deleted a ticket via command")
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "delete") return

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                interaction.reply({content:"You are not in a ticket!"})
                return
            }
            
            const closebutton = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle("SECONDARY")
                    .setEmoji("❌")
            ])

            interaction.reply({content:"**Click on the button below to delete this ticket!**",components:[closebutton]})

            console.log("[system] deleted a ticket via command")
            
        })
    })
}