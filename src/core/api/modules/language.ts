///////////////////////////////////////
//LANGUAGE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import nodepath from "path"
import { ODDebugger } from "./console"
import fs from "fs"

export class ODLanguage extends ODManagerData {
    file: string
    data: any
    metadata: {
        otversion:string,
        language:string,
        translator:string,
        lastedited:string
    }|null = null

    constructor(id:ODValidId, file:string, customPath?:string){
        super(id)
        try{
            const filename = (file.endsWith(".json")) ? file : file+".json"
            this.file = customPath ? nodepath.join("./",customPath,filename) : nodepath.join("./languages/",filename)
            this.data = JSON.parse(fs.readFileSync(this.file).toString())
        }catch{
            throw new ODSystemError("[API ERROR] Language \""+file+"\" doesn't exist!")
        }
        if (this.data["_TRANSLATION"]) this.metadata = this.data["_TRANSLATION"]
    }
}

export class ODLanguageManager extends ODManager<ODLanguage> {
    current: ODLanguage|null = null
    backup: ODLanguage|null = null
    
    constructor(debug:ODDebugger, presets:boolean){
        super(debug,"language")
        if (presets) this.add(new ODLanguage("english","english.json"))
        this.current = presets ? new ODLanguage("english","english.json") : null
        this.backup = presets ? new ODLanguage("english","english.json") : null
    }

    setCurrentLanguage(id:ODValidId){
        this.current = this.get(id)
    }
    getCurrentLanguage(){
        return (this.current) ? this.current : null
    }
    setBackupLanguage(id:ODValidId){
        this.backup = this.get(id)
    }
    getBackupLanguage(){
        return (this.backup) ? this.backup : null
    }
    getLanguageMetadata(frombackup?:boolean){
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