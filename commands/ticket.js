const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    /**@type {String[]} */
    var msgIds = []
    config.messages.forEach((msg) => {
        msgIds.push(msg.id)
    })


    client.on("messageCreate", msg => {
        if (msg.content.startsWith(config.prefix+"msg"||config.prefix+"message")){
            if (config.main_adminroles.some((item)=>{return msg.member.roles.cache.has(item)}) == false){
                msg.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }

            const id = msg.content.split(config.prefix+"msg")[1].substring(1) ? msg.content.split(config.prefix+"msg")[1].substring(1) : false

            if (!id) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<id>`:\n`"+config.prefix+"msg <id>`")]})
            if (!msgIds.includes(id)) return msg.channel.send({embeds:[bot.errorLog.invalidIdChooseFromList(msgIds)]})


            const {embed,componentRows} = require("../core/ticketMessageEmbed").createEmbed(id)
            
            msg.channel.send({embeds:[embed],components:componentRows})
            
            log("command","someone used the 'msg' command",[{key:"user",value:msg.author.tag},{key:"id",value:id}])
        }
    })

    client.on("interactionCreate", (interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "message") return

            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return interaction.guild.members.cache.find((m) => m.id == interaction.member.id).roles.cache.has(item)}) == false && permsmember.permissions.has("ADMINISTRATOR")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage]})
                return
            }

            const id = interaction.options.getString("id")

            if (!msgIds.includes(id)) return interaction.reply({embeds:[bot.errorLog.invalidIdChooseFromList(msgIds)]})

            const {embed,componentRows} = require("../core/ticketMessageEmbed").createEmbed(id)
            
            interaction.reply({content:l.commands.ticketWarning})
            interaction.channel.send({embeds:[embed],components:componentRows})
            
            log("command","someone used the 'msg' command",[{key:"user",value:interaction.user.tag},{key:"id",value:id}])
        
    })
}