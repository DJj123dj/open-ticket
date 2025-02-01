///////////////////////////////////////
//DEFAULT CONSOLE MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODLiveStatusUrlSource, ODLiveStatusManager, ODLiveStatusSource } from "../modules/console"

/**## ODLiveStatusManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODLiveStatusManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODLiveStatusManagerIds_Default {
    "opendiscord:default-djdj-dev":ODLiveStatusUrlSource
}

/**## ODLiveStatusManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODLiveStatusManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.livestatus`!
 */
export class ODLiveStatusManager_Default extends ODLiveStatusManager {
    get<LiveStatusId extends keyof ODLiveStatusManagerIds_Default>(id:LiveStatusId): ODLiveStatusManagerIds_Default[LiveStatusId]
    get(id:ODValidId): ODLiveStatusSource|null
    
    get(id:ODValidId): ODLiveStatusSource|null {
        return super.get(id)
    }

    remove<LiveStatusId extends keyof ODLiveStatusManagerIds_Default>(id:LiveStatusId): ODLiveStatusManagerIds_Default[LiveStatusId]
    remove(id:ODValidId): ODLiveStatusSource|null
    
    remove(id:ODValidId): ODLiveStatusSource|null {
        return super.remove(id)
    }

    exists(id:keyof ODLiveStatusManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}