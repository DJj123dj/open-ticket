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
    bot.errorLog.log("debug","COMMANDS: loaded claim.js")
    
    if (!DISABLE.commands.text.claim) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"claim")) return
        var user = msg.mentions.users.first()
        
        const claimingUser = user ? user : msg.author

        if (!msg.guild) return
        if (!permsChecker.command(msg.author.id,msg.guild.id)){
            permsChecker.sendUserNoPerms(msg.author)
            return
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})
            const hdraw = bot.hiddenData.removeHiddenData(firstmsg.embeds[0].description)
            const hiddendata = hdraw.hiddenData
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            hiddendata.data.push({key:"claimedby",value:claimingUser.id})
            storage.set("claimData",msg.channel.id,claimingUser.id)
            
            const newEmbed = new embed(firstmsg.embeds[0].data)
                .setFooter({text:"claimed by: "+msg.author.tag,iconURL:msg.author.displayAvatarURL()})
                .setDescription(hdraw.description+bot.hiddenData.writeHiddenData(hiddendata.type,hiddendata.data))

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabledNoClaim],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim],embeds:[newEmbed]})
            }

            msg.channel.send({embeds:[bot.embeds.commands.claimEmbed(claimingUser,msg.author)]})

            log("command","someone used the 'claim' command",[{key:"user",value:msg.author.tag}])
            log("system","user claimed to ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"claimed_user",value:claimingUser.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            APIEvents.onTicketClaim(msg.author,loguser,msg.channel,msg.guild,new Date(),{status:"open",name:msg.channel.name,ticketOptions:ticketData})
            APIEvents.onCommand("claim",permsChecker.command(msg.author.id,msg.guild.id),msg.author,msg.channel,msg.guild,new Date())
        }) 
    })

    if (!DISABLE.commands.slash.claim) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "claim") return
        const user = interaction.options.getUser("user",false) ? interaction.options.getUser("user",true) : interaction.user

        if (!interaction.guild) return
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
            return interaction.reply({content:":x: "+l.errors.noPermsTitle,ephemeral:true})
        }

        await interaction.deferReply()

        interaction.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            const hdraw = bot.hiddenData.removeHiddenData(firstmsg.embeds[0].description)
            const hiddendata = hdraw.hiddenData
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            hiddendata.data.push({key:"claimedby",value:user.id})
            storage.set("claimData",interaction.channel.id,user.id)
            
            const newEmbed = new embed(firstmsg.embeds[0].data)
                .setFooter({text:"claimed by: "+user.tag,iconURL:user.displayAvatarURL()})
                .setDescription(hdraw.description+bot.hiddenData.writeHiddenData(hiddendata.type,hiddendata.data))

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabledNoClaim],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim],embeds:[newEmbed]})
            }

            interaction.editReply({embeds:[bot.embeds.commands.claimEmbed(user,interaction.user)]})

            log("command","someone used the 'claim' command",[{key:"user",value:interaction.user.tag}])
            log("system","user claimed to ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"claimed_user",value:user.tag}])

            const ticketData = require("../core/utils/configParser").getTicketById(ticketId,true)
            APIEvents.onTicketClaim(interaction.user,user,interaction.channel,interaction.guild,new Date(),{status:"open",name:interaction.channel.name,ticketOptions:ticketData})
            APIEvents.onCommand("claim",permsChecker.command(interaction.user.id,interaction.guild.id),interaction.user,interaction.channel,interaction.guild,new Date())
        })
    })
}