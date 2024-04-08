const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permsChecker = require("../core/utils/permisssionChecker")

const APIEvents = require("../core/api/modules/events")
const DISABLE = require("../core/api/api.json").disable

module.exports = () => {
    bot.errorLog.log("debug","COMMANDS: loaded reopen.js")

    if (!DISABLE.commands.text.reopen) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"reopen")) return

        const hiddendata = bot.hiddenData.readHiddenData(msg.channel.id)
        if (hiddendata.length < 1) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (hiddendata.find(h => h.key == "pendingdelete")) return msg.channel.send({embeds:[bot.errorLog.warning("Warning!","You can't re-open a ticket while it's being deleted!")]})

        msg.channel.send({embeds:[bot.embeds.commands.reopenEmbed(msg.author)],components:[bot.buttons.close.openRowNormal]})

        require("../core/ticketActions/ticketReopener").reopenTicket(msg.guild,msg.channel,msg.author,ticketId)
        
        log("command","someone used the 'reopen' command",[{key:"user",value:msg.author.username}])
        APIEvents.onCommand("reopen",true,msg.author,msg.channel,msg.guild,new Date())
    })

    if (!DISABLE.commands.slash.reopen) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "reopen") return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (hiddendata.find(h => h.key == "pendingdelete")) return interaction.reply({embeds:[bot.errorLog.warning("Warning!","You can't re-open a ticket while it's being deleted!")]})

        await interaction.deferReply()

        await interaction.editReply({embeds:[bot.embeds.commands.reopenEmbed(interaction.user)],components:[bot.buttons.close.openRowNormal]})

        require("../core/ticketActions/ticketReopener").reopenTicket(interaction.guild,interaction.channel,interaction.user,ticketId)
        
        log("command","someone used the 'reopen' command",[{key:"user",value:interaction.user.username}])
        APIEvents.onCommand("reopen",true,interaction.user,interaction.channel,interaction.guild,new Date())
    })
}
