//Do not change this without knowing what you are doing!!
const databaseFile = "local"
//Do not change this without knowing what you are doing!!


try {
    var db = require("./dynamicfiles/local")
}catch{
    console.log("I couldn't find the database file! (location: ./core/dynamicdatabase/storage.js:2)")
    process.exit(1)
}

module.exports = db