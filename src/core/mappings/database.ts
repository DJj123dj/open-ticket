///////////////////////////////////////
//OPEN TICKET DATABASE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODTicketJson } from "../api/ticket.js"
import { ODOptionJson } from "../api/option.js"
import { ODTranscriptHistoryData } from "../api/transcript.js"

/**## ODDatabaseManagerIdMappings `interface`
 * A list of all available IDs in the default `ODDatabaseManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDatabaseManagerIdMappings extends api.ODDatabaseManagerIdConstraint {
    "opendiscord:global":ODGlobalDatabase,
    "opendiscord:stats":ODStatsDatabase,
    "opendiscord:tickets":ODTicketsDatabase,
    "opendiscord:users":ODUsersDatabase,
    "opendiscord:options":ODOptionsDatabase,
    "opendiscord:transcripts":ODTranscriptsDatabase,
    "opendiscord:message-states":ODMessageStatesDatabase,
}

/////////////////////////////////////////
//DATABASE MAPPINGS, CATEGORIES & TYPES
/////////////////////////////////////////

/**## ODGlobalDatabaseIdMappings `interface`
 * A list of all available IDs in the default `ODGlobalDatabase` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODGlobalDatabaseIdMappings extends api.ODDatabaseIdConstraint {
    "opendiscord:option-suffix-counter":number,
    "opendiscord:option-suffix-history":string[],
    "opendiscord:last-version":string
}

/**## ODTicketsDatabaseIdMappings `interface`
 * A list of all available IDs in the default `ODTicketsDatabase` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTicketsDatabaseIdMappings extends api.ODDatabaseIdConstraint {
    "opendiscord:ticket":ODTicketJson
}

/**## ODUsersDatabaseIdMappings `interface`
 * A list of all available IDs in the default `ODUsersDatabase` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODUsersDatabaseIdMappings extends api.ODDatabaseIdConstraint {
    "opendiscord:blacklist":ODTicketJson
}

/**## ODOptionsDatabaseIdMappings `interface`
 * A list of all available IDs in the default `ODOptionsDatabase` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODOptionsDatabaseIdMappings extends api.ODDatabaseIdConstraint {
    "opendiscord:used-option":ODOptionJson
}

/**## ODTranscriptsDatabaseIdMappings `interface`
 * A list of all available IDs in the default `ODTranscriptsDatabase` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTranscriptsDatabaseIdMappings extends api.ODDatabaseIdConstraint {
    "opendiscord:transcript":ODTranscriptHistoryData,
}


/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedDatabaseManager `class
 * A special class with types for the Open Ticket `ODDatabaseManager` class.
 */
export class ODMappedDatabaseManager extends api.ODDatabaseManager<ODDatabaseManagerIdMappings> {}

/**## ODGlobalDatabase `class
 * A special class with types for the Open Ticket `database/global.json` database file
 */
export class ODGlobalDatabase extends api.ODFormattedJsonDatabase<ODGlobalDatabaseIdMappings> {}

/**## ODStatsDatabase `class
 * A special class with types for the Open Ticket `database/stats.json` database file
 */
export class ODStatsDatabase extends api.ODFormattedJsonDatabase {}

/**## ODTicketsDatabase `class
 * A special class with types for the Open Ticket `database/tickets.json` database file
 */
export class ODTicketsDatabase extends api.ODFormattedJsonDatabase<ODTicketsDatabaseIdMappings> {}

/**## ODUsersDatabase `class
 * A special class with types for the Open Ticket `database/users.json` database file
 */
export class ODUsersDatabase extends api.ODFormattedJsonDatabase<ODUsersDatabaseIdMappings> {}

/**## ODOptionsDatabase `class
 * A special class with types for the Open Ticket `database/options.json` database file
 */
export class ODOptionsDatabase extends api.ODFormattedJsonDatabase<ODOptionsDatabaseIdMappings> {}

/**## ODTranscriptsDatabase `class
 * A special class with types for the Open Ticket `database/transcripts.json` database file
 */
export class ODTranscriptsDatabase extends api.ODFormattedJsonDatabase<ODTranscriptsDatabaseIdMappings> {}

/**## ODMessageStatesDatabase `class
 * A special class with types for the Open Ticket `database/states.json` database file
 */
export class ODMessageStatesDatabase extends api.ODFormattedJsonDatabase {}