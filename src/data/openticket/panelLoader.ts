import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"

export const loadAllPanels = async () => {
    const panelConfig = openticket.configs.get("openticket:panels")
    if (!panelConfig) return

    panelConfig.data.forEach((panel) => {
        openticket.panels.add(loadPanel(panel))
    })

    //update panels on config reload
    panelConfig.onReload(async () => {
        //clear previous panels
        await openticket.panels.loopAll((data,id) => {openticket.panels.remove(id)})

        //add new panels
        panelConfig.data.forEach((panel) => {
            openticket.panels.add(loadPanel(panel))
        })
    })
}

export const loadPanel = (panel:api.ODJsonConfig_DefaultPanelType) => {
    return new api.ODPanel(panel.id,[
        new api.ODPanelData("openticket:name",panel.name),
        new api.ODPanelData("openticket:options",panel.options),
        new api.ODPanelData("openticket:dropdown",panel.dropdown),

        new api.ODPanelData("openticket:text",panel.text),
        new api.ODPanelData("openticket:embed",panel.embed),

        new api.ODPanelData("openticket:dropdown-placeholder",panel.settings.dropdownPlaceholder),
        new api.ODPanelData("openticket:enable-max-tickets-warning-text",panel.settings.enableMaxTicketsWarningInText),
        new api.ODPanelData("openticket:enable-max-tickets-warning-embed",panel.settings.enableMaxTicketsWarningInEmbed),
        new api.ODPanelData("openticket:describe-options-layout",panel.settings.describeOptionsLayout),
        new api.ODPanelData("openticket:describe-options-custom-title",panel.settings.describeOptionsCustomTitle),
        new api.ODPanelData("openticket:describe-options-in-text",panel.settings.describeOptionsInText),
        new api.ODPanelData("openticket:describe-options-in-embed-fields",panel.settings.describeOptionsInEmbedFields),
        new api.ODPanelData("openticket:describe-options-in-embed-description",panel.settings.describeOptionsInEmbedDescription),
    ])
}
export function describePanelOptions(mode:"fields",panel:api.ODPanel): {name:string,value:string}[]
export function describePanelOptions(mode:"text",panel:api.ODPanel): string
export function describePanelOptions(mode:"fields"|"text", panel:api.ODPanel): {name:string,value:string}[]|string {
    const layout = panel.get("openticket:describe-options-layout").value
    const dropdownMode = panel.get("openticket:dropdown").value
    const options: api.ODOption[] = []
    let hasTicket = false
    let hasWebsite = false
    let hasRole = false
    let ticketOnly = true
    let websiteOnly = true
    let roleOnly = true
    panel.get("openticket:options").value.forEach((id) => {
        const opt = openticket.options.get(id)
        if (opt){
            if (opt instanceof api.ODTicketOption){
                options.push(opt)
                hasTicket = true
                roleOnly = false
                websiteOnly = false
            }else if (!dropdownMode && opt instanceof api.ODWebsiteOption){
                options.push(opt)
                hasWebsite = true
                ticketOnly = false
                roleOnly = false
            }else if (!dropdownMode && opt instanceof api.ODRoleOption){
                options.push(opt)
                hasRole = true
                ticketOnly = false
                websiteOnly = false
            }
        }
    })

    //TODO TRANSLATION!!!
    const autotitle = (hasTicket && ticketOnly) ? "Select your ticket:" : ((hasRole && roleOnly) ? "Select your role:" : "Select your option:")
    const title = (panel.get("openticket:describe-options-custom-title").value.length < 1) ? "__"+autotitle+"__\n" : "__"+panel.get("openticket:describe-options-custom-title").value+"__\n"

    if (mode == "fields") return options.map((opt) => {
        if (opt instanceof api.ODTicketOption){
            //ticket option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-ticket>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (layout == "normal" || layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:cooldown-enabled") && opt.get("openticket:cooldown-enabled").value) description = description + "\nCooldown: `"+opt.get("openticket:cooldown-minutes").value+" min`"
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:limits-enabled") && opt.get("openticket:limits-enabled").value) description = description + "\nMax Tickets: `"+opt.get("openticket:limits-maximum-user").value+"`"
            }
            if (layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:admins")) description = description + "\nAdmins: "+opt.get("openticket:admins").value.map((admin) => discord.roleMention(admin)).join(", ")
            }
            
            if (description == "") description = "`<no-description>`"
            return {name:utilities.emojiTitle(emoji,name),value:description}

        }else if (opt instanceof api.ODWebsiteOption){
            //website option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-website>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (description == "") description = "`<no-description>`"
            return {name:utilities.emojiTitle(emoji,name),value:description}

        }else if (opt instanceof api.ODRoleOption){
            //role option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-role>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (layout == "normal" || layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:roles")) description = description + "\nRoles: "+opt.get("openticket:roles").value.map((admin) => discord.roleMention(admin)).join(", ")
            }
            
            if (description == "") description = "`<no-description>`"
            return {name:utilities.emojiTitle(emoji,name),value:description}
            
        }else{
            //auto-generated plugin option
            const emoji = opt.get("openticket:button-emoji") as api.ODOptionData<string>|null
            const name = opt.get("openticket:name") as api.ODOptionData<string>|null
            const description = opt.get("openticket:description") as api.ODOptionData<string>|null
            return {name:utilities.emojiTitle((emoji ? emoji.value : ""),(name ? name.value : "`"+opt.id+"`")),value:((description && description.value) ? description.value : "`<no-description>`")}
        }
    })
    else if (mode == "text") return title+options.map((opt) => {
        if (opt instanceof api.ODTicketOption){
            //ticket option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-ticket>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (layout == "normal" || layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:cooldown-enabled") && opt.get("openticket:cooldown-enabled").value) description = description + "\nCooldown: `"+opt.get("openticket:cooldown-minutes").value+" min`"
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:limits-enabled") && opt.get("openticket:limits-enabled").value) description = description + "\nMax Tickets: `"+opt.get("openticket:limits-maximum-user").value+"`"
            }
            if (layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:admins")) description = description + "\nAdmins: "+opt.get("openticket:admins").value.map((admin) => discord.roleMention(admin)).join(", ")
            }
            
            if (layout == "simple") return "**"+utilities.emojiTitle(emoji,name)+":** "+description
            else return "**"+utilities.emojiTitle(emoji,name)+"**\n"+description

        }else if (opt instanceof api.ODWebsiteOption){
            //website option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-website>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (layout == "simple") return "**"+utilities.emojiTitle(emoji,name)+":** "+description
            else return "**"+utilities.emojiTitle(emoji,name)+"**\n"+description

        }else if (opt instanceof api.ODRoleOption){
            //role option
            const emoji = opt.exists("openticket:button-emoji") ? opt.get("openticket:button-emoji").value : ""
            const name = opt.exists("openticket:name") ? opt.get("openticket:name").value : "`<unnamed-role>`"
            let description = opt.exists("openticket:description") ? opt.get("openticket:description").value : "`<no-description>`"
            
            if (layout == "normal" || layout == "detailed"){
                //TODO TRANSLATION!!!
                if (opt.exists("openticket:roles")) description = description + "\nRoles: "+opt.get("openticket:roles").value.map((admin) => discord.roleMention(admin)).join(", ")
            }
            
            if (layout == "simple") return "**"+utilities.emojiTitle(emoji,name)+":** "+description
            else return "**"+utilities.emojiTitle(emoji,name)+"**\n"+description
            
        }else{
            //auto-generated plugin option
            const emoji = opt.get("openticket:button-emoji") as api.ODOptionData<string>|null
            const name = opt.get("openticket:name") as api.ODOptionData<string>|null
            const description = opt.get("openticket:description") as api.ODOptionData<string>|null
            
            if (layout == "simple") return "**"+utilities.emojiTitle((emoji ? emoji.value : ""),(name ? name.value : "`"+opt.id+"`"))+":** "+(description ? description.value : "`<no-description>`")
            else return "**"+utilities.emojiTitle((emoji ? emoji.value : ""),(name ? name.value : "`"+opt.id+"`"))+"**\n"+(description ? description.value : "`<no-description>`")
        }
    }).join("\n\n")
    else throw new api.ODSystemError("Unknown panel generation mode, choose 'text' or 'fields'")
}