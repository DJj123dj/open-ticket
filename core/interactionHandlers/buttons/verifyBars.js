const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("../../getoptions")
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.main_color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

exports.closeVerifyBar = new arb()
    .addComponents(
        new button()
        .setCustomId("OTcloseTicketTrue")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("✅")
    )
    .addComponents(
        new button()
        .setCustomId("OTcloseTicketFalse")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("❌")
    )

exports.deleteVerifyBar = new arb()
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicketTrue")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("✅")
    )
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicketFalse")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("❌")
    )

exports.delete1VerifyBar = new arb()
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicketTrue1")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("✅")
    )
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicketFalse1")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setEmoji("❌")
    )