const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config
const l = bot.language

/** @param {discord.TextBasedChannel} channel @returns {Promise<{ticketname:String,ticketopener:{discordjsuser:discord.User,name:String,id:String}>} */
const getUserInfo = (channel) => {
    return new Promise((promiseresolve,reject) => {
        //getID
        var result = {
            ticketopener:{
                discordjsuser:"",
                id:"/",
                name:"/"
            },
            ticketname:"/"
        }
        channel.messages.fetchPinned().then(msglist => {
            var firstmsg = msglist.last()

            if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false

            const id = firstmsg.embeds[0].author.name ? firstmsg.embeds[0].author.name : false

            result.ticketopener.id = id

            const ticketopener = client.users.cache.find(u => u.id == id)
            const name = ticketopener.tag

            const channelname = channel.name

            promiseresolve({ticketname:channelname,ticketopener:{discordjsuser:ticketopener,name:name,id:id}})
        })
    })
}

/**
 * 
 * @param {discord.Message[]} messagecollection 
 * @param {discord.Channel} channel 
 * @returns new `discord.attachmentBuilder`
 */

exports.createTranscript = async (messagecollection,channel) => {
    const ticketuserdata = await getUserInfo(channel)
    try {
        const cd = new Date()
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        const dateString = cd.getDate()+" "+months[cd.getMonth()-1]+" "+cd.getFullYear()+" - "+cd.getSeconds()+":"+cd.getMinutes()+":"+cd.getHours()
        const filearray = ["open ticket transcript:\ntranscript creation: "+dateString+"\nticket name: "+ticketuserdata.ticketname+"\nticket opener: "+ticketuserdata.ticketopener.name,"\nTRANSCRIPT START:"]

        messagecollection.reverse()

        messagecollection.forEach((msg) => {
            const timestamp = new Date(msg.createdTimestamp)

            if (msg.content){var content = msg.content}else{var content = "*empty message*"}

            const msgstats = "files: "+msg.attachments.size+" | embeds: "+msg.embeds.length+" | isbot: "+msg.author.bot
            filearray.push("["+timestamp.getDate()+"/"+timestamp.getMonth()+"/"+timestamp.getFullYear()+" | "+timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds()+" | "+msg.author.tag+" ] ["+msgstats+"]\n"+content+"\n")
        })

        if (filearray.length < 2) filearray.push("transcript is empty")
        const filestring = filearray.join("\n")
        const filebuff = Buffer.from(filestring,"utf-8")
        return new discord.AttachmentBuilder(filebuff,{name:"transcript_"+ticketuserdata.ticketname+".txt",description:"An Open Ticket transcript"})
    }catch(err){
        console.log("[error] "+err)
        return false
    }
}