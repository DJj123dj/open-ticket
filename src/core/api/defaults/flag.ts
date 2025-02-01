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
    "openticket:no-migration":ODFlag,
    "openticket:dev-config":ODFlag,
    "openticket:dev-database":ODFlag,
    "openticket:debug":ODFlag,
    "openticket:crash":ODFlag,
    "openticket:no-transcripts":ODFlag,
    "openticket:no-checker":ODFlag,
    "openticket:checker":ODFlag,
    "openticket:no-easter":ODFlag,
    "openticket:no-plugins":ODFlag,
    "openticket:soft-plugins":ODFlag,
    "openticket:force-slash-update":ODFlag,
    "openticket:no-compile":ODFlag,
    "openticket:compile-only":ODFlag,
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