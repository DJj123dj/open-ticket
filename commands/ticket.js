const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")


module.exports = () => {
    client.on("messageCreate", msg => {
        if (msg.content == config.prefix+"ticket msg"){
            if (msg.member.roles.cache.has(config.botperms_role) == false){
                msg.channel.send({content:config.messages.general.nopermissions})
                return
            }

            var currentTicketButtons = 0
            var ticketButton = new discord.MessageActionRow()
            var ticketButton2 = new discord.MessageActionRow()

            const getColor = (color) => {
                if (color.toLowerCase() == "red"){
                    return "DANGER"
                }else if (color.toLowerCase() == "green"){
                    return "SUCCESS"
                }else if (color.toLowerCase() == "blue" || color.toLowerCase() == "blurple"){
                    return "PRIMARY"
                }else if (color.toLowerCase() == "black" || color.toLowerCase() == "gray" || color.toLowerCase() == "grey"){
                    return "SECONDARY"
                }else if (color == "DANGER" || color == "SECONDARY" || color == "SUCCESS" || color == "PRIMARY"){
                    return color
                }else if (color.toLowerCase() == "none" || color.toLowerCase() == "false" || color.toLowerCase() == ""){
                    return "SECONDARY"
                }else return "SECONDARY"
            }

            if (config.options.ticket1.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket1.isURL == false){
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setCustomId("newTicket1")
                            .setDisabled(false)
                            .setStyle(getColor(config.options.ticket1.color))
                            .setEmoji(config.options.ticket1.icon)
                    )
                }else{
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setDisabled(false)
                            .setStyle("LINK")
                            .setEmoji(config.options.ticket1.icon)
                            .setURL(config.options.ticket1.url)
                    )
                }
            }

            if (config.options.ticket2.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket2.isURL == false){
                localTicketButton.addComponents(
                    new discord.MessageButton()
                        .setCustomId("newTicket2")
                        .setDisabled(false)
                        .setStyle(getColor(config.options.ticket2.color))
                        .setEmoji(config.options.ticket2.icon)
                )
                }else{
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setDisabled(false)
                            .setStyle("LINK")
                            .setEmoji(config.options.ticket2.icon)
                            .setURL(config.options.ticket2.url)
                    )
                }
            }

            if (config.options.ticket3.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket3.isURL == false){
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setCustomId("newTicket3")
                            .setDisabled(false)
                            .setStyle(getColor(config.options.ticket3.color))
                            .setEmoji(config.options.ticket3.icon)
                    )
                    }else{
                        localTicketButton.addComponents(
                            new discord.MessageButton()
                                .setDisabled(false)
                                .setStyle("LINK")
                                .setEmoji(config.options.ticket3.icon)
                                .setURL(config.options.ticket3.url)
                        )
                    }
            }

            if (config.options.ticket4.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket4.isURL == false){
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setCustomId("newTicket4")
                            .setDisabled(false)
                            .setStyle(getColor(config.options.ticket4.color))
                            .setEmoji(config.options.ticket4.icon)
                    )
                    }else{
                        localTicketButton.addComponents(
                            new discord.MessageButton()
                                .setDisabled(false)
                                .setStyle("LINK")
                                .setEmoji(config.options.ticket4.icon)
                                .setURL(config.options.ticket4.url)
                        )
                    }
            }

            if (config.options.ticket5.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket5.isURL == false){
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setCustomId("newTicket5")
                            .setDisabled(false)
                            .setStyle(getColor(config.options.ticket5.color))
                            .setEmoji(config.options.ticket5.icon)
                    )
                    }else{
                        localTicketButton.addComponents(
                            new discord.MessageButton()
                                .setDisabled(false)
                                .setStyle("LINK")
                                .setEmoji(config.options.ticket5.icon)
                                .setURL(config.options.ticket5.url)
                        )
                    }
            }

            if (config.options.ticket6.enabled){
                if (currentTicketButtons < 4){
                    var localTicketButton = ticketButton
                }else{
                    var localTicketButton = ticketButton2
                }

                currentTicketButtons = currentTicketButtons + 1

                if (config.options.ticket6.isURL == false){
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setCustomId("newTicket6")
                            .setDisabled(false)
                            .setStyle(getColor(config.options.ticket6.color))
                            .setEmoji(config.options.ticket6.icon)
                    )
                }else{
                    localTicketButton.addComponents(
                        new discord.MessageButton()
                            .setDisabled(false)
                            .setStyle("LINK")
                            .setEmoji(config.options.ticket6.icon)
                            .setURL(config.options.ticket6.url)
                    )
                }
            }

            var categorylist = ""
            if (config.options.ticket1.enabled){categorylist = categorylist+"\n"+config.options.ticket1.icon+": **"+config.options.ticket1.name+"**\n"+config.options.ticket1.description}

            if (config.options.ticket2.enabled){categorylist = categorylist+"\n\n"+config.options.ticket2.icon+": **"+config.options.ticket2.name+"**\n"+config.options.ticket2.description}

            if (config.options.ticket3.enabled){categorylist = categorylist+"\n\n"+config.options.ticket3.icon+": **"+config.options.ticket3.name+"**\n"+config.options.ticket3.description}

            if (config.options.ticket4.enabled){categorylist = categorylist+"\n\n"+config.options.ticket4.icon+": **"+config.options.ticket4.name+"**\n"+config.options.ticket4.description}

            if (config.options.ticket5.enabled){categorylist = categorylist+"\n\n"+config.options.ticket5.icon+": **"+config.options.ticket5.name+"**\n"+config.options.ticket5.description}

            if (config.options.ticket6.enabled){categorylist = categorylist+"\n\n"+config.options.ticket6.icon+": **"+config.options.ticket6.name+"**\n"+config.options.ticket6.description}
                
                

            var ticketEmbed = new discord.MessageEmbed()
            if (config.layout.ticketMsg.customColorEnabled){
                ticketEmbed.setColor(config.layout.ticketMsg.customColor)
            }else{ticketEmbed.setColor(config.main_color)}

            if (config.layout.ticketMsg.footerEnabled){
                ticketEmbed.setFooter({text:config.layout.ticketMsg.footer})
            }
            if (config.layout.ticketMsg.thumbnailEnabled){
                ticketEmbed.setThumbnail(config.layout.ticketMsg.thumbnailURL)
            }
                
            ticketEmbed.setDescription("**Create a ticket:**\nClick one of the buttons below to create a ticket.\n\n__choose a category:__"+categorylist+"\n\n**watch out:**_You can only create "+config.system.max_allowed_tickets+" ticket(s) at a time!_")
            
            
            if (currentTicketButtons <= 4){
                var embedComponents = [ticketButton]
            }else{var embedComponents = [ticketButton,ticketButton2]}

            msg.channel.send({embeds:[ticketEmbed],components:embedComponents})
            
            
        }
    })
}