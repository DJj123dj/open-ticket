const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("../../getoptions")
const storage = bot.storage
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.main_color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

module.exports = () => {
    //CLOSE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.verifybars.closeVerifyBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.close.openRowNormal]})
    })
}