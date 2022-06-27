const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language


module.exports = () => {
    //closebar
    var closeBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("closeTicketTrue")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("✅")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("closeTicketFalse")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("❌")
        )
    var deleteBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketTrue")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("✅")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketFalse")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("❌")
        )
    var deleteBar1 = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketTrue1")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("✅")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketFalse1")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("❌")
        )
    //closebutton
    var closeRowNormal = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel(l.buttons.close)
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel(l.buttons.delete)
            .setEmoji("✖️")
        )
    var closeRowClosed = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket1")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel(l.buttons.delete)
            .setEmoji("✖️")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("sendTranscript")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel(l.buttons.sendTranscript)
            .setEmoji("📄")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("reopenTicket")
            .setDisabled(false)
            .setStyle("SUCCESS")
            .setLabel(l.buttons.reopen)
            .setEmoji("✔")
        )
    
    var closeRowDisabled = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(true)
            .setStyle("SECONDARY")
            .setLabel(l.buttons.close)
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(true)
            .setStyle("DANGER")
            .setLabel(l.buttons.delete)
            .setEmoji("✖️")
        )


    //NORMAL CLOSE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowNormal]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketTrue") return
        
        interaction.deferUpdate()

        if (config.system.closeMode == "adminonly"){
            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        }
        
        interaction.message.edit({components:[closeRowDisabled]})

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"close")
    })

    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketTrue1") return
        
        interaction.deferUpdate()

        if (config.system.closeMode == "adminonly"){
            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        }

        const closedButtonDisabled = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("closeTicketTrue1")
                    .setDisabled(true)
                    .setStyle("SECONDARY")
                    .setEmoji("🔒")
            ])
        interaction.message.edit({components:[closedButtonDisabled]})

        interaction.channel.messages.fetchPinned().then((messages) => {
            messages.first().edit({components:[closeRowDisabled]})
        })

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"close")
    })


    //NORMAL DELETE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[deleteBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowNormal]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketTrue") return
        
        interaction.deferUpdate()

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
        if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
            interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
            return
        }

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"delete")
    })




    //CLOSED DELETE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicket1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[deleteBar1]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketFalse1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowClosed]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketTrue1") return
        
        interaction.deferUpdate()

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
        if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
            interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
            return
        }

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"deletenotranscript")
    })
}