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
import { ODRole, OTRoleUpdateMode, OTRoleUpdateResult } from "../openticket/role"

/**## ODActionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODActionManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODActionManagerIds_Default {
    "openticket:create-ticket-permissions":{
        source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODTicketOption},
        result:{valid:boolean,reason:"blacklist"|"cooldown"|"global-limit"|"global-user-limit"|"option-limit"|"option-user-limit"|null,cooldownUntil?:Date},
        workers:"openticket:check-blacklist"|"openticket:check-cooldown"|"openticket:check-global-limits"|"openticket:check-option-limits"|"openticket:valid"
    },
    "openticket:create-transcript":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},
        result:{compiler:ODTranscriptCompiler<any>, success:boolean, result:ODTranscriptCompilerCompileResult<any>, errorReason:string|null, pendingMessage:ODMessageBuildSentResult<true>|null, participants:{user:discord.User,role:"creator"|"participant"|"admin"}[]},
        workers:"openticket:select-compiler"|"openticket:init-transcript"|"openticket:compile-transcript"|"openticket:ready-transcript"|"openticket:logs"
    },
    "openticket:create-ticket":{
        source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODTicketOption,answers:{id:string,name:string,type:"short"|"paragraph",value:string|null}[]},
        result:{channel:discord.GuildTextBasedChannel,ticket:ODTicket},
        workers:"openticket:create-ticket"|"openticket:send-ticket-message"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:close-ticket":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:close-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:delete-ticket":{
        source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,withoutTranscript:boolean},
        result:{},
        workers:"openticket:delete-ticket"|"openticket:discord-logs"|"openticket:delete-channel"|"openticket:logs"
    },
    "openticket:reopen-ticket":{
        source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:reopen-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:claim-ticket":{
        source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:claim-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:unclaim-ticket":{
        source:"slash"|"text"|"ticket-message"|"claim-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:unclaim-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:pin-ticket":{
        source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:pin-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:unpin-ticket":{
        source:"slash"|"text"|"ticket-message"|"pin-message"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean},
        result:{},
        workers:"openticket:unpin-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:rename-ticket":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:string},
        result:{},
        workers:"openticket:rename-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:move-ticket":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:ODTicketOption},
        result:{},
        workers:"openticket:move-ticket"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:add-ticket-user":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:discord.User},
        result:{},
        workers:"openticket:add-ticket-user"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:remove-ticket-user":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,sendMessage:boolean,data:discord.User},
        result:{},
        workers:"openticket:remove-ticket-user"|"openticket:discord-logs"|"openticket:logs"
    },
    "openticket:reaction-role":{
        source:"panel-button"|"other",
        params:{guild:discord.Guild,user:discord.User,option:ODRoleOption,overwriteMode:OTRoleUpdateMode|null},
        result:{result:OTRoleUpdateResult[],role:ODRole},
        workers:"openticket:reaction-role"|"openticket:logs"
    },
    "openticket:clear-tickets":{
        source:"slash"|"text"|"other",
        params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:ODTicket[]},
        result:{list:string[]},
        workers:"openticket:clear-tickets"|"openticket:discord-logs"|"openticket:logs"
    }
}

/**## ODActionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODActionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.actions`!
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