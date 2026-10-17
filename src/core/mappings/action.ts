///////////////////////////////////////
//OPEN TICKET ACTION MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"
import { ODRoleOption, ODTicketOption } from "../api/option.js"
import { ODTicket, ODTicketClearFilter } from "../api/ticket.js"
import { ODTranscriptCompiler, ODTranscriptCompilerCompileResult } from "../api/transcript.js"
import { ODRole, ODRoleUpdateMode, ODRoleUpdateResult } from "../api/role.js"
import { ODPriorityLevel } from "../api/priority.js"
import { ODQuestionAnswer } from "../api/question.js"

/**## ODActionManagerIdMappings `interface`
 * A list of all available IDs in the default `ODActionManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODActionManagerIdMappings extends api.ODActionManagerIdConstraint {
    "opendiscord:create-ticket-permissions":{
        origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild, user:discord.User, option:ODTicketOption},
        result:{valid:boolean, reason:"blacklist"|"cooldown"|"global-limit"|"global-user-limit"|"option-limit"|"option-user-limit"|"custom"|null, cooldownUntil?:Date, customReason?:string},
        workers:"opendiscord:check-blacklist"|"opendiscord:check-cooldown"|"opendiscord:check-global-limits"|"opendiscord:check-option-limits"|"opendiscord:valid"
    },
    "opendiscord:create-transcript":{
        origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket},
        result:{compiler:ODTranscriptCompiler<any, object|null>, success:boolean, result:ODTranscriptCompilerCompileResult<any>, errorReason:string|null, pendingMessage:api.ODResponderSendResult<true>|null, initData:object|null, participants:{user:discord.User, role:"creator"|"participant"|"admin"}[]},
        workers:"opendiscord:select-compiler"|"opendiscord:init-transcript"|"opendiscord:compile-transcript"|"opendiscord:ready-transcript"|"opendiscord:logs"
    },
    "opendiscord:create-ticket":{
        origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild, user:discord.User, option:ODTicketOption, answers:ODQuestionAnswer[]},
        result:{channel:discord.GuildTextBasedChannel, ticket:ODTicket},
        workers:"opendiscord:create-ticket"|"opendiscord:send-ticket-message"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:close-ticket":{
        origin:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, allowCategoryChange?:boolean},
        result:{},
        workers:"opendiscord:close-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:delete-ticket":{
        origin:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, withoutTranscript:boolean},
        result:{},
        workers:"opendiscord:delete-ticket"|"opendiscord:discord-logs"|"opendiscord:delete-channel"|"opendiscord:logs"
    },
    "opendiscord:reopen-ticket":{
        origin:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, allowCategoryChange?:boolean},
        result:{},
        workers:"opendiscord:reopen-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:claim-ticket":{
        origin:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, allowCategoryChange?:boolean},
        result:{},
        workers:"opendiscord:claim-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:unclaim-ticket":{
        origin:"slash"|"text"|"ticket-message"|"claim-message"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, allowCategoryChange?:boolean},
        result:{},
        workers:"opendiscord:unclaim-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:pin-ticket":{
        origin:"slash"|"text"|"ticket-message"|"unpin-message"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean},
        result:{},
        workers:"opendiscord:pin-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:unpin-ticket":{
        origin:"slash"|"text"|"ticket-message"|"pin-message"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean},
        result:{},
        workers:"opendiscord:unpin-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:rename-ticket":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, data:string},
        result:{},
        workers:"opendiscord:rename-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:move-ticket":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, data:ODTicketOption},
        result:{},
        workers:"opendiscord:move-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:add-ticket-user":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, data:discord.User},
        result:{},
        workers:"opendiscord:add-ticket-user"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:remove-ticket-user":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, reason:string|null, sendMessage:boolean, data:discord.User},
        result:{},
        workers:"opendiscord:remove-ticket-user"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:reaction-role":{
        origin:"panel-button"|"other",
        params:{guild:discord.Guild, user:discord.User, option:ODRoleOption, overwriteMode:ODRoleUpdateMode|null},
        result:{result:ODRoleUpdateResult[], role:ODRole},
        workers:"opendiscord:reaction-role"|"opendiscord:logs"
    },
    "opendiscord:clear-tickets":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, filter:ODTicketClearFilter, list:ODTicket[]},
        result:{list:string[]},
        workers:"opendiscord:clear-tickets"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:update-ticket-topic":{
        origin:"slash"|"text"|"ticket-action"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, newTopic:string|null, sendMessage:boolean},
        result:{},
        workers:"opendiscord:update-ticket-topic"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:update-ticket-priority":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, newPriority:ODPriorityLevel, reason:string|null, sendMessage:boolean},
        result:{},
        workers:"opendiscord:update-ticket-priority"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:transfer-ticket":{
        origin:"slash"|"text"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel, user:discord.User, ticket:ODTicket, newCreator:discord.User, reason:string|null, sendMessage:boolean},
        result:{},
        workers:"opendiscord:transfer-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:calculate-ticket-category":{
        origin:"create-ticket"|"close-ticket"|"reopen-ticket"|"claim-ticket"|"unclaim-ticket"|"move-ticket"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel|null, user:discord.User, option:ODTicketOption, ticket:ODTicket|null, currentCategoryId:string|null},
        result:{newCategoryId:string|null, newCategoryMode:string|null, newCategory:discord.CategoryChannel|null, shouldChangeCategory:boolean},
        workers:"opendiscord:default-category"|"opendiscord:close-category"|"opendiscord:claim-category"|"opendiscord:backup-category"
    },
    "opendiscord:calculate-ticket-name":{
        origin:"create-ticket"|"close-ticket"|"reopen-ticket"|"claim-ticket"|"unclaim-ticket"|"move-ticket"|"pin-ticket"|"unpin-ticket"|"rename-ticket"|"transfer-ticket"|"priority-change"|"other",
        params:{guild:discord.Guild, channel:discord.GuildTextBasedChannel|null, user:discord.User, option:ODTicketOption, ticket:ODTicket|null, currentChannelName:string|null},
        result:{newChannelName:string, newChannelSuffix:string, shouldChangeName:boolean},
        workers:"opendiscord:calculate-ticket-name"
    },
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedActionManager `class
 * A special class with types for the Open Ticket `ODActionManager` class.
 */
export class ODMappedActionManager extends api.ODActionManager<ODActionManagerIdMappings> {}