const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"add")) return
        var user = msg.mentions.users.first()
        if (!user) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage("Missing Argument `<user>`:\n`"+config.prefix+"add <user>`")]})

        if (!msg.member.permissions.has("MANAGE_CHANNELS") && !msg.member.permissions.has("ADMINISTRATOR")){
            return msg.channel.send({embeds:[bot.errorLog.noPermsMessage]})
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            msg.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            msg.channel.send({embeds:[bot.errorLog.success("User Added!",user.tag+" is added to this ticket")]})

            var loguser = msg.mentions.users.first()
            log("command","someone used the 'add' command",[{key:"user",value:msg.author.tag}])
            log("system","user added to ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"added_user",value:loguser.tag}])
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "add") return
        const user = interaction.options.getUser("user")

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return interaction.guild.members.cache.find((m) => m.id == interaction.member.id).roles.cache.has(item)}) == false && permsmember.permissions.has("ADMINISTRATOR")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage]})
                return
            }


        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})

            interaction.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            interaction.reply({embeds:[bot.errorLog.success("User Added!",user.tag+" is added to this ticket")]})

            var loguser = user
            log("command","someone used the 'add' command",[{key:"user",value:interaction.user.tag}])
            log("system","user added to ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"added_user",value:loguser.tag}])
        })

       
    })
}