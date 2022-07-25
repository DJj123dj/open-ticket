const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"delete")) return

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
            
            const closebutton = new discord.ActionRowBuilder()
            .addComponents([
                new discord.ButtonBuilder()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("❌")
            ])

            msg.channel.send({embeds:[bot.errorLog.success(l.commands.deleteTitle,l.commands.deleteDescription)],components:[closebutton]})

            log("command","someone used the 'delete' command",[{key:"user",value:msg.author.tag}])
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "delete") return

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.reply({embeds:[bot.errorLog.noPermsMessage],ephemeral:true})
                return
            }

       interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return interaction.reply({embeds:[bot.errorLog.notInATicket]})
            
            const closebutton = new discord.ActionRowBuilder()
            .addComponents([
                new discord.ButtonBuilder()
                    .setCustomId("deleteTicketTrue")
                    .setDisabled(false)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setEmoji("❌")
            ])

            interaction.reply({embeds:[bot.errorLog.success(l.commands.deleteTitle,l.commands.deleteDescription)],components:[closebutton]})

            log("command","someone used the 'close' command",[{key:"user",value:interaction.user.tag}])
            
        })
    })
}