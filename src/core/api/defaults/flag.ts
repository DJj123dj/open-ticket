///////////////////////////////////////
//DEFAULT PROCESS MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODFlagManager, ODFlag } from "../modules/flag"

/**## ODFlagManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODFlagManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFlagManagerIds_Default {
    "opendiscord:no-migration":ODFlag,
    "opendiscord:dev-config":ODFlag,
    "opendiscord:dev-database":ODFlag,
    "opendiscord:debug":ODFlag,
    "opendiscord:crash":ODFlag,
    "opendiscord:no-transcripts":ODFlag,
    "opendiscord:no-checker":ODFlag,
    "opendiscord:checker":ODFlag,
    "opendiscord:no-easter":ODFlag,
    "opendiscord:no-plugins":ODFlag,
    "opendiscord:soft-plugins":ODFlag,
    "opendiscord:force-slash-update":ODFlag,
    "opendiscord:no-compile":ODFlag,
    "opendiscord:compile-only":ODFlag,
}

/**## ODFlagManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFlagManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.flags`!
 */
export class ODFlagManager_Default extends ODFlagManager {
    get<FlagId extends keyof ODFlagManagerIds_Default>(id:FlagId): ODFlagManagerIds_Default[FlagId]
    get(id:ODValidId): ODFlag|null
    
    get(id:ODValidId): ODFlag|null {
        return super.get(id)
    }

    remove<FlagId extends keyof ODFlagManagerIds_Default>(id:FlagId): ODFlagManagerIds_Default[FlagId]
    remove(id:ODValidId): ODFlag|null
    
    remove(id:ODValidId): ODFlag|null {
        return super.remove(id)
    }

    exists(id:keyof ODFlagManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}