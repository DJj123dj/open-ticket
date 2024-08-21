///////////////////////////////////////
//DEFAULT DATABASE MODULE
///////////////////////////////////////
import { ODValidId, ODValidJsonType } from "../modules/base"
import { ODDatabaseManager, ODDatabase, ODFormattedJsonDatabase } from "../modules/database"
import { ODTicketJson } from "../openticket/ticket"
import { ODOptionJson } from "../openticket/option"

/**## ODDatabaseManagerIds_Default `type`
 * This type is an array of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDatabaseManagerIds_Default {
    "openticket:global":ODFormattedJsonDatabase_DefaultGlobal,
    "openticket:stats":ODFormattedJsonDatabase,
    "openticket:tickets":ODFormattedJsonDatabase_DefaultTickets,
    "openticket:users":ODFormattedJsonDatabase_DefaultUsers,
    "openticket:options":ODFormattedJsonDatabase_DefaultOptions,
}

/**## ODDatabaseManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODDatabaseManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.databases`!
 */
export class ODDatabaseManager_Default extends ODDatabaseManager {
    get<DatabaseId extends keyof ODDatabaseManagerIds_Default>(id:DatabaseId): ODDatabaseManagerIds_Default[DatabaseId]
    get(id:ODValidId): ODDatabase|null

    get(id:ODValidId): ODDatabase|null {
        return super.get(id)
    }

    remove<DatabaseId extends keyof ODDatabaseManagerIds_Default>(id:DatabaseId): ODDatabaseManagerIds_Default[DatabaseId]
    remove(id:ODValidId): ODDatabase|null

    remove(id:ODValidId): ODDatabase|null {
        return super.remove(id)
    }

    exists(id:keyof ODDatabaseManagerIds_Default): boolean
    exists(id:ODValidId): boolean

    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultGlobal `type`
 * This type is an array of ids available in the `ODFormattedJsonDatabase_DefaultGlobal` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultGlobal {
    "openticket:panel-update":string,
    "openticket:option-suffix-counter":number,
    "openticket:option-suffix-history":string[],
    "openticket:last-version":string
}

/**## ODFormattedJsonDatabase_DefaultGlobal `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `global.json` database!
 */
export class ODFormattedJsonDatabase_DefaultGlobal extends ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]): boolean
    set(category:string, key:string, value:ODValidJsonType): boolean
    
    set(category:string, key:string, value:ODValidJsonType): boolean {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string): ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]|undefined
    get(category:string, key:string): ODValidJsonType|undefined

    get(category:string, key:string): ODValidJsonType|undefined {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId, key:string): boolean
    delete(category:string, key:string): boolean

    delete(category:string, key:string): boolean {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultGlobal, key:string): boolean
    exists(category:string, key:string): boolean

    exists(category:string, key:string): boolean {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultGlobal>(category:CategoryId): {key:string, value:ODFormattedJsonDatabaseIds_DefaultGlobal[CategoryId]}[]|undefined
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined
    
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        return super.getCategory(category)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultTickets `type`
 * This type is an array of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultTickets {
    "openticket:ticket":ODTicketJson
}

/**## ODFormattedJsonDatabase_DefaultTickets `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `tickets.json` database!
 */
export class ODFormattedJsonDatabase_DefaultTickets extends ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]): boolean
    set(category:string, key:string, value:ODValidJsonType): boolean
    
    set(category:string, key:string, value:ODValidJsonType): boolean {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string): ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]|undefined
    get(category:string, key:string): ODValidJsonType|undefined

    get(category:string, key:string): ODValidJsonType|undefined {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId, key:string): boolean
    delete(category:string, key:string): boolean

    delete(category:string, key:string): boolean {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultTickets, key:string): boolean
    exists(category:string, key:string): boolean

    exists(category:string, key:string): boolean {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultTickets>(category:CategoryId): {key:string, value:ODFormattedJsonDatabaseIds_DefaultTickets[CategoryId]}[]|undefined
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined
    
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        return super.getCategory(category)
    }
}

/**## ODFormattedJsonDatabaseIds_DefaultUsers `type`
 * This type is an array of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultUsers {
    "openticket:blacklist":ODTicketJson
}

/**## ODFormattedJsonDatabase_DefaultUsers `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `users.json` database!
 */
export class ODFormattedJsonDatabase_DefaultUsers extends ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]): boolean
    set(category:string, key:string, value:ODValidJsonType): boolean
    
    set(category:string, key:string, value:ODValidJsonType): boolean {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string): ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]|undefined
    get(category:string, key:string): ODValidJsonType|undefined

    get(category:string, key:string): ODValidJsonType|undefined {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId, key:string): boolean
    delete(category:string, key:string): boolean

    delete(category:string, key:string): boolean {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultUsers, key:string): boolean
    exists(category:string, key:string): boolean

    exists(category:string, key:string): boolean {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultUsers>(category:CategoryId): {key:string, value:ODFormattedJsonDatabaseIds_DefaultUsers[CategoryId]}[]|undefined
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined
    
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        return super.getCategory(category)
    }
}


/**## ODFormattedJsonDatabaseIds_DefaultOptions `type`
 * This type is an array of ids available in the `ODDatabaseManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFormattedJsonDatabaseIds_DefaultOptions {
    "openticket:used-option":ODOptionJson
}

/**## ODFormattedJsonDatabase_DefaultOptions `default_class`
 * This is a special class that adds type definitions & typescript to the ODFormattedJsonDatabase class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `options.json` database!
 */
export class ODFormattedJsonDatabase_DefaultOptions extends ODFormattedJsonDatabase {
    set<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string, value:ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]): boolean
    set(category:string, key:string, value:ODValidJsonType): boolean
    
    set(category:string, key:string, value:ODValidJsonType): boolean {
        return super.set(category,key,value)
    }

    get<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string): ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]|undefined
    get(category:string, key:string): ODValidJsonType|undefined

    get(category:string, key:string): ODValidJsonType|undefined {
        return super.get(category,key)
    }

    delete<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId, key:string): boolean
    delete(category:string, key:string): boolean

    delete(category:string, key:string): boolean {
        return super.delete(category,key)
    }

    exists(category:keyof ODFormattedJsonDatabaseIds_DefaultOptions, key:string): boolean
    exists(category:string, key:string): boolean

    exists(category:string, key:string): boolean {
        return super.exists(category,key)
    }

    getCategory<CategoryId extends keyof ODFormattedJsonDatabaseIds_DefaultOptions>(category:CategoryId): {key:string, value:ODFormattedJsonDatabaseIds_DefaultOptions[CategoryId]}[]|undefined
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined
    
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        return super.getCategory(category)
    }
}