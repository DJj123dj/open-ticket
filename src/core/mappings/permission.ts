///////////////////////////////////////
//OPEN TICKET PERMISSION MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODPermissionManagerIdMappings `interface`
 * A list of all available IDs in the default `ODPermissionManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPermissionManagerIdMappings extends api.ODPermissionManagerIdConstraint {
    //"opendiscord:test-permission":api.ODPermission
}

/**## ODPermissionEmbedType `type`
 * A collection of all types available in the `opendiscord:no-permissions` embed.
 */
export type ODPermissionEmbedType = (
    "developer"
    |"owner"
    |"admin"
    |"moderator"
    |"support"
    |"member"
    |"discord-administrator"
)

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedPermissionManager `class
 * A special class with types for the Open Ticket `ODPermissionManager` class.
 */
export class ODMappedPermissionManager extends api.ODPermissionManager<ODPermissionManagerIdMappings> {}