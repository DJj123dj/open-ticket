const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

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

    //DELETE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.verifybars.deleteVerifyBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.close.openRowNormal]})
    })

    //DELETE NO TRANSCRIPT
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicket1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.verifybars.delete1VerifyBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicketFalse1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[bot.buttons.close.closeCommandRow]})
    })
}