const LocalStorage = require("node-localstorage")

const ticketStorage = new LocalStorage.LocalStorage("./storage/tickets")
exports.ticketStorage = ticketStorage

const userTicketStorage = new LocalStorage.LocalStorage("./storage/userTickets")
exports.userTicketStorage = userTicketStorage

const transcriptStorage = new LocalStorage.LocalStorage("./storage/transcripts")
exports.transcriptStorage = transcriptStorage

//const ticketNumberStorage = new LocalStorage.LocalStorage("./storage/ticketNumbers")
//exports.ticketNumberStorage = ticketNumberStorage

