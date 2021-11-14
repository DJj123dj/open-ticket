const discord = require('discord.js')
const config = require('./config.json')
const intents = discord.Intents
const client = new discord.Client({intents:[intents.FLAGS.GUILDS,intents.FLAGS.GUILD_MESSAGES,intents.FLAGS.GUILD_MEMBERS]})
exports.client = client

client.on('ready',() => {
    console.log('ready')
    client.user.setActivity("HighMT",{type:"PLAYING"})
})

var storage = require('./storage/storage')
exports.TicketStorage = storage.ticketStorage
exports.userTicketStorage = storage.userTicketStorage
exports.transcriptStorage = storage.transcriptStorage
exports.ticketNumberStorage = storage.ticketNumberStorage

var ticket = require('./commands/ticket')
ticket()

var ticketSystem = require('./commands/ticketSystem')
ticketSystem()

var ticketExtra = require("./commands/ticketExtra")
ticketExtra()


client.login(config.auth_token)