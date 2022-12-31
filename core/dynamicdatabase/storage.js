try {
    var db = require("./dynamicfiles/database")
}catch(err){
    console.log(err)
    console.log("I couldn't find the database file! (location: ./core/dynamicdatabase/storage.js:2)")
    process.exit(1)
}

module.exports = db