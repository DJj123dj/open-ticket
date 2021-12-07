const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = require("../config.json")

const ticketStorage = bot.TicketStorage
const userTicketStorage = bot.userTicketStorage
const transcriptStorage = bot.transcriptStorage

module.exports = () => {

    var closeButton = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Close Ticket")
            .setEmoji("❌")
        )

    client.on("interactionCreate",interaction => {

        if (interaction.isButton() == false){
            return
        }
        
        if (interaction.customId == "newTicket1"||interaction.customId == "newTicket2"||interaction.customId == "newTicket3"||interaction.customId == "newTicket4"){
            
            interaction.deferUpdate()

            if (ticketStorage.getItem(interaction.member.id) == null ||ticketStorage.getItem(interaction.member.id) == "false"){

                try{
                    interaction.member.send("**You created a ticket in our server!**")
                }
                catch{console.log("can't send DM to member || member doesn't allow dm's")}
                

                
                ticketStorage.setItem(interaction.member.id,"true")

                var ticketNumber = interaction.member.user.username

                if (interaction.customId == "newTicket1"){
                    var ticketName = config.options.ticket1.channel_prefix+ticketNumber
                }else if (interaction.customId == "newTicket2"){
                    var ticketName = config.options.ticket2.channel_prefix+ticketNumber
                }else if (interaction.customId == "newTicket3"){
                   var ticketName = config.options.ticket3.channel_prefix+ticketNumber
                }else if (interaction.customId == "newTicket4"){
                    var ticketName = config.options.ticket4.channel_prefix+ticketNumber
                }
                
                if (config.ticket_system.enable_category){
                var Category = config.ticket_system.ticket_category
                }else{var Category = null}

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
                                id:config.system.member_role,
                                type:"role",
                                deny:["VIEW_CHANNEL"]
                            }
                        ]
                    }).then(tChannel => {
                        userTicketStorage.setItem(tChannel.id,interaction.member.id)
                        
                    
                        var ticketEmbed = new discord.MessageEmbed()
                            .setColor(config.main_color)

                            ticketEmbed.setDescription("You created a ticket!\n\n_Click on the close button below to close this ticket_")
                    
                        tChannel.send({content:"<@"+interaction.member.id+"> <@&"+config.botperms_role+">",embeds:[ticketEmbed],components:[closeButton]}).then(firstmsg => {
                            firstmsg.pin()
                        })
                    })



            }else{
                try {
                    interaction.member.send("**You have already created a ticket!**")
                }
                catch{console.log("can't send DM to member || member doesn't allow dm's")}
                
                
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
                    var getuserNAME = ":usernotfound:"
                }else {
                    var getuserNAME = getusernameStep1.username
                }
                

            if (config.system.enable_transcript){
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
                    .setAuthor(interaction.channel.name + " - ticket created by "+getuserNAME)
                    .setTitle("There is a new transcript!")
                    .setDescription(splittedTranscript[0])
                    .setFooter("ticket closed by "+interaction.member.user.username)

                if (transcript.length > 4000){
                var transcriptEmbed2 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket created by "+getuserNAME)
                    .setTitle("transcript #2")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket closed by "+interaction.member.user.username)
                var transcriptEmbed3 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket created by "+getuserNAME)
                    .setTitle("transcript #3")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket closed by "+interaction.member.user.username)
        
                client.channels.cache.find(ch => ch.id == config.system.transcript_channel).send({embeds:[transcriptEmbed,transcriptEmbed2,transcriptEmbed3]})

                }else if (transcript.length > 2000){
                var transcriptEmbed2 = new discord.MessageEmbed()
                    .setColor(config.main_color)
                    .setAuthor(interaction.channel.name + " - ticket created by "+getuserNAME)
                    .setTitle("transcript #2")
                    .setDescription(splittedTranscript[1])
                    .setFooter("ticket closed by "+interaction.member.user.username)

                client.channels.cache.find(ch => ch.id == config.system.transcript_channel).send({embeds:[transcriptEmbed,transcriptEmbed2]})
                }else{
                client.channels.cache.find(ch => ch.id == config.system.transcript_channel).send({embeds:[transcriptEmbed]})
                }
            }

                

                interaction.channel.delete()

                
                ticketStorage.setItem(getuserID,"false")

                try {
                    interaction.member.send("**your ticket is closed by "+interaction.member.user.username+"!**")
                }
                catch{console.log("can't send DM to member || member doesn't allow dm's")}
            })
        
            

            
        }
    })



    process.on('unhandledRejection',error => {
        console.log("ERROR: "+error)
    })
    
}