/**
==================================================================
ALL DATABASE FILES NEED TO EXPORT THE FOLLOWING FUNCTIONS:
- get(category:String,key:String) => String (value)
- set(category:String,key:String,value:String) => Boolean (success)
- delete(category:String,key:String) => Boolean (success)
- getCategory(category:String) => Array[{key:String,value:String}] (key,value)
==================================================================
 */

try {
    var main = require("./databases/main")
    var stats = require("./databases/stats")
}catch(err){
    console.log(err)
    console.log("Unable to find the database handlers!")
    process.exit(1)
}

module.exports = {
    main,
    stats
}