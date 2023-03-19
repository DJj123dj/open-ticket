const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language

const APIEvents = require("../core/api/modules/events")
const DISABLE = require("../core/api/api.json").disable

module.exports = () => {
    bot.errorLog.log("debug","COMMANDS: loaded help.js")

    const msgName = config.system.showSlashcmdsInHelp ? "message" : "msg"
    const prefix = config.system.showSlashcmdsInHelp ? "/" : config.prefix

    const helpEmbed = new discord.EmbedBuilder()
        .setColor(config.color)
        .setTitle("❔ "+l.helpMenu.title)

    const header = l.helpMenu.header2
    helpEmbed.setDescription(header+"`"+prefix+msgName+" <id>` ➜ _"+l.helpMenu.msgCmd+"_\n\n`"+prefix+"rename <name>` ➜ _"+l.helpMenu.renameCmd+"_\n`"+prefix+"close [reason]` ➜ _"+l.helpMenu.closeCmd+"_\n`"+prefix+"delete` ➜ _"+l.helpMenu.deleteCmd+"_\n`"+prefix+"reopen` ➜ _"+l.helpMenu.reopenCmd+"_\n\n`"+prefix+"add <user>` ➜ _"+l.helpMenu.addCmd+"_\n`"+prefix+"remove <user>` ➜ _"+l.helpMenu.removeCmd+"_\n\n`"+prefix+"change <newtype>` ➜ _"+l.helpMenu.changeCmd+"_\n`"+prefix+"claim [user]` ➜ _"+l.helpMenu.claimCmd+"_\n`"+prefix+"unclaim` ➜ _"+l.helpMenu.unclaimCmd+"_")
    helpEmbed.addFields([
        {name:"Autoclose",value:l.helpMenu.autocloseCmd+"\n`"+prefix+"autoclose enable <inactive time>`\n`"+prefix+"autoclose disable`"}
    ])

    var otherprefix = prefix.endsWith(" ") ? prefix.substring(0,prefix.length-1) : prefix

    if (!DISABLE.commands.text.help) client.on("messageCreate",msg => {
        if (!msg.content.startsWith(config.prefix)) return
        var args = msg.content.split(config.prefix)
        
        if (msg.content == config.prefix || msg.content == config.prefix+" " || msg.content == otherprefix){
            msg.channel.send({embeds:[helpEmbed]})
            log("command","someone used the 'help' command",[{key:"user",value:msg.author.tag}])
            APIEvents.onCommand("help",true,msg.author,msg.channel,msg.guild,new Date())
            return
        }

        if (args[1]){
            if (!args[1].startsWith("close") && !args[1].startsWith("delete") && !args[1].startsWith("remove") && !args[1].startsWith("add") && !args[1].startsWith("msg") && !args[1].startsWith("remove") && !args[1].startsWith("rename") && !args[1].startsWith("reopen")){
                msg.channel.send({embeds:[helpEmbed]})
                log("command","someone used the 'help' command",[{key:"user",value:msg.author.tag}])
                APIEvents.onCommand("help",true,msg.author,msg.channel,msg.guild,new Date())
            }
        }
    })

    if (!DISABLE.commands.slash.help) client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return
        if (interaction.commandName != "help") return

        interaction.reply({embeds:[helpEmbed]})
        log("command","someone used the 'help' command",[{key:"user",value:interaction.user.tag}])
        APIEvents.onCommand("help",true,interaction.user,interaction.channel,interaction.guild,new Date())
    })
}