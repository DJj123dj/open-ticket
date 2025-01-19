import {openticket, api, utilities} from "../../index"
import ansis from "ansis"

export const loadAllStartScreenComponents = async () => {
    //LOGO
    openticket.startscreen.add(new api.ODStartScreenLogoComponent("openticket:logo",1000,[
        "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
        "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
        "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
        "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
        "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
        "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
    ],true,false))

    //HEADER
    const currentLanguageMetadata = openticket.languages.getLanguageMetadata()
    openticket.startscreen.add(new api.ODStartScreenHeaderComponent("openticket:header",999,[
        {key:"Version",value:openticket.versions.get("openticket:version").toString()},
        {key:"Support",value:"https://discord.dj-dj.be"},
        {key:"Language",value:(currentLanguageMetadata ? currentLanguageMetadata.language : "Unknown")}
    ],"  -  ",{
        align:"center",
        width:openticket.startscreen.get("openticket:logo")
    }))

    //FLAGS
    openticket.startscreen.add(new api.ODStartScreenFlagsCategoryComponent("openticket:flags",4,openticket.flags.getAll()))

    //PLUGINS
    openticket.startscreen.add(new api.ODStartScreenPluginsCategoryComponent("openticket:plugins",3,openticket.plugins.getAll(),openticket.plugins.unknownCrashedPlugins))
    
    //STATS
    openticket.startscreen.add(new api.ODStartScreenPropertiesCategoryComponent("openticket:stats",2,"startup info",[
        {key:"status",value:ansis.bold(openticket.client.activity.getStatusType())+openticket.client.activity.text+" ("+openticket.client.activity.status+")"},
        {key:"options",value:"loaded "+ansis.bold(openticket.options.getLength().toString())+" options!"},
        {key:"panels",value:"loaded "+ansis.bold(openticket.panels.getLength().toString())+" panels!"},
        {key:"tickets",value:"loaded "+ansis.bold(openticket.tickets.getLength().toString())+" tickets!"},
        {key:"roles",value:"loaded "+ansis.bold(openticket.roles.getLength().toString())+" roles!"},
        {key:"help",value:ansis.bold(openticket.configs.get("openticket:general").data.prefix+"help")+" or "+ansis.bold("/help")}
    ]))

    //LIVESTATUS
    openticket.startscreen.add(new api.ODStartScreenLiveStatusCategoryComponent("openticket:livestatus",1,openticket.livestatus))

    //LOGS
    openticket.startscreen.add(new api.ODStartScreenLogCategoryComponent("openticket:logs",0))
}