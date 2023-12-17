const discord = require('discord.js')
const bot = require('../../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const permissionChecker = require("../../../utils/permisssionChecker")
const storage = bot.storage
const embed = discord.EmbedBuilder
const mc = config.color
const permsChecker = require("../../../utils/permisssionChecker")

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

module.exports = () => {
    //CLAIM
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTclaimTicket") return
        
        try {
            await interaction.deferUpdate()
        }catch{}

        if (!interaction.guild) return

        const hiddendata = bot.hiddenData.readHiddenData(interaction.channel.id)
        if (hiddendata.length < 1) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
        const ticketId = hiddendata.find(d => d.key == "type").value

        if (!permsChecker.ticket(interaction.user.id,interaction.guild.id,ticketId)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        hiddendata.push({key:"claimedby",value:interaction.user.id})
        bot.hiddenData.writeHiddenData(interaction.channel.id,hiddendata)
        storage.set("claimData",interaction.channel.id,interaction.user.id)

        interaction.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            
            const newEmbed = new embed(firstmsg.embeds[0].data)
                .setFooter({text:"claimed by: "+interaction.user.username,iconURL:interaction.user.displayAvatarURL()})

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabledNoClaim],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim],embeds:[newEmbed]})
            }

            interaction.channel.send({embeds:[bot.embeds.commands.claimEmbed(interaction.user,interaction.user)]})
        })
    })
}