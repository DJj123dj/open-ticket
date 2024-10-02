import {openticket, api, utilities} from "../../index"

export const loadAllOptions = async () => {
    const optionConfig = openticket.configs.get("openticket:options")
    if (!optionConfig) return
    
    optionConfig.data.forEach((option) => {
        if (option.type == "ticket"){
            const loadedOption = loadTicketOption(option)
            openticket.options.add(loadedOption)
            openticket.options.suffix.add(loadTicketOptionSuffix(loadedOption))
        }else if (option.type == "website"){
            openticket.options.add(loadWebsiteOption(option))
        }else if (option.type == "role"){
            openticket.options.add(loadRoleOption(option))
        }
    })

    //update options on config reload
    optionConfig.onReload(async () => {
        //clear previous options
        openticket.options.forEach((data,id) => {openticket.options.remove(id)})

        //add new options
        optionConfig.data.forEach((option) => {
            if (option.type == "ticket"){
                const loadedOption = loadTicketOption(option)
                openticket.options.add(loadedOption)
                openticket.options.suffix.add(loadTicketOptionSuffix(loadedOption))
            }else if (option.type == "website"){
                openticket.options.add(loadWebsiteOption(option))
            }else if (option.type == "role"){
                openticket.options.add(loadRoleOption(option))
            }
        })

        //update options in tickets
        openticket.tickets.forEach((ticket) => {
            const optionId = ticket.option.id
            const option = openticket.options.get(optionId)
            if (option && option instanceof api.ODTicketOption) ticket.option = option
            else{
                openticket.log("Unable to move ticket to unexisting option due to config reload!","warning",[
                    {key:"channelid",value:ticket.id.value},
                    {key:"option",value:optionId.value}
                ])
            }
        })

        //update roles on config reload
        openticket.roles.forEach((data,id) => {openticket.roles.remove(id)})
        await (await import("./roleLoader.js")).loadAllRoles()
    })
}

export const loadTicketOption = (option:api.ODJsonConfig_DefaultOptionTicketType): api.ODTicketOption => {
    return new api.ODTicketOption(option.id,[
        new api.ODOptionData("openticket:name",option.name),
        new api.ODOptionData("openticket:description",option.description),

        new api.ODOptionData("openticket:button-emoji",option.button.emoji),
        new api.ODOptionData("openticket:button-label",option.button.label),
        new api.ODOptionData("openticket:button-color",option.button.color),
        
        new api.ODOptionData("openticket:admins",option.ticketAdmins),
        new api.ODOptionData("openticket:admins-readonly",option.readonlyAdmins),
        new api.ODOptionData("openticket:allow-blacklisted-users",option.allowCreationByBlacklistedUsers),
        new api.ODOptionData("openticket:questions",option.questions),

        new api.ODOptionData("openticket:channel-prefix",option.channel.prefix),
        new api.ODOptionData("openticket:channel-suffix",option.channel.suffix),
        new api.ODOptionData("openticket:channel-category",option.channel.category),
        new api.ODOptionData("openticket:channel-category-closed",option.channel.closedCategory),
        new api.ODOptionData("openticket:channel-category-backup",option.channel.backupCategory),
        new api.ODOptionData("openticket:channel-categories-claimed",option.channel.claimedCategory),
        new api.ODOptionData("openticket:channel-description",option.channel.description),
        
        new api.ODOptionData("openticket:dm-message-enabled",option.dmMessage.enabled),
        new api.ODOptionData("openticket:dm-message-text",option.dmMessage.text),
        new api.ODOptionData("openticket:dm-message-embed",option.dmMessage.embed),

        new api.ODOptionData("openticket:ticket-message-enabled",option.ticketMessage.enabled),
        new api.ODOptionData("openticket:ticket-message-text",option.ticketMessage.text),
        new api.ODOptionData("openticket:ticket-message-embed",option.ticketMessage.embed),
        new api.ODOptionData("openticket:ticket-message-ping",option.ticketMessage.ping),

        new api.ODOptionData("openticket:autoclose-enable-hours",option.autoclose.enableInactiveHours),
        new api.ODOptionData("openticket:autoclose-enable-leave",option.autoclose.enableUserLeave),
        new api.ODOptionData("openticket:autoclose-disable-claim",option.autoclose.disableOnClaim),
        new api.ODOptionData("openticket:autoclose-hours",option.autoclose.inactiveHours),

        new api.ODOptionData("openticket:autodelete-enable-days",option.autodelete.enableInactiveDays),
        new api.ODOptionData("openticket:autodelete-enable-leave",option.autodelete.enableUserLeave),
        new api.ODOptionData("openticket:autodelete-disable-claim",option.autodelete.disableOnClaim),
        new api.ODOptionData("openticket:autodelete-days",option.autodelete.inactiveDays),

        new api.ODOptionData("openticket:cooldown-enabled",option.cooldown.enabled),
        new api.ODOptionData("openticket:cooldown-minutes",option.cooldown.cooldownMinutes),

        new api.ODOptionData("openticket:limits-enabled",option.limits.enabled),
        new api.ODOptionData("openticket:limits-maximum-global",option.limits.globalMaximum),
        new api.ODOptionData("openticket:limits-maximum-user",option.limits.userMaximum)
    ])
}

export const loadWebsiteOption = (opt:api.ODJsonConfig_DefaultOptionWebsiteType): api.ODWebsiteOption => {
    return new api.ODWebsiteOption(opt.id,[
        new api.ODOptionData("openticket:name",opt.name),
        new api.ODOptionData("openticket:description",opt.description),

        new api.ODOptionData("openticket:button-emoji",opt.button.emoji),
        new api.ODOptionData("openticket:button-label",opt.button.label),

        new api.ODOptionData("openticket:url",opt.url)
    ])
}

export const loadRoleOption = (opt:api.ODJsonConfig_DefaultOptionRoleType): api.ODRoleOption => {
    return new api.ODRoleOption(opt.id,[
        new api.ODOptionData("openticket:name",opt.name),
        new api.ODOptionData("openticket:description",opt.description),

        new api.ODOptionData("openticket:button-emoji",opt.button.emoji),
        new api.ODOptionData("openticket:button-label",opt.button.label),
        new api.ODOptionData("openticket:button-color",opt.button.color),

        new api.ODOptionData("openticket:roles",opt.roles),
        new api.ODOptionData("openticket:mode",opt.mode),
        new api.ODOptionData("openticket:remove-roles-on-add",opt.removeRolesOnAdd),
        new api.ODOptionData("openticket:add-on-join",opt.addOnMemberJoin)
    ])
}

export const loadTicketOptionSuffix = (option:api.ODTicketOption): api.ODOptionSuffix => {
    const mode = option.get("openticket:channel-suffix").value
    const globalDatabase = openticket.databases.get("openticket:global")
    if (mode == "user-name") return new api.ODOptionUserNameSuffix(option.id.value,option)
    else if (mode == "random-number") return new api.ODOptionRandomNumberSuffix(option.id.value,option,globalDatabase)
    else if (mode == "random-hex") return new api.ODOptionRandomHexSuffix(option.id.value,option,globalDatabase)
    else if (mode == "counter-fixed") return new api.ODOptionCounterFixedSuffix(option.id.value,option,globalDatabase)
    else if (mode == "counter-dynamic") return new api.ODOptionCounterDynamicSuffix(option.id.value,option,globalDatabase)
    else return new api.ODOptionUserIdSuffix(option.id.value,option)
}