///////////////////////////////////////
//TICKET TRANSFER SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:transfer-ticket"))
    opendiscord.actions.get("opendiscord:transfer-ticket").workers.add([
        new api.ODWorker("opendiscord:transfer-ticket", 2, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, reason, newCreator} = params
            if (channel.isThread()) throw new api.ODSystemError("Unable to transfer ticket! Open Ticket doesn't support threads!")

            const oldCreator = await opendiscord.tickets.getTicketUser(ticket, "creator") ?? opendiscord.client.client.user
            await opendiscord.events.get("onTicketTransfer").emit([ticket, user, channel, oldCreator, newCreator, reason])

            //update ticket
            const oldCreatorId = ticket.get("opendiscord:opened-by").value
            if (oldCreatorId){
                ticket.get("opendiscord:previous-creators").value.push(oldCreatorId)
                ticket.get("opendiscord:previous-creators").refreshDatabase()
            }
            if (!ticket.get("opendiscord:participants").value.find((p) => p.type === "user" && p.id === newCreator.id)){
                ticket.get("opendiscord:participants").value.push({type:"user", id:newCreator.id})
                ticket.get("opendiscord:participants").refreshDatabase()
            }
            ticket.get("opendiscord:opened-by").value = newCreator.id
            if (["user-name", "user-nickname", "user-id"].includes(ticket.option.get("opendiscord:channel-suffix").value)){
                const newSuffix = await opendiscord.options.suffix.getSuffixFromOption(ticket.option, newCreator, guild)
                if (newSuffix) ticket.get("opendiscord:channel-suffix").value = newSuffix
            }

            //update stats
            await opendiscord.statistics.get("opendiscord:global").setStat("opendiscord:tickets-transferred", 1, "increase")
            await opendiscord.statistics.get("opendiscord:user").setStat("opendiscord:tickets-transferred", user.id, 1, "increase")

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
                await channel.permissionOverwrites.set(permissions)
            }catch {
                opendiscord.log("Failed to reset channel permissions on ticket transfer!", "error")
            }

            //calculate channel name
            const channelNameResult = await opendiscord.actions.get("opendiscord:calculate-ticket-name").run("transfer-ticket", {guild, user, option:ticket.option, channel, ticket, currentChannelName:channel.name})
            if (channelNameResult && channelNameResult.shouldChangeName && typeof channelNameResult.newChannelName !== "undefined"){
                const originalName = channel.name
                const newName = channelNameResult.newChannelName
                try {
                    await utilities.timedAwait(channel.setName(newName), 2500, (err) => {
                        opendiscord.log("Failed to rename channel on ticket transfer", "error")
                    })
                }catch(err){
                    opendiscord.log("Unable to rename channel while transferring ticket! Waiting until ratelimit expires...", "warning", [
                        {key:"oldName", value:originalName},
                        {key:"newName", value:newName}
                    ])
                    const sentMsg = await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:error-channel-rename").build("ticket-transfer", {guild, channel, user, originalName, newName})).message)
                    setTimeout(() => {if (sentMsg.deletable) sentMsg.delete()}, 7000) //autodelete error message
                }
            }

            //update ticket message (no await)
            openticketUtils.updateTicketMessage(guild, channel, user, ticket)

            //reply with new message
            if (params.sendMessage) await channel.send((await opendiscord.builders.messages.getSafe("opendiscord:transfer-message").build(origin, {guild, channel, user, ticket, oldCreator, newCreator, reason})).message)
            ticket.get("opendiscord:busy").value = false
            await opendiscord.events.get("afterTicketTransferred").emit([ticket, user, channel, oldCreator, newCreator, reason])

            //update channel topic
            await opendiscord.actions.get("opendiscord:update-ticket-topic").run("ticket-action", {guild, channel, user, ticket, sendMessage:false, newTopic:null})
        }),
        new api.ODWorker("opendiscord:discord-logs", 1, async (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newCreator, reason} = params

            const lastCreatorId = ticket.get("opendiscord:previous-creators").value.at(-1)
            if (!lastCreatorId) return
            const lastCreator = await opendiscord.client.fetchUser(lastCreatorId)
            if (!lastCreator) return

            //to logs
            if (generalConfig.data.logs.enabled && generalConfig.data.logs.logMessages.transferring.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-logs").build(origin, {guild, channel, user, ticket, mode:"transfer", reason, additionalData:lastCreator, additionalData2:newCreator}))
            }

            //to dm
            const creator = await opendiscord.tickets.getTicketUser(ticket, "creator")
            if (creator && generalConfig.data.logs.logMessages.transferring.dm) await opendiscord.client.sendUserDm(creator, await opendiscord.builders.messages.getSafe("opendiscord:ticket-action-dm").build(origin, {guild, channel, user, ticket, mode:"transfer", reason, additionalData:lastCreator, additionalData2:newCreator}))

        }),
        new api.ODWorker("opendiscord:logs", 0, (instance, params, origin, cancel) => {
            const {guild, channel, user, ticket, newCreator} = params

            opendiscord.log(user.displayName + " transferred a ticket to '" + newCreator.displayName + "'!", "info", [
                {key:"user", value:user.username},
                {key:"userid", value:user.id, hidden:true},
                {key:"channel", value:"#" + channel.name},
                {key:"channelid", value:channel.id, hidden:true},
                {key:"reason", value:params.reason ?? "/"},
                {key:"method", value:origin}
            ])
        })
    ])
    opendiscord.actions.get("opendiscord:transfer-ticket").workers.backupWorker = new api.ODWorker("opendiscord:cancel-busy", 0, (instance, params) => {
        //set busy to false in case of crash or cancel
        params.ticket.get("opendiscord:busy").value = false
    })
}