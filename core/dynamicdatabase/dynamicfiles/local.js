const localstorage = require("node-localstorage")

const ls = new localstorage.LocalStorage("./storage/dynamicDB")

/**
 * 
 * @param {String} category 
 * @param {String} id 
 * @param {String} value 
 * @returns {Boolean}
 */
exports.set = (category,id,value) => {
    ls.setItem(category+"--"+id,value.toString())
    return true
}

/**
 * 
 * @param {String} category 
 * @param {String} id  
 * @returns {String|false}
 */
exports.get = (category,id) => {
    const result = ls.getItem(category+"--"+id)
    if (!result) return false
    
    return result
}

/**
 * 
 * @param {String} category 
 * @param {String} id 
 * @returns {Boolean}
 */
exports.delete = (category,id) => {
    ls.removeItem(category+"--"+id)
    return true
}

this.set("category","key","value")
this.get("category","key",)
this.delete("category","key")