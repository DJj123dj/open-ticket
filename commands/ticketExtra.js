const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")
var name = "DJdj Development"
exports.name = name
var stringDecoder = require('./ticketSystem').stringDecoder



module.exports = () => {
    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"solli"){
            var SolliMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("**Hier is de informatie die wij nodig hebben voor een sollicitatie**\n\n**naam:** Je echte naam.\n**leeftijd:** Je leeftijd.\n**discord naam:** Je discord naam + tag (bv:Wumpus#0001).\n**minecraft naam:** Je minecraft naam.\n**waarom wil je staff worden:** De reden waarom je staff wilt worden.\n**+ punten:** Je plus punten.\n**- punten:** Je min punten.\n**Jou of iemand anders:** Waarom zouden we jou aan moeten nemen en niet een andere sollicitant?\n**ervaring:** Wat is je ervaring met MT servers?\n**andere server:** Ben je op dit moment staff op een andere server?\n**online:** Hoeveel uur per dag/week kan je online zijn?\n**functie:** Voor welke functie solliciteert u?")
                .setTitle("Sollicitatie")

            msg.channel.send({embeds:[SolliMsg]})
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && (args[1] == undefined ||args[1] == "" ||args[1] == null)){
            var TicketHelpMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("**Ga naar <#"+config.ticket_system.ticket_channel+"> om een ticket te maken!**\n\n`!ticket msg` ➜ _Maak een ticket reageer bericht (staff only)._\n`!ticket rename` ➜ _Rename een ticket (geen spaties)._\n`!ticket close` ➜ _Close een ticket._\n`!ticket add <user>` ➜ _Voeg een speler toe aan het ticket._\n`!ticket remove <user>` ➜ _Verwijder een speler van het ticket._\n`!partner` ➜ _De informatie voor partners._\n`!solli` ➜ _De informatie voor solliciteren._")
                .setTitle("Ticket commands")
                .setFooter(stringDecoder+name)

            msg.channel.send({embeds:[TicketHelpMsg]})
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"partner"){
            var PartnerMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("**Hier zijn de doelen die je moet hebben voor een partnership**\n\n**server:** De naam van je server.\n**beschrijving:** Waar gaat je server over?\n**members:** Het aantal members in je server.\n**invite:** Een oneindige invite.\n\n_als wij dit goedkeuren, kan je je 'invite bericht' plaatsen._")
                .setTitle("Partnership")

            msg.channel.send({embeds:[PartnerMsg]})
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "close"){
            
            msg.channel.messages.fetchPinned().then(msglist => {
                var firstmsg = msglist.last()

                if (firstmsg == undefined){
                    msg.channel.send({content:"Ik heb de sluit knop niet gevonden!"})
                }
                if (firstmsg.author.id != client.user.id){
                    msg.channel.send({content:"Je bent niet in een ticket!"})
                    return
                }
                var CloseMsg = new discord.MessageEmbed()
                .setColor(config.main_color)
                .setDescription("klik [hier]("+firstmsg.url+") om het ticket te sluiten.")
                .setTitle("Sluit dit ticket:")

            msg.channel.send({embeds:[CloseMsg]})
            })
            
            
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "rename"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"Je hebt geen permissions voor deze command!"})
                return
            }

            var name = args[2]
            msg.channel.messages.fetchPinned().then(msglist => {
                if (msglist.last().author.id == client.user.id){
                    msg.channel.send({content:"De naam is veranderd!"}).then(rmsg => {
                        rmsg.channel.setName(name)
                    })
                }else{
                    msg.channel.send({content:"Je bent niet in een ticket!"})
                }
            })
        }
    })

    client.on("messageCreate",msg => {
        var args = msg.content.split(" ")
        if (args[0] == config.prefix+"ticket" && args[1] == "add"){

            if (msg.member.roles.cache.has(config.botperms_role) == false && msg.author.id != "779742674932072469"){
                msg.channel.send({content:"Je hebt geen permissions voor deze command!"})
                return
            }

            msg.channel.messages.fetch().then(msglist => {
                if (msglist.last().author.id != client.user.id){
                    msg.channel.send({content:"Je bent niet in een ticket!"})
                    return
                }

                if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                    msg.channel.send({content:"Niet genoeg parameters!"})
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
                msg.channel.send({content:"Je hebt geen permissions voor deze command!"})
                return
            }

            msg.channel.messages.fetchPinned().then(msglist => {
                if (msglist.last().author.id != client.user.id){
                    msg.channel.send({content:"Je bent niet in een ticket!"})
                    return
                }

                if (args[2] == null || args[2] == undefined || args[2] == "" || args[2] == false){
                    msg.channel.send({content:"Niet genoeg parameters!"})
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