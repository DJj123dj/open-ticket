const discord = require("discord.js")
const bot = require("../../index")
const client = require("../../index").client
const config = bot.config
const getoptions = require("../getoptions")

module.exports = async () => {
    const chalk = (await import("chalk")).default
    
    console.log(chalk.red("\nINSTRUCTIONS:\n\n1: Run the command you want to delete in discord.\n2: You get the message 'This command is now deleted!'\n3: There is also a message in the console that says the command is deleted.\n4: reload your discord."))
    client.on("interactionCreate",(interaction) => {
        if (!interaction.isChatInputCommand()) return console.log("this isn't a command!")

        interaction.reply({content:"This command is now deleted!"})

        try {
            client.application.commands.delete(interaction.commandId,interaction.guild.id).then(() => {
                console.log("deleted the command",chalk.blue(interaction.commandName),"(id:",interaction.commandId+")")
            })
        }catch{
            console.log(chalk.red("something went wrong by the deleting of this command!"))
        }
    })
}