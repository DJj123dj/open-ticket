import {openticket, api, utilities} from "../../index"

export const loadAllEvents = () => {
    const eventList: (keyof api.ODEventIds_Default)[] = [
        //error handling
        "onErrorHandling",
        "afterErrorHandling",

        //plugins
        "afterPluginsLoaded",
        "onPluginClassLoad",
        "afterPluginClassesLoaded",
        "onPluginEventLoad",
        "afterPluginEventsLoaded",

        //flags
        "onFlagLoad",
        "afterFlagsLoaded",
        "onFlagInit",
        "afterFlagsInitiated",

        //configs
        "onConfigLoad",
        "afterConfigsLoaded",

        //databases
        "onDatabaseLoad",
        "afterDatabasesLoaded",

        //languages
        "onLanguageLoad",
        "afterLanguagesLoaded",
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

        //responders
        "onCommandResponderLoad",
        "afterCommandRespondersLoaded",
        "onButtonResponderLoad",
        "afterButtonRespondersLoaded",
        "onDropdownResponderLoad",
        "afterDropdownRespondersLoaded",
        "onModalResponderLoad",
        "afterModalRespondersLoaded",

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
        "afterStartScreensRendered"
    ]
    eventList.forEach((event) => openticket.events.add(new api.ODEvent(event)))
}