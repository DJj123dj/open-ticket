const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const permsChecker = require("../core/utils/permisssionChecker")
const embed = discord.EmbedBuilder
const storage = bot.storage

const APIEvents = require("../core/api/modules/events")
const DISABLE = require("../core/api/api.json").disable

module.exports = () => {
    bot.errorLog.log("debug","COMMANDS: loaded unclaim.js")
    
    if (!DISABLE.commands.text.unclaim) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"unclaim")) return

        if (!msg.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(msg.channel.id)
        if (hiddendata.length < 1) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(msg.author.id,msg.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        const unclaimuser = storage.get("claimData",msg.channel.id)
        if (!unclaimuser || unclaimuser == "false") return msg.channel.send({embeds:[bot.errorLog.serverError("This ticket isn't claimed yet!")]})

        hiddendata.push({key:"claimedby",value:"false"})
        bot.hiddenData.writeHiddenData(msg.channel.id,hiddendata)
        storage.set("claimData",msg.channel.id,"false")

        msg.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            
            const newEmbed = new embed(firstmsg.embeds[0].data)

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            if (ticketData && ticketData.autoclose.enable){
                const footerText = l.commands.autocloseTitle.replace("{0}",ticketData.autoclose.inactiveHours+"h")
                newEmbed.setFooter({text:footerText})
            }else{
                newEmbed.setFooter(null)
            }

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabled],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormal],embeds:[newEmbed]})
            }

            msg.channel.send({embeds:[bot.embeds.commands.unclaimEmbed(msg.author)]})

            log("command","someone used the 'unclaim' command",[{key:"user",value:msg.author.username}])
            log("system","user unclaimed from ticket",[{key:"user",value:msg.author.username},{key:"ticket",value:msg.channel.name},{key:"unclaimed_user",value:unclaimuser}])

            
            APIEvents.onTicketUnclaim(msg.author,msg.channel,msg.guild,new Date(),{status:"open",name:msg.channel.name,ticketOptions:ticketData})
            APIEvents.onCommand("unclaim",permsChecker.ticket(msg.author.id,msg.guild.id,ticketId),msg.author,msg.channel,msg.guild,new Date())
        }) 
    })

    if (!DISABLE.commands.slash.unclaim) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "unclaim") return

        if (!interaction.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(interaction.user)
            interaction.reply({content:":x: "+l.errors.noPermsTitle,ephemeral:true})
            return
        }

        await interaction.deferReply()

        const unclaimuser = storage.get("claimData",interaction.channel.id)
        if (!unclaimuser || unclaimuser == "false") return interaction.editReply({embeds:[bot.errorLog.serverError("This ticket isn't claimed yet!")]})

        hiddendata.push({key:"claimedby",value:"false"})
        bot.hiddenData.writeHiddenData(interaction.channel.id,hiddendata)
        storage.set("claimData",interaction.channel.id,"false")

        interaction.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})

            const newEmbed = new embed(firstmsg.embeds[0].data)

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            if (ticketData && ticketData.autoclose.enable){
                const footerText = l.commands.autocloseTitle.replace("{0}",ticketData.autoclose.inactiveHours+"h")
                newEmbed.setFooter({text:footerText})
            }else{
                newEmbed.setFooter(null)
            }

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabled],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormal],embeds:[newEmbed]})
            }

            interaction.editReply({embeds:[bot.embeds.commands.unclaimEmbed(interaction.user)]})

            log("command","someone used the 'unclaim' command",[{key:"user",value:interaction.user.username}])
            log("system","user unclaimed from ticket",[{key:"user",value:interaction.user.username},{key:"ticket",value:interaction.channel.name},{key:"unclaimed_user",value:unclaimuser}])

            APIEvents.onTicketUnclaim(interaction.user,interaction.channel,interaction.guild,new Date(),{status:"open",name:interaction.channel.name,ticketOptions:ticketData})
            APIEvents.onCommand("unclaim",permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId),interaction.user,interaction.channel,interaction.guild,new Date())
        })
    })
}