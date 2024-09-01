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
    classes: ODPluginClassManager
    unknownCrashedPlugins: ODUnknownCrashedPlugin[] = []
    
    constructor(debug:ODDebugger){
        super(debug,"plugin")
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
                //rewrite the path to make it work on windows & unix based systems
                const workingDir = process.cwd().replace(/C:\\/i,"/")
                const workingPath = nodepath.join("./dist/plugins/",this.getStartFile())
                const pluginPath = nodepath.join(workingDir,workingPath).split(nodepath.sep).join("/")
                
                await import(pluginPath)
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

export class ODPluginClassManager extends ODManager<ODManagerData> {
    constructor(debug:ODDebugger){
        super(debug,"plugin class")
    }
}