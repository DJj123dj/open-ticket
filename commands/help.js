const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

module.exports = () => {
    const helpEmbed = new discord.EmbedBuilder()
        .setColor(config.main_color)
        .setTitle(l.helpMenu.title)

    const prefix = config.prefix
    const header = config.system.ticket_channel ? l.helpMenu.header1.replace("{0}","<#"+config.system.ticket_channel+">") : l.helpMenu.header2
    helpEmbed.setDescription(header+"`"+prefix+"msg <id>` ➜ _"+l.helpMenu.msgCmd+"_\n\n`"+prefix+"rename <name>` ➜ _"+l.helpMenu.renameCmd+"_\n`"+prefix+"close` ➜ _"+l.helpMenu.closeCmd+"_\n`"+prefix+"delete` ➜ _"+l.helpMenu.deleteCmd+"_\n`"+prefix+"reopen` ➜ _"+l.helpMenu.reopenCmd+"_\n\n`"+prefix+"add <user>` ➜ _"+l.helpMenu.addCmd+"_\n`"+prefix+"remove <user>` ➜ _"+l.helpMenu.removeCmd+"_`")

    if (config.credits) helpEmbed.setFooter({text:"Open-Ticket by DJdj Development | view on github for source code",iconURL:"https://raw.githubusercontent.com/DJj123dj/open-ticket/main/logo.png"})


    client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix)) return
        var args = msg.content.split(config.prefix)
        
        if (!args[1]){
            msg.channel.send({embeds:[helpEmbed]})
            log("command","someone used the 'help' command",[{key:"user",value:msg.author.tag}])
            return
        }

        if (!args[1].startsWith("close") && !args[1].startsWith("delete") && !args[1].startsWith("remove") && !args[1].startsWith("add") && !args[1].startsWith("msg") && !args[1].startsWith("remove") && !args[1].startsWith("rename") && !args[1].startsWith("reopen")){

            msg.channel.send({embeds:[helpEmbed]})
            log("command","someone used the 'help' command",[{key:"user",value:msg.author.tag}])
        }
    })

    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "help") return

        interaction.reply({embeds:[helpEmbed]})
        log("command","someone used the 'help' command",[{key:"user",value:interaction.user.tag}])
    })
}