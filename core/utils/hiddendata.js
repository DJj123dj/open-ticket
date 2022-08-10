
/**@typedef {{type:String,data:[{key:String,value:String}]}} hiddenData */

/**
 * 
 * @param {String} messageContent 
 * @returns {hiddenData}
 */

exports.readHiddenData = (messageContent) => {
    //ticketdata//type:123|userid:456)
    const rawhidden = messageContent.split("[ ](OTDATA|")[1]
    const rawhidden2 = rawhidden.split("//")

    const datatype = rawhidden2[0]
    var rawhiddendata = rawhidden2[1]
    var rawhiddendataArray = rawhiddendata.split("")
    rawhiddendataArray.pop()

    rawhiddendata = rawhiddendataArray.join("")

    const splittedData = rawhiddendata.split("|")

    const resultData = []
    splittedData.forEach((data) => {
        //   type:123
        const dataresult = data.split(":")

        resultData.push({key:dataresult[0],value:dataresult[1]})
    })

    return {type:datatype,data:resultData}
}

/**
 * 
 * @param {String} type 
 * @param {[{key:String,value:String}]} data 
 * @returns {String}
 */
exports.writeHiddenData = (type,data) => {
    const dataValues = []
    data.forEach((d) => {
        dataValues.push(d.key+":"+d.value)
    })

    const datastring = dataValues.join("|")

    const result = "[ ](OTDATA|"+type+"//"+datastring+")"

    return result
}