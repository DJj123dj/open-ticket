const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"remove")) return
        var user = msg.mentions.users.first()
        if (!user){
            return msg.channel.send({content:"**There is no user to remove:**\nuse: `"+config.prefix+"remove <user>`"})
        }

        if (!msg.member.permissions.has("MANAGE_CHANNELS") && !msg.member.permissions.has("ADMINISTRATOR")){
            return msg.channel.send({content:"You have no permissions to remove someone from the channel!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                msg.channel.send({content:"You are not in a ticket!"})
                return
            }

            msg.channel.permissionOverwrites.delete(user.id)
            msg.channel.send({content:"Deleted "+user.tag+" from the ticket"})
            if (config.logs){console.log("[system] deleted user from ticket (name:"+user.username+",ticket:"+msg.channel.name+")")}

            var loguser = msg.mentions.users.first()
            if (config.logs){console.log("[command] "+config.prefix+"remove "+loguser.username+" (user:"+msg.author.username+")")}
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "remove") return
        const user = interaction.options.getUser("user")
        const member = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)

        if (!member.permissions.has("MANAGE_CHANNELS") && !member.permissions.has("ADMINISTRATOR")){
            return interaction.reply({content:"You have no permissions to remove someone from the channel!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
        }


        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                interaction.reply({content:"You are not in a ticket!"})
                return
            }

            interaction.channel.permissionOverwrites.delete(user.id)
            interaction.reply({content:"Deleted "+user.tag+" from the ticket"})
            if (config.logs){console.log("[system] removed user from ticket (name:"+user.username+",ticket:"+interaction.channel.name+")")}

            var loguser = user
            if (config.logs){console.log("[command] "+config.prefix+"remove "+loguser.username+" (user:"+interaction.user.username+")")}
        })

       
    })
}