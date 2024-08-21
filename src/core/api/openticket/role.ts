///////////////////////////////////////
//OPENTICKET ROLE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"
import * as discord from "discord.js"

export class ODRoleManager extends ODManager<ODRole> {
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

export interface ODRoleDataJson {
    id:string,
    value:ODValidJsonType
}

export interface ODRoleJson {
    id:string,
    version:string,
    data:ODRoleDataJson[]
}

export class ODRoleData<DataType extends ODValidJsonType> extends ODManagerData {
    #value: DataType

    constructor(id:ODValidId, value:DataType){
        super(id)
        this.#value = value
    }

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

/**## ODRoleIds `type`
 * This type is an array of ids available in the `ODRole` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODRoleIds {
    "openticket:roles":ODRoleData<string[]>,
    "openticket:mode":ODRoleData<OTRoleUpdateMode>,
    "openticket:remove-roles-on-add":ODRoleData<string[]>,
    "openticket:add-on-join":ODRoleData<boolean>
}

export class ODRole extends ODManager<ODRoleData<ODValidJsonType>> {
    id:ODId

    constructor(id:ODValidId, data:ODRoleData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

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

export interface OTRoleUpdateResult {
    role:discord.Role,
    action:"added"|"removed"|null
}

export type OTRoleUpdateMode = "add&remove"|"add"|"remove"