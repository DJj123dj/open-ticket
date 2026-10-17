///////////////////////////////////////
//OPEN TICKET CONFIG MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"
import { ODRoleUpdateMode } from "../api/role.js"

/**## ODConfigManagerIdMappings `interface`
 * A list of all available IDs in the default `ODConfigManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODConfigManagerIdMappings extends api.ODConfigManagerIdConstraint {
    "opendiscord:general":ODGeneralJsonCommentsConfig,
    "opendiscord:questions":ODQuestionsJsonCommentsConfig,
    "opendiscord:options":ODOptionsJsonCommentsConfig,
    "opendiscord:panels":ODPanelsJsonCommentsConfig,
    "opendiscord:transcripts":ODTranscriptsJsonCommentsConfig
}

///////////////////////////////////////
//CONFIG STRUCTURES, VALUES & TYPES
//--> general.jsonc
///////////////////////////////////////

/**## ODGeneralJsonConfig_Status `interface`
 * This interface is an object which has all properties for the status object in the `general.jsonc` config!
 */
export interface ODGeneralJsonConfig_Status {
    /**Is the status enabled? */
    enabled:boolean,
    /**The type of status (e.g. playing, listening, custom, ...) */
    type:Exclude<api.ODClientActivityType, false>,
    /**The mode/status of the bot (e.g. online, invisible, idle, do not disturb) */
    mode:api.ODClientActivityMode
    /**The text for the status. */
    text:string,
    /**Additional text for the status. (visible below 'text') */
    state:string,
}

/**## ODGeneralJsonConfig_MessageSettings `interface`
 * This interface is an object which has all properties for the "system"."messages".... object in the `general.jsonc` config!
 */
export interface ODGeneralJsonConfig_MessageSettings {
    /**Enable sending DM logs to the ticket creator for this action. */
    dm:boolean,
    /**Enable sending logsto the log channel for this action. */
    logs:boolean
}

/**## ODGeneralJsonConfig_CmdPermissionSettingsType `type`
 * This type is a collection of command permission settings for the "system"."permissions".... object in the `general.jsonc` config!
 */
export type ODGeneralJsonConfig_CmdPermissionSettingsType = "admin"|"everyone"|"none"|string

/**## ODGeneralJsonConfig_SystemLogs `interface`
 * All settings related to the log channel.
 */
export interface ODGeneralJsonConfig_SystemLogs {
    /**Enable logging. Individual actions should still be added via the `"system"."messages"..."logs"` */
    enabled:boolean,
    /**The channel to send logs to. */
    channel:string,
    /**Configure dm & log messages for all Open Ticket commands & actions. */
    logMessages:ODGeneralJsonConfig_LogMessages
}

/**## ODGeneralJsonConfig_SystemLimits `interface`
 * All settings related to global ticket limits.
 */
export interface ODGeneralJsonConfig_SystemLimits {
    /**Enable global ticket limits. */
    enabled:boolean,
    /**The maximum amount of tickets that are allowed in the server at the same time. */
    globalMaximum:number,
    /**The maximum amount of tickets that a user is allowed to create at the same time. */
    userMaximum:number
}

/**## ODGeneralJsonConfig_SystemChannelTopic `interface`
 * All global channel topic settings.
 */
export interface ODGeneralJsonConfig_SystemChannelTopic {
    /**Show the option name in the channel topic. */
    showOptionName:boolean,
    /**Show the option description in the channel topic. */
    showOptionDescription:boolean,
    /**Show the option topic text in the channel topic (configured in the options config). */
    showOptionTopic:boolean,
    /**Show the current priority in the channel topic (auto-updated). */
    showPriority:boolean,
    /**Show the current close/reopen status in the channel topic (auto-updated). */
    showClosed:boolean,
    /**Show the current claim status in the channel topic (auto-updated). */
    showClaimed:boolean,
    /**Show the current pin status in the channel topic (auto-updated). */
    showPinned:boolean,
    /**Show the creator of the ticket in the channel topic (auto-updated on transfer). */
    showCreator:boolean,
    /**Show the first 5 participants of the ticket in the channel topic (auto-updated). */
    showParticipants:boolean
}

/**## ODGeneralJsonConfig_SystemPermissions `interface`
 * Configure permissions for all Open Ticket commands & actions.
 */
export interface ODGeneralJsonConfig_SystemPermissions {
    help:ODGeneralJsonConfig_CmdPermissionSettingsType,
    panel:ODGeneralJsonConfig_CmdPermissionSettingsType,
    ticket:ODGeneralJsonConfig_CmdPermissionSettingsType,
    close:ODGeneralJsonConfig_CmdPermissionSettingsType,
    delete:ODGeneralJsonConfig_CmdPermissionSettingsType,
    reopen:ODGeneralJsonConfig_CmdPermissionSettingsType,
    claim:ODGeneralJsonConfig_CmdPermissionSettingsType,
    unclaim:ODGeneralJsonConfig_CmdPermissionSettingsType,
    pin:ODGeneralJsonConfig_CmdPermissionSettingsType,
    unpin:ODGeneralJsonConfig_CmdPermissionSettingsType,
    move:ODGeneralJsonConfig_CmdPermissionSettingsType,
    rename:ODGeneralJsonConfig_CmdPermissionSettingsType,
    add:ODGeneralJsonConfig_CmdPermissionSettingsType,
    remove:ODGeneralJsonConfig_CmdPermissionSettingsType,
    blacklist:ODGeneralJsonConfig_CmdPermissionSettingsType,
    stats:ODGeneralJsonConfig_CmdPermissionSettingsType,
    clear:ODGeneralJsonConfig_CmdPermissionSettingsType,
    autoclose:ODGeneralJsonConfig_CmdPermissionSettingsType,
    autodelete:ODGeneralJsonConfig_CmdPermissionSettingsType,
    transfer:ODGeneralJsonConfig_CmdPermissionSettingsType,
    topic:ODGeneralJsonConfig_CmdPermissionSettingsType,
    priority:ODGeneralJsonConfig_CmdPermissionSettingsType,
    transcripts:ODGeneralJsonConfig_CmdPermissionSettingsType,
}

/**## ODGeneralJsonConfig_LogMessages `interface`
 * Configure dm & log messages for all Open Ticket commands & actions.
 */
export interface ODGeneralJsonConfig_LogMessages {
    creation:ODGeneralJsonConfig_MessageSettings,
    closing:ODGeneralJsonConfig_MessageSettings,
    deleting:ODGeneralJsonConfig_MessageSettings,
    reopening:ODGeneralJsonConfig_MessageSettings,
    claiming:ODGeneralJsonConfig_MessageSettings,
    pinning:ODGeneralJsonConfig_MessageSettings,
    adding:ODGeneralJsonConfig_MessageSettings,
    removing:ODGeneralJsonConfig_MessageSettings,
    renaming:ODGeneralJsonConfig_MessageSettings,
    moving:ODGeneralJsonConfig_MessageSettings,
    blacklisting:ODGeneralJsonConfig_MessageSettings,
    transferring:ODGeneralJsonConfig_MessageSettings,
    topicChange:ODGeneralJsonConfig_MessageSettings,
    priorityChange:ODGeneralJsonConfig_MessageSettings,
    reactionRole:ODGeneralJsonConfig_MessageSettings,
}

/**## ODGeneralJsonConfig_TicketSystem `interface`
 * All settings related to the ticket system.
 */
export interface ODGeneralJsonConfig_TicketSystem {
    /**Prefer slash-commands over text-commands when displaying them in menu's and messages. */
    preferSlashOverText:boolean,
    /**Reply with "unknown command" when the prefix is used without a valid command. */
    sendErrorOnUnknownCommand:boolean,
    /**Display the question fields (in a ticket message) in code blocks. */
    questionFieldsInCodeBlock:boolean,
    /**Display embed fields together with question fields (in a ticket message). */
    displayFieldsWithQuestions:boolean,
    /**Show global admins roles together with ticket admins in panel embeds. */
    showGlobalAdminsInPanelRoles:boolean,
    /**Disable the (✅❌) buttons and directly run the action. */
    disableVerifyBars:boolean,
    /**Display error embeds/messages with red instead of the default bot color. */
    useRedErrorEmbeds:boolean,
    /**Always show the reason field in embeds, even when there is no reason provided. */
    alwaysShowReason:boolean,
    /**The emoji style used in the bot. This will affect all embeds, titles & messages in the bot. */
    emojiStyle:"before"|"after"|"double"|"disabled",
    /**The emoji used when pinning tickets. This is '📌' by default. */
    pinEmoji:string,
    /**The emoji used when closing tickets. This is '🔒' by default. */
    closeEmoji:string,

    /**Reply with an ephemeral message when a ticket is created. */
    replyOnTicketCreation:boolean,
    /**Reply with an ephemeral message when reaction roles are changed. */
    replyOnReactionRole:boolean,
    /**Ask for the priority of this ticket on ticket creation. This will happen in a dropdown in the ticket message. */
    askPriorityOnTicketCreation:boolean,
    /**Remove all participants (except admins) from the ticket when it's closed. */
    removeParticipantsOnClose:boolean,
    /**Disable autoclose for a ticket when it has been closed and re-opened. */
    disableAutocloseAfterReopen:boolean,
    /**Only allow autodelete when the ticket is already closed. */
    autodeleteRequiresClosedTicket:boolean,
    /**When enabled, only global admins are able to delete a ticket without transcript. */
    adminOnlyDeleteWithoutTranscript:boolean,
    /**Only allow ticket closing when at least 1 message has been sent by the creator. (admins are able to bypass) */
    allowCloseBeforeMessage:boolean,
    /**Only allow ticket closing when at least 1 message has been sent by a global or ticket admin. (admins are able to bypass) */
    allowCloseBeforeAdminMessage:boolean,
    /**Use a translated config checker in the console. */
    useTranslatedConfigChecker:boolean,
    /**Pin the (first) ticket message in the channel. This simulates old behaviour like Open Ticket v1, v2 & v3. */
    pinFirstTicketMessage:boolean,

    /**Enable/disable the ticket claim & unclaim button in the ticket message. */
    enableTicketClaimButtons:boolean,
    /**Enable/disable the ticket close & re-open button in the ticket message. */
    enableTicketCloseButtons:boolean,
    /**Enable/disable the ticket pin & unpin button in the ticket message. */
    enableTicketPinButtons:boolean,
    /**Enable/disable the ticket delete button in the ticket message. */
    enableTicketDeleteButtons:boolean,
    /**Enable/disable the "with reason" button for all actions in the ticket message. */
    enableTicketActionWithReason:boolean,
    /**Enable/disable the delete without transcript feature (button & /delete command). */
    enableDeleteWithoutTranscript:boolean,
    /**Enable/disable creating tickets for other users with /ticket <user>. (ADMIN ONLY) */
    enableCreateTicketForOtherUser:boolean,

    /**All settings related to global ticket limits. */
    limits:ODGeneralJsonConfig_SystemLimits,

    /**All global channel topic settings. */
    channelTopic:ODGeneralJsonConfig_SystemChannelTopic,

    /**Move closed tickets to this channel category. */
    closedCategory:{
        enabled:boolean
        categoryId:string
    },
    /**Create tickets in this channel category when the original category is full (max 50 channels). */
    backupCategory:{
        enabled:boolean
        categoryId:string
    },
    /**Move claimed tickets to the matching channel category of the user that claimed the ticket. */
    claimedCategories:{
        /**The user who claimed the ticket. */
        user:string,
        /**The category to move the ticket to. */
        category:string
    }[],
}

/**## ODGeneralJsonConfig_GeneralData `interface`
 * All contents of the `general.jsonc` config file.
 */
export interface ODGeneralJsonConfig_GeneralData {
    /**This object contains a few URLs and metadata for the config. */
    _CONFIG_VERSION:string,

    /**The token of the bot. (Empty when using `tokenFromENV`) */
    token:string,
    /**Use the token from the `.env` file as `TOKEN=xxxxx`. */
    tokenFromENV:boolean,

    /**The main (hex) color used in almost every embed in the bot. */
    mainColor:discord.ColorResolvable|string,
    /**The language to use. Can be the id of the language or the id without the prefix when using `opendiscord:...`. */
    language:string,
    /**The prefix used in all text-commands. */
    prefix:string,
    /**The id of the discord server where the bot is used. */
    serverId:string,
    /**A list of discord role ids which are able to access all tickets & commands. */
    globalAdmins:string[],

    /**Are slash commands enabled? */
    slashCommands:boolean,
    /**Are text commands enabled? */
    textCommands:boolean,

    /**All settings related to the status of the bot. */
    status:ODGeneralJsonConfig_Status,

    /**All settings related to the ticket system. */
    ticketSystem:ODGeneralJsonConfig_TicketSystem,

    /**Configure permissions for all Open Ticket commands & actions. */
    permissions:ODGeneralJsonConfig_SystemPermissions,

    /**All settings related to the log channel. */
    logs:ODGeneralJsonConfig_SystemLogs,
}

///////////////////////////////////////
//CONFIG STRUCTURES, VALUES & TYPES
//--> options.jsonc
///////////////////////////////////////

/**## ODOptionsJsonConfig_BaseOption `interface`
 * The basic properties for options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_BaseOption {
    /**The id of this option. */
    id:string,
    /**The name of this option. */
    name:string,
    /**The description of this option. */
    description:string,
    /**The type of this option. This type also determines the other option-specific variables. */
    type:"ticket"|"website"|"role"|"sub-panel",
    /**All settings related to the button for the 3 option types. */
    button:{
        /**The emoji of the button. (can also be empty) */
        emoji:string,
        /**The label of the button (can also be empty) */
        label:string
    }
}

/**## ODOptionsJsonConfig_OptionButtonSettings `interface`
 * The button settings for ticket, sub-panel & reaction role options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_OptionButtonSettings {
    /**The emoji of the button. (can also be empty) */
    emoji:string,
    /**The label of the button (can also be empty) */
    label:string,
    /**The color of the button (not available in options with the 'website' type!) */
    color:api.ODValidButtonColor
}

/**## ODOptionsJsonConfig_TicketOptionEmbedSettings `interface`
 * The message embed settings for ticket options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_TicketOptionEmbedSettings {
    /**Is this embed enabled? */
    enabled:boolean,
    /**The title of the embed. */
    title:string,
    /**The description of this embed. */
    description:string,
    /**A custom color for this embed. (The default bot color is used when empty) */
    customColor:discord.ColorResolvable|string,

    /**A URL to an image displayed in the embed. */
    image:string,
    /**A URL to a thumbnail displayed in the embed. */
    thumbnail:string,
    /**A list of fields displayed in the embed. */
    fields:{
        /**The name of this field. */
        name:string,
        /**The value of this field. => empty not allowed */
        value:string,
        inline:boolean
    }[],
    /**Enable setting the timestamp of the embed to the current time. */
    timestamp:boolean
}

/**## ODOptionsJsonConfig_TicketOptionPingSettings `interface`
 * The message ping settings for ticket options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_TicketOptionPingSettings {
    /**Ping `@here`. */
    "@here":boolean,
    /**Ping `@everyone`. */
    "@everyone":boolean,
    /**A list of custom discord role ids to ping. */
    custom:string[]
}

/**## ODOptionsJsonConfig_TicketOptionChannelSettings `interface`
 * All settings related to the ticket channel itself in a ticket option.
 */
export interface ODOptionsJsonConfig_TicketOptionChannelSettings {
    /**The prefix used in the name of this ticket channel. */
    prefix:string,
    /**The type of suffix used in the name of this ticket channel. */
    suffix:"user-name"|"user-nickname"|"user-id"|"random-number"|"random-hex"|"counter-dynamic"|"counter-fixed",
    /**An optional discord category id to create this ticket in. */
    category:string,
    /**The channel topic shown at the top of the channel in discord. */
    topic:string
}

/**## ODOptionsJsonConfig_TicketOption `interface`
 * All properties for ticket options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_TicketOption extends ODOptionsJsonConfig_BaseOption {
    type:"ticket",
    button:ODOptionsJsonConfig_OptionButtonSettings,
    /**A list of discord role ids which are able to access this ticket type & use commands. */
    ticketAdmins:string[],
    /**A list of discord role ids which are able to access this ticket type but can't write in the chat. */
    readonlyAdmins:string[],
    /**When enabled, blacklisted users can still create this ticket type. (used for appeals, etc) */
    allowCreationByBlacklistedUsers:boolean,
    /**A list of valid question ids from the `questions.jsonc` config. */
    questions:string[],
    /**All settings related to the ticket channel itself. */
    channel:ODOptionsJsonConfig_TicketOptionChannelSettings,
    /**All settings related to the message sent in DM to the creator when the ticket is created. */
    dmMessage:{
        /**Enable this message. */
        enabled:boolean,
        /**The raw text contents of this message. (empty for embed only) */
        text:string,
        /**The embed of this message. */
        embed:ODOptionsJsonConfig_TicketOptionEmbedSettings
    },
    /**All settings related to the message sent in the ticket channel when the ticket is created. */
    ticketMessage:{
        /**Enable this message. */
        enabled:boolean,
        /**The raw text contents of this message. (empty for embed only) */
        text:string,
        /**The embed of this message. */
        embed:ODOptionsJsonConfig_TicketOptionEmbedSettings,
        /**Additional ping/mention settings for this ticket channel. */
        ping:ODOptionsJsonConfig_TicketOptionPingSettings
    },
    /**All settings related to autoclosing this ticket type. */
    autoclose:{
        /**Enable autoclosing when the ticket is inactive for the set duration of time. */
        enableInactiveHours:boolean,
        /**The amount of hours this ticket is required to be inactive for. */
        inactiveHours:number,
        /**Enable autoclosing when the creator of the ticket leaves the server. */
        enableUserLeave:boolean,
        /**Disable autoclosing when the ticket is claimed by someone. */
        disableOnClaim:boolean
    },
    /**All settings related to autodeleting this ticket type. */
    autodelete:{
        /**Enable autodeleting when the ticket is inactive for the set duration of time. */
        enableInactiveDays:boolean,
        /**The amount of days this ticket is required to be inactive for. */
        inactiveDays:number,
        /**Enable autodeleting when the creator of the ticket leaves the server. */
        enableUserLeave:boolean,
        /**Disable autodeleting when the ticket is claimed by someone. */
        disableOnClaim:boolean
    },
    /**All settings related to the cooldown of this ticket type. */
    cooldown:{
        /**Enable cooldown (per user) */
        enabled:boolean,
        /**The amount of minutes a user needs to wait before being able to create a ticket again. */
        cooldownMinutes:number
    },
    /**All settings related to the limits of this ticket type. */
    limits:{
        /**Enable option ticket limits. */
        enabled:boolean,
        /**The maximum amount of tickets of this type that are allowed in the server at the same time. */
        globalMaximum:number,
        /**The maximum amount of tickets of this type that a user is allowed to create at the same time. */
        userMaximum:number
    },
    /**All settings related to the slow mode of this ticket type. */
    slowMode:{
        /**Enable channel slow mode. */
        enabled:boolean,
        /**The amount of seconds users need to wait between sending messages. */
        slowModeSeconds:number
    }
}

/**## ODOptionsJsonConfig_WebsiteOption `interface`
 * All properties for website options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_WebsiteOption extends ODOptionsJsonConfig_BaseOption {
    type:"website",
    /**The URL this button will point to. */
    url:string
}

/**## ODOptionsJsonConfig_RoleOption `interface`
 * All properties for reaction-role options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_RoleOption extends ODOptionsJsonConfig_BaseOption {
    type:"role",
    button:ODOptionsJsonConfig_OptionButtonSettings,
    /**All roles which will be affected by this button. */
    roles:string[],
    /**The mode determines what will happen with the affected roles on the user. */
    mode:ODRoleUpdateMode,
    /**A list of roles to remove from the user when given at least one of the affected roles. */
    removeRolesOnAdd:string[],
    /**Automatically add these roles when the user joins the server. */
    addOnMemberJoin:boolean
}

/**## ODOptionsJsonConfig_SubPanelOption `interface`
 * All properties for sub-panel options in the `options.jsonc` config!
 */
export interface ODOptionsJsonConfig_SubPanelOption extends ODOptionsJsonConfig_BaseOption {
    type:"sub-panel",
    button:ODOptionsJsonConfig_OptionButtonSettings,
    /**The panel ID of the sub-panel to show when the button is clicked. */
    subPanelId:string
}

/**## ODOptionsJsonConfig_OptionsData `type`
 * All contents of the `options.jsonc` config file.
 */
export type ODOptionsJsonConfig_OptionsData = (ODOptionsJsonConfig_TicketOption|ODOptionsJsonConfig_WebsiteOption|ODOptionsJsonConfig_RoleOption|ODOptionsJsonConfig_SubPanelOption)[]

///////////////////////////////////////
//CONFIG STRUCTURES, VALUES & TYPES
//--> panels.jsonc
///////////////////////////////////////

/**## ODPanelsJsonConfig_PanelEmbedSettings `interface`
 * This interface is an object which has all message embed settings for panels in the `panels.jsonc` config!
 */
export interface ODPanelsJsonConfig_PanelEmbedSettings {
    /**Is this embed enabled? */
    enabled:boolean,
    /**The title of the embed. */
    title:string,
    /**The description of this embed. */
    description:string,

    /**A custom color for this embed. (The default bot color is used when empty) */
    customColor:discord.ColorResolvable|string,
    /**An optional URL used in the title of the embed. */
    url:string,

    /**A URL to an image displayed in the embed. */
    image:string,
    /**A URL to a thumbnail displayed in the embed. */
    thumbnail:string,

    /**The footer of this embed. */
    footer:string,
    /**A list of fields displayed in the embed. (except when using "describeOptionsInEmbedFields") */
    fields:{
        /**The name of this field. */
        name:string,
        /**The value of this field. => empty not allowed */
        value:string,
        inline:boolean
    }[],
    /**Enable setting the timestamp of the embed to the current time. */
    timestamp:boolean
}

/**## ODPanelsJsonConfig_PanelSettings `interface`
 * This interface is a collection of additional settings for extra customisation in a panel.
 */
export interface ODPanelsJsonConfig_PanelSettings {
    /**The placeholder used in the dropdown when enabled. */
    dropdownPlaceholder:string,
    /**The maximum amount of option buttons before starting a new row. */
    maximumButtonsPerRow:number

    /**Enable a max tickets warning in the text contents. */
    enableMaxTicketsWarningInText:boolean,
    /**Enable a max tickets warning in the embed. */
    enableMaxTicketsWarningInEmbed:boolean,

    /**The layout/complexity of the describe options feature. */
    describeOptionsLayout:"simple"|"normal"|"detailed",
    /**A custom title for the describe options feature. */
    describeOptionsCustomTitle:string,
    /**Describe the options in the text contents. */
    describeOptionsInText:boolean,
    /**Describe the options in the embed fields. */
    describeOptionsInEmbedFields:boolean,
    /**Describe the options in the embed description. */
    describeOptionsInEmbedDescription:boolean
}

/**## ODPanelsJsonConfig_Panel `interface`
 * This interface is an object which has all properties for panels in the `panels.jsonc` config!
 */
export interface ODPanelsJsonConfig_Panel {
    /**The id of this panel. */
    id:string,
    /**The name of this panel. */
    name:string,
    /**When enabled, the panel uses a dropdown instead of buttons. */
    dropdown:boolean,
    /**A list of valid options ids from the `options.jsonc` config. */
    options:string[],

    /**The raw text contents of this panel. (empty for embed only) */
    text:string,
    /**The embed of this panel. */
    embed:ODPanelsJsonConfig_PanelEmbedSettings,
    /**A collection of additional settings for extra customisation in a panel. */
    settings:ODPanelsJsonConfig_PanelSettings
}

/**## ODPanelsJsonConfig_PanelsData `type`
 * All contents of the `panels.jsonc` config file.
 */
export type ODPanelsJsonConfig_PanelsData = ODPanelsJsonConfig_Panel[]

///////////////////////////////////////
//CONFIG STRUCTURES, VALUES & TYPES
//--> questions.jsonc
///////////////////////////////////////

/**## ODQuestionsJsonConfig_TextLengthLimits `interface`
 * This interface is a collection of settings related to length validation in a question.
 */
export interface ODQuestionsJsonConfig_TextLengthLimits {
    /**Enable text length verification. */
    enabled:boolean,
    /**The minimum text input length. */
    min:number,
    /**The maximum text input length. */
    max:number
}

/**## ODQuestionsJsonConfig_CheckboxLimits `interface`
 * The required amount of checkboxes validation in a question.
 */
export interface ODQuestionsJsonConfig_CheckboxLimits {
    /**Enable checkbox limits. */
    enabled:boolean,
    /**The minimum amount of selected checkboxes. */
    min:number,
    /**The maximum amount of selected checkboxes. */
    max:number
}

/**## ODQuestionsJsonConfig_FileUploadLimits `interface`
 * Verify the amount of uploaded files in a question.
 */
export interface ODQuestionsJsonConfig_FileUploadLimits {
    /**Enable file limits. */
    enabled:boolean,
    /**The minimum amount of uploaded files. */
    min:number,
    /**The maximum amount of uploaded files. */
    max:number
}

/**## ODQuestionsJsonConfig_DropdownChoice `interface`
 * A dropdown choice used in `ODQuestionsJsonConfig_DropdownQuestion`
 */
export interface ODQuestionsJsonConfig_DropdownChoice {
    /**The title of the choice. */
    title:string,
    /**The optional description of the choice. (Leave empty for none) */
    description:string,
    /**The optional emoji of the choice. (Leave empty for none) */
    emoji:string
}

/**## ODQuestionsJsonConfig_RadioCheckboxChoice `interface`
 * A radio/checkbox choice used in `ODQuestionsJsonConfig_RadioSelectQuestion` & `ODQuestionsJsonConfig_CheckboxSelectQuestion`
 */
export interface ODQuestionsJsonConfig_RadioCheckboxChoice {
    /**The title of the choice. */
    title:string,
    /**The optional description of the choice. (Leave empty for none) */
    description:string,
    /**Is this choice selected by default? */
    selectedByDefault:boolean
}

/**## ODQuestionsJsonConfig_BaseQuestion `interface`
 * This interface is an object which has all universal properties for questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_BaseQuestion {
    /**The id of this question. */
    id:string,
    /**The name of this question. */
    name:string,
    /**The description of this question. (Leave empty for none) */
    description:string,
    /**The type of this question. */
    type:"short"|"paragraph"|"text-display"|"dropdown"|"radio-select"|"checkbox-select"|"file-upload",
    /**Is this question required? */
    required:boolean,
}

/**## ODQuestionsJsonConfig_TextDisplayQuestion `interface`
 * All properties for a text-display in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_TextDisplayQuestion extends Omit<ODQuestionsJsonConfig_BaseQuestion, "name"|"description"|"required"> {
    /**The type of this question. */
    type:"text-display",
    /**The text contents to show in the modal. */
    textContents:string
}

/**## ODQuestionsJsonConfig_ShortQuestion `interface`
 * All properties for short questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_ShortQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"short",
    /**A placeholder for the question. */
    placeholder:string,
    /**A collection of settings related to length validation in a question. */
    length:ODQuestionsJsonConfig_TextLengthLimits
}

/**## ODQuestionsJsonConfig_ParagraphQuestion `interface`
 * All properties for paragraph questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_ParagraphQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"paragraph",
    /**A placeholder for the question. */
    placeholder:string,
    /**A collection of settings related to length validation in a question. */
    length:ODQuestionsJsonConfig_TextLengthLimits
}

/**## ODQuestionsJsonConfig_DropdownQuestion `interface`
 * All properties for dropdown questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_DropdownQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"dropdown",
    /**A placeholder for the dropdown. */
    placeholder:string,
    /**A list of maximum 25 dropdown choices. */
    choices:ODQuestionsJsonConfig_DropdownChoice[]
}

/**## ODQuestionsJsonConfig_RadioSelectQuestion `interface`
 * All properties for radio select questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_RadioSelectQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"radio-select",
    /**A list of minimum 2, maximum 10 radio choices. */
    choices:ODQuestionsJsonConfig_RadioCheckboxChoice[]
}

/**## ODQuestionsJsonConfig_CheckboxSelectQuestion `interface`
 * All properties for checkbox select questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_CheckboxSelectQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"checkbox-select",
    /**Verify the checked amount of checkboxes with a minimum & maximum. */
    limits:ODQuestionsJsonConfig_CheckboxLimits
    /**A list of minimum 1, maximum 10 checkbox choices. */
    choices:ODQuestionsJsonConfig_RadioCheckboxChoice[]
}

/**## ODQuestionsJsonConfig_FileUploadQuestion `interface`
 * All properties for checkbox select questions in the `questions.jsonc` config!
 */
export interface ODQuestionsJsonConfig_FileUploadQuestion extends ODQuestionsJsonConfig_BaseQuestion {
    type:"file-upload",
    /**Verify the amount of uploaded files (minimum/maximum). */
    limits:ODQuestionsJsonConfig_FileUploadLimits
}

/**## ODQuestionsJsonConfig_QuestionsData `type`
 * All contents of the `questions.jsonc` config file.
 */
export type ODQuestionsJsonConfig_QuestionsData = (
    ODQuestionsJsonConfig_ShortQuestion
    |ODQuestionsJsonConfig_ParagraphQuestion
    |ODQuestionsJsonConfig_TextDisplayQuestion
    |ODQuestionsJsonConfig_DropdownQuestion
    |ODQuestionsJsonConfig_RadioSelectQuestion
    |ODQuestionsJsonConfig_CheckboxSelectQuestion
    |ODQuestionsJsonConfig_FileUploadQuestion
)[]

///////////////////////////////////////
//CONFIG STRUCTURES, VALUES & TYPES
//--> transcripts.jsonc
///////////////////////////////////////

/**## ODTranscriptsJsonConfig_TranscriptsTextLayout `interface`
 * This interface contains the layout of the text transcripts.
 */
export interface ODTranscriptsJsonConfig_TranscriptsTextLayout {
    /**The layout/complexity of the text transcripts. */
    layout:"simple"|"normal"|"detailed",
    /**Include stats in the transcript. */
    includeStats:boolean,
    /**Include user & message ids in the transcript. */
    includeIds:boolean,
    /**Include embeds in the transcript. */
    includeEmbeds:boolean,
    /**Include files in the transcript. */
    includeFiles:boolean,
    /**Include bot messages in the transcript. */
    includeBotMessages:boolean,

    /**How to name the transcript file? */
    fileMode:"custom"|"channel-name"|"channel-id"|"user-name"|"user-id",
    /**A custom name for the transcript file (when using `"custom"`) */
    customFileName:string
}

/**## ODTranscriptsJsonConfig_TranscriptsHtmlLayout `interface`
 * This interface contains the layout of the HTML transcripts.
 */
export interface ODTranscriptsJsonConfig_TranscriptsHtmlLayout {
    /**Settings related to the background. */
    background:{
        /**Enable a custom background. */
        enableCustomBackground:boolean,
        /**The background (hex) color. */
        backgroundColor:string,
        /**The background image url. */
        backgroundImage:string
    },
    /**Settings related to the header. */
    header:{
        /**Enable a custom header. */
        enableCustomHeader:boolean,
        /**The background (hex) color of the header. */
        backgroundColor:string,
        /**The deco color (horizontal line) of the header. */
        decoColor:string,
        /**The text color of the header. */
        textColor:string
    },
    /**Settings related to the stats section. */
    stats:{
        /**Enable a custom stats section. */
        enableCustomStats:false,
        /**The background color of the stats section. */
        backgroundColor:string,
        /**The key text color of the stats section. */
        keyTextColor:string,
        /**The value text color of the stats section. */
        valueTextColor:string,
        /**The background color of the hide button in the stats section. */
        hideBackgroundColor:string,
        /**The text color of the hide button in the stats section. */
        hideTextColor:string
    },
    /**Settings related to the favicon. */
    favicon:{
        /**Enable a custom background. */
        enableCustomFavicon:boolean,
        /**A link to the custom favicon. */
        imageUrl:string
    }
}

/**## ODTranscriptsJsonConfig_TranscriptsData `interface`
 * All contents of the `transcripts.jsonc` config file.
 */
export interface ODTranscriptsJsonConfig_TranscriptsData {
    /**All general settings related to transcripts. */
    general:{
        /**Are transcripts enabled? */
        enabled:boolean,

        /**Enable sending the generated transcript in a channel. */
        enableChannel:boolean,
        /**Enable sending the generated transcript to the DM of the ticket creator. */
        enableCreatorDM:boolean,
        /**Enable sending the generated transcript to the DM of the participants. */
        enableParticipantDM:boolean,
        /**Enable sending the generated transcript to the DM of all admins which were active in the ticket. */
        enableActiveAdminDM:boolean,
        /**Enable sending the generated transcript to the DM of all admins which were assigned to the ticket. */
        enableEveryAdminDM:boolean,

        /**A discord channel id for the `"enableChannel"` setting. */
        channel:string,
        /**Want to use text or HTML transcripts? */
        mode:"html"|"text"
    },
    /**All settings related to the embed from the transcripts. (UNIMPLEMENTED!!) */
    embedSettings:{
        /**Unimplemented feature */
        customColor:discord.ColorResolvable|string,
        /**Unimplemented feature */
        listAllParticipants:boolean,
        /**Unimplemented feature */
        includeTicketStats:boolean
    },
    /**The layout of the text transcripts. */
    textTranscriptStyle:ODTranscriptsJsonConfig_TranscriptsTextLayout,
    /**The layout of the HTML transcripts. */
    htmlTranscriptStyle:ODTranscriptsJsonConfig_TranscriptsHtmlLayout
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedConfigManager `class
 * A special class with types for the Open Ticket `ODConfigManager` class.
 */
export class ODMappedConfigManager extends api.ODConfigManager<ODConfigManagerIdMappings> {}

/**## ODGeneralJsonCommentsConfig `class
 * A special class with types for the Open Ticket `config/general.jsonc` config file
 */
export class ODGeneralJsonCommentsConfig extends api.ODJsonCommentsConfig<ODGeneralJsonConfig_GeneralData> {}

/**## ODQuestionsJsonCommentsConfig `class
 * A special class with types for the Open Ticket `config/questions.jsonc` config file
 */
export class ODQuestionsJsonCommentsConfig extends api.ODJsonCommentsConfig<ODQuestionsJsonConfig_QuestionsData> {}

/**## ODOptionsJsonCommentsConfig `class
 * A special class with types for the Open Ticket `config/options.jsonc` config file
 */
export class ODOptionsJsonCommentsConfig extends api.ODJsonCommentsConfig<ODOptionsJsonConfig_OptionsData> {}

/**## ODPanelsJsonCommentsConfig `class
 * A special class with types for the Open Ticket `config/panels.jsonc` config file
 */
export class ODPanelsJsonCommentsConfig extends api.ODJsonCommentsConfig<ODPanelsJsonConfig_PanelsData> {}

/**## ODTranscriptsJsonCommentsConfig `class
 * A special class with types for the Open Ticket `config/transcripts.jsonc` config file
 */
export class ODTranscriptsJsonCommentsConfig extends api.ODJsonCommentsConfig<ODTranscriptsJsonConfig_TranscriptsData> {}