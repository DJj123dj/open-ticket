const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

module.exports = () => {
    setInterval(async () => {
        try{
            const tickets = storage.getCategory("autocloseTickets")
            if (!tickets) return
            tickets.forEach(async (t) => {
                if (t.value == "false" || t.value == 0 || typeof t.value != "number") return
                try{
                    
                    const channel = await client.channels.fetch(t.key,{cache:true})
                    if (!channel || !channel.isTextBased()) return

                    const message = (await channel.messages.fetch({limit:10})).first()
                    if (!message) return

                    const secondsSLM = Math.round((new Date().getTime() - message.createdTimestamp)/1000)
                    const hoursSLM = secondsSLM/3600
                    
                    if (hoursSLM > t.value){
                        /**@type {discord.Guild|false} */
                        const guild = client.guilds.cache.find((g) => g.id == channel.guild.id)
                        if (!guild) return
                        const clientMember = guild.members.cache.find((m) => m.id == client.user.id)
                        if (!clientMember) return

                        var name = channel.name
                        var prefix = ""
                        const tickets = config.options
                        tickets.forEach((ticket) => {
                            if (name.startsWith(ticket.channelprefix)){
                                prefix = ticket.channelprefix
                            }
                        })

                        require("./ticketCloser").closeManager(clientMember,channel,prefix,"close","OTautoclose",true)
                        storage.delete("autocloseTickets",channel.id)

                        channel.send({embeds:[bot.embeds.commands.autocloseSignalEmbed(client.user,t.value)],components:[bot.buttons.close.closeCommandRow]})
                    }
                
                }catch{
                    log("system","can't find autoclose channel with ID: "+t.key)
                    storage.delete("autocloseTickets",t.key)
                }
            })
        }catch{}
    },120000)
}