const fs = require("fs")
const location = "./storage/database.json"


/**@returns {[{category:String, key:String, value:String}]}*/
function getData(){
    if (fs.existsSync(location)){
        return JSON.parse(fs.readFileSync(location).toString())
    }else{
        fs.writeFileSync(location,"[]")
        return []
    }
}
/**@param {[{category:String, key:String, value:String}]} data*/
function setData(data){
    fs.writeFileSync(location,JSON.stringify(data,null,"\t"))
}

exports.set = (category,key,value) => {
        const currentData = getData()
        const exists = currentData.find((d) => (d.category == category) && (d.key == key)) ? true : false
        var newData = []
        if (exists){
            currentData.forEach((d,i) => {
                if (d.category == category && d.key == key){
                    newData.push({category,key,value})
                }else{
                    newData.push(d)
                }
            })
        }else{
            currentData.push({category,key,value})
            newData = currentData
        }

        setData(newData)
        return exists
}
/**
 * @param {String} category 
 * @param {String} key 
 * @returns {String|false}
 */
exports.get = (category,key) => {
    const currentData = getData()
    const tempresult = currentData.find((d) => (d.category == category) && (d.key == key))
    const result = tempresult ? tempresult.value : false
    return result
}

/**
 * @param {String} category 
 * @returns {[{key:String,value:String}]|false}
 */
exports.getCategory = (category) => {
    const currentData = getData()
    const result = currentData.filter((v) => v.category == category)
    return result
}

/**
 * @param {String} category 
 * @param {String} key 
 * @param {String} value 
 */
exports.delete = (category,key) => {
    const currentData = getData()
    const exists = currentData.find((d) => (d.category == category) && (d.key == key)) ? true : false
    var newData = []
    if (exists){
        currentData.forEach((d,i) => {
            if (!(d.category == category && d.key == key)){
                newData.push(d)
            }
        })
    }else{
        newData = currentData
    }

    setData(newData)
    return exists
}