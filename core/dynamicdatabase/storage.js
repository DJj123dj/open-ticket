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


/** =============================
 ** NOT READY YET
 ** must be dynamic
 ** =============================*/
//const LocalStorage = require("node-localstorage")
//
//const ticketStorage = new LocalStorage.LocalStorage("./storage/tickets")
//exports.ticketStorage = ticketStorage
//
//const userTicketStorage = new LocalStorage.LocalStorage("./storage/userTickets")
//exports.userTicketStorage = userTicketStorage
//
//const transcriptStorage = new LocalStorage.LocalStorage("./storage/transcripts")
//exports.transcriptStorage = transcriptStorage

//const ticketNumberStorage = new LocalStorage.LocalStorage("./storage/ticketNumbers")
//exports.ticketNumberStorage = ticketNumberStorage

