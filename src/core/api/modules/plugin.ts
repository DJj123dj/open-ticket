///////////////////////////////////////
//PLUGIN MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId, ODVersion } from "./base"
import nodepath from "path"
import { ODConsolePluginMessage, ODConsoleWarningMessage, ODDebugger } from "./console"

export interface ODUnknownCrashedPlugin {
    name:string,
    description:string
}

export class ODPluginManager extends ODManager<ODPlugin> {
    events: ODPluginEventManager
    classes: ODPluginClassManager
    unknownCrashedPlugins: ODUnknownCrashedPlugin[] = []
    
    constructor(debug:ODDebugger){
        super(debug,"plugin")
        this.events = new ODPluginEventManager(debug)
        this.classes = new ODPluginClassManager(debug)
    }

    /**Check if a plugin has loaded successfully.*/
    isPluginLoaded(id:ODValidId){
        const newId = new ODId(id)
        const plugin = this.get(newId)
        return (plugin && plugin.executed)
    }
}

export interface ODPluginData {
    name:string,
    id:string,
    version:string,
    startFile:string,

    enabled:boolean,
    priority:number,
    events:string[]

    npmDependencies:string[],
    requiredPlugins:string[],
    incompatiblePlugins:string[],

    details:ODPluginDetails
}

export interface ODPluginDetails {
    author:string,
    shortDescription:string,
    longDescription:string,
    imageUrl:string,
    projectUrl:string,
    tags:string[]
}

export class ODPlugin extends ODManagerData {
    dir: string
    data: ODPluginData
    name: string
    priority: number
    version: ODVersion
    details: ODPluginDetails

    enabled: boolean
    executed: boolean
    crashed: boolean
    crashReason: null|"incompatible.plugin"|"missing.plugin"|"missing.dependency"|"executed" = null
    
    constructor(dir:string, jsondata:ODPluginData){
        super(jsondata.id)
        this.dir = dir
        this.data = jsondata
        this.name = jsondata.name
        this.priority = jsondata.priority
        this.version = ODVersion.fromString("plugin",jsondata.version)
        this.details = jsondata.details

        this.enabled = jsondata.enabled
        this.executed = false
        this.crashed = false
    }

    //Get the startfile location relative to the ./plugins/ directory
    getStartFile(){
        const newFile = this.data.startFile.replace(/\.ts$/,".js")
        return nodepath.join(this.dir,newFile)
    }
    /**Execute this plugin. Returns `false` on crash. */
    async execute(debug:ODDebugger,force?:boolean): Promise<boolean> {
        if ((this.enabled && !this.crashed) || force){
            try{
                await import(nodepath.join("../../../../plugins/",this.getStartFile()))
                debug.console.log("Plugin \""+this.id.value+"\" loaded successfully!","plugin")
                this.executed = true
                return true
            }catch(error){
                this.crashed = true
                this.crashReason = "executed"

                debug.console.log(error.message+", canceling plugin execution...","plugin",[
                    {key:"path",value:"./plugins/"+this.dir}
                ])
                debug.console.log("You can see more about this error in the ./otdebug.txt file!","info")
                debug.console.debugfile.writeText(error.stack)

                return false
            }
        }else return true
    }

    #checkDependency(id:string){
        try{
            require.resolve(id)
            return true
        }catch{
            return false
        }
    }

    dependenciesInstalled(){
        const missing: string[] = []
        this.data.npmDependencies.forEach((d) => {
            if (!this.#checkDependency(d)){
                missing.push(d)
            }
        })
        
        return missing
    }
    pluginsInstalled(manager:ODPluginManager){
        const missing: string[] = []
        this.data.requiredPlugins.forEach((p) => {
            const plugin = manager.get(p)
            if (!plugin || !plugin.enabled){
                missing.push(p)
            }
        })
        
        return missing
    }
}

export class ODPluginEvent extends ODManagerData {
    listeners: Function[] = []
    oncelisteners: Function[] = []
    
    getCurrentListeners(){
        const final: Function[] = []
        this.oncelisteners.forEach((l) => final.push(l))
        this.listeners.forEach((l) => final.push(l))

        this.oncelisteners = []
        return final
    }
}

export class ODPluginEventManager extends ODManager<ODPluginEvent> {
    #debug: ODDebugger
    listenerLimit: number = 25

    constructor(debug:ODDebugger){
        super(debug,"plugin event")
        this.#debug = debug
    }

    setListenerLimit(limit:number){
        this.listenerLimit = limit
    }

    on(event:string, callback:Function){
        const eventdata = this.get(event)
        if (eventdata){
            eventdata.listeners.push(callback)

            if (eventdata.listeners.length > this.listenerLimit){
                this.#debug.console.log(new ODConsoleWarningMessage("Possible plugin event memory leak detected!",[
                    {key:"event",value:event},
                    {key:"listeners",value:eventdata.listeners.length.toString()}
                ]))
            }
        }else{
            throw new ODSystemError("unknown plugin event \""+event+"\"")
        }
    }

    once(event:string, callback:Function){
        const eventdata = this.get(event)
        if (eventdata){
            eventdata.oncelisteners.push(callback)

        }else{
            throw new ODSystemError("unknown plugin event \""+event+"\"")
        }
    }

    wait(event:string): Promise<any[]> {
        return new Promise((resolve,reject) => {
            const eventdata = this.get(event)
            if (eventdata){
                eventdata.oncelisteners.push((...args:any) => {resolve(args)})
            }else{
                reject("unknown plugin event \""+event+"\"")
            }
        })
    }

    emit(event:string, params:any[]): Promise<void> {
        return new Promise(async (resolve,reject) => {
            const eventdata = this.get(event)
            if (eventdata){
                const listeners = eventdata.getCurrentListeners()

                for (const listener of listeners){
                    try {
                        await listener(...params)
                    }catch(err){
                        process.emit("uncaughtException",err)
                    }
                }
                resolve()
            }else{
                reject("unknown plugin event \""+event+"\"")
            }
        })
    }
}

export class ODPluginClassManager extends ODManager<ODManagerData> {
    constructor(debug:ODDebugger){
        super(debug,"plugin class")
    }
}