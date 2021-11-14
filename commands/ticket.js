const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")

var name = require('./ticketExtra').name
var stringDecoder = require('./ticketSystem').stringDecoder


module.exports = () => {
    client.on("messageCreate", msg => {
        if (msg.content == "!ticket msg"){
            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"Je hebt geen permissions voor deze command!"})
                return
            }

            var ticketButton = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicketVraag")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji("❓")
                )
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicketSolli")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji("📝")
                )
                .addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicketPartner")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji("💼")
                )

            var ticketEmbed = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("**Maak een ticket:**\nKlik op een van de onderstaande knoppen om een ticket aan te maken.\n\n__kies een categorie:__\n\n❓: **Vragen**\nOverige vragen.\n\n📝: **Sollicitatie**\nDoe een sollicitatie.\n\n💼: **Partner**\nWord partner met ons.\n\n**opgepast: **_u kan maar één ticket tegelijkertijd aanmaken!_")
                .setFooter("bot "+stringDecoder+name+" - https://www.dj-dj.be")
            
            
        
            msg.channel.send({embeds:[ticketEmbed],components:[ticketButton]})
            
            
        }
    })
}