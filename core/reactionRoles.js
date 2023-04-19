const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

const APIEvents = require("./api/modules/events")

module.exports = async () => {
    const chalk = await (await import("chalk")).default
    
    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isButton() && !interaction.isStringSelectMenu()) return
        if (interaction.isButton() && !interaction.customId.startsWith("newR")) return
        if (interaction.isStringSelectMenu() && !(interaction.customId == "OTdropdownMenu")) return

        bot.actionRecorder.push({
            category:"ot.managers.reactionroles",
            file:"./core/reactionRoles.js",
            time:new Date().getTime(),
            type:"reactionRoles.interactionCreated"
        })


        const optionidRaw = interaction.isStringSelectMenu() ? interaction.values[0] : interaction.customId
        if (!optionidRaw.includes("newR")) return
        const optionid = optionidRaw.split("newR")[1]
        if (!optionid){
            interaction.reply({embeds:[bot.errorLog.serverError(l.errors.roleDoesntExist)]})
            return
        }else{
            try {
                await interaction.deferUpdate()
            } catch{}
        }

        try {

            const option = require("./utils/getButton").getOption(optionid)
            /**@type {"add"|"remove"|"add&remove"} */
            const mode = option.mode
            const user = interaction.member
            
            if (mode == "add"){
                bot.actionRecorder.push({
                    category:"ot.managers.reactionroles",
                    file:"./core/reactionRoles.js",
                    time:new Date().getTime(),
                    type:"reactionRoles.type.add"
                })
                option.roles.forEach((role) => {
                    interaction.guild.members.cache.find(u => u.id == user.id).roles.add(role)
    
                    log("system","added role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                    const apirole = interaction.guild.roles.cache.find(r => r.id == role)
                    APIEvents.onReactionRole("add","add",apirole,interaction.user,interaction.channel,interaction.guild,new Date())
                })

            }else if (mode == "remove"){
                bot.actionRecorder.push({
                    category:"ot.managers.reactionroles",
                    file:"./core/reactionRoles.js",
                    time:new Date().getTime(),
                    type:"reactionRoles.type.remove"
                })
                option.roles.forEach((role) => {
                    interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                    
                    log("system","removed role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                    const apirole = interaction.guild.roles.cache.find(r => r.id == role)
                    APIEvents.onReactionRole("remove","remove",apirole,interaction.user,interaction.channel,interaction.guild,new Date())
                })
                
            }else if (mode == "add&remove"){
                bot.actionRecorder.push({
                    category:"ot.managers.reactionroles",
                    file:"./core/reactionRoles.js",
                    time:new Date().getTime(),
                    type:"reactionRoles.type.add&remove"
                })
                option.roles.forEach((role) => {
                    if (!interaction.guild.members.cache.find(u => u.id == user.id).roles.cache.has(role)){
                        interaction.guild.members.cache.find(u => u.id == user.id).roles.add(role)
                        
                        log("system","added role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                        const apirole = interaction.guild.roles.cache.find(r => r.id == role)
                        APIEvents.onReactionRole("add","add&remove",apirole,interaction.user,interaction.channel,interaction.guild,new Date())
                    }else {
                        interaction.guild.members.cache.find(u => u.id == user.id).roles.remove(role)
                        
                        log("system","removed role (reaction roles)",[{key:"user",value:interaction.user.tag},{key:"role",value:role}])
                        const apirole = interaction.guild.roles.cache.find(r => r.id == role)
                        APIEvents.onReactionRole("remove","add&remove",apirole,interaction.user,interaction.channel,interaction.guild,new Date())
                    }
                })
            }
                
        }catch{
            interaction.channel.send({embeds:[bot.errorLog.serverError(l.errors.somethingWentWrong)]})
        }
    })
}