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
    "opendiscord:help":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:help"|"opendiscord:logs"},
    "opendiscord:stats":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:stats"|"opendiscord:logs"},
    "opendiscord:panel":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:panel"|"opendiscord:logs"},
    "opendiscord:ticket":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:ticket"|"opendiscord:logs"},
    "opendiscord:blacklist":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:blacklist"|"opendiscord:discord-logs"|"opendiscord:logs"},
    
    "opendiscord:close":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:close"|"opendiscord:logs"},
    "opendiscord:reopen":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:reopen"|"opendiscord:logs"},
    "opendiscord:delete":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:delete"|"opendiscord:logs"},
    "opendiscord:claim":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:claim"|"opendiscord:logs"},
    "opendiscord:unclaim":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:unclaim"|"opendiscord:logs"},
    "opendiscord:pin":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:pin"|"opendiscord:logs"},
    "opendiscord:unpin":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:unpin"|"opendiscord:logs"},

    "opendiscord:rename":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:rename"|"opendiscord:logs"},
    "opendiscord:move":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:move"|"opendiscord:logs"},
    "opendiscord:add":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:add"|"opendiscord:logs"},
    "opendiscord:remove":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:remove"|"opendiscord:logs"},
    "opendiscord:clear":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:clear"|"opendiscord:logs"},

    "opendiscord:autoclose":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:autoclose"|"opendiscord:logs"},
    "opendiscord:autodelete":{source:"slash"|"text",params:{},workers:"opendiscord:permissions"|"opendiscord:autodelete"|"opendiscord:logs"},
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
    "opendiscord:verifybar-success":{source:"button",params:{},workers:"opendiscord:handle-verifybar"},
    "opendiscord:verifybar-failure":{source:"button",params:{},workers:"opendiscord:handle-verifybar"},

    "opendiscord:help-menu-switch":{source:"button",params:{},workers:"opendiscord:update-help-menu"},
    "opendiscord:help-menu-previous":{source:"button",params:{},workers:"opendiscord:update-help-menu"},
    "opendiscord:help-menu-next":{source:"button",params:{},workers:"opendiscord:update-help-menu"},

    "opendiscord:ticket-option":{source:"button",params:{},workers:"opendiscord:ticket-option"},
    "opendiscord:role-option":{source:"button",params:{},workers:"opendiscord:role-option"},

    "opendiscord:claim-ticket":{source:"button",params:{},workers:"opendiscord:claim-ticket"},
    "opendiscord:unclaim-ticket":{source:"button",params:{},workers:"opendiscord:unclaim-ticket"},
    "opendiscord:pin-ticket":{source:"button",params:{},workers:"opendiscord:pin-ticket"},
    "opendiscord:unpin-ticket":{source:"button",params:{},workers:"opendiscord:unpin-ticket"},
    "opendiscord:close-ticket":{source:"button",params:{},workers:"opendiscord:close-ticket"},
    "opendiscord:reopen-ticket":{source:"button",params:{},workers:"opendiscord:reopen-ticket"},
    "opendiscord:delete-ticket":{source:"button",params:{},workers:"opendiscord:delete-ticket"},

    "opendiscord:transcript-error-retry":{source:"button",params:{},workers:"opendiscord:permissions"|"opendiscord:delete-ticket"|"opendiscord:logs"},
    "opendiscord:transcript-error-continue":{source:"button",params:{},workers:"opendiscord:permissions"|"opendiscord:delete-ticket"|"opendiscord:logs"},
    "opendiscord:clear-continue":{source:"button",params:{},workers:"opendiscord:clear-continue"},
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
    "opendiscord:panel-dropdown-tickets":{source:"dropdown",params:{},workers:"opendiscord:panel-dropdown-tickets"},
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
    "opendiscord:ticket-questions":{source:"modal",params:{},workers:"opendiscord:ticket-questions"},
    "opendiscord:close-ticket-reason":{source:"modal",params:{},workers:"opendiscord:close-ticket-reason"},
    "opendiscord:reopen-ticket-reason":{source:"modal",params:{},workers:"opendiscord:reopen-ticket-reason"},
    "opendiscord:delete-ticket-reason":{source:"modal",params:{},workers:"opendiscord:delete-ticket-reason"},
    "opendiscord:claim-ticket-reason":{source:"modal",params:{},workers:"opendiscord:claim-ticket-reason"},
    "opendiscord:unclaim-ticket-reason":{source:"modal",params:{},workers:"opendiscord:unclaim-ticket-reason"},
    "opendiscord:pin-ticket-reason":{source:"modal",params:{},workers:"opendiscord:pin-ticket-reason"},
    "opendiscord:unpin-ticket-reason":{source:"modal",params:{},workers:"opendiscord:unpin-ticket-reason"},
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