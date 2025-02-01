///////////////////////////////////////
//DEFAULT PROGRESS BAR MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODValidConsoleColor } from "../modules/console"
import { ODManualProgressBar, ODProgressBar, ODProgressBarManager, ODProgressBarRenderer, ODProgressBarRendererManager } from "../modules/progressbar"
import ansis from "ansis"

/**## ODProgressBarRenderer_DefaultSettingsLabel `type`
 * All available label types for the default progress bar renderer
 */
export type ODProgressBarRenderer_DefaultSettingsLabel = "value"|"percentage"|"fraction"|"time-ms"|"time-sec"|"time-min"

/**## ODProgressBarRenderer_DefaultSettings `interface`
 * This interface contains the settings for the default progress bar renderer.
 */
export interface ODProgressBarRenderer_DefaultSettings {
    /**The color of the progress bar border. */
    borderColor:ODValidConsoleColor|"openticket",
    /**The color of the progress bar (filled side). */
    filledBarColor:ODValidConsoleColor|"openticket",
    /**The color of the progress bar (empty side). */
    emptyBarColor:ODValidConsoleColor|"openticket",
    /**The color of the text before the progress bar. */
    prefixColor:ODValidConsoleColor|"openticket",
    /**The color of the text after the progress bar. */
    suffixColor:ODValidConsoleColor|"openticket",
    /**The color of the progress bar label. */
    labelColor:ODValidConsoleColor|"openticket",

    /**The character used in the left border. */
    leftBorderChar:string,
    /**The character used in the right border. */
    rightBorderChar:string,
    /**The character used in the filled side of the progress bar. */
    filledBarChar:string,
    /**The character used in the empty side of the progress bar. */
    emptyBarChar:string,
    /**The label type. (will show a number related to the progress) */
    labelType:ODProgressBarRenderer_DefaultSettingsLabel,
    /**The position of the label. */
    labelPosition:"start"|"end",
    /**The width of the bar. (50 characters by default) */
    barWidth:number,

    /**Show the bar. */
    showBar:boolean,
    /**Show the label. */
    showLabel:boolean,
    /**Show the border. */
    showBorder:boolean,
}

export class ODProgressBarRenderer_Default extends ODProgressBarRenderer<ODProgressBarRenderer_DefaultSettings> {
    constructor(id:ODValidId,settings:ODProgressBarRenderer_DefaultSettings){
        super(id,(settings,min,max,value,rawPrefix,rawSuffix) => {
            const percentage = (value-min)/(max-min)
            const barLevel = Math.round(percentage*settings.barWidth)

            const borderAnsis = (settings.borderColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.borderColor]
            const filledBarAnsis = (settings.filledBarColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.filledBarColor]
            const emptyBarAnsis = (settings.emptyBarColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.emptyBarColor]
            const labelAnsis = (settings.labelColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.labelColor]
            const prefixAnsis = (settings.prefixColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.prefixColor]
            const suffixAnsis = (settings.suffixColor == "openticket") ? ansis.hex("#f8ba00") : ansis[settings.suffixColor]

            const leftBorder = (settings.showBorder) ? borderAnsis(settings.leftBorderChar) : ""
            const rightBorder = (settings.showBorder) ? borderAnsis(settings.rightBorderChar) : ""
            const bar = (settings.showBar) ? filledBarAnsis(settings.filledBarChar.repeat(barLevel))+emptyBarAnsis(settings.emptyBarChar.repeat(settings.barWidth-barLevel)) : ""
            const prefix = (rawPrefix) ? prefixAnsis(rawPrefix)+" " : ""
            const suffix = (rawSuffix) ? " "+suffixAnsis(rawSuffix) : ""
            let label: string
            if (!settings.showLabel) label = ""
            if (settings.labelType == "fraction") label = labelAnsis(value+"/"+max)
            else if (settings.labelType == "percentage") label = labelAnsis(Math.round(percentage*100)+"%")
            else if (settings.labelType == "time-ms") label = labelAnsis(value+"ms")
            else if (settings.labelType == "time-sec") label = labelAnsis(Math.round(value*10)/10+"sec")
            else if (settings.labelType == "time-min") label = labelAnsis(Math.round(value*10)/10+"min")
            else label = labelAnsis(value.toString())

            const labelWithPrefixAndSuffix = prefix+label+suffix
            return (settings.labelPosition == "start") ? labelWithPrefixAndSuffix+" "+leftBorder+bar+rightBorder : leftBorder+bar+rightBorder+" "+labelWithPrefixAndSuffix
        },settings)
    }
}

/**## ODProgressBarRendererManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODProgressBarRendererManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarRendererManagerIds_Default {
    "opendiscord:value-renderer":ODProgressBarRenderer_Default,
    "opendiscord:fraction-renderer":ODProgressBarRenderer_Default,
    "opendiscord:percentage-renderer":ODProgressBarRenderer_Default,
    "opendiscord:time-ms-renderer":ODProgressBarRenderer_Default,
    "opendiscord:time-sec-renderer":ODProgressBarRenderer_Default,
    "opendiscord:time-min-renderer":ODProgressBarRenderer_Default,
}

/**## ODProgressBarRendererManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODProgressBarRendererManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.progressbars.renderers`!
 */
export class ODProgressBarRendererManager_Default extends ODProgressBarRendererManager {
    get<ProgressBarId extends keyof ODProgressBarRendererManagerIds_Default>(id:ProgressBarId): ODProgressBarRendererManagerIds_Default[ProgressBarId]
    get(id:ODValidId): ODProgressBarRenderer<{}>|null
    
    get(id:ODValidId): ODProgressBarRenderer<{}>|null {
        return super.get(id)
    }

    remove<ProgressBarId extends keyof ODProgressBarRendererManagerIds_Default>(id:ProgressBarId): ODProgressBarRendererManagerIds_Default[ProgressBarId]
    remove(id:ODValidId): ODProgressBarRenderer<{}>|null
    
    remove(id:ODValidId): ODProgressBarRenderer<{}>|null {
        return super.remove(id)
    }

    exists(id:keyof ODProgressBarRendererManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODProgressBarManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODProgressBarManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarManagerIds_Default {
    "opendiscord:slash-command-remove":ODManualProgressBar,
    "opendiscord:slash-command-create":ODManualProgressBar,
    "opendiscord:slash-command-update":ODManualProgressBar,
}

/**## ODProgressBarManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODProgressBarManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.progressbars`!
 */
export class ODProgressBarManager_Default extends ODProgressBarManager {
    declare renderers: ODProgressBarRendererManager_Default

    get<ProgressBarId extends keyof ODProgressBarManagerIds_Default>(id:ProgressBarId): ODProgressBarManagerIds_Default[ProgressBarId]
    get(id:ODValidId): ODProgressBar|null
    
    get(id:ODValidId): ODProgressBar|null {
        return super.get(id)
    }

    remove<ProgressBarId extends keyof ODProgressBarManagerIds_Default>(id:ProgressBarId): ODProgressBarManagerIds_Default[ProgressBarId]
    remove(id:ODValidId): ODProgressBar|null
    
    remove(id:ODValidId): ODProgressBar|null {
        return super.remove(id)
    }

    exists(id:keyof ODProgressBarManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}