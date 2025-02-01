///////////////////////////////////////
//OPENTICKET OPTION MODULE
///////////////////////////////////////
import { ODDatabase } from "../modules/database"
import { ODJsonConfig_DefaultOptionEmbedSettingsType, ODJsonConfig_DefaultOptionPingSettingsType } from "../defaults/config"
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODValidButtonColor, ODManagerData, ODSystemError } from "../modules/base"
import { ODDebugger } from "../modules/console"
import * as discord from "discord.js"
import * as crypto from "crypto"
import { ODRoleUpdateMode } from "./role"

/**## ODOptionManager `class`
 * This is an Open Ticket option manager.
 * 
 * This class manages all registered options in the bot. This also includes temporary options generated from tickets where the original option got deleted.
 * 
 * All option types including: tickets, websites & reaction roles are stored here.
 */
export class ODOptionManager extends ODManager<ODOption> {
    /**A reference to the Open Ticket debugger. */
    #debug: ODDebugger
    /**The option suffix manager used to generate channel suffixes for ticket names. */
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

/**## ODOptionDataJson `interface`
 * The JSON representatation from a single option property.
 */
export interface ODOptionDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:ODValidJsonType
}

/**## ODOptionDataJson `interface`
 * The JSON representatation from a single option.
 */
export interface ODOptionJson {
    /**The id of this option. */
    id:string,
    /**The type of this option. (e.g. `opendiscord:ticket`, `opendiscord:website`, `opendiscord:role`) */
    type:string,
    /**The version of Open Ticket used to create this option & store it in the database. */
    version:string,
    /**The full list of properties/variables related to this option. */
    data:ODOptionDataJson[]
}

/**## ODOption `class`
 * This is an Open Ticket option.
 * 
 * This class contains all data related to this option (parsed from the config).
 * 
 * It's recommended to use `ODTicketOption`, `ODWebsiteOption` or `ODRoleOption` instead!
 */
export class ODOption extends ODManager<ODOptionData<ODValidJsonType>> {
    /**The id of this option. (from the config) */
    id:ODId
    /**The type of this option. (e.g. `opendiscord:ticket`, `opendiscord:website`, `opendiscord:role`) */
    type: string

    constructor(id:ODValidId, type:string, data:ODOptionData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        this.type = type
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this option to a JSON object for storing this option in the database. */
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

    /**Create an option from a JSON object in the database. */
    static fromJson(json:ODOptionJson): ODOption {
        return new ODOption(json.id,json.type,json.data.map((data) => new ODOptionData(data.id,data.value)))
    }
}

/**## ODOptionData `class`
 * This is Open Ticket option data.
 * 
 * This class contains a single property for an option. (string, number, boolean, object, array, null)
 * 
 * When this property is edited, the database will be updated automatically.
 */
export class ODOptionData<DataType extends ODValidJsonType> extends ODManagerData {
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
    "opendiscord:name":ODOptionData<string>,
    "opendiscord:description":ODOptionData<string>,
    
    "opendiscord:button-emoji":ODOptionData<string>,
    "opendiscord:button-label":ODOptionData<string>,
    "opendiscord:button-color":ODOptionData<ODValidButtonColor>,
    
    "opendiscord:admins":ODOptionData<string[]>,
    "opendiscord:admins-readonly":ODOptionData<string[]>,
    "opendiscord:allow-blacklisted-users":ODOptionData<boolean>,
    "opendiscord:questions":ODOptionData<string[]>,
    
    "opendiscord:channel-prefix":ODOptionData<string>,
    "opendiscord:channel-suffix":ODOptionData<"user-name"|"user-id"|"random-number"|"random-hex"|"counter-dynamic"|"counter-fixed">,
    "opendiscord:channel-category":ODOptionData<string>,
    "opendiscord:channel-category-closed":ODOptionData<string>,
    "opendiscord:channel-category-backup":ODOptionData<string>,
    "opendiscord:channel-categories-claimed":ODOptionData<{user:string,category:string}[]>,
    "opendiscord:channel-description":ODOptionData<string>,
    
    "opendiscord:dm-message-enabled":ODOptionData<boolean>,
    "opendiscord:dm-message-text":ODOptionData<string>,
    "opendiscord:dm-message-embed":ODOptionData<ODJsonConfig_DefaultOptionEmbedSettingsType>,

    "opendiscord:ticket-message-enabled":ODOptionData<boolean>,
    "opendiscord:ticket-message-text":ODOptionData<string>,
    "opendiscord:ticket-message-embed":ODOptionData<ODJsonConfig_DefaultOptionEmbedSettingsType>,
    "opendiscord:ticket-message-ping":ODOptionData<ODJsonConfig_DefaultOptionPingSettingsType>,

    "opendiscord:autoclose-enable-hours":ODOptionData<boolean>,
    "opendiscord:autoclose-enable-leave":ODOptionData<boolean>,
    "opendiscord:autoclose-disable-claim":ODOptionData<boolean>,
    "opendiscord:autoclose-hours":ODOptionData<number>,

    "opendiscord:autodelete-enable-days":ODOptionData<boolean>,
    "opendiscord:autodelete-enable-leave":ODOptionData<boolean>,
    "opendiscord:autodelete-disable-claim":ODOptionData<boolean>,
    "opendiscord:autodelete-days":ODOptionData<number>,
    
    "opendiscord:cooldown-enabled":ODOptionData<boolean>,
    "opendiscord:cooldown-minutes":ODOptionData<number>,

    "opendiscord:limits-enabled":ODOptionData<boolean>,
    "opendiscord:limits-maximum-global":ODOptionData<number>,
    "opendiscord:limits-maximum-user":ODOptionData<number>
}

/**## ODTicketOption `class`
 * This is an Open Ticket ticket option.
 * 
 * This class contains all data related to an Open Ticket ticket option (parsed from the config).
 * 
 * Use this option to create a new ticket!
 */
export class ODTicketOption extends ODOption {
    type: "opendiscord:ticket" = "opendiscord:ticket"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"opendiscord:ticket",data)
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
    "opendiscord:name":ODOptionData<string>,
    "opendiscord:description":ODOptionData<string>,
    
    "opendiscord:button-emoji":ODOptionData<string>,
    "opendiscord:button-label":ODOptionData<string>,
    
    "opendiscord:url":ODOptionData<string>,
}

/**## ODWebsiteOption `class`
 * This is an Open Ticket website option.
 * 
 * This class contains all data related to an Open Ticket website option (parsed from the config).
 * 
 * Use this option to create a button which links to a website!
 */
export class ODWebsiteOption extends ODOption {
    type: "opendiscord:website" = "opendiscord:website"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"opendiscord:website",data)
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
    "opendiscord:name":ODOptionData<string>,
    "opendiscord:description":ODOptionData<string>,
    
    "opendiscord:button-emoji":ODOptionData<string>,
    "opendiscord:button-label":ODOptionData<string>,
    "opendiscord:button-color":ODOptionData<ODValidButtonColor>,
    
    "opendiscord:roles":ODOptionData<string[]>,
    "opendiscord:mode":ODOptionData<ODRoleUpdateMode>,
    "opendiscord:remove-roles-on-add":ODOptionData<string[]>,
    "opendiscord:add-on-join":ODOptionData<boolean>
}

/**## ODRoleOption `class`
 * This is an Open Ticket role option.
 * 
 * This class contains all data related to an Open Ticket role option (parsed from the config).
 * 
 * Use this option to create a button for reaction roles!
 */
export class ODRoleOption extends ODOption {
    type: "opendiscord:role" = "opendiscord:role"

    constructor(id:ODValidId, data:ODOptionData<ODValidJsonType>[]){
        super(id,"opendiscord:role",data)
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

/**## ODOptionSuffixManager `class`
 * This is an Open Ticket option suffix manager.
 * 
 * This class manages all suffixes from option in the bot. The id of an option suffix is the same as the option id.
 * 
 * All ticket options should have a corresponding option suffix class.
 */
export class ODOptionSuffixManager extends ODManager<ODOptionSuffix> {
    constructor(debug:ODDebugger){
        super(debug,"ticket suffix")
    }

    /**Instantly get the suffix from an `ODTicketOption`. */
    getSuffixFromOption(option:ODTicketOption,user:discord.User): string|null {
        const suffix = this.getAll().find((suffix) => suffix.option.id.value == option.id.value)
        if (!suffix) return null
        return suffix.getSuffix(user)
    }
}

/**## ODOptionSuffix `class`
 * This is an Open Ticket option suffix.
 * 
 * This class can generate a suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
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

/**## ODOptionUserNameSuffix `class`
 * This is an Open Ticket user-name option suffix.
 * 
 * This class can generate a user-name suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionUserNameSuffix extends ODOptionSuffix {
    getSuffix(user:discord.User): string {
        return user.username
    }
}

/**## ODOptionUserIdSuffix `class`
 * This is an Open Ticket user-id option suffix.
 * 
 * This class can generate a user-id suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionUserIdSuffix extends ODOptionSuffix {
    getSuffix(user:discord.User): string {
        return user.id
    }
}

/**## ODOptionCounterDynamicSuffix `class`
 * This is an Open Ticket counter-dynamic option suffix.
 * 
 * This class can generate a counter-dynamic suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionCounterDynamicSuffix extends ODOptionSuffix {
    /**The database where the value of this counter is stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    /**Initialize the database for this suffix. */
    async #init(){
        if (!await this.database.exists("opendiscord:option-suffix-counter",this.option.id.value)) await this.database.set("opendiscord:option-suffix-counter",this.option.id.value,0)
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValue = this.database.get("opendiscord:option-suffix-counter",this.option.id.value)
        const currentValue = (typeof rawCurrentValue != "number") ? 0 : rawCurrentValue
        const newValue = currentValue+1
        this.database.set("opendiscord:option-suffix-counter",this.option.id.value,newValue)
        return newValue.toString()
    }
}

/**## ODOptionCounterFixedSuffix `class`
 * This is an Open Ticket counter-fixed option suffix.
 * 
 * This class can generate a counter-fixed suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionCounterFixedSuffix extends ODOptionSuffix {
    /**The database where the value of this counter is stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }
    
    /**Initialize the database for this suffix. */
    async #init(){
        if (!await this.database.exists("opendiscord:option-suffix-counter",this.option.id.value)) await this.database.set("opendiscord:option-suffix-counter",this.option.id.value,0)
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValue = this.database.get("opendiscord:option-suffix-counter",this.option.id.value)
        const currentValue = (typeof rawCurrentValue != "number") ? 0 : rawCurrentValue
        const newValue = (currentValue >= 9999) ? 0 : currentValue+1
        
        this.database.set("opendiscord:option-suffix-counter",this.option.id.value,newValue)
        if (newValue.toString().length == 1) return "000"+newValue.toString()
        else if (newValue.toString().length == 2) return "00"+newValue.toString()
        else if (newValue.toString().length == 3) return "0"+newValue.toString()
        else return newValue.toString()
    }
}

/**## ODOptionRandomNumberSuffix `class`
 * This is an Open Ticket random-number option suffix.
 * 
 * This class can generate a random-number suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionRandomNumberSuffix extends ODOptionSuffix {
    /**The database where previous random numbers are stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    /**Initialize the database for this suffix. */
    async #init(){
        if (!await this.database.exists("opendiscord:option-suffix-history",this.option.id.value)) await this.database.set("opendiscord:option-suffix-history",this.option.id.value,[])
    }
    /**Get a unique number for this suffix. */
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
        const rawCurrentValues = this.database.get("opendiscord:option-suffix-history",this.option.id.value)
        const currentValues = ((Array.isArray(rawCurrentValues)) ? rawCurrentValues : []) as string[]
        const newValue = this.#generateUniqueValue(currentValues)
        currentValues.push(newValue)
        if (currentValues.length > 50) currentValues.shift()
        this.database.set("opendiscord:option-suffix-history",this.option.id.value,currentValues)
        return newValue
    }
}

/**## ODOptionRandomHexSuffix `class`
 * This is an Open Ticket random-hex option suffix.
 * 
 * This class can generate a random-hex suffix for a discord channel name from a specific option.
 * 
 * Use `getSuffix()` to get the new suffix!
 */
export class ODOptionRandomHexSuffix extends ODOptionSuffix {
    /**The database where previous random hexes are stored. */
    database: ODDatabase

    constructor(id:ODValidId, option:ODTicketOption, database:ODDatabase){
        super(id,option)
        this.database = database
        this.#init()
    }

    /**Initialize the database for this suffix. */
    async #init(){
        if (!await this.database.exists("opendiscord:option-suffix-history",this.option.id.value)) await this.database.set("opendiscord:option-suffix-history",this.option.id.value,[])
    }
    /**Get a unique hex-string for this suffix. */
    #generateUniqueValue(history:string[]): string {
        const hex = crypto.randomBytes(2).toString("hex")
        if (history.includes(hex)) return this.#generateUniqueValue(history)
        else return hex
    }
    getSuffix(user:discord.User): string {
        const rawCurrentValues = this.database.get("opendiscord:option-suffix-history",this.option.id.value)
        const currentValues = ((Array.isArray(rawCurrentValues)) ? rawCurrentValues : []) as string[]
        const newValue = this.#generateUniqueValue(currentValues)
        currentValues.push(newValue)
        if (currentValues.length > 50) currentValues.shift()
        this.database.set("opendiscord:option-suffix-history",this.option.id.value,currentValues)
        return newValue
    }
}