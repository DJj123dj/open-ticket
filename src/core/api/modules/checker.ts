///////////////////////////////////////
//CONFIG CHECKER MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId, ODValidJsonType } from "./base"
import { ODConfig } from "./config"
import { ODLanguageManager } from "./language"
import { ODDebugger } from "./console"

/**## ODCheckerResult `interface`
 * This interface is the result from a config checker check() function.
 */
export interface ODCheckerResult {
    valid:boolean
    messages:ODCheckerMessage[]
}

/**## ODCheckerManager `class`
 * This is an open ticket checker manager.
 * 
 * It manages all config checkers in the bot and allows plugins to access config checkers from open ticket & other plugins!
 * 
 * You will use this class to get/add a config checker (`ODChecker`) in your plugin!
 * @example
 * //get checker for ./config/general.json => ODChecker class
 * const testChecker = openticket.checkers.get("openticket:general")
 * 
 * //add a new checker with id "test" => ./config/test.json
 * const testConfig = new api.ODConfig("test","test.json")
 * const testChecker = new api.ODChecker("test",openticket.checkers.storage,0,testConfig,[])
 * openticket.checkers.add(testChecker)
 */
export class ODCheckerManager extends ODManager<ODChecker> {
    /**The global temporary storage shared between all config checkers. */
    storage: ODCheckerStorage
    /**The class responsible for rendering the config checker report. */
    renderer: ODCheckerRenderer
    /**The class responsible for translating the config checker report. */
    translation: ODCheckerTranslationRegister
    /**Final functions are global functions executed just before the report is created. */
    functions: ODCheckerFunctionManager
    /**A variable containing the last result returned from `checkAll()` */
    lastResult: ODCheckerResult|null = null

    constructor(debug:ODDebugger, storage:ODCheckerStorage, renderer:ODCheckerRenderer, translation:ODCheckerTranslationRegister, functions:ODCheckerFunctionManager){
        super(debug,"config checker")
        this.storage = storage
        this.renderer = renderer
        this.translation = translation
        this.functions = functions
    }
    /**Check all config checkers registered in this manager.*/
    checkAll(sort:boolean): ODCheckerResult {
        this.storage.reset()

        let isValid = true
        const final: ODCheckerMessage[] = []
        
        const checkers = this.getAll()
        checkers.sort((a,b) => b.priority-a.priority)

        checkers.forEach((checker) => {
            const res = checker.check()
            final.push(...res.messages)

            if (!res.valid) isValid = false
        })

        this.functions.getAll().forEach((func) => {
            const res = func.func(this,this.functions)
            final.push(...res.messages)

            if (!res.valid) isValid = false
        })

        //sort messages => (info, warning, error)
        if (sort) final.sort((a,b) => {
            const typeA = (a.type == "error") ? 2 : (a.type == "warning") ? 1 : 0
            const typeB = (b.type == "error") ? 2 : (b.type == "warning") ? 1 : 0

            return typeA-typeB
        })

        this.lastResult = {
            valid:isValid,
            messages:final
        }

        return {
            valid:isValid,
            messages:final
        }
    }
}

/**## ODCheckerStorage `class`
 * This is an open ticket checker storage. 
 * 
 * It stores temporary data to share between config checkers!
 * (e.g. The `messages.json` needs to access the `"id"` from `options.json`)
 * 
 * 
 * You will probably use this class when you create your own config checker!
 */
export class ODCheckerStorage {
    /**This is the array that stores all the data. ❌ **(don't edit unless really needed!)***/
    storage: {source:ODId, key:string, value:any}[] = []

    /**Get data from the database (`source` => id of `ODChecker`) */
    get(source:ODValidId, key:string): any|null {
        const result = this.storage.find(d => (d.source.value == new ODId(source).value) && (d.key == key))
        return (result) ? result.value : null
    }
    /**Add data to the database (`source` => id of `ODChecker`). This function also overwrites existing data!*/
    set(source:ODValidId, key:string, value:any){
        const index = this.storage.findIndex(d => (d.source.value == new ODId(source).value) && (d.key == key))
        if (index > -1){
            //overwrite
            this.storage[index] = {
                source:new ODId(source),
                key,value
            }
            return true
        }else{
            this.storage.push({
                source:new ODId(source),
                key,value
            })
            return false
        }
    }
    /**Delete data from the database (`source` => id of `ODChecker`) */
    delete(source:ODValidId, key:string){
        const index = this.storage.findIndex(d => (d.source.value == new ODId(source).value) && (d.key == key))
        if (index > -1){
            //delete
            this.storage.splice(index,1)
            return true
        }else return false
    }
    
    /**Reset the entire database */
    reset(){
        this.storage = []
    }
}

/**## ODCheckerRenderer `class`
 * This is an open ticket checker renderer. 
 * 
 * It's responsible for rendering the config checker result in the console.
 * This class doesn't provide any components! You need to create them by extending this class
 * 
 * You will only use this class if you want to change how the config checker looks!
 */
export class ODCheckerRenderer {
    /**Get all components */
    getComponents(compact:boolean, renderEmpty:boolean, translation:ODCheckerTranslationRegister, data:ODCheckerResult): string[] {
        return []
    }
    /**Render all components */
    render(components:string[]){
        if (components.length < 1) return
        console.log("\n")
        components.forEach((c) => {
            console.log(c)
        })
        console.log("\n")
    }
}

/**## ODCheckerTranslationRegister `class`
 * This is an open ticket checker translation register. 
 * 
 * It's used to store & manage the translation for each message from the config checker!
 * Most translations are stored by message id, but there are some exceptions like the additional text on the checker report.
 * 
 * You will use this class if you want to translate your config checker messages! **This is optional & isn't required for the checker to work!**
 */
export class ODCheckerTranslationRegister {
    /**This is the array that stores all the data. ❌ **(don't edit unless really needed!)***/
    #translations: {type:"message"|"other", id:string, translation:string}[] = []

    /**Get the translation from a config checker message/sentence */
    get(type:"message"|"other", id:string): string|null {
        const result = this.#translations.find(d => (d.id == id) && (d.type == type))
        return (result) ? result.translation : null
    }
    /**Set the translation for a config checker message/sentence. This function also overwrites existing translations!*/
    set(type:"message"|"other", id:string, translation:string){
        const index = this.#translations.findIndex(d => (d.id == id) && (d.type == type))
        if (index > -1){
            //overwrite
            this.#translations[index] = {type,id,translation}
            return true
        }else{
            this.#translations.push({type,id,translation})
            return false
        }
    }
    /**Delete the translation for a config checker message/sentence. */
    delete(type:"message"|"other", id:string){
        const index = this.#translations.findIndex(d => (d.id == id) && (d.type == type))
        if (index > -1){
            //delete
            this.#translations.splice(index,1)
            return true
        }else return false
    }

    /**Get all translations */
    getAll(){
        return this.#translations
    }

    /**Insert the translation params into the text. */
    insertTranslationParams(text:string, translationParams:string[]){
        translationParams.forEach((value,index) => {
            text = text.replace(`{${index}}`,value)
        })
        return text
    }
    /**A shortcut to copy translations from the `ODLanguageManager` to `ODCheckerTranslationRegister` */
    quickTranslate(manager:ODLanguageManager, translationId:string, type:"other"|"message", id:string){
        const translation = manager.getTranslation(translationId)
        if (translation) this.set(type,id,translation)
    }
}

/**## ODCheckerFunction `class`
 * This is an open ticket config checker function.
 * 
 * It is a global function that will be executed after all config checkers. It can do additional checks for invalid/missing configurations.
 * It's mostly used for things that need to be checked globally!
 */
export class ODCheckerFunction extends ODManagerData {
    /**The function itself :) */
    func: (manager:ODCheckerManager, functions:ODCheckerFunctionManager) => ODCheckerResult

    constructor(id:ODValidId, func:(manager:ODCheckerManager, functions:ODCheckerFunctionManager) => ODCheckerResult){
        super(id)
        this.func = func
    }
}

/**## ODCheckerFunctionManager `class`
 * This is an open ticket config checker function manager.
 * 
 * It manages all `ODCheckerFunction`'s and it has some extra shortcuts for frequently used methods.
 */
export class ODCheckerFunctionManager extends ODManager<ODCheckerFunction> {
    constructor(debug:ODDebugger){
        super(debug,"config checker function")
    }

    /**A shortcut to create a warning, info or error message */
    createMessage(checkerId:ODValidId, id:ODValidId, filepath:string, type:"info"|"warning"|"error", message:string, locationTrace:ODCheckerLocationTrace, docs:string|null, translationParams:string[], locationId:ODId, locationDocs:string|null): ODCheckerMessage {
        return {
            checkerId:new ODId(checkerId),
            messageId:new ODId(id),
            locationId,

            type,message,
            path:this.locationTraceToString(locationTrace),
            filepath,
            translationParams,
            
            messageDocs:docs,
            locationDocs
        }
    }
    /**Create a string from the location trace (path)*/
    locationTraceToString(trace:ODCheckerLocationTrace){
        const final: ODCheckerLocationTrace = []
        trace.forEach((t) => {
            if (typeof t == "number"){
                final.push(`:${t}`)
            }else{
                final.push(`."${t}"`)
            }
        })
        return final.join("").substring(1)
    }
    /**De-reference the locationTrace array. Use this before adding a value to the array*/
    locationTraceDeref(trace:ODCheckerLocationTrace): ODCheckerLocationTrace {
        return JSON.parse(JSON.stringify(trace))
    }
}

/**## ODCheckerLocationTrace `type`
 * This type is an array of strings & numbers which represents the location trace from the config checker.
 * It's used to generate a path to the error (e.g. `"abc"."efg".1."something"`)
 */
export type ODCheckerLocationTrace = (string|number)[]

/**## ODChecker `class`
 * This is an open ticket config checker.
 * 
 * It checks a specific config file for invalid/missing configurations. This data can then be used to show to the user what's wrong!
 * You can check for example if a string is longer/shorter than a certain amount of characters & more!
 * 
 * You will use this class when you create your own custom config file & you want to check it for syntax errors.
 * @example
 * //create a new checker with id "test" => ./config/test.json
 * const testConfig = new api.ODConfig("test","test.json")
 * const testChecker = new api.ODChecker("test",openticket.checkers.storage,0,testConfig,new api.ODCheckerStructure())
 * openticket.checkers.add(testChecker)
 * 
 * //you will still need to build the structure & insert it in the constructor
 */
export class ODChecker extends ODManagerData {
    /**The storage of this checker (reference for `ODCheckerManager.storage`) */
    storage: ODCheckerStorage
    /**The higher the priority, the faster it gets checked! */
    priority: number
    /**The config file that needs to be checked */
    config: ODConfig
    /**The structure of the config file */
    structure: ODCheckerStructure
    /**Temporary storage for all error messages from the check() method (not recommended to use) */
    messages: ODCheckerMessage[] = []
    /**Temporary storage for the quit status from the check() method (not recommended to use) */
    quit: boolean = false

    constructor(id:ODValidId, storage: ODCheckerStorage, priority:number, config:ODConfig, structure: ODCheckerStructure){
        super(id)
        this.storage = storage
        this.priority = priority
        this.config = config
        this.structure = structure
    }

    /**Run this checker. Returns all errors*/
    check(): ODCheckerResult {
        this.messages = []
        this.quit = false

        this.structure.check(this,this.config.data,[])
        return {
            valid:!this.quit,
            messages:this.messages
        }
    }
    /**Create a string from the location trace (path)*/
    locationTraceToString(trace:ODCheckerLocationTrace){
        const final: ODCheckerLocationTrace = []
        trace.forEach((t) => {
            if (typeof t == "number"){
                final.push(`:${t}`)
            }else{
                final.push(`."${t}"`)
            }
        })
        return final.join("").substring(1)
    }
    /**De-reference the locationTrace array. Use this before adding a value to the array*/
    locationTraceDeref(trace:ODCheckerLocationTrace): ODCheckerLocationTrace {
        return JSON.parse(JSON.stringify(trace))
    }

    /**A shortcut to create a warning, info or error message */
    createMessage(id:ODValidId, type:"info"|"warning"|"error", message:string, locationTrace:ODCheckerLocationTrace, docs:string|null, translationParams:string[], locationId:ODId, locationDocs:string|null){
        if (type == "error") this.quit = true
        this.messages.push({
            checkerId:this.id,
            messageId:new ODId(id),
            locationId,

            type,message,
            path:this.locationTraceToString(locationTrace),
            filepath:this.config.path,
            translationParams,
            
            messageDocs:docs,
            locationDocs
        })
    }
}

/**## ODCheckerMessage `interface`
 * This interface is an object which has all variables required for a config checker message!
 */
export interface ODCheckerMessage {
    checkerId:ODId,
    messageId:ODId,
    locationId:ODId,

    type:"info"|"warning"|"error",
    message:string,
    path:string,
    filepath:string,
    translationParams:string[],

    messageDocs:string|null,
    locationDocs:string|null
}

/**## ODCheckerStructureOptions `interface`
 * This interface has the basic options for the `ODCheckerStructure`!
 */
export interface ODCheckerStructureOptions {
    /**Add a custom checker function */
    custom?:(checker:ODChecker, value:ODValidJsonType, locationTrace:ODCheckerLocationTrace, locationId:ODId, locationDocs:string|null) => boolean,
    /**Set the url to the documentation of this variable. */
    docs?:string
}

/**## ODCheckerStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for a single variable in a config file, customise it in the settings!
 * If you want prebuilt checkers (for strings, booleans, numbers, ...), check the other `ODCheckerStructure`'s!
 * 
 * You will almost never use this class! It's better if you extend on another `ODConfigCheckerStructure`!
 */
export class ODCheckerStructure {
    /**The id of this checker structure */
    id: ODId
    /**The options for this checker structure */
    options: ODCheckerStructureOptions

    constructor(id:ODValidId, options:ODCheckerStructureOptions){
        this.id = new ODId(id)
        this.options = options
    }

    /**Check a variable if it matches all settings in this checker. This function is automatically executed by open ticket! */
    check(checker:ODChecker, value:ODValidJsonType, locationTrace:ODCheckerLocationTrace): boolean {
        if (typeof this.options.custom != "undefined"){
            return this.options.custom(checker,value,locationTrace,this.id,(this.options.docs ?? null))
        }else return true
    }
}

/**## ODCheckerObjectStructureOptions `interface`
 * This interface has the options for `ODCheckerObjectStructure`!
 */
export interface ODCheckerObjectStructureOptions extends ODCheckerStructureOptions {
    /**Add a checker for a property in an object (can also be optional) */
    children?:{key:string, checker:ODCheckerStructure, priority:number, optional:boolean}[]
}

/**## ODCheckerObjectStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for an object variable in a config file, customise it in the settings!
 * A checker for the children can be set in the settings.
 */
export class ODCheckerObjectStructure extends ODCheckerStructure {
    declare options: ODCheckerObjectStructureOptions

    constructor(id:ODValidId, options:ODCheckerObjectStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:object, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)

        //check type & options
        if (typeof value != "object"){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: object!",lt,null,["object"],this.id,(this.options.docs ?? null))
            return false
        }
        
        //sort children
        if (typeof this.options.children == "undefined") return super.check(checker,value,locationTrace)
        const sortedChildren = this.options.children.sort((a,b) => {
            if (a.priority < b.priority) return -1
            else if (a.priority > b.priority) return 1
            else return 0
        })

        //check children
        let localQuit = false
        sortedChildren.forEach((child) => {
            const localLt = checker.locationTraceDeref(lt)
            localLt.push(child.key)

            if (typeof value[child.key] == "undefined"){
                if (!child.optional){
                    localQuit = true
                    checker.createMessage("openticket:property-missing","error",`The property "${child.key}" is mising from this object!`,lt,null,[`"${child.key}"`],this.id,(this.options.docs ?? null))
                }else{
                    checker.createMessage("openticket:property-optional","info",`The property "${child.key}" is optional in this object!`,lt,null,[`"${child.key}"`],this.id,(this.options.docs ?? null))
                }
            }else if (!child.checker.check(checker,value[child.key],localLt)) localQuit = true
        })

        //do local quit or check custom function
        if (localQuit) return false
        else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerStringStructureOptions `interface`
 * This interface has the options for `ODCheckerStringStructure`!
 */
export interface ODCheckerStringStructureOptions extends ODCheckerStructureOptions {
    /**The minimum length of this string */
    minLength?:number,
    /**The maximum length of this string */
    maxLength?:number,
    /**Set the required length of this string */
    length?:number,
    /**This string needs to start with ... */
    startsWith?:string,
    /**This string needs to end with ... */
    endsWith?:string,
    /**This string needs to contain ... */
    contains?:string,
    /**You need to choose between ... */
    choices?:string[],
    /**The string needs to match this regex */
    regex?:RegExp
}

/**## ODCheckerStringStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for a string variable in a config file, customise it in the settings!
 */
export class ODCheckerStringStructure extends ODCheckerStructure {
    declare options: ODCheckerStringStructureOptions

    constructor(id:ODValidId, options:ODCheckerStringStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:string, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)

        //check type & options
        if (typeof value != "string"){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: string!",lt,null,["string"],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.minLength != "undefined" && value.length < this.options.minLength){
            checker.createMessage("openticket:string-too-short","error",`This string can't be shorter than ${this.options.minLength} characters!`,lt,null,[this.options.minLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.maxLength != "undefined" && value.length > this.options.maxLength){
            checker.createMessage("openticket:string-too-long","error",`This string can't be longer than ${this.options.maxLength} characters!`,lt,null,[this.options.maxLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.length != "undefined" && value.length !== this.options.length){
            checker.createMessage("openticket:string-length-invalid","error",`This string needs to be ${this.options.length} characters long!`,lt,null,[this.options.length.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.startsWith != "undefined" && !value.startsWith(this.options.startsWith)){
            checker.createMessage("openticket:string-starts-with","error",`This string needs to start with "${this.options.startsWith}"!`,lt,null,[`"${this.options.startsWith}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.endsWith != "undefined" && !value.endsWith(this.options.endsWith)){
            checker.createMessage("openticket:string-ends-with","error",`This string needs to end with "${this.options.endsWith}"!`,lt,null,[`"${this.options.endsWith}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.contains != "undefined" && !value.includes(this.options.contains)){
            checker.createMessage("openticket:string-contains","error",`This string needs to contain "${this.options.contains}"!`,lt,null,[`"${this.options.contains}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.choices != "undefined" && !this.options.choices.includes(value)){
            checker.createMessage("openticket:string-choices","error",`This string can only be one of the following values: "${this.options.choices.join(`", "`)}"!`,lt,null,[`"${this.options.choices.join(`", "`)}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.regex != "undefined" && !this.options.regex.test(value)){
            checker.createMessage("openticket:string-regex","error","This string is invalid!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerNumberStructureOptions `interface`
 * This interface has the options for `ODCheckerNumberStructure`!
 */
export interface ODCheckerNumberStructureOptions extends ODCheckerStructureOptions {
    /**The minimum length of this number */
    minLength?:number,
    /**The maximum length of this number */
    maxLength?:number,
    /**Set the required length of this number */
    length?:number,
    /**The minimum value of this number */
    min?:number,
    /**The maximum value of this number */
    max?:number,
    /**This number is required to match the value */
    is?:number,
    /**Only allow a multiple of ... starting at `this.offset` or 0 */
    step?:number,
    /**The offset for the step function. */
    offset?:number,
    /**This number needs to start with ... */
    startsWith?:string,
    /**This number needs to end with ... */
    endsWith?:string,
    /**This number needs to contain ... */
    contains?:string,
    /**You need to choose between ... */
    choices?:number[],
    /**Are numbers with a decimal value allowed? */
    floatAllowed?:boolean,
    /**Are negative numbers allowed (without zero) */
    negativeAllowed?:boolean,
    /**Are positive numers allowed (without zero) */
    positiveAllowed?:boolean,
    /**Is zero allowed? */
    zeroAllowed?:boolean
}

/**## ODCheckerNumberStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for a number variable in a config file, customise it in the settings!
 */
export class ODCheckerNumberStructure extends ODCheckerStructure {
    declare options: ODCheckerNumberStructureOptions

    constructor(id:ODValidId, options:ODCheckerNumberStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:number, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)

        //offset for step
        const stepOffset = (typeof this.options.offset != "undefined") ? this.options.offset : 0

        //check type & options
        if (typeof value != "number"){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: number!",lt,null,["number"],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.minLength != "undefined" && value.toString().length < this.options.minLength){
            checker.createMessage("openticket:number-too-short","error",`This number can't be shorter than ${this.options.minLength} characters!`,lt,null,[this.options.minLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.maxLength != "undefined" && value.toString().length > this.options.maxLength){
            checker.createMessage("openticket:number-too-long","error",`This number can't be longer than ${this.options.maxLength} characters!`,lt,null,[this.options.maxLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.length != "undefined" && value.toString().length !== this.options.length){
            checker.createMessage("openticket:number-length-invalid","error",`This number needs to be ${this.options.length} characters long!`,lt,null,[this.options.length.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.min != "undefined" && value < this.options.min){
            checker.createMessage("openticket:number-too-small","error",`This number needs to be at least ${this.options.min}!`,lt,null,[this.options.min.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.max != "undefined" && value > this.options.max){
            checker.createMessage("openticket:number-too-large","error",`This number needs to be at most ${this.options.max}!`,lt,null,[this.options.max.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.is != "undefined" && value == this.options.is){
            checker.createMessage("openticket:number-not-equal","error",`This number needs to be ${this.options.is}!`,lt,null,[this.options.is.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.step != "undefined" && ((value - stepOffset) % this.options.step) !== 0){
            if (stepOffset > 0) checker.createMessage("openticket:number-step-offset","error",`This number needs to be a multiple of ${this.options.step} starting with ${stepOffset}!`,lt,null,[this.options.step.toString(),stepOffset.toString()],this.id,(this.options.docs ?? null))
            else checker.createMessage("openticket:number-step","error",`This number needs to be a multiple of ${this.options.step}!`,lt,null,[this.options.step.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.startsWith != "undefined" && !value.toString().startsWith(this.options.startsWith)){
            checker.createMessage("openticket:number-starts-with","error",`This number needs to start with "${this.options.startsWith}"!`,lt,null,[`"${this.options.startsWith}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.endsWith != "undefined" && !value.toString().endsWith(this.options.endsWith)){
            checker.createMessage("openticket:number-ends-with","error",`This number needs to end with "${this.options.endsWith}"!`,lt,null,[`"${this.options.endsWith}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.contains != "undefined" && !value.toString().includes(this.options.contains)){
            checker.createMessage("openticket:number-contains","error",`This number needs to contain "${this.options.contains}"!`,lt,null,[`"${this.options.contains}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.choices != "undefined" && !this.options.choices.includes(value)){
            checker.createMessage("openticket:number-choices","error",`This number can only be one of the following values: "${this.options.choices.join(`", "`)}"!`,lt,null,[`"${this.options.choices.join(`", "`)}"`],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.floatAllowed != "undefined" && !this.options.floatAllowed && (value % 1) !== 0){
            checker.createMessage("openticket:number-float","error","This number can't be a decimal!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.negativeAllowed != "undefined" && value < 0){
            checker.createMessage("openticket:number-negative","error","This number can't be negative!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.positiveAllowed != "undefined" && value > 0){
            checker.createMessage("openticket:number-positive","error","This number can't be positive!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.zeroAllowed != "undefined" && value === 0){
            checker.createMessage("openticket:number-zero","error","This number can't be zero!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerBooleanStructureOptions `interface`
 * This interface has the options for `ODCheckerBooleanStructure`!
 */
export interface ODCheckerBooleanStructureOptions extends ODCheckerStructureOptions {
    /**Is `true` allowed? */
    trueAllowed?:boolean,
    /**Is `false` allowed? */
    falseAllowed?:boolean
}

/**## ODCheckerBooleanStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for a boolean variable in a config file, customise it in the settings!
 */
export class ODCheckerBooleanStructure extends ODCheckerStructure {
    declare options: ODCheckerBooleanStructureOptions

    constructor(id:ODValidId, options:ODCheckerBooleanStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:boolean, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)

        //check type & options
        if (typeof value != "boolean"){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: boolean!",lt,null,["boolean"],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.trueAllowed != "undefined" && !this.options.trueAllowed && value == true){
            checker.createMessage("openticket:boolean-true","error","This boolean can't be true!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.falseAllowed != "undefined" && !this.options.falseAllowed && value == false){
            checker.createMessage("openticket:boolean-false","error","This boolean can't be false!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerArrayStructureOptions `interface`
 * This interface has the options for `ODCheckerArrayStructure`!
 */
export interface ODCheckerArrayStructureOptions extends ODCheckerStructureOptions {
    /**The checker for all the properties in this array */
    propertyChecker?:ODCheckerStructure,
    /**Don't allow this array to be empty */
    disableEmpty?:boolean,
    /**This array is required to be empty */
    emptyRequired?:boolean,
    /**The minimum length of this array */
    minLength?:number,
    /**The maximum length of this array */
    maxLength?:number,
    /**The length of the array needs to be the same as this value */
    length?:number,
    /**Allow double values (only for `string`, `number` & `boolean`) */
    allowDoubles?:boolean
    /**Only allow these types in the array (for multi-type propertyCheckers) */
    allowedTypes?:("string"|"number"|"boolean"|"null"|"array"|"object"|"other")[]
}

/**## ODCheckerArrayStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for an array variable in a config file, customise it in the settings!
 */
export class ODCheckerArrayStructure extends ODCheckerStructure {
    declare options: ODCheckerArrayStructureOptions

    constructor(id:ODValidId, options:ODCheckerArrayStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:Array<any>, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)
        
        if (!Array.isArray(value)){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: array!",lt,null,["array"],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.disableEmpty != "undefined" && this.options.disableEmpty && value.length == 0){
            checker.createMessage("openticket:array-empty-disabled","error","This array isn't allowed to be empty!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.emptyRequired != "undefined" && this.options.emptyRequired && value.length != 0){
            checker.createMessage("openticket:array-empty-required","error","This array is required to be empty!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.minLength != "undefined" && value.length < this.options.minLength){
            checker.createMessage("openticket:array-too-short","error",`This array needs to have a length of at least ${this.options.minLength}!`,lt,null,[this.options.minLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.maxLength != "undefined" && value.length > this.options.maxLength){
            checker.createMessage("openticket:array-too-long","error",`This array needs to have a length of at most ${this.options.maxLength}!`,lt,null,[this.options.maxLength.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.length != "undefined" && value.length == this.options.length){
            checker.createMessage("openticket:array-length-invalid","error",`This array needs to have a length of ${this.options.length}!`,lt,null,[this.options.length.toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.allowedTypes != "undefined" && !this.#arrayAllowedTypesCheck(value,this.options.allowedTypes)){
            checker.createMessage("openticket:array-invalid-types","error",`This array can only contain the following types: ${this.options.allowedTypes.join(", ")}!`,lt,null,[this.options.allowedTypes.join(", ").toString()],this.id,(this.options.docs ?? null))
            return false
        }else if (typeof this.options.allowDoubles != "undefined" && !this.options.allowDoubles && this.#arrayHasDoubles(value)){
            checker.createMessage("openticket:array-double","error","This array doesn't allow the same value twice!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else{
            //check all properties
            let localQuit = false
            if (this.options.propertyChecker) value.forEach((property,index) => {
                if (!this.options.propertyChecker) return
                
                const localLt = checker.locationTraceDeref(lt)
                localLt.push(index)

                if (!this.options.propertyChecker.check(checker,property,localLt)) localQuit = true
            })

            //return false if invalid properties
            if (localQuit){
                checker.quit = true
                return false
            }else return super.check(checker,value,locationTrace)
        }
    }

    /**Check this array for the allowed types */
    #arrayAllowedTypesCheck(array:any[],allowedTypes:("string"|"number"|"boolean"|"null"|"array"|"object"|"other")[]): boolean {
        //return TRUE if ALL values are valid
        return !array.some((value) => {
            if (allowedTypes.includes("string") && typeof value == "string"){
                return false //this value is valid
            }else if (allowedTypes.includes("number") && typeof value == "number"){
                return false //this value is valid
            }else if (allowedTypes.includes("boolean") && typeof value == "boolean"){
                return false //this value is valid
            }else if (allowedTypes.includes("object") && typeof value == "object"){
                return false //this value is valid
            }else if (allowedTypes.includes("array") && Array.isArray(value)){
                return false //this value is valid
            }else if (allowedTypes.includes("null") && value === null){
                return false //this value is valid
            }else if (allowedTypes.includes("other")){
                return false //this value is valid
            }else{
                return true //this value is invalid
            }
        })
    }
    /**Check this array for doubles */
    #arrayHasDoubles(array:any[]): boolean {
        const alreadyFound: string[] = []
        let hasDoubles = false
        array.forEach((value) => {
            if (alreadyFound.includes(value)) hasDoubles = true
            else alreadyFound.push(value)
        })

        return hasDoubles
    }
}

/**## ODCheckerNullStructureOptions `interface`
 * This interface has the options for `ODCheckerNullStructure`!
 */
export interface ODCheckerNullStructureOptions extends ODCheckerStructureOptions {
    /**Is the value allowed to be null */
    nullAllowed?:boolean
}

/**## ODCheckerNullStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will check for a null variable in a config file, customise it in the settings!
 */
export class ODCheckerNullStructure extends ODCheckerStructure {
    declare options: ODCheckerNullStructureOptions

    constructor(id:ODValidId, options:ODCheckerNullStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:null, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)

        //check type & options
        if (typeof this.options.nullAllowed != "undefined" && !this.options.nullAllowed && value == null){
            checker.createMessage("openticket:null-invalid","error","This property can't be null!",lt,null,[],this.id,(this.options.docs ?? null))
            return false
        }else if (value !== null){
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: null!",lt,null,["null"],this.id,(this.options.docs ?? null))
            return false
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerTypeSwitchStructureOptions `interface`
 * This interface has the options for `ODCheckerTypeSwitchStructure`!
 */
export interface ODCheckerTypeSwitchStructureOptions extends ODCheckerStructureOptions {
    /**A checker that will always run (replaces all other checkers) */
    all?:ODCheckerStructure,
    /**A checker when the property is a string */
    string?:ODCheckerStringStructure,
    /**A checker when the property is a number */
    number?:ODCheckerNumberStructure,
    /**A checker when the property is a boolean */
    boolean?:ODCheckerBooleanStructure,
    /**A checker when the property is null */
    null?:ODCheckerStructure,
    /**A checker when the property is an array */
    array?:ODCheckerStructure,
    /**A checker when the property is an object */
    object?:ODCheckerObjectStructure,
    /**A checker when the property is something else */
    other?:ODCheckerStructure,
    /**A list of allowed types */
    allowedTypes?:("string"|"number"|"boolean"|"null"|"array"|"object"|"other")[]
}

/**## ODCheckerTypeSwitchStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will switch checkers based on the type of the variable in a config file, customise it in the settings!
 */
export class ODCheckerTypeSwitchStructure extends ODCheckerStructure {
    declare options: ODCheckerTypeSwitchStructureOptions

    constructor(id:ODValidId, options:ODCheckerTypeSwitchStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:any, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)
        
        if (this.options.all){
            return this.options.all.check(checker,value,lt)

        }else if (this.options.string && typeof value == "string"){
            return this.options.string.check(checker,value,lt)

        }else if (this.options.number && typeof value == "number"){
            return this.options.number.check(checker,value,lt)

        }else if (this.options.boolean && typeof value == "boolean"){
            return this.options.boolean.check(checker,value,lt)

        }else if (this.options.array && Array.isArray(value)){
            return this.options.array.check(checker,value,lt)
            
        }else if (this.options.null && value === null){
            return this.options.null.check(checker,value,lt)
            
        }else if (this.options.object && typeof value == "object"){
            return this.options.object.check(checker,value,lt)

        }else if (this.options.other){
            return this.options.other.check(checker,value,lt)

        }else if (this.options.allowedTypes && this.options.allowedTypes.length > 0){
            checker.createMessage("openticket:switch-invalid-type","error",`This needs to be one of the following types: ${this.options.allowedTypes.join(", ")}!`,lt,null,[this.options.allowedTypes.join(", ")],this.id,(this.options.docs ?? null))
            return false
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerObjectSwitchStructureOptions `interface`
 * This interface has the options for `ODCheckerObjectSwitchStructure`!
 */
export interface ODCheckerObjectSwitchStructureOptions extends ODCheckerStructureOptions {
    /**An array of object checkers with their name, properties & priority. */
    objects?:{
        /**The properties to match for this checker to be used. */
        properties:{key:string, value:any}[],
        /**The name for this object type (used in rendering) */
        name:string,
        /**The higher the priority, the earlier this checker will be tested. */
        priority:number,
        /**The object checker used once the properties have been matched. */
        checker:ODCheckerObjectStructure
    }[]
}

/**## ODCheckerObjectSwitchStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will switch object checkers based on a variable match in one of the objects, customise it in the settings!
 */
export class ODCheckerObjectSwitchStructure extends ODCheckerStructure {
    declare options: ODCheckerObjectSwitchStructureOptions

    constructor(id:ODValidId, options:ODCheckerObjectSwitchStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:object, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)
        
        if (this.options.objects){
            //check type & options
            if (typeof value != "object"){
                checker.createMessage("openticket:invalid-type","error","This property needs to be the type: object!",lt,null,["object"],this.id,(this.options.docs ?? null))
                return false
            }
            
            //sort objects
            const sortedObjects = this.options.objects.sort((a,b) => {
                if (a.priority < b.priority) return -1
                else if (a.priority > b.priority) return 1
                else return 0
            })


            //check objects
            let localQuit = false
            let didSelectObject = false
            sortedObjects.forEach((obj) => {
                if (!obj.properties.some((p) => value[p.key] !== p.value)){
                    didSelectObject = true
                    if (!obj.checker.check(checker,value,lt)) localQuit = true
                }
            })

            //do local quit or check custom function
            if (!didSelectObject){
                checker.createMessage("openticket:object-switch-invalid-type","error",`This object needs to be one of the following types: ${this.options.objects.map((obj) => obj.name).join(", ")}!`,lt,null,[this.options.objects.map((obj) => obj.name).join(", ")],this.id,(this.options.docs ?? null))
                return false
            }else if (localQuit){
                return false
            }else return super.check(checker,value,locationTrace)
        }else return super.check(checker,value,locationTrace)
    }
}

/**## ODCheckerEnabledObjectStructureOptions `interface`
 * This interface has the options for `ODCheckerEnabledObjectStructure`!
 */
export interface ODCheckerEnabledObjectStructureOptions extends ODCheckerStructureOptions {
    /**The name of the property to match the `enabledValue`. */
    property?:string,
    /**The value of the property to be enabled. Defaults to `true` */
    enabledValue?:any,
    /**The object checker to use once the property has been matched. */
    checker?:ODCheckerObjectStructure
}

/**## ODCheckerEnabledObjectStructure `class`
 * This is an open ticket config checker structure.
 * 
 * This class will enable an object checker based on a variable match in the object, customise it in the settings!
 */
export class ODCheckerEnabledObjectStructure extends ODCheckerStructure {
    declare options: ODCheckerEnabledObjectStructureOptions

    constructor(id:ODValidId, options:ODCheckerEnabledObjectStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:object, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)
        
        if (typeof value != "object"){
            //value isn't an object
            checker.createMessage("openticket:invalid-type","error","This property needs to be the type: object!",lt,null,["object"],this.id,(this.options.docs ?? null))
            return false

        }else if (this.options.property && typeof value[this.options.property] == "undefined"){
            //property doesn't exist
            checker.createMessage("openticket:property-missing","error",`The property "${this.options.property}" is mising from this object!`,lt,null,[`"${this.options.property}"`],this.id,(this.options.docs ?? null))
            return false

        }else if (this.options.property && value[this.options.property] === (typeof this.options.enabledValue == "undefined" ? true : this.options.enabledValue)){
            //this object is enabled
            if (this.options.checker) return this.options.checker.check(checker,value,lt)
            else return super.check(checker,value,locationTrace)

        }else{
            //this object is disabled
            if (this.options.property) checker.createMessage("openticket:object-disabled","info",`This object is disabled, enable it using "${this.options.property}"!`,lt,null,[`"${this.options.property}"`],this.id,(this.options.docs ?? null))
            return super.check(checker,value,locationTrace)
        }
    }
}

/**## ODCheckerCustomStructure_DiscordId `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for discord ids (channel, user, role, ...)**
 */
export class ODCheckerCustomStructure_DiscordId extends ODCheckerStringStructure {
    /**The type of id (used in rendering) */
    readonly type: "role"|"server"|"channel"|"category"|"user"|"member"|"interaction"|"message"
    /**Is this id allowed to be empty */
    readonly emptyAllowed: boolean
    /**Extra matches (value will also be valid when one of these options match) */
    readonly extraOptions: string[]

    constructor(id:ODValidId, type:"role"|"server"|"channel"|"category"|"user"|"member"|"interaction"|"message", emptyAllowed:boolean, extraOptions:string[], options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            else if ((!emptyAllowed && value.length < 15) || value.length > 50 || !/^[0-9]*$/.test(value)){
                if (!(extraOptions.length > 0 && extraOptions.some((opt) => opt == value))){
                    //value is not an id & not one of the extra options
                    if (extraOptions.length > 0) checker.createMessage("openticket:discord-invalid-id-options","error",`This is an invalid discord ${type} id! You can also use one of these: ${extraOptions.join(", ")}!`,lt,null,[type,extraOptions.join(", ")],this.id,(this.options.docs ?? null))
                    else checker.createMessage("openticket:discord-invalid-id","error",`This is an invalid discord ${type} id!`,lt,null,[type],this.id,(this.options.docs ?? null))
                return false
                }else return true
            }
            return true
        }
        super(id,newOptions)
        this.type = type
        this.emptyAllowed = emptyAllowed
        this.extraOptions = extraOptions
    }
}

/**## ODCheckerCustomStructure_DiscordIdArray `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for discord id arrays (channel, user, role, ...)**
 */
export class ODCheckerCustomStructure_DiscordIdArray extends ODCheckerArrayStructure {
    /**The type of id (used in rendering) */
    readonly type: "role"|"server"|"channel"|"category"|"user"|"member"|"interaction"|"message"
    /**Extra matches (value will also be valid when one of these options match) */
    readonly extraOptions: string[]
    
    constructor(id:ODValidId, type:"role"|"server"|"channel"|"category"|"user"|"member"|"interaction"|"message", extraOptions:string[], options?:ODCheckerArrayStructureOptions, idOptions?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.propertyChecker = new ODCheckerCustomStructure_DiscordId(id,type,false,extraOptions,idOptions)
        super(id,newOptions)
        this.type = type
        this.extraOptions = extraOptions
    }
}

/**## ODCheckerCustomStructure_DiscordToken `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for a discord (auth) token**
 */
export class ODCheckerCustomStructure_DiscordToken extends ODCheckerStringStructure {
    constructor(id:ODValidId, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string" || !/^[A-Za-z0-9-_\.]+$/.test(value)){
                checker.createMessage("openticket:discord-invalid-token","error","This is an invalid discord token (syntactically)!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }
            return true
        }
        super(id,newOptions)
    }
}

/**## ODCheckerCustomStructure_DiscordToken `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for a hex color**
 */
export class ODCheckerCustomStructure_HexColor extends ODCheckerStringStructure {
    /**When enabled, you are also allowed to use `#fff` instead of `#ffffff` */
    readonly allowShortForm: boolean
    /**Allow this hex color to be empty. */
    readonly emptyAllowed: boolean

    constructor(id:ODValidId, allowShortForm:boolean, emptyAllowed:boolean, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            else if (emptyAllowed && value.length == 0){
                return true
            }else if ((!allowShortForm && !/^#[a-fA-F0-9]{6}$/.test(value)) || (allowShortForm && !/^#[a-fA-F0-9]{6}$/.test(value) && !/^#[a-fA-F0-9]{3}$/.test(value))){
                checker.createMessage("openticket:color-invalid","error","This is an invalid hex color!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else return true
        }
        super(id,newOptions)
        this.allowShortForm = allowShortForm
        this.emptyAllowed = emptyAllowed
    }
}

/**## ODCheckerCustomStructure_EmojiString `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for an emoji (string)**
 */
export class ODCheckerCustomStructure_EmojiString extends ODCheckerStringStructure {
    /**The minimum amount of emojis required (0 to allow empty) */
    readonly minLength: number
    /**The maximum amount of emojis allowed */
    readonly maxLength: number
    /**Allow custom discord emoji ids (`<:12345678910:emoji_name>`) */
    readonly allowCustomDiscordEmoji: boolean

    constructor(id:ODValidId, minLength:number, maxLength:number, allowCustomDiscordEmoji:boolean, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            if (typeof value != "string") return false

            const emojis: string[] = []
            const emojiSplitRegex = /(?:(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(?:<a?:[^:]*:[0-9]+>))/g
            let emoji = emojiSplitRegex.exec(value)
            while (emoji != null){
                emojis.push(emoji[0])
                emoji = emojiSplitRegex.exec(value)
            }
            
            if (emojis.length < minLength){
                checker.createMessage("openticket:emoji-too-short","error",`This string needs to have at least ${minLength} emoji's!`,lt,null,[maxLength.toString()],this.id,(this.options.docs ?? null))
                return false
            }else if (emojis.length > maxLength){
                checker.createMessage("openticket:emoji-too-long","error",`This string needs to have at most ${maxLength} emoji's!`,lt,null,[maxLength.toString()],this.id,(this.options.docs ?? null))
                return false
            }else if (!allowCustomDiscordEmoji && /<a?:[^:]*:[0-9]+>/.test(value)){
                checker.createMessage("openticket:emoji-custom","error",`This emoji can't be a custom discord emoji!`,lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (!/^(?:(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(?:<a?:[^:]*:[0-9]+>))*$/.test(value)){
                checker.createMessage("openticket:emoji-invalid","error","This is an invalid emoji!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }
            return true
        }
        super(id,newOptions)
        this.minLength = minLength
        this.maxLength = maxLength
        this.allowCustomDiscordEmoji = allowCustomDiscordEmoji
    }
}

/**## ODCheckerCustomStructureOptions_UrlString `interface`
 * This interface has the options for `ODCheckerCustomStructure_UrlString`!
 */
export interface ODCheckerCustomStructureOptions_UrlString {
    /**Allow urls with `http://` instead of `https://` */
    allowHttp?:boolean
    /**Allowed hostnames (string or regex) => will match domain + subdomain */
    allowedHostnames?: (string|RegExp)[]
    /**Allowed extentions (string) => will match the end of the url (`.png`,`.svg`,...) */
    allowedExtensions?: string[]
    /**Allowed paths (string or regex) => will match path + extension (not domain + subdomain) */
    allowedPaths?: (string|RegExp)[],
    /**A regex that will be executed on the entire url (including search params, protcol, domain, ...) */
    regex?:RegExp
}

/**## ODCheckerCustomStructure_UrlString `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for a URL (string)**
 */
export class ODCheckerCustomStructure_UrlString extends ODCheckerStringStructure {
    /**The settings for this url */
    readonly urlSettings: ODCheckerCustomStructureOptions_UrlString
    /**Is this url allowed to be empty? */
    readonly emptyAllowed: boolean

    constructor(id:ODValidId, emptyAllowed:boolean, urlSettings:ODCheckerCustomStructureOptions_UrlString, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            
            if (typeof value != "string") return false
            else if (emptyAllowed && value.length == 0){
                return true
            }else if (!this.#urlIsValid(value)){
                checker.createMessage("openticket:url-invalid","error","This url is invalid!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (typeof this.urlSettings.allowHttp != "undefined" && !this.urlSettings.allowHttp && !/^(https:\/\/)/.test(value)){
                checker.createMessage("openticket:url-invalid-http","error","This url can only use the https:// protocol!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (!/^(http(s)?:\/\/)/.test(value)){
                checker.createMessage("openticket:url-invalid-protocol","error","This url can only use the http:// & https:// protocols!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (typeof this.urlSettings.allowedHostnames != "undefined" && !this.#urlHasValidHostname(value,this.urlSettings.allowedHostnames)){
                checker.createMessage("openticket:url-invalid-hostname","error","This url has a disallowed hostname!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (typeof this.urlSettings.allowedExtensions != "undefined" && !this.#urlHasValidExtension(value,this.urlSettings.allowedExtensions)){
                checker.createMessage("openticket:url-invalid-extension","error",`This url has an invalid extension! Choose between: ${this.urlSettings.allowedExtensions.join(", ")}!"`,lt,null,[this.urlSettings.allowedExtensions.join(", ")],this.id,(this.options.docs ?? null))
                return false
            }else if (typeof this.urlSettings.allowedPaths != "undefined" && !this.#urlHasValidPath(value,this.urlSettings.allowedPaths)){
                checker.createMessage("openticket:url-invalid-path","error","This url has an invalid path!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else if (typeof this.urlSettings.regex != "undefined" && !this.urlSettings.regex.test(value)){
                checker.createMessage("openticket:url-invalid","error","This url is invalid!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else return true
        }
        super(id,newOptions)
        this.urlSettings = urlSettings
        this.emptyAllowed = emptyAllowed
    }

    /**Check for the hostname */
    #urlHasValidHostname(url:string,hostnames:(string|RegExp)[]): boolean {
        try {
            const hostname = new URL(url).hostname
            return hostnames.some((rule) => {
                if (typeof rule == "string"){
                    return rule == hostname
                }else{
                    return rule.test(hostname)
                }
            })
            
        }catch{
            return false
        }
    }
    /**Check for the extension */
    #urlHasValidExtension(url:string,extensions:string[]): boolean {
        try {
            const path = new URL(url).pathname
            return extensions.some((rule) => {
                return path.endsWith(rule)
            })
        }catch{
            return false
        }
    }
    /**Check for the path */
    #urlHasValidPath(url:string,paths:(string|RegExp)[]): boolean {
        try {
            const path = new URL(url).pathname
            return paths.some((rule) => {
                if (typeof rule == "string"){
                    return rule == path
                }else{
                    return rule.test(path)
                }
            })
        }catch{
            return false
        }
    }
    /**Do general syntax check on url */
    #urlIsValid(url:string){
        try {
            new URL(url)
            return true
        }catch{
            return false
        }
    }
}

/**## ODCheckerCustomStructure_UniqueId `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for a unique id (per source & scope)**
 */
export class ODCheckerCustomStructure_UniqueId extends ODCheckerStringStructure {
    /**The source of this unique id (generally the plugin name or `openticket`) */
    readonly source: string
    /**The scope of this unique id (id needs to be unique in this scope) */
    readonly scope: string

    constructor(id:ODValidId, source:string, scope:string, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            const uniqueArray: string[] = (checker.storage.get(source,scope) === null) ? [] : checker.storage.get(source,scope)
            if (uniqueArray.includes(value)){
                //unique id already exists => throw error
                checker.createMessage("openticket:id-not-unique","error","This id isn't unique, use another id instead!",lt,null,[],this.id,(this.options.docs ?? null))
                return false
            }else{
                //unique id doesn't exists => add to list
                uniqueArray.push(value)
                checker.storage.set(source,scope,uniqueArray)
                return true
            }
        }
        super(id,newOptions)
        this.source = source
        this.scope = scope
    }
}

/**## ODCheckerCustomStructure_UniqueIdArray `class`
 * This is an open ticket custom checker structure.
 * 
 * This class extends a primitive config checker & adds another layer of checking in the `custom` function.
 * You can compare it to a blueprint for a specific checker.
 * 
 * **This custom checker is made for a unique id array (per source & scope)**
 */
export class ODCheckerCustomStructure_UniqueIdArray extends ODCheckerArrayStructure {
    /**The source to read unique ids (generally the plugin name or `openticket`) */
    readonly source: string
    /**The scope to read unique ids (id needs to be unique in this scope) */
    readonly scope: string
    /**The scope to push unique ids when used in this array! */
    readonly usedScope: string|null

    constructor(id:ODValidId, source:string, scope:string, usedScope?:string, options?:ODCheckerArrayStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (!Array.isArray(value)) return false
            const uniqueArray: string[] = (checker.storage.get(source,scope) === null) ? [] : checker.storage.get(source,scope)

            let localQuit = false
            value.forEach((id,index) => {
                if (typeof id != "string") return
                const localLt = checker.locationTraceDeref(lt)
                localLt.push(index)
                if (uniqueArray.includes(id)){
                    //exists
                    if (usedScope){
                        const current: string[] = checker.storage.get(source,usedScope) ?? []
                        current.push(id)
                        checker.storage.set(source,usedScope,current)
                    }
                }else{
                    //doesn't exist
                    checker.createMessage("openticket:id-non-existent","error",`The id "${id}" doesn't exist!`,localLt,null,[`"${id}"`],this.id,(this.options.docs ?? null))
                    localQuit = true
                }
            })
            return !localQuit
        }
        super(id,newOptions)
        this.source = source
        this.scope = scope
        this.usedScope = usedScope ?? null
    }
}

/*TEMPLATE!!!!
export interface ODCheckerTemplateStructureOptions extends ODCheckerStructureOptions {
    
}
export class ODCheckerTemplateStructure extends ODCheckerStructure {
    declare options: ODCheckerTemplateStructureOptions

    constructor(id:ODValidId, options:ODCheckerTemplateStructureOptions){
        super(id,options)
    }

    check(checker:ODChecker, value:any, locationTrace:ODCheckerLocationTrace): boolean {
        const lt = checker.locationTraceDeref(locationTrace)
        
        return super.check(checker,value,locationTrace)
    }
}
*/
/*CUSTOM TEMPLATE!!!!
export class ODCheckerCustomStructure_Template extends ODCheckerTemplateStructure {
    idk: string

    constructor(id:ODValidId, idk:string, options?:ODCheckerStringStructureOptions){
        //add premade custom structure checker
        const newOptions = options ?? {}
        newOptions.custom = (checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            //do custom check & push error message. Return true if correct
            return boolean
        }
        super(id,newOptions)
        this.idk = idk
    }
}
*/