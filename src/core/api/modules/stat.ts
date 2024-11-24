///////////////////////////////////////
//STAT MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import { ODDebugger } from "./console"
import { ODDatabase, ODJsonDatabaseStructure } from "./database"
import * as discord from "discord.js"

export type ODValidStatValue = string|number|boolean
export type ODStatsManagerInitCallback = (database:ODJsonDatabaseStructure, deletables:ODJsonDatabaseStructure) => void|Promise<void>
export type ODStatScopeSetMode = "set"|"increase"|"decrease"

export class ODStatsManager extends ODManager<ODStatScope> {
    /**Alias to open ticket debugger. */
    #debug: ODDebugger
    /**Alias to open ticket stats database. */
    database: ODDatabase|null = null
    /**All the listeners for the init event. */
    #initListeners: ODStatsManagerInitCallback[] = []

    constructor(debug:ODDebugger){
        super(debug,"stat scope")
        this.#debug = debug
    }

    useDatabase(database:ODDatabase){
        this.database = database
    }
    add(data:ODStatScope, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"stat")
        if (this.database) data.useDatabase(this.database)
        return super.add(data,overwrite)
    }
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
        deletableStats.forEach((data) => {
            if (!this.database) return
            this.database.delete(data.category,data.key)
        })
    }
    async reset(){
        if (!this.database) return
        const data = await this.database.getAll()
        data.forEach((data) => {
            if (!this.database) return
            this.database.delete(data.category,data.key)
        })
    }
    onInit(callback:ODStatsManagerInitCallback){
        this.#initListeners.push(callback)
    }
}

export class ODStatScope extends ODManager<ODStat> {
    /**The id of this statistics scope. */
    id: ODId
    /**Is this stat scope already initialized? */
    ready: boolean = false
    /**Alias to open ticket stats database. */
    database: ODDatabase|null = null
    /**The name of this scope (used in embed title) */
    name:string

    constructor(id:ODValidId, name:string){
        super()
        this.id = new ODId(id)
        this.name = name
    }

    useDatabase(database:ODDatabase){
        this.database = database
    }
    getStat(id:ODValidId, scopeId:string): ODValidStatValue|null {
        if (!this.database) return null
        const newId = new ODId(id)
        const data = this.database.get(this.id.value+"_"+newId.value,scopeId)

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
    setStat(id:ODValidId, scopeId:string, value:ODValidStatValue, mode:ODStatScopeSetMode): boolean {
        if (!this.database) return false
        const stat = this.get(id)
        if (!stat) return false
        if (mode == "set" || typeof value != "number"){
            this.database.set(this.id.value+"_"+stat.id.value,scopeId,value)
        }else if (mode == "increase"){
            const currentValue = this.getStat(id,scopeId)
            if (typeof currentValue != "number") this.database.set(this.id.value+"_"+stat.id.value,scopeId,0)
            else this.database.set(this.id.value+"_"+stat.id.value,scopeId,currentValue+value)
        }else if (mode == "decrease"){
            const currentValue = this.getStat(id,scopeId)
            if (typeof currentValue != "number") this.database.set(this.id.value+"_"+stat.id.value,scopeId,0)
            else this.database.set(this.id.value+"_"+stat.id.value,scopeId,currentValue-value)
        }
        return true
    }
    resetStat(id:ODValidId, scopeId:string): ODValidStatValue|null {
        if (!this.database) return null
        const stat = this.get(id)
        if (!stat) return null
        if (stat.value != null) this.database.set(this.id.value+"_"+stat.id.value,scopeId,stat.value)
        return stat.value
    }
    init(): string[] {
        //get all valid stats categories
        this.ready = true
        return this.getAll().map((stat) => this.id.value+"_"+stat.id.value)
    }
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
                    const value = this.getStat(stat.id,scopeId)
                    if (value != null) result.push(await stat.render(value,scopeId,guild,channel,user))
                }
                
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }

        return result.filter((stat) => stat !== "").join("\n")
    }
}

export class ODStatGlobalScope extends ODStatScope {
    getStat(id:ODValidId): ODValidStatValue|null {
        return super.getStat(id,"GLOBAL")
    }
    setStat(id:ODValidId, value:ODValidStatValue, mode:ODStatScopeSetMode): boolean {
        return super.setStat(id,"GLOBAL",value,mode)
    }
    resetStat(id:ODValidId): ODValidStatValue|null {
        return super.resetStat(id,"GLOBAL")
    }
    render(scopeId:"GLOBAL", guild:discord.Guild, channel:discord.TextBasedChannel, user: discord.User): Promise<string> {
        return super.render("GLOBAL",guild,channel,user)
    }
}

export type ODStatRenderer = (value:ODValidStatValue, scopeId:string, guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User) => string|Promise<string>

export class ODStat extends ODManagerData {
    priority: number
    render: ODStatRenderer
    value: ODValidStatValue|null

    constructor(id:ODValidId, priority:number, render:ODStatRenderer, value?:ODValidStatValue){
        super(id)
        this.priority = priority
        this.render = render
        this.value = value ?? null
    }
}

export class ODBasicStat extends ODStat {
    name: string

    constructor(id:ODValidId, priority:number, name:string, value:ODValidStatValue){
        super(id,priority,(value) => {
            return ""+name+": `"+value.toString()+"`"
        },value)
        this.name = name
    }
}

export type ODDynamicStatRenderer = (scopeId:string, guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User) => string|Promise<string>

export class ODDynamicStat extends ODStat {
    constructor(id:ODValidId, priority:number, render:ODDynamicStatRenderer){
        super(id,priority,(value,scopeId,guild,channel,user) => {
            return render(scopeId,guild,channel,user)
        })
    }
}