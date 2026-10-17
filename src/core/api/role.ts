///////////////////////////////////////
//OPENTICKET ROLE MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"

/**## ODRoleIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODRole` class.
 */
export type ODRoleIdConstraint = Record<string, ODRoleData<api.ODValidJsonType>>

/**## ODRoleIdMappings `interface`
 * A list of all available IDs in the default `ODRole` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODRoleIdMappings extends ODRoleIdConstraint {
    "opendiscord:roles":ODRoleData<string[]>,
    "opendiscord:mode":ODRoleData<ODRoleUpdateMode>,
    "opendiscord:remove-roles-on-add":ODRoleData<string[]>,
    "opendiscord:add-on-join":ODRoleData<boolean>
}

/**## ODRoleManager `class`
 * This is an Open Ticket role manager.
 *
 * This class manages all registered reaction roles in the bot.
 *
 * Roles are not stored in the database and will be parsed from the config every startup.
 */
export class ODRoleManager extends api.ODManager<ODRole> {
    constructor(debug:api.ODDebugger) {
        super(debug, "role")
    }

    add(data:ODRole, overwrite?:boolean): boolean {
        data.useDebug(this.debug, "role data")
        return super.add(data, overwrite)
    }
}

/**## ODRoleDataJson `interface`
 * The JSON representatation from a single role property.
 */
export interface ODRoleDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:api.ODValidJsonType
}

/**## ODRoleJson `interface`
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

/**## ODRole `class`
 * This is an Open Ticket role.
 *
 * This class contains all data related to this role (parsed from the config).
 *
 * These properties will be used to handle reaction role options.
 */
export class ODRole extends api.ODManager<ODRoleData<api.ODValidJsonType>> {
    /**The id of this role. (from the config) */
    id:api.ODId

    constructor(id:api.ODValidId, data:ODRoleData<api.ODValidJsonType>[]) {
        super()
        this.id = new api.ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this role to a JSON object for storing this role in the database. */
    toJson(version:api.ODVersion): ODRoleJson {
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
        return new ODRole(json.id, json.data.map((data) => new ODRoleData(data.id, data.value)))
    }

    get<OptionId extends keyof api.ODNoGeneric<ODRoleIdMappings>>(id:OptionId): ODRoleIdMappings[OptionId]
    get(id:api.ODValidId): ODRoleData<api.ODValidJsonType>|null

    get(id:api.ODValidId): ODRoleData<api.ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof api.ODNoGeneric<ODRoleIdMappings>>(id:OptionId): ODRoleIdMappings[OptionId]
    remove(id:api.ODValidId): ODRoleData<api.ODValidJsonType>|null

    remove(id:api.ODValidId): ODRoleData<api.ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<ODRoleIdMappings>): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
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
export class ODRoleData<DataType extends api.ODValidJsonType>extends api.ODManagerData {
    /**The value of this property. */
    private rawValue:DataType

    constructor(id:api.ODValidId, value:DataType) {
        super(id)
        this.rawValue = value
    }

    /**The value of this property. */
    set value(value:DataType) {
        this.rawValue = value
        this._change()
    }

    get value(): DataType {
        return this.rawValue
    }

    /**Refresh the database. Is only required to be used when updating `ODRoleData` with an object/array as value. */
    refreshDatabase() {
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