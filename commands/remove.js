const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permsChecker = require("../core/utils/permisssionChecker")

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"remove")) return
        var user = msg.mentions.users.first()
        if (!user) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<user>`:\n`"+config.prefix+"remove <user>`")]})

        if (!msg.guild) return
        if (!permsChecker.command(msg.author.id,msg.guild.id)){
            permsChecker.sendUserNoPerms(msg.author)
        }

        interaction.deferReply()

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            msg.channel.permissionOverwrites.delete(user.id)
            msg.channel.send({embeds:[bot.errorLog.success(l.commands.userRemovedTitle,l.commands.userRemovedDescription.replace("{0}",user.tag))]})

            var loguser = msg.mentions.users.first()
            
            log("command","someone used the 'remove' command",[{key:"user",value:msg.author.tag}])
            log("system","user removed from ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"removed_user",value:loguser.tag}])
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "remove") return
        const user = interaction.options.getUser("user")

        if (!interaction.guild) return
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
        }
        


        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})

            interaction.channel.permissionOverwrites.delete(user.id)
            interaction.reply({embeds:[bot.errorLog.success(l.commands.userRemovedTitle,l.commands.userRemovedDescription.replace("{0}",user.tag))]})

            var loguser = user
            
            log("command","someone used the 'remove' command",[{key:"user",value:interaction.user.tag}])
            log("system","user removed from ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"removed_user",value:loguser.tag}])
        })

       
    })
}