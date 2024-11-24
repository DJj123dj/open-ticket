///////////////////////////////////////
//LANGUAGE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"

export interface ODLanguageMetadata {
    otversion:string,
    language:string,
    translators:string[],
    lastedited:string,
    automated:boolean
}

export class ODLanguage extends ODManagerData {
    /**The name of the file with `.json` extension. */
    file: string
    /**The path to the file relative to the main directory. */
    path: string
    /**The raw object data of the translation. */
    data: any
    /**The metadata of the language if available. */
    metadata: ODLanguageMetadata|null = null

    constructor(id:ODValidId, file:string, customPath?:string){
        super(id)
        this.file = (file.endsWith(".json")) ? file : file+".json"
        this.path = customPath ? nodepath.join("./",customPath,this.file) : nodepath.join("./languages/",this.file)
        
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

export class ODLanguageManager extends ODManager<ODLanguage> {
    current: ODLanguage|null = null
    backup: ODLanguage|null = null
    #debug: ODDebugger
    
    constructor(debug:ODDebugger, presets:boolean){
        super(debug,"language")
        if (presets) this.add(new ODLanguage("english","english.json"))
        this.current = presets ? new ODLanguage("english","english.json") : null
        this.backup = presets ? new ODLanguage("english","english.json") : null
        this.#debug = debug
    }

    setCurrentLanguage(id:ODValidId){
        this.current = this.get(id)
        const languageId = this.current?.id.value ?? "<unknown-id>"
        const languageAutomated = this.current?.metadata?.automated.toString() ?? "<unknown-metadata>"
        this.#debug.debug("Selected current language",[
            {key:"id",value:languageId},
            {key:"automated",value:languageAutomated},
        ])
    }
    getCurrentLanguage(){
        return (this.current) ? this.current : null
    }
    setBackupLanguage(id:ODValidId){
        this.backup = this.get(id)
        const languageId = this.backup?.id.value ?? "<unknown-id>"
        const languageAutomated = this.backup?.metadata?.automated.toString() ?? "<unknown-metadata>"
        this.#debug.debug("Selected backup language",[
            {key:"id",value:languageId},
            {key:"automated",value:languageAutomated},
        ])
    }
    getBackupLanguage(){
        return (this.backup) ? this.backup : null
    }
    getLanguageMetadata(frombackup?:boolean): ODLanguageMetadata|null {
        if (frombackup) return (this.backup) ? this.backup.metadata : null
        return (this.current) ? this.current.metadata : null
    }
    getCurrentLanguageId(){
        return (this.current) ? this.current.id.value : ""
    }
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

    getTranslationWithParams(id:string, params:string[]): string|null {
        let translation = this.getTranslation(id)
        if (!translation) return translation

        params.forEach((value,index) => {
            if (!translation) return
            translation = translation.replace(`{${index}}`,value)
        })
        return translation
    }
}