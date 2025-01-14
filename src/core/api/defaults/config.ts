///////////////////////////////////////
//DEFAULT CONFIG MODULE
///////////////////////////////////////
import { ODValidButtonColor, ODValidId } from "../modules/base"
import * as discord from "discord.js"
import { ODConfigManager, ODConfig, ODJsonConfig } from "../modules/config"
import { ODClientActivityStatus, ODClientActivityType } from "../modules/client"
import { OTRoleUpdateMode } from "../openticket/role"

/**## ODConfigManagerIds_Default `type`
 * This type is an array of ids available in the `ODConfigManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODConfigManagerIds_Default {
    "openticket:general":ODJsonConfig_DefaultGeneral,
    "openticket:options":ODJsonConfig_DefaultOptions,
    "openticket:panels":ODJsonConfig_DefaultPanels,
    "openticket:questions":ODJsonConfig_DefaultQuestions,
    "openticket:transcripts":ODJsonConfig_DefaultTranscripts
}

/**## ODConfigManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODConfigManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.configs`!
 */
export class ODConfigManager_Default extends ODConfigManager {
    get<ConfigId extends keyof ODConfigManagerIds_Default>(id:ConfigId): ODConfigManagerIds_Default[ConfigId]
    get(id:ODValidId): ODConfig|null
    
    get(id:ODValidId): ODConfig|null {
        return super.get(id)
    }
    
    remove<ConfigId extends keyof ODConfigManagerIds_Default>(id:ConfigId): ODConfigManagerIds_Default[ConfigId]
    remove(id:ODValidId): ODConfig|null
    
    remove(id:ODValidId): ODConfig|null {
        return super.remove(id)
    }

    exists(id:keyof ODConfigManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODJsonConfig_DefaultStatusType `interface`
 * This interface is an object which has all properties for the status object in the `general.json` config!
 */
export interface ODJsonConfig_DefaultStatusType {
    /**Is the status enabled? */
    enabled:boolean,
    /**The type of status (e.g. playing, listening, custom, ...) */
    type:Exclude<ODClientActivityType,false>,
    /**The text for the status. */
    text:string,
    /**The status of the bot (e.g. online, invisible, idle, do not disturb) */
    status:ODClientActivityStatus
}

/**## ODJsonConfig_DefaultMessageSettingsType `interface`
 * This interface is an object which has all properties for the "system"."messages".... object in the `general.json` config!
 */
export interface ODJsonConfig_DefaultMessageSettingsType {
    /**Enable sending DM logs to the ticket creator for this action. */
    dm:boolean,
    /**Enable sending logsto the log channel for this action. */
    logs:boolean
}

/**## ODJsonConfig_DefaultCmdPermissionSettingsType `type`
 * This type is a collection of command permission settings for the "system"."permissions".... object in the `general.json` config!
 */
export type ODJsonConfig_DefaultCmdPermissionSettingsType = "admin"|"everyone"|"none"|string

/**## ODJsonConfig_DefaultGeneral `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `general.json` config!
 */
export class ODJsonConfig_DefaultGeneral extends ODJsonConfig {
    declare data: {
        /**This object contains a few URLs and metadata for the config. */
        _INFO:{
            /**A link to the Open Ticket documentation. */
            support:string,
            /**A link to the DJdj Development discord server. */
            discord:string,
            /**The version of Open Ticket this config is compatible with. */
            version:string
        },
        
        /**The token of the bot. (Empty when using `tokenFromENV`) */
        token:string,
        /**Use the token from the `.env` file as `TOKEN=xxxxx`. */
        tokenFromENV:boolean,
    
        /**The main (hex) color used in almost every embed in the bot. */
        mainColor:discord.ColorResolvable,
        /**The language to use. Can be the id of the language or the id without the prefix when using `openticket:...`. */
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
        status:ODJsonConfig_DefaultStatusType,

        /**All settings related to the ticket system. */
        system:{
            /**Remove all participants (except admins) from the ticket when it's closed. */
            removeParticipantsOnClose:boolean,
            /**Reply with an ephemeral message when a ticket is created. */
            replyOnTicketCreation:boolean,
            /**Reply with an ephemeral message when reaction roles are changed. */
            replyOnReactionRole:boolean,
            /**Use a translated config checker in the console. */
            useTranslatedConfigChecker:boolean,
            /**Prefer slash-commands over text-commands when displaying them in menu's and messages. */
            preferSlashOverText:boolean,
            /**Reply with "unknown command" when the prefix is used without a valid command. */
            sendErrorOnUnknownCommand:boolean,
            /**Display the question fields (in a ticket message) in code blocks. */
            questionFieldsInCodeBlock:boolean,
            /**Disable the (✅❌) buttons and directly run the action. */
            disableVerifyBars:boolean,
            /**Display error embeds/messages with red instead of the default bot color. */
            useRedErrorEmbeds:boolean,
            /**The emoji style used in the bot. This will affect all embeds, titles & messages in the bot. */
            emojiStyle:"before"|"after"|"double"|"disabled",


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

            /**All settings related to the log channel. */
            logs:{
                /**Enable logging. Individual actions should still be added via the `"system"."messages"..."logs"` */
                enabled:boolean,
                /**The channel to send logs to. */
                channel:string
            },
            
            /**All settings related to global ticket limits. */
            limits:{
                /**Enable global ticket limits. */
                enabled:boolean,
                /**The maximum amount of tickets that are allowed in the server at the same time. */
                globalMaximum:number,
                /**The maximum amount of tickets that a user is allowed to create at the same time. */
                userMaximum:number
            },

            /**Configure permissions for all Open Ticket commands & actions. */
            permissions:{
                help:ODJsonConfig_DefaultCmdPermissionSettingsType,
                panel:ODJsonConfig_DefaultCmdPermissionSettingsType,
                ticket:ODJsonConfig_DefaultCmdPermissionSettingsType,
                close:ODJsonConfig_DefaultCmdPermissionSettingsType,
                delete:ODJsonConfig_DefaultCmdPermissionSettingsType,
                reopen:ODJsonConfig_DefaultCmdPermissionSettingsType,
                claim:ODJsonConfig_DefaultCmdPermissionSettingsType,
                unclaim:ODJsonConfig_DefaultCmdPermissionSettingsType,
                pin:ODJsonConfig_DefaultCmdPermissionSettingsType,
                unpin:ODJsonConfig_DefaultCmdPermissionSettingsType,
                move:ODJsonConfig_DefaultCmdPermissionSettingsType,
                rename:ODJsonConfig_DefaultCmdPermissionSettingsType,
                add:ODJsonConfig_DefaultCmdPermissionSettingsType,
                remove:ODJsonConfig_DefaultCmdPermissionSettingsType,
                blacklist:ODJsonConfig_DefaultCmdPermissionSettingsType,
                stats:ODJsonConfig_DefaultCmdPermissionSettingsType,
                clear:ODJsonConfig_DefaultCmdPermissionSettingsType,
                autoclose:ODJsonConfig_DefaultCmdPermissionSettingsType,
                autodelete:ODJsonConfig_DefaultCmdPermissionSettingsType
            },

            /**Configure dm & log messages for all Open Ticket commands & actions. */
            messages:{
                creation:ODJsonConfig_DefaultMessageSettingsType,
                closing:ODJsonConfig_DefaultMessageSettingsType,
                deleting:ODJsonConfig_DefaultMessageSettingsType,
                reopening:ODJsonConfig_DefaultMessageSettingsType,
                claiming:ODJsonConfig_DefaultMessageSettingsType,
                pinning:ODJsonConfig_DefaultMessageSettingsType,
                adding:ODJsonConfig_DefaultMessageSettingsType,
                removing:ODJsonConfig_DefaultMessageSettingsType,
                renaming:ODJsonConfig_DefaultMessageSettingsType,
                moving:ODJsonConfig_DefaultMessageSettingsType,
                blacklisting:ODJsonConfig_DefaultMessageSettingsType,
                roleAdding:ODJsonConfig_DefaultMessageSettingsType,
                roleRemoving:ODJsonConfig_DefaultMessageSettingsType
            }
        }
    }
}

/**## ODJsonConfig_DefaultOptionType `interface`
 * This interface is an object which has all basic properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionType {
    /**The id of this option. */
    id:string,
    /**The name of this option. */
    name:string,
    /**The description of this option. */
    description:string,
    /**The type of this option. This type also determines the other option-specific variables. */
    type:"ticket"|"website"|"role",
    /**All settings related to the button for the 3 option types. */
    button:{
        /**The emoji of the button. (can also be empty) */
        emoji:string,
        /**The label of the button (can also be empty) */
        label:string
    }
}

/**## ODJsonConfig_DefaultOptionButtonSettingsType `interface`
 * This interface is an object which has all button settings for ticket & reaction role options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionButtonSettingsType {
    /**The emoji of the button. (can also be empty) */
    emoji:string,
    /**The label of the button (can also be empty) */
    label:string,
    /**The color of the button (not available in options with the 'website' type!) */
    color:ODValidButtonColor
}

/**## ODJsonConfig_DefaultOptionEmbedSettingsType `interface`
 * This interface is an object which has all message embed settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionEmbedSettingsType {
    /**Is this embed enabled? */
    enabled:boolean,
    /**The title of the embed. */
    title:string,
    /**The description of this embed. */
    description:string,
    /**A custom color for this embed. (The default bot color is used when empty) */
    customColor:discord.ColorResolvable,

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
    timestamp:boolean
}

/**## ODJsonConfig_DefaultOptionPingSettingsType `interface`
 * This interface is an object which has all message ping settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionPingSettingsType {
    "@here":boolean,
    "@everyone":boolean,
    custom:string[]
}

/**## ODJsonConfig_DefaultOptionTicketType `interface`
 * This interface is an object which has all ticket properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionTicketType extends ODJsonConfig_DefaultOptionType {
    type:"ticket",
    button:ODJsonConfig_DefaultOptionButtonSettingsType,
    ticketAdmins:string[],
    readonlyAdmins:string[],
    allowCreationByBlacklistedUsers:boolean,
    questions:string[],
    channel:{
        prefix:string,
        suffix:"user-name"|"user-id"|"random-number"|"random-hex"|"counter-dynamic"|"counter-fixed",
        category:string,
        closedCategory:string,
        backupCategory:string,
        claimedCategory:{user:string, category:string}[],
        description:string
    },
    dmMessage:{
        enabled:boolean,
        text:string,
        embed:ODJsonConfig_DefaultOptionEmbedSettingsType
    },
    ticketMessage:{
        enabled:boolean,
        text:string,
        embed:ODJsonConfig_DefaultOptionEmbedSettingsType,
        ping:ODJsonConfig_DefaultOptionPingSettingsType
    },
    autoclose:{
        enableInactiveHours:boolean,
        inactiveHours:number,
        enableUserLeave:boolean,
        disableOnClaim:boolean
    },
    autodelete:{
        enableInactiveDays:boolean,
        inactiveDays:number,
        enableUserLeave:boolean,
        disableOnClaim:boolean
    },
    cooldown:{
        enabled:boolean,
        cooldownMinutes:number
    },
    limits:{
        enabled:boolean,
        globalMaximum:number,
        userMaximum:number
    }
}

/**## ODJsonConfig_DefaultOptionWebsiteType `interface`
 * This interface is an object which has all website properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionWebsiteType extends ODJsonConfig_DefaultOptionType {
    type:"website",
    url:string
}

/**## ODJsonConfig_DefaultOptionRoleType `interface`
 * This interface is an object which has all reaction role properties for options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionRoleType extends ODJsonConfig_DefaultOptionType {
    type:"role",
    button:ODJsonConfig_DefaultOptionButtonSettingsType,
    roles:string[],
    mode:OTRoleUpdateMode,
    removeRolesOnAdd:string[],
    addOnMemberJoin:boolean
}

/**## ODJsonConfig_DefaultOptions `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `options.json` config!
 */
export class ODJsonConfig_DefaultOptions extends ODJsonConfig {
    declare data: (
        ODJsonConfig_DefaultOptionTicketType|
        ODJsonConfig_DefaultOptionWebsiteType|
        ODJsonConfig_DefaultOptionRoleType
    )[]
}

/**## ODJsonConfig_DefaultPanelEmbedSettingsType `interface`
 * This interface is an object which has all message embed settings for panels in the `panels.json` config!
 */
export interface ODJsonConfig_DefaultPanelEmbedSettingsType {
    enabled:boolean,
    title:string,
    description:string,
    
    customColor:discord.ColorResolvable,
    url:string,

    image:string,
    thumbnail:string,
    
    footer:string,
    fields:{name:string,value:string,inline:boolean}[],
    timestamp:boolean
}

/**## ODJsonConfig_DefaultPanelType `interface`
 * This interface is an object which has all properties for panels in the `panels.json` config!
 */
export interface ODJsonConfig_DefaultPanelType {
    id:string,
    name:string,
    dropdown:boolean,
    options:string[],

    text:string,
    embed:ODJsonConfig_DefaultPanelEmbedSettingsType,
    settings:{
        dropdownPlaceholder:string,

        enableMaxTicketsWarningInText:boolean,
        enableMaxTicketsWarningInEmbed:boolean,

        describeOptionsLayout:"simple"|"normal"|"detailed",
        describeOptionsCustomTitle:string,
        describeOptionsInText:boolean,
        describeOptionsInEmbedFields:boolean,
        describeOptionsInEmbedDescription:boolean
    }
}

/**## ODJsonConfig_DefaultPanels `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `panels.json` config!
 */
export class ODJsonConfig_DefaultPanels extends ODJsonConfig {
    declare data: ODJsonConfig_DefaultPanelType[]
}

/**## ODJsonConfig_DefaultShortQuestionType `interface`
 * This interface is an object which has all properties for short questions in the `questions.json` config!
 */
export interface ODJsonConfig_DefaultShortQuestionType {
    id:string,
    name:string,
    type:"short",

    required:boolean,
    placeholder:string,
    length:{
        enabled:boolean,
        min:number,
        max:number
    }
}

/**## ODJsonConfig_DefaultParagraphQuestionType `interface`
 * This interface is an object which has all properties for paragraph questions in the `questions.json` config!
 */
export interface ODJsonConfig_DefaultParagraphQuestionType {
    id:string,
    name:string,
    type:"paragraph",

    required:boolean,
    placeholder:string,
    length:{
        enabled:boolean,
        min:number,
        max:number
    }
}

/**## ODJsonConfig_DefaultQuestions `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `questions.json` config!
 */
export class ODJsonConfig_DefaultQuestions extends ODJsonConfig {
    declare data: (
        ODJsonConfig_DefaultShortQuestionType|
        ODJsonConfig_DefaultParagraphQuestionType
    )[]
}

/**## ODJsonConfig_DefaultTranscripts `default_class`
 * This is a special class that adds type definitions & typescript to the ODJsonConfig class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `transcripts.json` config!
 */
export class ODJsonConfig_DefaultTranscripts extends ODJsonConfig {
    declare data: {
        general:{
            enabled:boolean,

            enableChannel:boolean,
            enableCreatorDM:boolean,
            enableParticipantDM:boolean,
            enableActiveAdminDM:boolean,
            enableEveryAdminDM:boolean,
    
            channel:string,
            mode:"html"|"text"
        },
        embedSettings:{
            customColor:discord.ColorResolvable,
            listAllParticipants:boolean,
            includeTicketStats:boolean
        },
        textTranscriptStyle:{
            layout:"simple"|"normal"|"detailed",
            includeStats:boolean,
            includeIds:boolean,
            includeEmbeds:boolean,
            includeFiles:boolean,
            includeBotMessages:boolean,
    
            fileMode:"custom"|"channel-name"|"channel-id"|"user-name"|"user-id",
            customFileName:string
        },
        htmlTranscriptStyle:{
            background:{
                enableCustomBackground:boolean,
                backgroundColor:string,
                backgroundImage:string
            },
            header:{
                enableCustomHeader:boolean,
                backgroundColor:string,
                decoColor:string,
                textColor:string
            },
            stats:{
                enableCustomStats:false,
                backgroundColor:string,
                keyTextColor:string,
                valueTextColor:string,
                hideBackgroundColor:string,
                hideTextColor:string
            },
            favicon:{
                enableCustomFavicon:boolean,
                imageUrl:string
            }
        }
    }
}