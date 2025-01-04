const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const l = bot.language
const log = bot.errorLog.log

const configParser = require("../utils/configParser")
const storage = bot.storage

module.exports = () => {
    //dropdown placeholder
    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isStringSelectMenu()) return
        if (interaction.customId != "OTdropdownMenu") return
        if (interaction.values.includes("OTChooseTicket")){
            await interaction.deferUpdate()
        }
    })


    var closeButton = bot.buttons.firstmsg.firstmsgRowNormal
    
    //ticket button click / create ticket
    client.on("interactionCreate",async (interaction) => {
        if (interaction.isChatInputCommand() && (interaction.commandName == "new" || interaction.commandName == "ticket")){
            var customId = "OTnewT"+interaction.options.getString("type")
        }else if (interaction.isButton()){
            var customId = interaction.customId
        }else if (interaction.isStringSelectMenu() && (interaction.customId == "OTdropdownMenu")){
            var customId = interaction.values[0]

        }else return

        if (interaction.isButton()){
            if (interaction.customId.startsWith("OTnewT")){
                const optionid = interaction.customId.split("OTnewT")[1]
                if (!optionid){
                    await interaction.reply({embeds:[bot.errorLog.serverError(l.errors.ticketDoesntExist)]})
                    return
                }
            }
        }

        
        if (configParser.getTicketValuesArray("id").includes(customId)){

            //ticketoptions from config
            const currentTicketOptions = configParser.getTicketById(customId)
            if (currentTicketOptions == false) return interaction.reply({embeds:[bot.errorLog.serverError(l.errors.anotherOption)]})

            if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isChatInputCommand()){
                try{
                    await interaction.deferReply({flags:config.system.answerInEphemeralOnOpen ? ["Ephemeral"] : undefined})
                }catch{}
            }

            const currentUserTicketAmount = storage.get("amountOfUserTickets",interaction.member.id)
            if (config.system.maxAmountOfTickets == 0 || !currentUserTicketAmount || currentUserTicketAmount == "false" || Number(currentUserTicketAmount) < config.system.maxAmountOfTickets){

                //update storage
                storage.set("amountOfUserTickets",interaction.member.id,Number(currentUserTicketAmount)+1)
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

                //set @everyone no ticket access
                permissionsArray.push({
                    id:interaction.guild.roles.everyone.id,
                    type:"role",
                    allow:[],
                    deny:[pfb.ViewChannel]
                })

                //add the user that created the ticket
                permissionsArray.push({
                    id:interaction.member.id,
                    type:"member",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel,pfb.ReadMessageHistory]
                })

                //add main adminroles
                config.adminRoles.forEach((role,index) => {
                    try {
                        const adminrole = guild.roles.cache.find(r => r.id == role)
                        if (!adminrole) return

                        permissionsArray.push({
                            id:adminrole.id,
                            type:"role",
                            allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel,pfb.ReadMessageHistory]
                        })
                    }catch{}
                })

                //add ticket adminroles
                /**
                 * @type {String[]}
                 */
                const ticketadmin = currentTicketOptions.adminroles
                ticketadmin.forEach((role,index) => {
                    if (!config.adminRoles.includes(role)){
                        try {
                            const adminrole = guild.roles.cache.find(r => r.id == role)
                            if (!adminrole) return
                        
                            permissionsArray.push({
                                id:adminrole.id,
                                type:"role",
                                allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel,pfb.ReadMessageHistory]
                            })
                        }catch{}
                    }
                })

                //add ticket adminroles
                if (currentTicketOptions.readonlyAdminroles){
                    currentTicketOptions.readonlyAdminroles.forEach((role,index) => {
                        if (!config.adminRoles.includes(role) && !currentTicketOptions.adminroles.includes(role)){
                            try {
                                const adminrole = guild.roles.cache.find(r => r.id == role)
                                if (!adminrole) return

                                permissionsArray.push({
                                    id:adminrole.id,
                                    type:"role",
                                    allow:[pfb.AddReactions,pfb.ViewChannel,pfb.ReadMessageHistory],
                                    deny:[pfb.SendMessages,pfb.AttachFiles,pfb.EmbedLinks]
                                })
                            }catch{}
                        }
                    })
                }

                //add member role
                if (config.system.memberRole && ![" ","0","false","null","undefined"].includes(config.system.memberRole)){
                    try {
                        const userrole = guild.roles.cache.find(r => r.id == config.system.memberRole)
                        if (userrole){
                            permissionsArray.push({
                                id:userrole.id,
                                type:"role",
                                deny:[pfb.ViewChannel]
                            })
                        }
                    }catch{}
                }

                //create the channel
                interaction.guild.channels.create({
                    name:ticketName,
                    type:discord.ChannelType.GuildText,
                    parent:newTicketCategory,
                    reason:"A new ticket is created",
                    permissionOverwrites:permissionsArray
                    
                }).then((ticketChannel) => {
                    storage.set("userFromChannel",ticketChannel.id,interaction.member.id)
                    if (currentTicketOptions.autoclose.enable) storage.set("autocloseTickets",ticketChannel.id,currentTicketOptions.autoclose.inactiveHours)

                    bot.hiddenData.writeHiddenData(ticketChannel.id,[{key:"type",value:currentTicketOptions.id},{key:"openerid",value:interaction.user.id},{key:"createdms",value:new Date().getTime()}])

                    var ticketEmbed = new discord.EmbedBuilder()
                        //.setAuthor({name:interaction.user.id})
                        .setColor(config.color)
                        .setTitle(currentTicketOptions.name)
                        //.setFooter({text:"Ticket Type: "+currentTicketOptions.id})
                    if (currentTicketOptions.autoclose.enable){
                        const footerText = l.commands.autocloseTitle.replace("{0}",currentTicketOptions.autoclose.inactiveHours+"h")
                        ticketEmbed.setFooter({text:footerText})
                    }

                    if (currentTicketOptions.ticketmessage.length > 0){
                        ticketEmbed.setDescription(currentTicketOptions.ticketmessage)
                    }

                    if (currentTicketOptions.thumbnail.enable) ticketEmbed.setThumbnail(currentTicketOptions.thumbnail.url)
                    if (currentTicketOptions.image.enable) ticketEmbed.setImage(currentTicketOptions.image.url)
                
                    const herePing = currentTicketOptions.ping['@here'] ? " @here" : ""
                    const everyonePing = currentTicketOptions.ping['@everyone'] ? " @everyone" : ""
                    const customPing = currentTicketOptions.ping.custom.enable ? " <@&"+currentTicketOptions.ping.custom.roleId+">" : ""


                    ticketChannel.send({
                        content:"<@"+interaction.member.id+">"+herePing+everyonePing+customPing,
                        embeds:[ticketEmbed],
                        components:[closeButton]
                    
                    }).then(firstmsg => {
                        firstmsg.pin()
                    })
                    
                    log("system","created new ticket",[{key:"ticket",value:ticketName},{key:"user",value:interaction.user.username}])
                    require("../api/modules/events").onTicketOpen(interaction.user,ticketChannel,interaction.guild,new Date(),{name:ticketName,status:"open",ticketOptions:currentTicketOptions})

                    //STATS:
                    bot.statsManager.updateGlobalStats("TICKETS_CREATED",(current) => {
                        if (typeof current != "undefined") return current+1
                        return 1
                    })
                    bot.statsManager.updateUserStats("TICKETS_CREATED",interaction.user.id,(current) => {
                        if (typeof current != "undefined") return current+1
                        return 1
                    })
                    bot.statsManager.updateTicketStats("CREATED_BY",ticketChannel.id,(current) => {
                        return interaction.user.id
                    })
                    bot.statsManager.updateTicketStats("CREATED_AT",ticketChannel.id,(current) => {
                        return new Date().getTime()
                    })
                    bot.statsManager.updateTicketStats("STATUS",ticketChannel.id,(current) => {
                        return "open"
                    })

                    const channelbutton = new discord.ActionRowBuilder()
                        .addComponents([
                            new discord.ButtonBuilder()
                                .setStyle(discord.ButtonStyle.Link)
                                .setDisabled(false)
                                .setEmoji("🎫")
                                .setLabel(l.commands.goToTicket)
                                .setURL(ticketChannel.url)
                        ])
                        
                    try{
                        if (currentTicketOptions.enableDmOnOpen) interaction.member.send({embeds:[bot.errorLog.custom(l.messages.newTicketDmTitle,currentTicketOptions.message,":ticket:",config.color)],components:[channelbutton]})
                    }
                    catch{log("system","failed to send DM")}

                    if (((interaction.isButton() || interaction.isStringSelectMenu()) && config.system.answerInEphemeralOnOpen) || interaction.isChatInputCommand()){
                        if (interaction.deferred || interaction.replied){
                            interaction.editReply({embeds:[bot.errorLog.success(l.messages.createdTitle,l.messages.createdDescription)],components:[channelbutton]})
                        }else{
                            interaction.reply({embeds:[bot.errorLog.success(l.messages.createdTitle,l.messages.createdDescription)],components:[channelbutton]})
                        }
                    }
                })
            }else{
                interaction.editReply({embeds:[bot.errorLog.warning(l.errors.maxAmountTitle,l.errors.maxAmountDescription)]})
                try {
                    if (config.system.dmMessages){
                        interaction.member.send({embeds:[bot.errorLog.warning(l.errors.maxAmountTitle,l.errors.maxAmountDescription)]})
                    }
                }
                catch{log("system","can't send DM to member, member doesn't allow dm's")}
                
                
            }
        }
    })
}
