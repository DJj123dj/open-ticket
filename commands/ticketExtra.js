const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")



module.exports = () => {
    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && (args[1] == undefined ||args[1] == "" ||args[1] == null)){
            var TicketHelpMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setTitle("Ticket commands")

            const prefix = config.prefix
            TicketHelpMsg.setDescription("**Go to <#"+config.system.ticket_channel+"> to create a ticket!**\n\n`"+prefix+"ticket msg` ➜ _Admin command._\n`"+prefix+"ticket rename` ➜ _Rename a ticket (no spaces)._\n`"+prefix+"ticket close` ➜ _Close a ticket._\n`"+prefix+"ticket add <user>` ➜ _Add a user to the ticket._\n`"+prefix+"ticket remove <user>` ➜ _Remove a user from the ticket._\n`"+prefix+"resetdatabase` ➜ _Steps to reset the database._")

            if (config['credits_please-do-not-remove']){
                TicketHelpMsg.setFooter("OpenTicket by DJdj Development | view on github for source code")
            }

            msg.channel.send({embeds:[TicketHelpMsg]})
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "close"){
            
            msg.channel.messages.fetchPinned().then(msglist => {
                var firstmsg = msglist.last()

                if (firstmsg == undefined){
                    msg.channel.send({content:"I didn't find the close button!"})
                }
                if (firstmsg.author.id != client.user.id){
                    msg.channel.send({content:"You aren't in a ticket!"})
                    return
                }
                var CloseMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("Click [here]("+firstmsg.url+") to close this ticket.")
                .setTitle("Close this ticket:")

            msg.channel.send({embeds:[CloseMsg]})
            })
            
            
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "rename"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"You don't have permissions for this command!"})
                return
            }

            if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                msg.channel.send({content:"Not enough parameters!"})
                return
            }

            var name = args[2]
            msg.channel.messages.fetchPinned().then(msglist => {
                if (msglist.last().author.id == client.user.id){
                    msg.channel.send({content:"De naam is veranderd!"}).then(rmsg => {
                        rmsg.channel.setName(name)
                    })
                }else{
                    msg.channel.send({content:"You aren't in a ticket!"})
                }
            })
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "add"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"You don't have permissions for this command!"})
                return
            }

            msg.channel.messages.fetch().then(msglist => {
                if (msglist.last().author.id != client.user.id){
                    msg.channel.send({content:"You aren't in a ticket!"})
                    return
                }

                if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                    msg.channel.send({content:"Not enough parameters!"})
                    return
                }
                var user = msg.mentions.users.first()
                if (!user){
                    return
                }
                
                msg.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL:true, ADD_REACTIONS:true,ATTACH_FILES:true, EMBED_LINKS:true, SEND_MESSAGES:true})

            })
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "remove"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"You don't have permissions for this command!"})
                return
            }

            msg.channel.messages.fetchPinned().then(msglist => {
                if (msglist.last().author.id != client.user.id){
                    msg.channel.send({content:"You aren't in a ticket!"})
                    return
                }

                if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                    msg.channel.send({content:"Not enough parameters!"})
                    return
                }
                var user = msg.mentions.users.first()
                if (!user){
                    return
                }
                
                msg.channel.permissionOverwrites.delete(user.id)

            })
        }
    })
}