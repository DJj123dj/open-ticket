///////////////////////////////////////
//STARTSCREEN MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger, ODError, ODLiveStatusManager } from "./console"
import { ODFlag } from "./flag"
import { ODPlugin, ODUnknownCrashedPlugin } from "./plugin"
import ansis from "ansis"

/**## ODStartScreenComponentRenderCallback `type`
 * This is the render function of a startscreen component. It also sends the location of where the component is rendered.
 */
export type ODStartScreenComponentRenderCallback = (location:number) => string|Promise<string>

/**## ODStartScreenManager `class`
 * This is an Open Ticket startscreen manager.
 * 
 * This class is responsible for managing & rendering the startscreen of the bot.
 * The startscreen is the part you see when the bot has started up successfully. (e.g. the Open Ticket logo, logs, livestatus, flags, ...)
 */
export class ODStartScreenManager extends ODManager<ODStartScreenComponent> {
    /**Alias to the Open Ticket debugger. */
    #debug: ODDebugger
    /**Alias to the livestatus manager. */
    livestatus: ODLiveStatusManager

    constructor(debug:ODDebugger,livestatus:ODLiveStatusManager){
        super(debug,"startscreen component")
        this.#debug = debug
        this.livestatus = livestatus
    }

    /**Get all components in sorted order. */
    getSortedComponents(priority:"ascending"|"descending"){
        return this.getAll().sort((a,b) => {
            if (priority == "ascending") return a.priority-b.priority
            else return b.priority-a.priority
        })
    }
    /**Render all startscreen components in priority order. */
    async renderAllComponents(){
        const components = this.getSortedComponents("descending")
        
        let location = 0
        for (const component of components){
            try {
                const renderedText = await component.renderAll(location)
                console.log(renderedText)
                this.#debug.console.debugfile.writeText("[STARTSCREEN] Component: \""+component.id+"\"\n"+ansis.strip(renderedText))
            }catch(e){
                this.#debug.console.log("Unable to render \""+component.id+"\" startscreen component!","error")
                this.#debug.console.debugfile.writeErrorMessage(new ODError(e,"uncaughtException"))
            }
            location++
        }
    }
}

/**## ODStartScreenComponent `class`
 * This is an Open Ticket startscreen component.
 * 
 * This component can be rendered to the start screen of the bot.
 * An optional priority can be specified to choose the location of the component.
 * 
 * It's recommended to use pre-built components except if you really need a custom one.
 */
export class ODStartScreenComponent extends ODManagerData {
    /**The priority of this component. */
    priority: number
    /**An optional render function which will be inserted before the default renderer. */
    renderBefore: ODStartScreenComponentRenderCallback|null = null
    /**The render function which will render the contents of this component. */
    render: ODStartScreenComponentRenderCallback
    /**An optional render function which will be inserted behind the default renderer. */
    renderAfter: ODStartScreenComponentRenderCallback|null = null

    constructor(id:ODValidId, priority:number, render:ODStartScreenComponentRenderCallback){
        super(id)
        this.priority = priority
        this.render = render
    }

    /**Render this component and combine it with the `renderBefore` & `renderAfter` contents. */
    async renderAll(location:number){
        const textBefore = (this.renderBefore) ? await this.renderBefore(location) : ""
        const text = await this.render(location)
        const textAfter = (this.renderAfter) ? await this.renderAfter(location) : ""
        return (textBefore ? textBefore+"\n" : "")+text+(textAfter ? "\n"+textAfter : "")
    }
}

/**## ODStartScreenProperty `type`
 * This interface contains properties used in a few default templates of the startscreen component.
 */
export interface ODStartScreenProperty {
    /**The key or name of this property. */
    key:string,
    /**The value or contents of this property. */
    value:string
}

/**## ODStartScreenLogoComponent `class`
 * This is an Open Ticket startscreen logo component.
 * 
 * This component will render an ASCII art logo (from an array) to the startscreen. Every property in the array is another row.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenLogoComponent extends ODStartScreenComponent {
    /**The ASCII logo contents. */
    logo: string[]
    /**When enabled, the component will add a new line above the logo. */
    topPadding: boolean
    /**When enabled, the component will add a new line below the logo. */
    bottomPadding: boolean
    /**The color of the logo in hex format. */
    logoHexColor: string

    constructor(id:ODValidId, priority:number, logo:string[], topPadding?:boolean, bottomPadding?:boolean, logoHexColor?:string){
        super(id,priority,() => {
            const renderedTop = (this.topPadding ? "\n" : "")
            const renderedLogo = this.logo.join("\n")
            const renderedBottom = (this.bottomPadding ? "\n" : "")
            return ansis.hex(this.logoHexColor)(renderedTop+renderedLogo+renderedBottom)
        })
        this.logo = logo
        this.topPadding = topPadding ?? false
        this.bottomPadding = bottomPadding ?? false
        this.logoHexColor = logoHexColor ?? "#f8ba00"
    }
}

/**## ODStartScreenHeaderAlignmentSettings `type`
 * This interface contains all settings used in the startscreen header component.
 */
export interface ODStartScreenHeaderAlignmentSettings {
    /**The alignment settings for this header. */
    align:"center"|"left"|"right",
    /**The width or component to use when calculating center & right alignment. */
    width:number|ODStartScreenComponent
}

/**## ODStartScreenHeaderComponent `class`
 * This is an Open Ticket startscreen header component.
 * 
 * This component will render a header to the startscreen. Properties can be aligned left, right or centered.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenHeaderComponent extends ODStartScreenComponent {
    /**All properties of this header component. */
    properties: ODStartScreenProperty[]
    /**The spacer used between properties. */
    spacer: string
    /**The alignment settings of this header component. */
    align: ODStartScreenHeaderAlignmentSettings|null

    constructor(id:ODValidId, priority:number, properties:ODStartScreenProperty[], spacer?:string, align?:ODStartScreenHeaderAlignmentSettings){
        super(id,priority,async () => {
            const renderedProperties = ansis.bold(this.properties.map((prop) => prop.key+": "+prop.value).join(this.spacer))
            if (!this.align || this.align.align == "left"){
                return renderedProperties
            }else if (this.align.align == "right"){
                const width = (typeof this.align.width == "number") ? this.align.width : (
                    ansis.strip(await this.align.width.renderAll(0)).split("\n").map((row) => row.length).reduce((prev,curr) => {
                        if (prev < curr) return curr
                        else return prev
                    },0)
                )
                const offset = width - ansis.strip(renderedProperties).length
                if (offset < 0) return renderedProperties
                else{
                    return (" ".repeat(offset) + renderedProperties)
                }
            }else if (this.align.align == "center"){
                const width = (typeof this.align.width == "number") ? this.align.width : (
                    ansis.strip(await this.align.width.renderAll(0)).split("\n").map((row) => row.length).reduce((prev,curr) => {
                        if (prev < curr) return curr
                        else return prev
                    })
                )
                const offset = Math.round((width - ansis.strip(renderedProperties).length)/2)
                if (offset < 0) return renderedProperties
                else{
                    return (" ".repeat(offset) + renderedProperties)
                }
            }
            return renderedProperties
        })
        this.properties = properties
        this.spacer = spacer ?? "  -  "
        this.align = align ?? null
    }
}

/**## ODStartScreenCategoryComponent `class`
 * This is an Open Ticket startscreen category component.
 * 
 * This component will render a category to the startscreen. This will only render the category name. You'll need to provide your own renderer for the contents.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenCategoryComponent extends ODStartScreenComponent {
    /**The name of this category. */
    name: string
    /**When enabled, this category will still be rendered when the contents are empty. (enabled by default) */
    renderIfEmpty: boolean

    constructor(id:ODValidId, priority:number, name:string, render:ODStartScreenComponentRenderCallback, renderIfEmpty?:boolean){
        super(id,priority,async (location) => {
            const contents = await render(location)
            if (contents != "" || this.renderIfEmpty){
                return ansis.bold.underline("\n"+name.toUpperCase()+(contents != "" ? ":\n" : ":")) + contents
            }else return ""
        })
        this.name = name
        this.renderIfEmpty = renderIfEmpty ?? true
    }
}

/**## ODStartScreenPropertiesCategoryComponent `class`
 * This is an Open Ticket startscreen properties category component.
 * 
 * This component will render a properties category to the startscreen. This will list the properties in the category.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenPropertiesCategoryComponent extends ODStartScreenCategoryComponent {
    /**The properties of this category component. */
    properties: ODStartScreenProperty[]
    /**The hex color for the key/name of all the properties. */
    propertyHexColor: string

    constructor(id:ODValidId, priority:number, name:string, properties:ODStartScreenProperty[], propertyHexColor?:string, renderIfEmpty?:boolean){
        super(id,priority,name,() => {
            return this.properties.map((prop) => ansis.hex(this.propertyHexColor)(prop.key+": ")+prop.value).join("\n")
        },renderIfEmpty)

        this.properties = properties
        this.propertyHexColor = propertyHexColor ?? "#f8ba00"
    }
}

/**## ODStartScreenFlagsCategoryComponent `class`
 * This is an Open Ticket startscreen flags category component.
 * 
 * This component will render a flags category to the startscreen. This will list the enabled flags in the category.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenFlagsCategoryComponent extends ODStartScreenCategoryComponent {
    /**A list of all flags to render. */
    flags: ODFlag[]

    constructor(id:ODValidId, priority:number, flags:ODFlag[]){
        super(id,priority,"flags",() => {
            return this.flags.filter((flag) => (flag.value == true)).map((flag) => ansis.blue("["+flag.name+"] "+flag.description)).join("\n")
        },false)
        this.flags = flags
    }
}

/**## ODStartScreenPluginsCategoryComponent `class`
 * This is an Open Ticket startscreen plugins category component.
 * 
 * This component will render a plugins category to the startscreen. This will list the enabled, disabled & crashed plugins in the category.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenPluginsCategoryComponent extends ODStartScreenCategoryComponent {
    /**A list of all plugins to render. */
    plugins: ODPlugin[]
    /**A list of all crashed plugins to render. */
    unknownCrashedPlugins: ODUnknownCrashedPlugin[]

    constructor(id:ODValidId, priority:number, plugins:ODPlugin[], unknownCrashedPlugins:ODUnknownCrashedPlugin[]){
        super(id,priority,"plugins",() => {
            const renderedPlugins = this.plugins.sort((a,b) => b.priority-a.priority).map((plugin) => {
                if (plugin.enabled && plugin.executed) return ansis.green("✅ ["+plugin.name+"] "+plugin.details.shortDescription)
                else if (plugin.enabled && plugin.crashed) return ansis.red("❌ ["+plugin.name+"] "+plugin.details.shortDescription)
                else return ansis.gray("💤 ["+plugin.name+"] "+plugin.details.shortDescription)
            })
            const renderedUnknownPlugins = unknownCrashedPlugins.map((plugin) => ansis.red("❌ ["+plugin.name+"] "+plugin.description))
            return [...renderedPlugins,...renderedUnknownPlugins].join("\n")
        },false)
        this.plugins = plugins
        this.unknownCrashedPlugins = unknownCrashedPlugins
    }
}

/**## ODStartScreenLiveStatusCategoryComponent `class`
 * This is an Open Ticket startscreen livestatus category component.
 * 
 * This component will render a livestatus category to the startscreen. This will list the livestatus messages in the category.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenLiveStatusCategoryComponent extends ODStartScreenCategoryComponent {
    /**A reference to the Open Ticket livestatus manager. */
    livestatus: ODLiveStatusManager

    constructor(id:ODValidId, priority:number, livestatus:ODLiveStatusManager){
        super(id,priority,"livestatus",async () => {
            const messages = await this.livestatus.getAllMessages()
            return this.livestatus.renderer.render(messages)
        },false)
        this.livestatus = livestatus
    }
}

/**## ODStartScreenLogsCategoryComponent `class`
 * This is an Open Ticket startscreen logs category component.
 * 
 * This component will render a logs category to the startscreen. This will only render the logs category name.
 * An optional priority can be specified to choose the location of the component.
 */
export class ODStartScreenLogCategoryComponent extends ODStartScreenCategoryComponent {
    constructor(id:ODValidId, priority:number){
        super(id,priority,"logs",() => "",true)
    }
}