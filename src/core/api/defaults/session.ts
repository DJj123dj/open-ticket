///////////////////////////////////////
//DEFAULT SESSION MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODSession, ODSessionManager } from "../modules/session"

/**## ODSessionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODSessionManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSessionManagerIds_Default {
    //"test-session":ODSession
}

/**## ODSessionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODSessionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.sessions`!
 */
export class ODSessionManager_Default extends ODSessionManager {
    get<SessionId extends keyof ODSessionManagerIds_Default>(id:SessionId): ODSessionManagerIds_Default[SessionId]
    get(id:ODValidId): ODSession|null
    
    get(id:ODValidId): ODSession|null {
        return super.get(id)
    }

    remove<SessionId extends keyof ODSessionManagerIds_Default>(id:SessionId): ODSessionManagerIds_Default[SessionId]
    remove(id:ODValidId): ODSession|null
    
    remove(id:ODValidId): ODSession|null {
        return super.remove(id)
    }

    exists(id:keyof ODSessionManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}