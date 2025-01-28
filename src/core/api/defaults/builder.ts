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
 * This default class is made for the global variable `openticket.builders`!
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
    "openticket:verifybar-success":{source:"verifybar"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,customData?:string,customColor?:ODValidButtonColor,customLabel?:string,customEmoji?:string},workers:"openticket:verifybar-success"},
    "openticket:verifybar-failure":{source:"verifybar"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,customData?:string,customColor?:ODValidButtonColor,customLabel?:string,customEmoji?:string},workers:"openticket:verifybar-failure"},

    "openticket:error-ticket-deprecated-transcript":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{},workers:"openticket:error-ticket-deprecated-transcript"},
    
    "openticket:help-menu-previous":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu-previous"},
    "openticket:help-menu-next":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu-next"},
    "openticket:help-menu-page":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu-page"}
    "openticket:help-menu-switch":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu-switch"},

    "openticket:ticket-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODTicketOption},workers:"openticket:ticket-option"},
    "openticket:website-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODWebsiteOption},workers:"openticket:website-option"},
    "openticket:role-option":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,option:ODRoleOption},workers:"openticket:role-option"}

    "openticket:visit-ticket":{source:"ticket-created"|"dm"|"logs"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:visit-ticket"},

    "openticket:close-ticket":{source:"ticket-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:close-ticket"},
    "openticket:delete-ticket":{source:"ticket-message"|"close-message"|"autoclose-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:delete-ticket"},
    "openticket:reopen-ticket":{source:"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:reopen-ticket"},
    "openticket:claim-ticket":{source:"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:claim-ticket"},
    "openticket:unclaim-ticket":{source:"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:unclaim-ticket"},
    "openticket:pin-ticket":{source:"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:pin-ticket"},
    "openticket:unpin-ticket":{source:"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:unpin-ticket"},

    "openticket:transcript-html-visit":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"openticket:transcript-html-visit"},
    "openticket:transcript-error-retry":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"openticket:transcript-error-retry"},
    "openticket:transcript-error-continue":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"openticket:transcript-error-continue"},

    "openticket:clear-continue":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-continue"},
}

/**## ODButtonManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODButtonManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.buttons`!
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
    "openticket:panel-dropdown-tickets":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel,options:ODTicketOption[]},workers:"openticket:panel-dropdown-tickets"}
}

/**## ODDropdownManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDropdownManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.dropdowns`!
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
    "openticket:text-transcript":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,result:ODTranscriptCompilerCompileResult<any>},workers:"openticket:text-transcript"}
}

/**## ODFileManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFileManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.files`!
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
    "openticket:error":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:string,layout:"simple"|"advanced"},workers:"openticket:error"},
    "openticket:error-option-missing":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorMissingOption},workers:"openticket:error-option-missing"},
    "openticket:error-option-invalid":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorInvalidOption},workers:"openticket:error-option-invalid"},
    "openticket:error-unknown-command":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorUnknownCommand},workers:"openticket:error-unknown-command"},
    "openticket:error-no-permissions":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,permissions:ODPermissionEmbedType[]},workers:"openticket:error-no-permissions"},
    "openticket:error-no-permissions-cooldown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,until?:Date},workers:"openticket:error-no-permissions-cooldown"},
    "openticket:error-no-permissions-blacklisted":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-no-permissions-blacklisted"},
    "openticket:error-no-permissions-limits":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,limit:"global"|"global-user"|"option"|"option-user"},workers:"openticket:error-no-permissions-limits"},
    "openticket:error-responder-timeout":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-responder-timeout"},
    "openticket:error-ticket-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-unknown"},
    "openticket:error-ticket-deprecated":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-deprecated"},
    "openticket:error-option-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-option-unknown"},
    "openticket:error-panel-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-panel-unknown"},
    "openticket:error-not-in-guild":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-not-in-guild"},
    "openticket:error-channel-rename":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-rename"|"ticket-move"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalName:string,newName:string},workers:"openticket:error-channel-rename"},
    "openticket:error-ticket-busy":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-busy"},

    "openticket:help-menu":{source:"text"|"slash"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu"},
    
    "openticket:stats-global":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:stats-global"},
    "openticket:stats-ticket":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:ODTicket},workers:"openticket:stats-ticket"},
    "openticket:stats-user":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:discord.User},workers:"openticket:stats-user"|"openticket:easter-egg"},
    "openticket:stats-reset":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,reason:string|null},workers:"openticket:stats-reset"},
    "openticket:stats-ticket-unknown":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,id:string},workers:"openticket:stats-ticket-unknown"},
    
    "openticket:panel":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"openticket:panel"},
    "openticket:ticket-created":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created"},
    "openticket:ticket-created-dm":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created-dm"},
    "openticket:ticket-created-logs":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created-logs"},
    "openticket:ticket-message":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-message"},
    "openticket:close-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:close-message"},
    "openticket:reopen-message":{source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:reopen-message"},
    "openticket:delete-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:delete-message"},
    "openticket:claim-message":{source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:claim-message"},
    "openticket:unclaim-message":{source:"slash"|"text"|"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:unclaim-message"},
    "openticket:pin-message":{source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:pin-message"},
    "openticket:unpin-message":{source:"slash"|"text"|"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:unpin-message"},
    "openticket:rename-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:string},workers:"openticket:rename-message"},
    "openticket:move-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:ODTicketOption},workers:"openticket:move-message"},
    "openticket:add-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"openticket:add-message"},
    "openticket:remove-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"openticket:remove-message"},
    "openticket:ticket-action-dm":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"openticket:ticket-action-dm"},
    "openticket:ticket-action-logs":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"openticket:ticket-action-logs"},

    "openticket:blacklist-view":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:blacklist-view"},
    "openticket:blacklist-get":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User},workers:"openticket:blacklist-get"},
    "openticket:blacklist-add":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"openticket:blacklist-add"},
    "openticket:blacklist-remove":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"openticket:blacklist-remove"}
    "openticket:blacklist-dm":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"openticket:blacklist-dm"},
    "openticket:blacklist-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"openticket:blacklist-logs"},

    "openticket:transcript-text-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{contents:string}>,result:ODTranscriptCompilerCompileResult<{contents:string}>},workers:"openticket:transcript-text-ready"},
    "openticket:transcript-html-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"openticket:transcript-html-ready"},
    "openticket:transcript-html-progress":{source:"channel"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,remaining:number},workers:"openticket:transcript-html-progress"},
    "openticket:transcript-error":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"openticket:transcript-error"},

    "openticket:reaction-role":{source:"panel-button"|"other",params:{guild:discord.Guild,user:discord.User,role:ODRole,result:ODRoleUpdateResult[]},workers:"openticket:reaction-role"},
    "openticket:clear-verify-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-verify-message"},
    "openticket:clear-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-message"},
    "openticket:clear-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-logs"},

    "openticket:autoclose-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:autoclose-message"},
    "openticket:autodelete-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:autodelete-message"},
    "openticket:autoclose-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"openticket:autoclose-enable"},
    "openticket:autodelete-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"openticket:autodelete-enable"},
    "openticket:autoclose-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:autoclose-disable"},
    "openticket:autodelete-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:autodelete-disable"},
}

/**## ODEmbedManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODEmbedManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.embeds`!
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
    "openticket:verifybar-ticket-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-ticket-message"},
    "openticket:verifybar-close-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-close-message"},
    "openticket:verifybar-reopen-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-reopen-message"},
    "openticket:verifybar-claim-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-claim-message"},
    "openticket:verifybar-unclaim-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-unclaim-message"},
    "openticket:verifybar-pin-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-pin-message"},
    "openticket:verifybar-unpin-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-unpin-message"}
    "openticket:verifybar-autoclose-message":{source:"verifybar",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>},workers:"openticket:verifybar-autoclose-message"}
    
    "openticket:error":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:string,layout:"simple"|"advanced"},workers:"openticket:error"},
    "openticket:error-option-missing":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorMissingOption},workers:"openticket:error-option-missing"},
    "openticket:error-option-invalid":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorInvalidOption},workers:"openticket:error-option-invalid"},
    "openticket:error-unknown-command":{source:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,error:ODTextCommandErrorUnknownCommand},workers:"openticket:error-unknown-command"},
    "openticket:error-no-permissions":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,permissions:ODPermissionEmbedType[]},workers:"openticket:error-no-permissions"},
    "openticket:error-no-permissions-cooldown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,until?:Date},workers:"openticket:error-no-permissions-cooldown"},
    "openticket:error-no-permissions-blacklisted":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-no-permissions-blacklisted"},
    "openticket:error-no-permissions-limits":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,limit:"global"|"global-user"|"option"|"option-user"},workers:"openticket:error-no-permissions-limits"},
    "openticket:error-responder-timeout":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-responder-timeout"},
    "openticket:error-ticket-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-unknown"},
    "openticket:error-ticket-deprecated":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-deprecated"},
    "openticket:error-option-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-option-unknown"},
    "openticket:error-panel-unknown":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-panel-unknown"},
    "openticket:error-not-in-guild":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-not-in-guild"},
    "openticket:error-channel-rename":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"ticket-pin"|"ticket-unpin"|"ticket-rename"|"ticket-move"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalName:string,newName:string},workers:"openticket:error-channel-rename"},
    "openticket:error-ticket-busy":{source:"slash"|"text"|"button"|"dropdown"|"modal"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:error-ticket-busy"},
    
    "openticket:help-menu":{source:"slash"|"text"|"button"|"other",params:{mode:"slash"|"text",page:number},workers:"openticket:help-menu"},
    
    "openticket:stats-global":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:stats-global"},
    "openticket:stats-ticket":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:ODTicket},workers:"openticket:stats-ticket"},
    "openticket:stats-user":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,scopeData:discord.User},workers:"openticket:stats-user"|"openticket:easter-egg"},
    "openticket:stats-reset":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,reason:string|null},workers:"openticket:stats-reset"},
    "openticket:stats-ticket-unknown":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,id:string},workers:"openticket:stats-ticket-unknown"},
    
    "openticket:panel":{source:"slash"|"text"|"auto-update"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"openticket:panel-layout"|"openticket:panel-components"},
    "openticket:panel-ready":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,panel:ODPanel},workers:"openticket:panel-ready"},
    
    "openticket:ticket-created":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created"},
    "openticket:ticket-created-dm":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created-dm"},
    "openticket:ticket-created-logs":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-created-logs"},
    "openticket:ticket-message":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:ticket-message-layout"|"openticket:ticket-message-components"|"openticket:ticket-message-disable-components"},
    "openticket:close-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"autoclose"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:close-message"},
    "openticket:reopen-message":{source:"slash"|"text"|"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:reopen-message"},
    "openticket:delete-message":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:delete-message"},
    "openticket:claim-message":{source:"slash"|"text"|"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:claim-message"},
    "openticket:unclaim-message":{source:"slash"|"text"|"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:unclaim-message"},
    "openticket:pin-message":{source:"slash"|"text"|"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:pin-message"},
    "openticket:unpin-message":{source:"slash"|"text"|"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:unpin-message"},
    "openticket:rename-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:string},workers:"openticket:rename-message"},
    "openticket:move-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:ODTicketOption},workers:"openticket:move-message"},
    "openticket:add-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"openticket:add-message"},
    "openticket:remove-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null,data:discord.User},workers:"openticket:remove-message"},
    "openticket:ticket-action-dm":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"openticket:ticket-action-dm"},
    "openticket:ticket-action-logs":{source:"slash"|"text"|"ticket-message"|"close-message"|"reopen-message"|"delete-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message"|"autoclose-message"|"autoclose"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"close"|"reopen"|"delete"|"claim"|"unclaim"|"pin"|"unpin"|"rename"|"move"|"add"|"remove",ticket:ODTicket,reason:string|null,additionalData:null|string|discord.User|ODTicketOption},workers:"openticket:ticket-action-logs"},
    
    "openticket:blacklist-view":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User},workers:"openticket:blacklist-view"},
    "openticket:blacklist-get":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User},workers:"openticket:blacklist-get"},
    "openticket:blacklist-add":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"openticket:blacklist-add"},
    "openticket:blacklist-remove":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,data:discord.User,reason:string|null},workers:"openticket:blacklist-remove"},
    "openticket:blacklist-dm":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"openticket:blacklist-dm"},
    "openticket:blacklist-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,mode:"add"|"remove",data:discord.User,reason:string|null},workers:"openticket:blacklist-logs"},

    "openticket:transcript-text-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{contents:string}>,result:ODTranscriptCompilerCompileResult<{contents:string}>},workers:"openticket:transcript-text-ready"},
    "openticket:transcript-html-ready":{source:"channel"|"creator-dm"|"participant-dm"|"active-admin-dm"|"every-admin-dm"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,result:ODTranscriptCompilerCompileResult<{url:string}>},workers:"openticket:transcript-html-ready"},
    "openticket:transcript-html-progress":{source:"channel"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<{url:string}>,remaining:number},workers:"openticket:transcript-html-progress"},
    "openticket:transcript-error":{source:"slash"|"text"|"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"autodelete"|"clear"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,compiler:ODTranscriptCompiler<any>,reason:string|null},workers:"openticket:transcript-error"},

    "openticket:reaction-role":{source:"panel-button"|"other",params:{guild:discord.Guild,user:discord.User,role:ODRole,result:ODRoleUpdateResult[]},workers:"openticket:reaction-role"},
    "openticket:clear-verify-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-verify-message"},
    "openticket:clear-message":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-message"},
    "openticket:clear-logs":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,filter:ODTicketClearFilter,list:string[]},workers:"openticket:clear-logs"},

    "openticket:autoclose-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:autoclose-message"},
    "openticket:autodelete-message":{source:"timeout"|"leave"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:autodelete-message"},
    "openticket:autoclose-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"openticket:autoclose-enable"},
    "openticket:autodelete-enable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,time:number,reason:string|null},workers:"openticket:autodelete-enable"},
    "openticket:autoclose-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:autoclose-disable"},
    "openticket:autodelete-disable":{source:"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.GuildTextBasedChannel,user:discord.User,ticket:ODTicket,reason:string|null},workers:"openticket:autodelete-disable"},
}

/**## ODMessageManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODMessageManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.messages`!
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
    "openticket:ticket-questions":{source:"panel-button"|"panel-dropdown"|"slash"|"text"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,option:ODTicketOption},workers:"openticket:ticket-questions"}
    "openticket:close-ticket-reason":{source:"ticket-message"|"reopen-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:close-ticket-reason"}
    "openticket:reopen-ticket-reason":{source:"ticket-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:reopen-ticket-reason"}
    "openticket:delete-ticket-reason":{source:"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:delete-ticket-reason"}
    "openticket:claim-ticket-reason":{source:"ticket-message"|"unclaim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:claim-ticket-reason"}
    "openticket:unclaim-ticket-reason":{source:"ticket-message"|"claim-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:unclaim-ticket-reason"}
    "openticket:pin-ticket-reason":{source:"ticket-message"|"unpin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:pin-ticket-reason"}
    "openticket:unpin-ticket-reason":{source:"ticket-message"|"pin-message"|"other",params:{guild:discord.Guild,channel:discord.TextBasedChannel,user:discord.User,ticket:ODTicket},workers:"openticket:unpin-ticket-reason"}
}

/**## ODModalManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODModalManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.builders.modals`!
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