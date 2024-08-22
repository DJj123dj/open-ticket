///////////////////////////////////////
//BASE MODULE
///////////////////////////////////////
import { ODVersion, ODVersionManager, ODValidId } from "../modules/base"

/**## ODVersionManagerIds_Default `type`
 * This type is an array of ids available in the `ODVersionManager` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVersionManagerIds_Default {
    "openticket:version":ODVersion,
    "openticket:last-version":ODVersion,
    "openticket:api":ODVersion,
    "openticket:transcripts":ODVersion,
    "openticket:livestatus":ODVersion
}

/**## ODFlagManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODFlagManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.flags`!
 */
export class ODVersionManager_Default extends ODVersionManager {
    get<VersionId extends keyof ODVersionManagerIds_Default>(id:VersionId): ODVersionManagerIds_Default[VersionId]
    get(id:ODValidId): ODVersion|null
    
    get(id:ODValidId): ODVersion|null {
        return super.get(id)
    }

    remove<VersionId extends keyof ODVersionManagerIds_Default>(id:VersionId): ODVersionManagerIds_Default[VersionId]
    remove(id:ODValidId): ODVersion|null
    
    remove(id:ODValidId): ODVersion|null {
        return super.remove(id)
    }

    exists(id:keyof ODVersionManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}