///////////////////////////////////////
//DEFAULT RESPONDER MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODButtonResponder, ODButtonResponderInstance, ODButtonResponderManager, ODCommandResponder, ODCommandResponderInstance, ODCommandResponderManager, ODDropdownResponder, ODDropdownResponderInstance, ODDropdownResponderManager, ODModalResponder, ODModalResponderInstance, ODModalResponderManager, ODResponderManager } from "../modules/responder"
import { ODWorkerManager_Default } from "./worker"

/**## ODResponderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODResponderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.responders`!
 */
export class ODResponderManager_Default extends ODResponderManager {
    declare commands: ODCommandResponderManager_Default
    declare buttons: ODButtonResponderManager_Default
    declare dropdowns: ODDropdownResponderManager_Default
    declare modals: ODModalResponderManager_Default
}

/**## ODCommandResponderManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCommandResponderManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCommandResponderManagerIds_Default {
    "openticket:help":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:help"|"openticket:logs"},
    "openticket:stats":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:stats"|"openticket:logs"},
    "openticket:panel":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:panel"|"openticket:logs"},
    "openticket:ticket":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:ticket"|"openticket:logs"},
    "openticket:blacklist":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:blacklist"|"openticket:discord-logs"|"openticket:logs"},
    
    "openticket:close":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:close"|"openticket:logs"},
    "openticket:reopen":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:reopen"|"openticket:logs"},
    "openticket:delete":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:delete"|"openticket:logs"},
    "openticket:claim":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:claim"|"openticket:logs"},
    "openticket:unclaim":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:unclaim"|"openticket:logs"},
    "openticket:pin":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:pin"|"openticket:logs"},
    "openticket:unpin":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:unpin"|"openticket:logs"},

    "openticket:rename":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:rename"|"openticket:logs"},
    "openticket:move":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:move"|"openticket:logs"},
    "openticket:add":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:add"|"openticket:logs"},
    "openticket:remove":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:remove"|"openticket:logs"},
    "openticket:clear":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:clear"|"openticket:logs"},

    "openticket:autoclose":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:autoclose"|"openticket:logs"},
    "openticket:autodelete":{source:"slash"|"text",params:{},workers:"openticket:permissions"|"openticket:autodelete"|"openticket:logs"},
}

/**## ODCommandResponderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCommandResponderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.responders.commands`!
 */
export class ODCommandResponderManager_Default extends ODCommandResponderManager {
    get<CommandResponderId extends keyof ODCommandResponderManagerIds_Default>(id:CommandResponderId): ODCommandResponder_Default<ODCommandResponderManagerIds_Default[CommandResponderId]["source"],ODCommandResponderManagerIds_Default[CommandResponderId]["params"],ODCommandResponderManagerIds_Default[CommandResponderId]["workers"]>
    get(id:ODValidId): ODCommandResponder<"slash"|"text",any>|null
    
    get(id:ODValidId): ODCommandResponder<"slash"|"text",any>|null {
        return super.get(id)
    }

    remove<CommandResponderId extends keyof ODCommandResponderManagerIds_Default>(id:CommandResponderId): ODCommandResponder_Default<ODCommandResponderManagerIds_Default[CommandResponderId]["source"],ODCommandResponderManagerIds_Default[CommandResponderId]["params"],ODCommandResponderManagerIds_Default[CommandResponderId]["workers"]>
    remove(id:ODValidId): ODCommandResponder<"slash"|"text",any>|null
    
    remove(id:ODValidId): ODCommandResponder<"slash"|"text",any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODCommandResponderManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODCommandResponder_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCommandResponder class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODCommandResponder`'s!
 */
export class ODCommandResponder_Default<Source extends "slash"|"text", Params, WorkerIds extends string> extends ODCommandResponder<Source,Params> {
    declare workers: ODWorkerManager_Default<ODCommandResponderInstance,Source,Params,WorkerIds>
}

/**## ODButtonResponderManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODButtonResponderManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODButtonResponderManagerIds_Default {
    "openticket:verifybar-success":{source:"button",params:{},workers:"openticket:handle-verifybar"},
    "openticket:verifybar-failure":{source:"button",params:{},workers:"openticket:handle-verifybar"},

    "openticket:help-menu-switch":{source:"button",params:{},workers:"openticket:update-help-menu"},
    "openticket:help-menu-previous":{source:"button",params:{},workers:"openticket:update-help-menu"},
    "openticket:help-menu-next":{source:"button",params:{},workers:"openticket:update-help-menu"},

    "openticket:ticket-option":{source:"button",params:{},workers:"openticket:ticket-option"},
    "openticket:role-option":{source:"button",params:{},workers:"openticket:role-option"},

    "openticket:claim-ticket":{source:"button",params:{},workers:"openticket:claim-ticket"},
    "openticket:unclaim-ticket":{source:"button",params:{},workers:"openticket:unclaim-ticket"},
    "openticket:pin-ticket":{source:"button",params:{},workers:"openticket:pin-ticket"},
    "openticket:unpin-ticket":{source:"button",params:{},workers:"openticket:unpin-ticket"},
    "openticket:close-ticket":{source:"button",params:{},workers:"openticket:close-ticket"},
    "openticket:reopen-ticket":{source:"button",params:{},workers:"openticket:reopen-ticket"},
    "openticket:delete-ticket":{source:"button",params:{},workers:"openticket:delete-ticket"},

    "openticket:transcript-error-retry":{source:"button",params:{},workers:"openticket:permissions"|"openticket:delete-ticket"|"openticket:logs"},
    "openticket:transcript-error-continue":{source:"button",params:{},workers:"openticket:permissions"|"openticket:delete-ticket"|"openticket:logs"},
    "openticket:clear-continue":{source:"button",params:{},workers:"openticket:clear-continue"},
}

/**## ODButtonResponderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODButtonResponderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.responders.buttons`!
 */
export class ODButtonResponderManager_Default extends ODButtonResponderManager {
    get<ButtonResponderId extends keyof ODButtonResponderManagerIds_Default>(id:ButtonResponderId): ODButtonResponder_Default<ODButtonResponderManagerIds_Default[ButtonResponderId]["source"],ODButtonResponderManagerIds_Default[ButtonResponderId]["params"],ODButtonResponderManagerIds_Default[ButtonResponderId]["workers"]>
    get(id:ODValidId): ODButtonResponder<"button",any>|null
    
    get(id:ODValidId): ODButtonResponder<"button",any>|null {
        return super.get(id)
    }

    remove<ButtonResponderId extends keyof ODButtonResponderManagerIds_Default>(id:ButtonResponderId): ODButtonResponder_Default<ODButtonResponderManagerIds_Default[ButtonResponderId]["source"],ODButtonResponderManagerIds_Default[ButtonResponderId]["params"],ODButtonResponderManagerIds_Default[ButtonResponderId]["workers"]>
    remove(id:ODValidId): ODButtonResponder<"button",any>|null
    
    remove(id:ODValidId): ODButtonResponder<"button",any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODButtonResponderManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODButtonResponder_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODButtonResponder class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODButtonResponder`'s!
 */
export class ODButtonResponder_Default<Source extends string, Params, WorkerIds extends string> extends ODButtonResponder<Source,Params> {
    declare workers: ODWorkerManager_Default<ODButtonResponderInstance,Source,Params,WorkerIds>
}

/**## ODDropdownResponderManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODDropdownResponderManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDropdownResponderManagerIds_Default {
    "openticket:panel-dropdown-tickets":{source:"dropdown",params:{},workers:"openticket:panel-dropdown-tickets"},
}

/**## ODDropdownResponderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDropdownResponderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.responders.dropdowns`!
 */
export class ODDropdownResponderManager_Default extends ODDropdownResponderManager {
    get<DropdownResponderId extends keyof ODDropdownResponderManagerIds_Default>(id:DropdownResponderId): ODDropdownResponder_Default<ODDropdownResponderManagerIds_Default[DropdownResponderId]["source"],ODDropdownResponderManagerIds_Default[DropdownResponderId]["params"],ODDropdownResponderManagerIds_Default[DropdownResponderId]["workers"]>
    get(id:ODValidId): ODDropdownResponder<"dropdown",any>|null
    
    get(id:ODValidId): ODDropdownResponder<"dropdown",any>|null {
        return super.get(id)
    }

    remove<DropdownResponderId extends keyof ODDropdownResponderManagerIds_Default>(id:DropdownResponderId): ODDropdownResponder_Default<ODDropdownResponderManagerIds_Default[DropdownResponderId]["source"],ODDropdownResponderManagerIds_Default[DropdownResponderId]["params"],ODDropdownResponderManagerIds_Default[DropdownResponderId]["workers"]>
    remove(id:ODValidId): ODDropdownResponder<"dropdown",any>|null
    
    remove(id:ODValidId): ODDropdownResponder<"dropdown",any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODDropdownResponderManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODDropdownResponder_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDropdownResponder class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODDropdownResponder`'s!
 */
export class ODDropdownResponder_Default<Source extends string, Params, WorkerIds extends string> extends ODDropdownResponder<Source,Params> {
    declare workers: ODWorkerManager_Default<ODDropdownResponderInstance,Source,Params,WorkerIds>
}

/**## ODModalResponderManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODModalResponderManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODModalResponderManagerIds_Default {
    "openticket:ticket-questions":{source:"modal",params:{},workers:"openticket:ticket-questions"},
    "openticket:close-ticket-reason":{source:"modal",params:{},workers:"openticket:close-ticket-reason"},
    "openticket:reopen-ticket-reason":{source:"modal",params:{},workers:"openticket:reopen-ticket-reason"},
    "openticket:delete-ticket-reason":{source:"modal",params:{},workers:"openticket:delete-ticket-reason"},
    "openticket:claim-ticket-reason":{source:"modal",params:{},workers:"openticket:claim-ticket-reason"},
    "openticket:unclaim-ticket-reason":{source:"modal",params:{},workers:"openticket:unclaim-ticket-reason"},
    "openticket:pin-ticket-reason":{source:"modal",params:{},workers:"openticket:pin-ticket-reason"},
    "openticket:unpin-ticket-reason":{source:"modal",params:{},workers:"openticket:unpin-ticket-reason"},
}

/**## ODModalResponderManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODModalResponderManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.responders.dropdowns`!
 */
export class ODModalResponderManager_Default extends ODModalResponderManager {
    get<ModalResponderId extends keyof ODModalResponderManagerIds_Default>(id:ModalResponderId): ODModalResponder_Default<ODModalResponderManagerIds_Default[ModalResponderId]["source"],ODModalResponderManagerIds_Default[ModalResponderId]["params"],ODModalResponderManagerIds_Default[ModalResponderId]["workers"]>
    get(id:ODValidId): ODModalResponder<"modal",any>|null
    
    get(id:ODValidId): ODModalResponder<"modal",any>|null {
        return super.get(id)
    }

    remove<ModalResponderId extends keyof ODModalResponderManagerIds_Default>(id:ModalResponderId): ODModalResponder_Default<ODModalResponderManagerIds_Default[ModalResponderId]["source"],ODModalResponderManagerIds_Default[ModalResponderId]["params"],ODModalResponderManagerIds_Default[ModalResponderId]["workers"]>
    remove(id:ODValidId): ODModalResponder<"modal",any>|null
    
    remove(id:ODValidId): ODModalResponder<"modal",any>|null {
        return super.remove(id)
    }

    exists(id:keyof ODModalResponderManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODModalResponder_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODModalResponder class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODModalResponder`'s!
 */
export class ODModalResponder_Default<Source extends string, Params, WorkerIds extends string> extends ODModalResponder<Source,Params> {
    declare workers: ODWorkerManager_Default<ODModalResponderInstance,Source,Params,WorkerIds>
}