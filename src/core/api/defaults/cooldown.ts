///////////////////////////////////////
//DEFAULT COOLDOWN MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODCooldown, ODCooldownManager } from "../modules/cooldown"

/**## ODCooldownManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCooldownManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCooldownManagerIds_Default {
    
}

/**## ODCooldownManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCooldownManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.cooldowns`!
 */
export class ODCooldownManager_Default extends ODCooldownManager {
    get<CooldownId extends keyof ODCooldownManagerIds_Default>(id:CooldownId): ODCooldownManagerIds_Default[CooldownId]
    get(id:ODValidId): ODCooldown<object>|null
    
    get(id:ODValidId): ODCooldown<object>|null {
        return super.get(id)
    }

    remove<CooldownId extends keyof ODCooldownManagerIds_Default>(id:CooldownId): ODCooldownManagerIds_Default[CooldownId]
    remove(id:ODValidId): ODCooldown<object>|null
    
    remove(id:ODValidId): ODCooldown<object>|null {
        return super.remove(id)
    }

    exists(id:keyof ODCooldownManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}