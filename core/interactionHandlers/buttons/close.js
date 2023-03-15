const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle


exports.closeCommandRow = new arb()
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicket1")
        .setDisabled(false)
        .setStyle(bs.Danger)
        .setLabel(l.buttons.delete)
        .setEmoji("✖️")
    )
    .addComponents(
        new button()
        .setCustomId("OTreopenTicket")
        .setDisabled(false)
        .setStyle(bs.Success)
        .setLabel(l.buttons.reopen)
        .setEmoji("✔")
    )

exports.closeCommandRowDisabled = new arb()
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicket1")
        .setDisabled(true)
        .setStyle(bs.Danger)
        .setLabel(l.buttons.delete)
        .setEmoji("✖️")
    )
    .addComponents(
        new button()
        .setCustomId("OTreopenTicket")
        .setDisabled(true)
        .setStyle(bs.Success)
        .setLabel(l.buttons.reopen)
        .setEmoji("✔")
    )

exports.openRowNormal = new arb()
    .addComponents(
        new button()
        .setCustomId("OTcloseTicket")
        .setDisabled(false)
        .setStyle(bs.Secondary)
        .setLabel(l.buttons.close)
        .setEmoji("🔒")
    )
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicket")
        .setDisabled(false)
        .setStyle(bs.Danger)
        .setLabel(l.buttons.delete)
        .setEmoji("✖️")
    )

exports.openRowDisabled = new arb()
    .addComponents(
        new button()
        .setCustomId("OTcloseTicket")
        .setDisabled(true)
        .setStyle(bs.Secondary)
        .setLabel(l.buttons.close)
        .setEmoji("🔒")
    )
    .addComponents(
        new button()
        .setCustomId("OTdeleteTicket")
        .setDisabled(true)
        .setStyle(bs.Danger)
        .setLabel(l.buttons.delete)
        .setEmoji("✖️")
    )