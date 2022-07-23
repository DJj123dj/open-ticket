const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

module.exports = async () => {
    const chalk = await (await import("chalk")).default
    
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("newR")) return

        interaction.deferUpdate()

        if (interaction.customId.startsWith("newR")){
            const optionid = interaction.customId.split("newR")[1]
            if (!optionid){
                interaction.reply({embeds:[bot.errorLog.serverError(l.errors.roleDoesntExist)]})
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
        
                        log("system","added role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                    })
                }else if (mode == "remove"){
                    option.roles.forEach((role) => {
                        interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                        
                        log("system","removed role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                    })
                }else if (mode == "add&remove"){
                    option.roles.forEach((role) => {
                        if (interaction.guild.members.cache.find(u => u.id == user.id).roles.cache.has(role)){
                            interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                            
                            log("system","added role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                        }else {
                            interaction.guild.members.cache.find(u => u.id == user.id).roles.add(role)
                            
                            log("system","removed role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                        }
                    })
                }
                    
            }catch{
                interaction.channel.send({embeds:[bot.errorLog.serverError(l.errors.somethingWentWrong)]})
            }
        }
    })
}