const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

/**
 * 
 * @param {discord.Message[]} messagecollection 
 * @returns new `discord.messageAttachment`
 */

exports.createTranscript = async (messagecollection) => {
    try {
        const filearray = ["TRANSCRIPT START:"]

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
        return new discord.MessageAttachment(filebuff,"transcript.txt")
    }catch(err){
        console.log(err)
        return false
    }
}