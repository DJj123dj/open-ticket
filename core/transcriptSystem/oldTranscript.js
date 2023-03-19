const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const l = bot.language

/**
 * 
 * @param {discord.Message[]} messagecollection 
 * @param {discord.TextChannel} channel
 * @param {Boolean} backup
 * @returns new `discord.attachmentBuilder`
 */

exports.createTranscript = async (messagecollection,channel,backup) => {
    try {
        const cd = new Date()
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        const dateString = cd.getDate()+" "+months[cd.getMonth()-1]+" "+cd.getFullYear()+" - "+cd.getHours()+":"+cd.getMinutes()+":"+cd.getSeconds()
        let backuptitle = backup ? "BACKUP " : ""
        let backupfilename = backup ? "backup" : ""
        const filearray = [backuptitle+"TRANSCRIPT:\n"]

        messagecollection.reverse()

        messagecollection.forEach((msg) => {
            const timestamp = new Date(msg.createdTimestamp)

            //empty message handling
            if (msg.content){
                var content = msg.content
            }else if (msg.embeds.length > 0 && msg.attachments.length > 0){
                var content = "*this message only has embeds & files*"
            }else if (msg.embeds.length > 0){
                var content = "*this message only has embeds*"
            }else if (msg.attachments.length > 0){
                var content = "*this message only has files*"
            }else{
                var content = "*empty message*"
            }


            const fileurls = []
            const rawfiles = Array.from(msg.attachments)
            rawfiles.forEach((file) => {
                fileurls.push("attachment: "+file[1].url)
            })
            const filestring = fileurls.length > 0 ? fileurls.join("\n")+"\n" : ""
            const msgstats = "files: "+msg.attachments.size+", embeds: "+msg.embeds.length
            filearray.push("["+timestamp.getDate()+"/"+timestamp.getMonth()+"/"+timestamp.getFullYear()+", "+timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds()+"|"+msg.author.tag+"] ["+msgstats+"]\n"+content+"\n"+filestring)
        })

        if (filearray.length < 2) filearray.push("transcript is empty")
        const filestring = filearray.join("\n")
        const filebuff = Buffer.from(filestring,"utf-8")
        return new discord.AttachmentBuilder(filebuff,{name:backupfilename+"transcript.txt",description:"Open Ticket transcript"})
    }catch{
        return false
    }
}