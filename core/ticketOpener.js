const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const getconfigoptions = require("./getoptions")
const storage = bot.storage

module.exports = () => {
    var closeButton = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Secondary)
            .setLabel(l.buttons.close)
            .setEmoji("🔒")
        )
        .addComponents(
            new discord.ButtonBuilder()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle(discord.ButtonStyle.Danger)
            .setLabel(l.buttons.delete)
            .setEmoji("✖️")
        )
    
    //ticket button click / create ticket
    client.on("interactionCreate",(interaction) => {
        if (interaction.isChatInputCommand() && (interaction.commandName == "new" || interaction.commandName == "ticket")){
            var customId = "newT"+interaction.options.getString("type")
        }else if (interaction.isButton()){
            var customId = interaction.customId
        }else return

        if (interaction.isButton()){
            if (interaction.customId.startsWith("newT")){
                const optionid = interaction.customId.split("newT")[1]
                if (!optionid){
                    interaction.reply({embeds:[bot.errorLog.serverError(l.errors.ticketDoesntExist)]})
                    return
                }
            }
        }

        
        if (getconfigoptions.getTicketValues("id").includes(customId)){

            //ticketoptions from config
            const currentTicketOptions = getconfigoptions.getOptionsById(customId)

            if (currentTicketOptions == false || currentTicketOptions.type != "ticket") return interaction.reply({embeds:[bot.errorLog.serverError(l.errors.anotherOption)]})

            if (interaction.isButton()){
                interaction.deferUpdate()
            }else if (interaction.isChatInputCommand()){
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
                const pfb = discord.PermissionFlagsBits
                const guild = client.guilds.cache.find(g => g.id == interaction.guild.id)

                //set everyone allowed
                if (config.system['has@everyoneaccess']){
                    var everyoneAllowPerms = [pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
                    var everyoneDenyPerms = []
                }else{
                    var everyoneAllowPerms = []
                    var everyoneDenyPerms = [pfb.ViewChannel]
                }
                permissionsArray.push({
                    id:interaction.guild.roles.everyone,
                    type:"role",
                    allow:everyoneAllowPerms,
                    deny:everyoneDenyPerms
                })

                //add the user that created the ticket
                permissionsArray.push({
                    id:interaction.member.user,
                    type:"member",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
                })

                //add main adminroles
                config.main_adminroles.forEach((role,index) => {
                    try {
                        const adminrole = guild.roles.cache.find(r => r.id == role)
                        if (!adminrole) return

                        permissionsArray.push({
                            id:adminrole,
                            type:"role",
                            allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
                        })
                    }catch{
                        log("system","invalid role! At 'config.json => main_adminroles:"+index)
                    }
                })

                //add ticket adminroles
                /**
                 * @type {String[]}
                 */
                const ticketadmin = currentTicketOptions.adminroles
                ticketadmin.forEach((role,index) => {
                    if (!config.main_adminroles.includes(role)){
                        try {
                            const adminrole = guild.roles.cache.find(r => r.id == role)
                            if (!adminrole) return
                        
                            permissionsArray.push({
                                id:adminrole,
                                type:"role",
                                allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
                            })
                        }catch{
                            log("system","invalid role! At 'config.json => options/ticket/...:"+index)
                        }
                    }
                })

                //add member role
                if (config.system.member_role != "" && config.system.member_role != " " && config.system.member_role != "false" && config.system.member_role != "null" && config.system.member_role != "0"){
                    try {
                        const userrole = guild.roles.cache.find(r => r.id == config.system.member_role)
                        if (!userrole) return
                        permissionsArray.push({
                            id:userrole,
                            type:"role",
                            deny:[pfb.ViewChannel]
                        })
                    }catch{
                        log("system","invalid role! At 'config.json => system/member_role")
                    }
                }

                //create the channel
                interaction.guild.channels.create({
                    name:ticketName,
                    type:discord.ChannelType.GuildText,
                    parent:newTicketCategory,
                    reason:"A new ticket is created",
                    permissionOverwrites:permissionsArray
                    
                }).then((ticketChannel) => {
                    storage.set("userTicketStorage",ticketChannel.id,interaction.member.id)
                    
                    var ticketEmbed = new discord.EmbedBuilder()
                        .setAuthor({name:interaction.user.id})
                        .setColor(config.main_color)
                        .setTitle(currentTicketOptions.name)
                        .setFooter({text:"Ticket Type: "+currentTicketOptions.id})
                    if (currentTicketOptions.ticketmessage.length > 0) ticketEmbed.setDescription(currentTicketOptions.ticketmessage)
                
                    ticketChannel.send({
                        content:"<@"+interaction.member.id+"> @here",
                        embeds:[ticketEmbed],
                        components:[closeButton]
                    
                    }).then(firstmsg => {
                        firstmsg.pin()
                    })
                    
                    log("system","created new ticket",[{key:"ticket",value:ticketName},{key:"user",value:interaction.user.tag}])
                    require("./api/modules/events").onTicketOpen(interaction.user,ticketChannel,interaction.guild,new Date(),{name:ticketName,status:"open",ticketOptions:currentTicketOptions})
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