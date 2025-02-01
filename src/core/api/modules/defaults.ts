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
    /**When enabled, you're able to use the "!OPENTICKET:dump" command to send the OT debug file. This is only possible when you're the owner of the bot. */
    allowDumpCommand:boolean,
    /**Enable loading all Open Ticket plugins, sadly enough is only useful for the system :) */
    pluginLoading:boolean,
    /**Don't crash the bot when a plugin crashes! */
    softPluginLoading:boolean,

    /**Load the default Open Ticket plugin classes. */
    pluginClassLoading:boolean,

    /**Load the default Open Ticket flags. */
    flagLoading:boolean,
    /**Enable the default initializer for Open Ticket flags. */
    flagInitiating:boolean,
    /**Load the default Open Ticket progress bar renderers. */
    progressBarRendererLoading:boolean,
    /**Load the default Open Ticket progress bars. */
    progressBarLoading:boolean,
    /**Load the default Open Ticket configs. */
    configLoading:boolean,
    /**Enable the default initializer for Open Ticket config. */
    configInitiating:boolean,
    /**Load the default Open Ticket databases. */
    databaseLoading:boolean,
    /**Enable the default initializer for Open Ticket database. */
    databaseInitiating:boolean,
    /**Load the default Open Ticket sessions. */
    sessionLoading:boolean,

    /**Load the default Open Ticket languages. */
    languageLoading:boolean,
    /**Enable the default initializer for Open Ticket languages. */
    languageInitiating:boolean,
    /**Enable selecting the current language from `config/general.json`. */
    languageSelection:boolean,
    /**Set the backup language when the primary language is missing a property. */
    backupLanguage:string,
    /****[NOT FOR PLUGIN TRANSLATIONS]** The full list of available languages (used in the default config checker). */
    languageList:string[],

    /**Load the default Open Ticket config checker. */
    checkerLoading:boolean,
    /**Load the default Open Ticket config checker functions. */
    checkerFunctionLoading:boolean,
    /**Enable the default execution of the config checkers. */
    checkerExecution:boolean,
    /**Load the default Open Ticket config checker translations. */
    checkerTranslationLoading:boolean,
    /**Enable the default rendering of the config checkers. */
    checkerRendering:boolean,
    /**Enable the default quit action when there is an error in the config checker. */
    checkerQuit:boolean,
    /**Render the checker even when there are no errors & warnings. */
    checkerRenderEmpty:boolean,

    /**Load the default Open Ticket client configuration. */
    clientLoading:boolean,
    /**Load the default Open Ticket client initialization. */
    clientInitiating:boolean,
    /**Load the default Open Ticket client ready actions (status, commands, permissions, ...). */
    clientReady:boolean,
    /**Create a warning when the bot is present in multiple guilds. */
    clientMultiGuildWarning:boolean,
    /**Load the default Open Ticket client activity (from `config/general.json`). */
    clientActivityLoading:boolean,
    /**Load the default Open Ticket client activity initialization (& status refresh). */
    clientActivityInitiating:boolean,

    /**Load the default Open Ticket slash commands. */
    slashCommandLoading:boolean,
    /**Load the default Open Ticket slash command registerer (register slash cmds in discord). */
    slashCommandRegistering:boolean,
    /**When enabled, the bot is forced to re-register all slash commands in the server. This can be used in case of a auto-update malfunction. */
    forceSlashCommandRegistration:boolean,
    /**When enabled, the bot is allowed to unregister all slash commands which aren't used in Open Ticket. Disable this if you don't want to use the Open Ticket `ODSlashCommand` classes. */
    allowSlashCommandRemoval:boolean,
    /**Load the default Open Ticket text commands. */
    textCommandLoading:boolean,

    /**Load the default Open Ticket questions (from `config/questions.json`) */
    questionLoading:boolean,
    /**Load the default Open Ticket options (from `config/options.json`) */
    optionLoading:boolean,
    /**Load the default Open Ticket panels (from `config/panels.json`) */
    panelLoading:boolean,
    /**Load the default Open Ticket tickets (from `database/tickets.json`) */
    ticketLoading:boolean,
    /**Load the default Open Ticket reaction roles (from `config/options.json`) */
    roleLoading:boolean,
    /**Load the default Open Ticket blacklist (from `database/users.json`) */
    blacklistLoading:boolean,
    /**Load the default Open Ticket transcript compilers. */
    transcriptCompilerLoading:boolean,
    /**Load the default Open Ticket transcript history (from `database/transcripts.json`) */
    transcriptHistoryLoading:boolean,

    /**Load the default Open Ticket button builders. */
    buttonBuildersLoading:boolean,
    /**Load the default Open Ticket dropdown builders. */
    dropdownBuildersLoading:boolean,
    /**Load the default Open Ticket file builders. */
    fileBuildersLoading:boolean,
    /**Load the default Open Ticket embed builders. */
    embedBuildersLoading:boolean,
    /**Load the default Open Ticket message builders. */
    messageBuildersLoading:boolean,
    /**Load the default Open Ticket modal builders. */
    modalBuildersLoading:boolean,

    /**Load the default Open Ticket command responders. */
    commandRespondersLoading:boolean,
    /**Load the default Open Ticket button responders. */
    buttonRespondersLoading:boolean,
    /**Load the default Open Ticket dropdown responders. */
    dropdownRespondersLoading:boolean,
    /**Load the default Open Ticket modal responders. */
    modalRespondersLoading:boolean,
    /**Set the time (in ms) before Open Ticket sends an error message when no reply is sent in a responder. */
    responderTimeoutMs:number,

    /**Load the default Open Ticket actions. */
    actionsLoading:boolean,

    /**Load the default Open Ticket verify bars. */
    verifyBarsLoading:boolean,
    /**Load the default Open Ticket permissions. */
    permissionsLoading:boolean,
    /**Load the default Open Ticket posts. */
    postsLoading:boolean,
    /**Initiate the default Open Ticket posts. */
    postsInitiating:boolean,
    /**Load the default Open Ticket cooldowns. */
    cooldownsLoading:boolean,
    /**Initiate the default Open Ticket cooldowns. */
    cooldownsInitiating:boolean,
    /**Load the default Open Ticket help menu categories. */
    helpMenuCategoryLoading:boolean,
    /**Load the default Open Ticket help menu components. */
    helpMenuComponentLoading:boolean,

    /**Load the default Open Ticket stat scopes. */
    statScopesLoading:boolean,
    /**Load the default Open Ticket stats. */
    statLoading:boolean,
    /**Initiate the default Open Ticket stats. */
    statInitiating:boolean,

    /**Load the default Open Ticket code/functions. */
    codeLoading:boolean,
    /**Execute the default Open Ticket code/functions. */
    codeExecution:boolean,

    /**Load the default Open Ticket livestatus. */
    liveStatusLoading:boolean,
    /**Load the default Open Ticket startscreen. */
    startScreenLoading:boolean,
    /**Render the default Open Ticket startscreen. */
    startScreenRendering:boolean,

    /**Load the emoji style from the Open Ticket general config. */
    emojiTitleStyleLoading:boolean,
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
 * This is an Open Ticket defaults manager.
 * 
 * It manages all settings in Open Ticket that are not meant to be in the config.
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
            allowDumpCommand:true,
            pluginLoading:true,
            softPluginLoading:false,

            pluginClassLoading:true,

            flagLoading:true,
            flagInitiating:true,
            progressBarRendererLoading:true,
            progressBarLoading:true,
            configLoading:true,
            configInitiating:true,
            databaseLoading:true,
            databaseInitiating:true,
            sessionLoading:true,

            languageLoading:true,
            languageInitiating:true,
            languageSelection:true,
            backupLanguage:"opendiscord:english",
            languageList:[],

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
            allowSlashCommandRemoval:true,
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
            
            emojiTitleStyleLoading:true,
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