const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")


module.exports = () => {
    client.on("messageCreate", msg => {
        if (msg.content == config.prefix+"ticket msg"){
            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"You don't have permissons for this command!"})
                return
            }

            var ticketButton = new discord.MessageActionRow()


            if (config.options.ticket1.enabled){
                ticketButton.addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicket1")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji(config.options.ticket1.icon)
                )
            }

            if (config.options.ticket2.enabled){
                ticketButton.addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicket2")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji(config.options.ticket2.icon)
                )
            }

            if (config.options.ticket3.enabled){
                ticketButton.addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicket3")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji(config.options.ticket3.icon)
                )
            }

            if (config.options.ticket4.enabled){
                ticketButton.addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicket4")
                        .setDisabled(false)
                        .setStyle("SECONDARY")
                        .setEmoji(config.options.ticket4.icon)
                )
            }

            var categorylist = ""
            if (config.options.ticket1.enabled){categorylist = categorylist+"\n"+config.options.ticket1.icon+": **"+config.options.ticket1.name+"**\n"+config.options.ticket1.description}

            if (config.options.ticket2.enabled){categorylist = categorylist+"\n\n"+config.options.ticket2.icon+": **"+config.options.ticket2.name+"**\n"+config.options.ticket2.description}

            if (config.options.ticket3.enabled){categorylist = categorylist+"\n\n"+config.options.ticket3.icon+": **"+config.options.ticket3.name+"**\n"+config.options.ticket3.description}

            if (config.options.ticket4.enabled){categorylist = categorylist+"\n\n"+config.options.ticket4.icon+": **"+config.options.ticket4.name+"**\n"+config.options.ticket4.description}
                
                
                

            var ticketEmbed = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("**Create a ticket:**\nClick one of the buttons below to create a ticket.\n\n__choose a category:__"+categorylist+"\n\n**watch out:**_You can only create 1 ticket at a time!_")
            
            
        
            msg.channel.send({embeds:[ticketEmbed],components:[ticketButton]})
            
            
        }
    })
}