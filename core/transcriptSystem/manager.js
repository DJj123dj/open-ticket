const discord = require('discord.js')
const bot = require('../../index')
const client = bot.client
const config = bot.config
const log = bot.errorLog.log
const l = bot.language
const storage = bot.storage

const tsconfig = bot.tsconfig
const tsembeds = require("./embeds")
const tsdb = require("./tsdb")


const checkAvailability = async () => {
    if (process.argv.some((v) => v == "--tsoffline")) return true
    const axios = require("axios").default
    const res = await axios.get("https://transcripts.dj-dj.be/status.txt")
    if (!res || !(res.status == 200) || !res.data) return false

    if ((res.data == "online") || (res.data == "1") || (res.data == "true")) return true
    else return false
}

/**
 * 
 * @param {discord.Message[]} messages 
 * @param {discord.Guild} guild 
 * @param {discord.TextChannel} channel 
 * @param {discord.User} user 
 * @param {String|false} reason 
 */
module.exports = async (messages,guild,channel,user,reason) => {
    require("../api/modules/events").onTranscriptCreation(messages,channel,guild,new Date())
    const msglist = await channel.messages.fetchPinned()

    const chName = channel.name
    const chId = channel.id
    
    /**@param {discord.Collection<string, discord.Message<true>>} msglist*/
    const asyncmanager = async (msglist) => {
        var firstmsg = msglist.last()

        if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
        const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
        const ticketId = hiddendata.data.find(d => d.key == "type")

        const id = hiddendata.data.find(d => d.key == "openerid").value
        const opentime = new Date(Number(hiddendata.data.find(d => d.key == "createdms").value))

        const ticketopener = client.users.cache.find(u => u.id == id)
        
        if (tsconfig.sendTranscripts.useHTMLtranscripts){
            const JSONDATA = require("./communication/compileJson").compile(guild,channel,user,messages,{
                style:{
                    titleColor:tsconfig.style.titleColor,
                    enableCustomBackground:tsconfig.style.background.enableCustomBackground,
                    backgroundModus:tsconfig.style.background.backgroundModus,
                    backgroundData:tsconfig.style.background.backgroundData
                },
                bot:{
                    name:client.user.username,
                    id:client.user.id,
                    pfp:client.user.displayAvatarURL()
                },
                ticket:{
                    creatorid:ticketopener.id,
                    creatorname:ticketopener.tag,
                    openedtime:opentime.getTime(),
                    closedtime:new Date().getTime()
                }
            })

            if (!await checkAvailability()){
                const attachment = await require("./oldTranscript").createTranscript(messages,channel)
                const errembed = tsembeds.tserror(chName,chId,user)

                if (tsconfig.sendTranscripts.enableChannel){
                    /**@type {discord.TextChannel|undefined} */
                    const tc = guild.channels.cache.find((c) => c.id == tsconfig.sendTranscripts.channel)
            
                    if (!tc) return
                    tc.send({embeds:[errembed],files:[attachment]})
                }
                return
            }

            const TSdata = await require("./communication/index").upload(JSONDATA)
            if (!TSdata) return false

            if (TSdata.status == "success"){
                const url = "https://transcripts.dj-dj.be/t/"+TSdata.time+"_"+TSdata.id+".html"

                //calculate estimated time
                const lastDumpTime = (new Date(TSdata.estimated.lastdump).getTime())
                const dumpLoopTime = 15000
                const nextDump = new Date(lastDumpTime+dumpLoopTime)
                const processtime = TSdata.estimated.processtime+6000 //6sec extra time for overflow

                const finaltime = new Date(nextDump.getTime()+processtime)
                const duration = finaltime.getTime()-new Date().getTime()

                //waiting
                if (tsconfig.sendTranscripts.enableChannel){
                    /**@type {discord.TextChannel|undefined} */
                    const tc = guild.channels.cache.find((c) => c.id == tsconfig.sendTranscripts.channel)
            
                    if (!tc) return
                    const embed = tsembeds.beingprocessed(chName,chId,finaltime,user)
                    var msg = await tc.send({embeds:[embed]})
                }else {var msg = false}

                //ready
                setTimeout(() => {
                    if (msg){
                        msg.edit({embeds:[tsembeds.tsready(chName,chId,url,user)]})
                    }

                    if (tsconfig.sendTranscripts.enableDM){
                        if (!user) return
                        const embed = tsembeds.tsready(chName,chId,url,user)
                        try {
                            ticketopener.send({embeds:[embed]})
                        }catch{}
                    }
                },duration)
            }else{
                const attachment = await require("./oldTranscript").createTranscript(messages,channel)
                const errembed = tsembeds.tserror(chName,chId,user,"`error type: transcript API error`")

                if (tsconfig.sendTranscripts.enableChannel){
                    /**@type {discord.TextChannel|undefined} */
                    const tc = guild.channels.cache.find((c) => c.id == tsconfig.sendTranscripts.channel)
            
                    if (!tc) return
                    tc.send({embeds:[errembed],files:[attachment]})
                }
            }
        }else{
            const attachment = await require("./oldTranscript").createTranscript(messages,channel)
            const embed = tsembeds.tsready(chName,chId,false,user)

            if (tsconfig.sendTranscripts.enableChannel){
                /**@type {discord.TextChannel|undefined} */
                const tc = guild.channels.cache.find((c) => c.id == tsconfig.sendTranscripts.channel)
        
                if (!tc) return
                tc.send({embeds:[embed],files:[attachment]})
            }
        }
    }
    asyncmanager(msglist)
}