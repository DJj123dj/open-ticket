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
    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTsendTranscript") return

        interaction.deferUpdate()
        const tsmsg = await interaction.channel.send({embeds:[bot.embeds.commands.sendTranscriptEmbed(false,interaction.channel,interaction.user)]})

        const channelmessages = await interaction.channel.messages.fetch()

        channelmessages.sweep((msgSweep) => {
            return msgSweep.author.id == client.user.id
        })

        var fileattachment = await require("../../transcript").createTranscript(channelmessages,interaction.channel)

        if (fileattachment == false){
            log("system","internal error: transcript is not created!")
            tsmsg.edit({embeds:[bot.errorLog.serverError(l.errors.somethingWentWrongTranscript)]})
            return
        }

        tsmsg.edit({embeds:[bot.embeds.commands.sendTranscriptEmbed(true,interaction.channel,interaction.user)],files:[fileattachment]})
    })
}