///////////////////////////////////////
//OPEN TICKET STATISTICS MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODStatisticManagerIdMappings `interface`
 * A list of all available IDs in the default `ODStatisticManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatisticManagerIdMappings extends api.ODStatisticManagerIdConstraint {
    "opendiscord:global":ODGlobalStatisticScope,
    "opendiscord:system":ODSystemStatisticScope,
    "opendiscord:user":ODUserStatisticScope,
    "opendiscord:ticket":ODTicketStatisticScope,
    "opendiscord:participants":ODParticipantsStatisticScope,
    "opendiscord:messages":ODMessagesStatisticScope,
}

/////////////////////////////////////////
//STATISTICS MAPPINGS, CATEGORIES & TYPES
/////////////////////////////////////////

/**## ODGlobalStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODGlobalStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODGlobalStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:tickets-created":api.ODBaseStatistic,
    "opendiscord:tickets-closed":api.ODBaseStatistic,
    "opendiscord:tickets-deleted":api.ODBaseStatistic,
    "opendiscord:tickets-reopened":api.ODBaseStatistic,
    "opendiscord:tickets-autoclosed":api.ODBaseStatistic,
    "opendiscord:tickets-autodeleted":api.ODBaseStatistic,
    "opendiscord:tickets-claimed":api.ODBaseStatistic,
    "opendiscord:tickets-pinned":api.ODBaseStatistic,
    "opendiscord:tickets-moved":api.ODBaseStatistic,
    "opendiscord:tickets-transferred":api.ODBaseStatistic,
    "opendiscord:users-blacklisted":api.ODBaseStatistic,
    "opendiscord:transcripts-created":api.ODBaseStatistic,
    "opendiscord:ticket-volume":api.ODDynamicStatistic,
    "opendiscord:average-tickets":api.ODDynamicStatistic,
}

/**## ODSystemStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODSystemStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSystemStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:startup-date":api.ODDynamicStatistic,
    "opendiscord:system-uptime":api.ODDynamicStatistic,
    "opendiscord:version":api.ODDynamicStatistic
}

/**## ODUserStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODUserStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODUserStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:name":api.ODDynamicStatistic,
    "opendiscord:role":api.ODDynamicStatistic,
    "opendiscord:tickets-created":api.ODBaseStatistic,
    "opendiscord:tickets-closed":api.ODBaseStatistic,
    "opendiscord:tickets-deleted":api.ODBaseStatistic,
    "opendiscord:tickets-reopened":api.ODBaseStatistic,
    "opendiscord:tickets-claimed":api.ODBaseStatistic,
    "opendiscord:tickets-pinned":api.ODBaseStatistic,
    "opendiscord:tickets-moved":api.ODBaseStatistic,
    "opendiscord:tickets-transferred":api.ODBaseStatistic,
    "opendiscord:users-blacklisted":api.ODBaseStatistic,
    "opendiscord:transcripts-created":api.ODBaseStatistic,
    "opendiscord:current-tickets":api.ODDynamicStatistic,
}

/**## ODTicketStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODTicketStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTicketStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:name":api.ODDynamicStatistic,
    "opendiscord:status":api.ODDynamicStatistic,
    "opendiscord:claimed":api.ODDynamicStatistic,
    "opendiscord:pinned":api.ODDynamicStatistic,
    "opendiscord:creation-date":api.ODDynamicStatistic,
    "opendiscord:creator":api.ODDynamicStatistic,
    "opendiscord:ticket-age":api.ODDynamicStatistic,
    "opendiscord:response-time":api.ODDynamicStatistic,
    "opendiscord:resolution-time":api.ODDynamicStatistic,
}

/**## ODParticipantsStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODParticipantsStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODParticipantsStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:participants":api.ODDynamicStatistic
}

/**## ODMessagesStatisticScopeIdMappings `interface`
 * A list of all available IDs in the default `ODMessagesStatisticScope` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODMessagesStatisticScopeIdMappings extends api.ODStatisticScopeIdConstraint {
    "opendiscord:count":api.ODDynamicStatistic
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedStatisticManager `class
 * A special class with types for the Open Ticket `ODStatisticManager` class.
 */
export class ODMappedStatisticManager extends api.ODStatisticManager<ODStatisticManagerIdMappings> {}

/**## ODGlobalStatisticScope `class
 * A special class with types for the Open Ticket `Global` statistics category/scope.
 */
export class ODGlobalStatisticScope extends api.ODStatisticGlobalScope<ODGlobalStatisticScopeIdMappings> {}

/**## ODSystemStatisticScope `class
 * A special class with types for the Open Ticket `System` statistics category/scope.
 */
export class ODSystemStatisticScope extends api.ODStatisticGlobalScope<ODSystemStatisticScopeIdMappings> {}

/**## ODUserStatisticScope `class
 * A special class with types for the Open Ticket `User` statistics category/scope.
 */
export class ODUserStatisticScope extends api.ODStatisticScope<ODUserStatisticScopeIdMappings> {}

/**## ODTicketStatisticScope `class
 * A special class with types for the Open Ticket `Ticket` statistics category/scope.
 */
export class ODTicketStatisticScope extends api.ODStatisticScope<ODTicketStatisticScopeIdMappings> {}

/**## ODParticipantsStatisticScope `class
 * A special class with types for the Open Ticket `Participants` statistics category/scope.
 */
export class ODParticipantsStatisticScope extends api.ODStatisticScope<ODParticipantsStatisticScopeIdMappings> {}

/**## ODMessagesStatisticScope `class
 * A special class with types for the Open Ticket `Messages` statistics category/scope.
 */
export class ODMessagesStatisticScope extends api.ODStatisticScope<ODMessagesStatisticScopeIdMappings> {}