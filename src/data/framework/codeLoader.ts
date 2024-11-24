import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")
const globalDatabase = openticket.databases.get("openticket:global")
const userDatabase = openticket.databases.get("openticket:users")
const ticketDatabase = openticket.databases.get("openticket:tickets")
const statsDatabase = openticket.databases.get("openticket:stats")
const optionDatabase = openticket.databases.get("openticket:options")
const mainServer = openticket.client.mainServer

export const loadAllCode = async () => {
    if (!generalConfig || !mainServer || !globalDatabase || !userDatabase || !ticketDatabase || !statsDatabase || !optionDatabase) return

    loadCommandErrorHandlingCode()
    loadStartListeningInteractionsCode()
    loadDatabaseCleanersCode()
    loadPanelAutoUpdateCode()
    loadDatabaseSaversCode()
    loadAutoCode()
}

export const loadCommandErrorHandlingCode = async () => {
    //COMMAND ERROR HANDLING
    openticket.code.add(new api.ODCode("openticket:command-error-handling",14,() => {
        //invalid/missing options
        openticket.client.textCommands.onError(async (error) => {
            if (error.msg.channel.type == discord.ChannelType.GroupDM) return
            if (error.type == "invalid_option"){
                error.msg.channel.send((await openticket.builders.messages.getSafe("openticket:error-option-invalid").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }else if (error.type == "missing_option"){
                error.msg.channel.send((await openticket.builders.messages.getSafe("openticket:error-option-missing").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }else if (error.type == "unknown_command" && generalConfig.data.system.sendErrorOnUnknownCommand){
                error.msg.channel.send((await openticket.builders.messages.getSafe("openticket:error-unknown-command").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }
        })

        //responder timeout
        openticket.responders.commands.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await openticket.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        openticket.responders.buttons.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await openticket.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        openticket.responders.dropdowns.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await openticket.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        openticket.responders.modals.setTimeoutErrorCallback(async (instance,source) => {
            if (!instance.channel){
                instance.reply({id:new api.ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                    content:":x: **Something went wrong while replying to this modal!**"
                }})
                return
            }
            instance.reply(await openticket.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
    }))
}

export const loadStartListeningInteractionsCode = async () => {
    //START LISTENING TO INTERACTIONS
    openticket.code.add(new api.ODCode("openticket:start-listening-interactions",13,() => {
        openticket.client.slashCommands.startListeningToInteractions()
        openticket.client.textCommands.startListeningToInteractions()
    }))
}

export const loadDatabaseCleanersCode = async () => {
    if (!mainServer) return

    //PANEL DATABASE CLEANER
    openticket.code.add(new api.ODCode("openticket:panel-database-cleaner",12,async () => {
        const validPanels: string[] = []

        //check global database for valid panel embeds
        for (const panel of (await globalDatabase.getCategory("openticket:panel-update") ?? [])){
            if (!validPanels.includes(panel.key)){
                try{
                    const splittedId = panel.key.split("_")
                    const message = await openticket.client.fetchGuildChannelMessage(mainServer,splittedId[0],splittedId[1])
                    if (message) validPanels.push(panel.key)
                }catch{}
            }
        }

        //remove all unused panels
        for (const panel of (await globalDatabase.getCategory("openticket:panel-update") ?? [])){
            if (!validPanels.includes(panel.key)){
                globalDatabase.delete("openticket:panel-update",panel.key)
            }
        }

        //delete panel from database on delete
        openticket.client.client.on("messageDelete",(msg) => {
            if (globalDatabase.exists("openticket:panel-update",msg.channel.id+"_"+msg.id)){
                globalDatabase.delete("openticket:panel-update",msg.channel.id+"_"+msg.id)
            }
        })
    }))

    //SUFFIX DATABASE CLEANER
    openticket.code.add(new api.ODCode("openticket:suffix-database-cleaner",11,async () => {
        const validSuffixCounters: string[] = []
        const validSuffixHistories: string[] = []

        //check global database for valid option suffix counters
        for (const counter of (await globalDatabase.getCategory("openticket:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                if (openticket.options.exists(counter.key)) validSuffixCounters.push(counter.key)
            }
        }

        //check global database for valid option suffix histories
        for (const history of (await globalDatabase.getCategory("openticket:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                if (openticket.options.exists(history.key)) validSuffixHistories.push(history.key)
            }
        }

        //remove all unused suffix counters
        for (const counter of (await globalDatabase.getCategory("openticket:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                globalDatabase.delete("openticket:option-suffix-counter",counter.key)
            }
        }

        //remove all unused suffix histories
        for (const history of (await globalDatabase.getCategory("openticket:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                globalDatabase.delete("openticket:option-suffix-history",history.key)
            }
        }
    }))

    //OPTION DATABASE CLEANER
    openticket.code.add(new api.ODCode("openticket:option-database-cleaner",10,() => {
        //delete all unused options
        openticket.options.getAll().forEach((option) => {
            if (optionDatabase.exists("openticket:used-option",option.id.value) && !openticket.tickets.getAll().some((ticket) => ticket.option.id.value == option.id.value)){
                optionDatabase.delete("openticket:used-option",option.id.value)
            }
        })
    }))

    //USER DATABASE CLEANER (full async/parallel because it takes a lot of time)
    openticket.code.add(new api.ODCode("openticket:user-database-cleaner",9,() => {
        utilities.runAsync(async () => {  
            const validUsers: string[] = []

            //check user database for valid users
            for (const user of (await userDatabase.getAll())){
                if (!validUsers.includes(user.key)){
                    try{
                        const member = await mainServer.members.fetch(user.key)
                        if (member) validUsers.push(member.id)
                    }catch{}
                }
            }

            //check stats database for valid users
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:user_")){
                    if (!validUsers.includes(stat.key)){
                        try{
                            const member = await mainServer.members.fetch(stat.key)
                            if (member) validUsers.push(member.id)
                        }catch{}
                    }
                }
            }

            //remove all unused users
            for (const user of (await userDatabase.getAll())){
                if (!validUsers.includes(user.key)){
                    userDatabase.delete(user.category,user.key)
                }
            }

            //remove all unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:user_")){
                    if (!validUsers.includes(stat.key)){
                        statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })

        //delete user from database on leave
        openticket.client.client.on("guildMemberRemove",async (member) => {
            if (member.guild.id != mainServer.id) return

            //remove unused user
            for (const user of (await userDatabase.getAll())){
                if (user.key == member.id){
                    userDatabase.delete(user.category,user.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:user_")){
                    if (stat.key == member.id){
                        statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })
    }))

    //TICKET DATABASE CLEANER
    openticket.code.add(new api.ODCode("openticket:ticket-database-cleaner",8,async () => {
        const validTickets: string[] = []

        //check ticket database for valid tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                try{
                    const channel = await openticket.client.fetchGuildTextChannel(mainServer,ticket.key)
                    if (channel) validTickets.push(channel.id)
                }catch{}
            }
        }

        //check stats database for valid tickets
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("openticket:ticket_")){
                if (!validTickets.includes(stat.key)){
                    try{
                        const channel = await openticket.client.fetchGuildTextChannel(mainServer,stat.key)
                        if (channel) validTickets.push(channel.id)
                    }catch{}
                }
            }
        }

        //remove all unused tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                ticketDatabase.delete(ticket.category,ticket.key)
                openticket.tickets.remove(ticket.key)
            }
        }

        //remove all unused stats
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("openticket:ticket_")){
                if (!validTickets.includes(stat.key)){
                    statsDatabase.delete(stat.category,stat.key)
                }
            }
        }

        //delete ticket from database on delete
        openticket.client.client.on("channelDelete",async (channel) => {
            if (channel.isDMBased() || channel.guild.id != mainServer.id) return

            //remove unused ticket
            for (const ticket of (await ticketDatabase.getAll())){
                if (ticket.key == channel.id){
                    ticketDatabase.delete(ticket.category,ticket.key)
                    openticket.tickets.remove(ticket.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:ticket_")){
                    if (stat.key == channel.id){
                        statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })
    }))
}

export const loadPanelAutoUpdateCode = async () => {
    //PANEL AUTO UPDATE
    openticket.code.add(new api.ODCode("openticket:panel-auto-update",7,async () => {
        const globalDatabase = openticket.databases.get("openticket:global")
        const panelIds = await globalDatabase.getCategory("openticket:panel-update") ?? []
        if (!mainServer) return

        for (const panelId of panelIds){
            const panel = openticket.panels.get(panelId.value)

            //panel doesn't exist anymore in config and needs to be removed
            if (!panel){
                globalDatabase.delete("openticket:panel-update",panelId.key)
                return
            }

            try{
                const splittedId = panelId.key.split("_")
                const channel = await openticket.client.fetchGuildTextChannel(mainServer,splittedId[0])
                if (!channel) return
                const message = await openticket.client.fetchGuildChannelMessage(mainServer,channel,splittedId[1])
                if (!message || !message.editable) return
                
                message.edit((await openticket.builders.messages.getSafe("openticket:panel").build("auto-update",{guild:mainServer,channel,user:openticket.client.client.user,panel})).message)
                openticket.log("Panel in server got auto-updated!","info",[
                    {key:"channelid",value:splittedId[0]},
                    {key:"messageid",value:splittedId[1]},
                    {key:"panel",value:panelId.value}
                ])
            }catch{}
        }
    }))
}

export const loadDatabaseSaversCode = async () => {
    //TICKET SAVER
    openticket.code.add(new api.ODCode("openticket:ticket-saver",6,() => {
        const mainVersion = openticket.versions.get("openticket:version")

        openticket.tickets.onAdd((ticket) => {
            ticketDatabase.set("openticket:ticket",ticket.id.value,ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!optionDatabase.exists("openticket:used-option",ticket.option.id.value)){
                optionDatabase.set("openticket:used-option",ticket.option.id.value,ticket.option.toJson(mainVersion))
            }
        })
        openticket.tickets.onChange((ticket) => {
            ticketDatabase.set("openticket:ticket",ticket.id.value,ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!optionDatabase.exists("openticket:used-option",ticket.option.id.value)){
                optionDatabase.set("openticket:used-option",ticket.option.id.value,ticket.option.toJson(mainVersion))
            }

            //delete all unused options on ticket move
            openticket.options.getAll().forEach((option) => {
                if (optionDatabase.exists("openticket:used-option",option.id.value) && !openticket.tickets.getAll().some((ticket) => ticket.option.id.value == option.id.value)){
                    optionDatabase.delete("openticket:used-option",option.id.value)
                }
            })
        })
        openticket.tickets.onRemove((ticket) => {
            ticketDatabase.delete("openticket:ticket",ticket.id.value)

            //remove option from database if unused
            if (!openticket.tickets.getAll().some((ticket) => ticket.option.id.value == ticket.option.id.value)){
                optionDatabase.delete("openticket:used-option",ticket.option.id.value)
            }
        })
    }))

    //BLACKLIST SAVER
    openticket.code.add(new api.ODCode("openticket:blacklist-saver",5,() => {
        openticket.blacklist.onAdd((blacklist) => {
            userDatabase.set("openticket:blacklist",blacklist.id.value,blacklist.reason)
        })
        openticket.blacklist.onChange((blacklist) => {
            userDatabase.set("openticket:blacklist",blacklist.id.value,blacklist.reason)
        })
        openticket.blacklist.onRemove((blacklist) => {
            userDatabase.delete("openticket:blacklist",blacklist.id.value)
        })
    }))

    //AUTO ROLE ON JOIN
    openticket.code.add(new api.ODCode("openticket:auto-role-on-join",4,() => {
        openticket.client.client.on("guildMemberAdd",async (member) => {
            for (const option of openticket.options.getAll()){
                if (option instanceof api.ODRoleOption && option.get("openticket:add-on-join").value){
                    //add these roles on user join
                    await openticket.actions.get("openticket:reaction-role").run("panel-button",{guild:member.guild,user:member.user,option,overwriteMode:"add"})
                }
            }
        })
    }))
}

const loadAutoCode = () => {
    //AUTOCLOSE TIMEOUT
    openticket.code.add(new api.ODCode("openticket:autoclose-timeout",3,() => {
        setInterval(async () => {
            let count = 0
            for (const ticket of openticket.tickets.getAll()){
                const channel = await openticket.tickets.getTicketChannel(ticket)
                if (!channel) return
                const lastMessage = (await channel.messages.fetch({limit:5})).first()
                if (lastMessage && !ticket.get("openticket:closed").value){
                    //ticket has last message
                    const disableOnClaim = ticket.option.get("openticket:autoclose-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim) ? false : ticket.get("openticket:autoclose-enabled").value
                    const hours = ticket.get("openticket:autoclose-hours").value

                    const time = hours*60*60*1000 //hours in milliseconds
                    if (enabled && (new Date().getTime() - lastMessage.createdTimestamp) >= time){
                        //autoclose ticket
                        await openticket.actions.get("openticket:close-ticket").run("autoclose",{guild:channel.guild,channel,user:openticket.client.client.user,ticket,reason:"Autoclose",sendMessage:false})
                        await channel.send((await openticket.builders.messages.getSafe("openticket:autoclose-message").build("timeout",{guild:channel.guild,channel,user:openticket.client.client.user,ticket})).message)
                        count++
                        openticket.stats.get("openticket:global").setStat("openticket:tickets-autoclosed",1,"increase")
                    }
                }
            }
            openticket.debug.debug("Finished autoclose timeout cycle!",[
                {key:"interval",value:openticket.defaults.getDefault("autocloseCheckInterval").toString()},
                {key:"closed",value:count.toString()}
            ])
        },openticket.defaults.getDefault("autocloseCheckInterval"))
    }))

    //AUTOCLOSE LEAVE
    openticket.code.add(new api.ODCode("openticket:autoclose-leave",2,() => {
        openticket.client.client.on("guildMemberRemove",async (member) => {
            for (const ticket of openticket.tickets.getAll()){
                if (ticket.get("openticket:opened-by").value == member.id){
                    const channel = await openticket.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("openticket:autoclose-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim || !ticket.get("openticket:autoclose-enabled").value) ? false : ticket.option.get("openticket:autoclose-enable-leave")

                    if (enabled){
                        //autoclose ticket
                        await openticket.actions.get("openticket:close-ticket").run("autoclose",{guild:channel.guild,channel,user:openticket.client.client.user,ticket,reason:"Autoclose",sendMessage:false})
                        await channel.send((await openticket.builders.messages.getSafe("openticket:autoclose-message").build("leave",{guild:channel.guild,channel,user:openticket.client.client.user,ticket})).message)
                        openticket.stats.get("openticket:global").setStat("openticket:tickets-autoclosed",1,"increase")
                    }
                }
            }
        })
    }))

    //AUTODELETE TIMEOUT
    openticket.code.add(new api.ODCode("openticket:autodelete-timeout",1,() => {
        setInterval(async () => {
            let count = 0
            for (const ticket of openticket.tickets.getAll()){
                const channel = await openticket.tickets.getTicketChannel(ticket)
                if (!channel) return
                const lastMessage = (await channel.messages.fetch({limit:5})).first()
                if (lastMessage){
                    //ticket has last message
                    const disableOnClaim = ticket.option.get("openticket:autodelete-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim) ? false : ticket.get("openticket:autodelete-enabled").value
                    const days = ticket.get("openticket:autodelete-days").value

                    const time = days*24*60*60*1000 //days in milliseconds
                    if (enabled && (new Date().getTime() - lastMessage.createdTimestamp) >= time){
                        //autodelete ticket
                        await channel.send((await openticket.builders.messages.getSafe("openticket:autodelete-message").build("timeout",{guild:channel.guild,channel,user:openticket.client.client.user,ticket})).message)
                        await openticket.actions.get("openticket:delete-ticket").run("autodelete",{guild:channel.guild,channel,user:openticket.client.client.user,ticket,reason:"Autodelete",sendMessage:false,withoutTranscript:false})
                        count++
                        openticket.stats.get("openticket:global").setStat("openticket:tickets-autodeleted",1,"increase")
                    }
                }
            }
            openticket.debug.debug("Finished autodelete timeout cycle!",[
                {key:"interval",value:openticket.defaults.getDefault("autodeleteCheckInterval").toString()},
                {key:"deleted",value:count.toString()}
            ])
        },openticket.defaults.getDefault("autodeleteCheckInterval"))
    }))

    //AUTODELETE LEAVE
    openticket.code.add(new api.ODCode("openticket:autodelete-leave",0,() => {
        openticket.client.client.on("guildMemberRemove",async (member) => {
            for (const ticket of openticket.tickets.getAll()){
                if (ticket.get("openticket:opened-by").value == member.id){
                    const channel = await openticket.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("openticket:autodelete-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim || !ticket.get("openticket:autodelete-enabled").value) ? false : ticket.option.get("openticket:autodelete-enable-leave")

                    if (enabled){
                        //autodelete ticket
                        await channel.send((await openticket.builders.messages.getSafe("openticket:autodelete-message").build("leave",{guild:channel.guild,channel,user:openticket.client.client.user,ticket})).message)
                        await openticket.actions.get("openticket:delete-ticket").run("autodelete",{guild:channel.guild,channel,user:openticket.client.client.user,ticket,reason:"Autodelete",sendMessage:false,withoutTranscript:false})
                        openticket.stats.get("openticket:global").setStat("openticket:tickets-autodeleted",1,"increase")
                    }
                }
            }
        })
    }))
}