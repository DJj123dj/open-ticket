const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage
const permsChecker = require("./utils/permisssionChecker")

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

/**
 * 
 * @param {discord.GuildMember} member
 * @param {discord.TextChannel} channel
 * @param {String} prefix
 * @param {"delete"|"close"|"deletenotranscript"} mode
 */
exports.NEWcloseTicket = async (member,channel,prefix,mode) => {
    const guild = channel.guild
    const user = member.user
    const chalk = await (await import("chalk")).default
    const channelmessages = await channel.messages.fetch()

    //start code

    //remove ot bot from transcript
    channelmessages.sweep((msgSweep) => {return msgSweep.author.id == client.user.id})

    /**@type {String}*/
    const channelname = channel.name
    const ticketOpenerChannelName = channelname.split(prefix)[1]

    //get user that opened the ticket
    var getuserID = storage.get("userTicketStorage",channel.id)
    try {
        var ticketOpener = client.users.cache.find(u => u.id === getuserID)
        var isDatabaseError = false
    }catch{var isDatabaseError = true}

    if (!ticketOpener){
        console.log(chalk.red("[database error]"),"something went wrong when getting the data in the database.\nNo panic, this error fixes itself!")
        var isDatabaseError = true
    }

    var enableTranscript = true
    var deleteRequired = false

    if (mode == "delete"){
        //delete
        //check perms
        if (!guild) return
        if (!permsChecker.command(user.id,guild.id)){
            permsChecker.sendUserNoPerms(user)
            return
        }

        //start delete proccess
        deleteRequired = true
        await channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        log("system","deleted a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketDelete(user,channel,guild,new Date(),{name:channel.name,status:"deleted",ticketOptions:ticketData})

            if (!firstmsg.embeds[0].author) return false
            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    member.send({embeds:[bot.errorLog.custom(l.messages.deletedTicketDmTitle,l.messages.deletedTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })

    }else if (mode == "close"){
        //close
        //check perms
        if (config.system.closeMode == "adminonly"){
            if (!guild) return
            if (!permsChecker.command(user.id,guild.id)){
                permsChecker.sendUserNoPerms(user)
                return
            }
        }

        //set new permissions
        var permissionArray = []
        const pfb = discord.PermissionFlagsBits

        if (!isDatabaseError) permissionArray.push({
            id:ticketOpener,
            type:"member",
            allow:[pfb.ViewChannel],
            deny:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages]
        })

        permissionArray.push({
            id:guild.roles.everyone,
            type:"role",
            deny:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
        })

        //add main adminroles
        config.main_adminroles.forEach((role,index) => {
            try {
                const adminrole = guild.roles.cache.find(r => r.id == role)
                if (!adminrole) return

                permissionArray.push({
                    id:adminrole,
                    type:"role",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
                })
            }catch{
                log("system","invalid role! At 'config.json => main_adminroles:"+index)
            }
        })

        //add ticket adminroles
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            if (!ticketData) return

            /**
             * @type {String[]}
             */
            const ticketadmin = ticketData.adminroles
            ticketadmin.forEach((role,index) => {
                if (!config.main_adminroles.includes(role)){
                    try {
                        const adminrole = guild.roles.cache.find(r => r.id == role)
                        if (!adminrole) return
                    
                        permissionArray.push({
                            id:adminrole,
                            type:"role",
                            allow:[pfb.AddReactions,pfb.ViewChannel],
                            deny:[pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages]
                        })
                    }catch{
                        log("system","invalid role! At 'config.json => options/ticket/...:"+index)
                    }
                }
            })
        })

        channel.permissionOverwrites.set(permissionArray)

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
        channel.send({embeds:[embed],components:[closeButtonRow]})

        log("system","closed a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])
        

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketClose(user,channel,guild,new Date(),{name:channel.name,status:"closed",ticketOptions:ticketData})

            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    member.send({embeds:[bot.errorLog.custom(l.messages.closedTicketDmTitle,l.messages.closedTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })


    }else if (mode == "deletenotranscript"){
        //delete with no transcript
        //check perms
        if (!guild) return
        if (!permsChecker.command(user.id,guild.id)){
            permsChecker.sendUserNoPerms(user)
            return
        }

        //start delete proccess
        enableTranscript = false
        deleteRequired = true
        channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        log("system","deleted a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const ticketId = firstmsg.embeds[0].footer.text.split("Ticket Type: ")[1]
            const ticketData = require("./getoptions").getOptionsById("newT"+ticketId)

            require("./api/modules/events").onTicketDelete(user,channel,guild,new Date(),{name:channel.name,status:"deleted",ticketOptions:ticketData})

            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    member.send({embeds:[bot.errorLog.custom(l.messages.deletedTicketDmTitle,l.messages.deletedTicketDmDescription,":ticket:",config.main_color)]})
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
                .setAuthor({name:user.username,iconURL:user.displayAvatarURL({format:"png"})})
                .setDescription(l.messages.newTranscriptDescription)
                .setFooter({text:"ticket: "+channelname})
            
            guild.channels.cache.find(c => c.id == config.system.transcript_channel).send({
                embeds:[transcriptEmbed],
                files:[fileattachment]
            })
        }

        if (config.system.enable_DM_transcript){
            const transcriptEmbed = new discord.EmbedBuilder()
                .setColor(config.main_color)
                .setTitle(l.messages.newTranscriptTitle)
                .setDescription(l.messages.newTranscriptDescription)
                .setFooter({text:"ticket: "+channelname})
            
                if (!isDatabaseError) ticketOpener.send({
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
        await channel.delete()
    }
}