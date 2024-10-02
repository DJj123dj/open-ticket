///////////////////////////////////////
//CONFIG MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"

/**## ODConfigManager `class`
 * This is an open ticket config manager.
 * 
 * It manages all config files in the bot and allows plugins to access config files from open ticket & other plugins!
 * 
 * You will use this class to get/add a config file (`ODConfig`) in your plugin!
 * @example
 * //get ./config/general.json => ODConfig class
 * const generalConfig = openticket.configs.get("openticket:general")
 * 
 * //add a new config with id "test" => ./config/test.json
 * const testConfig = new api.ODConfig("test","test.json")
 * openticket.configs.add(testConfig)
 */
export class ODConfigManager extends ODManager<ODConfig> {
    constructor(debug:ODDebugger){
        super(debug,"config")
    }

    /**Add data to the manager. The id will be fetched from the data class! You can optionally select to overwrite existing data!
     * @example
     * //add a new config with id "test" => ./config/test.json
     * const testConfig = new api.ODConfig("test","test.json")
     * openticket.configs.add(testConfig)
    */
    add(data:ODConfig, overwrite?:boolean): boolean {
        return super.add(data,overwrite)
    }
    /**Get data that matches the `ODId`. Returns the found data.
     * @example
     * //get "./config/general.json" (ot-general) => ODConfig class
     * const generalConfig = openticket.configs.get("openticket:general")
     */
    get(id:ODValidId): ODConfig|null {
        return super.get(id)
    }
    /**Remove data that matches the `ODId`. Returns the removed data.
     * @example
     * //remove the "test" config
     * openticket.configs.remove("test") //returns null if non-existing
     */
    remove(id:ODValidId): ODConfig|null {
        return super.remove(id)
    }
    /**Check if data that matches the `ODId` exists. Returns a boolean.
     * @example
     * //check if "./config/general.json" (ot-general) exists => boolean
     * const exists = openticket.configs.exists("openticket:general")
     */
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODConfig `class`
 * This is an open ticket config helper.
 * This class doesn't do anything at all, it just gives a template & basic methods for a config. Use `ODJsonConfig` instead!
 * 
 * You will only use this class if you want to create your own config implementation (e.g. `yml`, `xml`,...)!
 */
export class ODConfig extends ODManagerData {
    /**The name of the file with extension. */
    file: string = ""
    /**The path to the file relative to the main directory. */
    path: string = ""
    /**An object/array of the entire config file! Variables inside it can be edited while the bot is running! */
    data: any = undefined
}

/**## ODJsonConfig `class`
 * This is an open ticket config helper.
 * You will use this class to get & edit variables from the config files or to create your own config!
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
        super(id)
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./config/",this.file)
            
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