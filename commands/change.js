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

    if (!DISABLE.commands.text.change) client.on("messageCreate", async msg => {
        if (!msg.content.startsWith(config.prefix+"change")) return
        if (!msg.channel.isTextBased()) return

        if (!msg.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(msg.channel.id)
        if (hiddendata.length < 1) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(msg.author.id,msg.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }
            
        const list = []
        config.options.forEach((o) => {
            if (o.type == "ticket") list.push(o.id)
        })

        var newtype = msg.content.split(config.prefix+"change")[1].substring(1)
        if (!newtype) return msg.channel.send({embeds:[bot.errorLog.invalidIdChooseFromList(list,l.errors.missingArgsDescription+" `<type>`:\n`"+config.prefix+"change <type>`")]})

        const newTicket = require("../core/utils/configParser").getTicketById(newtype,true)
        if (!newTicket) return msg.channel.send({embeds:[bot.errorLog.invalidIdChooseFromList(list,l.errors.missingArgsDescription+" `<type>`:\n`"+config.prefix+"change <type>`")]})

        /**@type {discord.PermissionOverwriteManager} */
        const prePermsManager = msg.channel.permissionOverwrites
        const prePerms = prePermsManager.cache
        
        /**@type {String} */
        var chName = msg.channel.name
        const splitted = chName.split("-")
        const prefix = splitted.shift()
        const name = (splitted.length > 0) ? splitted.join("-") : prefix

        if (newTicket.category){
            const parent = await msg.guild.channels.fetch(newTicket.category,{cache:true})
            if (parent && parent.type == discord.ChannelType.GuildCategory) msg.channel.setParent(parent)
        }

        prePermsManager.set(prePerms)
        msg.channel.setName(newTicket.channelprefix+name).catch(() => {
            msg.channel.send({embeds:[bot.errorLog.failedRenameChannel]})
        })

        hiddendata.find((value,index) => {
            if (value.key == "type"){
                hiddendata[index] = {key:"type",value:newtype}
            }
        })

        msg.channel.send({embeds:[bot.embeds.commands.changeEmbed(msg.author,newtype)]})

        log("command","someone used the 'change' command",[{key:"user",value:msg.author.username}])
        log("system","ticket type changed",[{key:"user",value:msg.author.username},{key:"ticket",value:name},{key:"newtype",value:newtype}])
        APIEvents.onCommand("change",permsChecker.ticket(msg.author.id,msg.guild.id,ticketId),msg.author,msg.channel,msg.guild,new Date())
    })

    if (!DISABLE.commands.slash.change) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "change") return
        if (!interaction.channel.isTextBased()) return

        if (!interaction.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        await interaction.deferReply()
            
        const list = []
        config.options.forEach((o) => {
            if (o.type == "ticket") list.push(o.id)
        })

        var newtype = interaction.options.getString("type",true)
        const newTicket = require("../core/utils/configParser").getTicketById(newtype,true)
        
        if (!newTicket) return interaction.editReply({embeds:[bot.errorLog.invalidIdChooseFromList(list,l.errors.missingArgsDescription+" `<type>`:\n`"+config.prefix+"change <type>`")]})

        /**@type {discord.PermissionOverwriteManager} */
        const prePermsManager = interaction.channel.permissionOverwrites
        const prePerms = prePermsManager.cache
        
        /**@type {String} */
        var chName = interaction.channel.name
        const splitted = chName.split("-")
        const prefix = splitted.shift()
        const name = (splitted.length > 0) ? splitted.join("-") : prefix

        if (newTicket.category){
            const parent = await interaction.guild.channels.fetch(newTicket.category,{cache:true})
            if (parent && parent.type == discord.ChannelType.GuildCategory) interaction.channel.setParent(parent)
        }

        prePermsManager.set(prePerms)
        interaction.channel.setName(newTicket.channelprefix+name).catch(() => {
            interaction.channel.send({embeds:[bot.errorLog.failedRenameChannel]})
        })

        hiddendata.find((value,index) => {
            if (value.key == "type"){
                hiddendata[index] = {key:"type",value:newtype}
            }
        })
        
        interaction.editReply({embeds:[bot.embeds.commands.changeEmbed(interaction.user,newtype)]})

        log("command","someone used the 'change' command",[{key:"user",value:interaction.user.username}])
        log("system","ticket type changed",[{key:"user",value:interaction.user.username},{key:"ticket",value:name},{key:"newtype",value:newtype}])
        APIEvents.onCommand("change",permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId),interaction.user,interaction.channel,interaction.guild,new Date())
    })
}