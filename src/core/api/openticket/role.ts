///////////////////////////////////////
//OPENTICKET ROLE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"
import * as discord from "discord.js"

/**## ODRoleManager `class`
 * This is an Open Ticket role manager.
 * 
 * This class manages all registered reaction roles in the bot.
 * 
 * Roles are not stored in the database and will be parsed from the config every startup.
 */
export class ODRoleManager extends ODManager<ODRole> {
    /**A reference to the Open Ticket debugger. */
    #debug: ODDebugger

    constructor(debug:ODDebugger){
        super(debug,"role")
        this.#debug = debug
    }
    
    add(data:ODRole, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"role data")
        return super.add(data,overwrite)
    }
}

/**## ODRoleDataJson `interface`
 * The JSON representatation from a single role property.
 */
export interface ODRoleDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:ODValidJsonType
}

/**## ODRoleDataJson `interface`
 * The JSON representatation from a single role.
 */
export interface ODRoleJson {
    /**The id of this role. */
    id:string,
    /**The version of Open Ticket used to create this role. */
    version:string,
    /**The full list of properties/variables related to this role. */
    data:ODRoleDataJson[]
}

/**## ODRoleIds `type`
 * This interface is a list of ids available in the `ODRole` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODRoleIds {
    "opendiscord:roles":ODRoleData<string[]>,
    "opendiscord:mode":ODRoleData<ODRoleUpdateMode>,
    "opendiscord:remove-roles-on-add":ODRoleData<string[]>,
    "opendiscord:add-on-join":ODRoleData<boolean>
}

/**## ODRole `class`
 * This is an Open Ticket role.
 * 
 * This class contains all data related to this role (parsed from the config).
 * 
 * These properties will be used to handle reaction role options.
 */
export class ODRole extends ODManager<ODRoleData<ODValidJsonType>> {
    /**The id of this role. (from the config) */
    id:ODId

    constructor(id:ODValidId, data:ODRoleData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this role to a JSON object for storing this role in the database. */
    toJson(version:ODVersion): ODRoleJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })
        
        return {
            id:this.id.toString(),
            version:version.toString(),
            data
        }
    }

    /**Create a role from a JSON object in the database. */
    static fromJson(json:ODRoleJson): ODRole {
        return new ODRole(json.id,json.data.map((data) => new ODRoleData(data.id,data.value)))
    }

    get<OptionId extends keyof ODRoleIds>(id:OptionId): ODRoleIds[OptionId]
    get(id:ODValidId): ODRoleData<ODValidJsonType>|null
    
    get(id:ODValidId): ODRoleData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof ODRoleIds>(id:OptionId): ODRoleIds[OptionId]
    remove(id:ODValidId): ODRoleData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODRoleData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODRoleIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODRoleData `class`
 * This is Open Ticket role data.
 * 
 * This class contains a single property for a role. (string, number, boolean, object, array, null)
 * 
 * When this property is edited, the database will be updated automatically.
 */
export class ODRoleData<DataType extends ODValidJsonType> extends ODManagerData {
    /**The value of this property. */
    #value: DataType

    constructor(id:ODValidId, value:DataType){
        super(id)
        this.#value = value
    }

    /**The value of this property. */
    set value(value:DataType){
        this.#value = value
        this._change()
    }
    get value(): DataType {
        return this.#value
    }
    /**Refresh the database. Is only required to be used when updating `ODRoleData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}

/**## ODRoleUpdateResult `interface`
 * This interface represents the result of a single role when the roles of users are updated.
 */
export interface ODRoleUpdateResult {
    /**The role which was affected. */
    role:discord.Role,
    /**The action which was done. `null` when nothing happend. */
    action:"added"|"removed"|null
}

/**## ODRoleUpdateMode `type`
 * This is the mode of the reaction role option in the config.
 */
export type ODRoleUpdateMode = "add&remove"|"add"|"remove"