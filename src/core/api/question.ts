///////////////////////////////////////
//OPENTICKET OPTION MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"
import { ODQuestionsJsonConfig_BaseQuestion, ODQuestionsJsonConfig_DropdownChoice, ODQuestionsJsonConfig_RadioCheckboxChoice } from "../mappings/config.js"

/**## ODQuestionIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODQuestion` class.
 */
export type ODQuestionIdConstraint = Record<string, ODQuestionData<api.ODValidJsonType>>

/**## ODShortQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODShortQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODShortQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:placeholder":ODQuestionData<string>,
    "opendiscord:length-enabled":ODQuestionData<boolean>,
    "opendiscord:length-min":ODQuestionData<number>,
    "opendiscord:length-max":ODQuestionData<number>
}

/**## ODParagraphQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODParagraphQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODParagraphQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:placeholder":ODQuestionData<string>,
    "opendiscord:length-enabled":ODQuestionData<boolean>,
    "opendiscord:length-min":ODQuestionData<number>,
    "opendiscord:length-max":ODQuestionData<number>
}

/**## ODDropdownQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODDropdownQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDropdownQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:placeholder":ODQuestionData<string>,
    "opendiscord:choices":ODQuestionData<ODQuestionsJsonConfig_DropdownChoice[]>
}

/**## ODRadioSelectQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODRadioSelectQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODRadioSelectQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:choices":ODQuestionData<ODQuestionsJsonConfig_RadioCheckboxChoice[]>
}

/**## ODCheckboxSelectQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODCheckboxSelectQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCheckboxSelectQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:limits-enabled":ODQuestionData<boolean>,
    "opendiscord:limits-min":ODQuestionData<number>,
    "opendiscord:limits-max":ODQuestionData<number>
    "opendiscord:choices":ODQuestionData<ODQuestionsJsonConfig_RadioCheckboxChoice[]>
}

/**## ODFileUploadQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODFileUploadQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODFileUploadQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:name":ODQuestionData<string>,
    "opendiscord:description":ODQuestionData<string>,
    "opendiscord:required":ODQuestionData<boolean>,

    "opendiscord:limits-enabled":ODQuestionData<boolean>,
    "opendiscord:limits-min":ODQuestionData<number>,
    "opendiscord:limits-max":ODQuestionData<number>
}

/**## ODTextDisplayQuestionIdMappings `interface`
 * A list of all available IDs in the default `ODTextDisplayQuestion` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTextDisplayQuestionIdMappings extends ODQuestionIdConstraint {
    "opendiscord:text-contents":ODQuestionData<string>
}

/**## ODQuestionManager `class`
 * This is an Open Ticket question manager.
 *
 * This class manages all registered questions in the bot. Only questions which are available in this manager can be used in options.
 *
 * Questions are not stored in the database and will be parsed from the config every startup.
 */
export class ODQuestionManager extends api.ODManager<ODQuestion> {
    constructor(debug:api.ODDebugger) {
        super(debug, "question")
    }

    add(data:ODQuestion, overwrite?:boolean): boolean {
        data.useDebug(this.debug, "question data")
        return super.add(data, overwrite)
    }
}

/**## ODQuestionDataJson `interface`
 * The JSON representatation from a single question property.
 */
export interface ODQuestionDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:api.ODValidJsonType
}

/**## ODQuestionDataJson `interface`
 * The JSON representatation from a single question.
 */
export interface ODQuestionJson {
    /**The id of this question. */
    id:string,
    /**The type of this question. */
    type:string,
    /**The version of Open Ticket used to create this question. */
    version:string,
    /**The full list of properties/variables related to this question. */
    data:ODQuestionDataJson[]
}

/**## ODQuestion `class`
 * This is an Open Ticket question.
 *
 * This class contains all question data parsed from the config.
 *
 * This is an abstract class. Use instances like `ODShortQuestion` or `ODParagraphQuestion` instead.
 */
export abstract class ODQuestion<IdList extends ODQuestionIdConstraint = ODQuestionIdConstraint>extends api.ODManager<ODQuestionData<api.ODValidJsonType>> {
    /**The id of this question. (from the config) */
    id:api.ODId
    /**The type of this question (e.g. `opendiscord:short` or `opendiscord:paragraph`) */
    abstract readonly type: string

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super()
        this.id = new api.ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this question to a JSON object for storing this question in the database. */
    toJson(version:api.ODVersion): ODQuestionJson {
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

    get<QuestionId extends keyof api.ODNoGeneric<IdList>>(id:QuestionId): IdList[QuestionId]
    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null

    get(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.get(id)
    }

    remove<QuestionId extends keyof api.ODNoGeneric<IdList>>(id:QuestionId): IdList[QuestionId]
    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null

    remove(id:api.ODValidId): ODQuestionData<api.ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<IdList>): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODQuestionData `class`
 * This is Open Ticket question data.
 *
 * This class contains a single property for a question. (string, number, boolean, object, array, null)
 *
 * When this property is edited, the database will be updated automatically.
 */
export class ODQuestionData<DataType extends api.ODValidJsonType>extends api.ODManagerData {
    /**The value of this property. */
    private rawValue:DataType

    constructor(id:api.ODValidId, value:DataType) {
        super(id)
        this.rawValue = value
    }

    /**The value of this property. */
    set value(value:DataType) {
        this.rawValue = value
        this._change()
    }

    get value(): DataType {
        return this.rawValue
    }

    /**Refresh the database. Is only required to be used when updating `ODQuestionData` with an object/array as value. */
    refreshDatabase() {
        this._change()
    }
}

/**## ODQuestionAnswer `type`
 * A question answer stored in the database.
 */
export type ODQuestionAnswer = {
    id:string,
    name:string,
    type:Exclude<ODQuestionsJsonConfig_BaseQuestion["type"], "text-display"|"file-upload">,
    value:string|null
}|{
    id:string,
    name:string,
    type:"file-upload",
    files:{
        id:string,
        url:string,
        name:string,
        title:string|null,
        description:string|null,
        contentType:string|null,
    }[]
}

/**## ODShortQuestion `class`
 * An Open Ticket short question. It contains all config properties of the short question type.
 */
export class ODShortQuestion extends ODQuestion<ODShortQuestionIdMappings> {
    readonly type:"opendiscord:short" = "opendiscord:short"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODShortQuestion {
        return new ODShortQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODParagraphQuestion `class`
 * An Open Ticket paragraph question. It contains all config properties of the paragraph question type.
 */
export class ODParagraphQuestion extends ODQuestion<ODParagraphQuestionIdMappings> {
    readonly type:"opendiscord:paragraph" = "opendiscord:paragraph"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODParagraphQuestion {
        return new ODParagraphQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODDropdownQuestion `class`
 * An Open Ticket dropdown question. It contains all config properties of the dropdown question type.
 */
export class ODDropdownQuestion extends ODQuestion<ODDropdownQuestionIdMappings> {
    readonly type:"opendiscord:dropdown" = "opendiscord:dropdown"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODDropdownQuestion {
        return new ODDropdownQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODRadioSelectQuestion `class`
 * An Open Ticket radio-select question. It contains all config properties of the radio-select question type.
 */
export class ODRadioSelectQuestion extends ODQuestion<ODRadioSelectQuestionIdMappings> {
    readonly type:"opendiscord:radio-select" = "opendiscord:radio-select"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODRadioSelectQuestion {
        return new ODRadioSelectQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODCheckboxSelectQuestion `class`
 * An Open Ticket checkbox-select question. It contains all config properties of the checkbox-select question type.
 */
export class ODCheckboxSelectQuestion extends ODQuestion<ODCheckboxSelectQuestionIdMappings> {
    readonly type:"opendiscord:checkbox-select" = "opendiscord:checkbox-select"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODCheckboxSelectQuestion {
        return new ODCheckboxSelectQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODFileUploadQuestion `class`
 * An Open Ticket file-upload question. It contains all config properties of the file-upload question type.
 */
export class ODFileUploadQuestion extends ODQuestion<ODFileUploadQuestionIdMappings> {
    readonly type:"opendiscord:file-upload" = "opendiscord:file-upload"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODFileUploadQuestion {
        return new ODFileUploadQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}

/**## ODTextDisplayQuestion `class`
 * An Open Ticket text-display question. It contains all config properties of the text-display question type.
 */
export class ODTextDisplayQuestion extends ODQuestion<ODTextDisplayQuestionIdMappings> {
    readonly type:"opendiscord:text-display" = "opendiscord:text-display"

    constructor(id:api.ODValidId, data:ODQuestionData<api.ODValidJsonType>[]) {
        super(id, data)
    }

    static fromJson(json: ODQuestionJson): ODTextDisplayQuestion {
        return new ODTextDisplayQuestion(json.id, json.data.map((data) => new ODQuestionData(data.id, data.value)))
    }
}