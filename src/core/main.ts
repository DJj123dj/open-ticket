///////////////////////////////////////
//OPEN TICKET MAIN MODULE
///////////////////////////////////////
import fs from "fs"
import path from "path"
import * as api from "./api.js"
import * as utilities from "@open-discord-bots/framework/utilities"

export class ODOpenTicketMain extends api.ODMain {
    declare versions: api.ODMappedVersionManager
    declare events: api.ODMappedEventManager

    declare plugins: api.ODMappedPluginManager
    declare flags: api.ODMappedFlagManager
    declare progressbars: api.ODMappedProgressBarManager
    declare configs: api.ODMappedConfigManager
    declare databases: api.ODMappedDatabaseManager
    declare sessions: api.ODMappedSessionManager
    declare languages: api.ODMappedLanguageManager
    
    declare checkers: api.ODMappedCheckerManager
    declare builders: api.ODMappedBuilderManager
    declare components: api.ODMappedComponentManager
    declare responders: api.ODMappedResponderManager
    declare actions: api.ODMappedActionManager
    declare verifybars: api.ODMappedVerifyBarManager
    declare permissions: api.ODMappedPermissionManager
    declare cooldowns: api.ODMappedCooldownManager
    declare helpmenu: api.ODMappedHelpMenuManager
    declare statistics: api.ODMappedStatisticManager
    declare tasks: api.ODMappedTaskManager
    declare posts: api.ODMappedPostManager
    declare states: api.ODMappedStateManager
    
    declare client: api.ODMappedClientManager
    declare livestatus: api.ODMappedLiveStatusManager
    declare startscreen: api.ODMappedStartScreenManager

    /////////////////////
    //// OPEN TICKET ////
    /////////////////////

    /**Open Ticket specific fuses. With these fuses/switches, you can turn off "default behaviours" from the bot. Useful for replacing default behaviour with a custom implementation.  */
    fuses: api.ODFuseManager<api.ODOpenTicketFuseList>
    /**The manager that manages all the data of questions in the bot. (these are used in options & tickets) */
    questions: api.ODQuestionManager
    /**The manager that manages all the data of options in the bot. (these are used for panels, ticket creation, reaction roles) */
    options: api.ODOptionManager
    /**The manager that manages all the data of panels in the bot. (panels contain the options) */
    panels: api.ODPanelManager
    /**The manager that manages all tickets in the bot. (here, you can get & edit a lot of data from tickets) */
    tickets: api.ODTicketManager
    /**The manager that manages the ticket blacklist. (people who are blacklisted can't create a ticket) */
    blacklist: api.ODBlacklistManager
    /**The manager that manages the ticket transcripts. (both the history & compilers) */
    transcripts: api.ODMappedTranscriptManager
    /**The manager that manages all reaction roles in the bot. (here, you can add additional data to roles) */
    roles: api.ODRoleManager
    /**The manager that manages all priority levels in the bot. (register/edit ticket priority levels) */
    priorities: api.ODMappedPriorityManager

    constructor(){
        const version = api.ODVersion.fromString("opendiscord:version","v4.2.2")
        const debugfile = new api.ODDebugFileManager("./","otdebug.txt",5000,version)
        const console = new api.ODConsoleManager(100,debugfile)
        const debug = new api.ODDebugger(console)
        const client = new api.ODMappedClientManager(debug)
        const livestatus = new api.ODMappedLiveStatusManager(debug,console)
        const permissions = new api.ODMappedPermissionManager(debug,client,true)

        super({
            versions:new api.ODMappedVersionManager(),
            debugfile,console,debug,
            events:new api.ODMappedEventManager(debug),
            processStartupDate:new Date(),
            readyStartupDate:null,
        
            plugins:new api.ODMappedPluginManager(debug),
            flags:new api.ODMappedFlagManager(debug),
            progressbars:new api.ODMappedProgressBarManager(debug),
            configs:new api.ODMappedConfigManager(debug),
            databases:new api.ODMappedDatabaseManager(debug),
            sessions:new api.ODMappedSessionManager(debug),
            languages:new api.ODMappedLanguageManager(debug,false),
            
            checkers:new api.ODMappedCheckerManager(debug,
                new api.ODCheckerStorage(),
                new api.ODDefaultCheckerRenderer("#f8ba00","https://discord.dj-dj.be","https://otdocs.dj-dj.be"),
                new api.ODMappedCheckerTranslationRegister(),
                new api.ODMappedCheckerFunctionManager(debug)
            ),
            builders:new api.ODMappedBuilderManager(debug),
            components:new api.ODMappedComponentManager(debug),
            client,
            responders:new api.ODMappedResponderManager(debug,client),
            actions:new api.ODMappedActionManager(debug),
            verifybars:new api.ODMappedVerifyBarManager(debug),
            permissions,
            cooldowns:new api.ODMappedCooldownManager(debug),
            helpmenu:new api.ODMappedHelpMenuManager(debug),
            statistics:new api.ODMappedStatisticManager(debug),
            tasks:new api.ODMappedTaskManager(debug),
            posts:new api.ODMappedPostManager(debug),
            states:new api.ODMappedStateManager(debug),
            
            sharedFuses:utilities.sharedFuses,
            env:new api.ODEnvHelper(),
            livestatus,
            startscreen:new api.ODMappedStartScreenManager(debug,livestatus),
        },"openticket")

        this.livestatus.useMain(this)
        this.versions.add(api.ODVersion.fromString("opendiscord:version",this.readVersionFromPackage()))
        this.versions.add(api.ODVersion.fromString("opendiscord:transcripts","v2.1.0"))

        //OPEN TICKET
        this.fuses = new api.ODFuseManager<api.ODOpenTicketFuseList>({
            priorityLoading:true,
            questionLoading:true,
            optionLoading:true,
            panelLoading:true,
            ticketLoading:true,
            roleLoading:true,
            blacklistLoading:true,
            transcriptCompilerLoading:true,
            transcriptHistoryLoading:true,
            autocloseCheckInterval:300000, //5 minutes
            autodeleteCheckInterval:300000 //5 minutes
        })
        this.questions = new api.ODQuestionManager(debug)
        this.options = new api.ODOptionManager(debug)
        this.panels = new api.ODPanelManager(debug)
        this.tickets = new api.ODTicketManager(debug,client)
        this.blacklist = new api.ODBlacklistManager(debug)
        this.transcripts = new api.ODMappedTranscriptManager(debug,this.tickets,client,permissions)
        this.roles = new api.ODRoleManager(debug)
        this.priorities = new api.ODMappedPriorityManager(debug)
    }

    private readVersionFromPackage(): string {
        const packageJson: {version:string} = JSON.parse(fs.readFileSync(path.join(process.cwd(),"./package.json")).toString())
        return "v"+packageJson.version
    }
}