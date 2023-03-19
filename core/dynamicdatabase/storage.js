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
    var db = require("./dynamicfiles/database")
}catch(err){
    console.log(err)
    console.log("I couldn't find the database file! (location: ./core/dynamicdatabase/storage.js:2)")
    process.exit(1)
}

module.exports = db