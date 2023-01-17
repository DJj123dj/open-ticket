const axios = require("axios").default
const discord = require('discord.js')

const bot = require("../../../index")
const tsconfig = bot.tsconfig
const tsembeds = require("../embeds")
const tsdb = require("../tsdb")

/**@typedef {{status:"success"|"error", id:String, time:Number, estimated:{lastdump: Number, processtime:Number}, transcriptstatus:{value:2, data:{fetchedmsgs:true, uploaded:true, inqueue:true, processed:false, waiting:false, available:false}}}} OTuploadResponse */

/**
 * @param {Object} json
 * @returns {OTuploadResponse}
 */
exports.upload = async (json) => {

    const data = encodeURIComponent(JSON.stringify(json))

    try {
    const res = await axios.get("https://api.transcripts.dj-dj.be/upload?auth=openticketTRANSCRIPT1234&version=1.0.0&data="+data)
    if (res.status != 200) return false

    return res.data
    }catch{
        console.log("failed transcript upload!") 
        return false
    }
}