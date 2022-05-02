const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

module.exports = () => {
    const helpEmbed = new discord.MessageEmbed()
        .setColor(config.main_color)
        .setTitle("Help Menu:")

    const prefix = config.prefix
    helpEmbed.setDescription("**Go to <#"+config.system.ticket_channel+"> to create a ticket!**\n\n`"+prefix+"msg <id>` ➜ _Spawn an embed with buttons. (admin only)_\n\n`"+prefix+"rename <name>` ➜ _Rename a ticket. (no spaces)_\n`"+prefix+"close` ➜ _Close a ticket._\n`"+prefix+"delete` ➜ _Delete a ticket._\n\n`"+prefix+"add <user>` ➜ _Add a user to the ticket._\n`"+prefix+"remove <user>` ➜ _Remove a user from the ticket._`")

    if (config.credits) helpEmbed.setFooter({text:"Open-Ticket by DJdj Development | view on github for source code"})


    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix)) return
        var args = msg.content.split(config.prefix)

        if (!args[1].startsWith("close") && !args[1].startsWith("delete") && !args[1].startsWith("remove") && !args[1].startsWith("add") && !args[1].startsWith("msg") && !args[1].startsWith("remove")  && !args[1].startsWith("rename")){

            msg.channel.send({embeds:[helpEmbed]})
            if (config.logs){console.log("[command] "+config.prefix+"ticket help (user:"+msg.author.username+")")}
        }
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "help") return

        interaction.reply({embeds:[helpEmbed]})
    })
}