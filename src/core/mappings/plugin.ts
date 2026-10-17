///////////////////////////////////////
//OPEN TICKET POST MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODPluginManagerIdMappings `interface`
 * A list of all available IDs in the default `ODPluginManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPluginManagerIdMappings extends api.ODPluginManagerIdConstraint {
    //"opendiscord:example-plugin":api.ODPlugin
}

/**## ODPluginClassManagerIdMappings `interface`
 * A list of all available IDs in the default `ODPluginClassManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPluginClassManagerIdMappings extends api.ODPluginClassManagerIdConstraint {
    //"opendiscord:example-plugin":any
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedPluginManager `class
 * A special class with types for the Open Ticket `ODPluginManager` class.
 */
export class ODMappedPluginManager extends api.ODPluginManager<ODPluginManagerIdMappings, ODPluginClassManagerIdMappings> {}

/**## ODMappedPluginClassManager `class
 * A special class with types for the Open Ticket `ODPluginClassManager` class.
 */
export class ODMappedPluginClassManager extends api.ODPluginClassManager<ODPluginClassManagerIdMappings> {}