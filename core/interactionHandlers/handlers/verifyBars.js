const discord = require('discord.js')
const bot = require('../../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const storage = bot.storage
const hiddendata = bot.hiddenData
const embed = discord.EmbedBuilder
const mc = config.color

const button = discord.ButtonBuilder
const arb = discord.ActionRowBuilder
const bs = discord.ButtonStyle

module.exports = () => {
    //CLOSE
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicket") return
        
        try {
            await interaction.deferUpdate()
        } catch{}
        interaction.message.edit({components:[bot.buttons.verifybars.closeVerifyBar]})
        
    })
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTcloseTicketFalse") return
        
        try {
            await interaction.deferUpdate()
        } catch{}

        if (interaction.message.pinned && interaction.message.author.id == client.user.id){
            const claimdata = storage.get("claimData",interaction.channel.id)
            if (claimdata && claimdata != "false"){
                interaction.message.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim]})
            }else{
                interaction.message.edit({components:[bot.buttons.firstmsg.firstmsgRowNormal]})
            }
        }else{
            interaction.message.edit({components:[bot.buttons.close.openRowNormal]})
        }
    })

    //DELETE
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicket") return
        
        try {
            await interaction.deferUpdate()
        } catch{}
        interaction.message.edit({components:[bot.buttons.verifybars.deleteVerifyBar]})
        
    })
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicketFalse") return
        
        try {
            await interaction.deferUpdate()
        } catch{}
        
        if (interaction.message.pinned && interaction.message.author.id == client.user.id){
            const claimdata = storage.get("claimData",interaction.channel.id)
            if (claimdata && claimdata != "false"){
                interaction.message.edit({components:[bot.buttons.firstmsg.firstmsgRowNormalNoClaim]})
            }else{
                interaction.message.edit({components:[bot.buttons.firstmsg.firstmsgRowNormal]})
            }
        }else{
            interaction.message.edit({components:[bot.buttons.close.openRowNormal]})
        }
    })

    //DELETE NO TRANSCRIPT
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicket1") return
        
        try {
            await interaction.deferUpdate()
        } catch{}
        interaction.message.edit({components:[bot.buttons.verifybars.delete1VerifyBar]})
        
    })
    client.on("interactionCreate",async interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "OTdeleteTicketFalse1") return
        
        try {
            await interaction.deferUpdate()
        } catch{}
        interaction.message.edit({components:[bot.buttons.close.closeCommandRow]})
    })
}