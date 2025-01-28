///////////////////////////////////////
//FLAG MODULE
///////////////////////////////////////
import { ODId, ODValidId, ODManager, ODManagerData } from "./base"
import { ODDebugger } from "./console"

/**## ODFlag `class`
 * This is an Open Ticket flag.
 * 
 * A flag is a boolean that can be specified by a parameter in the console.
 * It's useful for small settings that are only required once in a while.
 * 
 * Flags can also be enabled manually by plugins!
 */
export class ODFlag extends ODManagerData {
    /**The method that has been used to set the value of this flag. (`null` when not set) */
    method: "param"|"manual"|null = null
    /**The name of this flag. Visible to the user. */
    name: string
    /**The description of this flag. Visible to the user. */
    description: string
    /**The name of the parameter in the console. (e.g. `--test`) */
    param: string
    /**A list of aliases for the parameter in the console. */
    aliases: string[]
    /**The value of this flag. */
    value: boolean = false

    constructor(id:ODValidId, name:string, description:string, param:string, aliases?:string[], initialValue?:boolean){
        super(id)
        this.name = name
        this.description = description
        this.param = param
        this.aliases = aliases ?? []
        this.value = initialValue ?? false
    }

    /**Set the value of this flag. */
    setValue(value:boolean,method?:"param"|"manual"){
        this.value = value
        this.method = method ?? "manual"
    }
    /**Detect if the process contains the param or aliases & set the value. Use `force` to overwrite a manually set value. */
    detectProcessParams(force?:boolean){
        if (force){
            const params = [this.param,...this.aliases]
            this.setValue(params.some((p) => process.argv.includes(p)),"param")
            
        }else if (this.method != "manual"){
            const params = [this.param,...this.aliases]
            this.setValue(params.some((p) => process.argv.includes(p)),"param")
        }
    }
}

/**## ODFlagManager `class`
 * This is an Open Ticket flag manager.
 * 
 * This class is responsible for managing & initiating all flags of the bot.
 * It also contains a shortcut for initiating all flags.
 */
export class ODFlagManager extends ODManager<ODFlag> {
    constructor(debug:ODDebugger){
        super(debug,"flag")
    }

    /**Set all flags to their `process.argv` value. */
    async init(){
        await this.loopAll((flag) => {
            flag.detectProcessParams(false)
        })
    }
}