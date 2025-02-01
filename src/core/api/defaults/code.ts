///////////////////////////////////////
//DEFAULT CODE MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODCode, ODCodeManager } from "../modules/code"

/**## ODCodeManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCodeManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCodeManagerIds_Default {
    "opendiscord:command-error-handling":ODCode,
    "opendiscord:start-listening-interactions":ODCode,
    "opendiscord:panel-database-cleaner":ODCode,
    "opendiscord:suffix-database-cleaner":ODCode,
    "opendiscord:option-database-cleaner":ODCode,
    "opendiscord:user-database-cleaner":ODCode,
    "opendiscord:ticket-database-cleaner":ODCode,
    "opendiscord:panel-auto-update":ODCode,
    "opendiscord:ticket-saver":ODCode,
    "opendiscord:blacklist-saver":ODCode,
    "opendiscord:auto-role-on-join":ODCode,
    "opendiscord:autoclose-timeout":ODCode,
    "opendiscord:autoclose-leave":ODCode,
    "opendiscord:autodelete-timeout":ODCode,
    "opendiscord:autodelete-leave":ODCode,
    "opendiscord:ticket-anti-busy":ODCode,
}

/**## ODCodeManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCodeManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.code`!
 */
export class ODCodeManager_Default extends ODCodeManager {
    get<CodeId extends keyof ODCodeManagerIds_Default>(id:CodeId): ODCodeManagerIds_Default[CodeId]
    get(id:ODValidId): ODCode|null
    
    get(id:ODValidId): ODCode|null {
        return super.get(id)
    }

    remove<CodeId extends keyof ODCodeManagerIds_Default>(id:CodeId): ODCodeManagerIds_Default[CodeId]
    remove(id:ODValidId): ODCode|null
    
    remove(id:ODValidId): ODCode|null {
        return super.remove(id)
    }

    exists(id:keyof ODCodeManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}