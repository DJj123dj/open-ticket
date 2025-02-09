///////////////////////////////////////
//DEFAULT EVENT MODULE
///////////////////////////////////////
//BASE MODULES
import { ODPromiseVoid, ODValidId } from "../modules/base"
import { ODConsoleManager, ODError } from "../modules/console"
import { ODCheckerResult, ODCheckerStorage } from "../modules/checker"
import { ODDefaultsManager } from "../modules/defaults"
import { ODLanguage } from "../modules/language"
import { ODClientActivityManager } from "../modules/client"
import { ODEvent, ODEventManager } from "../modules/event"
import * as discord from "discord.js"

//DEFAULT MODULES
import { ODPluginClassManager_Default, ODPluginManager_Default } from "./plugin"
import { ODConfigManager_Default} from "./config"
import { ODDatabaseManager_Default } from "./database"
import { ODFlagManager_Default } from "./flag"
import { ODSessionManager_Default } from "./session"
import { ODLanguageManager_Default } from "./language"
import { ODCheckerFunctionManager_Default, ODCheckerManager_Default, ODCheckerRenderer_Default, ODCheckerTranslationRegister_Default } from "./checker"
import { ODClientManager_Default, ODSlashCommandManager_Default, ODTextCommandManager_Default } from "./client"
import { ODBuilderManager_Default, ODButtonManager_Default, ODDropdownManager_Default, ODEmbedManager_Default, ODFileManager_Default, ODMessageManager_Default, ODModalManager_Default } from "./builder"
import { ODButtonResponderManager_Default, ODCommandResponderManager_Default, ODDropdownResponderManager_Default, ODModalResponderManager_Default, ODResponderManager_Default } from "./responder"
import { ODActionManager_Default } from "./action"
import { ODPermissionManager_Default } from "./permission"
import { ODHelpMenuManager_Default } from "./helpmenu"
import { ODStatsManager_Default } from "./stat"
import { ODCodeManager_Default } from "./code"
import { ODCooldownManager_Default } from "./cooldown"
import { ODPostManager_Default } from "./post"
import { ODVerifyBarManager_Default } from "./verifybar"
import { ODStartScreenManager_Default } from "./startscreen"
import { ODLiveStatusManager_Default } from "./console"
import { ODProgressBarManager_Default, ODProgressBarRendererManager_Default } from "./progressbar"

//OPEN TICKET MODULES
import { ODOptionManager, ODTicketOption } from "../openticket/option"
import { ODPanel, ODPanelManager } from "../openticket/panel"
import { ODTicket, ODTicketClearFilter, ODTicketManager } from "../openticket/ticket"
import { ODQuestionManager } from "../openticket/question"
import { ODBlacklistManager } from "../openticket/blacklist"
import { ODTranscriptManager_Default } from "../openticket/transcript"
import { ODRole, ODRoleManager } from "../openticket/role"

/**## ODEventIds_Default `interface`
 * This interface is a list of ids available in the `ODEvent_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODEventIds_Default {
    //error handling
    "onErrorHandling": ODEvent_Default<(error:Error, origin:NodeJS.UncaughtExceptionOrigin) => ODPromiseVoid>
    "afterErrorHandling": ODEvent_Default<(error:Error, origin:NodeJS.UncaughtExceptionOrigin, message:ODError) => ODPromiseVoid>

    //plugins
    "afterPluginsLoaded": ODEvent_Default<(plugins:ODPluginManager_Default) => ODPromiseVoid>
    "onPluginClassLoad": ODEvent_Default<(classes:ODPluginClassManager_Default, plugins:ODPluginManager_Default) => ODPromiseVoid>
    "afterPluginClassesLoaded": ODEvent_Default<(classes:ODPluginClassManager_Default, plugins:ODPluginManager_Default) => ODPromiseVoid>

    //flags
    "onFlagLoad": ODEvent_Default<(flags:ODFlagManager_Default) => ODPromiseVoid>
    "afterFlagsLoaded": ODEvent_Default<(flags:ODFlagManager_Default) => ODPromiseVoid>
    "onFlagInit": ODEvent_Default<(flags:ODFlagManager_Default) => ODPromiseVoid>
    "afterFlagsInitiated": ODEvent_Default<(flags:ODFlagManager_Default) => ODPromiseVoid>

    //progress bars
    "onProgressBarRendererLoad": ODEvent_Default<(renderers:ODProgressBarRendererManager_Default) => ODPromiseVoid>
    "afterProgressBarRenderersLoaded": ODEvent_Default<(renderers:ODProgressBarRendererManager_Default) => ODPromiseVoid>
    "onProgressBarLoad": ODEvent_Default<(progressbars:ODProgressBarManager_Default) => ODPromiseVoid>
    "afterProgressBarsLoaded": ODEvent_Default<(progressbars:ODProgressBarManager_Default) => ODPromiseVoid>

    //configs
    "onConfigLoad": ODEvent_Default<(configs:ODConfigManager_Default) => ODPromiseVoid>
    "afterConfigsLoaded": ODEvent_Default<(configs:ODConfigManager_Default) => ODPromiseVoid>
    "onConfigInit": ODEvent_Default<(configs:ODConfigManager_Default) => ODPromiseVoid>
    "afterConfigsInitiated": ODEvent_Default<(configs:ODConfigManager_Default) => ODPromiseVoid>

    //databases
    "onDatabaseLoad": ODEvent_Default<(databases:ODDatabaseManager_Default) => ODPromiseVoid>
    "afterDatabasesLoaded": ODEvent_Default<(databases:ODDatabaseManager_Default) => ODPromiseVoid>
    "onDatabaseInit": ODEvent_Default<(databases:ODDatabaseManager_Default) => ODPromiseVoid>
    "afterDatabasesInitiated": ODEvent_Default<(databases:ODDatabaseManager_Default) => ODPromiseVoid>

    //languages
    "onLanguageLoad": ODEvent_Default<(languages:ODLanguageManager_Default) => ODPromiseVoid>
    "afterLanguagesLoaded": ODEvent_Default<(languages:ODLanguageManager_Default) => ODPromiseVoid>
    "onLanguageInit": ODEvent_Default<(languages:ODLanguageManager_Default) => ODPromiseVoid>
    "afterLanguagesInitiated": ODEvent_Default<(languages:ODLanguageManager_Default) => ODPromiseVoid>
    "onLanguageSelect": ODEvent_Default<(languages:ODLanguageManager_Default) => ODPromiseVoid>
    "afterLanguagesSelected": ODEvent_Default<(main:ODLanguage|null, backup:ODLanguage|null, languages:ODLanguageManager_Default) => ODPromiseVoid>

    //sessions
    "onSessionLoad": ODEvent_Default<(languages:ODSessionManager_Default) => ODPromiseVoid>
    "afterSessionsLoaded": ODEvent_Default<(languages:ODSessionManager_Default) => ODPromiseVoid>

    //config checkers
    "onCheckerLoad": ODEvent_Default<(checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "afterCheckersLoaded": ODEvent_Default<(checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "onCheckerFunctionLoad": ODEvent_Default<(functions:ODCheckerFunctionManager_Default, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "afterCheckerFunctionsLoaded": ODEvent_Default<(functions:ODCheckerFunctionManager_Default, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "onCheckerExecute": ODEvent_Default<(checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "afterCheckersExecuted": ODEvent_Default<(result:ODCheckerResult, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "onCheckerTranslationLoad": ODEvent_Default<(translations:ODCheckerTranslationRegister_Default, enabled:boolean, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "afterCheckerTranslationsLoaded": ODEvent_Default<(translations:ODCheckerTranslationRegister_Default, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "onCheckerRender": ODEvent_Default<(renderer:ODCheckerRenderer_Default, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "afterCheckersRendered": ODEvent_Default<(renderer:ODCheckerRenderer_Default, checkers:ODCheckerManager_Default) => ODPromiseVoid>
    "onCheckerQuit": ODEvent_Default<(checkers:ODCheckerManager_Default) => ODPromiseVoid>

    //plugin loading before client
    "onPluginBeforeClientLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeClientLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //client configuration
    "onClientLoad": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "afterClientLoaded": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "onClientInit": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "afterClientInitiated": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "onClientReady": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "afterClientReady": ODEvent_Default<(client:ODClientManager_Default) => ODPromiseVoid>
    "onClientActivityLoad": ODEvent_Default<(activity:ODClientActivityManager, client:ODClientManager_Default) => ODPromiseVoid>
    "afterClientActivityLoaded": ODEvent_Default<(activity:ODClientActivityManager, client:ODClientManager_Default) => ODPromiseVoid>
    "onClientActivityInit": ODEvent_Default<(activity:ODClientActivityManager, client:ODClientManager_Default) => ODPromiseVoid>
    "afterClientActivityInitiated": ODEvent_Default<(activity:ODClientActivityManager, client:ODClientManager_Default) => ODPromiseVoid>
    
    //client slash commands
    "onSlashCommandLoad": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => ODPromiseVoid>
    "afterSlashCommandsLoaded": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => ODPromiseVoid>
    "onSlashCommandRegister": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => ODPromiseVoid>
    "afterSlashCommandsRegistered": ODEvent_Default<(slash:ODSlashCommandManager_Default, client:ODClientManager_Default) => ODPromiseVoid>

    //client text commands
    "onTextCommandLoad": ODEvent_Default<(text:ODTextCommandManager_Default, client:ODClientManager_Default,) => ODPromiseVoid>
    "afterTextCommandsLoaded": ODEvent_Default<(text:ODTextCommandManager_Default, client:ODClientManager_Default) => ODPromiseVoid>

    //plugin loading before managers
    "onPluginBeforeManagerLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeManagerLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //questions
    "onQuestionLoad": ODEvent_Default<(questions:ODQuestionManager) => ODPromiseVoid>
    "afterQuestionsLoaded": ODEvent_Default<(questions:ODQuestionManager) => ODPromiseVoid>

    //options
    "onOptionLoad": ODEvent_Default<(options:ODOptionManager) => ODPromiseVoid>
    "afterOptionsLoaded": ODEvent_Default<(options:ODOptionManager) => ODPromiseVoid>

    //panels
    "onPanelLoad": ODEvent_Default<(panels:ODPanelManager) => ODPromiseVoid>
    "afterPanelsLoaded": ODEvent_Default<(panels:ODPanelManager) => ODPromiseVoid>
    "onPanelSpawn": ODEvent_Default<(panel:ODPanel) => ODPromiseVoid>
    "afterPanelSpawned": ODEvent_Default<(panel:ODPanel) => ODPromiseVoid>

    //tickets
    "onTicketLoad": ODEvent_Default<(tickets:ODTicketManager) => ODPromiseVoid>
    "afterTicketsLoaded": ODEvent_Default<(tickets:ODTicketManager) => ODPromiseVoid>

    //ticket creation
    "onTicketChannelCreation": ODEvent_Default<(option:ODTicketOption, user:discord.User) => ODPromiseVoid>
    "afterTicketChannelCreated": ODEvent_Default<(option:ODTicketOption, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>
    "onTicketChannelDeletion": ODEvent_Default<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>
    "afterTicketChannelDeleted": ODEvent_Default<(ticket:ODTicket, user:discord.User) => ODPromiseVoid>
    "onTicketPermissionsCreated": ODEvent_Default<(option:ODTicketOption, permissions:ODPermissionManager_Default, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>
    "afterTicketPermissionsCreated": ODEvent_Default<(option:ODTicketOption, permissions:ODPermissionManager_Default, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>
    "onTicketMainMessageCreated": ODEvent_Default<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>
    "afterTicketMainMessageCreated": ODEvent_Default<(ticket:ODTicket, message:discord.Message, channel:discord.GuildTextBasedChannel, user:discord.User) => ODPromiseVoid>

    //ticket actions
    "onTicketCreate": ODEvent_Default<(creator:discord.User) => ODPromiseVoid>
    "afterTicketCreated": ODEvent_Default<(ticket:ODTicket, creator:discord.User, channel:discord.GuildTextBasedChannel) => ODPromiseVoid>
    "onTicketClose": ODEvent_Default<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketClosed": ODEvent_Default<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketReopen": ODEvent_Default<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketReopened": ODEvent_Default<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketDelete": ODEvent_Default<(ticket:ODTicket, deleter:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketDeleted": ODEvent_Default<(ticket:ODTicket, deleter:discord.User, reason:string|null) => ODPromiseVoid>
    "onTicketMove": ODEvent_Default<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketMoved": ODEvent_Default<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketClaim": ODEvent_Default<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketClaimed": ODEvent_Default<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketUnclaim": ODEvent_Default<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketUnclaimed": ODEvent_Default<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketPin": ODEvent_Default<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketPinned": ODEvent_Default<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketUnpin": ODEvent_Default<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketUnpinned": ODEvent_Default<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketUserAdd": ODEvent_Default<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketUserAdded": ODEvent_Default<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketUserRemove": ODEvent_Default<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketUserRemoved": ODEvent_Default<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketRename": ODEvent_Default<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "afterTicketRenamed": ODEvent_Default<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => ODPromiseVoid>
    "onTicketsClear": ODEvent_Default<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => ODPromiseVoid>
    "afterTicketsCleared": ODEvent_Default<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => ODPromiseVoid>

    //roles
    "onRoleLoad": ODEvent_Default<(roles:ODRoleManager) => ODPromiseVoid>
    "afterRolesLoaded": ODEvent_Default<(roles:ODRoleManager) => ODPromiseVoid>
    "onRoleUpdate": ODEvent_Default<(user:discord.User,role:ODRole) => ODPromiseVoid>
    "afterRolesUpdated": ODEvent_Default<(user:discord.User,role:ODRole) => ODPromiseVoid>

    //blacklist
    "onBlacklistLoad": ODEvent_Default<(blacklist:ODBlacklistManager) => ODPromiseVoid>
    "afterBlacklistLoaded": ODEvent_Default<(blacklist:ODBlacklistManager) => ODPromiseVoid>

    //transcripts
    "onTranscriptCompilerLoad": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => ODPromiseVoid>
    "afterTranscriptCompilersLoaded": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => ODPromiseVoid>
    "onTranscriptHistoryLoad": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => ODPromiseVoid>
    "afterTranscriptHistoryLoaded": ODEvent_Default<(transcripts:ODTranscriptManager_Default) => ODPromiseVoid>

    //transcript creation
    "onTranscriptCreate": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "afterTranscriptCreated": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "onTranscriptInit": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "afterTranscriptInitiated": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "onTranscriptCompile": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "afterTranscriptCompiled": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "onTranscriptReady": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>
    "afterTranscriptReady": ODEvent_Default<(transcripts:ODTranscriptManager_Default,ticket:ODTicket,channel:discord.TextChannel,user:discord.User) => ODPromiseVoid>

    //plugin loading before builders
    "onPluginBeforeBuilderLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeBuilderLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //builders
    "onButtonBuilderLoad": ODEvent_Default<(buttons:ODButtonManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterButtonBuildersLoaded": ODEvent_Default<(buttons:ODButtonManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onDropdownBuilderLoad": ODEvent_Default<(dropdowns:ODDropdownManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterDropdownBuildersLoaded": ODEvent_Default<(dropdowns:ODDropdownManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onFileBuilderLoad": ODEvent_Default<(files:ODFileManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterFileBuildersLoaded": ODEvent_Default<(files:ODFileManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onEmbedBuilderLoad": ODEvent_Default<(embeds:ODEmbedManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterEmbedBuildersLoaded": ODEvent_Default<(embeds:ODEmbedManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onMessageBuilderLoad": ODEvent_Default<(messages:ODMessageManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterMessageBuildersLoaded": ODEvent_Default<(messages:ODMessageManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onModalBuilderLoad": ODEvent_Default<(modals:ODModalManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterModalBuildersLoaded": ODEvent_Default<(modals:ODModalManager_Default, builders:ODBuilderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>

    //plugin loading before responders
    "onPluginBeforeResponderLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeResponderLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //responders
    "onCommandResponderLoad": ODEvent_Default<(commands:ODCommandResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterCommandRespondersLoaded": ODEvent_Default<(commands:ODCommandResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onButtonResponderLoad": ODEvent_Default<(buttons:ODButtonResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterButtonRespondersLoaded": ODEvent_Default<(buttons:ODButtonResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onDropdownResponderLoad": ODEvent_Default<(dropdowns:ODDropdownResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterDropdownRespondersLoaded": ODEvent_Default<(dropdowns:ODDropdownResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "onModalResponderLoad": ODEvent_Default<(modals:ODModalResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>
    "afterModalRespondersLoaded": ODEvent_Default<(modals:ODModalResponderManager_Default, responders:ODResponderManager_Default, actions:ODActionManager_Default) => ODPromiseVoid>

    //plugin loading before finalizations
    "onPluginBeforeFinalizationLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeFinalizationLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //actions
    "onActionLoad": ODEvent_Default<(actions:ODActionManager_Default) => ODPromiseVoid>
    "afterActionsLoaded": ODEvent_Default<(actions:ODActionManager_Default) => ODPromiseVoid>

    //verifybars
    "onVerifyBarLoad": ODEvent_Default<(verifybars:ODVerifyBarManager_Default) => ODPromiseVoid>
    "afterVerifyBarsLoaded": ODEvent_Default<(verifybars:ODVerifyBarManager_Default) => ODPromiseVoid>

    //permissions
    "onPermissionLoad": ODEvent_Default<(permissions:ODPermissionManager_Default) => ODPromiseVoid>
    "afterPermissionsLoaded": ODEvent_Default<(permissions:ODPermissionManager_Default) => ODPromiseVoid>

    //posts
    "onPostLoad": ODEvent_Default<(posts:ODPostManager_Default) => ODPromiseVoid>
    "afterPostsLoaded": ODEvent_Default<(posts:ODPostManager_Default) => ODPromiseVoid>
    "onPostInit": ODEvent_Default<(posts:ODPostManager_Default) => ODPromiseVoid>
    "afterPostsInitiated": ODEvent_Default<(posts:ODPostManager_Default) => ODPromiseVoid>

    //cooldowns
    "onCooldownLoad": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => ODPromiseVoid>
    "afterCooldownsLoaded": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => ODPromiseVoid>
    "onCooldownInit": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => ODPromiseVoid>
    "afterCooldownsInitiated": ODEvent_Default<(cooldowns:ODCooldownManager_Default) => ODPromiseVoid>

    //help menu
    "onHelpMenuCategoryLoad": ODEvent_Default<(menu:ODHelpMenuManager_Default) => ODPromiseVoid>
    "afterHelpMenuCategoriesLoaded": ODEvent_Default<(menu:ODHelpMenuManager_Default) => ODPromiseVoid>
    "onHelpMenuComponentLoad": ODEvent_Default<(menu:ODHelpMenuManager_Default) => ODPromiseVoid>
    "afterHelpMenuComponentsLoaded": ODEvent_Default<(menu:ODHelpMenuManager_Default) => ODPromiseVoid>

    //stats
    "onStatScopeLoad": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>
    "afterStatScopesLoaded": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>
    "onStatLoad": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>
    "afterStatsLoaded": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>
    "onStatInit": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>
    "afterStatsInitiated": ODEvent_Default<(stats:ODStatsManager_Default) => ODPromiseVoid>

    //plugin loading before code
    "onPluginBeforeCodeLoad": ODEvent_Default<() => ODPromiseVoid>,
    "afterPluginBeforeCodeLoaded": ODEvent_Default<() => ODPromiseVoid>,

    //code
    "onCodeLoad": ODEvent_Default<(code:ODCodeManager_Default) => ODPromiseVoid>
    "afterCodeLoaded": ODEvent_Default<(code:ODCodeManager_Default) => ODPromiseVoid>
    "onCodeExecute": ODEvent_Default<(code:ODCodeManager_Default) => ODPromiseVoid>
    "afterCodeExecuted": ODEvent_Default<(code:ODCodeManager_Default) => ODPromiseVoid>

    //livestatus
    "onLiveStatusSourceLoad": ODEvent_Default<(livestatus:ODLiveStatusManager_Default) => ODPromiseVoid>
    "afterLiveStatusSourcesLoaded": ODEvent_Default<(livestatus:ODLiveStatusManager_Default) => ODPromiseVoid>

    //startscreen
    "onStartScreenLoad": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => ODPromiseVoid>
    "afterStartScreensLoaded": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => ODPromiseVoid>
    "onStartScreenRender": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => ODPromiseVoid>
    "afterStartScreensRendered": ODEvent_Default<(startscreen:ODStartScreenManager_Default) => ODPromiseVoid>

    //ready
    "beforeReadyForUsage": ODEvent_Default<() => ODPromiseVoid>
    "onReadyForUsage": ODEvent_Default<() => ODPromiseVoid>
}

/**## ODEventManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEvent class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.events`!
 */
export class ODEventManager_Default extends ODEventManager {
    get<StartScreenId extends keyof ODEventIds_Default>(id:StartScreenId): ODEventIds_Default[StartScreenId]
    get(id:ODValidId): ODEvent|null
    
    get(id:ODValidId): ODEvent|null {
        return super.get(id)
    }

    remove<StartScreenId extends keyof ODEventIds_Default>(id:StartScreenId): ODEventIds_Default[StartScreenId]
    remove(id:ODValidId): ODEvent|null
    
    remove(id:ODValidId): ODEvent|null {
        return super.remove(id)
    }

    exists(id:keyof ODEventIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODEventManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEvent class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.events`!
 */
export class ODEvent_Default<Callback extends ((...args:any) => ODPromiseVoid)> extends ODEvent {
    listen(callback:Callback): void {
        return super.listen(callback)
    }
    listenOnce(callback:Callback): void {
        return super.listenOnce(callback)
    }
    wait(): Promise<Parameters<Callback>>
    wait(): Promise<any[]> {
        return super.wait()
    }
    emit(params:Parameters<Callback>): Promise<void> {
        return super.emit(params)
    }
}