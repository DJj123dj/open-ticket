///////////////////////////////////////
//OPEN TICKET HELP MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODHelpMenuManagerIdMappings `interface`
 * A list of all available IDs in the default `ODHelpMenuManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerIdMappings extends api.ODHelpMenuManagerIdConstraint {
    "opendiscord:general":ODGeneralHelpMenuCategory,
    "opendiscord:ticket-basic":ODBasicTicketHelpMenuCategory,
    "opendiscord:ticket-advanced":ODAdvancedTicketHelpMenuCategory,
    "opendiscord:ticket-user":ODUserTicketHelpMenuCategory,
    "opendiscord:admin":ODAdminHelpMenuCategory,
    "opendiscord:advanced":ODAdvancedHelpMenuCategory,
    "opendiscord:extra":ODExtraHelpMenuCategory
}

/////////////////////////////////////////
//HELP MENU MAPPINGS, CATEGORIES & TYPES
/////////////////////////////////////////

/**## ODGeneralHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODGeneralHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODGeneralHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:help":api.ODHelpMenuCommandComponent,
    "opendiscord:ticket":api.ODHelpMenuCommandComponent|null
}

/**## ODBasicTicketHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODBasicTicketHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODBasicTicketHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:close":api.ODHelpMenuCommandComponent,
    "opendiscord:delete":api.ODHelpMenuCommandComponent,
    "opendiscord:reopen":api.ODHelpMenuCommandComponent
}

/**## ODAdvancedTicketHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODAdvancedTicketHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODAdvancedTicketHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:pin":api.ODHelpMenuCommandComponent,
    "opendiscord:unpin":api.ODHelpMenuCommandComponent,
    "opendiscord:move":api.ODHelpMenuCommandComponent,
    "opendiscord:rename":api.ODHelpMenuCommandComponent
}

/**## ODUserTicketHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODUserTicketHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODUserTicketHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:claim":api.ODHelpMenuCommandComponent,
    "opendiscord:unclaim":api.ODHelpMenuCommandComponent,
    "opendiscord:add":api.ODHelpMenuCommandComponent,
    "opendiscord:remove":api.ODHelpMenuCommandComponent,
    "opendiscord:transfer":api.ODHelpMenuCommandComponent,
}

/**## ODAdminHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODAdminHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODAdminHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:panel":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-view":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-add":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-remove":api.ODHelpMenuCommandComponent,
    "opendiscord:blacklist-get":api.ODHelpMenuCommandComponent
}

/**## ODAdvancedHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODAdvancedHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODAdvancedHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    "opendiscord:stats-global":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-reset":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-ticket":api.ODHelpMenuCommandComponent,
    "opendiscord:stats-user":api.ODHelpMenuCommandComponent,
    "opendiscord:autoclose-disable":api.ODHelpMenuCommandComponent,
    "opendiscord:autoclose-enable":api.ODHelpMenuCommandComponent,
    "opendiscord:autodelete-disable":api.ODHelpMenuCommandComponent,
    "opendiscord:autodelete-enable":api.ODHelpMenuCommandComponent,
    "opendiscord:topic-set":api.ODHelpMenuCommandComponent,
    "opendiscord:priority-set":api.ODHelpMenuCommandComponent,
    "opendiscord:transcripts":api.ODHelpMenuCommandComponent,
}

/**## ODExtraHelpMenuCategoryIdMappings `interface`
 * A list of all available IDs in the default `ODExtraHelpMenuCategory` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODExtraHelpMenuCategoryIdMappings extends api.ODHelpMenuCategoryIdConstraint {
    //"opendiscord:help-component":api.ODHelpMenuCommandComponent
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedHelpMenuManager `class
 * A special class with types for the Open Ticket `ODHelpMenuManager` class.
 */
export class ODMappedHelpMenuManager extends api.ODHelpMenuManager<ODHelpMenuManagerIdMappings> {}

/**## ODGeneralHelpMenuCategory `class
 * A special class with types for the Open Ticket `General Commands` help menu category.
 */
export class ODGeneralHelpMenuCategory extends api.ODHelpMenuCategory<ODGeneralHelpMenuCategoryIdMappings> {}

/**## ODBasicTicketHelpMenuCategory `class
 * A special class with types for the Open Ticket `Basic Ticket Commands` help menu category.
 */
export class ODBasicTicketHelpMenuCategory extends api.ODHelpMenuCategory<ODBasicTicketHelpMenuCategoryIdMappings> {}

/**## ODAdvancedTicketHelpMenuCategory `class
 * A special class with types for the Open Ticket `Advanced Ticket Commands` help menu category.
 */
export class ODAdvancedTicketHelpMenuCategory extends api.ODHelpMenuCategory<ODAdvancedTicketHelpMenuCategoryIdMappings> {}

/**## ODUserTicketHelpMenuCategory `class
 * A special class with types for the Open Ticket `User ticket Commands` help menu category.
 */
export class ODUserTicketHelpMenuCategory extends api.ODHelpMenuCategory<ODUserTicketHelpMenuCategoryIdMappings> {}

/**## ODAdminHelpMenuCategory `class
 * A special class with types for the Open Ticket `Admin Commands` help menu category.
 */
export class ODAdminHelpMenuCategory extends api.ODHelpMenuCategory<ODAdminHelpMenuCategoryIdMappings> {}

/**## ODAdvancedHelpMenuCategory `class
 * A special class with types for the Open Ticket `Advanced Commands` help menu category.
 */
export class ODAdvancedHelpMenuCategory extends api.ODHelpMenuCategory<ODAdvancedHelpMenuCategoryIdMappings> {}

/**## ODExtraHelpMenuCategory `class
 * A special class with types for the Open Ticket `Extra Commands` help menu category.
 */
export class ODExtraHelpMenuCategory extends api.ODHelpMenuCategory<ODExtraHelpMenuCategoryIdMappings> {}