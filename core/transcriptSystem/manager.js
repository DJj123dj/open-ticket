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

/**
 * 
 * @param {discord.Message[]} messages 
 * @param {discord.Guild} guild 
 * @param {discord.TextChannel} channel 
 * @param {discord.User} user 
 * @param {String|false} reason 
 */
module.exports = async (messages,guild,channel,user,reason) => {
    const msglist = await channel.messages.fetchPinned()

    const chName = channel.id
    const chId = channel.name

    if (tsconfig.sendTranscripts.enableChannel){
        /**@type {discord.TextChannel|undefined} */
        const tc = guild.channels.cache.find((c) => c.id == tsconfig.sendTranscripts.channel)

        if (!tc) return
        const embed = tsembeds.beingprocessed(chName,chId,60000,user)
        var msg = await tc.send({embeds:[embed]})
    }else {var msg = false}
    
    /**@param {discord.Collection<string, discord.Message<true>>} msglist*/
    const asyncmanager = async (msglist) => {
        var firstmsg = msglist.last()

        if (firstmsg == undefined || firstmsg.author.id != client.user.id) return false
        const hiddendata = bot.hiddenData.readHiddenData(firstmsg.embeds[0].description)
        const ticketId = hiddendata.data.find(d => d.key == "type")

        const id = hiddendata.data.find(d => d.key == "openerid").value
        const opentime = new Date(Number(hiddendata.data.find(d => d.key == "createdms").value))

        const ticketopener = client.users.cache.find(u => u.id == id)
        
    
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

        require("fs").writeFileSync("./TESTJSON.json",JSON.stringify(JSONDATA,null,"\t"))

        const TSdata = await require("./communication/index").upload(JSONDATA)
        if (!TSdata) return false
        if (TSdata.status == "success"){
            const url = "https://transcripts.dj-dj.be/t/"+TSdata.time+"_"+TSdata.id+".html"

            if (msg){
                msg.edit(tsembeds.tsready(chName,chId,url,user))
                console.log("URL:",url)
            }

            if (tsconfig.sendTranscripts.enableDM){
                if (!user) return
                const embed = tsembeds.tsready(chName,chId,url,user)
                try {
                    user.send({embeds:[embed]})
                }catch{}
            }
        }
    }
    asyncmanager(msglist)
}