import { opendiscord, api, utilities } from "../../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const globalDatabase = opendiscord.databases.get("opendiscord:global")
const userDatabase = opendiscord.databases.get("opendiscord:users")
const ticketDatabase = opendiscord.databases.get("opendiscord:tickets")
const statsDatabase = opendiscord.databases.get("opendiscord:stats")
const optionDatabase = opendiscord.databases.get("opendiscord:options")
const transcriptsDatabase = opendiscord.databases.get("opendiscord:transcripts")
const mainServer = opendiscord.client.mainServer

export async function loadAllTasks() {
    if (!generalConfig || !mainServer || !globalDatabase || !userDatabase || !ticketDatabase || !statsDatabase || !optionDatabase) return

    loadCommandErrorHandlingTasks()
    loadStartListeningInteractionsTasks()
    loadDatabaseCleanersTasks()
    loadPanelAutoUpdateTasks()
    loadDatabaseSaversTasks()
    loadAutoTasks()
}

export async function loadCommandErrorHandlingTasks() {
    //COMMAND ERROR HANDLING
    opendiscord.tasks.add(new api.ODTask("opendiscord:command-error-handling", 14, () => {
        //invalid/missing options
        opendiscord.client.textCommands.onError(async (error) => {
            if (error.msg.channel.type === discord.ChannelType.GroupDM) return
            if (error.type === "invalid_option"){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-option-invalid").build("text", {guild:error.msg.guild, channel:error.msg.channel, user:error.msg.author, error})).message)
            }else if (error.type === "missing_option"){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-option-missing").build("text", {guild:error.msg.guild, channel:error.msg.channel, user:error.msg.author, error})).message)
            }else if (error.type === "unknown_command" && generalConfig.data.ticketSystem.sendErrorOnUnknownCommand){
                error.msg.channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-unknown-command").build("text", {guild:error.msg.guild, channel:error.msg.channel, user:error.msg.author, error})).message)
            }
        })

        //responder timeout
        opendiscord.responders.commands.setTimeoutErrorCallback(async (instance, origin) => {
            return await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-responder-timeout").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
        }, null)
        opendiscord.responders.buttons.setTimeoutErrorCallback(async (instance, origin) => {
            return await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-responder-timeout").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
        }, null)
        opendiscord.responders.dropdowns.setTimeoutErrorCallback(async (instance, origin) => {
            return await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-responder-timeout").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
        }, null)
        opendiscord.responders.modals.setTimeoutErrorCallback(async (instance, origin) => {
            if (!instance.channel){
                return await instance.reply({id:new api.ODId("opendiscord:unknown-error"), ephemeral:true, message:{
                    content:":x: **Something went wrong while replying to this modal!**"
                }})
            }
            return await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-responder-timeout").build(origin, {guild:instance.guild, channel:instance.channel, user:instance.user}))
        }, null)
    }))
}

export async function loadStartListeningInteractionsTasks() {
    //START LISTENING TO INTERACTIONS
    opendiscord.tasks.add(new api.ODTask("opendiscord:start-listening-interactions", 13, () => {
        opendiscord.client.slashCommands.startListeningToInteractions()
        opendiscord.client.textCommands.startListeningToInteractions()
        opendiscord.client.contextMenus.startListeningToInteractions()
        opendiscord.client.autocompletes.startListeningToInteractions()
    }))
}

export async function loadDatabaseCleanersTasks() {
    if (!mainServer) return

    //SUFFIX DATABASE CLEANER
    opendiscord.tasks.add(new api.ODTask("opendiscord:suffix-database-cleaner", 11, async () => {
        const validSuffixCounters: string[] = []
        const validSuffixHistories: string[] = []

        //check global database for valid option suffix counters
        for (const counter of (await globalDatabase.getCategory("opendiscord:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                if (opendiscord.options.exists(counter.key)) validSuffixCounters.push(counter.key)
            }
        }

        //check global database for valid option suffix histories
        for (const history of (await globalDatabase.getCategory("opendiscord:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                if (opendiscord.options.exists(history.key)) validSuffixHistories.push(history.key)
            }
        }

        //remove all unused suffix counters
        for (const counter of (await globalDatabase.getCategory("opendiscord:option-suffix-counter") ?? [])){
            if (!validSuffixCounters.includes(counter.key)){
                await globalDatabase.delete("opendiscord:option-suffix-counter", counter.key)
            }
        }

        //remove all unused suffix histories
        for (const history of (await globalDatabase.getCategory("opendiscord:option-suffix-history") ?? [])){
            if (!validSuffixHistories.includes(history.key)){
                await globalDatabase.delete("opendiscord:option-suffix-history", history.key)
            }
        }
    }))

    //OPTION DATABASE CLEANER
    opendiscord.tasks.add(new api.ODTask("opendiscord:option-database-cleaner", 10, async () => {
        //delete all unused options (async)
        for (const option of (await optionDatabase.getCategory("opendiscord:used-option") ?? [])){
            if (!opendiscord.options.exists(option.key)){
                //remove because option isn't loaded into memory (0 tickets require it)
                await optionDatabase.delete("opendiscord:used-option", option.key)
            }else if (!opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value === option.key)){
                //remove when loaded into memory (0 tickets require it)
                await optionDatabase.delete("opendiscord:used-option", option.key)
            }
        }
    }))

    //USER DATABASE CLEANER (full async/parallel because it takes a lot of time)
    opendiscord.tasks.add(new api.ODTask("opendiscord:user-database-cleaner", 9, () => {
        utilities.runAsync(async () => {
            const validUsers: string[] = []

            //check user database for valid users
            for (const user of (await userDatabase.getAll())){
                if (!validUsers.includes(user.key)){
                    try {
                        const member = await mainServer.members.fetch(user.key)
                        if (member) validUsers.push(member.id)
                    }catch {}
                }
            }

            //check stats database for valid users
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("opendiscord:user_")){
                    if (!validUsers.includes(stat.key)){
                        try {
                            const member = await mainServer.members.fetch(stat.key)
                            if (member) validUsers.push(member.id)
                        }catch {}
                    }
                }
            }

            //remove all unused users
            for (const user of (await userDatabase.getAll())){
                if (!validUsers.includes(user.key)){
                    await userDatabase.delete(user.category, user.key)
                }
            }

            //remove all unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("opendiscord:user_")){
                    if (!validUsers.includes(stat.key)){
                        await statsDatabase.delete(stat.category, stat.key)
                    }
                }
            }
        })

        //delete user from database on leave
        opendiscord.client.client.on("guildMemberRemove", async (member) => {
            if (member.guild.id !== mainServer.id) return

            //remove unused user
            for (const user of (await userDatabase.getAll())){
                if (user.key === member.id){
                    await userDatabase.delete(user.category, user.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("opendiscord:user_")){
                    if (stat.key === member.id){
                        await statsDatabase.delete(stat.category, stat.key)
                    }
                }
            }
        })
    }))

    //TICKET DATABASE CLEANER
    opendiscord.tasks.add(new api.ODTask("opendiscord:ticket-database-cleaner", 8, async () => {
        const validTickets: string[] = []

        //check ticket database for valid tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                try {
                    const channel = await opendiscord.client.fetchGuildTextChannel(mainServer, ticket.key)
                    if (channel) validTickets.push(channel.id)
                }catch {}
            }
        }

        //check stats database for valid tickets
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("opendiscord:ticket_")){
                if (!validTickets.includes(stat.key)){
                    try {
                        const channel = await opendiscord.client.fetchGuildTextChannel(mainServer, stat.key)
                        if (channel) validTickets.push(channel.id)
                    }catch {}
                }
            }
        }

        //remove all unused tickets
        for (const ticket of (await ticketDatabase.getAll())){
            if (!validTickets.includes(ticket.key)){
                await ticketDatabase.delete(ticket.category, ticket.key)
                opendiscord.tickets.remove(ticket.key)
            }
        }

        //remove all unused stats
        for (const stat of (await statsDatabase.getAll())){
            if (stat.category.startsWith("opendiscord:ticket_")){
                if (!validTickets.includes(stat.key)){
                    await statsDatabase.delete(stat.category, stat.key)
                }
            }
        }

        //delete ticket from database on delete
        opendiscord.client.client.on("channelDelete", async (channel) => {
            if (channel.isDMBased() || channel.guild.id !== mainServer.id) return

            //remove unused ticket
            for (const ticket of (await ticketDatabase.getAll())){
                if (ticket.key === channel.id){
                    await ticketDatabase.delete(ticket.category, ticket.key)
                    opendiscord.tickets.remove(ticket.key)
                }
            }

            //remove unused stats
            for (const stat of (await statsDatabase.getAll())){
                if (stat.category.startsWith("opendiscord:ticket_")){
                    if (stat.key === channel.id){
                        await statsDatabase.delete(stat.category, stat.key)
                    }
                }
            }
        })
    }))

    //TRANSCRIPT DATABASE CLEANER
    opendiscord.tasks.add(new api.ODTask("opendiscord:transcript-database-cleaner", 8, async () => {
        //preserve max 20 transcripts per user (async)
        const userCount: Map<string, number> = new Map()
        for (const {key, value:transcript}of (await transcriptsDatabase.getCategory("opendiscord:transcript") ?? []).sort((a, b) => (b.value.ticketDeletedDate ?? 0) - (a.value.ticketDeletedDate ?? 0))){
            const currentAmount = userCount.get(transcript.ticketCreatorId) ?? 0
            userCount.set(transcript.ticketCreatorId, currentAmount + 1)

            if (currentAmount > 20) transcriptsDatabase.delete("opendiscord:transcript", key)
        }
    }))
}

export async function loadPanelAutoUpdateTasks() {
    //PANEL AUTO UPDATE
    const panelMsgState = opendiscord.states.get("opendiscord:panel-message")
    opendiscord.tasks.add(new api.ODTask("opendiscord:panel-auto-update", 7, async () => {
        if (!mainServer) return

        for (const panelState of (await panelMsgState.listMsgStates()).map((rawState) => rawState.value)){
            try {
                //fetch panel (& check if auto-update is required)
                const panel = opendiscord.panels.get(panelState.data.panelId)
                if (!panel || !panelState.data.panelAutoUpdate) continue

                //fetch panel channel
                const channel = await opendiscord.client.fetchGuildTextChannel(mainServer, panelState.channelId)
                if (!channel) continue

                //fetch panel message
                const message = await opendiscord.client.fetchChannelMessage(channel, panelState.messageId)
                if (!message || !message.editable || message.flags.has("Ephemeral")) continue

                const panelMessage = await message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update", {guild:mainServer, channel, user:opendiscord.client.client.user, panel, isSubPanel:false})).message)
                if (panelMessage) await panelMsgState.setMsgState({channel, message:panelMessage}, {
                    messageOrigin:"auto-update",
                    panelId:panel.id.value,
                    panelOptionIds:panel.get("opendiscord:options").value,
                    panelAutoUpdate:true,
                    isSubPanel:false
                }, panelMessage.flags.has("Ephemeral"))

                opendiscord.log("Panel in server got auto-updated!", "info", [
                    {key:"channelid", value:panelState.channelId},
                    {key:"messageid", value:panelState.messageId},
                    {key:"panel", value:panel.id.value}
                ])
            }catch {
                opendiscord.log("Failed to auto-update panel", "error", [
                    {key:"channelid", value:panelState.channelId},
                    {key:"messageid", value:panelState.messageId}
                ])
            }
        }
    }))
}

export async function loadDatabaseSaversTasks() {
    //TICKET SAVER
    opendiscord.tasks.add(new api.ODTask("opendiscord:ticket-saver", 6, () => {
        const mainVersion = opendiscord.versions.get("opendiscord:version")

        opendiscord.tickets.onAdd(async (ticket) => {
            await ticketDatabase.set("opendiscord:ticket", ticket.id.value, ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!(await optionDatabase.exists("opendiscord:used-option", ticket.option.id.value))){
                await optionDatabase.set("opendiscord:used-option", ticket.option.id.value, ticket.option.toJson(mainVersion))
            }
        })
        opendiscord.tickets.onChange(async (ticket) => {
            await ticketDatabase.set("opendiscord:ticket", ticket.id.value, ticket.toJson(mainVersion))

            //add option to database if non-existent
            if (!(await optionDatabase.exists("opendiscord:used-option", ticket.option.id.value))){
                await optionDatabase.set("opendiscord:used-option", ticket.option.id.value, ticket.option.toJson(mainVersion))
            }

            //delete all unused options on ticket move
            for (const option of opendiscord.options.getAll()){
                if (await optionDatabase.exists("opendiscord:used-option", option.id.value) && !opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value === option.id.value)){
                    await optionDatabase.delete("opendiscord:used-option", option.id.value)
                }
            }
        })
        opendiscord.tickets.onRemove(async (ticket) => {
            await ticketDatabase.delete("opendiscord:ticket", ticket.id.value)

            //remove option from database if unused
            if (!opendiscord.tickets.getAll().some((ticket) => ticket.option.id.value === ticket.option.id.value)){
                await optionDatabase.delete("opendiscord:used-option", ticket.option.id.value)
            }
        })
    }))

    //BLACKLIST SAVER
    opendiscord.tasks.add(new api.ODTask("opendiscord:blacklist-saver", 5, () => {
        opendiscord.blacklist.onAdd(async (blacklist) => {
            await userDatabase.set("opendiscord:blacklist", blacklist.id.value, blacklist.reason)
        })
        opendiscord.blacklist.onChange(async (blacklist) => {
            await userDatabase.set("opendiscord:blacklist", blacklist.id.value, blacklist.reason)
        })
        opendiscord.blacklist.onRemove(async (blacklist) => {
            await userDatabase.delete("opendiscord:blacklist", blacklist.id.value)
        })
    }))

    //AUTO ROLE ON JOIN
    opendiscord.tasks.add(new api.ODTask("opendiscord:auto-role-on-join", 4, () => {
        opendiscord.client.client.on("guildMemberAdd", async (member) => {
            for (const option of opendiscord.options.getAll()){
                if (option instanceof api.ODRoleOption && option.get("opendiscord:add-on-join").value){
                    //add these roles on user join
                    await opendiscord.actions.get("opendiscord:reaction-role").run("panel-button", {guild:member.guild, user:member.user, option, overwriteMode:"add"})
                }
            }
        })
    }))
}

export async function loadAutoTasks() {
    const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

    //AUTOCLOSE TIMEOUT
    opendiscord.tasks.add(new api.ODTask("opendiscord:autoclose-timeout", 3, () => {
        setInterval(async () => {
            let count = 0
            for (const ticket of opendiscord.tickets.getAll()){
                const channel = await opendiscord.tickets.getTicketChannel(ticket)
                if (!channel) return
                const lastMessage = (await channel.messages.fetch({limit:5})).first()
                if (lastMessage && !ticket.get("opendiscord:closed").value){
                    //ticket has last message
                    const disableOnClaim = ticket.option.get("opendiscord:autoclose-disable-claim").value && ticket.get("opendiscord:claimed").value
                    const enabled = (disableOnClaim) ? false : ticket.get("opendiscord:autoclose-enabled").value
                    const hours = ticket.get("opendiscord:autoclose-hours").value

                    const time = hours * 60 * 60 * 1000 //hours in milliseconds
                    if (enabled && (new Date().getTime() - lastMessage.createdTimestamp) >= time){
                        //autoclose ticket
                        await opendiscord.actions.get("opendiscord:close-ticket").run("autoclose", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket, reason:"Autoclose", sendMessage:false})
                        const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:autoclose-message").build("timeout", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket})).message)
                        await interactiveMsgState.setMsgState({channel, message:sentMsg}, {
                            messageType:"autoclose-message",
                            messageOrigin:"other",
                            messageAuthor:opendiscord.client.client.user.id,
                            messageReason:"Autoclose"
                        }, false)
                        count++
                        await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-autoclosed", 1, "increase")
                    }
                }
            }
            opendiscord.debug.debug("Finished autoclose timeout cycle!", [
                {key:"interval", value:opendiscord.fuses.getFuse("autocloseCheckInterval").toString()},
                {key:"closed", value:count.toString()}
            ])
        }, opendiscord.fuses.getFuse("autocloseCheckInterval"))
    }))

    //AUTOCLOSE LEAVE
    opendiscord.tasks.add(new api.ODTask("opendiscord:autoclose-leave", 2, () => {
        opendiscord.client.client.on("guildMemberRemove", async (member) => {
            for (const ticket of opendiscord.tickets.getAll()){
                if (ticket.get("opendiscord:opened-by").value === member.id){
                    const channel = await opendiscord.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("opendiscord:autoclose-disable-claim").value && ticket.get("opendiscord:claimed").value
                    const enabled = (disableOnClaim || !ticket.get("opendiscord:autoclose-enabled").value) ? false : ticket.option.get("opendiscord:autoclose-enable-leave")

                    if (enabled){
                        //autoclose ticket
                        await opendiscord.actions.get("opendiscord:close-ticket").run("autoclose", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket, reason:"Autoclose", sendMessage:false})
                        const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:autoclose-message").build("leave", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket})).message)
                        await interactiveMsgState.setMsgState({channel, message:sentMsg}, {
                            messageType:"autoclose-message",
                            messageOrigin:"other",
                            messageAuthor:opendiscord.client.client.user.id,
                            messageReason:"Autoclose"
                        }, false)
                        await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-autoclosed", 1, "increase")
                    }
                }
            }
        })
    }))

    //AUTODELETE TIMEOUT
    opendiscord.tasks.add(new api.ODTask("opendiscord:autodelete-timeout", 1, () => {
        setInterval(async () => {
            let count = 0
            for (const ticket of opendiscord.tickets.getAll()){
                const channel = await opendiscord.tickets.getTicketChannel(ticket)
                if (!channel) return
                const lastMessage = (await channel.messages.fetch({limit:5})).first()
                if (lastMessage){
                    //ticket has last message
                    const disableOnClaim = ticket.option.get("opendiscord:autodelete-disable-claim").value && ticket.get("opendiscord:claimed").value
                    const disableWhenNotClosed = generalConfig.data.ticketSystem.autodeleteRequiresClosedTicket && !ticket.get("opendiscord:closed").value

                    const enabled = (disableOnClaim || disableWhenNotClosed) ? false : ticket.get("opendiscord:autodelete-enabled").value
                    const days = ticket.get("opendiscord:autodelete-days").value

                    const time = days * 24 * 60 * 60 * 1000 //days in milliseconds
                    if (enabled && (new Date().getTime() - lastMessage.createdTimestamp) >= time){
                        //autodelete ticket
                        await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:autodelete-message").build("timeout", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket})).message)
                        await opendiscord.actions.get("opendiscord:delete-ticket").run("autodelete", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket, reason:"Autodelete", sendMessage:false, withoutTranscript:false})
                        count++
                        await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-autodeleted", 1, "increase")
                    }
                }
            }
            opendiscord.debug.debug("Finished autodelete timeout cycle!", [
                {key:"interval", value:opendiscord.fuses.getFuse("autodeleteCheckInterval").toString()},
                {key:"deleted", value:count.toString()}
            ])
        }, opendiscord.fuses.getFuse("autodeleteCheckInterval"))
    }))

    //AUTODELETE LEAVE
    opendiscord.tasks.add(new api.ODTask("opendiscord:autodelete-leave", 0, () => {
        opendiscord.client.client.on("guildMemberRemove", async (member) => {
            for (const ticket of opendiscord.tickets.getAll()){
                if (ticket.get("opendiscord:opened-by").value === member.id){
                    const channel = await opendiscord.tickets.getTicketChannel(ticket)
                    if (!channel) return
                    //ticket has been created by this user
                    const disableOnClaim = ticket.option.get("opendiscord:autodelete-disable-claim").value && ticket.get("opendiscord:claimed").value
                    const disableWhenNotClosed = generalConfig.data.ticketSystem.autodeleteRequiresClosedTicket && !ticket.get("opendiscord:closed").value
                    const enabled = (disableOnClaim || disableWhenNotClosed || !ticket.get("opendiscord:autodelete-enabled").value) ? false : ticket.option.get("opendiscord:autodelete-enable-leave")

                    if (enabled){
                        //autodelete ticket
                        await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:autodelete-message").build("leave", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket})).message)
                        await opendiscord.actions.get("opendiscord:delete-ticket").run("autodelete", {guild:channel.guild, channel, user:opendiscord.client.client.user, ticket, reason:"Autodelete", sendMessage:false, withoutTranscript:false})
                        await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-autodeleted", 1, "increase")
                    }
                }
            }
        })
    }))

    //TICKET ANTI BUSY (+ sync version of tickets with latest OT version in database)
    opendiscord.tasks.add(new api.ODTask("opendiscord:ticket-anti-busy", -1, () => {
        for (const ticket of opendiscord.tickets.getAll()){
            //free tickets from corruption due to opendiscord:busy variable
            ticket.get("opendiscord:busy").value = false
        }
    }))
}