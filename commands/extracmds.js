const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

//=============================
// NOT READY YET
//=============================

module.exports = () => {
    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "close"){
            
            msg.channel.messages.fetchPinned().then(msglist => {
                var firstmsg = msglist.last()

                if (firstmsg == undefined){
                    msg.channel.send({content:"I didn't find the close button!"})
                }
                if (firstmsg.author.id != client.user.id){
                    msg.channel.send({content:"You are not in a ticket!"})
                    return
                }
                var CloseMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("Click [here]("+firstmsg.url+") to close this ticket.")
                .setTitle("Close this ticket:")

                msg.channel.send({embeds:[CloseMsg]})
                if (config.logs){console.log("[command] "+config.prefix+"ticket close (user:"+msg.author.username+")")}
            })
            
            
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "rename"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:config.messages.general.nopermissions})
                return
            }

            if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                msg.channel.send({content:"Not enough parameters!"})
                return
            }

            var name = args[2]
            var oldname = msg.channel.name
            msg.channel.messages.fetchPinned().then(msglist => {
                if (msglist.last().author.id == client.user.id){
                    msg.channel.send({content:"The name from the ticket is changed!"}).then(rmsg => {
                        rmsg.channel.setName(name)
                        if (config.logs){console.log("[system] renamed a ticket (name:"+oldname+",newname:"+name+")")}
                    })
                }else{
                    msg.channel.send({content:"You are not in a ticket!"})
                }
            })
            if (config.logs){console.log("[command] "+config.prefix+"ticket rename (user:"+msg.author.username+")")}
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "add"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:config.messages.general.nopermissions})
                return
            }

            msg.channel.messages.fetch().then(msglist => {
                if (msglist.last().author.id != client.user.id){
                    msg.channel.send({content:"You are not in a ticket!"})
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
                if (config.logs){console.log("[system] added user to ticket (name:"+user.username+",ticket:"+msg.channel.name+")")}

            })
            var loguser = msg.mentions.users.first()
            if (config.logs){console.log("[command] "+config.prefix+"ticket add "+loguser.username+" (user:"+msg.author.username+")")}
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "remove"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:config.messages.general.nopermissions})
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
                if (config.logs){console.log("[system] removed user from ticket (name:"+user.username+",ticket:"+msg.channel.name+")")}

            })

            var loguser = msg.mentions.users.first()
            if (config.logs){console.log("[command] "+config.prefix+"ticket remove "+loguser.username+" (user:"+msg.author.username+")")}
        }
    })
}