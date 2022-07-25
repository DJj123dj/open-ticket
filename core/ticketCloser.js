const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

/**
 * 
 * @param {discord.Interaction} interaction
 * @param {String} prefix
 * @param {"delete"|"close"|"deletenotranscript"} mode
 */
exports.closeTicket = async (interaction,prefix,mode) => {
    const chalk = await (await import("chalk")).default
    const channelmessages = await interaction.channel.messages.fetch()
    const channel = interaction.channel

    channelmessages.sweep((msgSweep) => {
        return msgSweep.author.id == client.user.id
    })

    /**
     * @type {String} ticketuserarray
     */
    const ticketuserarray = interaction.channel.name
    const ticketusername = ticketuserarray.split(prefix)[1]

    var getuserID = storage.get("userTicketStorage",interaction.channel.id)
    try {
        var getusernameStep1 = client.users.cache.find(u => u.id === getuserID)
        var isDatabaseError = false
    }catch{
        var isDatabaseError = true
    }

    if (!getusernameStep1){
        console.log(chalk.red("[database error]"),"something went wrong when getting the data in the database.\nNo panic, this error fixes itself!")
        var isDatabaseError = true
    }

    var enableTranscript = true
    var deleteRequired = false

    if (mode == "delete"){
        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                try {
                    return interaction.member.send({embeds:[bot.errorLog.noPermsMessage]})
                }catch{
                    return interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                }
            }
        deleteRequired = true
        await interaction.channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        log("system","deleted a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM
        await interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketDelete(interaction.user,interaction.channel,interaction.guild,new Date(),{name:interaction.channel.name,status:"deleted",ticketOptions:ticketData})

            if (!firstmsg.embeds[0].author) return false
            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    interaction.member.send({embeds:[bot.errorLog.custom(l.messages.deletedTicketDmTitle,l.messages.deletedTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })

    }else if (mode == "close"){

        if (config.system.closeMode == "adminonly"){
            const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                try {
                    return interaction.member.send({embeds:[bot.errorLog.noPermsMessage]})
                }catch{
                    return interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                }
            }
        }

        var permissionArray = []
        const pfb = discord.PermissionFlagsBits

        if (!isDatabaseError) permissionArray.push({
            id:getusernameStep1,
            type:"member",
            allow:[pfb.ViewChannel],
            deny:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages]
        })

        permissionArray.push({
            id:interaction.guild.roles.everyone,
            type:"role",
            deny:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
        })

        interaction.channel.permissionOverwrites.set(permissionArray)

        //message
        var closeButtonRow = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                .setCustomId("deleteTicket1")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Danger)
                .setLabel(l.buttons.delete)
                .setEmoji("✖️")
            )
            .addComponents(
                new discord.ButtonBuilder()
                .setCustomId("sendTranscript")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setLabel(l.buttons.sendTranscript)
                .setEmoji("📄")
            )
            .addComponents(
                new discord.ButtonBuilder()
                .setCustomId("reopenTicket")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Success)
                .setLabel(l.buttons.reopen)
                .setEmoji("✔")
            )
            
        const embed = new discord.EmbedBuilder()
            .setColor(config.main_color)
            .setTitle(":lock: "+l.messages.closedTitle+" :lock:")
            .setDescription(l.messages.closedDescription)
        interaction.channel.send({embeds:[embed],components:[closeButtonRow]})

        log("system","closed a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])
        

        //getID & send DM
        await interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketClose(interaction.user,interaction.channel,interaction.guild,new Date(),{name:interaction.channel.name,status:"closed",ticketOptions:ticketData})

            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    interaction.member.send({embeds:[bot.errorLog.custom(l.messages.closedTicketDmTitle,l.messages.closedTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })


    }else if (mode == "deletenotranscript"){

        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("Administrator") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        
        enableTranscript = false
        deleteRequired = true
        interaction.channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        log("system","deleted a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM
        await interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketDelete(interaction.user,interaction.channel,interaction.guild,new Date(),{name:interaction.channel.name,status:"deleted",ticketOptions:ticketData})

            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    interaction.member.send({embeds:[bot.errorLog.custom(l.messages.deletedTicketDmTitle,l.messages.deletedTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })
    }


    if (enableTranscript == true && mode != "deletenotranscript"){

        if (config.system.enable_transcript || config.system.enable_DM_transcript){
            var fileattachment = await require("./transcript").createTranscript(channelmessages,channel)

            if (fileattachment == false){log("system","internal error: transcript is not created!");return}
        }
                    
        if (config.system.enable_transcript){
            const transcriptEmbed = new discord.EmbedBuilder()
                .setColor(config.main_color)
                .setTitle(l.messages.newTranscriptTitle)
                .setAuthor({name:interaction.user.username,iconURL:interaction.user.displayAvatarURL({format:"png"})})
                .setDescription(l.messages.newTranscriptDescription)
                .setFooter({text:"ticket: "+ticketuserarray})
            
            interaction.guild.channels.cache.find(c => c.id == config.system.transcript_channel).send({
                embeds:[transcriptEmbed],
                files:[fileattachment]
            })
        }

        if (config.system.enable_DM_transcript){
            const transcriptEmbed = new discord.EmbedBuilder()
                .setColor(config.main_color)
                .setTitle(l.messages.newTranscriptTitle)
                .setDescription(l.messages.newTranscriptDescription)
                .setFooter({text:"ticket: "+ticketuserarray})
            
                if (!isDatabaseError) getusernameStep1.send({
                embeds:[transcriptEmbed],
                files:[fileattachment]
            })
        }
    }

    if (deleteRequired){
        const timer = () => {return new Promise((resolve,reject) => {
            setTimeout(() => {resolve(true)},7000)
        })}
        await timer()
        await interaction.channel.delete()
    }
}

exports.runThis = () => {
    client.on("interactionCreate",async (interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "sendTranscript") return

        interaction.deferUpdate()

        const channelmessages = await interaction.channel.messages.fetch()

        channelmessages.sweep((msgSweep) => {
            return msgSweep.author.id == client.user.id
        })

        var fileattachment = await require("./transcript").createTranscript(channelmessages,interaction.channel)

        if (fileattachment == false){
            log("system","internal error: transcript is not created!")
            interaction.channel.send({embeds:[bot.errorLog.serverError(l.errors.somethingWentWrongTranscript)]})
            return
        }

        interaction.channel.send({content:"**"+l.messages.hereIsTheTranscript+"**",files:[fileattachment]})
    })
}