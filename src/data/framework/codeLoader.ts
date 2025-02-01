import {opendiscord, api, utilities} from "../../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("openticket:general")
const globalDatabase = opendiscord.databases.get("openticket:global")
const userDatabase = opendiscord.databases.get("openticket:users")
const ticketDatabase = opendiscord.databases.get("openticket:tickets")
const statsDatabase = opendiscord.databases.get("openticket:stats")
const optionDatabase = opendiscord.databases.get("openticket:options")
const mainServer = opendiscord.client.mainServer

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
    opendiscord.code.add(new api.ODCode("openticket:command-error-handling",14,() => {
        //invalid/missing options
        opendiscord.client.textCommands.onError(async (error) => {
            if (error.msg.channel.type == discord.ChannelType.GroupDM) return
            if (error.type == "invalid_option"){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("openticket:error-option-invalid").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }else if (error.type == "missing_option"){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("openticket:error-option-missing").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }else if (error.type == "unknown_command" && generalConfig.data.system.sendErrorOnUnknownCommand){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("openticket:error-unknown-command").build("text",{guild:error.msg.guild,channel:error.msg.channel,user:error.msg.author,error})).message)
            }
        })

        //responder timeout
        opendiscord.responders.commands.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        opendiscord.responders.buttons.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        opendiscord.responders.dropdowns.setTimeoutErrorCallback(async (instance,source) => {
            instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
        opendiscord.responders.modals.setTimeoutErrorCallback(async (instance,source) => {
            if (!instance.channel){
                instance.reply({id:new api.ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                    content:":x: **Something went wrong while replying to this modal!**"
                }})
                return
            }
            instance.reply(await opendiscord.builders.messages.getSafe("openticket:error-responder-timeout").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
        },null)
    }))
}

export const loadStartListeningInteractionsCode = async () => {
    //START LISTENING TO INTERACTIONS
    opendiscord.code.add(new api.ODCode("openticket:start-listening-interactions",13,() => {
        opendiscord.client.slashCommands.startListeningToInteractions()
        opendiscord.client.textCommands.startListeningToInteractions()
    }))
}

export const loadDatabaseCleanersCode = async () => {
    if (!mainServer) return

    //PANEL DATABASE CLEANER
    opendiscord.code.add(new api.ODCode("openticket:panel-database-cleaner",12,async () => {
        const validPanels: string[] = []

        //check global database for valid panel embeds
        for (const panel of (await globalDatabase.getCategory("openticket:panel-update") ?? [])){
            if (!validPanels.includes(panel.key)){
                try{
                    const splittedId = panel.key.split("_")
                    const message = await opendiscord.client.fetchGuildChannelMessage(mainServer,splittedId[0],splittedId[1])
                    if (message) validPanels.push(panel.key)
                }catch{}
            }
        }

        //remove all unused panels
        for (const panel of (await globalDatabase.getCategory("openticket:panel-update") ?? [])){
            if (!validPanels.includes(panel.key)){
                await globalDatabase.delete("openticket:panel-update",panel.key)
            }
        }

        //delete panel from database on delete
        opendiscord.client.client.on("messageDelete",async (msg) => {
            if (await globalDatabase.exists("openticket:panel-update",msg.channel.id+"_"+msg.id)){
                await globalDatabase.delete("openticket:panel-update",msg.channel.id+"_"+msg.id)
            }
        })
    }))

    //SUFFIX DATABASE CLEANER
    opendiscord.code.add(new api.ODCode("openticket:suffix-database-cleaner",11,async () => {
        const validSuffixCounters: string[] = []
        const validSuffixHistories: string[] = []

        //check global database for valid option suffix counters
        for (const counter of (await globalDatabase.getCategory("openticket:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                if (opendiscord.options.exists(counter.key)) validSuffixCounters.push(counter.key)
            }
        }

        //check global database for valid option suffix histories
        for (const history of (await globalDatabase.getCategory("openticket:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                if (opendiscord.options.exists(history.key)) validSuffixHistories.push(history.key)
            }
        }

        //remove all unused suffix counters
        for (const counter of (await globalDatabase.getCategory("openticket:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                await globalDatabase.delete("openticket:option-suffix-counter",counter.key)
            }
        }

        //remove all unused suffix histories
        for (const history of (await globalDatabase.getCategory("openticket:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                await globalDatabase.delete("openticket:option-suffix-history",history.key)
            }
        }
    }))

    //OPTION DATABASE CLEANER
    opendiscord.code.add(new api.ODCode("openticket:option-database-cleaner",10,async () => {
        //delete all unused options (async)
        for (const option of (await optionDatabase.getCategory("openticket:used-option") ?? [])){
            if (!opendiscord.options.exists(option.key)){
                //remove because option isn't loaded into memory (0 tickets require it)
                await optionDatabase.delete("openticket:used-option",option.key)
            }else if (!opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value == option.key)){
                //remove when loaded into memory (0 tickets require it)
                await optionDatabase.delete("openticket:used-option",option.key)
            }
        }
    }))

    //USER DATABASE CLEANER (full async/parallel because it takes a lot of time)
    opendiscord.code.add(new api.ODCode("openticket:user-database-cleaner",9,() => {
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
                    await userDatabase.delete(user.category,user.key)
                }
            }

            //remove all unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:user_")){
                    if (!validUsers.includes(stat.key)){
                        await statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })

        //delete user from database on leave
        opendiscord.client.client.on("guildMemberRemove",async (member) => {
            if (member.guild.id != mainServer.id) return

            //remove unused user
            for (const user of (await userDatabase.getAll())){
                if (user.key == member.id){
                    await userDatabase.delete(user.category,user.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:user_")){
                    if (stat.key == member.id){
                        await statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })
    }))

    //TICKET DATABASE CLEANER
    opendiscord.code.add(new api.ODCode("openticket:ticket-database-cleaner",8,async () => {
        const validTickets: string[] = []

        //check ticket database for valid tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                try{
                    const channel = await opendiscord.client.fetchGuildTextChannel(mainServer,ticket.key)
                    if (channel) validTickets.push(channel.id)
                }catch{}
            }
        }

        //check stats database for valid tickets
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("openticket:ticket_")){
                if (!validTickets.includes(stat.key)){
                    try{
                        const channel = await opendiscord.client.fetchGuildTextChannel(mainServer,stat.key)
                        if (channel) validTickets.push(channel.id)
                    }catch{}
                }
            }
        }

        //remove all unused tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                await ticketDatabase.delete(ticket.category,ticket.key)
                opendiscord.tickets.remove(ticket.key)
            }
        }

        //remove all unused stats
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("openticket:ticket_")){
                if (!validTickets.includes(stat.key)){
                    await statsDatabase.delete(stat.category,stat.key)
                }
            }
        }

        //delete ticket from database on delete
        opendiscord.client.client.on("channelDelete",async (channel) => {
            if (channel.isDMBased() || channel.guild.id != mainServer.id) return

            //remove unused ticket
            for (const ticket of (await ticketDatabase.getAll())){
                if (ticket.key == channel.id){
                    await ticketDatabase.delete(ticket.category,ticket.key)
                    opendiscord.tickets.remove(ticket.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("openticket:ticket_")){
                    if (stat.key == channel.id){
                        await statsDatabase.delete(stat.category,stat.key)
                    }
                }
            }
        })
    }))
}

export const loadPanelAutoUpdateCode = async () => {
    //PANEL AUTO UPDATE
    opendiscord.code.add(new api.ODCode("openticket:panel-auto-update",7,async () => {
        const globalDatabase = opendiscord.databases.get("openticket:global")
        const panelIds = await globalDatabase.getCategory("openticket:panel-update") ?? []
        if (!mainServer) return

        for (const panelId of panelIds){
            const panel = opendiscord.panels.get(panelId.value)

            //panel doesn't exist anymore in config and needs to be removed
            if (!panel){
                globalDatabase.delete("openticket:panel-update",panelId.key)
                return
            }

            try{
                const splittedId = panelId.key.split("_")
                const channel = await opendiscord.client.fetchGuildTextChannel(mainServer,splittedId[0])
                if (!channel) return
                const message = await opendiscord.client.fetchGuildChannelMessage(mainServer,channel,splittedId[1])
                if (!message || !message.editable) return
                
                message.edit((await opendiscord.builders.messages.getSafe("openticket:panel").build("auto-update",{guild:mainServer,channel,user:opendiscord.client.client.user,panel})).message)
                opendiscord.log("Panel in server got auto-updated!","info",[
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
    opendiscord.code.add(new api.ODCode("openticket:ticket-saver",6,() => {
        const mainVersion = opendiscord.versions.get("openticket:version")

        opendiscord.tickets.onAdd(async (ticket) => {
            await ticketDatabase.set("openticket:ticket",ticket.id.value,ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!(await optionDatabase.exists("openticket:used-option",ticket.option.id.value))){
                await optionDatabase.set("openticket:used-option",ticket.option.id.value,ticket.option.toJson(mainVersion))
            }
        })
        opendiscord.tickets.onChange(async (ticket) => {
            await ticketDatabase.set("openticket:ticket",ticket.id.value,ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!(await optionDatabase.exists("openticket:used-option",ticket.option.id.value))){
                await optionDatabase.set("openticket:used-option",ticket.option.id.value,ticket.option.toJson(mainVersion))
            }

            //delete all unused options on ticket move
            for (const option of opendiscord.options.getAll()){
                if (await optionDatabase.exists("openticket:used-option",option.id.value) && !opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value == option.id.value)){
                    await optionDatabase.delete("openticket:used-option",option.id.value)
                }
            }
        })
        opendiscord.tickets.onRemove(async (ticket) => {
            await ticketDatabase.delete("openticket:ticket",ticket.id.value)

            //remove option from database if unused
            if (!opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value == ticket.option.id.value)){
                await optionDatabase.delete("openticket:used-option",ticket.option.id.value)
            }
        })
    }))

    //BLACKLIST SAVER
    opendiscord.code.add(new api.ODCode("openticket:blacklist-saver",5,() => {
        opendiscord.blacklist.onAdd(async (blacklist) => {
            await userDatabase.set("openticket:blacklist",blacklist.id.value,blacklist.reason)
        })
        opendiscord.blacklist.onChange(async (blacklist) => {
            await userDatabase.set("openticket:blacklist",blacklist.id.value,blacklist.reason)
        })
        opendiscord.blacklist.onRemove(async (blacklist) => {
            await userDatabase.delete("openticket:blacklist",blacklist.id.value)
        })
    }))

    //AUTO ROLE ON JOIN
    opendiscord.code.add(new api.ODCode("openticket:auto-role-on-join",4,() => {
        opendiscord.client.client.on("guildMemberAdd",async (member) => {
            for (const option of opendiscord.options.getAll()){
                if (option instanceof api.ODRoleOption && option.get("openticket:add-on-join").value){
                    //add these roles on user join
                    await opendiscord.actions.get("openticket:reaction-role").run("panel-button",{guild:member.guild,user:member.user,option,overwriteMode:"add"})
                }
            }
        })
    }))
}

const loadAutoCode = () => {
    //AUTOCLOSE TIMEOUT
    opendiscord.code.add(new api.ODCode("openticket:autoclose-timeout",3,() => {
        setInterval(async () => {
            let count = 0
            for (const ticket of opendiscord.tickets.getAll()){
                const channel = await opendiscord.tickets.getTicketChannel(ticket)
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
                        await opendiscord.actions.get("openticket:close-ticket").run("autoclose",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket,reason:"Autoclose",sendMessage:false})
                        await channel.send((await opendiscord.builders.messages.getSafe("openticket:autoclose-message").build("timeout",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket})).message)
                        count++
                        await opendiscord.stats.get("openticket:global").setStat("openticket:tickets-autoclosed",1,"increase")
                    }
                }
            }
            opendiscord.debug.debug("Finished autoclose timeout cycle!",[
                {key:"interval",value:opendiscord.defaults.getDefault("autocloseCheckInterval").toString()},
                {key:"closed",value:count.toString()}
            ])
        },opendiscord.defaults.getDefault("autocloseCheckInterval"))
    }))

    //AUTOCLOSE LEAVE
    opendiscord.code.add(new api.ODCode("openticket:autoclose-leave",2,() => {
        opendiscord.client.client.on("guildMemberRemove",async (member) => {
            for (const ticket of opendiscord.tickets.getAll()){
                if (ticket.get("openticket:opened-by").value == member.id){
                    const channel = await opendiscord.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("openticket:autoclose-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim || !ticket.get("openticket:autoclose-enabled").value) ? false : ticket.option.get("openticket:autoclose-enable-leave")

                    if (enabled){
                        //autoclose ticket
                        await opendiscord.actions.get("openticket:close-ticket").run("autoclose",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket,reason:"Autoclose",sendMessage:false})
                        await channel.send((await opendiscord.builders.messages.getSafe("openticket:autoclose-message").build("leave",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket})).message)
                        await opendiscord.stats.get("openticket:global").setStat("openticket:tickets-autoclosed",1,"increase")
                    }
                }
            }
        })
    }))

    //AUTODELETE TIMEOUT
    opendiscord.code.add(new api.ODCode("openticket:autodelete-timeout",1,() => {
        setInterval(async () => {
            let count = 0
            for (const ticket of opendiscord.tickets.getAll()){
                const channel = await opendiscord.tickets.getTicketChannel(ticket)
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
                        await channel.send((await opendiscord.builders.messages.getSafe("openticket:autodelete-message").build("timeout",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket})).message)
                        await opendiscord.actions.get("openticket:delete-ticket").run("autodelete",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket,reason:"Autodelete",sendMessage:false,withoutTranscript:false})
                        count++
                        await opendiscord.stats.get("openticket:global").setStat("openticket:tickets-autodeleted",1,"increase")
                    }
                }
            }
            opendiscord.debug.debug("Finished autodelete timeout cycle!",[
                {key:"interval",value:opendiscord.defaults.getDefault("autodeleteCheckInterval").toString()},
                {key:"deleted",value:count.toString()}
            ])
        },opendiscord.defaults.getDefault("autodeleteCheckInterval"))
    }))

    //AUTODELETE LEAVE
    opendiscord.code.add(new api.ODCode("openticket:autodelete-leave",0,() => {
        opendiscord.client.client.on("guildMemberRemove",async (member) => {
            for (const ticket of opendiscord.tickets.getAll()){
                if (ticket.get("openticket:opened-by").value == member.id){
                    const channel = await opendiscord.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("openticket:autodelete-disable-claim").value && ticket.get("openticket:claimed").value
                    const enabled = (disableOnClaim || !ticket.get("openticket:autodelete-enabled").value) ? false : ticket.option.get("openticket:autodelete-enable-leave")

                    if (enabled){
                        //autodelete ticket
                        await channel.send((await opendiscord.builders.messages.getSafe("openticket:autodelete-message").build("leave",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket})).message)
                        await opendiscord.actions.get("openticket:delete-ticket").run("autodelete",{guild:channel.guild,channel,user:opendiscord.client.client.user,ticket,reason:"Autodelete",sendMessage:false,withoutTranscript:false})
                        await opendiscord.stats.get("openticket:global").setStat("openticket:tickets-autodeleted",1,"increase")
                    }
                }
            }
        })
    }))

    //TICKET ANTI BUSY
    opendiscord.code.add(new api.ODCode("openticket:ticket-anti-busy",-1,() => {
        for (const ticket of opendiscord.tickets.getAll()){
            //free tickets from corruption due to openticket:busy variable
            ticket.get("openticket:busy").value = false
        }
    }))
}