const discord = require('discord.js')
const bot = require('../../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const permissionChecker = require("../../../utils/permisssionChecker")
const storage = bot.storage
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

const modal = discord.ModalBuilder
const tis = discord.TextInputStyle
const tib = discord.TextInputBuilder

module.exports = () => {
    //theModal
    const reasonModal = new modal()
        .setTitle(l.buttons.closeWithReason)
        .setCustomId("OTCloseReasonModal")
        
    const reasonInput = new arb()
        .addComponents([
            new tib()
                .setCustomId('OTreasonInput')
                .setLabel(l.messages.modalreason)
                .setStyle(tis.Short)
                .setMaxLength(100)
                .setRequired(true)
                .setValue("")
                .setPlaceholder("reason")
        ])

    reasonModal.addComponents(reasonInput)






    //CLOSE WITH REASON
    var closeTicketButtonChecker = false

    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicketReason") return

        if (closeTicketButtonChecker == true) return interaction.deferUpdate()
        closeTicketButtonChecker = true

        const firstcomponents = interaction.message.components

        if (config.system.closeMode == "adminonly"){
            if (!permissionChecker.command(interaction.user.id,interaction.guild.id)){
                if (!permissionChecker.sendUserNoPerms(interaction.user)){
                    permissionChecker.sendChannelNoPerms(interaction.channel,interaction.user)
                }
                interaction.message.edit({components:[firstcomponents]})
                closeTicketButtonChecker = false
                return interaction.deferUpdate()
            }
        }
        
        interaction.message.edit({components:[bot.buttons.close.openRowDisabled]})
        await interaction.showModal(reasonModal)

    })

    client.on("interactionCreate",async (interaction) => {
        if (interaction.type != discord.InteractionType.ModalSubmit) return
        if (interaction.customId != "OTCloseReasonModal") return

        interaction.reply({embeds:[bot.embeds.commands.closeEmbed(interaction.user)],components:[bot.buttons.close.closeCommandRow]})
        
        const reason = interaction.fields.getTextInputValue("OTreasonInput")

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
 
         //interaction.channel.send({embeds:[bot.embeds.commands.closeEmbed(interaction.user)],components:[bot.buttons.close.closeCommandRow]})
         await require("../../../ticketActions/ticketCloser").closeManager(interaction.member,interaction.channel,prefix,"close",reason,true)
         closeTicketButtonChecker = false
    })
}