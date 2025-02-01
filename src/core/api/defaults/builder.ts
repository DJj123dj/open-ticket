///////////////////////////////////////
//DEFAULT BUILDER MODULE
///////////////////////////////////////
import { ODValidButtonColor, ODValidId } from "../modules/base"
import { ODBuilderManager, ODButton, ODButtonInstance, ODButtonManager, ODDropdown, ODDropdownInstance, ODDropdownManager, ODEmbed, ODEmbedInstance, ODEmbedManager, ODFile, ODFileInstance, ODFileManager, ODMessage, ODMessageInstance, ODMessageManager, ODModal, ODModalInstance, ODModalManager } from "../modules/builder"
import { ODWorkerManager_Default } from "./worker"
import { ODTicket, ODTicketClearFilter } from "../openticket/ticket"
import { ODPermissionEmbedType } from "../defaults/permission"
import { ODTextCommandErrorInvalidOption, ODTextCommandErrorMissingOption, ODTextCommandErrorUnknownCommand } from "../modules/client"
import { ODPanel } from "../openticket/panel"
import { ODRoleOption, ODTicketOption, ODWebsiteOption } from "../openticket/option"
import { ODVerifyBar } from "../modules/verifybar"
import * as discord from "discord.js"
import { ODTranscriptCompiler, ODTranscriptCompilerCompileResult } from "../openticket/transcript"
import { ODRole, ODRoleUpdateResult } from "../openticket/role"

/**## ODBuilderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODBuilderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders`!
 */
export class ODBuilderManager_Default extends ODBuilderManager {
    declare buttons: ODButtonManager_Default
    declare dropdowns: ODDropdownManager_Default
    declare files: ODFileManager_Default
    declare embeds: ODEmbedManager_Default
    declare messages: ODMessageManager_Default
    declare modals: ODModalManager_Default
}

/**## ODButtonManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODButtonManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODButtonManagerIds_Default {
    "opendiscord:verifybar-success":{source:"verifybar"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,customData?:string,customColor?:ODValidButtonColor,customLabel?:string,customEmoji?:string},workers:"opendiscord:verifybar-success"},
    "opendiscord:verifybar-failure":{source:"verifybar"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,customData?:string,customColor?:ODValidButtonColor,customLabel?:string,customEmoji?:string},workers:"opendiscord:verifybar-failure"},

    "opendiscord:error-ticket-deprecated-transcript":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{},workers:"opendiscord:error-ticket-deprecated-transcript"},
    
    "opendiscord:help-menu-previous":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu-previous"},
    "opendiscord:help-menu-next":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu-next"},
    "opendiscord:help-menu-page":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu-page"}
    "opendiscord:help-menu-switch":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu-switch"},

    "opendiscord:ticket-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODTicketOption},workers:"opendiscord:ticket-option"},
    "opendiscord:website-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODWebsiteOption},workers:"opendiscord:website-option"},
    "opendiscord:role-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODRoleOption},workers:"opendiscord:role-option"}

    "opendiscord:visit-ticket":{source:"ticket-created"|"dm"|"logs"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:visit-ticket"},

    "opendiscord:close-ticket":{source:"ticket-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:close-ticket"},
    "opendiscord:delete-ticket":{source:"ticket-message"|"close-message"|"autoclose-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:delete-ticket"},
    "opendiscord:reopen-ticket":{source:"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:reopen-ticket"},
    "opendiscord:claim-ticket":{source:"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:claim-ticket"},
    "opendiscord:unclaim-ticket":{source:"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:unclaim-ticket"},
    "opendiscord:pin-ticket":{source:"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:pin-ticket"},
    "opendiscord:unpin-ticket":{source:"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:unpin-ticket"},

    "opendiscord:transcript-html-visit":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"opendiscord:transcript-html-visit"},
    "opendiscord:transcript-error-retry":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"opendiscord:transcript-error-retry"},
    "opendiscord:transcript-error-continue":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"opendiscord:transcript-error-continue"},

    "opendiscord:clear-continue":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-continue"},
}

/**## ODButtonManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODButtonManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.buttons`!
 */
export class ODButtonManager_Default extends ODButtonManager {
    get<ButtonId extends keyof ODButtonManagerIds_Default>(id:ButtonId): ODButton_Default<ODButtonManagerIds_Default[ButtonId]["source"],ODButtonManagerIds_Default[ButtonId]["params"],ODButtonManagerIds_Default[ButtonId]["workers"]>
    get(id:ODValidId): ODButton<string,any>|null
    
    get(id:ODValidId): ODButton<string,any>|null {
        return super.get(id)
    }

    remove<ButtonId extends keyof ODButtonManagerIds_Default>(id:ButtonId): ODButton_Default<ODButtonManagerIds_Default[ButtonId]["source"],ODButtonManagerIds_Default[ButtonId]["params"],ODButtonManagerIds_Default[ButtonId]["workers"]>
    remove(id:ODValidId): ODButton<string,any>|null
    
    remove(id:ODValidId): ODButton<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODButtonManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<ButtonId extends keyof ODButtonManagerIds_Default>(id:ButtonId): ODButton_Default<ODButtonManagerIds_Default[ButtonId]["source"],ODButtonManagerIds_Default[ButtonId]["params"],ODButtonManagerIds_Default[ButtonId]["workers"]>
    getSafe(id:ODValidId): ODButton<string,any>
    
    getSafe(id:ODValidId): ODButton<string,any> {
        return super.getSafe(id)
    }
}

/**## ODButton_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODButton class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODButton`'s!
 */
export class ODButton_Default<Source extends string, Params, WorkerIds extends string> extends ODButton<Source,Params> {
    declare workers: ODWorkerManager_Default<ODButtonInstance,Source,Params,WorkerIds>
}

/**## ODDropdownManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODDropdownManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDropdownManagerIds_Default {
    "opendiscord:panel-dropdown-tickets":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,options:ODTicketOption[]},workers:"opendiscord:panel-dropdown-tickets"}
}

/**## ODDropdownManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDropdownManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.dropdowns`!
 */
export class ODDropdownManager_Default extends ODDropdownManager {
    get<DropdownId extends keyof ODDropdownManagerIds_Default>(id:DropdownId): ODDropdown_Default<ODDropdownManagerIds_Default[DropdownId]["source"],ODDropdownManagerIds_Default[DropdownId]["params"],ODDropdownManagerIds_Default[DropdownId]["workers"]>
    get(id:ODValidId): ODDropdown<string,any>|null
    
    get(id:ODValidId): ODDropdown<string,any>|null {
        return super.get(id)
    }

    remove<DropdownId extends keyof ODDropdownManagerIds_Default>(id:DropdownId): ODDropdown_Default<ODDropdownManagerIds_Default[DropdownId]["source"],ODDropdownManagerIds_Default[DropdownId]["params"],ODDropdownManagerIds_Default[DropdownId]["workers"]>
    remove(id:ODValidId): ODDropdown<string,any>|null
    
    remove(id:ODValidId): ODDropdown<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODDropdownManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<DropdownId extends keyof ODDropdownManagerIds_Default>(id:DropdownId): ODDropdown_Default<ODDropdownManagerIds_Default[DropdownId]["source"],ODDropdownManagerIds_Default[DropdownId]["params"],ODDropdownManagerIds_Default[DropdownId]["workers"]>
    getSafe(id:ODValidId): ODDropdown<string,any>
    
    getSafe(id:ODValidId): ODDropdown<string,any> {
        return super.getSafe(id)
    }
}

/**## ODDropdown_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDropdown class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODDropdown`'s!
 */
export class ODDropdown_Default<Source extends string, Params, WorkerIds extends string> extends ODDropdown<Source,Params> {
    declare workers: ODWorkerManager_Default<ODDropdownInstance,Source,Params,WorkerIds>
}

/**## ODFileManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODFileManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFileManagerIds_Default {
    "opendiscord:text-transcript":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,result:ODTranscriptCompilerCompileResult<any>},workers:"opendiscord:text-transcript"}
}

/**## ODFileManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFileManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.files`!
 */
export class ODFileManager_Default extends ODFileManager {
    get<FileId extends keyof ODFileManagerIds_Default>(id:FileId): ODFile_Default<ODFileManagerIds_Default[FileId]["source"],ODFileManagerIds_Default[FileId]["params"],ODFileManagerIds_Default[FileId]["workers"]>
    get(id:ODValidId): ODFile<string,any>|null
    
    get(id:ODValidId): ODFile<string,any>|null {
        return super.get(id)
    }

    remove<FileId extends keyof ODFileManagerIds_Default>(id:FileId): ODFile_Default<ODFileManagerIds_Default[FileId]["source"],ODFileManagerIds_Default[FileId]["params"],ODFileManagerIds_Default[FileId]["workers"]>
    remove(id:ODValidId): ODFile<string,any>|null
    
    remove(id:ODValidId): ODFile<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODFileManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<FileId extends keyof ODFileManagerIds_Default>(id:FileId): ODFile_Default<ODFileManagerIds_Default[FileId]["source"],ODFileManagerIds_Default[FileId]["params"],ODFileManagerIds_Default[FileId]["workers"]>
    getSafe(id:ODValidId): ODFile<string,any>
    
    getSafe(id:ODValidId): ODFile<string,any> {
        return super.getSafe(id)
    }
}

/**## ODFile_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFile class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODFile`'s!
 */
export class ODFile_Default<Source extends string, Params, WorkerIds extends string> extends ODFile<Source,Params> {
    declare workers: ODWorkerManager_Default<ODFileInstance,Source,Params,WorkerIds>
}

/**## ODEmbedManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODEmbedManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODEmbedManagerIds_Default {
    "opendiscord:error":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:string,layout:"simple"|"advanced"},workers:"opendiscord:error"},
    "opendiscord:error-option-missing":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorMissingOption},workers:"opendiscord:error-option-missing"},
    "opendiscord:error-option-invalid":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorInvalidOption},workers:"opendiscord:error-option-invalid"},
    "opendiscord:error-unknown-command":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorUnknownCommand},workers:"opendiscord:error-unknown-command"},
    "opendiscord:error-no-permissions":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,permissions:ODPermissionEmbedType[]},workers:"opendiscord:error-no-permissions"},
    "opendiscord:error-no-permissions-cooldown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,until?:Date},workers:"opendiscord:error-no-permissions-cooldown"},
    "opendiscord:error-no-permissions-blacklisted":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-no-permissions-blacklisted"},
    "opendiscord:error-no-permissions-limits":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,limit:"global"|"global-user"|"option"|"option-user"},workers:"opendiscord:error-no-permissions-limits"},
    "opendiscord:error-responder-timeout":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-responder-timeout"},
    "opendiscord:error-ticket-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-unknown"},
    "opendiscord:error-ticket-deprecated":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-deprecated"},
    "opendiscord:error-option-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-option-unknown"},
    "opendiscord:error-panel-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-panel-unknown"},
    "opendiscord:error-not-in-guild":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-not-in-guild"},
    "opendiscord:error-channel-rename":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-rename"|"ticket-move"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalName:string,newName:string},workers:"opendiscord:error-channel-rename"},
    "opendiscord:error-ticket-busy":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-busy"},

    "opendiscord:help-menu":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu"},
    
    "opendiscord:stats-global":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:stats-global"},
    "opendiscord:stats-ticket":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:ODTicket},workers:"opendiscord:stats-ticket"},
    "opendiscord:stats-user":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:discord.User},workers:"opendiscord:stats-user"|"opendiscord:easter-egg"},
    "opendiscord:stats-reset":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,reason:string|null},workers:"opendiscord:stats-reset"},
    "opendiscord:stats-ticket-unknown":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,id:string},workers:"opendiscord:stats-ticket-unknown"},
    
    "opendiscord:panel":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"opendiscord:panel"},
    "opendiscord:ticket-created":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created"},
    "opendiscord:ticket-created-dm":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created-dm"},
    "opendiscord:ticket-created-logs":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created-logs"},
    "opendiscord:ticket-message":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-message"},
    "opendiscord:close-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:close-message"},
    "opendiscord:reopen-message":{source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:reopen-message"},
    "opendiscord:delete-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:delete-message"},
    "opendiscord:claim-message":{source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:claim-message"},
    "opendiscord:unclaim-message":{source:"slash"|"text"|"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:unclaim-message"},
    "opendiscord:pin-message":{source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:pin-message"},
    "opendiscord:unpin-message":{source:"slash"|"text"|"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:unpin-message"},
    "opendiscord:rename-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:string},workers:"opendiscord:rename-message"},
    "opendiscord:move-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:ODTicketOption},workers:"opendiscord:move-message"},
    "opendiscord:add-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"opendiscord:add-message"},
    "opendiscord:remove-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"opendiscord:remove-message"},
    "opendiscord:ticket-action-dm":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"opendiscord:ticket-action-dm"},
    "opendiscord:ticket-action-logs":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"opendiscord:ticket-action-logs"},

    "opendiscord:blacklist-view":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:blacklist-view"},
    "opendiscord:blacklist-get":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User},workers:"opendiscord:blacklist-get"},
    "opendiscord:blacklist-add":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"opendiscord:blacklist-add"},
    "opendiscord:blacklist-remove":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"opendiscord:blacklist-remove"}
    "opendiscord:blacklist-dm":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"opendiscord:blacklist-dm"},
    "opendiscord:blacklist-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"opendiscord:blacklist-logs"},

    "opendiscord:transcript-text-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{contents:string}>,result:ODTranscriptCompilerCompileResult<{contents:string}>},workers:"opendiscord:transcript-text-ready"},
    "opendiscord:transcript-html-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"opendiscord:transcript-html-ready"},
    "opendiscord:transcript-html-progress":{source:"channel"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,remaining:number},workers:"opendiscord:transcript-html-progress"},
    "opendiscord:transcript-error":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"opendiscord:transcript-error"},

    "opendiscord:reaction-role":{source:"panel-button"|"other",params:{guild:discord.Guild,user:discord.User,role:ODRole,result:ODRoleUpdateResult[]},workers:"opendiscord:reaction-role"},
    "opendiscord:clear-verify-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-verify-message"},
    "opendiscord:clear-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-message"},
    "opendiscord:clear-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-logs"},

    "opendiscord:autoclose-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:autoclose-message"},
    "opendiscord:autodelete-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:autodelete-message"},
    "opendiscord:autoclose-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"opendiscord:autoclose-enable"},
    "opendiscord:autodelete-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"opendiscord:autodelete-enable"},
    "opendiscord:autoclose-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:autoclose-disable"},
    "opendiscord:autodelete-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:autodelete-disable"},
}

/**## ODEmbedManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEmbedManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.embeds`!
 */
export class ODEmbedManager_Default extends ODEmbedManager {
    get<EmbedId extends keyof ODEmbedManagerIds_Default>(id:EmbedId): ODEmbed_Default<ODEmbedManagerIds_Default[EmbedId]["source"],ODEmbedManagerIds_Default[EmbedId]["params"],ODEmbedManagerIds_Default[EmbedId]["workers"]>
    get(id:ODValidId): ODEmbed<string,any>|null
    
    get(id:ODValidId): ODEmbed<string,any>|null {
        return super.get(id)
    }

    remove<EmbedId extends keyof ODEmbedManagerIds_Default>(id:EmbedId): ODEmbed_Default<ODEmbedManagerIds_Default[EmbedId]["source"],ODEmbedManagerIds_Default[EmbedId]["params"],ODEmbedManagerIds_Default[EmbedId]["workers"]>
    remove(id:ODValidId): ODEmbed<string,any>|null
    
    remove(id:ODValidId): ODEmbed<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODEmbedManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<EmbedId extends keyof ODEmbedManagerIds_Default>(id:EmbedId): ODEmbed_Default<ODEmbedManagerIds_Default[EmbedId]["source"],ODEmbedManagerIds_Default[EmbedId]["params"],ODEmbedManagerIds_Default[EmbedId]["workers"]>
    getSafe(id:ODValidId): ODEmbed<string,any>
    
    getSafe(id:ODValidId): ODEmbed<string,any> {
        return super.getSafe(id)
    }
}

/**## ODEmbed_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEmbed class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODEmbed`'s!
 */
export class ODEmbed_Default<Source extends string, Params, WorkerIds extends string> extends ODEmbed<Source,Params> {
    declare workers: ODWorkerManager_Default<ODEmbedInstance,Source,Params,WorkerIds>
}

/**## ODMessageManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODMessageManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODMessageManagerIds_Default {
    "opendiscord:verifybar-ticket-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-ticket-message"},
    "opendiscord:verifybar-close-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-close-message"},
    "opendiscord:verifybar-reopen-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-reopen-message"},
    "opendiscord:verifybar-claim-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-claim-message"},
    "opendiscord:verifybar-unclaim-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-unclaim-message"},
    "opendiscord:verifybar-pin-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-pin-message"},
    "opendiscord:verifybar-unpin-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-unpin-message"}
    "opendiscord:verifybar-autoclose-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"opendiscord:verifybar-autoclose-message"}
    
    "opendiscord:error":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:string,layout:"simple"|"advanced"},workers:"opendiscord:error"},
    "opendiscord:error-option-missing":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorMissingOption},workers:"opendiscord:error-option-missing"},
    "opendiscord:error-option-invalid":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorInvalidOption},workers:"opendiscord:error-option-invalid"},
    "opendiscord:error-unknown-command":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorUnknownCommand},workers:"opendiscord:error-unknown-command"},
    "opendiscord:error-no-permissions":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,permissions:ODPermissionEmbedType[]},workers:"opendiscord:error-no-permissions"},
    "opendiscord:error-no-permissions-cooldown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,until?:Date},workers:"opendiscord:error-no-permissions-cooldown"},
    "opendiscord:error-no-permissions-blacklisted":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-no-permissions-blacklisted"},
    "opendiscord:error-no-permissions-limits":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,limit:"global"|"global-user"|"option"|"option-user"},workers:"opendiscord:error-no-permissions-limits"},
    "opendiscord:error-responder-timeout":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-responder-timeout"},
    "opendiscord:error-ticket-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-unknown"},
    "opendiscord:error-ticket-deprecated":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-deprecated"},
    "opendiscord:error-option-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-option-unknown"},
    "opendiscord:error-panel-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-panel-unknown"},
    "opendiscord:error-not-in-guild":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-not-in-guild"},
    "opendiscord:error-channel-rename":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-rename"|"ticket-move"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalName:string,newName:string},workers:"opendiscord:error-channel-rename"},
    "opendiscord:error-ticket-busy":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:error-ticket-busy"},
    
    "opendiscord:help-menu":{source:"slash"|"text"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"opendiscord:help-menu"},
    
    "opendiscord:stats-global":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:stats-global"},
    "opendiscord:stats-ticket":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:ODTicket},workers:"opendiscord:stats-ticket"},
    "opendiscord:stats-user":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:discord.User},workers:"opendiscord:stats-user"|"opendiscord:easter-egg"},
    "opendiscord:stats-reset":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,reason:string|null},workers:"opendiscord:stats-reset"},
    "opendiscord:stats-ticket-unknown":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,id:string},workers:"opendiscord:stats-ticket-unknown"},
    
    "opendiscord:panel":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"opendiscord:panel-layout"|"opendiscord:panel-components"},
    "opendiscord:panel-ready":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"opendiscord:panel-ready"},
    
    "opendiscord:ticket-created":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created"},
    "opendiscord:ticket-created-dm":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created-dm"},
    "opendiscord:ticket-created-logs":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-created-logs"},
    "opendiscord:ticket-message":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:ticket-message-layout"|"opendiscord:ticket-message-components"|"opendiscord:ticket-message-disable-components"},
    "opendiscord:close-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:close-message"},
    "opendiscord:reopen-message":{source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:reopen-message"},
    "opendiscord:delete-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:delete-message"},
    "opendiscord:claim-message":{source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:claim-message"},
    "opendiscord:unclaim-message":{source:"slash"|"text"|"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:unclaim-message"},
    "opendiscord:pin-message":{source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:pin-message"},
    "opendiscord:unpin-message":{source:"slash"|"text"|"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:unpin-message"},
    "opendiscord:rename-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:string},workers:"opendiscord:rename-message"},
    "opendiscord:move-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:ODTicketOption},workers:"opendiscord:move-message"},
    "opendiscord:add-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"opendiscord:add-message"},
    "opendiscord:remove-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"opendiscord:remove-message"},
    "opendiscord:ticket-action-dm":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"opendiscord:ticket-action-dm"},
    "opendiscord:ticket-action-logs":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"opendiscord:ticket-action-logs"},
    
    "opendiscord:blacklist-view":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:blacklist-view"},
    "opendiscord:blacklist-get":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User},workers:"opendiscord:blacklist-get"},
    "opendiscord:blacklist-add":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"opendiscord:blacklist-add"},
    "opendiscord:blacklist-remove":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"opendiscord:blacklist-remove"},
    "opendiscord:blacklist-dm":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"opendiscord:blacklist-dm"},
    "opendiscord:blacklist-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"opendiscord:blacklist-logs"},

    "opendiscord:transcript-text-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{contents:string}>,result:ODTranscriptCompilerCompileResult<{contents:string}>},workers:"opendiscord:transcript-text-ready"},
    "opendiscord:transcript-html-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"opendiscord:transcript-html-ready"},
    "opendiscord:transcript-html-progress":{source:"channel"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,remaining:number},workers:"opendiscord:transcript-html-progress"},
    "opendiscord:transcript-error":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"opendiscord:transcript-error"},

    "opendiscord:reaction-role":{source:"panel-button"|"other",params:{guild:discord.Guild,user:discord.User,role:ODRole,result:ODRoleUpdateResult[]},workers:"opendiscord:reaction-role"},
    "opendiscord:clear-verify-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-verify-message"},
    "opendiscord:clear-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-message"},
    "opendiscord:clear-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"opendiscord:clear-logs"},

    "opendiscord:autoclose-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:autoclose-message"},
    "opendiscord:autodelete-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:autodelete-message"},
    "opendiscord:autoclose-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"opendiscord:autoclose-enable"},
    "opendiscord:autodelete-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"opendiscord:autodelete-enable"},
    "opendiscord:autoclose-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:autoclose-disable"},
    "opendiscord:autodelete-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"opendiscord:autodelete-disable"},
}

/**## ODMessageManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODMessageManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.messages`!
 */
export class ODMessageManager_Default extends ODMessageManager {
    get<MessageId extends keyof ODMessageManagerIds_Default>(id:MessageId): ODMessage_Default<ODMessageManagerIds_Default[MessageId]["source"],ODMessageManagerIds_Default[MessageId]["params"],ODMessageManagerIds_Default[MessageId]["workers"]>
    get(id:ODValidId): ODMessage<string,any>|null
    
    get(id:ODValidId): ODMessage<string,any>|null {
        return super.get(id)
    }

    remove<MessageId extends keyof ODMessageManagerIds_Default>(id:MessageId): ODMessage_Default<ODMessageManagerIds_Default[MessageId]["source"],ODMessageManagerIds_Default[MessageId]["params"],ODMessageManagerIds_Default[MessageId]["workers"]>
    remove(id:ODValidId): ODMessage<string,any>|null
    
    remove(id:ODValidId): ODMessage<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODMessageManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<MessageId extends keyof ODMessageManagerIds_Default>(id:MessageId): ODMessage_Default<ODMessageManagerIds_Default[MessageId]["source"],ODMessageManagerIds_Default[MessageId]["params"],ODMessageManagerIds_Default[MessageId]["workers"]>
    getSafe(id:ODValidId): ODMessage<string,any>
    
    getSafe(id:ODValidId): ODMessage<string,any> {
        return super.getSafe(id)
    }
}

/**## ODMessage_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODMessage class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODMessage`'s!
 */
export class ODMessage_Default<Source extends string, Params, WorkerIds extends string> extends ODMessage<Source,Params> {
    declare workers: ODWorkerManager_Default<ODMessageInstance,Source,Params,WorkerIds>
}

/**## ODModalManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODModalManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODModalManagerIds_Default {
    "opendiscord:ticket-questions":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,option:ODTicketOption},workers:"opendiscord:ticket-questions"}
    "opendiscord:close-ticket-reason":{source:"ticket-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:close-ticket-reason"}
    "opendiscord:reopen-ticket-reason":{source:"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:reopen-ticket-reason"}
    "opendiscord:delete-ticket-reason":{source:"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:delete-ticket-reason"}
    "opendiscord:claim-ticket-reason":{source:"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:claim-ticket-reason"}
    "opendiscord:unclaim-ticket-reason":{source:"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:unclaim-ticket-reason"}
    "opendiscord:pin-ticket-reason":{source:"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:pin-ticket-reason"}
    "opendiscord:unpin-ticket-reason":{source:"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"opendiscord:unpin-ticket-reason"}
}

/**## ODModalManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODModalManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.builders.modals`!
 */
export class ODModalManager_Default extends ODModalManager {
    get<ModalId extends keyof ODModalManagerIds_Default>(id:ModalId): ODModal_Default<ODModalManagerIds_Default[ModalId]["source"],ODModalManagerIds_Default[ModalId]["params"],ODModalManagerIds_Default[ModalId]["workers"]>
    get(id:ODValidId): ODModal<string,any>|null
    
    get(id:ODValidId): ODModal<string,any>|null {
        return super.get(id)
    }

    remove<ModalId extends keyof ODModalManagerIds_Default>(id:ModalId): ODModal_Default<ODModalManagerIds_Default[ModalId]["source"],ODModalManagerIds_Default[ModalId]["params"],ODModalManagerIds_Default[ModalId]["workers"]>
    remove(id:ODValidId): ODModal<string,any>|null
    
    remove(id:ODValidId): ODModal<string,any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODModalManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getSafe<ModalId extends keyof ODModalManagerIds_Default>(id:ModalId): ODModal_Default<ODModalManagerIds_Default[ModalId]["source"],ODModalManagerIds_Default[ModalId]["params"],ODModalManagerIds_Default[ModalId]["workers"]>
    getSafe(id:ODValidId): ODModal<string,any>
    
    getSafe(id:ODValidId): ODModal<string,any> {
        return super.getSafe(id)
    }
}

/**## ODModal_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODModal class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODModal`'s!
 */
export class ODModal_Default<Source extends string, Params, WorkerIds extends string> extends ODModal<Source,Params> {
    declare workers: ODWorkerManager_Default<ODModalInstance,Source,Params,WorkerIds>
}