///////////////////////////////////////
//OPENTICKET BLACKLIST MODULE
///////////////////////////////////////
import { ODManager, ODManagerData, ODValidId } from "../modules/base"
import { ODDebugger } from "../modules/console"

/**## ODBlacklist `class`
 * This is an Open Ticket blacklisted user.
 * 
 * This class contains the id of the user this class belongs to & an optional reason for being blacklisted.
 * 
 * Create this class & add it to the `ODBlacklistManager` to blacklist someone!
 */
export class ODBlacklist extends ODManagerData {
    /**The reason why this user got blacklisted. (optional) */
    #reason: string|null

    constructor(id:ODValidId,reason:string|null){
        super(id)
        this.#reason = reason
    }

    /**The reason why this user got blacklisted. (optional) */
    set reason(reason:string|null) {
        this.#reason = reason
        this._change()
    }
    get reason(){
        return this.#reason
    }
}

/**## ODBlacklistManager `class`
 * This is an Open Ticket blacklist manager.
 * 
 * This class manages all blacklisted users & their reason. Check if someone is blacklisted using their ID in the `exists()` method.
 * 
 * All `ODBlacklist`'s added, removed & edited in this list will be synced automatically with the database.
 */
export class ODBlacklistManager extends ODManager<ODBlacklist> {
    constructor(debug:ODDebugger){
        super(debug,"blacklist")
    }
}