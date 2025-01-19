///////////////////////////////////////
//OPENTICKET OPTION MODULE
///////////////////////////////////////
import { ODDatabase } from "../modules/database"
import { ODJsonConfig_DefaultOptionEmbedSettingsType, ODJsonConfig_DefaultOptionPingSettingsType } from "../defaults/config"
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODValidButtonColor, ODManagerData, ODSystemError } from "../modules/base"
import { ODDebugger } from "../modules/console"
import * as discord from "discord.js"
import * as crypto from "crypto"
import { OTRoleUpdateMode } from "./role"

export class ODOptionManager extends ODManager<ODOption> {
    #debug: ODDebugger
    suffix: ODOptionSuffixManager

    constructor(debug:ODDebugger){
        super(debug,"option")
        this.#debug = debug
        this.suffix = new ODOptionSuffixManager(debug)
    }
    
    add(data:ODOption, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"option data")
        return super.add(data,overwrite)
    }
}

export interface ODOptionDataJson {
    id:string,
    value:ODValidJsonType
}

export interface ODOptionJson {
    id:string,
    type:string,
    version:string,
    data:ODOptionDataJson[]
}

export class ODOption extends ODManager<ODOptionData<ODValidJsonType>> {
    id:ODId
    type: string

    constructor(id:ODValidId, type:string, data:ODOptionData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        this.type = type
        data.forEach((data) => {
            this.add(data)
        })
    }

    toJson(version:ODVersion): ODOptionJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })
        
        return {
            id:this.id.toString(),
            type:this.type,
            version:version.toString(),
            data
        }
    }

    static fromJson(json:ODOptionJson): ODOption {
        return new ODOption(json.id,json.type,json.data.map((data) => new ODOptionData(data.id,data.value)))
    }
}

export class ODOptionData<DataType extends ODValidJsonType> extends ODManagerData {
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
    /**Refresh the database. Is only required to be used when updating `ODOptionData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}

/**## ODTicketOptionIds `type`
 * This interface is a list of ids available in the `ODTicketOption` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTicketOptionIds {
    "openticket:name":ODOptionData<string>,
    "openticket:description":ODOptionData<string>,
    
    "openticket:button-emoji":ODOptionData<string>,
    "openticket:button-label":ODOptionData<string>,
    "openticket:button-color":ODOptionData<ODValidButtonColor>,
    
    "openticket:admins":ODOptionData<string[]>,
    "openticket:admins-readonly":ODOptionData<string[]>,
    "openticket:allow-blacklisted-users":ODOptionData<boolean>,
    "openticket:questions":ODOptionData<string[]>,
    
    "openticket:channel-prefix":ODOptionData<string>,
    "openticket:channel-suffix":ODOptionData<"user-name"|"user-id"|"random-number"|"random-hex"|"counter-dynamic"|"counter-fixed">,
    "openticket:channel-category":ODOptionData<string>,
    "openticket:channel-category-closed":ODOptionData<string>,
    "openticket:channel-category-backup":ODOptionData<string>,
    "openticket:channel-categories-claimed":ODOptionData<{user:string,category:string}[]>,
    "openticket:channel-description":ODOptionData<string>,
    
    "openticket:dm-message-enabled":ODOptionData<boolean>,
    "openticket:dm-message-text":ODOptionData<string>,
    "openticket:dm-message-embed":ODOptionData<ODJsonConfig_DefaultOptionEmbedSettingsType>,

    "openticket:ticket-message-enabled":ODOptionData<boolean>,
    "openticket:ticket-message-text":ODOptionData<string>,
    "openticket:ticket-message-embed":ODOptionData<ODJsonConfig_DefaultOptionEmbedSettingsType>,
    "openticket:ticket-message-ping":ODOptionData<ODJsonConfig_DefaultOptionPingSettingsType>,

    "openticket:autoclose-enable-hours":ODOptionData<boolean>,
    "openticket:autoclose-enable-leave":ODOptionData<boolean>,
    "openticket:autoclose-disable-claim":ODOptionData<boolean>,
    "openticket:autoclose-hours":ODOptionData<number>,

    "openticket:autodelete-enable-days":ODOptionData<boolean>,
    "openticket:autodelete-enable-leave":ODOptionData<boolean>,
    "openticket:autodelete-disable-claim":ODOptionData<boolean>,
    "openticket:autodelete-days":ODOptionData<number>,
    
    "openticket:cooldown-enabled":ODOptionData<boolean>,
    "openticket:cooldown-minutes":ODOptionData<number>,

    "openticket:limits-enabled":ODOptionData<boolean>,
    "openticket:limits-maximum-global":ODOptionData<number>,
    "openticket:limits-maximum-user":ODOptionData<number>
}

export class ODTicketOption extends ODOption {
    type: "openticket:ticket" = "openticket:ticket"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"openticket:ticket",data)
    }

    get<OptionId extends keyof ODTicketOptionIds>(id:OptionId): ODTicketOptionIds[OptionId]
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof ODTicketOptionIds>(id:OptionId): ODTicketOptionIds[OptionId]
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODTicketOptionIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODOptionJson): ODTicketOption {
        return new ODTicketOption(json.id,json.data.map((data) => new ODOptionData(data.id,data.value)))
    }
}

/**## ODWebsiteOptionIds `type`
 * This interface is a list of ids available in the `ODWebsiteOption` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODWebsiteOptionIds {
    "openticket:name":ODOptionData<string>,
    "openticket:description":ODOptionData<string>,
    
    "openticket:button-emoji":ODOptionData<string>,
    "openticket:button-label":ODOptionData<string>,
    
    "openticket:url":ODOptionData<string>,
}

export class ODWebsiteOption extends ODOption {
    type: "openticket:website" = "openticket:website"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"openticket:website",data)
    }

    get<OptionId extends keyof ODWebsiteOptionIds>(id:OptionId): ODWebsiteOptionIds[OptionId]
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof ODWebsiteOptionIds>(id:OptionId): ODWebsiteOptionIds[OptionId]
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODWebsiteOptionIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODOptionJson): ODWebsiteOption {
        return new ODWebsiteOption(json.id,json.data.map((data) => new ODOptionData(data.id,data.value)))
    }
}

/**## ODRoleOptionIds `type`
 * This interface is a list of ids available in the `ODRoleOption` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODRoleOptionIds {
    "openticket:name":ODOptionData<string>,
    "openticket:description":ODOptionData<string>,
    
    "openticket:button-emoji":ODOptionData<string>,
    "openticket:button-label":ODOptionData<string>,
    "openticket:button-color":ODOptionData<ODValidButtonColor>,
    
    "openticket:roles":ODOptionData<string[]>,
    "openticket:mode":ODOptionData<OTRoleUpdateMode>,
    "openticket:remove-roles-on-add":ODOptionData<string[]>,
    "openticket:add-on-join":ODOptionData<boolean>
}

export class ODRoleOption extends ODOption {
    type: "openticket:role" = "openticket:role"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"openticket:role",data)
    }

    get<OptionId extends keyof ODRoleOptionIds>(id:OptionId): ODRoleOptionIds[OptionId]
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    get(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof ODRoleOptionIds>(id:OptionId): ODRoleOptionIds[OptionId]
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODOptionData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODRoleOptionIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json:ODOptionJson): ODRoleOption {
        return new ODRoleOption(json.id,json.data.map((data) => new ODOptionData(data.id,data.value)))
    }
}

export class ODOptionSuffixManager extends ODManager<ODOptionSuffix> {
    /**Alias to open ticket global database. */
    database: ODDatabase|null = null

    constructor(debug:ODDebugger){
        super(debug,"ticket suffix")
    }

    useDatabase(database:ODDatabase){
        this.database = database
    }
    /**Instantly get the suffix from an option. */
    getSuffixFromOption(option:ODTicketOption,user:discord.User): string|null {
        const suffix = this.getAll().find((suffix) => suffix.option.id.value == option.id.value)
        if (!suffix) return null
        return suffix.getSuffix(user)
    }
}

export class ODOptionSuffix extends ODManagerData {
    /**The option of this suffix. */
    option: ODTicketOption
    
    constructor(id:ODValidId, option:ODTicketOption){
        super(id)
        this.option = option
    }

    /**Get the suffix for a new ticket. */
    getSuffix(user:discord.User): string {
        throw new ODSystemError("Tried to use an unimplemented ODOptionSuffix!")
    }
}

export class ODOptionUserNameSuffix extends ODOptionSuffix {
    getSuffix(user:discord.User): string {
        return user.username
    }
}

export class ODOptionUserIdSuffix extends ODOptionSuffix {
    getSuffix(user:discord.User): string {
        return user.id
    }
}

export class ODOptionCounterDynamicSuffix extends ODOptionSuffix {
    /**The database where the value of this counter is stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    async #init(){
        if (!await this.database.exists("openticket:option-suffix-counter",this.option.id.value)) await this.database.set("openticket:option-suffix-counter",this.option.id.value,0)
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValue = this.database.get("openticket:option-suffix-counter",this.option.id.value)
        const currentValue = (typeof rawCurrentValue != "number") ? 0 : rawCurrentValue
        const newValue = currentValue+1
        this.database.set("openticket:option-suffix-counter",this.option.id.value,newValue)
        return newValue.toString()
    }
}

export class ODOptionCounterFixedSuffix extends ODOptionSuffix {
    /**The database where the value of this counter is stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }
    
    async #init(){
        if (!await this.database.exists("openticket:option-suffix-counter",this.option.id.value)) await this.database.set("openticket:option-suffix-counter",this.option.id.value,0)
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValue = this.database.get("openticket:option-suffix-counter",this.option.id.value)
        const currentValue = (typeof rawCurrentValue != "number") ? 0 : rawCurrentValue
        const newValue = (currentValue >= 9999) ? 0 : currentValue+1
        
        this.database.set("openticket:option-suffix-counter",this.option.id.value,newValue)
        if (newValue.toString().length == 1) return "000"+newValue.toString()
        else if (newValue.toString().length == 2) return "00"+newValue.toString()
        else if (newValue.toString().length == 3) return "0"+newValue.toString()
        else return newValue.toString()
    }
}

export class ODOptionRandomNumberSuffix extends ODOptionSuffix {
    /**The database where previous random numbers are stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    async #init(){
        if (!await this.database.exists("openticket:option-suffix-history",this.option.id.value)) await this.database.set("openticket:option-suffix-history",this.option.id.value,[])
    }
    #generateUniqueValue(history:string[]): string {
        const rawNumber = Math.round(Math.random()*1000).toString()
        let number = rawNumber
        if (rawNumber.length == 1) number = "000"+rawNumber
        else if (rawNumber.length == 2) number = "00"+rawNumber
        else if (rawNumber.length == 3) number = "0"+rawNumber
        
        if (history.includes(number)) return this.#generateUniqueValue(history)
        else return number
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValues = this.database.get("openticket:option-suffix-history",this.option.id.value)
        const currentValues = ((Array.isArray(rawCurrentValues)) ? rawCurrentValues : []) as string[]
        const newValue = this.#generateUniqueValue(currentValues)
        currentValues.push(newValue)
        if (currentValues.length > 50) currentValues.shift()
        this.database.set("openticket:option-suffix-history",this.option.id.value,currentValues)
        return newValue
    }
}

export class ODOptionRandomHexSuffix extends ODOptionSuffix {
    /**The database where previous random hexes are stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    async #init(){
        if (!await this.database.exists("openticket:option-suffix-history",this.option.id.value)) await this.database.set("openticket:option-suffix-history",this.option.id.value,[])

    }
    #generateUniqueValue(history:string[]): string {
        const hex = crypto.randomBytes(2).toString("hex")
        if (history.includes(hex)) return this.#generateUniqueValue(history)
        else return hex
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValues = this.database.get("openticket:option-suffix-history",this.option.id.value)
        const currentValues = ((Array.isArray(rawCurrentValues)) ? rawCurrentValues : []) as string[]
        const newValue = this.#generateUniqueValue(currentValues)
        currentValues.push(newValue)
        if (currentValues.length > 50) currentValues.shift()
        this.database.set("openticket:option-suffix-history",this.option.id.value,currentValues)
        return newValue
    }
}