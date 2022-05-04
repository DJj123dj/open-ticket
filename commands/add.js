const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

module.exports = () => {
    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix+"add")) return
        var user = msg.mentions.users.first()
        if (!user){
            return msg.channel.send({content:"**There is no user to add:**\nuse: `"+config.prefix+"add <user>`"})
        }

        if (!msg.member.permissions.has("MANAGE_CHANNELS") && !msg.member.permissions.has("ADMINISTRATOR")){
            return msg.channel.send({content:"You have no permissions to add someone to the channel!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
        }

        msg.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                msg.channel.send({content:"You are not in a ticket!"})
                return
            }

            msg.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            msg.channel.send({content:"Added "+user.tag+" to the ticket"})
            if (config.logs){console.log("[system] added user to ticket (name:"+user.username+",ticket:"+msg.channel.name+")")}

            var loguser = msg.mentions.users.first()
            if (config.logs){console.log("[command] "+config.prefix+"add "+loguser.username+" (user:"+msg.author.username+")")}
        })
        
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "add") return
        const user = interaction.options.getUser("user")
        const member = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)

        if (!member.permissions.has("MANAGE_CHANNELS") && !member.permissions.has("ADMINISTRATOR")){
            return interaction.reply({content:"You have no permissions to add someone to the channel!\nYou need the `ADMINISTRATOR` or `MANAGE_CHANNELS` permission"})
        }


        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id){
                interaction.reply({content:"You are not in a ticket!"})
                return
            }

            interaction.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})
            interaction.reply({content:"Added "+user.tag+" to the ticket"})
            if (config.logs){console.log("[system] added user to ticket (name:"+user.username+",ticket:"+interaction.channel.name+")")}

            var loguser = user
            if (config.logs){console.log("[command] "+config.prefix+"add "+loguser.username+" (user:"+interaction.user.username+")")}
        })

       
    })
}