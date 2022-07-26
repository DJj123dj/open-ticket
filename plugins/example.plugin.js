const discord = require("discord.js")
const api = require("../core/api/api.js")

module.exports = () => {
    const {client,config,events,utils} = api

    //this code will run when the bot starts!
    
    events.onTicketOpen((user,channel,guild,date,ticketdata) => {
        console.log("hello, someone opened a ticket!")
    })



}