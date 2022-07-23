const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

module.exports = () => {
    var closeRowNormal = new discord.ActionRowBuilder()
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
    
    var closeRowClosed = new discord.ActionRowBuilder()
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
    
    var reopenBar = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId("reopenTicketTrue")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji("✅")
        )
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId("reopenTicketFalse")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji("❌")
        )
    
    var reopenBar1 = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId("reopenTicketTrue1")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji("✅")
        )
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId("reopenTicketFalse1")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji("❌")
        )

    var reopenCommandBar = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
                .setCustomId("reopenTicket1")
                .setDisabled(false)
                .setStyle(discord.ButtonStyle.Secondary)
                .setEmoji("🔓")
        )

    //NORMAL WAY
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicket") return

        interaction.deferUpdate()
        interaction.message.edit({components:[reopenBar]})

    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketFalse") return

        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowClosed]})

    })

    const pfb = discord.PermissionFlagsBits

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketTrue") return

        interaction.deferUpdate()
        
        const embed = new discord.EmbedBuilder()
            .setColor(config.main_color)
            .setTitle(":unlock: "+l.messages.reopenTitle+" :unlock:")
            .setDescription(l.messages.reopenDescription)

        interaction.message.edit({embeds:[embed],components:[closeRowNormal]})

        log("system","re-opened a ticket",[{key:"ticket",value:interaction.channel.name},{key:"user",value:interaction.user.tag}])


        var permissionsArray = []

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

        interaction.channel.permissionOverwrites.cache.forEach((p) => {
            if (p.type == "member"){
                permissionsArray.push({
                    id:p.id,
                    type:"member",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel],
                    deny:[]
                })
            }
        })

        interaction.channel.permissionOverwrites.set(permissionsArray)
    })


    //COMMAND WAY
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicket1") return

        interaction.deferUpdate()
        interaction.message.edit({components:[reopenBar1]})

    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketFalse1") return

        interaction.deferUpdate()
        interaction.message.edit({components:[reopenCommandBar]})

    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId != "reopenTicketTrue1") return

        interaction.deferUpdate()
        
        const embed = new discord.EmbedBuilder()
            .setColor(config.main_color)
            .setTitle(":unlock: "+l.messages.reopenTitle+" :unlock:")
            .setDescription(l.messages.reopenDescription)

        interaction.message.edit({content:null,embeds:[embed],components:[closeRowNormal]})

        log("system","re-opened a ticket",[{key:"ticket",value:interaction.channel.name},{key:"user",value:interaction.user.tag}])


        var permissionsArray = []

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

        interaction.channel.permissionOverwrites.cache.forEach((p) => {
            if (p.type == "member"){
                permissionsArray.push({
                    id:p.id,
                    type:"member",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel],
                    deny:[]
                })
            }
        })

        interaction.channel.permissionOverwrites.set(permissionsArray)

        //getID & send DM
        interaction.channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const id = firstmsg.embeds[0].author.name

            if (!id) return false

            try{
                if (config.system.enable_DM_Messages){
                    interaction.member.send({embeds:[bot.errorLog.custom(l.messages.reopenTicketDmTitle,l.messages.reopenTicketDmDescription,":ticket:",config.main_color)]})
                }
            }
            catch{log("system","can't send DM to member, member doesn't allow dm's")}
        })
    })

    //DASHBOARD (comming soon!)
    /**
     * 
     * @param {discord.Guild} guild 
     * @param {discord.TextBasedChannel} channel 
     * @param {discord.User} user 
     * @returns 
     */
    const reopenTicket = (guild,channel,user) => {
        log("system","re-opened a ticket",[{key:"ticket",value:channel.name},{key:"user",value:user.tag}])

        var permissionsArray = []

        //set everyone allowed
        if (config.system['has@everyoneaccess']){
            var everyoneAllowPerms = [pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel]
            var everyoneDenyPerms = []
        }else{
            var everyoneAllowPerms = []
            var everyoneDenyPerms = [pfb.ViewChannel]
        }
        permissionsArray.push({
            id:guild.roles.everyone,
            type:"role",
            allow:everyoneAllowPerms,
            deny:everyoneDenyPerms
        })

        channel.permissionOverwrites.cache.forEach((p) => {
            if (p.type == "member"){
                permissionsArray.push({
                    id:p.id,
                    type:"member",
                    allow:[pfb.AddReactions,pfb.AttachFiles,pfb.EmbedLinks,pfb.SendMessages,pfb.ViewChannel],
                    deny:[]
                })
            }
        })

        channel.permissionOverwrites.set(permissionsArray)
    }
}