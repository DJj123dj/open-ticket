const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log

module.exports = () => {
    const helpEmbed = new discord.MessageEmbed()
        .setColor(config.main_color)
        .setTitle("Help Menu:")

    const prefix = config.prefix
    const header = config.system.ticket_channel ? "**Go to <#"+config.system.ticket_channel+"> to create a ticket!**\n\n" : "**Run the command `/new` or `/ticket` to create a ticket!**\n\n"
    helpEmbed.setDescription(header+"`"+prefix+"msg <id>` ➜ _Spawn an embed with buttons. (admin only)_\n\n`"+prefix+"rename <name>` ➜ _Rename a ticket. (no spaces)_\n`"+prefix+"close` ➜ _Close a ticket._\n`"+prefix+"delete` ➜ _Delete a ticket._\n`"+prefix+"reopen` ➜ _Re-Open a ticket after it was closed._\n\n`"+prefix+"add <user>` ➜ _Add a user to the ticket._\n`"+prefix+"remove <user>` ➜ _Remove a user from the ticket._`")

    if (config.credits) helpEmbed.setFooter({text:"Open-Ticket by DJdj Development | view on github for source code",iconURL:"https://raw.githubusercontent.com/DJj123dj/open-ticket/main/logo.png"})


    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix)) return
        var args = msg.content.split(config.prefix)

        if (!args[1].startsWith("close") && !args[1].startsWith("delete") && !args[1].startsWith("remove") && !args[1].startsWith("add") && !args[1].startsWith("msg") && !args[1].startsWith("remove") && !args[1].startsWith("rename") && !args[1].startsWith("reopen")){

            msg.channel.send({embeds:[helpEmbed]})
            log("command","someone used the 'help' command",[{key:"user",value:msg.author.tag}])
        }
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "help") return

        interaction.reply({embeds:[helpEmbed]})
        log("command","someone used the 'help' command",[{key:"user",value:interaction.user.tag}])
    })
}