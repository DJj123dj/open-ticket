///////////////////////////////////////
//TICKET CREATION SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:create-ticket"))
    opendiscord.actions.get("opendiscord:create-ticket").workers.add([
        new api.ODWorker("opendiscord:create-ticket", 3, async (instance, params, origin, cancel) => {
            const {guild, user, answers, option} = params

            await opendiscord.events.get("onTicketCreate").emit([user])
            await opendiscord.events.get("onTicketChannelCreation").emit([option, user])

            //get channel properties
            const channelTopicText = option.get("opendiscord:channel-topic").value

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("create-ticket", {guild, user, option, channel:null, ticket:null, currentChannelName:null})
            if (!channelNameResult) return opendiscord.log("Ticket Creation Error: Unable to calculate ticket name.", "error")
            const channelName = (channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined") ? channelNameResult.newChannelName : "ot-unnamed-ticket"
            const channelSuffix = (typeof channelNameResult.newChannelSuffix !== "undefined") ? channelNameResult.newChannelSuffix : "unknown"

            //calculate category
            const categoryResult = await opendiscord.actions.get("opendiscord:calculate-ticket-category").run("create-ticket", {guild, user, option, channel:null, ticket:null, currentCategoryId:null})
            if (!categoryResult) return opendiscord.log("Ticket Creation Error: Unable to calculate ticket category.", "error")
            const ticketCategoryId = (categoryResult.shouldChangeCategory && typeof categoryResult.newCategoryId !== "undefined") ? categoryResult.newCategoryId : undefined
            const ticketCategoryMode = (categoryResult.shouldChangeCategory && typeof categoryResult.newCategoryMode !== "undefined") ? categoryResult.newCategoryMode : undefined

            //handle permissions
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel", "SendMessages", "ReadMessageHistory"]
            }]
            const globalAdmins = opendiscord.configs.get("opendiscord:general").data.globalAdmins
            const optionAdmins = option.get("opendiscord:admins").value
            const readonlyAdmins = option.get("opendiscord:admins-readonly").value

            globalAdmins.forEach((admin) => {
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory", "ManageMessages", "PinMessages", "EmbedLinks"],
                    deny:[]
                })
            })
            optionAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory", "ManageMessages", "PinMessages", "EmbedLinks"],
                    deny:[]
                })
            })
            readonlyAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                if (optionAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel", "ReadMessageHistory"],
                    deny:["SendMessages", "AddReactions", "AttachFiles", "SendPolls", "PinMessages"]
                })
            })
            permissions.push({
                type:discord.OverwriteType.Member,
                id:user.id,
                allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory", "EmbedLinks", "PinMessages"],
                deny:[]
            })

            //create participants
            const participants: {type:"role"|"user", id:string}[] = []
            permissions.forEach((permission, index) => {
                if (index === 0) return //don't include @everyone
                const type = (permission.type === discord.OverwriteType.Role) ? "role" : "user"
                const id = permission.id as string
                participants.push({type, id})
            })

            //manage slowmode
            const slowMode = option.get("opendiscord:slowmode-enabled").value ? option.get("opendiscord:slowmode-seconds").value : undefined

            //handle channel topic
            const channelTopics: string[] = []
            if (generalConfig.data.ticketSystem.channelTopic.showOptionName) channelTopics.push(option.get("opendiscord:name").value)
            if (generalConfig.data.ticketSystem.channelTopic.showOptionDescription) channelTopics.push(option.get("opendiscord:description").value)
            if (generalConfig.data.ticketSystem.channelTopic.showOptionTopic) channelTopics.push(channelTopicText)
            if (generalConfig.data.ticketSystem.channelTopic.showPriority) channelTopics.push("**" + lang.getTranslation("params.uppercase.priority") + ":** " + opendiscord.priorities.get("opendiscord:none").renderDisplayName())
            if (generalConfig.data.ticketSystem.channelTopic.showClosed) channelTopics.push("**" + lang.getTranslation("params.uppercase.status") + ":** " + lang.getTranslation("params.uppercase.open"))
            if (generalConfig.data.ticketSystem.channelTopic.showClaimed) channelTopics.push("**" + lang.getTranslation("stats.properties.claimedBy") + ":** " + lang.getTranslation("params.uppercase.noone"))
            if (generalConfig.data.ticketSystem.channelTopic.showPinned) channelTopics.push("**" + lang.getTranslation("params.uppercase.pinned") + ":** " + lang.getTranslation("params.uppercase.no"))
            if (generalConfig.data.ticketSystem.channelTopic.showCreator) channelTopics.push("**" + lang.getTranslation("params.uppercase.creator") + ":** " + discord.userMention(user.id))
            if (generalConfig.data.ticketSystem.channelTopic.showParticipants) channelTopics.push("**" + lang.getTranslation("params.uppercase.participants") + ":** " + participants.map((p) => (p.type === "user") ? discord.userMention(p.id) : discord.roleMention(p.id)).join(", "))

            //create channel
            const channel = await guild.channels.create({
                type:discord.ChannelType.GuildText,
                name:channelName,
                nsfw:false,
                topic:(channelTopics.length > 0) ? channelTopics.join(" • ") : undefined,
                parent:ticketCategoryId,
                reason:"Ticket Created By " + user.displayName,
                permissionOverwrites:permissions,
                rateLimitPerUser:slowMode
            })

            await opendiscord.events.get("afterTicketChannelCreated").emit([option, channel, user])

            //create ticket
            const ticket = new api.ODTicket(channel.id, option, [
                new api.ODTicketData("opendiscord:busy", false),
                new api.ODTicketData("opendiscord:ticket-message", null),
                new api.ODTicketData("opendiscord:participants", participants),
                new api.ODTicketData("opendiscord:channel-suffix", channelSuffix),
                new api.ODTicketData("opendiscord:channel-renamed", null),
                new api.ODTicketData("opendiscord:previous-creators", []),

                new api.ODTicketData("opendiscord:open", true),
                new api.ODTicketData("opendiscord:opened-by", user.id),
                new api.ODTicketData("opendiscord:opened-on", new Date().getTime()),
                new api.ODTicketData("opendiscord:closed", false),
                new api.ODTicketData("opendiscord:closed-by", null),
                new api.ODTicketData("opendiscord:closed-on", null),
                new api.ODTicketData("opendiscord:reopened", false),
                new api.ODTicketData("opendiscord:reopened-by", null),
                new api.ODTicketData("opendiscord:reopened-on", null),
                new api.ODTicketData("opendiscord:claimed", false),
                new api.ODTicketData("opendiscord:claimed-by", null),
                new api.ODTicketData("opendiscord:claimed-on", null),
                new api.ODTicketData("opendiscord:pinned", false),
                new api.ODTicketData("opendiscord:pinned-by", null),
                new api.ODTicketData("opendiscord:pinned-on", null),
                new api.ODTicketData("opendiscord:for-deletion", false),

                new api.ODTicketData("opendiscord:category", ticketCategoryId ?? null),
                new api.ODTicketData("opendiscord:category-mode", ticketCategoryMode ?? null),

                new api.ODTicketData("opendiscord:autoclose-enabled", option.get("opendiscord:autoclose-enable-hours").value),
                new api.ODTicketData("opendiscord:autoclose-hours", (option.get("opendiscord:autoclose-enable-hours").value ? option.get("opendiscord:autoclose-hours").value : 0)),
                new api.ODTicketData("opendiscord:autoclosed", false),
                new api.ODTicketData("opendiscord:autodelete-enabled", option.get("opendiscord:autodelete-enable-days").value),
                new api.ODTicketData("opendiscord:autodelete-days", (option.get("opendiscord:autodelete-enable-days").value ? option.get("opendiscord:autodelete-days").value : 0)),

                new api.ODTicketData("opendiscord:answers", answers),
                new api.ODTicketData("opendiscord:priority", -1),
                new api.ODTicketData("opendiscord:topic", option.get("opendiscord:channel-topic").value),
                new api.ODTicketData("opendiscord:message-sent", false),
                new api.ODTicketData("opendiscord:admin-message-sent", false)
            ])

            //manage stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-created", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-created", user.id, 1, "increase")

            //manage bot permissions
            await opendiscord.events.get("onTicketPermissionsCreated").emit([option, opendiscord.permissions, channel, user])
            await (await import("../data/framework/permissionLoader.js")).addTicketPermissions(ticket)
            await opendiscord.events.get("afterTicketPermissionsCreated").emit([option, opendiscord.permissions, channel, user])

            //export channel & ticket
            instance.channel = channel
            instance.ticket = ticket
            opendiscord.tickets.add(ticket)
        }),
        new api.ODWorker("opendiscord:send-ticket-message", 2, async (instance, params, origin, cancel) => {
            const {guild, user, answers, option} = params
            const {ticket, channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to send ticket message. Previous worker failed!", "error")

            await opendiscord.events.get("onTicketMainMessageCreated").emit([ticket, channel, user])
            //check if ticket message is enabled
            if (!option.get("opendiscord:ticket-message-enabled").value) return
            try {
                const ticketMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build(origin, {guild, channel, user, ticket})).message)

                if (ticketMsg) await interactiveMsgState.setMsgState({channel, message:ticketMsg}, {
                    messageType:"ticket-message",
                    messageOrigin:"other",
                    messageAuthor:user.id
                }, false)

                ticket.get("opendiscord:ticket-message").value = ticketMsg.id

                //pin ticket message (if required)
                if (generalConfig.data.ticketSystem.pinFirstTicketMessage && ticketMsg.pinnable) await ticketMsg.pin("Ticket Message")

                //send modal file upload answers in separate message to prevent deletion after 72h
                const attachments = answers
                    .filter((answer) => answer.type === "file-upload")
                    .map((answer) => answer.files).flat()
                    .map((file) => new discord.AttachmentBuilder(file.url, {
                        name:file.name,
                        description:file.description ?? undefined
                    }))
                if (attachments.length > 0) await channel.send({files:attachments})

                //manage stats
                await opendiscord.statistics.get("opendiscord:ticket").setStat("opendiscord:messages-sent", ticket.id.value, 2, "increase")

                await opendiscord.events.get("afterTicketMainMessageCreated").emit([ticket, ticketMsg, channel, user])
            }catch(err){
                process.emit("uncaughtException", err)
                //something went wrong while sending the ticket message
                channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error").build("other", {guild, channel, user, error:"Ticket Message: Creation Error!\n=> Ticket Is Still Created Succesfully", layout:"advanced"})).message)
            }
            await opendiscord.events.get("afterTicketCreated").emit([ticket, user, channel])
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, user, answers, option} = params
            const {ticket, channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to send ticket message. Previous worker failed!", "error")

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.creation.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created-logs").build(origin, {guild, channel, user, ticket}))
            }

            //to dm
            if (generalConfig.data.logs.logMessages.creation.dm) await opendiscord.client.sendUserDm(user, await opendiscord.builders.messages.getSafe("opendiscord:ticket-created-dm").build(origin, {guild, channel, user, ticket}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, user, answers, option} = params
            const {ticket, channel} = instance

            if (!ticket || !channel) return opendiscord.log("Ticket Creation Error: Unable to create logs. Previous worker failed!", "error")

            opendiscord.log(user.displayName + " created a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"method", value:origin},
                {key:"option", value:option.id.value}
            ])
        })
    ])
}