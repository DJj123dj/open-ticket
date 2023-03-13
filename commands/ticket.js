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
    bot.errorLog.log("debug","COMMANDS: loaded ticket.js")

    /**@type {String[]} */
    var msgIds = []
    config.messages.forEach((msg) => {
        msgIds.push(msg.id)
    })


    if (!DISABLE.commands.text.msg) client.on("messageCreate", msg => {
        if (msg.content.startsWith(config.prefix+"msg"||config.prefix+"message")){
            
            if (!msg.guild) return
            if (!permsChecker.command(msg.author.id,msg.guild.id)){
                permsChecker.sendUserNoPerms(msg.author)
                return
            }

            const id = msg.content.split(config.prefix+"msg")[1].substring(1) ? msg.content.split(config.prefix+"msg")[1].substring(1) : false

            if (!id) return msg.channel.send({embeds:[bot.errorLog.invalidIdChooseFromList(msgIds,l.errors.missingArgsDescription+" `<id>`:\n`"+config.prefix+"msg <id>`")]})
            if (!msgIds.includes(id)) return msg.channel.send({embeds:[bot.errorLog.invalidIdChooseFromList(msgIds,l.errors.missingArgsDescription+" `<id>`:\n`"+config.prefix+"msg <id>`")]})


            const {embed,componentRows} = require("../core/utils/getEmbed").createEmbed(id)
            
            msg.channel.send({embeds:[embed],components:componentRows})
            
            log("command","someone used the 'message' command",[{key:"user",value:msg.author.tag},{key:"id",value:id}])
            APIEvents.onCommand("message",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        }
    })

    if (!DISABLE.commands.slash.msg) client.on("interactionCreate", (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "message") return

            if (!interaction.guild) return
            if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
                permsChecker.sendUserNoPerms(interaction.user)
                return
            }

            const id = interaction.options.getString("id")

            if (!msgIds.includes(id)) return interaction.reply({embeds:[bot.errorLog.invalidIdChooseFromList(msgIds)]})

            const {embed,componentRows} = require("../core/utils/getEmbed").createEmbed(id)
            
            interaction.reply({content:l.commands.ticketWarning})
            interaction.channel.send({embeds:[embed],components:componentRows})
            
            log("command","someone used the 'message' command",[{key:"user",value:interaction.user.tag},{key:"id",value:id}])

            APIEvents.onCommand("message",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
        
    })
}