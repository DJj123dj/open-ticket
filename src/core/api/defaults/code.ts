///////////////////////////////////////
//DEFAULT CODE MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODCode, ODCodeManager } from "../modules/code"

/**## ODCodeManagerIds_Default `type`
 * This type is an array of ids available in the `ODCodeManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCodeManagerIds_Default {
    "openticket:command-error-handling":ODCode,
    "openticket:start-listening-interactions":ODCode,
    "openticket:panel-database-cleaner":ODCode,
    "openticket:suffix-database-cleaner":ODCode,
    "openticket:option-database-cleaner":ODCode,
    "openticket:user-database-cleaner":ODCode,
    "openticket:ticket-database-cleaner":ODCode,
    "openticket:panel-auto-update":ODCode,
    "openticket:ticket-saver":ODCode,
    "openticket:blacklist-saver":ODCode,
    "openticket:auto-role-on-join":ODCode,
    "openticket:autoclose-timeout":ODCode,
    "openticket:autoclose-leave":ODCode,
    "openticket:autodelete-timeout":ODCode,
    "openticket:autodelete-leave":ODCode
}

/**## ODCodeManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCodeManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.code`!
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