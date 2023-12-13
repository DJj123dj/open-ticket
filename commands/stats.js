/**
!!! NEW !!!
The /stats command

(well, it's not finished yet 😉)
=================================================
client.on("messageCreate",async (msg) => {
    if (!msg.content.startsWith("!test global")) return
    msg.channel.send({
        content:"testing `GLOBAL_STATS`",
        embeds:[await createGlobalStatsEmbed()]
    })
})
client.on("messageCreate",async (msg) => {
    if (!msg.content.startsWith("!test ticket")) return

    if (!existStats("ticket","STATUS",msg.channel.id)){
        msg.channel.send({embeds:[bot.errorLog.notInATicket]})
        return
    }

    msg.channel.send({
        content:"testing `TICKET_STATS`",
        embeds:[await createTicketStatsEmbed(msg.guild,msg.channel.id)]
    })
})
client.on("messageCreate",async (msg) => {
    if (!msg.content.startsWith("!test user")) return
    const mention = msg.mentions.users.first()

    if (mention){
        if (!existStats("user","TICKETS_CREATED",mention.id)){
            msg.channel.send({embeds:[bot.errorLog.serverError("This user can't be found in the stats database!")]})
            return
        }

        msg.channel.send({
            content:"testing `USER_STATS`",
            embeds:[await createUserStatsEmbed(msg.guild,mention,msg.channel.id)]
        })
    }else{
        if (!existStats("user","TICKETS_CREATED",msg.author.id)){
            msg.channel.send({embeds:[bot.errorLog.serverError("This user can't be found in the stats database!")]})
            return
        }

        msg.channel.send({
            content:"testing `USER_STATS`",
            embeds:[await createUserStatsEmbed(msg.guild,msg.author,msg.channel.id)]
        })
    }
})
 */