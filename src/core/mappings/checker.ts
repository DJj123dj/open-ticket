///////////////////////////////////////
//OPEN TICKET CONFIG CHECKER MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODBCheckerManagerIdMappings `interface`
 * A list of all available IDs in the default `ODBCheckerManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCheckerManagerIdMappings extends api.ODCheckerManagerIdConstraint {
    "opendiscord:general":api.ODChecker,
    "opendiscord:questions":api.ODChecker,
    "opendiscord:options":api.ODChecker,
    "opendiscord:panels":api.ODChecker,
    "opendiscord:transcripts":api.ODChecker
}

/**## ODCheckerTranslationRegisterOtherIdMappings `type`
 * A list of all available IDs in the default `ODCheckerTranslationRegister` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export type ODCheckerTranslationRegisterOtherIdMappings = (
    "opendiscord:header-openticket"
    |"opendiscord:header-configchecker"
    |"opendiscord:header-description"
    |"opendiscord:type-error"
    |"opendiscord:type-warning"
    |"opendiscord:type-info"
    |"opendiscord:data-path"
    |"opendiscord:data-docs"
    |"opendiscord:data-message"
    |"opendiscord:compact-information"
    |"opendiscord:footer-error"
    |"opendiscord:footer-warning"
    |"opendiscord:footer-support"
)

/**## ODCheckerTranslationRegisterMessageIdMappings `type`
 * A list of all available IDs in the default `ODCheckerTranslationRegister` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export type ODCheckerTranslationRegisterMessageIdMappings = (
    "opendiscord:invalid-type"
    |"opendiscord:property-missing"
    |"opendiscord:property-optional"
    |"opendiscord:object-disabled"
    |"opendiscord:null-invalid"
    |"opendiscord:switch-invalid-type"
    |"opendiscord:object-switch-invalid-type"

    |"opendiscord:string-too-short"
    |"opendiscord:string-too-long"
    |"opendiscord:string-length-invalid"
    |"opendiscord:string-starts-with"
    |"opendiscord:string-ends-with"
    |"opendiscord:string-contains"
    |"opendiscord:string-inverted-contains"
    |"opendiscord:string-choices"
    |"opendiscord:string-lowercase"
    |"opendiscord:string-uppercase"
    |"opendiscord:string-special-characters"
    |"opendiscord:string-no-spaces"
    |"opendiscord:string-regex"
    |"opendiscord:string-capital-word"
    |"opendiscord:string-capital-sentence"
    |"opendiscord:string-punctuation"

    |"opendiscord:number-nan"
    |"opendiscord:number-too-short"
    |"opendiscord:number-too-long"
    |"opendiscord:number-length-invalid"
    |"opendiscord:number-too-small"
    |"opendiscord:number-too-large"
    |"opendiscord:number-not-equal"
    |"opendiscord:number-step"
    |"opendiscord:number-step-offset"
    |"opendiscord:number-starts-with"
    |"opendiscord:number-ends-with"
    |"opendiscord:number-contains"
    |"opendiscord:number-inverted-contains"
    |"opendiscord:number-choices"
    |"opendiscord:number-float"
    |"opendiscord:number-negative"
    |"opendiscord:number-positive"
    |"opendiscord:number-zero"

    |"opendiscord:boolean-true"
    |"opendiscord:boolean-false"

    |"opendiscord:array-empty-disabled"
    |"opendiscord:array-empty-required"
    |"opendiscord:array-too-short"
    |"opendiscord:array-too-long"
    |"opendiscord:array-length-invalid"
    |"opendiscord:array-invalid-types"
    |"opendiscord:array-double"

    |"opendiscord:discord-invalid-id"
    |"opendiscord:discord-invalid-id-options"
    |"opendiscord:discord-invalid-token"
    |"opendiscord:color-invalid"
    |"opendiscord:emoji-too-short"
    |"opendiscord:emoji-too-long"
    |"opendiscord:emoji-custom"
    |"opendiscord:emoji-invalid"
    |"opendiscord:url-invalid"
    |"opendiscord:url-invalid-http"
    |"opendiscord:url-invalid-protocol"
    |"opendiscord:url-invalid-hostname"
    |"opendiscord:url-invalid-extension"
    |"opendiscord:url-invalid-path"
    |"opendiscord:id-not-unique"
    |"opendiscord:id-non-existent"

    |"opendiscord:invalid-language"
    |"opendiscord:invalid-button"
    |"opendiscord:unused-option"
    |"opendiscord:unused-question"
    |"opendiscord:dropdown-option"
)

/**## ODCheckerFunctionManagerIdMappings `type`
 * A list of all available IDs in the default `ODCheckerFunctionManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCheckerFunctionManagerIdMappings extends api.ODCheckerFunctionManagerIdConstraint {
    "opendiscord:unused-options":api.ODCheckerFunction,
    "opendiscord:unused-questions":api.ODCheckerFunction,
    "opendiscord:dropdown-options":api.ODCheckerFunction
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedCheckerManager `class
 * A special class with types for the Open Ticket `ODCheckerManager` class.
 */
export class ODMappedCheckerManager extends api.ODCheckerManager<ODCheckerManagerIdMappings, ODCheckerFunctionManagerIdMappings, api.ODDefaultCheckerRenderer, ODCheckerTranslationRegisterMessageIdMappings, ODCheckerTranslationRegisterOtherIdMappings> {}

/**## ODMappedCheckerFunctionManager `class
 * A special class with types for the Open Ticket `ODCheckerFunctionManager` class.
 */
export class ODMappedCheckerFunctionManager extends api.ODCheckerFunctionManager<ODCheckerFunctionManagerIdMappings> {}

/**## ODMappedCheckerTranslationRegister `class
 * A special class with types for the Open Ticket `ODCheckerTranslationRegister` class.
 */
export class ODMappedCheckerTranslationRegister extends api.ODCheckerTranslationRegister<ODCheckerTranslationRegisterMessageIdMappings, ODCheckerTranslationRegisterOtherIdMappings> {}