//BASE MODULES
import { ODEnvHelper, ODVersion } from "./modules/base"
import { ODConsoleManager, ODConsoleMessage, ODConsoleMessageParam, ODConsoleMessageTypes, ODDebugFileManager, ODDebugger, ODError } from "./modules/console"
import { ODCheckerStorage } from "./modules/checker"
import { ODDefaultsManager } from "./modules/defaults"

//DEFAULT MODULES
import { ODVersionManager_Default } from "./defaults/base"
import { ODPluginManager_Default } from "./defaults/plugin"
import { ODEventManager_Default } from "./defaults/event"
import { ODConfigManager_Default} from "./defaults/config"
import { ODDatabaseManager_Default } from "./defaults/database"
import { ODFlagManager_Default } from "./defaults/flag"
import { ODSessionManager_Default } from "./defaults/session"
import { ODLanguageManager_Default } from "./defaults/language"
import { ODCheckerFunctionManager_Default, ODCheckerManager_Default, ODCheckerRenderer_Default, ODCheckerTranslationRegister_Default } from "./defaults/checker"
import { ODClientManager_Default } from "./defaults/client"
import { ODBuilderManager_Default } from "./defaults/builder"
import { ODResponderManager_Default } from "./defaults/responder"
import { ODActionManager_Default } from "./defaults/action"
import { ODPermissionManager_Default } from "./defaults/permission"
import { ODHelpMenuManager_Default } from "./defaults/helpmenu"
import { ODStatsManager_Default } from "./defaults/stat"
import { ODCodeManager_Default } from "./defaults/code"
import { ODCooldownManager_Default } from "./defaults/cooldown"
import { ODPostManager_Default } from "./defaults/post"
import { ODVerifyBarManager_Default } from "./defaults/verifybar"
import { ODProgressBarManager_Default } from "./defaults/progressbar"
import { ODStartScreenManager_Default } from "./defaults/startscreen"
import { ODLiveStatusManager_Default } from "./defaults/console"

//OPEN TICKET MODULES
import { ODOptionManager } from "./openticket/option"
import { ODPanelManager } from "./openticket/panel"
import { ODTicketManager } from "./openticket/ticket"
import { ODQuestionManager } from "./openticket/question"
import { ODBlacklistManager } from "./openticket/blacklist"
import { ODTranscriptManager_Default } from "./openticket/transcript"
import { ODRoleManager } from "./openticket/role"

/**## ODMain `class`
 * This is the main Open Ticket class.
 * It contains all managers from the entire bot & has shortcuts to the event & logging system.
 * 
 * This class can't be overwritten or extended & is available as the global variable `openticket`!
 */
export class ODMain {
    /**The manager that handles all versions in the bot. */
    versions: ODVersionManager_Default

    /**The timestamp that the (node.js) process of the bot started. */
    processStartupDate: Date = new Date()
    /**The timestamp that the bot finished loading and is ready for usage. */
    readyStartupDate: Date|null = null

    /**The manager responsible for the debug file. (`otdebug.txt`) */
    debugfile: ODDebugFileManager
    /**The manager responsible for the console system. (logs, errors, etc) */
    console: ODConsoleManager
    /**The manager responsible for sending debug logs to the debug file. (`otdebug.txt`) */
    debug: ODDebugger
    /**The manager containing all Open Ticket events. */
    events: ODEventManager_Default

    /**The manager that handles & executes all plugins in the bot. */
    plugins: ODPluginManager_Default
    /**The manager that manages & checks all the console flags of the bot. (like `--debug`) */
    flags: ODFlagManager_Default
    /**The manager responsible for progress bars in the console. */
    progressbars: ODProgressBarManager_Default
    /**The manager that manages & contains all the config files of the bot. (like `config/general.json`) */
    configs: ODConfigManager_Default
    /**The manager that manages & contains all the databases of the bot. (like `database/global.json`) */
    databases: ODDatabaseManager_Default
    /**The manager that manages all the data sessions of the bot. (it's a temporary database) */
    sessions: ODSessionManager_Default
    /**The manager that manages all languages & translations of the bot. (but not for plugins) */
    languages: ODLanguageManager_Default
    
    /**The manager that handles & executes all config checkers in the bot. (the code that checks if you have something wrong in your config) */
    checkers: ODCheckerManager_Default
    /**The manager that manages all builders in the bot. (e.g. buttons, dropdowns, messages, modals, etc) */
    builders: ODBuilderManager_Default
    /**The manager that manages all responders in the bot. (e.g. commands, buttons, dropdowns, modals) */
    responders: ODResponderManager_Default
    /**The manager that manages all actions or procedures in the bot. (e.g. ticket-creation, ticket-deletion, ticket-claiming, etc) */
    actions: ODActionManager_Default
    /**The manager that manages all verify bars in the bot. (the ✅ ❌ buttons) */
    verifybars: ODVerifyBarManager_Default
    /**The manager that contains all permissions for commands & actions in the bot. (use it to check if someone has admin perms or not) */
    permissions: ODPermissionManager_Default
    /**The manager that contains all cooldowns of the bot. (e.g. ticket-cooldowns) */
    cooldowns: ODCooldownManager_Default
    /**The manager that manages & renders the Open Ticket help menu. (not the embed, but the text) */
    helpmenu: ODHelpMenuManager_Default
    /**The manager that manages, saves & renders the Open Ticket statistics. (not the embed, but the text & database) */
    stats: ODStatsManager_Default
    /**This manager is a place where you can put code that executes when the bot almost finishes the setup. (can be used for less important stuff that doesn't require an exact time-order) */
    code: ODCodeManager_Default
    /**The manager that manages all posts (static discord channels) in the bot. (e.g. (transcript) logs, etc) */
    posts: ODPostManager_Default
    
    /**The manager responsible for everything related to the client. (e.g. status, login, slash & text commands, etc) */
    client: ODClientManager_Default
    /**This manager contains A LOD of booleans. With these switches, you can turn off "default behaviours" from the bot. This is used if you want to replace the default Open Ticket code.  */
    defaults: ODDefaultsManager
    /**This manager manages all the variables in the ENV. It reads from both the `.env` file & the `process.env`. (these 2 will be combined)  */
    env: ODEnvHelper

    /**The manager responsible for the livestatus system. (remote console logs) */
    livestatus: ODLiveStatusManager_Default
    /**The manager responsible for the livestatus system. (remote console logs) */
    startscreen: ODStartScreenManager_Default

    //OPEN TICKET
    /**The manager that manages all the data of questions in the bot. (these are used in options & tickets) */
    questions: ODQuestionManager
    /**The manager that manages all the data of options in the bot. (these are used for panels, ticket creation, reaction roles) */
    options: ODOptionManager
    /**The manager that manages all the data of panels in the bot. (panels contain the options) */
    panels: ODPanelManager
    /**The manager that manages all tickets in the bot. (here, you can get & edit a lot of data from tickets) */
    tickets: ODTicketManager
    /**The manager that manages the ticket blacklist. (people who are blacklisted can't create a ticket) */
    blacklist: ODBlacklistManager
    /**The manager that manages the ticket transcripts. (both the history & compilers) */
    transcripts: ODTranscriptManager_Default
    /**The manager that manages all reaction roles in the bot. (here, you can add additional data to roles) */
    roles: ODRoleManager

    constructor(){
        this.versions = new ODVersionManager_Default()
        this.versions.add(ODVersion.fromString("opendiscord:version","v4.0.0"))
        this.versions.add(ODVersion.fromString("opendiscord:api","v1.0.0"))
        this.versions.add(ODVersion.fromString("opendiscord:transcripts","v2.0.0"))
        this.versions.add(ODVersion.fromString("opendiscord:livestatus","v2.0.0"))

        this.debugfile = new ODDebugFileManager("./","otdebug.txt",5000,this.versions.get("opendiscord:version"))
        this.console = new ODConsoleManager(100,this.debugfile)
        this.debug = new ODDebugger(this.console)
        this.events  = new ODEventManager_Default(this.debug)
        
        this.plugins = new ODPluginManager_Default(this.debug)
        this.flags = new ODFlagManager_Default(this.debug)
        this.progressbars = new ODProgressBarManager_Default(this.debug)
        this.configs = new ODConfigManager_Default(this.debug)
        this.databases = new ODDatabaseManager_Default(this.debug)
        this.sessions = new ODSessionManager_Default(this.debug)
        this.languages = new ODLanguageManager_Default(this.debug,false)
        
        this.checkers = new ODCheckerManager_Default(this.debug,new ODCheckerStorage(),new ODCheckerRenderer_Default(),new ODCheckerTranslationRegister_Default(),new ODCheckerFunctionManager_Default(this.debug))
        this.builders = new ODBuilderManager_Default(this.debug)
        this.client = new ODClientManager_Default(this.debug)
        this.responders = new ODResponderManager_Default(this.debug,this.client)
        this.actions = new ODActionManager_Default(this.debug)
        this.verifybars = new ODVerifyBarManager_Default(this.debug)
        this.permissions = new ODPermissionManager_Default(this.debug)
        this.cooldowns = new ODCooldownManager_Default(this.debug)
        this.helpmenu = new ODHelpMenuManager_Default(this.debug)
        this.stats = new ODStatsManager_Default(this.debug)
        this.code = new ODCodeManager_Default(this.debug)
        this.posts = new ODPostManager_Default(this.debug)
        
        this.defaults = new ODDefaultsManager()
        this.env = new ODEnvHelper()

        this.livestatus = new ODLiveStatusManager_Default(this.debug,this)
        this.startscreen = new ODStartScreenManager_Default(this.debug,this.livestatus)

        //OPEN TICKET
        this.questions = new ODQuestionManager(this.debug)
        this.options = new ODOptionManager(this.debug)
        this.panels = new ODPanelManager(this.debug)
        this.tickets = new ODTicketManager(this.debug,this.client)
        this.blacklist = new ODBlacklistManager(this.debug)
        this.transcripts = new ODTranscriptManager_Default(this.debug,this.tickets,this.client)
        this.roles = new ODRoleManager(this.debug)
    }
    
    /**Log a message to the console. But in the Open Ticket style :) */
    log(message:ODConsoleMessage): void
    log(message:ODError): void
    log(message:string, type?:ODConsoleMessageTypes, params?:ODConsoleMessageParam[]): void
    log(message:ODConsoleMessage|ODError|string, type?:ODConsoleMessageTypes, params?:ODConsoleMessageParam[]){
        if (message instanceof ODConsoleMessage) this.console.log(message)
        else if (message instanceof ODError) this.console.log(message)
        else if (["string","number","boolean","object"].includes(typeof message)) this.console.log(message,type,params)
    }
}