///////////////////////////////////////
//STAT MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import { ODDebugger } from "./console"
import { ODDatabase, ODJsonDatabaseStructure } from "./database"
import * as discord from "discord.js"

/**## ODValidStatValue `type`
 * These are the only allowed types for a stat value to improve compatibility with different database systems.
 */
export type ODValidStatValue = string|number|boolean

/**## ODStatsManagerInitCallback `type`
 * This callback can be used to execute something when the stats have been initiated.
 * 
 * By default this is used to clear stats from users that left the server or tickets which don't exist anymore.
 */
export type ODStatsManagerInitCallback = (database:ODJsonDatabaseStructure, deletables:ODJsonDatabaseStructure) => void|Promise<void>

/**## ODStatScopeSetMode `type`
 * This type contains all valid methods for changing the value of a stat.
 */
export type ODStatScopeSetMode = "set"|"increase"|"decrease"

/**## ODStatsManager `class`
 * This is an Open Ticket stats manager.
 * 
 * This class is responsible for managing all stats of the bot.
 * Stats are categorized in "scopes" which can be accessed in this manager.
 * 
 * Stats can be accessed in the individual scopes.
 */
export class ODStatsManager extends ODManager<ODStatScope> {
    /**Alias to Open Ticket debugger. */
    #debug: ODDebugger
    /**Alias to Open Ticket stats database. */
    database: ODDatabase|null = null
    /**All the listeners for the init event. */
    #initListeners: ODStatsManagerInitCallback[] = []

    constructor(debug:ODDebugger){
        super(debug,"stat scope")
        this.#debug = debug
    }

    /**Select the database to use to read/write all stats from/to. */
    useDatabase(database:ODDatabase){
        this.database = database
    }
    add(data:ODStatScope, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"stat")
        if (this.database) data.useDatabase(this.database)
        return super.add(data,overwrite)
    }
    /**Init all stats and run `onInit()` listeners. */
    async init(){
        if (!this.database) throw new ODSystemError("Unable to initialize stats scopes due to missing database!")

        //get all valid categories
        const validCategories: string[] = []
        for (const scope of this.getAll()){
            validCategories.push(...scope.init())
        }

        //filter out the deletable stats
        const deletableStats: ODJsonDatabaseStructure = []
        const data = await this.database.getAll()
        data.forEach((data) => {
            if (!validCategories.includes(data.category)) deletableStats.push(data)
        })

        //do additional deletion
        for (const cb of this.#initListeners){
            await cb(data,deletableStats)
        }
        
        //delete all deletable stats
        for (const data of deletableStats){
            if (!this.database) return
            await this.database.delete(data.category,data.key)
        }
    }
    /**Reset all stats. (clears the entire database) */
    async reset(){
        if (!this.database) return
        const data = await this.database.getAll()
        for (const d of data){
            if (!this.database) return
            await this.database.delete(d.category,d.key)
        }
    }
    /**Run a function when the stats are initialized. This can be used to clear stats from users that left the server or tickets which don't exist anymore. */
    onInit(callback:ODStatsManagerInitCallback){
        this.#initListeners.push(callback)
    }
}

/**## ODStatScope `class`
 * This is an Open Ticket stat scope.
 * 
 * A scope can contain multiple stats. Every scope is seperated from other scopes.
 * Here, you can read & write the values of all stats.
 * 
 * The built-in Open Ticket scopes are: `global`, `user`, `ticket`
 */
export class ODStatScope extends ODManager<ODStat> {
    /**The id of this statistics scope. */
    id: ODId
    /**Is this stat scope already initialized? */
    ready: boolean = false
    /**Alias to Open Ticket stats database. */
    database: ODDatabase|null = null
    /**The name of this scope (used in embed title) */
    name:string

    constructor(id:ODValidId, name:string){
        super()
        this.id = new ODId(id)
        this.name = name
    }

    /**Select the database to use to read/write all stats from/to. (Automatically assigned when used in `ODStatsManager`) */
    useDatabase(database:ODDatabase){
        this.database = database
    }
    /**Get the value of a statistic. The `scopeId` is the unique id of the user, channel, role, etc that the stats are related to. */
    async getStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        if (!this.database) return null
        const newId = new ODId(id)
        const data = await this.database.get(this.id.value+"_"+newId.value,scopeId)

        if (typeof data == "undefined"){
            //set stats to default value & return
            return this.resetStat(id,scopeId)
        }else if (typeof data == "string" || typeof data == "boolean" || typeof data == "number"){
            //return value received from database
            return data
        }
        //return null on error
        return null
    }
    /**Set, increase or decrease the value of a statistic. The `scopeId` is the unique id of the user, channel, role, etc that the stats are related to. */
    async setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        if (!this.database) return false
        const stat = this.get(id)
        if (!stat) return false
        if (mode == "set" || typeof value != "number"){
            await this.database.set(this.id.value+"_"+stat.id.value,scopeId,value)
        }else if (mode == "increase"){
            const currentValue = await this.getStat(id,scopeId)
            if (typeof currentValue != "number") await this.database.set(this.id.value+"_"+stat.id.value,scopeId,0+value)
            else await this.database.set(this.id.value+"_"+stat.id.value,scopeId,currentValue+value)
        }else if (mode == "decrease"){
            const currentValue = await this.getStat(id,scopeId)
            if (typeof currentValue != "number") await this.database.set(this.id.value+"_"+stat.id.value,scopeId,0-value)
            else await this.database.set(this.id.value+"_"+stat.id.value,scopeId,currentValue-value)
        }
        return true
    }
    /**Reset the value of a statistic to the initial value. The `scopeId` is the unique id of the user, channel, role, etc that the stats are related to. */
    async resetStat(id:ODValidId, scopeId:string): Promise<ODValidStatValue|null> {
        if (!this.database) return null
        const stat = this.get(id)
        if (!stat) return null
        if (stat.value != null) await this.database.set(this.id.value+"_"+stat.id.value,scopeId,stat.value)
        return stat.value
    }
    /**Initialize this stat scope & return a list of all statistic ids in the following format: `<scopeid>_<statid>`  */
    init(): string[] {
        //get all valid stats categories
        this.ready = true
        return this.getAll().map((stat) => this.id.value+"_"+stat.id.value)
    }
    /**Render all stats in this scope for usage in a discord message/embed. */
    async render(scopeId:string, guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User): Promise<string> {
        //sort from high priority to low
        const derefArray = [...this.getAll()]
        derefArray.sort((a,b) => {
            return b.priority-a.priority
        })
        const result: string[] = []

        for (const stat of derefArray){
            try {
                if (stat instanceof ODDynamicStat){
                    //dynamic render (without value)
                    result.push(await stat.render("",scopeId,guild,channel,user))
                }else{
                    //normal render (with value)
                    const value = await this.getStat(stat.id,scopeId)
                    if (value != null) result.push(await stat.render(value,scopeId,guild,channel,user))
                }
                
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }

        return result.filter((stat) => stat !== "").join("\n")
    }
}

/**## ODStatGlobalScope `class`
 * This is an Open Ticket stat global scope.
 * 
 * A scope can contain multiple stats. Every scope is seperated from other scopes.
 * Here, you can read & write the values of all stats.
 * 
 * This scope is made specifically for the global stats of Open Ticket.
 */
export class ODStatGlobalScope extends ODStatScope {
    getStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.getStat(id,"GLOBAL")
    }
    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): Promise<boolean> {
        return super.setStat(id,"GLOBAL",value,mode)
    }
    resetStat(id:ODValidId): Promise<ODValidStatValue|null> {
        return super.resetStat(id,"GLOBAL")
    }
    render(scopeId:"GLOBAL", guild:discord.Guild, channel:discord.TextBasedChannel, user: discord.User): Promise<string> {
        return super.render("GLOBAL",guild,channel,user)
    }
}

/**## ODStatRenderer `type`
 * This callback will render a single statistic for a discord embed/message.
 */
export type ODStatRenderer = (value:ODValidStatValue, scopeId:string, guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User) => string|Promise<string>

/**## ODStat `class`
 * This is an Open Ticket statistic.
 * 
 * This single statistic doesn't do anything except defining the rules of this statistic.
 * Use it in a stats scope to register a new statistic. A statistic can also include a priority to choose the render priority.
 * 
 * It's recommended to use the `ODBasicStat` & `ODDynamicStat` classes instead of this one!
 */
export class ODStat extends ODManagerData {
    /**The priority of this statistic. */
    priority: number
    /**The render function of this statistic. */
    render: ODStatRenderer
    /**The value of this statistic. */
    value: ODValidStatValue|null

    constructor(id:ODValidId, priority:number, render:ODStatRenderer, value?:ODValidStatValue){
        super(id)
        this.priority = priority
        this.render = render
        this.value = value ?? null
    }
}

/**## ODBasicStat `class`
 * This is an Open Ticket basic statistic.
 * 
 * This single statistic will store a number, boolean or string in the database.
 * Use it to create a simple statistic for any stats scope.
 */
export class ODBasicStat extends ODStat {
    /**The name of this stat. Rendered in discord embeds/messages. */
    name: string

    constructor(id:ODValidId, priority:number, name:string, value:ODValidStatValue){
        super(id,priority,(value) => {
            return ""+name+": `"+value.toString()+"`"
        },value)
        this.name = name
    }
}

/**## ODDynamicStatRenderer `type`
 * This callback will render a single dynamic statistic for a discord embed/message.
 */
export type ODDynamicStatRenderer = (scopeId:string, guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User) => string|Promise<string>

/**## ODDynamicStat `class`
 * This is an Open Ticket dynamic statistic.
 * 
 * A dynamic statistic does not store anything in the database! Instead, it will execute a function to return a custom result.
 * This can be used to show statistics which are not stored in the database.
 * 
 * This is used in Open Ticket for the live ticket status, participants & system status.
 */
export class ODDynamicStat extends ODStat {
    constructor(id:ODValidId, priority:number, render:ODDynamicStatRenderer){
        super(id,priority,(value,scopeId,guild,channel,user) => {
            return render(scopeId,guild,channel,user)
        })
    }
}