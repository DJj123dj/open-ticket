///////////////////////////////////////
//DEFAULTS MODULE
///////////////////////////////////////

/**## ODDefaults `interface`
 * This type is a list of all defaults available in the `ODDefaultsManager` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDefaults {
    /**Enable the default error handling system. */
    errorHandling:boolean,
    /**Crash when there is an unknown bot error. */
    crashOnError:boolean,
    /**Enable the system responsible for the `--debug` flag. */
    debugLoading:boolean,
    /**Enable loading all Open Ticket plugins, sadly enough is only useful for the system :) */
    pluginLoading:boolean,
    /**Don't crash the bot when a plugin crashes! */
    softPluginLoading:boolean,

    /**Load the default open ticket plugin classes. */
    pluginClassLoading:boolean,
    /**Load the default open ticket plugin events. */
    pluginEventLoading:boolean,

    /**Load the default open ticket flags. */
    flagLoading:boolean,
    /**Enable the default initializer for open ticket flags. */
    flagInitiating:boolean,
    /**Load the default open ticket configs. */
    configLoading:boolean,
    /**Load the default open ticket databases. */
    databaseLoading:boolean,
    /**Load the default open ticket sessions. */
    sessionLoading:boolean,

    /**Load the default open ticket languages. */
    languageLoading:boolean,
    /**Enable selecting the current language from `config/general.json`. */
    languageSelection:boolean,
    /**Set the backup language when the primary language is missing a property. */
    backupLanguage:string,
    /****[NOD FOR PLUGIN TRANSLATIONS]** The full list of available languages (used in the default config checker). */
    languageList:string[],

    /**Load the default open ticket config checker. */
    checkerLoading:boolean,
    /**Load the default open ticket config checker functions. */
    checkerFunctionLoading:boolean,
    /**Enable the default execution of the config checkers. */
    checkerExecution:boolean,
    /**Load the default open ticket config checker translations. */
    checkerTranslationLoading:boolean,
    /**Enable the default rendering of the config checkers. */
    checkerRendering:boolean,
    /**Enable the default quit action when there is an error in the config checker. */
    checkerQuit:boolean,
    /**Render the checker even when there are no errors & warnings. */
    checkerRenderEmpty:boolean,

    /**Load the default open ticket client configuration. */
    clientLoading:boolean,
    /**Load the default open ticket client initialization. */
    clientInitiating:boolean,
    /**Load the default open ticket client ready actions (status, commands, permissions, ...). */
    clientReady:boolean,
    /**Create a warning when the bot is present in multiple guilds. */
    clientMultiGuildWarning:boolean,
    /**Load the default open ticket client activity (from `config/general.json`). */
    clientActivityLoading:boolean,
    /**Load the default open ticket client activity initialization (& status refresh). */
    clientActivityInitiating:boolean,

    /**Load the default open ticket slash commands. */
    slashCommandLoading:boolean,
    /**Load the default open ticket slash command registerer (register slash cmds in discord). */
    slashCommandRegistering:boolean,
    /**When enabled, the bot is forced to re-register all slash commands in the server. This can be used in case of a auto-update malfunction. */
    forceSlashCommandRegistration:boolean,
    /**Load the default open ticket text commands. */
    textCommandLoading:boolean,

    /**Load the default open ticket questions (from `config/questions.json`) */
    questionLoading:boolean,
    /**Load the default open ticket options (from `config/options.json`) */
    optionLoading:boolean,
    /**Load the default open ticket panels (from `config/panels.json`) */
    panelLoading:boolean,
    /**Load the default open ticket tickets (from `database/tickets.json`) */
    ticketLoading:boolean,
    /**Load the default open ticket reaction roles (from `config/options.json`) */
    roleLoading:boolean,
    /**Load the default open ticket blacklist (from `database/users.json`) */
    blacklistLoading:boolean,
    /**Load the default open ticket transcript compilers. */
    transcriptCompilerLoading:boolean,
    /**Load the default open ticket transcript history (from `database/transcripts.json`) */
    transcriptHistoryLoading:boolean,

    /**Load the default open ticket button builders. */
    buttonBuildersLoading:boolean,
    /**Load the default open ticket dropdown builders. */
    dropdownBuildersLoading:boolean,
    /**Load the default open ticket file builders. */
    fileBuildersLoading:boolean,
    /**Load the default open ticket embed builders. */
    embedBuildersLoading:boolean,
    /**Load the default open ticket message builders. */
    messageBuildersLoading:boolean,
    /**Load the default open ticket modal builders. */
    modalBuildersLoading:boolean,

    /**Load the default open ticket command responders. */
    commandRespondersLoading:boolean,
    /**Load the default open ticket button responders. */
    buttonRespondersLoading:boolean,
    /**Load the default open ticket dropdown responders. */
    dropdownRespondersLoading:boolean,
    /**Load the default open ticket modal responders. */
    modalRespondersLoading:boolean,
    /**Set the time (in ms) before open ticket sends an error message when no reply is sent in a responder. */
    responderTimeoutMs:number,

    /**Load the default open ticket actions. */
    actionsLoading:boolean,

    /**Load the default open ticket verify bars. */
    verifyBarsLoading:boolean,
    /**Load the default open ticket permissions. */
    permissionsLoading:boolean,
    /**Load the default open ticket posts. */
    postsLoading:boolean,
    /**Initiate the default open ticket posts. */
    postsInitiating:boolean,
    /**Load the default open ticket cooldowns. */
    cooldownsLoading:boolean,
    /**Initiate the default open ticket cooldowns. */
    cooldownsInitiating:boolean,
    /**Load the default open ticket help menu categories. */
    helpMenuCategoryLoading:boolean,
    /**Load the default open ticket help menu components. */
    helpMenuComponentLoading:boolean,

    /**Load the default open ticket stat scopes. */
    statScopesLoading:boolean,
    /**Load the default open ticket stats. */
    statLoading:boolean,
    /**Initiate the default open ticket stats. */
    statInitiating:boolean,

    /**Load the default open ticket code/functions. */
    codeLoading:boolean,
    /**Execute the default open ticket code/functions. */
    codeExecution:boolean,

    /**Load the default open ticket livestatus. */
    liveStatusLoading:boolean,
    /**Load the default open ticket startscreen. */
    startScreenLoading:boolean,
    /**Render the default open ticket startscreen. */
    startScreenRendering:boolean,

    /**The emoji style to use in embed & message titles using `utilities.emoijTitle()` */
    emojiTitleStyle:"disabled"|"before"|"after"|"double",
    /**The emoji divider to use in embed & message titles using `utilities.emoijTitle()` */
    emojiTitleDivider:string
    /**The interval in milliseconds that are between autoclose timeout checkers. */
    autocloseCheckInterval:number
    /**The interval in milliseconds that are between autodelete timeout checkers. */
    autodeleteCheckInterval:number
}

/**## ODDefaultsBooleans `type`
 * This type is a list of boolean defaults available in the `ODDefaultsManager` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODDefaultsBooleans = {
    [Key in keyof ODDefaults]: ODDefaults[Key] extends boolean ? Key : never
}[keyof ODDefaults]

/**## ODDefaultsStrings `type`
 * This type is a list of string defaults available in the `ODDefaultsManager` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODDefaultsStrings = {
    [Key in keyof ODDefaults]: ODDefaults[Key] extends string ? Key : never
}[keyof ODDefaults]

/**## ODDefaultsNumbers `type`
 * This type is a list of number defaults available in the `ODDefaultsManager` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODDefaultsNumbers = {
    [Key in keyof ODDefaults]: ODDefaults[Key] extends number ? Key : never
}[keyof ODDefaults]

/**## ODDefaultsStringArray `type`
 * This type is a list of string[] defaults available in the `ODDefaultsManager` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODDefaultsStringArray = {
    [Key in keyof ODDefaults]: ODDefaults[Key] extends string[] ? Key : never
}[keyof ODDefaults]

/**## ODDefaultsManager `class`
 * This is an open ticket defaults manager.
 * 
 * It manages all settings in open ticket that are not meant to be in the config.
 * Here you can disable certain default features to replace them or to specifically enable them!
 * 
 * You are unable to add your own defaults, you can only edit Open Ticket defaults!
 */
export class ODDefaultsManager {
    /**A list of all the defaults */
    #defaults: ODDefaults

    constructor(){
        this.#defaults = {
            errorHandling:true,
            crashOnError:false,
            debugLoading:true,
            pluginLoading:true,
            softPluginLoading:false,

            pluginClassLoading:true,
            pluginEventLoading:true,

            flagLoading:true,
            flagInitiating:true,
            configLoading:true,
            databaseLoading:true,
            sessionLoading:true,

            languageLoading:true,
            languageSelection:true,
            backupLanguage:"openticket:english",
            languageList:["custom","english","dutch","portuguese","czech","german","catalan"],

            checkerLoading:true,
            checkerFunctionLoading:true,
            checkerExecution:true,
            checkerTranslationLoading:true,
            checkerRendering:true,
            checkerQuit:true,
            checkerRenderEmpty:false,

            clientLoading:true,
            clientInitiating:true,
            clientReady:true,
            clientMultiGuildWarning:true,
            clientActivityLoading:true,
            clientActivityInitiating:true,
            
            slashCommandLoading:true,
            slashCommandRegistering:true,
            forceSlashCommandRegistration:false,
            textCommandLoading:true,

            questionLoading:true,
            optionLoading:true,
            panelLoading:true,
            ticketLoading:true,
            roleLoading:true,
            blacklistLoading:true,
            transcriptCompilerLoading:true,
            transcriptHistoryLoading:true,

            buttonBuildersLoading:true,
            dropdownBuildersLoading:true,
            fileBuildersLoading:true,
            embedBuildersLoading:true,
            messageBuildersLoading:true,
            modalBuildersLoading:true,

            commandRespondersLoading:true,
            buttonRespondersLoading:true,
            dropdownRespondersLoading:true,
            modalRespondersLoading:true,
            responderTimeoutMs:2500,

            actionsLoading:true,

            verifyBarsLoading:true,
            permissionsLoading:true,
            postsLoading:true,
            postsInitiating:true,
            cooldownsLoading:true,
            cooldownsInitiating:true,
            helpMenuCategoryLoading:true,
            helpMenuComponentLoading:true,

            statScopesLoading:true,
            statLoading:true,
            statInitiating:true,

            codeLoading:true,
            codeExecution:true,

            liveStatusLoading:true,
            startScreenLoading:true,
            startScreenRendering:true,
            
            emojiTitleStyle:"before",
            emojiTitleDivider:" ",
            autocloseCheckInterval:300000, //5 minutes
            autodeleteCheckInterval:300000 //5 minutes
        }
    }

    /**Set a default to a specific value. Remember! All plugins can edit these values, so your value could be overwritten! */
    setDefault<DefaultName extends keyof ODDefaults>(key:DefaultName, value:ODDefaults[DefaultName]): void {
        this.#defaults[key] = value
    }

    /**Get a default. Remember! All plugins can edit these values, so this value could be overwritten! */
    getDefault<DefaultName extends keyof ODDefaults>(key:DefaultName): ODDefaults[DefaultName] {
        return this.#defaults[key]
    }
}