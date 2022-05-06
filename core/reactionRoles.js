const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

const storage = bot.storage

module.exports = async () => {
    const chalk = await (await import("chalk")).default
    
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("newR")) return

        interaction.deferUpdate()

        const optionid = interaction.customId.split("newR")[1]
        if (!optionid){
            interaction.reply({content:"This button doesn't exist anymore"})
            return
        }

        try {

        const option = require("./utils/getButton").getOption(optionid)
        /**@type {"add"|"remove"|"add&remove"} */
        const mode = option.mode
        const user = interaction.member
        
        if (mode == "add"){
            option.roles.forEach((role) => {
                interaction.guild.members.cache.find(u => u.id == user.id).roles.add(role)
                console.log("[system] added role",role,"to",user.user.tag)
            })
        }else if (mode == "remove"){
            option.roles.forEach((role) => {
                interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                console.log("[system] removed role",role,"from",user.user.tag)
            })
        }else if (mode == "add&remove"){
            option.roles.forEach((role) => {
                if (interaction.guild.members.cache.find(u => u.id == user.id).roles.cache.has(role)){
                    interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                    console.log("[system] removed role",role,"from",user.user.tag)
                }else {
                    interaction.guild.members.cache.find(u => u.id == user.id).roles.add(role)
                    console.log("[system] added role",role,"to",user.user.tag)
                }
            })
        }
            
        }catch{
            interaction.reply({ephemeral:true,content:"Something went wrong! Contact the owner of this bot for more information"})
        }
    })
}