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

module.exports = () => {
    //REOPEN
    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTreopenTicket") return

        await interaction.deferUpdate()
        interaction.message.edit({embeds:[bot.embeds.commands.reopenEmbed(interaction.user)],components:[bot.buttons.close.openRowNormal]})
        require("../../../ticketActions/ticketReopener").reopenTicket(interaction.guild,interaction.channel,interaction.user)
    })
}