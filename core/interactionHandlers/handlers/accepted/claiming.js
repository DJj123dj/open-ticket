const discord = require('discord.js')
const bot = require('../../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const permissionChecker = require("../../../utils/permisssionChecker")
const storage = bot.storage
const hiddendata = bot.hiddenData
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
        if (!permsChecker.command(interaction.user.id,interaction.guild.id)){
            permsChecker.sendUserNoPerms(interaction.user)
            return
        }

        interaction.channel.messages.fetchPinned().then(msglist => {
            /**@type {discord.Message} */
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.editReply({embeds:[bot.errorLog.notInATicket]})
            const hdraw = bot.hiddenData.removeHiddenData(firstmsg.embeds[0].description)
            const hiddendata = hdraw.hiddenData
            const ticketId = hiddendata.data.find(d => d.key == "type").value

            hiddendata.data.push({key:"claimedby",value:interaction.user.id})
            storage.set("claimData",interaction.channel.id,interaction.user.id)
            
            const newEmbed = new embed(firstmsg.embeds[0].data)
                .setFooter({text:"claimed by: "+interaction.user.tag,iconURL:interaction.user.displayAvatarURL()})
                .setDescription(hdraw.description+bot.hiddenData.writeHiddenData(hiddendata.type,hiddendata.data))

            if (firstmsg.components[0].components[1] && firstmsg.components[0].components[1].disabled){
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowDisabledNoClaim],embeds:[newEmbed]})
            }else{
                firstmsg.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim],embeds:[newEmbed]})
            }

            interaction.channel.send({embeds:[bot.embeds.commands.claimEmbed(interaction.user,interaction.user)]})
        })
    })
}