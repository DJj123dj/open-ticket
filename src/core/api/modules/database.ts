///////////////////////////////////////
//DATABASE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId, ODValidJsonType } from "./base"
import fs from "fs"
import nodepath from "path"
import { ODDebugger } from "./console"
import * as fjs from "formatted-json-stringify"

/**## ODDatabaseManager `class`
 * This is an open ticket database manager.
 * 
 * It manages all databases in the bot and allows to permanently store data from the bot!
 * 
 * You will use this class to get/add a database (`ODDatabase`) in your plugin!
 * @example
 * //get ./database/ot-global.json => ODDatabase class
 * const globalDB = openticket.databases.get("openticket:global")
 * 
 * //add a new database with id "test" => ./database/idk-test.json
 * const testDatabase = new api.ODDatabase("test","idk-test.json")
 * openticket.databases.add(testDatabase)
 */
export class ODDatabaseManager extends ODManager<ODDatabase> {
    constructor(debug:ODDebugger){
        super(debug,"database")
    }
    
    /**Add data to the manager. The id will be fetched from the data class! You can optionally select to overwrite existing data!
     * @example
     * //add a new database with id "test" => ./database/idk-test.json
     * const testDatabase = new api.ODDatabase("test","idk-test.json")
     * openticket.databases.add(testDatabase)
    */
    add(data:ODDatabase, overwrite?:boolean): boolean {
        return super.add(data,overwrite)
    }
    /**Get data that matches the `ODId`. Returns the found data.
     * @example
     * //get ./database/ot-global.json => ODDatabase class
     * const globalDB = openticket.databases.get("openticket:global")
     */
    get(id:ODValidId): ODDatabase|null {
        return super.get(id)
    }
    /**Remove data that matches the `ODId`. Returns the removed data.
     * @example
     * //remove the "test" database
     * openticket.databases.remove("test") //returns null if non-existing
     */
    remove(id:ODValidId): ODDatabase|null {
        return super.remove(id)
    }
    /**Check if data that matches the `ODId` exists. Returns a boolean.
     * @example
     * //check if "./database/idk-test.json" (test) exists => boolean
     * const exists = openticket.databases.exists("test")
     */
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODDatabase `class`
 * This is an open ticket database template.
 * This class doesn't do anything at all, it just gives a template & basic methods for a database. Use `ODJsonDatabase` instead!
 * 
 * You will only use this class if you want to create your own database implementation (e.g. `mongodb`, `mysql`,...)!
 * @example
 * class SomeDatabase extends ODDatabase {
 *   //override this method
 *   setData(category:string, key:string, value:ODValidJsonType): boolean {
 *     return false
 *   }
 *   //override this method
 *   getData(category:string, key:string): ODValidJsonType|undefined {
 *     return undefined
 *   }
 *   //override this method
 *   deleteData(category:string, key:string): boolean {
 *     return false
 *   }
 * }
 */
export class ODDatabase extends ODManagerData {
    /**The full path to this database with extension */
    file: string = ""

    /**Add/Overwrite a specific category & key in the database. Returns `true` when overwritten. */
    set(category:string, key:string, value:ODValidJsonType): boolean {
        return false
    }
    /**Get a specific category & key in the database */
    get(category:string, key:string): ODValidJsonType|undefined {
        return undefined
    }
    /**Delete a specific category & key in the database */
    delete(category:string, key:string): boolean {
        return false
    }
    /**Check if a specific category & key exists in the database */
    exists(category:string, key:string): boolean {
        return false
    }
    /**Get a specific category in the database */
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        return undefined
    }
    /**Get all values in the database */
    getAll(): ODJsonDatabaseStructure {
        return []
    }
}

/**## ODJsonDatabaseStructure `type`
 * This is the structure of how a JSON database file!
 */
export type ODJsonDatabaseStructure = {category:string, key:string, value:ODValidJsonType}[]

/**## ODJsonDatabase `class`
 * This is an open ticket JSON database.
 * It stores data in a `json` file as a large `Array` using the `category`, `key`, `value` strategy.
 * You can store the following types: `string`, `number`, `boolean`, `array`, `object` & `null`!
 * 
 * You will only use this class if you want to create your own database or use an existing one!
 * @example
 * //get,set & delete data
 * const data = database.getData("category","key") //data will be the value
 * const didOverwrite = database.setData("category","key","value") //value can be any of the valid types
 * const didExist = database.deleteData("category","key") //delete this value
 * //You need an ODJsonDatabase class named "database" for this example to work!
 */
export class ODJsonDatabase extends ODDatabase {
    constructor(id:ODValidId, file:string, customPath?:string){
        super(id)
        const filename = (file.endsWith(".json")) ? file : file+".json"
        this.file = customPath ? nodepath.join("./",customPath,filename) : nodepath.join("./database/",filename)
        
        //init file if it doesn't exist yet
        this.#system.getData()
    }

    /**Set/overwrite the value of `category` & `key`. Returns `true` when overwritten!
     * @example
     * const didOverwrite = database.setData("category","key","value") //value can be any of the valid types
     * //You need an ODJsonDatabase class named "database" for this example to work!
     */
    set(category:string, key:string, value:ODValidJsonType): boolean {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        
        //overwrite when already present
        if (currentData){
            currentList[currentList.indexOf(currentData)].value = value
        }else{
            currentList.push({category,key,value})
        }

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Get the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const data = database.getData("category","key") //data will be the value
     * //You need an ODJsonDatabase class named "database" for this example to work!
     */
    get(category:string, key:string): ODValidJsonType|undefined {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? tempresult.value : undefined
    }
    /**Remove the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const didExist = database.deleteData("category","key") //delete this value
     * //You need an ODJsonDatabase class named "database" for this example to work!
     */
    delete(category:string, key:string): boolean {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        if (currentData) currentList.splice(currentList.indexOf(currentData),1)

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Check if a value of `category` & `key` exists. Returns `false` when non-existent! */
    exists(category:string, key:string): boolean {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? true : false
    }
    /**Get all values in `category`. Returns `undefined` when non-existent! */
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        const currentList = this.#system.getData()
        const tempresult = currentList.filter((d) => (d.category === category))
        return tempresult ? tempresult.map((data) => {return {key:data.key,value:data.value}}) : undefined
    }
    /**Get all values in `category`. */
    getAll(): ODJsonDatabaseStructure {
        return this.#system.getData()
    }

    #system = {
        /**Read parsed data from the json file */
        getData: (): ODJsonDatabaseStructure => {
            if (fs.existsSync(this.file)){
                return JSON.parse(fs.readFileSync(this.file).toString())
            }else{
                fs.writeFileSync(this.file,"[]")
                return []
            }
        },
        /**Write parsed data to the json file */
        setData: (data:ODJsonDatabaseStructure) => {
            fs.writeFileSync(this.file,JSON.stringify(data,null,"\t"))
        }
    }
}


/**## ODFormattedJsonDatabase `class`
 * This is an open ticket Formatted JSON database.
 * It stores data in a `json` file as a large `Array` using the `category`, `key`, `value` strategy.
 * You can store the following types: `string`, `number`, `boolean`, `array`, `object` & `null`!
 * 
 * This one is exactly the same as `ODJsonDatabase`, but it has a formatter from the `formatted-json-stringify` package.
 * This can help you organise it a little bit better!
 */
export class ODFormattedJsonDatabase extends ODDatabase {
    /**The formatter to use on the database array */
    formatter: fjs.ArrayFormatter

    constructor(id:ODValidId, file:string, formatter:fjs.ArrayFormatter, customPath?:string){
        super(id)
        const filename = (file.endsWith(".json")) ? file : file+".json"
        this.file = customPath ? nodepath.join("./",customPath,filename) : nodepath.join("./database/",filename)
        this.formatter = formatter

        //init file if it doesn't exist yet
        this.#system.getData()
    }

    /**Set/overwrite the value of `category` & `key`. Returns `true` when overwritten!
     * @example
     * const didOverwrite = database.setData("category","key","value") //value can be any of the valid types
     * //You need an ODFormattedJsonDatabase class named "database" for this example to work!
     */
    set(category:string, key:string, value:ODValidJsonType): boolean {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        
        //overwrite when already present
        if (currentData){
            currentList[currentList.indexOf(currentData)].value = value
        }else{
            currentList.push({category,key,value})
        }

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Get the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const data = database.getData("category","key") //data will be the value
     * //You need an ODFormattedJsonDatabase class named "database" for this example to work!
     */
    get(category:string, key:string): ODValidJsonType|undefined {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? tempresult.value : undefined
    }
    /**Remove the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const didExist = database.deleteData("category","key") //delete this value
     * //You need an ODFormattedJsonDatabase class named "database" for this example to work!
     */
    delete(category:string, key:string): boolean {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        if (currentData) currentList.splice(currentList.indexOf(currentData),1)

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Check if a value of `category` & `key` exists. Returns `false` when non-existent! */
    exists(category:string, key:string): boolean {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? true : false
    }
    /**Get all values in `category`. Returns `undefined` when non-existent! */
    getCategory(category:string): {key:string, value:ODValidJsonType}[]|undefined {
        const currentList = this.#system.getData()
        const tempresult = currentList.filter((d) => (d.category === category))
        return tempresult ? tempresult.map((data) => {return {key:data.key,value:data.value}}) : undefined
    }
    /**Get all values in `category`. */
    getAll(): ODJsonDatabaseStructure {
        return this.#system.getData()
    }

    #system = {
        /**Read parsed data from the json file */
        getData: (): ODJsonDatabaseStructure => {
            if (fs.existsSync(this.file)){
                return JSON.parse(fs.readFileSync(this.file).toString())
            }else{
                fs.writeFileSync(this.file,"[]")
                return []
            }
        },
        /**Write parsed data to the json file */
        setData: (data:ODJsonDatabaseStructure) => {
            fs.writeFileSync(this.file,this.formatter.stringify(data))
        }
    }
}