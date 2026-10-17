///////////////////////////////////////
//OPENTICKET BLACKLIST MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODBlacklist `class`
 * This is an Open Ticket blacklisted user.
 *
 * This class contains the id of the user this class belongs to & an optional reason for being blacklisted.
 *
 * Create this class & add it to the `ODBlacklistManager` to blacklist someone!
 */
export class ODBlacklist extends api.ODManagerData {
    /**The reason why this user got blacklisted. (optional) */
    private rawReason:string|null

    constructor(id:api.ODValidId, reason:string|null) {
        super(id)
        this.rawReason = reason
    }

    /**The reason why this user got blacklisted. (optional) */
    set reason(reason:string|null) {
        this.rawReason = reason
        this._change()
    }

    get reason() {
        return this.rawReason
    }
}

/**## ODBlacklistManager `class`
 * This is an Open Ticket blacklist manager.
 *
 * This class manages all blacklisted users & their reason. Check if someone is blacklisted using their ID in the `exists()` method.
 *
 * All `ODBlacklist`'s added, removed & edited in this list will be synced automatically with the database.
 */
export class ODBlacklistManager extends api.ODManager<ODBlacklist> {
    constructor(debug:api.ODDebugger) {
        super(debug, "blacklist")
    }
}