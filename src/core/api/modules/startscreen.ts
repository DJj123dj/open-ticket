///////////////////////////////////////
//STARTSCREEN MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger, ODError, ODLiveStatusManager } from "./console"
import { ODFlag } from "./flag"
import { ODPlugin, ODUnknownCrashedPlugin } from "./plugin"
import ansis from "ansis"

export type ODStartScreenComponentRenderCallback = (location:number) => string|Promise<string>

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

export class ODStartScreenComponent extends ODManagerData {
    priority: number
    renderBefore: ODStartScreenComponentRenderCallback|null = null
    render: ODStartScreenComponentRenderCallback
    renderAfter: ODStartScreenComponentRenderCallback|null = null

    constructor(id:ODValidId, priority:number, render:ODStartScreenComponentRenderCallback){
        super(id)
        this.priority = priority
        this.render = render
    }

    async renderAll(location:number){
        const textBefore = (this.renderBefore) ? await this.renderBefore(location) : ""
        const text = await this.render(location)
        const textAfter = (this.renderAfter) ? await this.renderAfter(location) : ""
        return (textBefore ? textBefore+"\n" : "")+text+(textAfter ? "\n"+textAfter : "")
    }
}

export interface ODStartScreenProperty {
    key:string,
    value:string
}

export class ODStartScreenLogoComponent extends ODStartScreenComponent {
    logo: string[]
    topPadding: boolean
    bottomPadding: boolean
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

export interface ODStartScreenHeaderAlignmentSettings {
    align:"center"|"left"|"right",
    width:number|ODStartScreenComponent
}

export class ODStartScreenHeaderComponent extends ODStartScreenComponent {
    properties: ODStartScreenProperty[]
    spacer: string
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

export class ODStartScreenCategoryComponent extends ODStartScreenComponent {
    name: string
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

export class ODStartScreenPropertiesCategoryComponent extends ODStartScreenCategoryComponent {
    properties: ODStartScreenProperty[]
    propertyHexColor: string

    constructor(id:ODValidId, priority:number, name:string, properties:ODStartScreenProperty[], propertyHexColor?:string, renderIfEmpty?:boolean){
        super(id,priority,name,() => {
            return this.properties.map((prop) => ansis.hex(this.propertyHexColor)(prop.key+": ")+prop.value).join("\n")
        },renderIfEmpty)

        this.properties = properties
        this.propertyHexColor = propertyHexColor ?? "#f8ba00"
    }
}

export class ODStartScreenFlagsCategoryComponent extends ODStartScreenCategoryComponent {
    flags: ODFlag[]

    constructor(id:ODValidId, priority:number, flags:ODFlag[]){
        super(id,priority,"flags",() => {
            return this.flags.filter((flag) => (flag.value == true)).map((flag) => ansis.blue("["+flag.name+"] "+flag.description)).join("\n")
        },false)
        this.flags = flags
    }
}

export class ODStartScreenPluginsCategoryComponent extends ODStartScreenCategoryComponent {
    plugins: ODPlugin[]
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

export class ODStartScreenLiveStatusCategoryComponent extends ODStartScreenCategoryComponent {
    livestatus: ODLiveStatusManager

    constructor(id:ODValidId, priority:number, livestatus:ODLiveStatusManager){
        super(id,priority,"livestatus",async () => {
            const messages = await this.livestatus.getAllMessages()
            return this.livestatus.renderer.render(messages)
        },false)
        this.livestatus = livestatus
    }
}

export class ODStartScreenLogCategoryComponent extends ODStartScreenCategoryComponent {
    constructor(id:ODValidId, priority:number){
        super(id,priority,"logs",() => "",true)
    }
}