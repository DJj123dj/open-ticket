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
    bot.errorLog.log("debug","COMMANDS: loaded remove.js")

    if (!DISABLE.commands.text.remove) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"remove")) return
        var user = msg.mentions.users.first()
        if (!user) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<user>`:\n`"+config.prefix+"remove <user>`")]})

        if (!msg.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(msg.channel.id)
        if (hiddendata.length < 1) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(msg.author.id,msg.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        /**@type {discord.PermissionOverwriteManager} */
        const overwrites = msg.channel.permissionOverwrites
        overwrites.delete(user.id,"Removed user from ticket.")
        msg.channel.send({embeds:[bot.embeds.commands.removeEmbed(user,msg.author)]})

        var loguser = msg.mentions.users.first()
        
        log("command","someone used the 'remove' command",[{key:"user",value:msg.author.username}])
        log("system","user removed from ticket",[{key:"user",value:msg.author.username},{key:"ticket",value:msg.channel.name},{key:"removed_user",value:loguser.username}])

        const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
        APIEvents.onTicketRemove(msg.author,loguser,msg.channel,msg.guild,new Date(),{status:"open",name:msg.channel.name,ticketOptions:ticketData})
        APIEvents.onCommand("remove",permsChecker.ticket(msg.author.id,msg.guild.id,ticketId),msg.author,msg.channel,msg.guild,new Date())
    })

    if (!DISABLE.commands.slash.remove) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "remove") return
        const user = interaction.options.getUser("user")

        if (!interaction.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        await interaction.deferReply()

        /**@type {discord.PermissionOverwriteManager} */
        const overwrites = interaction.channel.permissionOverwrites
        overwrites.delete(user.id,"Removed user from ticket.")
        interaction.editReply({embeds:[bot.embeds.commands.removeEmbed(user,interaction.user)]})

        var loguser = user
        
        log("command","someone used the 'remove' command",[{key:"user",value:interaction.user.username}])
        log("system","user removed from ticket",[{key:"user",value:interaction.user.username},{key:"ticket",value:interaction.channel.name},{key:"removed_user",value:loguser.username}])

        const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
        APIEvents.onTicketRemove(interaction.user,loguser,interaction.channel,interaction.guild,new Date(),{status:"open",name:interaction.channel.name,ticketOptions:ticketData})
        APIEvents.onCommand("remove",permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId),interaction.user,interaction.channel,interaction.guild,new Date())
    })
}