const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"rename")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            if (!msg.member.permissions.has("ManageChannels") && !msg.member.permissions.has("Administrator") && config.main_adminroles.some((item)=>{return msg.member.roles.cache.has(item)}) == false){
                try {
                    return msg.member.send({embeds:[bot.errorLog.noPermsMessage]})
                }catch{
                    return msg.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                }
            }
            
            var newname = msg.content.split(config.prefix+"rename")[1].substring(1)

            if (!newname) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<name>`:\n`"+config.prefix+"rename <name>`")]})

            var name = msg.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            if (!prefix) prefix = "noprefix-"

            msg.channel.setName(prefix+newname)
            msg.channel.send({embeds:[bot.errorLog.success(l.commands.renameTitle,l.commands.renameWarning)]})

            log("command","someone used the 'rename' command",[{key:"user",value:msg.author.tag}])
            log("system","ticket renamed",[{key:"user",value:msg.author.tag},{key:"ticket",value:name},{key:"newname",value:newname}])
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "rename") return

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id)return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage],ephemeral:true})
                return
            }
            
            var newname = interaction.options.getString("name")
            var name = interaction.channel.name
            var prefix = ""
            const tickets = config.options
            tickets.forEach((ticket) => {
                if (name.startsWith(ticket.channelprefix)){
                    prefix = ticket.channelprefix
                }
            })

            if (!prefix) prefix = "noprefix-"

            interaction.channel.setName(prefix+newname)
            interaction.reply({embeds:[bot.errorLog.success(l.commands.renameTitle,l.commands.renameWarning)]})

            log("command","someone used the 'rename' command",[{key:"user",value:interaction.user.tag}])
            log("system","ticket renamed",[{key:"user",value:interaction.user.tag},{key:"ticket",value:name},{key:"newname",value:newname}])
            
        })
    })
}