const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"rename")) return

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                msg.channel.send({content:"You are not in a ticket!"})
                return
            }
            

            if (!msg.member.permissions.has("MANAGE_CHANNELS") && !msg.member.permissions.has("ADMINISTRATOR")){
                return msg.channel.send({content:"You have no permissions to change the channel name!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
            }
            
            var newname = msg.content.split(config.prefix+"rename")[1].substring(1)
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
            msg.channel.send({content:"**The name is changed!**\nWarning: you can only change the channel name 2 times per minute! (this is due discord rate limits)"})

            console.log("[system] renamed a ticket via command")
            
        })
        
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "rename") return

        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                interaction.reply({content:"You are not in a ticket!"})
                return
            }
            
            const member = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (!member.permissions.has("MANAGE_CHANNELS") && !member.permissions.has("ADMINISTRATOR")){
                return interaction.reply({content:"You have no permissions to change the channel name!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
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
            interaction.reply({content:"**The name is changed!**\nWarning: you can only change the channel name 2 times per minute! (this is due discord rate limits)"})

            console.log("[system] renamed a ticket via command")
            
        })
    })
}