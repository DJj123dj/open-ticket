///////////////////////////////////////
//CONFIG MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODPromiseVoid, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"

/**## ODConfigManager `class`
 * This is an Open Ticket config manager.
 * 
 * It manages all config files in the bot and allows plugins to access config files from Open Ticket & other plugins!
 * 
 * You can use this class to get/change/add a config file (`ODConfig`) in your plugin!
 */
export class ODConfigManager extends ODManager<ODConfig> {
    constructor(debug:ODDebugger){
        super(debug,"config")
    }
    /**Init all config files. */
    async init(){
        for (const config of this.getAll()){
            try{
                await config.init()
            }catch(err){
                process.emit("uncaughtException",new ODSystemError(err))
            }
        }
    }
}

/**## ODConfig `class`
 * This is an Open Ticket config helper.
 * This class doesn't do anything at all, it just gives a template & basic methods for a config. Use `ODJsonConfig` instead!
 * 
 * You can use this class if you want to create your own config implementation (e.g. `yml`, `xml`,...)!
 */
export class ODConfig extends ODManagerData {
    /**The name of the file with extension. */
    file: string = ""
    /**The path to the file relative to the main directory. */
    path: string = ""
    /**An object/array of the entire config file! Variables inside it can be edited while the bot is running! */
    data: any

    constructor(id:ODValidId, data:any){
        super(id)
        this.data = data
    }

    /**Init the config. */
    init(): ODPromiseVoid {
        //nothing
    }
}

/**## ODJsonConfig `class`
 * This is an Open Ticket JSON config.
 * You can use this class to get & edit variables from the config files or to create your own JSON config!
 * @example
 * //create a config from: ./config/test.json with the id "some-config"
 * const config = new api.ODJsonConfig("some-config","test.json")
 * 
 * //create a config with custom dir: ./plugins/testplugin/test.json
 * const config = new api.ODJsonConfig("plugin-config","test.json","./plugins/testplugin/")
 */
export class ODJsonConfig extends ODConfig {
    /**An array of listeners to run when the config gets reloaded. These are not executed on the initial loading. */
    #reloadListeners: Function[] = []

    constructor(id:ODValidId, file:string, customPath?:string){
        super(id,{})
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./config/",this.file)
    }

    /**Init the config. */
    init(): ODPromiseVoid {
        if (!fs.existsSync(this.path)) throw new ODSystemError("Unable to parse config \""+nodepath.join("./",this.path)+"\", the file doesn't exist!")
        try{
            this.data = JSON.parse(fs.readFileSync(this.path).toString())
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to parse config \""+nodepath.join("./",this.path)+"\"!")
        }
    }
    /**Reload the JSON file. Be aware that this doesn't update classes that used individual parts of the config data! */
    reload(){
        if (!fs.existsSync(this.path)) throw new ODSystemError("Unable to reload config \""+nodepath.join("./",this.path)+"\", the file doesn't exist!")
        try{
            this.data = JSON.parse(fs.readFileSync(this.path).toString())
            this.#reloadListeners.forEach((cb) => {
                try{
                    cb()
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            })
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to reload config \""+nodepath.join("./",this.path)+"\"!")
        }
    }
    /**Listen for a reload of this JSON file! */
    onReload(cb:Function){
        this.#reloadListeners.push(cb)
    }
    /**Remove all reload listeners. Not recommended! */
    removeAllReloadListeners(){
        this.#reloadListeners = []
    }
}