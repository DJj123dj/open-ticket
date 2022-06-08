const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

const getconfigoptions = require("./getoptions")
const storage = bot.storage

module.exports = () => {
    var closeButton = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Close Ticket")
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel("Delete Ticket")
            .setEmoji("✖️")
        )
    
    //ticket button click / create ticket
    client.on("interactionCreate",(interaction) => {
        if (interaction.isCommand() && (interaction.commandName == "new" || interaction.commandName == "ticket")){
            var customId = "newT"+interaction.options.getString("type")
        }else if (interaction.isButton()){
            var customId = interaction.customId
        }else return
        
        if (getconfigoptions.getTicketValues("id").includes(customId)){

            //ticketoptions from config
            const currentTicketOptions = getconfigoptions.getOptionsById(customId)

            if (currentTicketOptions == false || currentTicketOptions.type != "ticket") return interaction.reply({content:"This button is not a ticket!"})

            if (interaction.isButton()){
                interaction.deferUpdate()
            }else if (interaction.isCommand()){
                interaction.reply({content:"Your ticket is created!"})
            }

            if (storage.get("ticketStorage",interaction.member.id) == null || storage.get("ticketStorage",interaction.member.id) == "false"|| Number(storage.get("ticketStorage",interaction.member.id)) < config.system.max_allowed_tickets){

                try{
                    if (config.system.enable_DM_Messages){
                        interaction.member.send({content:currentTicketOptions.message})
                    }
                }
                catch{console.log("[system] can't send DM to member, member doesn't allow dm's")}
                
                

                //update storage
                storage.set("ticketStorage",interaction.member.id,Number(storage.get("ticketStorage",interaction.member.id))+1)
                var ticketNumber = interaction.member.user.username

                //set ticketName
                var ticketName = currentTicketOptions.channelprefix+ticketNumber
                var logsname = currentTicketOptions.name
                
                //category
                if (currentTicketOptions.category.length < 16 || currentTicketOptions.category.length > 20){
                    var newTicketCategory = null
                }else{
                    var newTicketCategory = currentTicketOptions.category
                }

                var permissionsArray = []

                //set everyone allowed
                if (config.system['has@everyoneaccess']){
                    var everyoneAllowPerms = ["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                    var everyoneDenyPerms = []
                }else{
                    var everyoneAllowPerms = []
                    var everyoneDenyPerms = ["VIEW_CHANNEL"]
                }
                permissionsArray.push({
                    id:interaction.guild.id,
                    type:"role",
                    allow:everyoneAllowPerms,
                    deny:everyoneDenyPerms
                })

                //add the user that created the ticket
                permissionsArray.push({
                    id:interaction.member.id,
                    type:"member",
                    allow:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                })

                //add main adminroles
                config.main_adminroles.forEach((role) => {
                    permissionsArray.push({
                        id:role,
                        type:"role",
                        allow:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                    })
                })

                //add ticket adminroles
                /**
                 * @type {String[]}
                 */
                const ticketadmin = currentTicketOptions.adminroles
                ticketadmin.forEach((role) => {
                    if (!config.main_adminroles.includes(role)){
                        permissionsArray.push({
                            id:role,
                            type:"role",
                            allow:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
                        })
                    }
                })

                //add member role
                if (config.system.member_role != "" && config.system.member_role != " " && config.system.member_role != "false" && config.system.member_role != "null" && config.system.member_role != "0"){
                    permissionsArray.push({
                        id:config.system.member_role,
                        type:"role",
                        deny:["VIEW_CHANNEL"]
                    })
                }


                //create the channel
                interaction.guild.channels.create(ticketName,{
                    type:"GUILD_TEXT",
                    parent:newTicketCategory,
                    reason:"A new ticket was created",
                    permissionOverwrites:permissionsArray
                    
                }).then((ticketChannel) => {
                    storage.set("userTicketStorage",ticketChannel.id,interaction.member.id)
                    
                    var ticketEmbed = new discord.MessageEmbed()
                        //.setColor(config.main_color)
                        .setColor(config.main_color)
                        .setTitle("You created a ticket!")
                        .setDescription("The staff will help you soon!\n\n*Click on the button below to close the ticket!*")
                
                    ticketChannel.send({
                        content:"<@"+interaction.member.id+"> @everyone",
                        embeds:[ticketEmbed],
                        components:[closeButton]
                    
                    }).then(firstmsg => {
                        firstmsg.pin()
                    })
                    if (config.logs){console.log("[system] created a new ticket (name:"+logsname+",user:"+interaction.user.username+")")}
                })
            }else{
                try {
                    if (config.system.enable_DM_Messages){
                        interaction.member.send("you already have the maximum number of tickets allowed!")
                    }
                }
                catch{console.log("[system] can't send DM to member, member doesn't allow dm's")}
                
                
            }
        }
    })
}