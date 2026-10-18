///////////////////////////////////////
//TICKET CLOSING SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const interactiveMsgState = opendiscord.states.get("opendiscord:interactive-message")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:close-ticket"))
    opendiscord.actions.get("opendiscord:close-ticket").workers.add([
        new api.ODWorker("opendiscord:close-ticket", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to close ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketClose").emit([ticket, user, channel, reason])

            //update ticket
            ticket.get("opendiscord:closed").value = true
            ticket.get("opendiscord:closed-by").value = user.id
            ticket.get("opendiscord:closed-on").value = new Date().getTime()

            ticket.get("opendiscord:reopened").value = false
            ticket.get("opendiscord:reopened-by").value = null
            ticket.get("opendiscord:reopened-on").value = null

            if (origin === "autoclose") ticket.get("opendiscord:autoclosed").value = true
            ticket.get("opendiscord:open").value = false
            ticket.get("opendiscord:busy").value = true

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-closed", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-closed", user.id, 1, "increase")

            //calculate & update category
            if (typeof params.allowCategoryChange === "boolean" ? params.allowCategoryChange : true){
                const categoryResult = await opendiscord.actions.get("opendiscord:calculate-ticket-category").run("close-ticket", {guild, user, option:ticket.option, channel, ticket, currentCategoryId:channel.parentId})
                if (categoryResult && categoryResult.shouldChangeCategory && typeof categoryResult.newCategoryId !== "undefined" && typeof categoryResult.newCategoryMode !== "undefined" && typeof categoryResult.newCategory !== "undefined"){
                    const originalCategoryName = channel.parent?.name ?? "<unknown>"
                    const newCategoryName = categoryResult.newCategory?.name ?? "<unknown>"
                    try {
                        await utilities.timedAwait(channel.setParent(categoryResult.newCategoryId, {lockPermissions:false}), 3000, (err) => {
                            process.emit("uncaughtException", new Error("Error: Unable to change channel parent: " + err))
                        })
                        ticket.get("opendiscord:category-mode").value = categoryResult.newCategoryMode
                        ticket.get("opendiscord:category").value = categoryResult.newCategoryId
                    }catch(err){
                        const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-category").build("ticket-close", {guild, channel, user, originalCategory:originalCategoryName, newCategory:newCategoryName})).message)
                        setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                        opendiscord.log("Unable to move ticket to closed category.", "error", [
                            {key:"channel", value:"#" + channel.name},
                            {key:"channelid", value:channel.id, hidden:true},
                            {key:"categoryid", value:categoryResult.newCategoryId ?? "/"}
                        ])
                    }
                }
            }

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("close-ticket", {guild, user, option:ticket.option, channel, ticket, currentChannelName:channel.name})
            if (channelNameResult && channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined"){
                const originalName = channel.name
                const newName = channelNameResult.newChannelName
                try {
                    await utilities.timedAwait(channel.setName(newName), 2500, (err) => {
                        opendiscord.log("Failed to rename channel on ticket close", "error")
                    })
                }catch(err){
                    opendiscord.log("Unable to rename channel while closing ticket! Waiting until ratelimit expires...", "warning", [
                        {key:"oldName", value:originalName},
                        {key:"newName", value:newName}
                    ])
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-close", {guild, channel, user, originalName, newName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                }
            }

            //update permissions (non-staff => readonly)
            const permissions: discord.OverwriteResolvable[] = [{
                type:discord.OverwriteType.Role,
                id:guild.roles.everyone.id,
                allow:[],
                deny:["ViewChannel", "SendMessages", "ReadMessageHistory"]
            }]
            const globalAdmins = opendiscord.configs.get("opendiscord:general").data.globalAdmins
            const optionAdmins = ticket.option.get("opendiscord:admins").value
            const readonlyAdmins = ticket.option.get("opendiscord:admins-readonly").value

            globalAdmins.forEach((admin) => {
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory", "ManageMessages"],
                    deny:[]
                })
            })
            optionAdmins.forEach((admin) => {
                if (globalAdmins.includes(admin)) return
                permissions.push({
                    type:discord.OverwriteType.Role,
                    id:admin,
                    allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory", "ManageMessages"],
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
                    deny:["SendMessages", "AddReactions", "AttachFiles", "SendPolls"]
                })
            })
            ticket.get("opendiscord:participants").value.forEach((participant) => {
                //all participants that aren't roles/admins => readonly (OR non-viewable when enabled)
                if (participant.type === "user"){
                    if (generalConfig.data.ticketSystem.removeParticipantsOnClose) permissions.push({
                        type:discord.OverwriteType.Member,
                        id:participant.id,
                        allow:[],
                        deny:["SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ViewChannel", "ReadMessageHistory"]
                    })
                    else permissions.push({
                        type:discord.OverwriteType.Member,
                        id:participant.id,
                        allow:["ViewChannel", "ReadMessageHistory"],
                        deny:["SendMessages", "AddReactions", "AttachFiles", "SendPolls"]
                    })
                }
            })
            try {
                await utilities.timedAwait(channel.permissionOverwrites.set(permissions), 2500, (err) => {
                    opendiscord.log("Failed to update channel permissions on ticket close", "error")
                })
            }catch {
                opendiscord.log("Unable to update channel permissions while closing ticket! Waiting until ratelimit expires...", "warning")
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage){
                const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:close-message").build(origin, {guild, channel, user, ticket, reason})).message)
                if (sentMsg) await interactiveMsgState.setMsgState({channel, message:sentMsg}, {
                    messageType:"close-message",
                    messageOrigin:"other",
                    messageAuthor:user.id,
                    messageReason:reason
                }, false)
            }
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketClosed").emit([ticket, user, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.closing.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"close", reason, additionalData:null}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.closing.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"close", reason, additionalData:null}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket} = params

            opendiscord.log(user.displayName + " closed a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:close-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}