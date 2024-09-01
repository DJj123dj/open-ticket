import {openticket, api, utilities} from "../../index"

export const loadAllFlags = async () => {
    openticket.flags.add(new api.ODFlag("openticket:no-migration","No Migration","Disable Open Ticket data migration on update!","--no-migration",["-nm"]))
    openticket.flags.add(new api.ODFlag("openticket:dev-config","Developer Config","Use the configs in /devconfig instead of /config!","--dev-config",["-dc"]))
    openticket.flags.add(new api.ODFlag("openticket:dev-database","Developer Database","Use the databases in /devdatabase instead of /database!","--dev-database",["-nd"]))
    openticket.flags.add(new api.ODFlag("openticket:debug","Debug Mode","Couldn't you find the error? Try to check this out!","--debug",["-d"]))
    openticket.flags.add(new api.ODFlag("openticket:crash","Crash On Error","Crash the bot on an unknown error!","--crash",["-cr"]))
    openticket.flags.add(new api.ODFlag("openticket:no-transcripts","No HTML Transcripts","Disable uploading HTML transcripts (for debugging)","--no-transcripts",["-nt"]))
    openticket.flags.add(new api.ODFlag("openticket:no-checker","No Config Checker","Disable the Config Checker (for debugging)","--no-checker",["-nc"]))
    openticket.flags.add(new api.ODFlag("openticket:checker","Full Config Checker","Render the Config Checker with extra details!","--checker",["-c"]))
    openticket.flags.add(new api.ODFlag("openticket:no-easter","No Easter Eggs","Disable little Open Ticket easter eggs hidden in the bot!","--no-easter",["-ne"]))
    openticket.flags.add(new api.ODFlag("openticket:no-plugins","No Plugins","Disable all Open Ticket plugins!","--no-plugins",["-np"]))
    openticket.flags.add(new api.ODFlag("openticket:soft-plugins","Soft Plugins","Don't crash the bot when a plugin crashes!","--soft-plugins",["-sp"]))
    openticket.flags.add(new api.ODFlag("openticket:force-slash-update","Force Slash Update","Force update all slash commands.","--force-slash",["-fs"]))
    openticket.flags.add(new api.ODFlag("openticket:no-compile","No Compile","Disable compilation of plugins & bot before starting.","--no-compile",[]))
    openticket.flags.add(new api.ODFlag("openticket:compile-only","Compile Only","This description will never be shown because the bot wouldn't run when this flag is enabled :)","--compile-only",[]))
}