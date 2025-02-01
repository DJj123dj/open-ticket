///////////////////////////////////////
//PLUGIN MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId, ODVersion } from "./base"
import nodepath from "path"
import { ODConsolePluginMessage, ODConsoleWarningMessage, ODDebugger } from "./console"

/**## ODUnknownCrashedPlugin `interface`
 * Basic details for a plugin that crashed while loading the `plugin.json` file.
 */
export interface ODUnknownCrashedPlugin {
    /**The name of the plugin. (path when plugin crashed before `name` was loaded) */
    name:string,
    /**The description of the plugin. (when found before crashing) */
    description:string
}

/**## ODPluginManager `class`
 * This is an Open Ticket plugin manager.
 * 
 * It manages all active plugins in the bot!
 * It also contains all "plugin classes" which are managers registered by plugins.
 * These are accessible via the `opendiscord.plugins.classes` global.
 * 
 * Use `isPluginLoaded()` to check if a plugin has been loaded. 
 */
export class ODPluginManager extends ODManager<ODPlugin> {
    /**A manager for all custom managers registered by plugins. */
    classes: ODPluginClassManager
    /**A list of basic details from all plugins that crashed while loading the `plugin.json` file. */
    unknownCrashedPlugins: ODUnknownCrashedPlugin[] = []
    
    constructor(debug:ODDebugger){
        super(debug,"plugin")
        this.classes = new ODPluginClassManager(debug)
    }

    /**Check if a plugin has been loaded successfully and is available for usage.*/
    isPluginLoaded(id:ODValidId): boolean {
        const newId = new ODId(id)
        const plugin = this.get(newId)
        return (plugin !== null && plugin.executed)
    }
}

/**## ODPluginData `interface`
 * Parsed data from the `plugin.json` file in a plugin.
 */
export interface ODPluginData {
    /**The name of this plugin (shown on startup) */
    name:string,
    /**The id of this plugin. (Must be identical to directory name) */
    id:string,
    /**The version of this plugin. */
    version:string,
    /**The location of the start file of the plugin relative to the rootDir of the plugin */
    startFile:string,

    /**Is this plugin enabled? */
    enabled:boolean,
    /**The priority of this plugin. Higher priority will load before lower priority. */
    priority:number,
    /**A list of events to register to the `opendiscord.events` global before loading any plugins. This way, plugins with a higher priority are able to use events from this plugin as well! */
    events:string[]

    /**Npm dependencies which are required for this plugin to work. */
    npmDependencies:string[],
    /**Plugins which are required for this plugin to work. */
    requiredPlugins:string[],
    /**Plugins which are incompatible with this plugin. */
    incompatiblePlugins:string[],

    /**Additional details about this plugin. */
    details:ODPluginDetails
}

/**## ODPluginDetails `interface`
 * Additional details in the `plugin.json` file from a plugin.
 */
export interface ODPluginDetails {
    /**The author of the plugin. */
    author:string,
    /**A short description of this plugin. */
    shortDescription:string,
    /**A large description of this plugin. */
    longDescription:string,
    /**A URL to a cover image of this plugin. (currently unused) */
    imageUrl:string,
    /**A URL to the website/project page of this plugin. (currently unused) */
    projectUrl:string,
    /**A list of tags/categories that this plugin affects. */
    tags:string[]
}

/**## ODPlugin `class`
 * This is an Open Ticket plugin.
 * 
 * It represents a single plugin in the `./plugins/` directory.
 * All plugins are accessible via the `opendiscord.plugins` global.
 * 
 * Don't re-execute plugins which are already enabled! It might break the bot or plugin. 
 */
export class ODPlugin extends ODManagerData {
    /**The name of the directory of this plugin. (same as id) */
    dir: string
    /**All plugin data found in the `plugin.json` file. */
    data: ODPluginData
    /**The name of this plugin. */
    name: string
    /**The priority of this plugin. */
    priority: number
    /**The version of this plugin. */
    version: ODVersion
    /**The additional details of this plugin. */
    details: ODPluginDetails

    /**Is this plugin enabled? */
    enabled: boolean
    /**Did this plugin execute successfully?. */
    executed: boolean
    /**Did this plugin crash? (A reason is available in the `crashReason`) */
    crashed: boolean
    /**The reason which caused this plugin to crash. */
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

    /**Get the startfile location relative to the `./plugins/` directory. (`./dist/plugins/`) when compiled) */
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

    /**Check if a npm dependency exists. */
    #checkDependency(id:string){
        try{
            require.resolve(id)
            return true
        }catch{
            return false
        }
    }

    /**Get a list of all missing npm dependencies that are required for this plugin. */
    dependenciesInstalled(){
        const missing: string[] = []
        this.data.npmDependencies.forEach((d) => {
            if (!this.#checkDependency(d)){
                missing.push(d)
            }
        })
        
        return missing
    }
    /**Get a list of all missing plugins that are required for this plugin. */
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
    /**Get a list of all enabled incompatible plugins that interfere with this plugin. */
    pluginsIncompatible(manager:ODPluginManager){
        const incompatible: string[] = []
        this.data.incompatiblePlugins.forEach((p) => {
            const plugin = manager.get(p)
            if (plugin && plugin.enabled){
                incompatible.push(p)
            }
        })
        
        return incompatible
    }
}

/**## ODPluginClassManager `class`
 * This is an Open Ticket plugin class manager.
 * 
 * It manages all managers registered by plugins!
 * Plugins are able to register their own managers, handlers, functions, classes, ... here.
 * By doing this, other plugins are also able to make use of it.
 * This can be useful for plugins that want to extend other plugins.
 * 
 * Use `isPluginLoaded()` to check if a plugin has been loaded before trying to access the manager.
 */
export class ODPluginClassManager extends ODManager<ODManagerData> {
    constructor(debug:ODDebugger){
        super(debug,"plugin class")
    }
}