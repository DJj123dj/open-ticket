///////////////////////////////////////
//DEFAULT ACTION MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODAction, ODActionManager } from "../modules/action"
import { ODWorkerManager_Default } from "./worker"
import * as discord from "discord.js"
import { ODRoleOption, ODTicketOption } from "../openticket/option"
import { ODTicket, ODTicketClearFilter } from "../openticket/ticket"
import { ODTranscriptCompiler, ODTranscriptCompilerCompileResult } from "../openticket/transcript"
import { ODMessageBuildSentResult } from "../modules/builder"
import { ODRole, ODRoleUpdateMode, ODRoleUpdateResult } from "../openticket/role"

/**## ODActionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODActionManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODActionManagerIds_Default {
    "opendiscord:create-ticket-permissions":{
        source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODTicketOption},
        result:{valid:boolean,reason:"blacklist"|"cooldown"|"global-limit"|"global-user-limit"|"option-limit"|"option-user-limit"|null,cooldownUntil?:Date},
        workers:"opendiscord:check-blacklist"|"opendiscord:check-cooldown"|"opendiscord:check-global-limits"|"opendiscord:check-option-limits"|"opendiscord:valid"
    },
    "opendiscord:create-transcript":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},
        result:{compiler:ODTranscriptCompiler<any>, success:boolean, result:ODTranscriptCompilerCompileResult<any>, errorReason:string|null, pendingMessage:ODMessageBuildSentResult<true>|null, participants:{user:discord.User,role:"creator"|"participant"|"admin"}[]},
        workers:"opendiscord:select-compiler"|"opendiscord:init-transcript"|"opendiscord:compile-transcript"|"opendiscord:ready-transcript"|"opendiscord:logs"
    },
    "opendiscord:create-ticket":{
        source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODTicketOption,answers:{id:string,name:string,type:"short"|"paragraph",value:string|null}[]},
        result:{channel:discord.GuildTextBasedChannel,ticket:ODTicket},
        workers:"opendiscord:create-ticket"|"opendiscord:send-ticket-message"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:close-ticket":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:close-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:delete-ticket":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,withoutTranscript:boolean},
        result:{},
        workers:"opendiscord:delete-ticket"|"opendiscord:discord-logs"|"opendiscord:delete-channel"|"opendiscord:logs"
    },
    "opendiscord:reopen-ticket":{
        source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:reopen-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:claim-ticket":{
        source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:claim-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:unclaim-ticket":{
        source:"slash"|"text"|"ticket-message"|"claim-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:unclaim-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:pin-ticket":{
        source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:pin-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:unpin-ticket":{
        source:"slash"|"text"|"ticket-message"|"pin-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"opendiscord:unpin-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:rename-ticket":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:string},
        result:{},
        workers:"opendiscord:rename-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:move-ticket":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:ODTicketOption},
        result:{},
        workers:"opendiscord:move-ticket"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:add-ticket-user":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:discord.User},
        result:{},
        workers:"opendiscord:add-ticket-user"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:remove-ticket-user":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:discord.User},
        result:{},
        workers:"opendiscord:remove-ticket-user"|"opendiscord:discord-logs"|"opendiscord:logs"
    },
    "opendiscord:reaction-role":{
        source:"panel-button"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODRoleOption,overwriteMode:ODRoleUpdateMode|null},
        result:{result:ODRoleUpdateResult[],role:ODRole},
        workers:"opendiscord:reaction-role"|"opendiscord:logs"
    },
    "opendiscord:clear-tickets":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:ODTicket[]},
        result:{list:string[]},
        workers:"opendiscord:clear-tickets"|"opendiscord:discord-logs"|"opendiscord:logs"
    }
}

/**## ODActionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODActionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.actions`!
 */
export class ODActionManager_Default extends ODActionManager {
    get<ActionId extends keyof ODActionManagerIds_Default>(id:ActionId): ODAction_Default<ODActionManagerIds_Default[ActionId]["source"],ODActionManagerIds_Default[ActionId]["params"],ODActionManagerIds_Default[ActionId]["result"],ODActionManagerIds_Default[ActionId]["workers"]>
    get(id:ODValidId): ODAction<string,any,any>|null
    
    get(id:ODValidId): ODAction<string,any,any>|null {
        return super.get(id)
    }

    remove<ActionId extends keyof ODActionManagerIds_Default>(id:ActionId): ODAction_Default<ODActionManagerIds_Default[ActionId]["source"],ODActionManagerIds_Default[ActionId]["params"],ODActionManagerIds_Default[ActionId]["result"],ODActionManagerIds_Default[ActionId]["workers"]>
    remove(id:ODValidId): ODAction<string,any,any>|null
    
    remove(id:ODValidId): ODAction<string,any,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODActionManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODAction_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODAction class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODAction`'s!
 */
export class ODAction_Default<Source extends string, Params extends object, Result extends object, WorkerIds extends string> extends ODAction<Source,Params,Result> {
    declare workers: ODWorkerManager_Default<Result,Source,Params,WorkerIds>
}