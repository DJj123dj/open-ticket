const discord = require("discord.js")
const api = require("../core/api/api.js")

module.exports = () => {
    const {client,config,events,utils,actions} = api

    //this code will run when the bot starts!
    
    //in this example, we will say "hello" in the console when someone opens a ticket!

    /**
    
    events.onTicketOpen((user,channel,guild,date,ticketdata) => {
        console.log("hello, someone opened a ticket!")
    })


    */
}