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
    bot.errorLog.log("debug","COMMANDS: loaded stats.js")

    if (!DISABLE.commands.text.stats) client.on("messageCreate",async (msg) => {
        if (!msg.content.startsWith(config.prefix+"stats global") && !msg.content.startsWith(config.prefix+"stats ticket") && !msg.content.startsWith(config.prefix+"stats user")) return
        if (!msg.guild) return

        /**@type {"global"|"ticket"|"user"} */
        const mode = msg.content.split(config.prefix+"stats ")[1]

        if (mode == "global"){
            //send global stats
            msg.channel.send({embeds:[await bot.statsManager.createGlobalStatsEmbed()]})

        }else if (mode == "user"){
            //send user stats
            const mention = msg.mentions.users.first()
            if (mention){
                //get user from mention
                if (!bot.statsManager.existStats("user","TICKETS_CREATED",mention.id)){
                    msg.channel.send({embeds:[bot.errorLog.serverError(l.stats.errorUserNotFound)]})
                    return
                }
                msg.channel.send({embeds:[await bot.statsManager.createUserStatsEmbed(msg.guild,mention,msg.channel.id)]})
            }else{
                //use author as user
                if (!bot.statsManager.existStats("user","TICKETS_CREATED",msg.author.id)){
                    msg.channel.send({embeds:[bot.errorLog.serverError(l.stats.errorUserNotFound)]})
                    return
                }
                msg.channel.send({embeds:[await bot.statsManager.createUserStatsEmbed(msg.guild,msg.author,msg.channel.id)]})
            }

        }else if (mode == "ticket"){
            //send ticket stats
            if (!bot.statsManager.existStats("ticket","STATUS",msg.channel.id)){
                msg.channel.send({embeds:[bot.errorLog.notInATicket]})
                return
            }
            msg.channel.send({embeds:[await bot.statsManager.createTicketStatsEmbed(msg.guild,msg.channel.id)]})
        }  
        
        log("command","someone used the 'stats' command",[{key:"user",value:msg.author.username},{key:"mode",value:mode}])
        APIEvents.onCommand("stats",true,msg.author,msg.channel,msg.guild,new Date())
    })

    if (!DISABLE.commands.slash.stats) client.on("interactionCreate",async (interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "stats") return
        if (!interaction.guild) return

        /**@type {"global"|"ticket"|"user"} */
        const mode = interaction.options.getSubcommand(true)

        await interaction.deferReply()
            
        if (mode == "global"){
            //send global stats
            interaction.editReply({embeds:[await bot.statsManager.createGlobalStatsEmbed()]})

        }else if (mode == "user"){
            //send user stats
            const mention = interaction.options.getUser("user",false)
            if (mention){
                //get user from mention
                if (!bot.statsManager.existStats("user","TICKETS_CREATED",mention.id)){
                    interaction.editReply({embeds:[bot.errorLog.serverError(l.stats.errorUserNotFound)]})
                    return
                }
                interaction.editReply({embeds:[await bot.statsManager.createUserStatsEmbed(interaction.guild,mention,interaction.channel.id)]})
            }else{
                //use author as user
                if (!bot.statsManager.existStats("user","TICKETS_CREATED",interaction.user.id)){
                    interaction.editReply({embeds:[bot.errorLog.serverError(l.stats.errorUserNotFound)]})
                    return
                }
                interaction.editReply({embeds:[await bot.statsManager.createUserStatsEmbed(interaction.guild,interaction.user,interaction.channel.id)]})
            }

        }else if (mode == "ticket"){
            //send ticket stats
            if (!bot.statsManager.existStats("ticket","STATUS",interaction.channel.id)){
                interaction.editReply({embeds:[bot.errorLog.notInATicket]})
                return
            }
            interaction.editReply({embeds:[await bot.statsManager.createTicketStatsEmbed(interaction.guild,interaction.channel.id)]})
        }

        log("command","someone used the 'stats' command",[{key:"user",value:interaction.user.username},{key:"mode",value:mode}])
        APIEvents.onCommand("stats",true,interaction.user,interaction.channel,interaction.guild,new Date())
    })
}