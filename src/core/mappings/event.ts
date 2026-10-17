///////////////////////////////////////
//OPEN TICKET EVENT MAPPINGS
///////////////////////////////////////

//BASE MAPPINGSS
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"

//OPEN TICKET MAPPINGS
import { ODMappedPluginClassManager, ODMappedPluginManager } from "./plugin.js"
import { ODMappedConfigManager } from "./config.js"
import { ODMappedDatabaseManager } from "./database.js"
import { ODMappedFlagManager } from "./flag.js"
import { ODMappedSessionManager } from "./session.js"
import { ODMappedLanguageManager } from "./language.js"
import { ODMappedCheckerFunctionManager, ODMappedCheckerManager, ODMappedCheckerTranslationRegister } from "./checker.js"
import { ODMappedClientManager, ODMappedContextMenuManager, ODMappedSlashCommandManager, ODMappedTextCommandManager } from "./client.js"
import { ODMappedBuilderManager, ODMappedButtonManager, ODMappedDropdownManager, ODMappedEmbedManager, ODMappedFileManager, ODMappedMessageManager, ODMappedModalManager } from "./builder.js"
import { ODMappedAutocompleteResponderManager, ODMappedButtonResponderManager, ODMappedCommandResponderManager, ODMappedContextMenuResponderManager, ODMappedDropdownResponderManager, ODMappedModalResponderManager, ODMappedResponderManager } from "./responder.js"
import { ODMappedActionManager } from "./action.js"
import { ODMappedPermissionManager } from "./permission.js"
import { ODMappedHelpMenuManager } from "./helpmenu.js"
import { ODMappedStatisticManager } from "./statistic.js"
import { ODMappedTaskManager } from "./task.js"
import { ODMappedCooldownManager } from "./cooldown.js"
import { ODMappedPostManager } from "./post.js"
import { ODMappedVerifyBarManager } from "./verifybar.js"
import { ODMappedStartScreenManager } from "./startscreen.js"
import { ODMappedLiveStatusManager } from "./console.js"
import { ODMappedProgressBarManager, ODMappedProgressBarRendererManager } from "./progressbar.js"
import { ODMappedComponentManager, ODMappedComponentModifierManager, ODMappedMessageComponentManager, ODMappedModalComponentManager, ODMappedSharedComponentManager } from "./component.js"
import { ODMappedStateManager } from "./state.js"

//OPEN TICKET MAPPINGSS
import { ODOptionManager, ODTicketOption } from "../api/option.js"
import { ODPanel, ODPanelManager } from "../api/panel.js"
import { ODTicket, ODTicketClearFilter, ODTicketManager } from "../api/ticket.js"
import { ODQuestionManager } from "../api/question.js"
import { ODBlacklistManager } from "../api/blacklist.js"
import { ODMappedTranscriptManager } from "../api/transcript.js"
import { ODRole, ODRoleManager } from "../api/role.js"
import { ODMappedPriorityManager, ODPriorityLevel } from "../api/priority.js"

/**## ODEventManagerIdMappings `interface`
 * A list of all available IDs in the default `ODEventManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODEventManagerIdMappings extends api.ODEventManagerIdConstraint {
    //error handling
    "onErrorHandling":api.ODEvent<(error:Error, origin:NodeJS.UncaughtExceptionOrigin) => api.ODPromiseVoid>
    "afterErrorHandling":api.ODEvent<(error:Error, origin:NodeJS.UncaughtExceptionOrigin, message:api.ODError) => api.ODPromiseVoid>

    //plugins
    "afterPluginsLoaded":api.ODEvent<(plugins:ODMappedPluginManager) => api.ODPromiseVoid>
    "onPluginClassLoad":api.ODEvent<(classes:ODMappedPluginClassManager, plugins:ODMappedPluginManager) => api.ODPromiseVoid>
    "afterPluginClassesLoaded":api.ODEvent<(classes:ODMappedPluginClassManager, plugins:ODMappedPluginManager) => api.ODPromiseVoid>

    //flags
    "onFlagLoad":api.ODEvent<(flags:ODMappedFlagManager) => api.ODPromiseVoid>
    "afterFlagsLoaded":api.ODEvent<(flags:ODMappedFlagManager) => api.ODPromiseVoid>
    "onFlagInit":api.ODEvent<(flags:ODMappedFlagManager) => api.ODPromiseVoid>
    "afterFlagsInitiated":api.ODEvent<(flags:ODMappedFlagManager) => api.ODPromiseVoid>

    //progress bars
    "onProgressBarRendererLoad":api.ODEvent<(renderers:ODMappedProgressBarRendererManager) => api.ODPromiseVoid>
    "afterProgressBarRenderersLoaded":api.ODEvent<(renderers:ODMappedProgressBarRendererManager) => api.ODPromiseVoid>
    "onProgressBarLoad":api.ODEvent<(progressbars:ODMappedProgressBarManager) => api.ODPromiseVoid>
    "afterProgressBarsLoaded":api.ODEvent<(progressbars:ODMappedProgressBarManager) => api.ODPromiseVoid>

    //configs
    "onConfigLoad":api.ODEvent<(configs:ODMappedConfigManager) => api.ODPromiseVoid>
    "afterConfigsLoaded":api.ODEvent<(configs:ODMappedConfigManager) => api.ODPromiseVoid>
    "onConfigInit":api.ODEvent<(configs:ODMappedConfigManager) => api.ODPromiseVoid>
    "afterConfigsInitiated":api.ODEvent<(configs:ODMappedConfigManager) => api.ODPromiseVoid>

    //databases
    "onDatabaseLoad":api.ODEvent<(databases:ODMappedDatabaseManager) => api.ODPromiseVoid>
    "afterDatabasesLoaded":api.ODEvent<(databases:ODMappedDatabaseManager) => api.ODPromiseVoid>
    "onDatabaseInit":api.ODEvent<(databases:ODMappedDatabaseManager) => api.ODPromiseVoid>
    "afterDatabasesInitiated":api.ODEvent<(databases:ODMappedDatabaseManager) => api.ODPromiseVoid>

    //languages
    "onLanguageLoad":api.ODEvent<(languages:ODMappedLanguageManager) => api.ODPromiseVoid>
    "afterLanguagesLoaded":api.ODEvent<(languages:ODMappedLanguageManager) => api.ODPromiseVoid>
    "onLanguageInit":api.ODEvent<(languages:ODMappedLanguageManager) => api.ODPromiseVoid>
    "afterLanguagesInitiated":api.ODEvent<(languages:ODMappedLanguageManager) => api.ODPromiseVoid>
    "onLanguageSelect":api.ODEvent<(languages:ODMappedLanguageManager) => api.ODPromiseVoid>
    "afterLanguagesSelected":api.ODEvent<(main:api.ODLanguage|null, backup:api.ODLanguage|null, languages:ODMappedLanguageManager) => api.ODPromiseVoid>

    //sessions
    "onSessionLoad":api.ODEvent<(languages:ODMappedSessionManager) => api.ODPromiseVoid>
    "afterSessionsLoaded":api.ODEvent<(languages:ODMappedSessionManager) => api.ODPromiseVoid>

    //config checkers
    "onCheckerLoad":api.ODEvent<(checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "afterCheckersLoaded":api.ODEvent<(checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "onCheckerFunctionLoad":api.ODEvent<(functions:ODMappedCheckerFunctionManager, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "afterCheckerFunctionsLoaded":api.ODEvent<(functions:ODMappedCheckerFunctionManager, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "onCheckerExecute":api.ODEvent<(checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "afterCheckersExecuted":api.ODEvent<(result:api.ODCheckerResult, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "onCheckerTranslationLoad":api.ODEvent<(translations:ODMappedCheckerTranslationRegister, enabled:boolean, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "afterCheckerTranslationsLoaded":api.ODEvent<(translations:ODMappedCheckerTranslationRegister, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "onCheckerRender":api.ODEvent<(renderer:api.ODCheckerRenderer, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "afterCheckersRendered":api.ODEvent<(renderer:api.ODCheckerRenderer, checkers:ODMappedCheckerManager) => api.ODPromiseVoid>
    "onCheckerQuit":api.ODEvent<(checkers:ODMappedCheckerManager) => api.ODPromiseVoid>

    //plugin loading before client
    "onPluginBeforeClientLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeClientLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //client configuration
    "onClientLoad":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterClientLoaded":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "onClientInit":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterClientInitiated":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "onClientReady":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterClientReady":api.ODEvent<(client:ODMappedClientManager) => api.ODPromiseVoid>
    "onClientActivityLoad":api.ODEvent<(activity:api.ODClientActivityManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterClientActivityLoaded":api.ODEvent<(activity:api.ODClientActivityManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "onClientActivityInit":api.ODEvent<(activity:api.ODClientActivityManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterClientActivityInitiated":api.ODEvent<(activity:api.ODClientActivityManager, client:ODMappedClientManager) => api.ODPromiseVoid>

    //priority levels
    "onPriorityLoad":api.ODEvent<(priorities:ODMappedPriorityManager) => api.ODPromiseVoid>
    "afterPrioritiesLoaded":api.ODEvent<(priorities:ODMappedPriorityManager) => api.ODPromiseVoid>

    //client slash commands
    "onSlashCommandLoad":api.ODEvent<(slash:ODMappedSlashCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterSlashCommandsLoaded":api.ODEvent<(slash:ODMappedSlashCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "onSlashCommandRegister":api.ODEvent<(slash:ODMappedSlashCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterSlashCommandsRegistered":api.ODEvent<(slash:ODMappedSlashCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>

    //client context menus
    "onContextMenuLoad":api.ODEvent<(menu:ODMappedContextMenuManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterContextMenusLoaded":api.ODEvent<(menu:ODMappedContextMenuManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "onContextMenuRegister":api.ODEvent<(menu:ODMappedContextMenuManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterContextMenusRegistered":api.ODEvent<(menu:ODMappedContextMenuManager, client:ODMappedClientManager) => api.ODPromiseVoid>

    //client text commands
    "onTextCommandLoad":api.ODEvent<(text:ODMappedTextCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>
    "afterTextCommandsLoaded":api.ODEvent<(text:ODMappedTextCommandManager, client:ODMappedClientManager) => api.ODPromiseVoid>

    //states
    "onStateLoad":api.ODEvent<(states:ODMappedStateManager) => api.ODPromiseVoid>
    "afterStatesLoaded":api.ODEvent<(states:ODMappedStateManager) => api.ODPromiseVoid>
    "onStateInit":api.ODEvent<(states:ODMappedStateManager) => api.ODPromiseVoid>
    "afterStatesInitiated":api.ODEvent<(states:ODMappedStateManager) => api.ODPromiseVoid>

    //plugin loading before managers
    "onPluginBeforeManagerLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeManagerLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //questions
    "onQuestionLoad":api.ODEvent<(questions:ODQuestionManager) => api.ODPromiseVoid>
    "afterQuestionsLoaded":api.ODEvent<(questions:ODQuestionManager) => api.ODPromiseVoid>

    //options
    "onOptionLoad":api.ODEvent<(options:ODOptionManager) => api.ODPromiseVoid>
    "afterOptionsLoaded":api.ODEvent<(options:ODOptionManager) => api.ODPromiseVoid>

    //panels
    "onPanelLoad":api.ODEvent<(panels:ODPanelManager) => api.ODPromiseVoid>
    "afterPanelsLoaded":api.ODEvent<(panels:ODPanelManager) => api.ODPromiseVoid>
    "onPanelSpawn":api.ODEvent<(panel:ODPanel) => api.ODPromiseVoid>
    "afterPanelSpawned":api.ODEvent<(panel:ODPanel) => api.ODPromiseVoid>

    //tickets
    "onTicketLoad":api.ODEvent<(tickets:ODTicketManager) => api.ODPromiseVoid>
    "afterTicketsLoaded":api.ODEvent<(tickets:ODTicketManager) => api.ODPromiseVoid>

    //ticket creation
    "onTicketChannelCreation":api.ODEvent<(option:ODTicketOption, user:discord.User) => api.ODPromiseVoid>
    "afterTicketChannelCreated":api.ODEvent<(option:ODTicketOption, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "onTicketChannelDeletion":api.ODEvent<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketChannelDeleted":api.ODEvent<(ticket:ODTicket, user:discord.User) => api.ODPromiseVoid>
    "onTicketPermissionsCreated":api.ODEvent<(option:ODTicketOption, permissions:ODMappedPermissionManager, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketPermissionsCreated":api.ODEvent<(option:ODTicketOption, permissions:ODMappedPermissionManager, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "onTicketMainMessageCreated":api.ODEvent<(ticket:ODTicket, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTicketMainMessageCreated":api.ODEvent<(ticket:ODTicket, message:discord.Message, channel:discord.GuildTextBasedChannel, user:discord.User) => api.ODPromiseVoid>

    //ticket actions
    "onTicketCreate":api.ODEvent<(creator:discord.User) => api.ODPromiseVoid>
    "afterTicketCreated":api.ODEvent<(ticket:ODTicket, creator:discord.User, channel:discord.GuildTextBasedChannel) => api.ODPromiseVoid>
    "onTicketClose":api.ODEvent<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketClosed":api.ODEvent<(ticket:ODTicket, closer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketReopen":api.ODEvent<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketReopened":api.ODEvent<(ticket:ODTicket, reopener:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketDelete":api.ODEvent<(ticket:ODTicket, deleter:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketDeleted":api.ODEvent<(ticket:ODTicket, deleter:discord.User, reason:string|null) => api.ODPromiseVoid>
    "onTicketMove":api.ODEvent<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketMoved":api.ODEvent<(ticket:ODTicket, mover:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketClaim":api.ODEvent<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketClaimed":api.ODEvent<(ticket:ODTicket, claimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUnclaim":api.ODEvent<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUnclaimed":api.ODEvent<(ticket:ODTicket, unclaimer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketPin":api.ODEvent<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketPinned":api.ODEvent<(ticket:ODTicket, pinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUnpin":api.ODEvent<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUnpinned":api.ODEvent<(ticket:ODTicket, unpinner:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUserAdd":api.ODEvent<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUserAdded":api.ODEvent<(ticket:ODTicket, adder:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketUserRemove":api.ODEvent<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketUserRemoved":api.ODEvent<(ticket:ODTicket, remover:discord.User, user:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketRename":api.ODEvent<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketRenamed":api.ODEvent<(ticket:ODTicket, renamer:discord.User, channel:discord.GuildTextBasedChannel, reason:string|null) => api.ODPromiseVoid>
    "onTicketsClear":api.ODEvent<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => api.ODPromiseVoid>
    "afterTicketsCleared":api.ODEvent<(tickets:ODTicket[], clearer:discord.User, channel:discord.GuildTextBasedChannel, filter:ODTicketClearFilter) => api.ODPromiseVoid>
    "onTicketTopicChange":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldTopic:string, newTopic:string) => api.ODPromiseVoid>
    "afterTicketTopicChanged":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldTopic:string, newTopic:string) => api.ODPromiseVoid>
    "onTicketPriorityChange":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldPriority:ODPriorityLevel, newPriority:ODPriorityLevel, reason:string|null) => api.ODPromiseVoid>
    "afterTicketPriorityChanged":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldPriority:ODPriorityLevel, newPriority:ODPriorityLevel, reason:string|null) => api.ODPromiseVoid>
    "onTicketTransfer":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldCreator:discord.User, newCreator:discord.User, reason:string|null) => api.ODPromiseVoid>
    "afterTicketTransferred":api.ODEvent<(ticket:ODTicket, changer:discord.User, channel:discord.GuildTextBasedChannel, oldCreator:discord.User, newCreator:discord.User, reason:string|null) => api.ODPromiseVoid>

    //roles
    "onRoleLoad":api.ODEvent<(roles:ODRoleManager) => api.ODPromiseVoid>
    "afterRolesLoaded":api.ODEvent<(roles:ODRoleManager) => api.ODPromiseVoid>
    "onRoleUpdate":api.ODEvent<(user:discord.User, role:ODRole) => api.ODPromiseVoid>
    "afterRolesUpdated":api.ODEvent<(user:discord.User, role:ODRole) => api.ODPromiseVoid>

    //blacklist
    "onBlacklistLoad":api.ODEvent<(blacklist:ODBlacklistManager) => api.ODPromiseVoid>
    "afterBlacklistLoaded":api.ODEvent<(blacklist:ODBlacklistManager) => api.ODPromiseVoid>

    //transcripts
    "onTranscriptCompilerLoad":api.ODEvent<(transcripts:ODMappedTranscriptManager) => api.ODPromiseVoid>
    "afterTranscriptCompilersLoaded":api.ODEvent<(transcripts:ODMappedTranscriptManager) => api.ODPromiseVoid>
    "onTranscriptHistoryLoad":api.ODEvent<(transcripts:ODMappedTranscriptManager) => api.ODPromiseVoid>
    "afterTranscriptHistoryLoaded":api.ODEvent<(transcripts:ODMappedTranscriptManager) => api.ODPromiseVoid>

    //transcript creation
    "onTranscriptCreate":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptCreated":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "onTranscriptInit":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptInitiated":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "onTranscriptCompile":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptCompiled":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "onTranscriptReady":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>
    "afterTranscriptReady":api.ODEvent<(transcripts:ODMappedTranscriptManager, ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => api.ODPromiseVoid>

    //plugin loading before builders
    "onPluginBeforeBuilderLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeBuilderLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //builders
    "onButtonBuilderLoad":api.ODEvent<(buttons:ODMappedButtonManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterButtonBuildersLoaded":api.ODEvent<(buttons:ODMappedButtonManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onDropdownBuilderLoad":api.ODEvent<(dropdowns:ODMappedDropdownManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterDropdownBuildersLoaded":api.ODEvent<(dropdowns:ODMappedDropdownManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onFileBuilderLoad":api.ODEvent<(files:ODMappedFileManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterFileBuildersLoaded":api.ODEvent<(files:ODMappedFileManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onEmbedBuilderLoad":api.ODEvent<(embeds:ODMappedEmbedManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterEmbedBuildersLoaded":api.ODEvent<(embeds:ODMappedEmbedManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onMessageBuilderLoad":api.ODEvent<(messages:ODMappedMessageManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterMessageBuildersLoaded":api.ODEvent<(messages:ODMappedMessageManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onModalBuilderLoad":api.ODEvent<(modals:ODMappedModalManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterModalBuildersLoaded":api.ODEvent<(modals:ODMappedModalManager, builders:ODMappedBuilderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>

    //components
    "onSharedComponentLoad":api.ODEvent<(shared:ODMappedSharedComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterSharedComponentsLoaded":api.ODEvent<(shared:ODMappedSharedComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onMessageComponentLoad":api.ODEvent<(shared:ODMappedMessageComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterMessageComponentsLoaded":api.ODEvent<(shared:ODMappedMessageComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onModalComponentLoad":api.ODEvent<(shared:ODMappedModalComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterModalComponentsLoaded":api.ODEvent<(shared:ODMappedModalComponentManager, components:ODMappedComponentManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onComponentModifierLoad":api.ODEvent<(modifiers:ODMappedComponentModifierManager, msgComponents:ODMappedMessageComponentManager, msgBuilders:ODMappedMessageManager) => api.ODPromiseVoid>
    "afterComponentModifiersLoaded":api.ODEvent<(modifiers:ODMappedComponentModifierManager, msgComponents:ODMappedMessageComponentManager, msgBuilders:ODMappedMessageManager) => api.ODPromiseVoid>

    //plugin loading before responders
    "onPluginBeforeResponderLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeResponderLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //responders
    "onCommandResponderLoad":api.ODEvent<(commands:ODMappedCommandResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterCommandRespondersLoaded":api.ODEvent<(commands:ODMappedCommandResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onButtonResponderLoad":api.ODEvent<(buttons:ODMappedButtonResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterButtonRespondersLoaded":api.ODEvent<(buttons:ODMappedButtonResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onDropdownResponderLoad":api.ODEvent<(dropdowns:ODMappedDropdownResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterDropdownRespondersLoaded":api.ODEvent<(dropdowns:ODMappedDropdownResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onModalResponderLoad":api.ODEvent<(modals:ODMappedModalResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterModalRespondersLoaded":api.ODEvent<(modals:ODMappedModalResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onContextMenuResponderLoad":api.ODEvent<(menus:ODMappedContextMenuResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterContextMenuRespondersLoaded":api.ODEvent<(menus:ODMappedContextMenuResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "onAutocompleteResponderLoad":api.ODEvent<(autocomplete:ODMappedAutocompleteResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterAutocompleteRespondersLoaded":api.ODEvent<(autocomplete:ODMappedAutocompleteResponderManager, responders:ODMappedResponderManager, actions:ODMappedActionManager) => api.ODPromiseVoid>

    //plugin loading before finalizations
    "onPluginBeforeFinalizationLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeFinalizationLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //actions
    "onActionLoad":api.ODEvent<(actions:ODMappedActionManager) => api.ODPromiseVoid>
    "afterActionsLoaded":api.ODEvent<(actions:ODMappedActionManager) => api.ODPromiseVoid>

    //verifybars
    "onVerifyBarLoad":api.ODEvent<(verifybars:ODMappedVerifyBarManager) => api.ODPromiseVoid>
    "afterVerifyBarsLoaded":api.ODEvent<(verifybars:ODMappedVerifyBarManager) => api.ODPromiseVoid>

    //permissions
    "onPermissionLoad":api.ODEvent<(permissions:ODMappedPermissionManager) => api.ODPromiseVoid>
    "afterPermissionsLoaded":api.ODEvent<(permissions:ODMappedPermissionManager) => api.ODPromiseVoid>

    //posts
    "onPostLoad":api.ODEvent<(posts:ODMappedPostManager) => api.ODPromiseVoid>
    "afterPostsLoaded":api.ODEvent<(posts:ODMappedPostManager) => api.ODPromiseVoid>
    "onPostInit":api.ODEvent<(posts:ODMappedPostManager) => api.ODPromiseVoid>
    "afterPostsInitiated":api.ODEvent<(posts:ODMappedPostManager) => api.ODPromiseVoid>

    //cooldowns
    "onCooldownLoad":api.ODEvent<(cooldowns:ODMappedCooldownManager) => api.ODPromiseVoid>
    "afterCooldownsLoaded":api.ODEvent<(cooldowns:ODMappedCooldownManager) => api.ODPromiseVoid>
    "onCooldownInit":api.ODEvent<(cooldowns:ODMappedCooldownManager) => api.ODPromiseVoid>
    "afterCooldownsInitiated":api.ODEvent<(cooldowns:ODMappedCooldownManager) => api.ODPromiseVoid>

    //help menu
    "onHelpMenuCategoryLoad":api.ODEvent<(menu:ODMappedHelpMenuManager) => api.ODPromiseVoid>
    "afterHelpMenuCategoriesLoaded":api.ODEvent<(menu:ODMappedHelpMenuManager) => api.ODPromiseVoid>
    "onHelpMenuComponentLoad":api.ODEvent<(menu:ODMappedHelpMenuManager) => api.ODPromiseVoid>
    "afterHelpMenuComponentsLoaded":api.ODEvent<(menu:ODMappedHelpMenuManager) => api.ODPromiseVoid>

    //stats
    "onStatisticScopeLoad":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>
    "afterStatisticScopesLoaded":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>
    "onStatisticLoad":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>
    "afterStatisticsLoaded":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>
    "onStatisticInit":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>
    "afterStatisticsInitiated":api.ODEvent<(stats:ODMappedStatisticManager) => api.ODPromiseVoid>

    //plugin loading before tasks
    "onPluginBeforeTaskLoad":api.ODEvent<() => api.ODPromiseVoid>,
    "afterPluginBeforeTaskLoaded":api.ODEvent<() => api.ODPromiseVoid>,

    //background tasks
    "onTaskLoad":api.ODEvent<(tasks:ODMappedTaskManager) => api.ODPromiseVoid>
    "afterTasksLoaded":api.ODEvent<(tasks:ODMappedTaskManager) => api.ODPromiseVoid>
    "onTaskExecute":api.ODEvent<(tasks:ODMappedTaskManager) => api.ODPromiseVoid>
    "afterTasksExecuted":api.ODEvent<(tasks:ODMappedTaskManager) => api.ODPromiseVoid>

    //livestatus
    "onLiveStatusSourceLoad":api.ODEvent<(livestatus:ODMappedLiveStatusManager) => api.ODPromiseVoid>
    "afterLiveStatusSourcesLoaded":api.ODEvent<(livestatus:ODMappedLiveStatusManager) => api.ODPromiseVoid>

    //startscreen
    "onStartScreenLoad":api.ODEvent<(startscreen:ODMappedStartScreenManager) => api.ODPromiseVoid>
    "afterStartScreensLoaded":api.ODEvent<(startscreen:ODMappedStartScreenManager) => api.ODPromiseVoid>
    "onStartScreenRender":api.ODEvent<(startscreen:ODMappedStartScreenManager) => api.ODPromiseVoid>
    "afterStartScreensRendered":api.ODEvent<(startscreen:ODMappedStartScreenManager) => api.ODPromiseVoid>

    //ready
    "beforeReadyForUsage":api.ODEvent<() => api.ODPromiseVoid>
    "onReadyForUsage":api.ODEvent<() => api.ODPromiseVoid>
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedEventManager `class
 * A special class with types for the Open Ticket `ODEventManager` class.
 */
export class ODMappedEventManager extends api.ODEventManager<ODEventManagerIdMappings> {}