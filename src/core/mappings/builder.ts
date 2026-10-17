///////////////////////////////////////
//OPEN TICKET BUILDER MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODPermissionEmbedType } from "./permission.js"
import { ODTranscriptCompiler, ODTranscriptCompilerCompileResult, ODTranscriptHistoryData } from "../api/transcript.js"
import { ODOption, ODRoleOption, ODSubPanelOption, ODTicketOption, ODWebsiteOption } from "../api/option.js"
import { ODTicket, ODTicketClearFilter } from "../api/ticket.js"
import { ODRole, ODRoleUpdateResult } from "../api/role.js"
import { ODPriorityLevel } from "../api/priority.js"
import { ODPanel } from "../api/panel.js"
import * as discord from "discord.js"

/**## ODButtonManagerIdMappings `interface`
 * A list of all available IDs in the default `ODButtonManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODButtonManagerIdMappings extends api.ODButtonManagerIdConstraint {
    "opendiscord:verifybar-button":{origin:"verifybar"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>, verifyButtonId:string, defaultButtonType:"✅"|"❌", useDefaultLabels:boolean, customLabel?:string, customColor?:api.ODValidButtonColor, customEmoji?:string}, workers:"opendiscord:verifybar-button"},

    "opendiscord:error-ticket-deprecated-transcript":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{}, workers:"opendiscord:error-ticket-deprecated-transcript"},

    "opendiscord:help-menu-previous":{origin:"text"|"slash"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu-previous"},
    "opendiscord:help-menu-next":{origin:"text"|"slash"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu-next"},
    "opendiscord:help-menu-page":{origin:"text"|"slash"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu-page"}
    "opendiscord:help-menu-switch":{origin:"text"|"slash"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu-switch"},

    "opendiscord:ticket-option":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, option:ODTicketOption}, workers:"opendiscord:ticket-option"},
    "opendiscord:website-option":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, option:ODWebsiteOption}, workers:"opendiscord:website-option"},
    "opendiscord:role-option":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, option:ODRoleOption}, workers:"opendiscord:role-option"}
    "opendiscord:subpanel-option":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, option:ODSubPanelOption}, workers:"opendiscord:subpanel-option"}

    "opendiscord:visit-ticket":{origin:"ticket-created"|"dm"|"logs"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:visit-ticket"},

    "opendiscord:close-ticket":{origin:"ticket-message"|"reopen-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:close-ticket"},
    "opendiscord:delete-ticket":{origin:"ticket-message"|"close-message"|"autoclose-message"|"reopen-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:delete-ticket"},
    "opendiscord:reopen-ticket":{origin:"ticket-message"|"close-message"|"autoclose-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:reopen-ticket"},
    "opendiscord:claim-ticket":{origin:"ticket-message"|"unclaim-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:claim-ticket"},
    "opendiscord:unclaim-ticket":{origin:"ticket-message"|"claim-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:unclaim-ticket"},
    "opendiscord:pin-ticket":{origin:"ticket-message"|"unpin-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:pin-ticket"},
    "opendiscord:unpin-ticket":{origin:"ticket-message"|"pin-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:unpin-ticket"},

    "opendiscord:transcript-html-visit":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>, result:ODTranscriptCompilerCompileResult<{url:string, availableUntil:Date}>}, workers:"opendiscord:transcript-html-visit"},
    "opendiscord:transcript-error-retry":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<any, object|null>, reason:string|null}, workers:"opendiscord:transcript-error-retry"},
    "opendiscord:transcript-error-continue":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<any, object|null>, reason:string|null}, workers:"opendiscord:transcript-error-continue"},

    "opendiscord:clear-continue":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[], inProgress:boolean}, workers:"opendiscord:clear-continue"},
}

/**## ODDropdownManagerIdMappings `interface`
 * A list of all available IDs in the default `ODDropdownManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDropdownManagerIdMappings extends api.ODDropdownManagerIdConstraint {
    "opendiscord:panel-dropdown":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, options:(ODTicketOption|ODRoleOption|ODSubPanelOption)[]}, workers:"opendiscord:panel-dropdown"}
    "opendiscord:priority-dropdown":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:priority-dropdown"}
}

/**## ODFileManagerIdMappings `interface`
 * A list of all available IDs in the default `ODFileManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFileManagerIdMappings extends api.ODFileManagerIdConstraint {
    "opendiscord:text-transcript":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<any, object|null>, result:ODTranscriptCompilerCompileResult<any>}, workers:"opendiscord:text-transcript"}
}

/**## ODEmbedManagerIdMappings `interface`
 * A list of all available IDs in the default `ODEmbedManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODEmbedManagerIdMappings extends api.ODEmbedManagerIdConstraint {
    "opendiscord:error":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:string, layout:"simple"|"advanced", customTitle?:string}, workers:"opendiscord:error"},
    "opendiscord:error-option-missing":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorMissingOption}, workers:"opendiscord:error-option-missing"},
    "opendiscord:error-option-invalid":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorInvalidOption}, workers:"opendiscord:error-option-invalid"},
    "opendiscord:error-unknown-command":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorUnknownCommand}, workers:"opendiscord:error-unknown-command"},
    "opendiscord:error-no-permissions":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, permissions:ODPermissionEmbedType[]}, workers:"opendiscord:error-no-permissions"},
    "opendiscord:error-no-permissions-cooldown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, until?:Date}, workers:"opendiscord:error-no-permissions-cooldown"},
    "opendiscord:error-no-permissions-blacklisted":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-no-permissions-blacklisted"},
    "opendiscord:error-no-permissions-limits":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, limit:"global"|"global-user"|"option"|"option-user"}, workers:"opendiscord:error-no-permissions-limits"},
    "opendiscord:error-responder-timeout":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-responder-timeout"},
    "opendiscord:error-ticket-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-unknown"},
    "opendiscord:error-ticket-deprecated":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-deprecated"},
    "opendiscord:error-option-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-option-unknown"},
    "opendiscord:error-panel-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-panel-unknown"},
    "opendiscord:error-not-in-guild":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-not-in-guild"},
    "opendiscord:error-channel-rename":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-close"|"ticket-reopen"|"ticket-rename"|"ticket-move"|"ticket-priority"|"ticket-transfer"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, originalName:string, newName:string}, workers:"opendiscord:error-channel-rename"},
    "opendiscord:error-channel-category":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-create"|"ticket-close"|"ticket-reopen"|"ticket-claim"|"ticket-unclaim"|"ticket-move"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, originalCategory:string, newCategory:string}, workers:"opendiscord:error-channel-category"},
    "opendiscord:error-ticket-busy":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-busy"},

    "opendiscord:help-menu":{origin:"text"|"slash"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu"},

    "opendiscord:stats-global":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:stats-global"},
    "opendiscord:stats-ticket":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, scopeData:ODTicket}, workers:"opendiscord:stats-ticket"},
    "opendiscord:stats-user":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, scopeData:discord.User}, workers:"opendiscord:stats-user"|"opendiscord:easter-egg"},
    "opendiscord:stats-reset":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, reason:string|null}, workers:"opendiscord:stats-reset"},
    "opendiscord:stats-ticket-unknown":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, id:string}, workers:"opendiscord:stats-ticket-unknown"},

    "opendiscord:panel":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, isSubPanel:boolean}, workers:"opendiscord:panel"},
    "opendiscord:ticket-created":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created"},
    "opendiscord:ticket-created-dm":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created-dm"},
    "opendiscord:ticket-created-logs":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created-logs"},
    "opendiscord:ticket-message":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-message"},
    "opendiscord:close-message":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:close-message"},
    "opendiscord:reopen-message":{origin:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:reopen-message"},
    "opendiscord:delete-message":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:delete-message"},
    "opendiscord:claim-message":{origin:"slash"|"text"|"ticket-message"|"unclaim-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:claim-message"},
    "opendiscord:unclaim-message":{origin:"slash"|"text"|"ticket-message"|"claim-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:unclaim-message"},
    "opendiscord:pin-message":{origin:"slash"|"text"|"ticket-message"|"unpin-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:pin-message"},
    "opendiscord:unpin-message":{origin:"slash"|"text"|"ticket-message"|"pin-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:unpin-message"},
    "opendiscord:rename-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:string}, workers:"opendiscord:rename-message"},
    "opendiscord:move-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:ODTicketOption}, workers:"opendiscord:move-message"},
    "opendiscord:add-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:discord.User}, workers:"opendiscord:add-message"},
    "opendiscord:remove-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:discord.User}, workers:"opendiscord:remove-message"},
    "opendiscord:ticket-action-dm":{origin:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"priority-message"|"topic-message"|"transfer-message"|"autoclose"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove"|"priority"|"transfer"|"topic", ticket:ODTicket, reason:string|null, additionalData:null|string|discord.User|ODTicketOption, additionalData2?:discord.User}, workers:"opendiscord:ticket-action-dm"},
    "opendiscord:ticket-action-logs":{origin:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"priority-message"|"topic-message"|"transfer-message"|"autoclose"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove"|"priority"|"transfer"|"topic", ticket:ODTicket, reason:string|null, additionalData:null|string|discord.User|ODTicketOption, additionalData2?:discord.User}, workers:"opendiscord:ticket-action-logs"},

    "opendiscord:blacklist-view":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:blacklist-view"},
    "opendiscord:blacklist-get":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User}, workers:"opendiscord:blacklist-get"},
    "opendiscord:blacklist-add":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-add"},
    "opendiscord:blacklist-remove":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-remove"}
    "opendiscord:blacklist-dm":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"add"|"remove", data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-dm"},
    "opendiscord:blacklist-logs":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"add"|"remove", data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-logs"},

    "opendiscord:transcript-text-ready":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{contents:string}, null>, result:ODTranscriptCompilerCompileResult<{contents:string}>}, workers:"opendiscord:transcript-text-ready"},
    "opendiscord:transcript-html-ready":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>, result:ODTranscriptCompilerCompileResult<{url:string, availableUntil:Date}>}, workers:"opendiscord:transcript-html-ready"},
    "opendiscord:transcript-html-progress":{origin:"channel"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>, remaining:number}, workers:"opendiscord:transcript-html-progress"},
    "opendiscord:transcript-error":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<any, object|null>, reason:string|null}, workers:"opendiscord:transcript-error"},
    "opendiscord:transcript-history":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, transcriptUser:discord.User, transcriptList:ODTranscriptHistoryData[]}, workers:"opendiscord:transcript-history"},

    "opendiscord:reaction-role":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role"},
    "opendiscord:reaction-role-dm":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role-dm"},
    "opendiscord:reaction-role-logs":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role-logs"},

    "opendiscord:clear-verify-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[], inProgress:boolean}, workers:"opendiscord:clear-verify-message"},
    "opendiscord:clear-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[]}, workers:"opendiscord:clear-message"},
    "opendiscord:clear-logs":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[]}, workers:"opendiscord:clear-logs"},

    "opendiscord:autoclose-message":{origin:"timeout"|"leave"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:autoclose-message"},
    "opendiscord:autodelete-message":{origin:"timeout"|"leave"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:autodelete-message"},
    "opendiscord:autoclose-enable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, time:number, reason:string|null}, workers:"opendiscord:autoclose-enable"},
    "opendiscord:autodelete-enable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, time:number, reason:string|null}, workers:"opendiscord:autodelete-enable"},
    "opendiscord:autoclose-disable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:autoclose-disable"},
    "opendiscord:autodelete-disable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:autodelete-disable"},

    "opendiscord:topic-set":{origin:"slash"|"text"|"ticket-action"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, topic:string}, workers:"opendiscord:topic-set"},
    "opendiscord:priority-set":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, priority:ODPriorityLevel, reason:string|null}, workers:"opendiscord:priority-set"},
    "opendiscord:priority-get":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, priority:ODPriorityLevel}, workers:"opendiscord:priority-get"},
    "opendiscord:transfer-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, oldCreator:discord.User, newCreator:discord.User, reason:string|null}, workers:"opendiscord:transfer-message"},
}

/**## ODMessageManagerIdMappings `interface`
 * A list of all available IDs in the default `ODMessageManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODMessageManagerIdMappings extends api.ODMessageManagerIdConstraint {
    "opendiscord:error":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:string, layout:"simple"|"advanced", customTitle?:string}, workers:"opendiscord:error"},
    "opendiscord:error-option-missing":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorMissingOption}, workers:"opendiscord:error-option-missing"},
    "opendiscord:error-option-invalid":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorInvalidOption}, workers:"opendiscord:error-option-invalid"},
    "opendiscord:error-unknown-command":{origin:"slash"|"text"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, error:api.ODTextCommandErrorUnknownCommand}, workers:"opendiscord:error-unknown-command"},
    "opendiscord:error-no-permissions":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, permissions:ODPermissionEmbedType[]}, workers:"opendiscord:error-no-permissions"},
    "opendiscord:error-no-permissions-cooldown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, until?:Date}, workers:"opendiscord:error-no-permissions-cooldown"},
    "opendiscord:error-no-permissions-blacklisted":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-no-permissions-blacklisted"},
    "opendiscord:error-no-permissions-limits":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, limit:"global"|"global-user"|"option"|"option-user"}, workers:"opendiscord:error-no-permissions-limits"},
    "opendiscord:error-responder-timeout":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-responder-timeout"},
    "opendiscord:error-ticket-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-unknown"},
    "opendiscord:error-ticket-deprecated":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-deprecated"},
    "opendiscord:error-option-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-option-unknown"},
    "opendiscord:error-panel-unknown":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-panel-unknown"},
    "opendiscord:error-not-in-guild":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-not-in-guild"},
    "opendiscord:error-channel-rename":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-close"|"ticket-reopen"|"ticket-rename"|"ticket-move"|"ticket-priority"|"ticket-transfer"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, originalName:string, newName:string}, workers:"opendiscord:error-channel-rename"},
    "opendiscord:error-channel-category":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-create"|"ticket-close"|"ticket-reopen"|"ticket-claim"|"ticket-unclaim"|"ticket-move"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, originalCategory:string, newCategory:string}, workers:"opendiscord:error-channel-category"},
    "opendiscord:error-ticket-busy":{origin:"slash"|"text"|"button"|"dropdown"|"modal"|"other", params:{guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:error-ticket-busy"},

    "opendiscord:help-menu":{origin:"slash"|"text"|"button"|"other", params:{mode:"slash"|"text", page:number}, workers:"opendiscord:help-menu"},

    "opendiscord:stats-global":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:stats-global"},
    "opendiscord:stats-ticket":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, scopeData:ODTicket}, workers:"opendiscord:stats-ticket"},
    "opendiscord:stats-user":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, scopeData:discord.User}, workers:"opendiscord:stats-user"|"opendiscord:easter-egg"},
    "opendiscord:stats-reset":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, reason:string|null}, workers:"opendiscord:stats-reset"},
    "opendiscord:stats-ticket-unknown":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, id:string}, workers:"opendiscord:stats-ticket-unknown"},

    "opendiscord:panel":{origin:"slash"|"text"|"sub-panel"|"auto-update"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel, isSubPanel:boolean}, workers:"opendiscord:panel-layout"|"opendiscord:panel-components"},
    "opendiscord:panel-ready":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, panel:ODPanel}, workers:"opendiscord:panel-ready"},

    "opendiscord:ticket-created":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created"},
    "opendiscord:ticket-created-dm":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created-dm"},
    "opendiscord:ticket-created-logs":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-created-logs"},
    "opendiscord:ticket-message":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:ticket-message-layout"|"opendiscord:ticket-message-components"|"opendiscord:ticket-message-disable-components"},
    "opendiscord:close-message":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:close-message"},
    "opendiscord:reopen-message":{origin:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:reopen-message"},
    "opendiscord:delete-message":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:delete-message"},
    "opendiscord:claim-message":{origin:"slash"|"text"|"ticket-message"|"unclaim-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:claim-message"},
    "opendiscord:unclaim-message":{origin:"slash"|"text"|"ticket-message"|"claim-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:unclaim-message"},
    "opendiscord:pin-message":{origin:"slash"|"text"|"ticket-message"|"unpin-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:pin-message"},
    "opendiscord:unpin-message":{origin:"slash"|"text"|"ticket-message"|"pin-message"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:unpin-message"},
    "opendiscord:rename-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:string}, workers:"opendiscord:rename-message"},
    "opendiscord:move-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:ODTicketOption}, workers:"opendiscord:move-message"},
    "opendiscord:add-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:discord.User}, workers:"opendiscord:add-message"},
    "opendiscord:remove-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, data:discord.User}, workers:"opendiscord:remove-message"},
    "opendiscord:ticket-action-dm":{origin:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"priority-message"|"topic-message"|"transfer-message"|"autoclose"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove"|"priority"|"transfer"|"topic", ticket:ODTicket, reason:string|null, additionalData:null|string|discord.User|ODTicketOption, additionalData2?:discord.User}, workers:"opendiscord:ticket-action-dm"},
    "opendiscord:ticket-action-logs":{origin:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"priority-message"|"topic-message"|"transfer-message"|"autoclose"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove"|"priority"|"transfer"|"topic", ticket:ODTicket, reason:string|null, additionalData:null|string|discord.User|ODTicketOption, additionalData2?:discord.User}, workers:"opendiscord:ticket-action-logs"},

    "opendiscord:blacklist-view":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User}, workers:"opendiscord:blacklist-view"},
    "opendiscord:blacklist-get":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User}, workers:"opendiscord:blacklist-get"},
    "opendiscord:blacklist-add":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-add"},
    "opendiscord:blacklist-remove":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-remove"},
    "opendiscord:blacklist-dm":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"add"|"remove", data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-dm"},
    "opendiscord:blacklist-logs":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, mode:"add"|"remove", data:discord.User, reason:string|null}, workers:"opendiscord:blacklist-logs"},

    "opendiscord:transcript-text-ready":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{contents:string}, null>, result:ODTranscriptCompilerCompileResult<{contents:string}>}, workers:"opendiscord:transcript-text-ready"},
    "opendiscord:transcript-html-ready":{origin:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>, result:ODTranscriptCompilerCompileResult<{url:string, availableUntil:Date}>}, workers:"opendiscord:transcript-html-ready"},
    "opendiscord:transcript-html-progress":{origin:"channel"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>, remaining:number}, workers:"opendiscord:transcript-html-progress"},
    "opendiscord:transcript-error":{origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, compiler:ODTranscriptCompiler<any, object|null>, reason:string|null}, workers:"opendiscord:transcript-error"},
    "opendiscord:transcript-history":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, transcriptUser:discord.User, transcriptList:ODTranscriptHistoryData[]}, workers:"opendiscord:transcript-history"},

    "opendiscord:reaction-role":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role"},
    "opendiscord:reaction-role-dm":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role-dm"},
    "opendiscord:reaction-role-logs":{origin:"panel-button"|"other", params:{guild:discord.Guild, user:discord.User, role:ODRole, result:ODRoleUpdateResult[]}, workers:"opendiscord:reaction-role-logs"},

    "opendiscord:clear-verify-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[], inProgress:boolean}, workers:"opendiscord:clear-verify-message"},
    "opendiscord:clear-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[]}, workers:"opendiscord:clear-message"},
    "opendiscord:clear-logs":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:string[]}, workers:"opendiscord:clear-logs"},

    "opendiscord:autoclose-message":{origin:"timeout"|"leave"|"verifybar"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:autoclose-message"},
    "opendiscord:autodelete-message":{origin:"timeout"|"leave"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket}, workers:"opendiscord:autodelete-message"},
    "opendiscord:autoclose-enable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, time:number, reason:string|null}, workers:"opendiscord:autoclose-enable"},
    "opendiscord:autodelete-enable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, time:number, reason:string|null}, workers:"opendiscord:autodelete-enable"},
    "opendiscord:autoclose-disable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:autoclose-disable"},
    "opendiscord:autodelete-disable":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null}, workers:"opendiscord:autodelete-disable"},

    "opendiscord:topic-set":{origin:"slash"|"text"|"ticket-action"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, topic:string}, workers:"opendiscord:topic-set"},
    "opendiscord:priority-set":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, priority:ODPriorityLevel, reason:string|null}, workers:"opendiscord:priority-set"},
    "opendiscord:priority-get":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, priority:ODPriorityLevel}, workers:"opendiscord:priority-get"},
    "opendiscord:transfer-message":{origin:"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, oldCreator:discord.User, newCreator:discord.User, reason:string|null}, workers:"opendiscord:transfer-message"},
}

/**## ODModalManagerIdMappings `interface`
 * A list of all available IDs in the default `ODModalManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODModalManagerIdMappings extends api.ODModalManagerIdConstraint {
    //Deprecated, moved to ODModalComponentManagerIdMappings
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedButtonManager `class
 * A special class with types for the Open Ticket `ODButtonManager` class.
 */
export class ODMappedButtonManager extends api.ODButtonManager<ODButtonManagerIdMappings> {}

/**## ODMappedDropdownManager `class
 * A special class with types for the Open Ticket `ODDropdownManager` class.
 */
export class ODMappedDropdownManager extends api.ODDropdownManager<ODDropdownManagerIdMappings> {}

/**## ODMappedFileManager `class
 * A special class with types for the Open Ticket `ODFileManager` class.
 */
export class ODMappedFileManager extends api.ODFileManager<ODFileManagerIdMappings> {}

/**## ODMappedEmbedManager `class
 * A special class with types for the Open Ticket `ODEmbedManager` class.
 */
export class ODMappedEmbedManager extends api.ODEmbedManager<ODEmbedManagerIdMappings> {}

/**## ODMappedMessageManager `class
 * A special class with types for the Open Ticket `ODMessageManager` class.
 */
export class ODMappedMessageManager extends api.ODMessageManager<ODMessageManagerIdMappings> {}

/**## ODMappedModalManager `class
 * A special class with types for the Open Ticket `ODModalManager` class.
 */
export class ODMappedModalManager extends api.ODModalManager<ODModalManagerIdMappings> {}

/**## ODMappedBuilderManager `class
 * A special class with types for the Open Ticket `ODBuilderManager` class.
 */
export class ODMappedBuilderManager extends api.ODBuilderManager<ODButtonManagerIdMappings, ODDropdownManagerIdMappings, ODFileManagerIdMappings, ODEmbedManagerIdMappings, ODMessageManagerIdMappings, ODModalManagerIdMappings> {}