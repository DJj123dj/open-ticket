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
    bot.errorLog.log("debug","COMMANDS: loaded unclaim.js")
    
    if (!DISABLE.commands.text.unclaim) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"unclaim")) return

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

            
            //msg.channel.send({embeds:[bot.embeds.commands.unclaimEmbed(msg.author)]})
            msg.channel.send({embeds:[bot.errorLog.warning("Coming soon!","This feature isn't ready yet!\nIt will become active in the next update!")]})

            var loguser = msg.author
            log("command","someone used the 'unclaim' command",[{key:"user",value:msg.author.tag}])
            log("system","user unclaimed from ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"unclaimed_user",value:msg.author.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            //APIEvents.onTicketAdd(msg.author,loguser,msg.channel,msg.guild,new Date(),{status:"open",name:msg.channel.name,ticketOptions:ticketData})
            //APIEvents.onCommand("add",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        })
        
    })

    if (!DISABLE.commands.slash.unclaim) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "unclaim") return
        const user = interaction.user

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

            //interaction.editReply({embeds:[bot.embeds.commands.unclaimEmbed(interaction.user)]})
            interaction.editReply({embeds:[bot.errorLog.warning("Coming soon!","This feature isn't ready yet!\nIt will become active in the next update!")]})

            var loguser = user
            log("command","someone used the 'unclaim' command",[{key:"user",value:interaction.user.tag}])
            log("system","user unclaimed from ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"unclaimed_user",value:loguser.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            //APIEvents.onTicketAdd(interaction.user,loguser,interaction.channel,interaction.guild,new Date(),{status:"open",name:interaction.channel.name,ticketOptions:ticketData})
            //APIEvents.onCommand("add",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
            
        })

       
    })
}