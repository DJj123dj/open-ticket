///////////////////////////////////////
//CALCULATE TICKET CATEGORY SYSTEM
///////////////////////////////////////
import { opendiscord, api, utilities, openticketUtils } from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerActions() {
    opendiscord.actions.add(new api.ODAction("opendiscord:calculate-ticket-category"))
    opendiscord.actions.get("opendiscord:calculate-ticket-category").workers.add([
        new api.ODWorker("opendiscord:default-category", 2, async (instance, params, origin, cancel) => {
            //handle default category
            const {guild, user, channel, option, ticket, currentCategoryId} = params

            const defaultCategoryId = option.get("opendiscord:channel-category").value
            if (!defaultCategoryId){
                //default category is disabled
                instance.newCategoryId = null
                instance.newCategoryMode = null
                instance.newCategory = null
                instance.shouldChangeCategory = (instance.newCategoryId !== currentCategoryId)
            }else{
                const defaultCategory = await opendiscord.client.fetchGuildCategoryChannel(guild, defaultCategoryId)
                if (defaultCategory){
                    //default category is enabled
                    instance.newCategoryId = defaultCategoryId
                    instance.newCategoryMode = "default"
                    instance.newCategory = defaultCategory
                    instance.shouldChangeCategory = (instance.newCategoryId !== currentCategoryId)
                }else{
                    //default category is not found (do not switch categories)
                    opendiscord.log("Unable to find ticket category '" + defaultCategoryId + "' #1", "error", [
                        {key:"categoryid", value:defaultCategoryId},
                        {key:"type", value:"default"}
                    ])
                    instance.newCategoryId = null
                    instance.newCategoryMode = null
                    instance.newCategory = null
                    instance.shouldChangeCategory = false
                }
            }
        }),
        new api.ODWorker("opendiscord:close-category", 1, async (instance, params, origin, cancel) => {
            //handle close category
            const {guild, user, channel, option, ticket, currentCategoryId} = params
            if (!ticket) return
            if (!ticket.get("opendiscord:closed").value) return
            if (!generalConfig.data.ticketSystem.closedCategory.enabled) return

            const closeCategoryId = generalConfig.data.ticketSystem.closedCategory.categoryId
            if (!closeCategoryId) return
            const closeCategory = await opendiscord.client.fetchGuildCategoryChannel(guild, closeCategoryId)
            if (closeCategory){
                //close category is enabled
                instance.newCategoryId = closeCategoryId
                instance.newCategoryMode = "close"
                instance.newCategory = closeCategory
                instance.shouldChangeCategory = (instance.newCategoryId !== currentCategoryId)
            }else{
                //close category is not found (do not switch categories)
                opendiscord.log("Unable to find ticket category '" + closeCategoryId + "' #2", "error", [
                    {key:"categoryid", value:closeCategoryId},
                    {key:"type", value:"close"}
                ])
                instance.newCategoryId = null
                instance.newCategoryMode = null
                instance.newCategory = null
                instance.shouldChangeCategory = false
            }
        }),
        new api.ODWorker("opendiscord:claim-category", 0, async (instance, params, origin, cancel) => {
            //handle claim category
            const {guild, user, channel, option, ticket, currentCategoryId} = params
            if (!ticket) return
            if (!ticket.get("opendiscord:claimed").value) return

            const claimedCategoryIds = generalConfig.data.ticketSystem.claimedCategories
            const claimCategoryId = claimedCategoryIds.find((c) => c.user === user.id)?.category
            if (!claimCategoryId) return
            const claimCategory = await opendiscord.client.fetchGuildCategoryChannel(guild, claimCategoryId)
            if (claimCategory){
                //claim category is enabled
                instance.newCategoryId = claimCategoryId
                instance.newCategoryMode = "claim"
                instance.newCategory = claimCategory
                instance.shouldChangeCategory = (instance.newCategoryId !== currentCategoryId)
            }else{
                //claim category is not found (do not switch categories)
                opendiscord.log("Unable to find ticket category '" + claimCategoryId + "' #3", "error", [
                    {key:"categoryid", value:claimCategoryId},
                    {key:"type", value:"claim"}
                ])
                instance.newCategoryId = null
                instance.newCategoryMode = null
                instance.newCategory = null
                instance.shouldChangeCategory = false
            }
        }),
        new api.ODWorker("opendiscord:backup-category", -100, async (instance, params, origin, cancel) => {
            //handle backup category
            const {guild, user, channel, option, ticket, currentCategoryId} = params
            if (!instance.newCategory || !instance.newCategoryId || !instance.shouldChangeCategory) return
            if (instance.newCategory.children.cache.size < 50) return
            if (!generalConfig.data.ticketSystem.backupCategory.enabled) return

            const backupCategoryId = generalConfig.data.ticketSystem.backupCategory.categoryId
            if (!backupCategoryId) return
            const backupCategory = await opendiscord.client.fetchGuildCategoryChannel(guild, backupCategoryId)
            if (backupCategory){
                //backup category is enabled
                instance.newCategoryId = backupCategoryId
                instance.newCategoryMode = "backup"
                instance.newCategory = backupCategory
                instance.shouldChangeCategory = (instance.newCategoryId !== currentCategoryId)
            }else{
                //backup category is not found (do not switch categories)
                opendiscord.log("Unable to find ticket category '" + backupCategoryId + "' #4", "error", [
                    {key:"categoryid", value:backupCategoryId},
                    {key:"type", value:"backup"}
                ])
                instance.newCategoryId = null
                instance.newCategoryMode = null
                instance.newCategory = null
                instance.shouldChangeCategory = false
            }
        })
    ])
}