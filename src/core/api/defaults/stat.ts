///////////////////////////////////////
//DEFAULT SESSION MODULE
///////////////////////////////////////
import { Guild, TextBasedChannel, User } from "discord.js"
import { ODValidId } from "../modules/base"
import { ODStatScope, ODStatGlobalScope, ODStatsManager, ODStat, ODBasicStat, ODDynamicStat, ODValidStatValue, ODStatScopeSetMode } from "../modules/stat"

/**## ODStatsManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODStatsManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatsManagerIds_Default {
    "opendiscord:global":ODStatGlobalScope_DefaultGlobal,
    "opendiscord:system":ODStatGlobalScope_DefaultSystem,
    "opendiscord:user":ODStatScope_DefaultUser,
    "opendiscord:ticket":ODStatScope_DefaultTicket,
    "opendiscord:participants":ODStatScope_DefaultParticipants
}

/**## ODStatsManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.stats`!
 */
export class ODStatsManager_Default extends ODStatsManager {
    get<StatsId extends keyof ODStatsManagerIds_Default>(id:StatsId): ODStatsManagerIds_Default[StatsId]
    get(id:ODValidId): ODStatScope|null
    
    get(id:ODValidId): ODStatScope|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatsManagerIds_Default>(id:StatsId): ODStatsManagerIds_Default[StatsId]
    remove(id:ODValidId): ODStatScope|null
    
    remove(id:ODValidId): ODStatScope|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatsManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODStatGlobalScopeIds_DefaultGlobal `type`
 * This interface is a list of ids available in the `ODStatGlobalScope_DefaultGlobal` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatGlobalScopeIds_DefaultGlobal {
    "opendiscord:tickets-created":ODBasicStat,
    "opendiscord:tickets-closed":ODBasicStat,
    "opendiscord:tickets-deleted":ODBasicStat,
    "opendiscord:tickets-reopened":ODBasicStat,
    "opendiscord:tickets-autoclosed":ODBasicStat,
    "opendiscord:tickets-autodeleted":ODBasicStat,
    "opendiscord:tickets-claimed":ODBasicStat,
    "opendiscord:tickets-pinned":ODBasicStat,
    "opendiscord:tickets-moved":ODBasicStat,
    "opendiscord:users-blacklisted":ODBasicStat,
    "opendiscord:transcripts-created":ODBasicStat
}

/**## ODStatGlobalScope_DefaultGlobal `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:global` category in `opendiscord.stats`!
 */
export class ODStatGlobalScope_DefaultGlobal extends ODStatGlobalScope {
    get<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): ODStatGlobalScopeIds_DefaultGlobal[StatsId]
    get(id:ODValidId): ODStat|null
    
    get(id:ODValidId): ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): ODStatGlobalScopeIds_DefaultGlobal[StatsId]
    remove(id:ODValidId): ODStat|null
    
    remove(id:ODValidId): ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatGlobalScopeIds_DefaultGlobal): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId): Promise<ODValidStatValue|null>
    getStat(id:ODValidId): Promise<ODValidStatValue|null>

    getStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.getStat(id)
    }

    setStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:StatsId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>
    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>

    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,value,mode)
    }

    resetStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultGlobal>(id:ODValidId): Promise<ODValidStatValue|null>
    resetStat(id:ODValidId): Promise<ODValidStatValue|null>

    resetStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.resetStat(id)
    }
}

/**## ODStatGlobalScopeIds_DefaultSystem `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultSystem` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatGlobalScopeIds_DefaultSystem {
    "opendiscord:startup-date":ODDynamicStat,
    "opendiscord:version":ODDynamicStat
}

/**## ODStatGlobalScope_DefaultSystem `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:system` category in `opendiscord.stats`!
 */
export class ODStatGlobalScope_DefaultSystem extends ODStatGlobalScope {
    get<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): ODStatGlobalScopeIds_DefaultSystem[StatsId]
    get(id:ODValidId): ODStat|null
    
    get(id:ODValidId): ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): ODStatGlobalScopeIds_DefaultSystem[StatsId]
    remove(id:ODValidId): ODStat|null
    
    remove(id:ODValidId): ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatGlobalScopeIds_DefaultSystem): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId): Promise<ODValidStatValue|null>
    getStat(id:ODValidId): Promise<ODValidStatValue|null>

    getStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.getStat(id)
    }

    setStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:StatsId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>
    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>

    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,value,mode)
    }

    resetStat<StatsId extends keyof ODStatGlobalScopeIds_DefaultSystem>(id:ODValidId): Promise<ODValidStatValue|null>
    resetStat(id:ODValidId): Promise<ODValidStatValue|null>

    resetStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.resetStat(id)
    }
}

/**## ODStatScopeIds_DefaultUser `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultUser` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultUser {
    "opendiscord:name":ODDynamicStat,
    "opendiscord:role":ODDynamicStat,
    "opendiscord:tickets-created":ODBasicStat,
    "opendiscord:tickets-closed":ODBasicStat,
    "opendiscord:tickets-deleted":ODBasicStat,
    "opendiscord:tickets-reopened":ODBasicStat,
    "opendiscord:tickets-claimed":ODBasicStat,
    "opendiscord:tickets-pinned":ODBasicStat,
    "opendiscord:tickets-moved":ODBasicStat,
    "opendiscord:users-blacklisted":ODBasicStat,
    "opendiscord:transcripts-created":ODBasicStat
}

/**## ODStatScope_DefaultUser `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:user` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultUser extends ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId): ODStatScopeIds_DefaultUser[StatsId]
    get(id:ODValidId): ODStat|null
    
    get(id:ODValidId): ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId): ODStatScopeIds_DefaultUser[StatsId]
    remove(id:ODValidId): ODStat|null
    
    remove(id:ODValidId): ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultUser): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId, scopeId:string): Promise<ODValidStatValue|null>
    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:StatsId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>
    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>

    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultUser>(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>
    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}

/**## ODStatScopeIds_DefaultTicket `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultTicket` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultTicket {
    "opendiscord:name":ODDynamicStat,
    "opendiscord:status":ODDynamicStat,
    "opendiscord:claimed":ODDynamicStat,
    "opendiscord:pinned":ODDynamicStat,
    "opendiscord:creation-date":ODDynamicStat,
    "opendiscord:creator":ODDynamicStat
}

/**## ODStatScope_DefaultTicket `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultTicket extends ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId): ODStatScopeIds_DefaultTicket[StatsId]
    get(id:ODValidId): ODStat|null
    
    get(id:ODValidId): ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId): ODStatScopeIds_DefaultTicket[StatsId]
    remove(id:ODValidId): ODStat|null
    
    remove(id:ODValidId): ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultTicket): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId, scopeId:string): Promise<ODValidStatValue|null>
    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:StatsId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>
    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>

    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultTicket>(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>
    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}

/**## ODStatScopeIds_DefaultParticipants `type`
 * This interface is a list of ids available in the `ODStatScope_DefaultParticipants` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStatScopeIds_DefaultParticipants {
    "opendiscord:participants":ODDynamicStat
}

/**## ODStatScope_DefaultParticipants `default_class`
 * This is a special class that adds type definitions & typescript to the ODStatsManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:participants` category in `opendiscord.stats`!
 */
export class ODStatScope_DefaultParticipants extends ODStatScope {
    get<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId): ODStatScopeIds_DefaultParticipants[StatsId]
    get(id:ODValidId): ODStat|null
    
    get(id:ODValidId): ODStat|null {
        return super.get(id)
    }

    remove<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId): ODStatScopeIds_DefaultParticipants[StatsId]
    remove(id:ODValidId): ODStat|null
    
    remove(id:ODValidId): ODStat|null {
        return super.remove(id)
    }

    exists(id:keyof ODStatScopeIds_DefaultParticipants): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId, scopeId:string): Promise<ODValidStatValue|null>
    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.getStat(id,scopeId)
    }

    setStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:StatsId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>
    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean>

    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,scopeId,value,mode)
    }

    resetStat<StatsId extends keyof ODStatScopeIds_DefaultParticipants>(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>
    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null>

    resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        return super.resetStat(id,scopeId)
    }
}