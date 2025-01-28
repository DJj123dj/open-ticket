///////////////////////////////////////
//LANGUAGE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODPromiseVoid, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"

/**## ODLanguageMetadata `interface`
 * This interface contains all metadata available in the language files.
 */
export interface ODLanguageMetadata {
    /**The version of Open Ticket this translation is made for. */
    otversion:string,
    /**The name of the language in english (with capital letter). */
    language:string,
    /**A list of translators (discord/github username) who've contributed to this language. */
    translators:string[],
    /**The last date that this translation has been modified (format: DD/MM/YYYY) */
    lastedited:string,
    /**When `true`, the translator made use of some sort of automation while creating the translation. (e.g. ChatGPT, Google Translate, DeepL, ...) */
    automated:boolean
}

/**## ODLanguageManager `class`
 * This is an Open Ticket language manager.
 * 
 * It manages all languages in the bot and manages translation for you!
 * Get a translation via the `getTranslation()` or `getTranslationWithParams()` methods.
 * 
 * Add new languages using the `ODlanguage` class in your plugin!
 */
export class ODLanguageManager extends ODManager<ODLanguage> {
    /**The currently selected language. */
    current: ODLanguage|null = null
    /**The currently selected backup language. (used when translation missing in current language) */
    backup: ODLanguage|null = null
    /**An alias to Open Ticket debugger. */
    #debug: ODDebugger
    
    constructor(debug:ODDebugger, presets:boolean){
        super(debug,"language")
        if (presets) this.add(new ODLanguage("english","english.json"))
        this.current = presets ? new ODLanguage("english","english.json") : null
        this.backup = presets ? new ODLanguage("english","english.json") : null
        this.#debug = debug
    }

    /**Set the current language by providing the ID of a language which is registered in this manager. */
    setCurrentLanguage(id:ODValidId){
        this.current = this.get(id)
        const languageId = this.current?.id.value ?? "<unknown-id>"
        const languageAutomated = this.current?.metadata?.automated.toString() ?? "<unknown-metadata>"
        this.#debug.debug("Selected current language",[
            {key:"id",value:languageId},
            {key:"automated",value:languageAutomated},
        ])
    }
    /**Get the current language (same as `this.current`) */
    getCurrentLanguage(){
        return (this.current) ? this.current : null
    }
    /**Set the backup language by providing the ID of a language which is registered in this manager. */
    setBackupLanguage(id:ODValidId){
        this.backup = this.get(id)
        const languageId = this.backup?.id.value ?? "<unknown-id>"
        const languageAutomated = this.backup?.metadata?.automated.toString() ?? "<unknown-metadata>"
        this.#debug.debug("Selected backup language",[
            {key:"id",value:languageId},
            {key:"automated",value:languageAutomated},
        ])
    }
    /**Get the backup language (same as `this.backup`) */
    getBackupLanguage(){
        return (this.backup) ? this.backup : null
    }
    /**Get the metadata of the current/backup language. */
    getLanguageMetadata(frombackup?:boolean): ODLanguageMetadata|null {
        if (frombackup) return (this.backup) ? this.backup.metadata : null
        return (this.current) ? this.current.metadata : null
    }
    /**Get the ID (string) of the current language. (Not backup language) */
    getCurrentLanguageId(){
        return (this.current) ? this.current.id.value : ""
    }
    /**Get a translation string by JSON location. (e.g. `"checker.system.typeError"`) */
    getTranslation(id:string): string|null {
        if (!this.current) return this.#getBackupTranslation(id)
        
        const splitted = id.split(".")
        let currentObject = this.current.data
        let result: string|false = false
        splitted.forEach((id) => {
            if (typeof currentObject[id] == "object"){
                currentObject = currentObject[id]
            }else if (typeof currentObject[id] == "string"){
                result = currentObject[id]
            }
        })

        if (typeof result == "string") return result
        else return this.#getBackupTranslation(id)
    }
    /**Get a backup  translation string by JSON location. (system only) */
    #getBackupTranslation(id:string): string|null {
        if (!this.backup) return null

        const splitted = id.split(".")
        let currentObject = this.backup.data
        let result: string|false = false
        splitted.forEach((id) => {
            if (typeof currentObject[id] == "object"){
                currentObject = currentObject[id]
            }else if (typeof currentObject[id] == "string"){
                result = currentObject[id]
            }
        })

        if (typeof result == "string") return result
        else return null
    }
    /**Get a backup translation string by JSON location and replace `{0}`,`{1}`,`{2}`,... with the provided parameters. */
    getTranslationWithParams(id:string, params:string[]): string|null {
        let translation = this.getTranslation(id)
        if (!translation) return translation

        params.forEach((value,index) => {
            if (!translation) return
            translation = translation.replace(`{${index}}`,value)
        })
        return translation
    }

    /**Init all language files. */
    async init(){
        for (const language of this.getAll()){
            try{
                await language.init()
            }catch(err){
                process.emit("uncaughtException",new ODSystemError(err))
            }
        }
    }
}

/**## ODLanguage `class`
 * This is an Open Ticket language file.
 * 
 * It contains metadata and all translation strings available in this language.
 * Register this class to an `ODLanguageManager` to use it!
 * 
 * JSON languages should be created using the `ODJsonLanguage` class instead!
 */
export class ODLanguage extends ODManagerData {
    /**The name of the file with extension. */
    file: string = ""
    /**The path to the file relative to the main directory. */
    path: string = ""
    /**The raw object data of the translation. */
    data: any
    /**The metadata of the language if available. */
    metadata: ODLanguageMetadata|null = null

    constructor(id:ODValidId, data:any){
        super(id)
        this.data = data
    }

    /**Init the language. */
    init(): ODPromiseVoid {
        //nothing
    }
}

/**## ODJsonLanguage `class`
 * This is an Open Ticket JSON language file.
 * 
 * It contains metadata and all translation strings from a certain JSON file (in `./languages/`).
 * Register this class to an `ODLanguageManager` to use it!
 * 
 * Use the `ODLanguage` class to use translations from non-JSON files!
 */
export class ODJsonLanguage extends ODLanguage {
    constructor(id:ODValidId, file:string, customPath?:string){
        super(id,{})
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./languages/",this.file)
    }

    /**Init the langauge. */
    init(): ODPromiseVoid {
        if (!fs.existsSync(this.path)) throw new ODSystemError("Unable to parse language \""+nodepath.join("./",this.path)+"\", the file doesn't exist!")
        try{
            this.data = JSON.parse(fs.readFileSync(this.path).toString())
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Unable to parse language \""+nodepath.join("./",this.path)+"\"!")
        }
        if (this.data["_TRANSLATION"]) this.metadata = this.data["_TRANSLATION"]
    }
}