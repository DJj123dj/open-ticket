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
    enabled:boolean,
    type:Exclude<ODClientActivityType,false>,
    text:string,
    status:ODClientActivityStatus
}

/**## ODJsonConfig_DefaultMessageSettingsType `interface`
 * This interface is an object which has all properties for the system/messages/... object in the `general.json` config!
 */
export interface ODJsonConfig_DefaultMessageSettingsType {
    dm:boolean,
    logs:boolean
}

/**## ODJsonConfig_DefaultCmdPermissionSettingsType `type`
 * This type is a collection of command permission settings for the system/permissions/... object in the `general.json` config!
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
        _INFO:{
            support:string,
            discord:string,
            version:string
        },
        
        token:string,
        tokenFromENV:boolean,
    
        mainColor:discord.ColorResolvable,
        language:string,
        prefix:string,
        serverId:string,
        globalAdmins:string[],

        slashCommands:boolean,
        textCommands:boolean,

        status:ODJsonConfig_DefaultStatusType,

        system:{
            removeParticipantsOnClose:boolean,
            replyOnTicketCreation:boolean,
            replyOnReactionRole:boolean,
            useTranslatedConfigChecker:boolean,
            preferSlashOverText:boolean,
            sendErrorOnUnknownCommand:boolean,
            questionFieldsInCodeBlock:boolean,
            disableVerifyBars:boolean,
            useRedErrorEmbeds:boolean,
            emojiStyle:"before"|"after"|"double"|"disabled",

            enableTicketClaimButtons:boolean,
            enableTicketCloseButtons:boolean,
            enableTicketPinButtons:boolean,
            enableTicketDeleteButtons:boolean,
            enableTicketActionWithReason:boolean,
            enableDeleteWithoutTranscript:boolean,

            logs:{
                enabled:boolean,
                channel:string
            },
            
            limits:{
                enabled:boolean,
                globalMaximum:number,
                userMaximum:number
            },

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
    id:string,
    name:string,
    description:string,
    type:"ticket"|"website"|"role",
    button:{
        emoji:string,
        label:string
    }
}

/**## ODJsonConfig_DefaultOptionButtonSettingsType `interface`
 * This interface is an object which has all button settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionButtonSettingsType {
    emoji:string,
    label:string,
    color:ODValidButtonColor
}

/**## ODJsonConfig_DefaultOptionEmbedSettingsType `interface`
 * This interface is an object which has all message embed settings for ticket options in the `options.json` config!
 */
export interface ODJsonConfig_DefaultOptionEmbedSettingsType {
    enabled:boolean,
    title:string,
    description:string,
    customColor:string,

    image:string,
    thumbnail:string,
    fields:{name:string, value:string, inline:boolean}[],
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
    
    customColor:string,
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
            customColor:string,
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