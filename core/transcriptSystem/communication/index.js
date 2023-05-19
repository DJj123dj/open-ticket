const axios = require("axios").default
const discord = require('discord.js')

const bot = require("../../../index")
const tsconfig = bot.tsconfig
const tsembeds = require("../embeds")
const tsdb = require("../tsdb")

/**@typedef {{status:"success"|"error", id:String, time:Number, estimated:{lastdump: Number, processtime:Number,waittime:Number}, transcriptstatus:{value:2, data:{fetchedmsgs:true, uploaded:true, inqueue:true, processed:false, waiting:false, available:false}}}} OTuploadResponse */

/**
 * @param {Object} json
 * @returns {Promise<OTuploadResponse|false>}
 */
exports.upload = async (json) => {
    return new Promise(async (resolve,reject) => {
        const data = encodeURIComponent(JSON.stringify(json))

        try {
        const res = await axios.post("https://transcripts.dj-dj.be/api/upload?auth=openticketTRANSCRIPT1234&version=2",JSON.stringify(json))
        if (res.status != 200) resolve(false)
        
        resolve(res.data)
        }catch(err){
            console.log("failed transcript upload!",err.response)
            resolve(false)
        }
    })
}