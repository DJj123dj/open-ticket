const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

const storage = bot.storage

module.exports = () => {
    var closeRowNormal = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Close Ticket")
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel("Delete Ticket")
            .setEmoji("✖️")
        )
    
    var closeRowClosed = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket1")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel("Delete Ticket")
            .setEmoji("✖️")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("sendTranscript")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Send Transcript File")
            .setEmoji("📄")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("reopenTicket")
            .setDisabled(false)
            .setStyle("SUCCESS")
            .setLabel("Re-Open Ticket")
            .setEmoji("✔")
        )
    
    var reopenBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("reopenTicketTrue")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("✅")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("reopenTicketFalse")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("❌")
        )
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicket") return

        interaction.deferUpdate()
        interaction.message.edit({components:[reopenBar]})

    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketFalse") return

        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowClosed]})

    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketTrue") return

        interaction.deferUpdate()
        
        const embed = new discord.MessageEmbed()
            .setColor(config.main_color)
            .setTitle(":unlock: Re-Opened this ticket! :unlock:")
            .setDescription("Feel free to talk again!")

        interaction.message.edit({embeds:[embed],components:[closeRowNormal]})

        log("system","re-opened a ticket",[{key:"ticket",value:interaction.channel.name},{key:"user",value:interaction.user.tag}])
    })
}