///////////////////////////////////////
//DEFAULT PERMISSION MODULE
///////////////////////////////////////
import { ODDebugger } from "../modules/console"
import { ODPermissionManager } from "../modules/permission"

/**## ODPermissionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODPermissionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.permissions`!
 */
export class ODPermissionManager_Default extends ODPermissionManager {
    constructor(debug:ODDebugger){
        super(debug,true)
    }
}

/**## ODPermissionEmbedType `type`
 * This type contains all types available in the `opendiscord:no-permissions` embed.
 */
export type ODPermissionEmbedType = (
    "developer"|
    "owner"|
    "admin"|
    "moderator"|
    "support"|
    "member"|
    "discord-administrator"
)