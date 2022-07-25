const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"add")) return
        var user = msg.mentions.users.first()
        if (!user) return msg.channel.send({embeds:[bot.errorLog.invalidArgsMessage(l.errors.missingArgsDescription+" `<user>`:\n`"+config.prefix+"add <user>`")]})

        if (!msg.member.permissions.has("ManageChannels") && !msg.member.permissions.has("Administrator") && config.main_adminroles.some((item)=>{return msg.member.roles.cache.has(item)}) == false){
            try {
                return msg.member.send({embeds:[bot.errorLog.noPermsMessage]})
            }catch{
                return msg.channel.send({embeds:[bot.errorLog.noPermsMessage]})
            }
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            msg.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            msg.channel.send({embeds:[bot.errorLog.success(l.commands.userAddedTitle,l.commands.userAddedDescription.replace("{0}",user.tag))]})

            var loguser = msg.mentions.users.first()
            log("command","someone used the 'add' command",[{key:"user",value:msg.author.tag}])
            log("system","user added to ticket",[{key:"user",value:msg.author.tag},{key:"ticket",value:msg.channel.name},{key:"added_user",value:loguser.tag}])
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "add") return
        const user = interaction.options.getUser("user")

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage],ephemeral:true})
                return
            }

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})

            interaction.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            interaction.reply({embeds:[bot.errorLog.success(l.commands.userAddedTitle,l.commands.userAddedDescription.replace("{0}",user.tag))]})

            var loguser = user
            log("command","someone used the 'add' command",[{key:"user",value:interaction.user.tag}])
            log("system","user added to ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name},{key:"added_user",value:loguser.tag}])
        })

       
    })
}