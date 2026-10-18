///////////////////////////////////////
//TICKET MOVING SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:move-ticket"))
    opendiscord.actions.get("opendiscord:move-ticket").workers.add([
        new api.ODWorker("opendiscord:move-ticket", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to move ticket! Open Ticket doesn't support threads!")

            await opendiscord.events.get("onTicketMove").emit([ticket, user, channel, reason])
            ticket.option = data

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-moved", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-moved", user.id, 1, "increase")

            //calculate & update category
            const categoryResult = await opendiscord.actions.get("opendiscord:calculate-ticket-category").run("move-ticket", {guild, user, option:ticket.option, channel, ticket, currentCategoryId:channel.parentId})
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
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-category").build("ticket-move", {guild, channel, user, originalCategory:originalCategoryName, newCategory:newCategoryName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                    opendiscord.log("Unable to move ticket to moved category.", "error", [
                        {key:"channel", value:"#" + channel.name},
                        {key:"channelid", value:channel.id, hidden:true},
                        {key:"categoryid", value:categoryResult.newCategoryId ?? "/"}
                    ])
                }
            }

            //handle permissions
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
            //transfer all old user-participants over to the new ticket (creator & participants)
            ticket.get("opendiscord:participants").value.forEach((p) => {
                if (p.type === "user") permissions.push({
                    type:discord.OverwriteType.Member,
                    id:p.id,
                    allow:["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "SendPolls", "ReadMessageHistory"],
                    deny:[]
                })
            })
            try {
                await utilities.timedAwait(channel.permissionOverwrites.set(permissions), 2500, (err) => {
                    opendiscord.log("Failed to update channel permissions on ticket move", "error")
                })
            }catch {
                opendiscord.log("Unable to update channel permissions while moving ticket! Waiting until ratelimit expires...", "warning")
            }

            //handle participants
            const participants: {type:"role"|"user", id:string}[] = []
            permissions.forEach((permission, index) => {
                if (index === 0) return //don't include @everyone
                const type = (permission.type === discord.OverwriteType.Role) ? "role" : "user"
                const id = permission.id as string
                participants.push({type, id})
            })
            ticket.get("opendiscord:participants").value = participants
            ticket.get("opendiscord:participants").refreshDatabase()

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("move-ticket", {guild, user, option:ticket.option, channel, ticket, currentChannelName:channel.name})
            if (channelNameResult && channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined"){
                const originalName = channel.name
                const newName = channelNameResult.newChannelName
                try {
                    await utilities.timedAwait(channel.setName(newName), 2500, (err) => {
                        opendiscord.log("Failed to rename channel on ticket move", "error")
                    })
                }catch(err){
                    opendiscord.log("Unable to rename channel while moving ticket! Waiting until ratelimit expires...", "warning", [
                        {key:"oldName", value:originalName},
                        {key:"newName", value:newName}
                    ])
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-move", {guild, channel, user, originalName, newName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                }
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:move-message").build(origin, {guild, channel, user, ticket, reason, data})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketMoved").emit([ticket, user, channel, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, data} = params

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.moving.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"move", reason, additionalData:data}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.moving.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"move", reason, additionalData:data}))
        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket} = params

            opendiscord.log(user.displayName + " moved a ticket!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:move-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}