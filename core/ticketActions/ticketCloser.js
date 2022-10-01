const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage
const permsChecker = require("../utils/permisssionChecker")

const pendingDelete = []

/**
 * 
 * @param {discord.GuildMember} member
 * @param {discord.TextChannel} channel
 * @param {String} prefix
 * @param {"delete"|"close"|"deletenotranscript"} mode
 * @param {Boolean} nomessage
 * @param {String} reason only when closing, not when deleting!
 */
exports.NEWcloseTicket = async (member,channel,prefix,mode,reason,nomessage) => {
    const guild = channel.guild
    const user = member.user
    const chalk = await (await import("chalk")).default
    const channelmessages = await channel.messages.fetch()

    const newReason = reason ? reason : l.messages.none

    //start code

    //FIX CHANNEL COULD BE CLOSED AFTER DELETE:
    if (pendingDelete.includes(channel.id)) return false

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
        if (!nomessage){
            await channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        }
        log("system","deleted a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])
        pendingDelete.push(channel.id)

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(async msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value.value
            const ticketData = require("../utils/configParser").getTicketById(ticketId,true)

            require("../api/modules/events").onTicketDelete(user,channel,guild,new Date(),{name:channel.name,status:"deleted",ticketOptions:ticketData})

            const id = hiddendata.data.find(d => d.key == "openerid").value

            const sphd = bot.hiddenData.removeHiddenData(firstmsg.embeds[0].description)
            sphd.hiddenData.data.push({key:"pendingdelete",value:"true"})
            const newEmbed = new discord.EmbedBuilder(firstmsg.embeds[0].data)
            newEmbed.setDescription(sphd.description + bot.hiddenData.writeHiddenData(sphd.hiddenData.type,sphd.hiddenData.data))
            await firstmsg.edit({embeds:[newEmbed]})

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
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value
            const ticketData = require("../utils/configParser").getTicketById(ticketId,true)

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

        if (!nomessage){
            //message
            var closeButtonRow = new discord.ActionRowBuilder()
                .addComponents(
                    new discord.ButtonBuilder()
                    .setCustomId("OTdeleteTicket1")
                    .setDisabled(false)
                    .setStyle(discord.ButtonStyle.Danger)
                    .setLabel(l.buttons.delete)
                    .setEmoji("✖️")
                )
                .addComponents(
                    new discord.ButtonBuilder()
                    .setCustomId("OTsendTranscript")
                    .setDisabled(false)
                    .setStyle(discord.ButtonStyle.Secondary)
                    .setLabel(l.buttons.sendTranscript)
                    .setEmoji("📄")
                )
                .addComponents(
                    new discord.ButtonBuilder()
                    .setCustomId("OTreopenTicket")
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
        }

        log("system","closed a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])
        

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value
            const ticketData = require("../utils/configParser").getTicketById(ticketId,true)

            require("../api/modules/events").onTicketClose(user,channel,guild,new Date(),{name:channel.name,status:"closed",ticketOptions:ticketData},newReason)

            const id = hiddendata.data.find(d => d.key == "openerid").value

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    member.send({embeds:[bot.errorLog.custom(l.messages.closedTicketDmTitle,l.messages.closedTicketDmDescription+"\n\n**reason:** "+newReason,":ticket:",config.main_color)]})
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
        if (!nomessage){
            await channel.send({content:"**"+l.messages.gettingdeleted+"**"})
        }
        log("system","deleted a ticket",[{key:"user",value:user.tag},{key:"ticket",value:channel.name}])

        if (!isDatabaseError) storage.set("ticketStorage",getuserID,Number(storage.get("ticketStorage",getuserID)) - 1)

        //getID & send DM & send api event
        await channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()
            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
            const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
            const ticketId = hiddendata.data.find(d => d.key == "type").value
            const ticketData = require("../utils/configParser").getTicketById(ticketId,true)

            require("../api/modules/events").onTicketDelete(user,channel,guild,new Date(),{name:channel.name,status:"deleted",ticketOptions:ticketData})

            const id = hiddendata.data.find(d => d.key == "openerid").value

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

        const transcriptReason = (mode == "close") ? "**"+l.messages.reason+":** "+newReason : "**"+l.messages.reason+":** "+l.messages.none
        const closedByPrefix = (mode.startsWith("delete")) ? "deleted by" : "closed by"

        if (config.system.enable_transcript || config.system.enable_DM_transcript){
            var fileattachment = await require("../transcript").createTranscript(channelmessages,channel)

            if (fileattachment == false){log("system","internal error: transcript is not created!");return}
        }
                    
        if (config.system.enable_transcript && !require("../api/api.json").disable.transcripts.server){
            const transcriptEmbed = new discord.EmbedBuilder()
                .setColor(config.main_color)
                .setTitle("📄 "+l.messages.newTranscriptTitle)
                .setDescription(transcriptReason)
                .setFooter({text:closedByPrefix+": "+user.tag+" | ticket: "+channelname,iconURL:user.displayAvatarURL()})
            
            guild.channels.cache.find(c => c.id == config.system.transcript_channel).send({
                embeds:[transcriptEmbed],
                files:[fileattachment]
            })
        }

        if (config.system.enable_DM_transcript && !require("../api/api.json").disable.transcripts.dm){
            const transcriptEmbed = new discord.EmbedBuilder()
                .setColor(config.main_color)
                .setTitle("📄 "+l.messages.newTranscriptTitle)
                .setDescription(transcriptReason)
                .setFooter({text:closedByPrefix+": "+user.tag+" | ticket: "+channelname,iconURL:user.displayAvatarURL()})
            
                if (!isDatabaseError) ticketOpener.send({
                embeds:[transcriptEmbed],
                files:[fileattachment]
            })
        }
    }

    if (deleteRequired){
        //const timer = () => {return new Promise((resolve,reject) => {
        //    setTimeout(() => {resolve(true)},7000)
        //})}
        //await timer()

        setTimeout(async () => {
            pendingDelete.shift()
            await channel.delete()
        },6000)
    }
}