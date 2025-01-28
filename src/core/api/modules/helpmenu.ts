///////////////////////////////////////
//HELP MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger } from "./console"

/**## ODHelpMenuComponentRenderer `type`
 * This is the callback of the help menu component renderer. It also contains information about how & where it is rendered.
 */
export type ODHelpMenuComponentRenderer = (page:number, category:number, location:number, mode:"slash"|"text") => string|Promise<string>

/**## ODHelpMenuComponent `class`
 * This is an Open Ticket help menu component.
 * 
 * It can render something on the Open Ticket help menu.
 */
export class ODHelpMenuComponent extends ODManagerData {
    /**The priority of this component. The higher, the earlier it will appear in the help menu. */
    priority: number
    /**The render function for this component. */
    render: ODHelpMenuComponentRenderer

    constructor(id:ODValidId, priority:number, render:ODHelpMenuComponentRenderer){
        super(id)
        this.priority = priority
        this.render = render
    }
}

/**## ODHelpMenuTextComponent `class`
 * This is an Open Ticket help menu text component.
 * 
 * It can render a static piece of text on the Open Ticket help menu.
 */
export class ODHelpMenuTextComponent extends ODHelpMenuComponent {
    constructor(id:ODValidId, priority:number, text:string){
        super(id,priority,() => {
            return text
        })
    }
}

/**## ODHelpMenuCommandComponentOption `interface`
 * This interface contains a command option for the `ODHelpMenuCommandComponent`.
 */
export interface ODHelpMenuCommandComponentOption {
    /**The name of this option. */
    name:string,
    /**Is this option optional? */
    optional:boolean
}

/**## ODHelpMenuCommandComponentSettings `interface`
 * This interface contains the settings for the `ODHelpMenuCommandComponent`.
 */
export interface ODHelpMenuCommandComponentSettings {
    /**The name of this text command. */
    textName?:string,
    /**The name of this slash command. */
    slashName?:string,
    /**Options available in the text command. */
    textOptions?:ODHelpMenuCommandComponentOption[],
    /**Options available in the slash command. */
    slashOptions?:ODHelpMenuCommandComponentOption[],
    /**The description for the text command. */
    textDescription?:string,
    /**The description for the slash command. */
    slashDescription?:string
}

/**## ODHelpMenuCommandComponent `class`
 * This is an Open Ticket help menu command component.
 * 
 * It contains a useful helper to render a command in the Open Ticket help menu.
 */
export class ODHelpMenuCommandComponent extends ODHelpMenuComponent {
    constructor(id:ODValidId, priority:number, settings:ODHelpMenuCommandComponentSettings){
        super(id,priority,(page,category,location,mode) => {
            if (mode == "slash" && settings.slashName){
                return `\`${settings.slashName}${(settings.slashOptions) ? this.#renderOptions(settings.slashOptions) : ""}\` ➜ ${settings.slashDescription ?? ""}`
            
            }else if (mode == "text" && settings.textName){
                return `\`${settings.textName}${(settings.textOptions) ? this.#renderOptions(settings.textOptions) : ""}\` ➜ ${settings.textDescription ?? ""}`
            
            }else return ""
        })
    }
    
    /**Utility function to render all command options. */
    #renderOptions(options:ODHelpMenuCommandComponentOption[]){
        return " "+options.map((opt) => (opt.optional) ? `[${opt.name}]` : `<${opt.name}>`).join(" ")
    }
}

/**## ODHelpMenuCategory `class`
 * This is an Open Ticket help menu category.
 * 
 * Every category in the help menu is an embed field by default.
 * Try to limit the amount of components per category.
 */
export class ODHelpMenuCategory extends ODManager<ODHelpMenuComponent> {
    /**The id of this category. */
    id: ODId
    /**The priority of this category. The higher, the earlier it will appear in the menu. */
    priority: number
    /**The name of this category. (can include emoji's) */
    name: string
    /**When enabled, it automatically starts this category on a new page. */
    newPage: boolean

    constructor(id:ODValidId, priority:number, name:string, newPage?:boolean){
        super()
        this.id = new ODId(id)
        this.priority = priority
        this.name = name
        this.newPage = newPage ?? false
    }

    /**Render this category and it's components. */
    async render(page:number, category:number, mode:"slash"|"text"){
        //sort from high priority to low
        const derefArray = [...this.getAll()]
        derefArray.sort((a,b) => {
            return b.priority-a.priority
        })
        const result: string[] = []

        let i = 0
        for (const component of derefArray){
            try {
                result.push(await component.render(page,category,i,mode))
            }catch(err){
                process.emit("uncaughtException",err)
            }
            i++
        }

        //only return the non-empty components
        return result.filter((component) => component !== "").join("\n\n")
    }
}

/**## ODHelpMenuRenderResult `type`
 * This is the array returned when the help menu has been rendered successfully.
 * 
 * It contains a list of pages, which contain categories by name & value (content).
 */
export type ODHelpMenuRenderResult = {name:string, value:string}[][]

/**## ODHelpMenuManager `class`
 * This is an Open Ticket help menu manager.
 * 
 * It is responsible for rendering the entire help menu content.
 * You are also able to configure the amount of categories per page here.
 * 
 * Fewer Categories == More Clean Menu
 */
export class ODHelpMenuManager extends ODManager<ODHelpMenuCategory> {
    /**Alias to Open Ticket debugger. */
    #debug: ODDebugger
    /**The amount of categories per-page. */
    categoriesPerPage: number = 3
    
    constructor(debug:ODDebugger){
        super(debug,"help menu category")
        this.#debug = debug
    }

    add(data:ODHelpMenuCategory, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"help menu component")
        return super.add(data,overwrite)
    }

    /**Render this entire help menu & return a `ODHelpMenuRenderResult`. */
    async render(mode:"slash"|"text"): Promise<ODHelpMenuRenderResult> {
        //sort from high priority to low
        const derefArray = [...this.getAll()]
        derefArray.sort((a,b) => {
            return b.priority-a.priority
        })
        const result: {name:string, value:string}[][] = []
        let currentPage: {name:string, value:string}[] = []

        for (const category of derefArray){
            try {
                const renderedCategory = await category.render(result.length,currentPage.length,mode)

                if (renderedCategory !== ""){
                    //create new page when category wants to
                    if (currentPage.length > 0 && category.newPage){
                        result.push(currentPage)
                        currentPage = []
                    }

                    currentPage.push({
                        name:category.name,
                        value:renderedCategory
                    })

                    //create new page when page is full
                    if (currentPage.length >= this.categoriesPerPage){
                        result.push(currentPage)
                        currentPage = []
                    }
                }
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }

        //push current page when not-empty
        if (currentPage.length > 0) result.push(currentPage)

        return result
    }
}