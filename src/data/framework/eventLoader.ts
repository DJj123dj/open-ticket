import {opendiscord, api, utilities} from "../../index"

export const loadAllEvents = () => {
    const eventList: (keyof api.ODEventIds_Default)[] = [
        //error handling
        "onErrorHandling",
        "afterErrorHandling",

        //plugins
        "afterPluginsLoaded",
        "onPluginClassLoad",
        "afterPluginClassesLoaded",

        //flags
        "onFlagLoad",
        "afterFlagsLoaded",
        "onFlagInit",
        "afterFlagsInitiated",

        //progress bars
        "onProgressBarRendererLoad",
        "afterProgressBarRenderersLoaded",
        "onProgressBarLoad",
        "afterProgressBarsLoaded",

        //configs
        "onConfigLoad",
        "afterConfigsLoaded",
        "onConfigInit",
        "afterConfigsInitiated",

        //databases
        "onDatabaseLoad",
        "afterDatabasesLoaded",
        "onDatabaseInit",
        "afterDatabasesInitiated",

        //languages
        "onLanguageLoad",
        "afterLanguagesLoaded",
        "onLanguageInit",
        "afterLanguagesInitiated",
        "onLanguageSelect",
        "afterLanguagesSelected",

        //sessions
        "onSessionLoad",
        "afterSessionsLoaded",

        //config checkers
        "onCheckerLoad",
        "afterCheckersLoaded",
        "onCheckerFunctionLoad",
        "afterCheckerFunctionsLoaded",
        "onCheckerExecute",
        "afterCheckersExecuted",
        "onCheckerTranslationLoad",
        "afterCheckerTranslationsLoaded",
        "onCheckerRender",
        "afterCheckersRendered",
        "onCheckerQuit",

        //plugin loading before client
        "onPluginBeforeClientLoad",
        "afterPluginBeforeClientLoaded",

        //client configuration
        "onClientLoad",
        "afterClientLoaded",
        "onClientInit",
        "afterClientInitiated",
        "onClientReady",
        "afterClientReady",
        "onClientActivityLoad",
        "afterClientActivityLoaded",
        "onClientActivityInit",
        "afterClientActivityInitiated",
        
        //client slash commands
        "onSlashCommandLoad",
        "afterSlashCommandsLoaded",
        "onSlashCommandRegister",
        "afterSlashCommandsRegistered",

        //client text commands
        "onTextCommandLoad",
        "afterTextCommandsLoaded",

        //plugin loading before managers
        "onPluginBeforeManagerLoad",
        "afterPluginBeforeManagerLoaded",

        //questions
        "onQuestionLoad",
        "afterQuestionsLoaded",

        //options
        "onOptionLoad",
        "afterOptionsLoaded",

        //panels
        "onPanelLoad",
        "afterPanelsLoaded",
        "onPanelSpawn",
        "afterPanelSpawned",

        //tickets
        "onTicketLoad",
        "afterTicketsLoaded",

        //ticket creation
        "onTicketChannelCreation",
        "afterTicketChannelCreated",
        "onTicketChannelDeletion",
        "afterTicketChannelDeleted",
        "onTicketPermissionsCreated",
        "afterTicketPermissionsCreated",
        "onTicketMainMessageCreated",
        "afterTicketMainMessageCreated",

        //ticket actions
        "onTicketCreate",
        "afterTicketCreated",
        "onTicketClose",
        "afterTicketClosed",
        "onTicketReopen",
        "afterTicketReopened",
        "onTicketDelete",
        "afterTicketDeleted",
        "onTicketMove",
        "afterTicketMoved",
        "onTicketClaim",
        "afterTicketClaimed",
        "onTicketUnclaim",
        "afterTicketUnclaimed",
        "onTicketPin",
        "afterTicketPinned",
        "onTicketUnpin",
        "afterTicketUnpinned",
        "onTicketUserAdd",
        "afterTicketUserAdded",
        "onTicketUserRemove",
        "afterTicketUserRemoved",
        "onTicketRename",
        "afterTicketRenamed",
        "onTicketsClear",
        "afterTicketsCleared",

        //roles
        "onRoleLoad",
        "afterRolesLoaded",
        "onRoleUpdate",
        "afterRolesUpdated",
        
        //blacklist
        "onBlacklistLoad",
        "afterBlacklistLoaded",

        //transcripts
        "onTranscriptCompilerLoad",
        "afterTranscriptCompilersLoaded",
        "onTranscriptHistoryLoad",
        "afterTranscriptHistoryLoaded",

        //transcript creation
        "onTranscriptCreate",
        "afterTranscriptCreated",
        "onTranscriptInit",
        "afterTranscriptInitiated",
        "onTranscriptCompile",
        "afterTranscriptCompiled",
        "onTranscriptReady",
        "afterTranscriptReady",

        //plugin loading before builders
        "onPluginBeforeBuilderLoad",
        "afterPluginBeforeBuilderLoaded",

        //builders
        "onButtonBuilderLoad",
        "afterButtonBuildersLoaded",
        "onDropdownBuilderLoad",
        "afterDropdownBuildersLoaded",
        "onFileBuilderLoad",
        "afterFileBuildersLoaded",
        "onEmbedBuilderLoad",
        "afterEmbedBuildersLoaded",
        "onMessageBuilderLoad",
        "afterMessageBuildersLoaded",
        "onModalBuilderLoad",
        "afterModalBuildersLoaded",

        //plugin loading before responders
        "onPluginBeforeResponderLoad",
        "afterPluginBeforeResponderLoaded",

        //responders
        "onCommandResponderLoad",
        "afterCommandRespondersLoaded",
        "onButtonResponderLoad",
        "afterButtonRespondersLoaded",
        "onDropdownResponderLoad",
        "afterDropdownRespondersLoaded",
        "onModalResponderLoad",
        "afterModalRespondersLoaded",

        //plugin loading before finalizations
        "onPluginBeforeFinalizationLoad",
        "afterPluginBeforeFinalizationLoaded",

        //actions
        "onActionLoad",
        "afterActionsLoaded",

        //verifybars
        "onVerifyBarLoad",
        "afterVerifyBarsLoaded",

        //permissions
        "onPermissionLoad",
        "afterPermissionsLoaded",

        //posts
        "onPostLoad",
        "afterPostsLoaded",
        "onPostInit",
        "afterPostsInitiated",

        //cooldowns
        "onCooldownLoad",
        "afterCooldownsLoaded",
        "onCooldownInit",
        "afterCooldownsInitiated",

        //help menu
        "onHelpMenuCategoryLoad",
        "afterHelpMenuCategoriesLoaded",
        "onHelpMenuComponentLoad",
        "afterHelpMenuComponentsLoaded",

        //stats
        "onStatScopeLoad",
        "afterStatScopesLoaded",
        "onStatLoad",
        "afterStatsLoaded",
        "onStatInit",
        "afterStatsInitiated",

        //plugin loading before code
        "onPluginBeforeCodeLoad",
        "afterPluginBeforeCodeLoaded",

        //code
        "onCodeLoad",
        "afterCodeLoaded",
        "onCodeExecute",
        "afterCodeExecuted",

        //livestatus
        "onLiveStatusSourceLoad",
        "afterLiveStatusSourcesLoaded",

        //startscreen
        "onStartScreenLoad",
        "afterStartScreensLoaded",
        "onStartScreenRender",
        "afterStartScreensRendered",

        //ready
        "beforeReadyForUsage",
        "onReadyForUsage"
    ]
    eventList.forEach((event) => opendiscord.events.add(new api.ODEvent(event)))
}