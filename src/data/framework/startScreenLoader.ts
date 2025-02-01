import {opendiscord, api, utilities} from "../../index"
import ansis from "ansis"

export const loadAllStartScreenComponents = async () => {
    //LOGO
    opendiscord.startscreen.add(new api.ODStartScreenLogoComponent("openticket:logo",1000,[
        "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
        "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
        "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
        "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
        "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
        "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
    ],true,false))

    //HEADER
    const currentLanguageMetadata = opendiscord.languages.getLanguageMetadata()
    opendiscord.startscreen.add(new api.ODStartScreenHeaderComponent("openticket:header",999,[
        {key:"Version",value:opendiscord.versions.get("openticket:version").toString()},
        {key:"Support",value:"https://discord.dj-dj.be"},
        {key:"Language",value:(currentLanguageMetadata ? currentLanguageMetadata.language : "Unknown")}
    ],"  -  ",{
        align:"center",
        width:opendiscord.startscreen.get("openticket:logo")
    }))

    //FLAGS
    opendiscord.startscreen.add(new api.ODStartScreenFlagsCategoryComponent("openticket:flags",4,opendiscord.flags.getAll()))

    //PLUGINS
    opendiscord.startscreen.add(new api.ODStartScreenPluginsCategoryComponent("openticket:plugins",3,opendiscord.plugins.getAll(),opendiscord.plugins.unknownCrashedPlugins))
    
    //STATS
    opendiscord.startscreen.add(new api.ODStartScreenPropertiesCategoryComponent("openticket:stats",2,"startup info",[
        {key:"status",value:ansis.bold(opendiscord.client.activity.getStatusType())+opendiscord.client.activity.text+" ("+opendiscord.client.activity.status+")"},
        {key:"options",value:"loaded "+ansis.bold(opendiscord.options.getLength().toString())+" options!"},
        {key:"panels",value:"loaded "+ansis.bold(opendiscord.panels.getLength().toString())+" panels!"},
        {key:"tickets",value:"loaded "+ansis.bold(opendiscord.tickets.getLength().toString())+" tickets!"},
        {key:"roles",value:"loaded "+ansis.bold(opendiscord.roles.getLength().toString())+" roles!"},
        {key:"help",value:ansis.bold(opendiscord.configs.get("openticket:general").data.prefix+"help")+" or "+ansis.bold("/help")}
    ]))

    //LIVESTATUS
    opendiscord.startscreen.add(new api.ODStartScreenLiveStatusCategoryComponent("openticket:livestatus",1,opendiscord.livestatus))

    //LOGS
    opendiscord.startscreen.add(new api.ODStartScreenLogCategoryComponent("openticket:logs",0))
}