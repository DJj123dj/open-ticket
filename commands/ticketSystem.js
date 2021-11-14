const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")

const ticketStorage = bot.TicketStorage
const userTicketStorage = bot.userTicketStorage
const transcriptStorage = bot.transcriptStorage

var stringDecoder = "Created By "
exports.stringDecoder = stringDecoder

module.exports = () => {

    var closeButton = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Sluit Ticket")
            .setEmoji("❌")
        )

    client.on("interactionCreate",interaction => {

        if (interaction.isButton() == false){
            return
        }
        
        if (interaction.customId == "newTicketVraag"||interaction.customId == "newTicketSolli"||interaction.customId == "newTicketPartner"){
            
            interaction.deferUpdate()

            if (ticketStorage.getItem(interaction.member.id) == null ||ticketStorage.getItem(interaction.member.id) == "false"){

                try{
                    interaction.member.send("**Je ticket is aangemaakt!**")
                }
                catch{console.log("cant send DM to member")}
                

                
                ticketStorage.setItem(interaction.member.id,"true")

                var ticketNumber = interaction.member.user.username

                if (interaction.customId == "newTicketVraag"){
                    var ticketName = "vraag-"+ticketNumber
                }else if (interaction.customId == "newTicketSolli"){
                    var ticketName = "solli-"+ticketNumber
                }else if (interaction.customId == "newTicketPartner"){
                   var ticketName = "partner-"+ticketNumber
                }

                var Category = config.ticket_system.ticket_category

                    interaction.guild.channels.create(ticketName,{
                        type:"GUILD_TEXT",
                        parent:Category,
                        permissionOverwrites:[
                            {
                                id:interaction.member.id,
                                type:"member",
                                allow:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                            },
                            {
                                id:config.botperms_role,
                                type:"role",
                                allow:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                            },
                            {
                                id:config.ticket_system.member_role,
                                type:"role",
                                deny:["VIEW_CHANNEL"]
                            }
                        ]
                    }).then(tChannel => {
                        userTicketStorage.setItem(tChannel.id,interaction.member.id)
                        
                    
                        var ticketEmbed = new discord.MessageEmbed()
                            .setColor(config.main_color)

                            if (interaction.customId == "newTicketVraag"){
                                ticketEmbed.setDescription("**Ticket gemaakt:**\nJe hebt gekozen voor **overige vragen**, zeg alvast maar je vraag, onze staffleden komen u zo helpen.\n\n_Klik op knop hieronder om dit ticket te sluiten_")
                            }else if (interaction.customId == "newTicketSolli"){
                                ticketEmbed.setDescription("**Ticket gemaakt:**\nJe hebt gekozen voor **sollicitatie**, neem maar tijd om u sollicitatie brief voor te bereiden. Met de `!solli` command kan je zien wat je allemaal moet zeggen.\n\n_Klik op knop hieronder om dit ticket te sluiten_")
                            }else if (interaction.customId == "newTicketPartner"){
                                ticketEmbed.setDescription("**Ticket gemaakt:**\nJe hebt gekozen voor **partner**, neem maar tijd om u partner brief voor te bereiden. Met de `!partner` command kan je zien wat de vereisen zijn.\n\n_Klik op knop hieronder om dit ticket te sluiten_")
                            }
                    
                        tChannel.send({content:"<@"+interaction.member.id+"> <@&"+config.botperms_role+">",embeds:[ticketEmbed],components:[closeButton]}).then(firstmsg => {
                            firstmsg.pin()
                        })
                    })



            }else{
                try {
                    interaction.member.send("**Je hebt al een ticket open!**")
                }
                catch{console.log("cant send DM to member")}
                
                
            }
        }

        

    })

    var closeBar = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId("closeTicketTrue")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setEmoji("✅")
    )
    .addComponents(
        new discord.MessageButton()
            .setCustomId("closeTicketFalse")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setEmoji("❌")
    )



    client.on("interactionCreate",interaction => {
        if (interaction.isButton() == false){
            return
        }
        if (interaction.customId == "closeTicket"){
            interaction.deferUpdate()
            interaction.message.edit({components:[closeBar]})
        }
    })

    client.on("interactionCreate",interaction => {
        if (interaction.isButton() == false){
            return
        }
        if (interaction.customId == "closeTicketFalse"){
            interaction.deferUpdate()

            interaction.message.edit({components:[closeButton]})
        }
    })

    

    client.on("interactionCreate",interaction => {
        if (interaction.isButton() == false){
            return
        }
        if (interaction.customId == "closeTicketTrue"){
            interaction.deferUpdate()
            interaction.channel.messages.fetch().then(messages => {
                var transcriptArray = []
                messages.forEach(msg => {
                    if (msg.author.id != client.user.id){
                        transcriptArray.push("["+msg.author.username+"]: "+msg.content)
                    }
                })
                var getuserID = userTicketStorage.getItem(interaction.channel.id)
                var getusernameStep1 = client.users.cache.find(u => u.id === getuserID)
                if (getusernameStep1 == null || getusernameStep1 == undefined || getusernameStep1 == false || getusernameStep1 == ""){
                    var getuserNAME = ":user niet in database:"
                }else {
                    var getuserNAME = getusernameStep1.username
                }
                

                var transcript = transcriptArray.reverse().join("\n")
                transcriptStorage.setItem(interaction.channel.id,transcript)

                var splittedTranscript = [transcript.slice(0,2000)]
                if (transcript.length > 4000){
                    splittedTranscript.push(transcript.slice(2000,4000))
                    splittedTranscript.push(transcript.slice(4000))
                }else if (transcript.length > 2000){
                    splittedTranscript.push(transcript.slice(2000))
                }
                var transcriptEmbed = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket gemaakt door "+getuserNAME)
                    .setTitle("Er is een nieuw transcript!")
                    .setDescription(splittedTranscript[0])
                    .setFooter("ticket gesloten door "+interaction.member.user.username)

            if (transcript.length > 4000){
                var transcriptEmbed2 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket gemaakt door "+getuserNAME)
                    .setTitle("Deel 2 van het transcript")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket gesloten door "+interaction.member.user.username)
                var transcriptEmbed3 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket gemaakt door "+getuserNAME)
                    .setTitle("Deel 3 van het transcript")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket gesloten door "+interaction.member.user.username)
        
                client.channels.cache.find(ch => ch.id == config.ticket_system.transcript_channel).send({embeds:[transcriptEmbed,transcriptEmbed2,transcriptEmbed3]})

            }else if (transcript.length > 2000){
                var transcriptEmbed2 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket gemaakt door "+getuserNAME)
                    .setTitle("Deel 2 van het transcript")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket gesloten door "+interaction.member.user.username)

                client.channels.cache.find(ch => ch.id == config.ticket_system.transcript_channel).send({embeds:[transcriptEmbed,transcriptEmbed2]})
            }else{
                client.channels.cache.find(ch => ch.id == config.ticket_system.transcript_channel).send({embeds:[transcriptEmbed]})
            }

                

                interaction.channel.delete()

                
                ticketStorage.setItem(getuserID,"false")

                try {
                    interaction.member.send("**Je ticket is gesloten door "+interaction.member.user.username+"!**")
                }
                catch{console.log("cant send DM to member")}
            })
        
            

            
        }
    })



    process.on('unhandledRejection',error => {
        console.log("ERROR: "+error)
    })
    
}