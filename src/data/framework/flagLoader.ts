import {opendiscord, api, utilities} from "../../index"

export const loadAllFlags = async () => {
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-migration","No Migration","Disable Open Ticket data migration on update!","--no-migration",["-nm"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:dev-config","Developer Config","Use the configs in /devconfig/ instead of /config/!","--dev-config",["-dc"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:dev-database","Developer Database","Use the databases in /devdatabase/ instead of /database/!","--dev-database",["-nd"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:debug","Debug Mode","Couldn't you find the error? Try to check this out!","--debug",["-d"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:crash","Crash On Error","Crash the bot on an unknown error!","--crash",["-cr"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-transcripts","No HTML Transcripts","Disable uploading HTML transcripts (for debugging)","--no-transcripts",["-nt"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-checker","No Config Checker","Disable the Config Checker (for debugging)","--no-checker",["-nc"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:checker","Full Config Checker","Render the Config Checker with extra details!","--checker",["-c"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-easter","No Easter Eggs","Disable little Open Ticket easter eggs hidden in the bot!","--no-easter",["-ne"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-plugins","No Plugins","Disable all Open Ticket plugins!","--no-plugins",["-np"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:soft-plugins","Soft Plugins","Don't crash the bot when a plugin crashes!","--soft-plugins",["-sp"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:force-slash-update","Force Slash Update","Force update all slash commands.","--force-slash",["-fs"]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:no-compile","No Compile","Disable compilation of plugins & bot before starting.","--no-compile",[]))
    opendiscord.flags.add(new api.ODFlag("opendiscord:compile-only","Compile Only","This description will never be shown because the bot wouldn't run when this flag is enabled :)","--compile-only",[]))
}