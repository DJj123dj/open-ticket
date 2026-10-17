///////////////////////////////////////
//OPENTICKET PRIORITY MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODPriorityManagerIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODPriorityManager` class.
 */
export type ODPriorityManagerIdConstraint = Record<string, ODPriorityLevel>

/**## ODPriorityManagerIdMappings `interface`
 * A list of all available IDs in the default `ODPriorityManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPriorityManagerIdMappings extends ODPriorityManagerIdConstraint {
    "opendiscord:urgent":ODPriorityLevel,
    "opendiscord:very-high":ODPriorityLevel,
    "opendiscord:high":ODPriorityLevel,
    "opendiscord:normal":ODPriorityLevel,
    "opendiscord:low":ODPriorityLevel,
    "opendiscord:very-low":ODPriorityLevel,
    "opendiscord:none":ODPriorityLevel,
}

/**## ODPriorityManager `class`
 * This is an Open Ticket priority manager.
 *
 * This class manages all registered priority levels in the bot.
 *
 * Priorities levels can be changed/updated/translated by plugins to allow for more customisability.
 */
export class ODPriorityManager<IdList extends ODPriorityManagerIdConstraint = ODPriorityManagerIdConstraint>extends api.ODManager<ODPriorityLevel> {
    constructor(debug:api.ODDebugger) {
        super(debug, "priority")
    }

    /**Get an `ODPriorityLevel` from the priority level value. Returns a dummy value when the level doesn't exist. */
    getFromPriorityLevel(level:number) {
        return this.getAll().find((lvl) => lvl.priority === level) ?? new ODPriorityLevel("opendiscord:unknown", -1, "unknown", "UNKNOWN_PRIORITY", "🚫", "🚫")
    }

    /**List the available priority levels. */
    listAvailableLevels() {
        return this.getAll().map((lvl) => lvl.priority)
    }

    get<PriorityId extends keyof api.ODNoGeneric<IdList>>(id:PriorityId): IdList[PriorityId]
    get(id:api.ODValidId): ODPriorityLevel|null

    get(id:api.ODValidId): ODPriorityLevel|null {
        return super.get(id)
    }

    remove<PriorityId extends keyof api.ODNoGeneric<IdList>>(id:PriorityId): IdList[PriorityId]
    remove(id:api.ODValidId): ODPriorityLevel|null

    remove(id:api.ODValidId): ODPriorityLevel|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<IdList>): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODMappedPriorityManager `class
 * A special class with types for the Open Ticket `ODPriorityManager` class.
 */
export class ODMappedPriorityManager extends ODPriorityManager<ODPriorityManagerIdMappings> {}

/**## ODPriorityLevel `class`
 * This is an Open Ticket priority level.
 *
 * Using this class, you can register or edit a priority level for the ticket priority system.
 *
 * Priority levels should be registered in `opendiscord.priorities`.
 *
 * #### 🚨 Negative priorities are treated as `disabled/no-priority`!
 */
export class ODPriorityLevel extends api.ODManagerData {
    /**The priority level itself. A negative number (e.g. `-1`) is treated as `disabled/no-priority`. */
    priority:number
    /**The raw name of the level (used in text/slash command inputs). */
    rawName:string
    /**The display name of the level (used in embeds & messages). */
    displayName:string
    /**The display emoji of the level (used in embeds & messages). */
    displayEmoji:string|null
    /**The emoji added to the channel name when the level is applied to a ticket. */
    channelEmoji:string|null

    constructor(id:api.ODValidId, priority:number, rawName:string, displayName:string, displayEmoji:string|null, channelEmoji:string|null) {
        super(id)
        this.priority = priority
        this.rawName = rawName
        this.displayName = displayName
        this.displayEmoji = displayEmoji
        this.channelEmoji = channelEmoji
    }

    /**Get the display name + emoji for rendering this priority in the UI/embeds. */
    renderDisplayName() {
        return (this.displayEmoji ? this.displayEmoji + " " : "") + this.displayName
    }
}