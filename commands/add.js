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
    bot.errorLog.log("debug","COMMANDS: loaded add.js")
    
    if (!DISABLE.commands.text.add) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"add")) return
        var user = msg.mentions.users.first()
        if (!user) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<user>`:\n`"+config.prefix+"add <user>`")]})

        if (!msg.guild) return
        if (!permsChecker.command(msg.author.id,msg.guild.id)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            msg.channel.permissionOverwrites.create(user.id, { ViewChannel:true, AddReactions:true,AttachFiles:true, EmbedLinks:true, SendMessages:true})
            msg.channel.send({embeds:[bot.embeds.commands.addEmbed(user,msg.author)]})

            var loguser = msg.mentions.users.first()
            log("command","someone used the 'add' command",[{key:"user",value:msg.author.tag}])
            log("system","user added to ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"added_user",value:loguser.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            APIEvents.onTicketAdd(msg.author,loguser,msg.channel,msg.guild,new Date(),{status:"open",name:msg.channel.name,ticketOptions:ticketData})

            APIEvents.onCommand("add",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        })
        
    })

    if (!DISABLE.commands.slash.add) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "add") return
        const user = interaction.options.getUser("user")

        if (!interaction.guild) return
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        await interaction.deferReply()

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            interaction.channel.permissionOverwrites.create(user.id, { ViewChannel:true, AddReactions:true,AttachFiles:true, EmbedLinks:true, SendMessages:true})
            interaction.editReply({embeds:[bot.embeds.commands.addEmbed(user,interaction.user)]})

            var loguser = user
            log("command","someone used the 'add' command",[{key:"user",value:interaction.user.tag}])
            log("system","user added to ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"added_user",value:loguser.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            APIEvents.onTicketAdd(interaction.user,loguser,interaction.channel,interaction.guild,new Date(),{status:"open",name:interaction.channel.name,ticketOptions:ticketData})
            APIEvents.onCommand("add",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
            
        })

       
    })
}