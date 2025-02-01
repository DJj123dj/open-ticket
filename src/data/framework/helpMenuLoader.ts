import {opendiscord, api, utilities} from "../../index"

const lang = opendiscord.languages

export const loadAllHelpMenuCategories = async () => {
    const helpmenu = opendiscord.helpmenu

    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:general",5,utilities.emojiTitle("📎","General Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:ticket-basic",4,utilities.emojiTitle("🎫","Basic Ticket Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:ticket-advanced",4,utilities.emojiTitle("💡","Advanced Ticket Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:ticket-user",3,utilities.emojiTitle("👤","User Ticket Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:admin",2,utilities.emojiTitle("🚨","Admin Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:advanced",1,utilities.emojiTitle("🚧","Advanced Commands"))) //TODO TRANSLATION!!!
    helpmenu.add(new api.ODHelpMenuCategory("opendiscord:extra",0,utilities.emojiTitle("✨","Extra Commands"))) //TODO TRANSLATION!!!
}

export const loadAllHelpMenuComponents = async () => {
    const helpmenu = opendiscord.helpmenu
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (!generalConfig) return

    const prefix = generalConfig.data.prefix
    const enableDeleteWithoutTranscript = generalConfig.data.system.enableDeleteWithoutTranscript

    const allowedCommands: string[] = []
    for (const key in generalConfig.data.system.permissions){
        if (generalConfig.data.system.permissions[key] != "none") allowedCommands.push(key)
    }

    const general = helpmenu.get("opendiscord:general")
    if (general){
        if (allowedCommands.includes("help")) general.add(new api.ODHelpMenuCommandComponent("opendiscord:help",1,{
            textName:prefix+"help",
            textDescription:lang.getTranslation("helpMenu.help"),
            slashName:"/help",
            slashDescription:lang.getTranslation("helpMenu.help")
        }))
        if (allowedCommands.includes("ticket")) general.add(new api.ODHelpMenuCommandComponent("opendiscord:ticket",0,{
            slashName:"/ticket",
            slashDescription:lang.getTranslation("commands.ticket"),
            slashOptions:[{name:"id",optional:false}]
        }))
    }

    const ticketBasic = helpmenu.get("opendiscord:ticket-basic")
    if (ticketBasic){
        if (allowedCommands.includes("close")) ticketBasic.add(new api.ODHelpMenuCommandComponent("opendiscord:close",10,{
            textName:prefix+"close",
            textDescription:lang.getTranslation("helpMenu.close"),
            slashName:"/close",
            slashDescription:lang.getTranslation("helpMenu.close"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (enableDeleteWithoutTranscript){
            if (allowedCommands.includes("delete")) ticketBasic.add(new api.ODHelpMenuCommandComponent("opendiscord:delete",9,{
                textName:prefix+"delete",
                textDescription:lang.getTranslation("helpMenu.delete"),
                slashName:"/delete",
                slashDescription:lang.getTranslation("helpMenu.delete"),
                textOptions:[{name:"reason",optional:true}],
                slashOptions:[{name:"notranscript",optional:true},{name:"reason",optional:true}]
            }))
        }else{
            if (allowedCommands.includes("delete")) ticketBasic.add(new api.ODHelpMenuCommandComponent("opendiscord:delete",9,{
                textName:prefix+"delete",
                textDescription:lang.getTranslation("helpMenu.delete"),
                slashName:"/delete",
                slashDescription:lang.getTranslation("helpMenu.delete"),
                textOptions:[{name:"reason",optional:true}],
                slashOptions:[{name:"reason",optional:true}]
            }))
        }
        if (allowedCommands.includes("reopen")) ticketBasic.add(new api.ODHelpMenuCommandComponent("opendiscord:reopen",8,{
            textName:prefix+"reopen",
            textDescription:lang.getTranslation("helpMenu.reopen"),
            slashName:"/reopen",
            slashDescription:lang.getTranslation("helpMenu.reopen"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
    }

    const ticketAdvanced = helpmenu.get("opendiscord:ticket-advanced")
    if (ticketAdvanced){
        if (allowedCommands.includes("pin")) ticketAdvanced.add(new api.ODHelpMenuCommandComponent("opendiscord:pin",5,{
            textName:prefix+"pin",
            textDescription:lang.getTranslation("helpMenu.pin"),
            slashName:"/pin",
            slashDescription:lang.getTranslation("helpMenu.pin"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("unpin")) ticketAdvanced.add(new api.ODHelpMenuCommandComponent("opendiscord:unpin",4,{
            textName:prefix+"unpin",
            textDescription:lang.getTranslation("helpMenu.unpin"),
            slashName:"/unpin",
            slashDescription:lang.getTranslation("helpMenu.unpin"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("move")) ticketAdvanced.add(new api.ODHelpMenuCommandComponent("opendiscord:move",3,{
            textName:prefix+"move",
            textDescription:lang.getTranslation("helpMenu.move"),
            slashName:"/move",
            slashDescription:lang.getTranslation("helpMenu.move"),
            textOptions:[{name:"id",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"id",optional:false},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("rename")) ticketAdvanced.add(new api.ODHelpMenuCommandComponent("opendiscord:rename",2,{
            textName:prefix+"rename",
            textDescription:lang.getTranslation("helpMenu.rename"),
            slashName:"/rename",
            slashDescription:lang.getTranslation("helpMenu.rename"),
            textOptions:[{name:"name",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"name",optional:false},{name:"reason",optional:true}]
        }))
    }

    const ticketUser = helpmenu.get("opendiscord:ticket-channel")
    if (ticketUser){
        if (allowedCommands.includes("claim")) ticketUser.add(new api.ODHelpMenuCommandComponent("opendiscord:claim",7,{
            textName:prefix+"claim",
            textDescription:lang.getTranslation("helpMenu.claim"),
            slashName:"/claim",
            slashDescription:lang.getTranslation("helpMenu.claim"),
            textOptions:[{name:"user",optional:true},{name:"reason",optional:true}],
            slashOptions:[{name:"user",optional:true},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("unclaim")) ticketUser.add(new api.ODHelpMenuCommandComponent("opendiscord:unclaim",6,{
            textName:prefix+"unclaim",
            textDescription:lang.getTranslation("helpMenu.unclaim"),
            slashName:"/unclaim",
            slashDescription:lang.getTranslation("helpMenu.unclaim"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("add")) ticketUser.add(new api.ODHelpMenuCommandComponent("opendiscord:add",1,{
            textName:prefix+"add",
            textDescription:lang.getTranslation("helpMenu.add"),
            slashName:"/add",
            slashDescription:lang.getTranslation("helpMenu.add"),
            textOptions:[{name:"user",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"user",optional:false},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("remove")) ticketUser.add(new api.ODHelpMenuCommandComponent("opendiscord:remove",0,{
            textName:prefix+"remove",
            textDescription:lang.getTranslation("helpMenu.remove"),
            slashName:"/remove",
            slashDescription:lang.getTranslation("helpMenu.remove"),
            textOptions:[{name:"user",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"user",optional:false},{name:"reason",optional:true}]
        }))
    }

    const admin = helpmenu.get("opendiscord:admin")
    if (admin){
        if (allowedCommands.includes("panel")) admin.add(new api.ODHelpMenuCommandComponent("opendiscord:panel",4,{
            textName:prefix+"panel",
            textDescription:lang.getTranslation("helpMenu.panel"),
            slashName:"/panel",
            slashDescription:lang.getTranslation("helpMenu.panel"),
            textOptions:[{name:"id",optional:false}],
            slashOptions:[{name:"id",optional:false}]
        }))
        if (allowedCommands.includes("blacklist")) admin.add(new api.ODHelpMenuCommandComponent("opendiscord:blacklist-view",3,{
            textName:prefix+"blacklist view",
            textDescription:lang.getTranslation("commands.blacklistView"),
            slashName:"/blacklist view",
            slashDescription:lang.getTranslation("commands.blacklistView")
        }))
        if (allowedCommands.includes("blacklist")) admin.add(new api.ODHelpMenuCommandComponent("opendiscord:blacklist-add",2,{
            textName:prefix+"blacklist add",
            textDescription:lang.getTranslation("commands.blacklistAdd"),
            slashName:"/blacklist add",
            slashDescription:lang.getTranslation("commands.blacklistAdd"),
            textOptions:[{name:"user",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"user",optional:false},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("blacklist")) admin.add(new api.ODHelpMenuCommandComponent("opendiscord:blacklist-remove",1,{
            textName:prefix+"blacklist remove",
            textDescription:lang.getTranslation("commands.blacklistRemove"),
            slashName:"/blacklist remove",
            slashDescription:lang.getTranslation("commands.blacklistRemove"),
            textOptions:[{name:"user",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"user",optional:false},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("blacklist")) admin.add(new api.ODHelpMenuCommandComponent("opendiscord:blacklist-get",0,{
            textName:prefix+"blacklist get",
            textDescription:lang.getTranslation("commands.blacklistGet"),
            slashName:"/blacklist get",
            slashDescription:lang.getTranslation("commands.blacklistGet"),
            textOptions:[{name:"user",optional:false}],
            slashOptions:[{name:"user",optional:false}]
        }))
    }

    const advanced = helpmenu.get("opendiscord:advanced")
    if (advanced){
        if (allowedCommands.includes("stats")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:stats-global",5,{
            textName:prefix+"stats global",
            textDescription:lang.getTranslation("commands.statsGlobal"),
            slashName:"/stats global",
            slashDescription:lang.getTranslation("commands.statsGlobal")
        }))
        if (allowedCommands.includes("stats")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:stats-ticket",4,{
            textName:prefix+"stats ticket",
            textDescription:lang.getTranslation("commands.statsTicket"),
            slashName:"/stats ticket",
            slashDescription:lang.getTranslation("commands.statsTicket"),
            textOptions:[{name:"ticket",optional:false}],
            slashOptions:[{name:"ticket",optional:false}]
        }))
        if (allowedCommands.includes("stats")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:stats-user",2,{
            textName:prefix+"stats user",
            textDescription:lang.getTranslation("commands.statsUser"),
            slashName:"/stats user",
            slashDescription:lang.getTranslation("commands.statsUser"),
            textOptions:[{name:"user",optional:false}],
            slashOptions:[{name:"user",optional:false}]
        }))
        if (allowedCommands.includes("stats")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:stats-reset",2,{
            textName:prefix+"stats reset",
            textDescription:lang.getTranslation("commands.statsReset"),
            slashName:"/stats reset",
            slashDescription:lang.getTranslation("commands.statsReset"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("autoclose")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:autoclose-disable",1,{
            textName:prefix+"autoclose disable",
            textDescription:lang.getTranslation("commands.autocloseDisable"),
            slashName:"/autoclose disable",
            slashDescription:lang.getTranslation("commands.autocloseDisable"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("autoclose")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:autoclose-enable",0,{
            textName:prefix+"autoclose enable",
            textDescription:lang.getTranslation("commands.autocloseEnable"),
            slashName:"/autoclose enable",
            slashDescription:lang.getTranslation("commands.autocloseEnable"),
            textOptions:[{name:"time",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"time",optional:false},{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("autodelete")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:autodelete-disable",1,{
            textName:prefix+"autodelete disable",
            textDescription:lang.getTranslation("commands.autodeleteDisable"),
            slashName:"/autodelete disable",
            slashDescription:lang.getTranslation("commands.autodeleteDisable"),
            textOptions:[{name:"reason",optional:true}],
            slashOptions:[{name:"reason",optional:true}]
        }))
        if (allowedCommands.includes("autodelete")) advanced.add(new api.ODHelpMenuCommandComponent("opendiscord:autodelete-enable",0,{
            textName:prefix+"autodelete enable",
            textDescription:lang.getTranslation("commands.autodeleteEnable"),
            slashName:"/autodelete enable",
            slashDescription:lang.getTranslation("commands.autodeleteEnable"),
            textOptions:[{name:"time",optional:false},{name:"reason",optional:true}],
            slashOptions:[{name:"time",optional:false},{name:"reason",optional:true}]
        }))
    }
}