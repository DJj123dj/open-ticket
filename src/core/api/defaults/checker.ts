///////////////////////////////////////
//DEFAULT CONFIG CHECKER MODULE
///////////////////////////////////////
import { ODLanguageManager_Default } from "../api"
import { ODValidId } from "../modules/base"
import { ODCheckerManager, ODChecker, ODCheckerTranslationRegister, ODCheckerRenderer, ODCheckerFunctionManager, ODCheckerResult, ODCheckerFunction } from "../modules/checker"
import ansis from "ansis"

/**## ODCheckerManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCheckerManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCheckerManagerIds_Default {
    "openticket:general":ODChecker,
    "openticket:questions":ODChecker,
    "openticket:options":ODChecker,
    "openticket:panels":ODChecker,
    "openticket:transcripts":ODChecker
}

/**## ODCheckerManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCheckerManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.checkers`!
 */
export class ODCheckerManager_Default extends ODCheckerManager {
    declare translation: ODCheckerTranslationRegister_Default
    declare renderer: ODCheckerRenderer_Default
    declare functions: ODCheckerFunctionManager_Default

    get<CheckerId extends keyof ODCheckerManagerIds_Default>(id:CheckerId): ODCheckerManagerIds_Default[CheckerId]
    get(id:ODValidId): ODChecker|null
    
    get(id:ODValidId): ODChecker|null {
        return super.get(id)
    }

    remove<CheckerId extends keyof ODCheckerManagerIds_Default>(id:CheckerId): ODCheckerManagerIds_Default[CheckerId]
    remove(id:ODValidId): ODChecker|null
    
    remove(id:ODValidId): ODChecker|null {
        return super.remove(id)
    }

    exists(id:keyof ODCheckerManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODCheckerRenderer_Default `default_class`
 * This is a special class that adds type definitions & features to the ODCheckerRenderer class.
 * It contains the code that renders the default config checker.
 * 
 * This default class is made for the global variable `opendiscord.checkers.renderer`!
 */
export class ODCheckerRenderer_Default extends ODCheckerRenderer {
    extraHeaderText: string[] = []
    extraFooterText: string[] = []
    extraTopText: string[] = []
    extraBottomText: string[] = []

    horizontalFiller: string = "="
    verticalFiller: string = "|"
    descriptionSeparator: string = " => "
    headerSeparator: string = " => "
    footerTipPrefix: string = "=> "

    disableHeader: boolean = false
    disableFooter: boolean = false

    getComponents(compact:boolean, renderEmpty:boolean, translation:ODCheckerTranslationRegister_Default, data:ODCheckerResult): string[] {
        const tm = translation
        const t = {
            headerOpenticket:tm.get("other","openticket:header-openticket") ?? "OPEN TICKET",
            headerConfigchecker:tm.get("other","openticket:header-configchecker") ?? "CONFIG CHECKER",
            headerDescription:tm.get("other","openticket:header-description") ?? "check for errors in your config files!",
            footerError:tm.get("other","openticket:footer-error") ?? "the bot won't start until all {0}'s are fixed!",
            footerWarning:tm.get("other","openticket:footer-warning") ?? "it's recommended to fix all {0}'s before starting!",
            footerSupport:tm.get("other","openticket:footer-support") ?? "SUPPORT: {0} - DOCS: {1}",
            error:tm.get("other","openticket:type-error") ?? "[ERROR]",
            warning:tm.get("other","openticket:type-warning") ?? "[WARNING]",
            info:tm.get("other","openticket:type-info") ?? "[INFO]",
            compactInfo:tm.get("other","openticket:compact-information") ?? "use {0} for more information!",
            dataPath:tm.get("other","openticket:data-path") ?? "path",
            dataDocs:tm.get("other","openticket:data-docs") ?? "docs",
            dataMessage:tm.get("other","openticket:data-message") ?? "message"
        }
        const hasErrors = data.messages.filter((m) => m.type == "error").length > 0
        const hasWarnings = data.messages.filter((m) => m.type == "warning").length > 0
        const hasInfo = data.messages.filter((m) => m.type == "info").length > 0

        if (!renderEmpty && !hasErrors && !hasWarnings && (!hasInfo || compact)) return []

        const headerText = ansis.bold.hex("#f8ba00")(t.headerOpenticket)+" "+t.headerConfigchecker+this.headerSeparator+ansis.hex("#f8ba00")(t.headerDescription)
        const footerErrorText = (hasErrors) ? this.footerTipPrefix+ansis.gray(tm.insertTranslationParams(t.footerError,[ansis.bold.red(t.error)])) : ""
        const footerWarningText = (hasWarnings) ? this.footerTipPrefix+ansis.gray(tm.insertTranslationParams(t.footerWarning,[ansis.bold.yellow(t.warning)])) : ""
        const footerSupportText = tm.insertTranslationParams(t.footerSupport,[ansis.green("https://discord.dj-dj.be"),ansis.green("https://otdocs.dj-dj.be")])
        const bottomCompactInfo = (compact) ? ansis.gray(tm.insertTranslationParams(t.compactInfo,[ansis.bold.green("npm start -- --checker")])) : ""

        const finalHeader = [headerText,...this.extraHeaderText]
        const finalFooter = [footerErrorText,footerWarningText,footerSupportText,...this.extraFooterText]
        const finalTop = [...this.extraTopText]
        const finalBottom = [bottomCompactInfo,...this.extraBottomText]
        const borderLength = this.#getLongestLength([...finalHeader,...finalFooter])

        const finalComponents: string[] = []

        //header
        if (!this.disableHeader){
            finalHeader.forEach((text) => {
                if (text.length < 1) return
                finalComponents.push(this.#createBlockFromText(text,borderLength))
            })
        }
        finalComponents.push(this.#getHorizontalDivider(borderLength+4))

        //top
        finalTop.forEach((text) => {
            if (text.length < 1) return
            finalComponents.push(this.verticalFiller+" "+text)
        })
        finalComponents.push(this.verticalFiller)

        //messages
        if (compact){
            //use compact messages
            data.messages.forEach((msg,index) => {
                //compact mode doesn't render info
                if (msg.type == "info") return

                //check if translation available & use it if possible
                const rawTranslation = tm.get("message",msg.messageId.value)
                const translatedMessage = (rawTranslation) ? tm.insertTranslationParams(rawTranslation,msg.translationParams) : msg.message
                
                if (msg.type == "error") finalComponents.push(this.verticalFiller+" "+ansis.bold.red(`${t.error} ${translatedMessage}`))
                else if (msg.type == "warning") finalComponents.push(this.verticalFiller+" "+ansis.bold.yellow(`${t.warning} ${translatedMessage}`))
                
                const pathSplitter = msg.path ? ":" : ""
                finalComponents.push(this.verticalFiller+ansis.bold(this.descriptionSeparator)+ansis.cyan(`${ansis.magenta(msg.filepath+pathSplitter)} ${msg.path}`))
                if (index != data.messages.length-1) finalComponents.push(this.verticalFiller)
            })
        }else{
            //use full messages
            data.messages.forEach((msg,index) => {
                //check if translation available & use it if possible
                const rawTranslation = tm.get("message",msg.messageId.value)
                const translatedMessage = (rawTranslation) ? tm.insertTranslationParams(rawTranslation,msg.translationParams) : msg.message
                
                if (msg.type == "error") finalComponents.push(this.verticalFiller+" "+ansis.bold.red(`${t.error} ${translatedMessage}`))
                else if (msg.type == "warning") finalComponents.push(this.verticalFiller+" "+ansis.bold.yellow(`${t.warning} ${translatedMessage}`))
                else if (msg.type == "info") finalComponents.push(this.verticalFiller+" "+ansis.bold.blue(`${t.info} ${translatedMessage}`))
                
                const pathSplitter = msg.path ? ":" : ""
                finalComponents.push(this.verticalFiller+" "+ansis.bold((t.dataPath)+this.descriptionSeparator)+ansis.cyan(`${ansis.magenta(msg.filepath+pathSplitter)} ${msg.path}`))
                if (msg.locationDocs) finalComponents.push(this.verticalFiller+" "+ansis.bold(t.dataDocs+this.descriptionSeparator)+ansis.italic.gray(msg.locationDocs))
                if (msg.messageDocs) finalComponents.push(this.verticalFiller+" "+ansis.bold(t.dataMessage+this.descriptionSeparator)+ansis.italic.gray(msg.messageDocs))
                    if (index != data.messages.length-1) finalComponents.push(this.verticalFiller)
            })
        }

        //bottom
        finalComponents.push(this.verticalFiller)
        finalBottom.forEach((text) => {
            if (text.length < 1) return
            finalComponents.push(this.verticalFiller+" "+text)
        })

        //footer
        finalComponents.push(this.#getHorizontalDivider(borderLength+4))
        if (!this.disableFooter){
            finalFooter.forEach((text) => {
                if (text.length < 1) return
                finalComponents.push(this.#createBlockFromText(text,borderLength))
            })
            finalComponents.push(this.#getHorizontalDivider(borderLength+4))
        }

        //return all components
        return finalComponents
    }
    /**Get the length of the longest string in the array. */
    #getLongestLength(text:string[]): number {
        let finalLength = 0
        text.forEach((t) => {
            const l = ansis.strip(t).length
            if (l > finalLength) finalLength = l
        })

        return finalLength
    }
    /**Get a horizontal divider used between different parts of the config checker result. */
    #getHorizontalDivider(width:number): string {
        if (width > 2) width = width-2
        else return this.verticalFiller+this.verticalFiller
        let divider = this.verticalFiller + this.horizontalFiller.repeat(width) + this.verticalFiller
        return divider
    }
    /**Create a block of text with a vertical divider on the left & right side. */
    #createBlockFromText(text:string,width:number): string {
        if (width < 3) return this.verticalFiller+this.verticalFiller
        let newWidth = width-ansis.strip(text).length+1
        let final = this.verticalFiller+" "+text+" ".repeat(newWidth)+this.verticalFiller
        return final
    }
}

/**## ODCheckerTranslationRegisterOtherIds_Default `interface`
 * This interface is a list of ids available in the `ODCheckerTranslationRegister_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODCheckerTranslationRegisterOtherIds_Default = (
    "openticket:header-openticket"|
    "openticket:header-configchecker"|
    "openticket:header-description"|
    "openticket:type-error"|
    "openticket:type-warning"|
    "openticket:type-info"|
    "openticket:data-path"|
    "openticket:data-docs"|
    "openticket:data-message"|
    "openticket:compact-information"|
    "openticket:footer-error"|
    "openticket:footer-warning"|
    "openticket:footer-support"
)

/**## ODCheckerTranslationRegisterMessageIds_Default `interface`
 * This interface is a list of ids available in the `ODCheckerTranslationRegister_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODCheckerTranslationRegisterMessageIds_Default = (
    "openticket:invalid-type"|
    "openticket:property-missing"|
    "openticket:property-optional"|
    "openticket:object-disabled"|
    "openticket:null-invalid"|
    "openticket:switch-invalid-type"|
    "openticket:object-switch-invalid-type"|

    "openticket:string-too-short"|
    "openticket:string-too-long"|
    "openticket:string-length-invalid"|
    "openticket:string-starts-with"|
    "openticket:string-ends-with"|
    "openticket:string-contains"|
    "openticket:string-choices"|
    "openticket:string-regex"|

    "openticket:number-too-short"|
    "openticket:number-too-long"|
    "openticket:number-length-invalid"|
    "openticket:number-too-small"|
    "openticket:number-too-large"|
    "openticket:number-not-equal"|
    "openticket:number-step"|
    "openticket:number-step-offset"|
    "openticket:number-starts-with"|
    "openticket:number-ends-with"|
    "openticket:number-contains"|
    "openticket:number-choices"|
    "openticket:number-float"|
    "openticket:number-negative"|
    "openticket:number-positive"|
    "openticket:number-zero"|

    "openticket:boolean-true"|
    "openticket:boolean-false"|

    "openticket:array-empty-disabled"|
    "openticket:array-empty-required"|
    "openticket:array-too-short"|
    "openticket:array-too-long"|
    "openticket:array-length-invalid"|
    "openticket:array-invalid-types"|
    "openticket:array-double"|

    "openticket:discord-invalid-id"|
    "openticket:discord-invalid-id-options"|
    "openticket:discord-invalid-token"|
    "openticket:color-invalid"|
    "openticket:emoji-too-short"|
    "openticket:emoji-too-long"|
    "openticket:emoji-custom"|
    "openticket:emoji-invalid"|
    "openticket:url-invalid"|
    "openticket:url-invalid-http"|
    "openticket:url-invalid-protocol"|
    "openticket:url-invalid-hostname"|
    "openticket:url-invalid-extension"|
    "openticket:url-invalid-path"|
    "openticket:id-not-unique"|
    "openticket:id-non-existent"|

    "openticket:invalid-language"|
    "openticket:invalid-button"|
    "openticket:unused-option"|
    "openticket:unused-question"|
    "openticket:dropdown-option"
)

/**## ODCheckerTranslationRegister_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCheckerTranslationRegister class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.checkers.translation`!
 */
export class ODCheckerTranslationRegister_Default extends ODCheckerTranslationRegister {
    get(type:"other", id:ODCheckerTranslationRegisterOtherIds_Default): string
    get(type:"message", id:ODCheckerTranslationRegisterMessageIds_Default): string
    get(type:"message"|"other", id:string): string|null
    
    get(type:"message"|"other", id:string): string|null {
        return super.get(type,id)
    }

    set(type:"other", id:ODCheckerTranslationRegisterOtherIds_Default, translation:string): boolean
    set(type:"message", id:ODCheckerTranslationRegisterMessageIds_Default, translation:string): boolean
    set(type:"message"|"other", id:string, translation:string): boolean
    
    set(type:"message"|"other", id:string, translation:string): boolean {
        return super.set(type,id,translation)
    }

    delete(type:"other", id:ODCheckerTranslationRegisterOtherIds_Default): boolean
    delete(type:"message", id:ODCheckerTranslationRegisterMessageIds_Default): boolean
    delete(type:"message"|"other", id:string): boolean
    
    delete(type:"message"|"other", id:string): boolean {
        return super.delete(type,id)
    }

    quickTranslate(manager:ODLanguageManager_Default, translationId:string, type:"other"|"message", id:ODCheckerTranslationRegisterOtherIds_Default|ODCheckerTranslationRegisterMessageIds_Default)
    quickTranslate(manager:ODLanguageManager_Default, translationId:string, type:"other"|"message", id:string)

    quickTranslate(manager:ODLanguageManager_Default, translationId:string, type:"other"|"message", id:ODCheckerTranslationRegisterOtherIds_Default|ODCheckerTranslationRegisterMessageIds_Default|string){
        super.quickTranslate(manager,translationId,type,id)
    }
}

/**## ODCheckerFunctionManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODCheckerFunctionManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCheckerFunctionManagerIds_Default {
    "openticket:unused-options":ODCheckerFunction,
    "openticket:unused-questions":ODCheckerFunction,
    "openticket:dropdown-options":ODCheckerFunction
}

/**## ODCheckerFunctionManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODCheckerFunctionManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.checkers.functions`!
 */
export class ODCheckerFunctionManager_Default extends ODCheckerFunctionManager {
    get<CheckerFunctionId extends keyof ODCheckerFunctionManagerIds_Default>(id:CheckerFunctionId): ODCheckerFunctionManagerIds_Default[CheckerFunctionId]
    get(id:ODValidId): ODCheckerFunction|null
    
    get(id:ODValidId): ODCheckerFunction|null {
        return super.get(id)
    }

    remove<CheckerFunctionId extends keyof ODCheckerFunctionManagerIds_Default>(id:CheckerFunctionId): ODCheckerFunctionManagerIds_Default[CheckerFunctionId]
    remove(id:ODValidId): ODCheckerFunction|null
    
    remove(id:ODValidId): ODCheckerFunction|null {
        return super.remove(id)
    }

    exists(id:keyof ODCheckerFunctionManagerIds_Default): boolean
    exists(id:ODValidId): boolean

    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}