const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("./getoptions")
const storage = bot.storage

module.exports = () => {
    var closeButton = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel(l.buttons.close)
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel(l.buttons.delete)
            .setEmoji("✖️")
        )
    
    //ticket button click / create ticket
    client.on("interactionCreate",(interaction) => {
        if (interaction.isCommand() && (interaction.commandName == "new" || interaction.commandName == "ticket")){
            var customId = "newT"+interaction.options.getString("type")
        }else if (interaction.isButton()){
            var customId = interaction.customId
        }else return

        if (interaction.customId.startsWith("newT")){
            const optionid = interaction.customId.split("newT")[1]
            if (!optionid){
                interaction.reply({embeds:[bot.errorLog.serverError(l.errors.ticketDoesntExist)]})
                return
            }
        }
        
        if (getconfigoptions.getTicketValues("id").includes(customId)){

            //ticketoptions from config
            const currentTicketOptions = getconfigoptions.getOptionsById(customId)

            if (currentTicketOptions == false || currentTicketOptions.type != "ticket") return interaction.reply({embeds:[bot.errorLog.serverError(l.errors.anotherOption)]})

            if (interaction.isButton()){
                interaction.deferUpdate()
            }else if (interaction.isCommand()){
                interaction.reply({embeds:[bot.errorLog.success(l.messages.createdTitle,l.messages.createdDescription)]})
            }

            if (storage.get("ticketStorage",interaction.member.id) == null || storage.get("ticketStorage",interaction.member.id) == "false"|| Number(storage.get("ticketStorage",interaction.member.id)) < config.system.max_allowed_tickets){

                try{
                    if (config.system.enable_DM_Messages){
                        interaction.member.send({embeds:[bot.errorLog.custom(l.messages.newTicketDmTitle,currentTicketOptions.message,":ticket:",config.main_color)]})
                    }
                }
                catch{log("system","can't send DM to member, member doesn't allow dm's")}
                
                

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
                    reason:"A new ticket is created",
                    permissionOverwrites:permissionsArray
                    
                }).then((ticketChannel) => {
                    storage.set("userTicketStorage",ticketChannel.id,interaction.member.id)
                    
                    var ticketEmbed = new discord.MessageEmbed()
                        .setAuthor({name:interaction.user.id})
                        .setColor(config.main_color)
                        .setTitle(currentTicketOptions.name)
                    if (currentTicketOptions.ticketmessage.length > 0) ticketEmbed.setDescription(currentTicketOptions.ticketmessage)
                
                    ticketChannel.send({
                        content:"<@"+interaction.member.id+"> @here",
                        embeds:[ticketEmbed],
                        components:[closeButton]
                    
                    }).then(firstmsg => {
                        firstmsg.pin()
                    })
                    
                    log("system","created new ticket",[{key:"ticket",value:ticketName},{key:"user",value:interaction.user.tag}])
                })
            }else{
                try {
                    if (config.system.enable_DM_Messages){
                        interaction.member.send({embeds:[bot.errorLog.warning(l.errors.maxAmountTitle,l.errors.maxAmountDescription)]})
                    }
                }
                catch{log("system","can't send DM to member, member doesn't allow dm's")}
                
                
            }
        }
    })
}