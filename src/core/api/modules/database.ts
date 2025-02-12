///////////////////////////////////////
//DATABASE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODOptionalPromise, ODPromiseVoid, ODSystemError, ODValidId, ODValidJsonType } from "./base"
import fs from "fs"
import nodepath from "path"
import { ODDebugger } from "./console"
import * as fjs from "formatted-json-stringify"

/////////////////////////////////////////////////////////
//TEMPORARY OPENTICKET => OPENDISCORD MIGRATION UTILITIES
/////////////////////////////////////////////////////////

/** ## ❌ Temporary function. Will be removed on full OTv4 release! */
export function TEMP_migrateDatabaseIdPrefix(id:string): string {
    if (!id.startsWith("openticket:")) return id
    return id.replaceAll("openticket:","opendiscord:")
}
/** ## ❌ Temporary function. Will be removed on full OTv4 release! */
export function TEMP_migrateDatabaseValuePrefix(value:string): string {
    return value.replaceAll('"openticket:','"opendiscord:')
}
/** ## ❌ Temporary function. Will be removed on full OTv4 release! */
export function TEMP_migrateDatabaseStructurePrefix(structure:ODJsonDatabaseStructure): ODJsonDatabaseStructure {
    return structure.map((data) => {
        return {
            category:TEMP_migrateDatabaseIdPrefix(data.category),
            key:TEMP_migrateDatabaseIdPrefix(data.key),
            value:JSON.parse(TEMP_migrateDatabaseValuePrefix(JSON.stringify(data.value)))
        }
    })
}

/**## ODDatabaseManager `class`
 * This is an Open Ticket database manager.
 * 
 * It manages all databases in the bot and allows to permanently store data from the bot!
 * 
 * You can use this class to get/add a database (`ODDatabase`) in your plugin!
 */
export class ODDatabaseManager extends ODManager<ODDatabase> {
    constructor(debug:ODDebugger){
        super(debug,"database")
    }
    
    /**Init all database files. */
    async init(){
        for (const database of this.getAll()){
            try{
                await database.init()
            }catch(err){
                process.emit("uncaughtException",new ODSystemError(err))
            }
        }
    }
}

/**## ODDatabase `class`
 * This is an Open Ticket database template.
 * This class doesn't do anything at all, it just gives a template & basic methods for a database. Use `ODJsonDatabase` instead!
 * 
 * You can use this class if you want to create your own database implementation (e.g. `mongodb`, `mysql`,...)!
 */
export class ODDatabase extends ODManagerData {
    /**The name of the file with extension. */
    file: string = ""
    /**The path to the file relative to the main directory. */
    path: string = ""

    /**Init the database. */
    init(): ODPromiseVoid {
        //nothing
    }
    /**Add/Overwrite a specific category & key in the database. Returns `true` when overwritten. */
    set(category:string, key:string, value:ODValidJsonType): ODOptionalPromise<boolean> {
        return false
    }
    /**Get a specific category & key in the database */
    get(category:string, key:string): ODOptionalPromise<ODValidJsonType|undefined> {
        return undefined
    }
    /**Delete a specific category & key in the database */
    delete(category:string, key:string): ODOptionalPromise<boolean> {
        return false
    }
    /**Check if a specific category & key exists in the database */
    exists(category:string, key:string): ODOptionalPromise<boolean> {
        return false
    }
    /**Get a specific category in the database */
    getCategory(category:string): ODOptionalPromise<{key:string, value:ODValidJsonType}[]|undefined> {
        return undefined
    }
    /**Get all values in the database */
    getAll(): ODOptionalPromise<ODJsonDatabaseStructure> {
        return []
    }
}

/**## ODJsonDatabaseStructure `type`
 * This is the structure of how a JSON database file!
 */
export type ODJsonDatabaseStructure = {category:string, key:string, value:ODValidJsonType}[]

/**## ODJsonDatabase `class`
 * This is an Open Ticket JSON database.
 * It stores data in a `json` file as a large `Array` using the `category`, `key`, `value` strategy.
 * You can store the following types: `string`, `number`, `boolean`, `array`, `object` & `null`!
 * 
 * You can use this class if you want to add your own database or to use an existing one!
 */
export class ODJsonDatabase extends ODDatabase {
    constructor(id:ODValidId, file:string, customPath?:string){
        super(id)
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./database/",this.file)
    }

    /**Init the database. */
    init(): ODPromiseVoid {
        //this.#system.getData()
        //TEMPORARY!!!
        const newData = TEMP_migrateDatabaseStructurePrefix(this.#system.getData())
        this.#system.setData(newData)
    }
    /**Set/overwrite the value of `category` & `key`. Returns `true` when overwritten!
     * @example
     * const didOverwrite = database.setData("category","key","value") //value can be any of the valid types
     * //You need an ODJsonDatabase class named "database" for this example to work!
     */
    set(category:string, key:string, value:ODValidJsonType): ODOptionalPromise<boolean> {
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
    get(category:string, key:string): ODOptionalPromise<ODValidJsonType|undefined> {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? tempresult.value : undefined
    }
    /**Remove the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const didExist = database.deleteData("category","key") //delete this value
     * //You need an ODJsonDatabase class named "database" for this example to work!
     */
    delete(category:string, key:string): ODOptionalPromise<boolean> {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        if (currentData) currentList.splice(currentList.indexOf(currentData),1)

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Check if a value of `category` & `key` exists. Returns `false` when non-existent! */
    exists(category:string, key:string): ODOptionalPromise<boolean> {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? true : false
    }
    /**Get all values in `category`. Returns `undefined` when non-existent! */
    getCategory(category:string): ODOptionalPromise<{key:string, value:ODValidJsonType}[]|undefined> {
        const currentList = this.#system.getData()
        const tempresult = currentList.filter((d) => (d.category === category))
        return tempresult ? tempresult.map((data) => {return {key:data.key,value:data.value}}) : undefined
    }
    /**Get all values in `category`. */
    getAll(): ODOptionalPromise<ODJsonDatabaseStructure> {
        return this.#system.getData()
    }

    #system = {
        /**Read parsed data from the json file */
        getData: (): ODJsonDatabaseStructure => {
            if (fs.existsSync(this.path)){
                try{
                    return JSON.parse(fs.readFileSync(this.path).toString())
                }catch(err){
                    process.emit("uncaughtException",err)
                    throw new ODSystemError("Unable to read database "+this.path+"! getData() read error. (see error above)")
                }
            }else{
                fs.writeFileSync(this.path,"[]")
                return []
            }
        },
        /**Write parsed data to the json file */
        setData: (data:ODJsonDatabaseStructure) => {
            fs.writeFileSync(this.path,JSON.stringify(data,null,"\t"))
        }
    }
}


/**## ODFormattedJsonDatabase `class`
 * This is an Open Ticket Formatted JSON database.
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
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./database/",this.file)
        this.formatter = formatter
    }

    /**Init the database. */
    init(): ODPromiseVoid {
        //this.#system.getData()
        //TEMPORARY!!!
        const newData = TEMP_migrateDatabaseStructurePrefix(this.#system.getData())
        this.#system.setData(newData)
    }
    /**Set/overwrite the value of `category` & `key`. Returns `true` when overwritten!
     * @example
     * const didOverwrite = database.setData("category","key","value") //value can be any of the valid types
     * //You need an ODFormattedJsonDatabase class named "database" for this example to work!
     */
    set(category:string, key:string, value:ODValidJsonType): ODOptionalPromise<boolean> {
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
    get(category:string, key:string): ODOptionalPromise<ODValidJsonType|undefined> {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? tempresult.value : undefined
    }
    /**Remove the value of `category` & `key`. Returns `undefined` when non-existent!
     * @example
     * const didExist = database.deleteData("category","key") //delete this value
     * //You need an ODFormattedJsonDatabase class named "database" for this example to work!
     */
    delete(category:string, key:string): ODOptionalPromise<boolean> {
        const currentList = this.#system.getData()
        const currentData = currentList.find((d) => (d.category === category) && (d.key === key))
        if (currentData) currentList.splice(currentList.indexOf(currentData),1)

        this.#system.setData(currentList)
        return currentData ? true : false
    }
    /**Check if a value of `category` & `key` exists. Returns `false` when non-existent! */
    exists(category:string, key:string): ODOptionalPromise<boolean> {
        const currentList = this.#system.getData()
        const tempresult = currentList.find((d) => (d.category === category) && (d.key === key))
        return tempresult ? true : false
    }
    /**Get all values in `category`. Returns `undefined` when non-existent! */
    getCategory(category:string): ODOptionalPromise<{key:string, value:ODValidJsonType}[]|undefined> {
        const currentList = this.#system.getData()
        const tempresult = currentList.filter((d) => (d.category === category))
        return tempresult ? tempresult.map((data) => {return {key:data.key,value:data.value}}) : undefined
    }
    /**Get all values in `category`. */
    getAll(): ODOptionalPromise<ODJsonDatabaseStructure> {
        return this.#system.getData()
    }

    #system = {
        /**Read parsed data from the json file */
        getData: (): ODJsonDatabaseStructure => {
            if (fs.existsSync(this.path)){
                return JSON.parse(fs.readFileSync(this.path).toString())
            }else{
                fs.writeFileSync(this.path,"[]")
                return []
            }
        },
        /**Write parsed data to the json file */
        setData: (data:ODJsonDatabaseStructure) => {
            fs.writeFileSync(this.path,this.formatter.stringify(data))
        }
    }
}