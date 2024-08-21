///////////////////////////////////////
//OPENTICKET OPTION MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"

export class ODQuestionManager extends ODManager<ODQuestion> {
    #debug: ODDebugger

    constructor(debug:ODDebugger){
        super(debug,"question")
        this.#debug = debug
    }
    
    add(data:ODQuestion, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"question data")
        return super.add(data,overwrite)
    }
}

export interface ODQuestionDataJson {
    id:string,
    value:ODValidJsonType
}

export interface ODQuestionJson {
    id:string,
    type:string,
    version:string,
    data:ODQuestionDataJson[]
}

export class ODQuestion extends ODManager<ODQuestionData<ODValidJsonType>> {
    id:ODId
    type: string

    constructor(id:ODValidId, type:string, data:ODQuestionData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        this.type = type
        data.forEach((data) => {
            this.add(data)
        })
    }

    toJson(version:ODVersion): ODQuestionJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })
        
        return {
            id:this.id.toString(),
            type:this.type,
            version:version.toString(),
            data
        }
    }

    static fromJson(json:ODQuestionJson): ODQuestion {
        return new ODQuestion(json.id,json.type,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}

export class ODQuestionData<DataType extends ODValidJsonType> extends ODManagerData {
    #value: DataType

    constructor(id:ODValidId, value:DataType){
        super(id)
        this.#value = value
    }

    set value(value:DataType){
        this.#value = value
        this._change()
    }
    get value(): DataType {
        return this.#value
    }
    /**Refresh the database. Is only required to be used when updating `ODQuestionData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}

/**## ODShortQuestionIds `type`
 * This type is an array of ids available in the `ODShortQuestion` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODShortQuestionIds {
    "openticket:name":ODQuestionData<string>,
    "openticket:required":ODQuestionData<boolean>,
    "openticket:placeholder":ODQuestionData<string>,
    
    "openticket:length-enabled":ODQuestionData<boolean>,
    "openticket:length-min":ODQuestionData<number>,
    "openticket:length-max":ODQuestionData<number>
}

export class ODShortQuestion extends ODQuestion {
    type: "openticket:short" = "openticket:short"

    constructor(id:ODValidId, data:ODQuestionData<ODValidJsonType>[]){
        super(id,"openticket:short",data)
    }

    get<QuestionId extends keyof ODShortQuestionIds>(id:QuestionId): ODShortQuestionIds[QuestionId]
    get(id:ODValidId): ODQuestionData<ODValidJsonType>|null
    
    get(id:ODValidId): ODQuestionData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<QuestionId extends keyof ODShortQuestionIds>(id:QuestionId): ODShortQuestionIds[QuestionId]
    remove(id:ODValidId): ODQuestionData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODQuestionData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODShortQuestionIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODQuestionJson): ODShortQuestion {
        return new ODShortQuestion(json.id,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}

/**## ODParagraphQuestionIds `type`
 * This type is an array of ids available in the `ODParagraphQuestion` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODParagraphQuestionIds {
    "openticket:name":ODQuestionData<string>,
    "openticket:required":ODQuestionData<boolean>,
    "openticket:placeholder":ODQuestionData<string>,
    
    "openticket:length-enabled":ODQuestionData<boolean>,
    "openticket:length-min":ODQuestionData<number>,
    "openticket:length-max":ODQuestionData<number>
}

export class ODParagraphQuestion extends ODQuestion {
    type: "openticket:paragraph" = "openticket:paragraph"

    constructor(id:ODValidId, data:ODQuestionData<ODValidJsonType>[]){
        super(id,"openticket:paragraph",data)
    }

    get<QuestionId extends keyof ODParagraphQuestionIds>(id:QuestionId): ODParagraphQuestionIds[QuestionId]
    get(id:ODValidId): ODQuestionData<ODValidJsonType>|null
    
    get(id:ODValidId): ODQuestionData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<QuestionId extends keyof ODParagraphQuestionIds>(id:QuestionId): ODParagraphQuestionIds[QuestionId]
    remove(id:ODValidId): ODQuestionData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODQuestionData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODParagraphQuestionIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    static fromJson(json: ODQuestionJson): ODParagraphQuestion {
        return new ODParagraphQuestion(json.id,json.data.map((data) => new ODQuestionData(data.id,data.value)))
    }
}