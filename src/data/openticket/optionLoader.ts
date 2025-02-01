import {opendiscord, api, utilities} from "../../index"

export const loadAllOptions = async () => {
    const optionConfig = opendiscord.configs.get("opendiscord:options")
    if (!optionConfig) return
    
    optionConfig.data.forEach((option) => {
        if (option.type == "ticket"){
            const loadedOption = loadTicketOption(option)
            opendiscord.options.add(loadedOption)
            opendiscord.options.suffix.add(loadTicketOptionSuffix(loadedOption))
        }else if (option.type == "website"){
            opendiscord.options.add(loadWebsiteOption(option))
        }else if (option.type == "role"){
            opendiscord.options.add(loadRoleOption(option))
        }
    })

    //update options on config reload
    optionConfig.onReload(async () => {
        //clear previous options & suffixes
        await opendiscord.options.loopAll((data,id) => {opendiscord.options.remove(id)})
        await opendiscord.options.suffix.loopAll((data,id) => {opendiscord.options.suffix.remove(id)})

        //add new options
        optionConfig.data.forEach((option) => {
            if (option.type == "ticket"){
                const loadedOption = loadTicketOption(option)
                opendiscord.options.add(loadedOption)
                opendiscord.options.suffix.add(loadTicketOptionSuffix(loadedOption))
            }else if (option.type == "website"){
                opendiscord.options.add(loadWebsiteOption(option))
            }else if (option.type == "role"){
                opendiscord.options.add(loadRoleOption(option))
            }
        })

        //update options in tickets
        await opendiscord.tickets.loopAll((ticket) => {
            const optionId = ticket.option.id
            const option = opendiscord.options.get(optionId)
            if (option && option instanceof api.ODTicketOption) ticket.option = option
            else{
                opendiscord.log("Unable to move ticket to unexisting option due to config reload!","warning",[
                    {key:"channelid",value:ticket.id.value},
                    {key:"option",value:optionId.value}
                ])
            }
        })

        //update roles on config reload
        await opendiscord.roles.loopAll((data,id) => {opendiscord.roles.remove(id)})
        await (await import("./roleLoader.js")).loadAllRoles()
    })
}

export const loadTicketOption = (option:api.ODJsonConfig_DefaultOptionTicketType): api.ODTicketOption => {
    return new api.ODTicketOption(option.id,[
        new api.ODOptionData("opendiscord:name",option.name),
        new api.ODOptionData("opendiscord:description",option.description),

        new api.ODOptionData("opendiscord:button-emoji",option.button.emoji),
        new api.ODOptionData("opendiscord:button-label",option.button.label),
        new api.ODOptionData("opendiscord:button-color",option.button.color),
        
        new api.ODOptionData("opendiscord:admins",option.ticketAdmins),
        new api.ODOptionData("opendiscord:admins-readonly",option.readonlyAdmins),
        new api.ODOptionData("opendiscord:allow-blacklisted-users",option.allowCreationByBlacklistedUsers),
        new api.ODOptionData("opendiscord:questions",option.questions),

        new api.ODOptionData("opendiscord:channel-prefix",option.channel.prefix),
        new api.ODOptionData("opendiscord:channel-suffix",option.channel.suffix),
        new api.ODOptionData("opendiscord:channel-category",option.channel.category),
        new api.ODOptionData("opendiscord:channel-category-closed",option.channel.closedCategory),
        new api.ODOptionData("opendiscord:channel-category-backup",option.channel.backupCategory),
        new api.ODOptionData("opendiscord:channel-categories-claimed",option.channel.claimedCategory),
        new api.ODOptionData("opendiscord:channel-description",option.channel.description),
        
        new api.ODOptionData("opendiscord:dm-message-enabled",option.dmMessage.enabled),
        new api.ODOptionData("opendiscord:dm-message-text",option.dmMessage.text),
        new api.ODOptionData("opendiscord:dm-message-embed",option.dmMessage.embed),

        new api.ODOptionData("opendiscord:ticket-message-enabled",option.ticketMessage.enabled),
        new api.ODOptionData("opendiscord:ticket-message-text",option.ticketMessage.text),
        new api.ODOptionData("opendiscord:ticket-message-embed",option.ticketMessage.embed),
        new api.ODOptionData("opendiscord:ticket-message-ping",option.ticketMessage.ping),

        new api.ODOptionData("opendiscord:autoclose-enable-hours",option.autoclose.enableInactiveHours),
        new api.ODOptionData("opendiscord:autoclose-enable-leave",option.autoclose.enableUserLeave),
        new api.ODOptionData("opendiscord:autoclose-disable-claim",option.autoclose.disableOnClaim),
        new api.ODOptionData("opendiscord:autoclose-hours",option.autoclose.inactiveHours),

        new api.ODOptionData("opendiscord:autodelete-enable-days",option.autodelete.enableInactiveDays),
        new api.ODOptionData("opendiscord:autodelete-enable-leave",option.autodelete.enableUserLeave),
        new api.ODOptionData("opendiscord:autodelete-disable-claim",option.autodelete.disableOnClaim),
        new api.ODOptionData("opendiscord:autodelete-days",option.autodelete.inactiveDays),

        new api.ODOptionData("opendiscord:cooldown-enabled",option.cooldown.enabled),
        new api.ODOptionData("opendiscord:cooldown-minutes",option.cooldown.cooldownMinutes),

        new api.ODOptionData("opendiscord:limits-enabled",option.limits.enabled),
        new api.ODOptionData("opendiscord:limits-maximum-global",option.limits.globalMaximum),
        new api.ODOptionData("opendiscord:limits-maximum-user",option.limits.userMaximum)
    ])
}

export const loadWebsiteOption = (opt:api.ODJsonConfig_DefaultOptionWebsiteType): api.ODWebsiteOption => {
    return new api.ODWebsiteOption(opt.id,[
        new api.ODOptionData("opendiscord:name",opt.name),
        new api.ODOptionData("opendiscord:description",opt.description),

        new api.ODOptionData("opendiscord:button-emoji",opt.button.emoji),
        new api.ODOptionData("opendiscord:button-label",opt.button.label),

        new api.ODOptionData("opendiscord:url",opt.url)
    ])
}

export const loadRoleOption = (opt:api.ODJsonConfig_DefaultOptionRoleType): api.ODRoleOption => {
    return new api.ODRoleOption(opt.id,[
        new api.ODOptionData("opendiscord:name",opt.name),
        new api.ODOptionData("opendiscord:description",opt.description),

        new api.ODOptionData("opendiscord:button-emoji",opt.button.emoji),
        new api.ODOptionData("opendiscord:button-label",opt.button.label),
        new api.ODOptionData("opendiscord:button-color",opt.button.color),

        new api.ODOptionData("opendiscord:roles",opt.roles),
        new api.ODOptionData("opendiscord:mode",opt.mode),
        new api.ODOptionData("opendiscord:remove-roles-on-add",opt.removeRolesOnAdd),
        new api.ODOptionData("opendiscord:add-on-join",opt.addOnMemberJoin)
    ])
}

export const loadTicketOptionSuffix = (option:api.ODTicketOption): api.ODOptionSuffix => {
    const mode = option.get("opendiscord:channel-suffix").value
    const globalDatabase = opendiscord.databases.get("opendiscord:global")
    if (mode == "user-name") return new api.ODOptionUserNameSuffix(option.id.value,option)
    else if (mode == "random-number") return new api.ODOptionRandomNumberSuffix(option.id.value,option,globalDatabase)
    else if (mode == "random-hex") return new api.ODOptionRandomHexSuffix(option.id.value,option,globalDatabase)
    else if (mode == "counter-fixed") return new api.ODOptionCounterFixedSuffix(option.id.value,option,globalDatabase)
    else if (mode == "counter-dynamic") return new api.ODOptionCounterDynamicSuffix(option.id.value,option,globalDatabase)
    else return new api.ODOptionUserIdSuffix(option.id.value,option)
}