const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

module.exports = () => {
    var reopenCommandBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("reopenTicket1")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setEmoji("🔓")
        )
    
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"reopen")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return msg.channel.send({embeds:[bot.errorLog.notInATicket]})

            msg.channel.send({embeds:[bot.errorLog.success("Re-Open this ticket!","You can re-open this ticket by clicking on the button below!")],components:[reopenCommandBar]})

            
            log("command","someone used the 'reopen' command",[{key:"user",value:msg.author.tag}])
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