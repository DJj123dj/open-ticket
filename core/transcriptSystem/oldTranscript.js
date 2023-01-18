const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const l = bot.language

/**
 * 
 * @param {discord.Message[]} messagecollection 
 * @returns new `discord.attachmentBuilder`
 */

exports.createTranscript = async (messagecollection) => {
    try {
        const cd = new Date()
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        const dateString = cd.getDate()+" "+months[cd.getMonth()-1]+" "+cd.getFullYear()+" - "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
        const filearray = ["BACKUP TRANSCRIPT:\n"]

        messagecollection.reverse()

        messagecollection.forEach((msg) => {
            const timestamp = new Date(msg.createdTimestamp)

            if (msg.content){var content = msg.content}else{var content = "*empty message*"}

            const msgstats = "files: "+msg.attachments.size+", embeds: "+msg.embeds.length
            filearray.push("["+timestamp.getDate()+"/"+timestamp.getMonth()+"/"+timestamp.getFullYear()+", "+timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds()+"|"+msg.author.tag+"] ["+msgstats+"]\n"+content+"\n")
        })

        if (filearray.length < 2) filearray.push("transcript is empty")
        const filestring = filearray.join("\n")
        const filebuff = Buffer.from(filestring,"utf-8")
        return new discord.AttachmentBuilder(filebuff,{name:"backuptranscript.txt",description:"Open Ticket transcript"})
    }catch{
        return false
    }
}