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

    if (mode == "delete"){
        const permsmember = client.guilds.cache.find(g => g.id == interaction.guild.id).members.cache.find(m => m.id == interaction.member.id)
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        
        interaction.channel.delete()
        log("system","deleted a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM
        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

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
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        }

        var permissionArray = []
        if (!isDatabaseError) permissionArray.push({
            id:getusernameStep1.id,
            type:"member",
            allow:["VIEW_CHANNEL"],
            deny:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES"]
        })

        permissionArray.push({
            id:interaction.guild.id,
            type:"role",
            deny:["ADD_REACTIONS","ATTACH_FILES","EMBED_LINKS","SEND_MESSAGES","VIEW_CHANNEL"]
        })

        interaction.channel.permissionOverwrites.set(permissionArray)

        //message
        var closeButtonRow = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                .setCustomId("deleteTicket1")
                .setDisabled(false)
                .setStyle("DANGER")
                .setLabel(l.buttons.delete)
                .setEmoji("✖️")
            )
            .addComponents(
                new discord.MessageButton()
                .setCustomId("sendTranscript")
                .setDisabled(false)
                .setStyle("SECONDARY")
                .setLabel(l.buttons.sendTranscript)
                .setEmoji("📄")
            )
            .addComponents(
                new discord.MessageButton()
                .setCustomId("reopenTicket")
                .setDisabled(false)
                .setStyle("SUCCESS")
                .setLabel(l.buttons.reopen)
                .setEmoji("✔")
            )
            
        const embed = new discord.MessageEmbed()
            .setColor(config.main_color)
            .setTitle(":lock: "+l.messages.closedTitle+" :lock:")
            .setDescription(l.messages.closedDescription)
        interaction.channel.send({embeds:[embed],components:[closeButtonRow]})

        log("system","closed a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])

        //getID & send DM
        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

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
            if (config.main_adminroles.some((item)=>{return permsmember.roles.cache.has(item)}) == false && !permsmember.permissions.has("ADMINISTRATOR") && !permsmember.permissions.has("MANAGE_GUILD")){
                interaction.channel.send({embeds:[bot.errorLog.noPermsMessage]})
                return
            }
        
        enableTranscript = false
        interaction.channel.delete()
        log("system","deleted a ticket",[{key:"user",value:interaction.user.tag},{key:"ticket",value:interaction.channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM
        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

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
            const transcriptEmbed = new discord.MessageEmbed()
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
            const transcriptEmbed = new discord.MessageEmbed()
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