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
    bot.errorLog.log("debug","COMMANDS: loaded change.js")

    if (!DISABLE.commands.text.change) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"change")) return

        if (!msg.guild) return
        if (!permsChecker.command(msg.author.id,msg.guild.id)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        msg.channel.messages.fetchPinned().then(async msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value
            
            var newtype = msg.content.split(config.prefix+"change")[1].substring(1)
            if (!newtype) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<type>`:\n`"+config.prefix+"change <type>`")]})

            const newTicket = require("../core/utils/configParser").getTicketById(newtype)
            const list = []
            config.options.forEach((o) => list.push(o.id))
            if (!newTicket) return bot.errorLog.invalidIdChooseFromList(list)

            /**@type {String} */
            var chName = msg.channel.name
            const splitted = chName.split("-")
            const prefix = splitted.shift()
            const name = (splitted.length > 0) ? splitted.join("-") : prefix
            
            if (newTicket.category){
                const parent = await msg.guild.channels.fetch(newTicket.category,{cache:true})
                if (parent && parent.type == discord.ChannelType.GuildCategory) msg.channel.setParent(parent)
            }
            
            msg.channel.setName(newTicket.channelprefix+name)
            msg.channel.send({embeds:[bot.embeds.commands.changeEmbed(msg.author,newtype)]})

            log("command","someone used the 'change' command",[{key:"user",value:msg.author.tag}])
            log("system","ticket type changed",[{key:"user",value:msg.author.tag},{key:"ticket",value:name},{key:"newtype",value:newtype}])
            APIEvents.onCommand("change",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        })
    })

    if (!DISABLE.commands.slash.change) client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "change") return

        if (!interaction.guild) return
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        //interaction.deferReply()
        interaction.channel.messages.fetchPinned().then(async msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value
            
            var newtype = interaction.options.getString("type",true)
            if (!newtype) return interaction.reply({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<type>`:\n`"+config.prefix+"change <type>`")]})

            const newTicket = require("../core/utils/configParser").getTicketById(newtype,true)
            const list = []
            config.options.forEach((o) => list.push(o.id))
            if (!newTicket) return bot.errorLog.invalidIdChooseFromList(list)

            /**@type {String} */
            var chName = interaction.channel.name
            const splitted = chName.split("-")
            const prefix = splitted.shift()
            const name = (splitted.length > 0) ? splitted.join("-") : prefix

            if (newTicket.category){
                const parent = await interaction.guild.channels.fetch(newTicket.category,{cache:true})
                if (parent && parent.type == discord.ChannelType.GuildCategory) interaction.channel.setParent(parent)
            }

            interaction.channel.setName(newTicket.channelprefix+name)
            interaction.reply({embeds:[bot.embeds.commands.changeEmbed(interaction.user,newtype)]})

            log("command","someone used the 'change' command",[{key:"user",value:interaction.user.tag}])
            log("system","ticket type changed",[{key:"user",value:interaction.user.tag},{key:"ticket",value:name},{key:"newtype",value:newtype}])
            APIEvents.onCommand("change",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
        })
    })
}