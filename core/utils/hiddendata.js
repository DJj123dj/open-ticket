const storage = require("../../index").storage

/**@typedef {[{key:String,value:String}]} hiddenData */

/**
 * 
 * @param {String} channelid 
 * @returns {hiddenData}
 */

exports.readHiddenData = (channelid) => {
    const content = storage.get("HIDDENDATA",channelid)
    if (!content) return []

    try {
        return JSON.parse(content)
    } catch {
        return []
    }
}

/**
 * 
 * @param {String} channelid 
 * @param {[{key:String,value:String}]} data 
 * @returns {Boolean}
 */
exports.writeHiddenData = (channelid,data) => {
    try {
        storage.set("HIDDENDATA",channelid,JSON.stringify(data))
        return true
    } catch {
        return false
    }
}

/**
 * 
 * @param {String} channelid
 * @returns {Boolean}
 */
exports.deleteHiddenData = (channelid) => {
    try {
        storage.delete("HIDDENDATA",channelid)
        return true
    } catch {
        return false
    }
}