///////////////////////////////////////
//PROGRESS BAR MODULE
///////////////////////////////////////
import { ODSystemError, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger } from "./console"
import readline from "readline"

/**## ODProgressBarRendererManager `class`
 * This is an Open Ticket progress bar renderer manager.
 * 
 * It is responsible for managing all console progress bar renderers in Open Ticket.
 * 
 * A renderer is a function which will try to visualize the progress bar in the console.
 */
export class ODProgressBarRendererManager extends ODManager<ODProgressBarRenderer<{}>> {
    constructor(debug:ODDebugger){
        super(debug,"progress bar renderer")
    }
}

/**## ODProgressBarManager `class`
 * This is an Open Ticket progress bar manager.
 * 
 * It is responsible for managing all console progress bars in Open Ticket. An example of this is the slash command registration progress bar.
 * 
 * There are many types of progress bars available, but you can also create your own!
 */
export class ODProgressBarManager extends ODManager<ODProgressBar> {
    renderers: ODProgressBarRendererManager

    constructor(debug:ODDebugger){
        super(debug,"progress bar")
        this.renderers = new ODProgressBarRendererManager(debug)
    }
}

/**## ODProgressBarRenderFunc `type`
 * This is the render function for an Open Ticket console progress bar.
 */
export type ODProgressBarRenderFunc<Settings extends {}> = (settings:Settings,min:number,max:number,value:number,prefix:string|null,suffix:string|null) => string

/**## ODProgressBarRenderer `class`
 * This is an Open Ticket console progress bar renderer.
 * 
 * It is used to render a progress bar in the console of the bot.
 * 
 * There are already a lot of default options available if you just want an easy progress bar!
 */
export class ODProgressBarRenderer<Settings extends {}> extends ODManagerData {
    settings: Settings
    #render: ODProgressBarRenderFunc<Settings>

    constructor(id:ODValidId,render:ODProgressBarRenderFunc<Settings>,settings:Settings){
        super(id)
        this.#render = render
        this.settings = settings
    }

    /**Render a progress bar using this renderer. */
    render(min:number,max:number,value:number,prefix:string|null,suffix:string|null){
        try {
            return this.#render(this.settings,min,max,value,prefix,suffix)
        }catch(err){
            process.emit("uncaughtException",err)
            return "<PROGRESS-BAR-ERROR>"
        }
    }

    withAdditionalSettings(settings:Partial<Settings>): ODProgressBarRenderer<Settings> {
        const newSettings: Settings = {...this.settings}
        for (const key of Object.keys(settings)){
            if (typeof settings[key] != "undefined") newSettings[key] = settings[key]
        }
        return new ODProgressBarRenderer(this.id,this.#render,newSettings)
    }
}

/**## ODProgressBar `class`
 * This is an Open Ticket console progress bar.
 * 
 * It is used to create a simple or advanced progress bar in the console of the bot.
 * These progress bars are not visible in the `otdebug.txt` file and should only be used as extra visuals.
 * 
 * Use other classes as existing templates or create your own progress bar from scratch using this class.
 */
export class ODProgressBar extends ODManagerData {
    /**The renderer of this progress bar. */
    renderer: ODProgressBarRenderer<{}>
    /**Is this progress bar currently active? */
    #active: boolean = false
    /**A list of listeners when the progress bar stops. */
    #stopListeners: Function[] = []
    /**The current value of the progress bar. */
    protected value: number
    /**The minimum value of the progress bar. */
    min: number
    /**The maximum value of the progress bar. */
    max: number
    /**The initial value of the progress bar. */
    initialValue: number
    /**The prefix displayed in the progress bar. */
    prefix:string|null
    /**The prefix displayed in the progress bar. */
    suffix:string|null
    
    /**Enable automatic stopping when reaching `min` or `max`. */
    autoStop: null|"min"|"max"

    constructor(id:ODValidId,renderer:ODProgressBarRenderer<{}>,min:number,max:number,value:number,autoStop:null|"min"|"max",prefix:string|null,suffix:string|null){
        super(id)
        this.renderer = renderer
        this.min = min
        this.max = max
        this.initialValue = this.#parseValue(value)
        this.value = this.#parseValue(value)
        this.autoStop = autoStop
        this.prefix = prefix
        this.suffix = suffix
    }
    /**Parse a value in such a way that it doesn't go below/above the min/max limits. */
    #parseValue(value:number){
        if (value > this.max) return this.max
        else if (value < this.min) return this.min
        else return value
    }
    /**Render progress bar to the console. */
    #renderStdout(){
        if (!this.#active) return
        readline.clearLine(process.stdout,0)
        readline.cursorTo(process.stdout,0)
        process.stdout.write(this.renderer.render(this.min,this.max,this.value,this.prefix,this.suffix))
    }
    /**Start showing this progress bar in the console. */
    start(): boolean {
        if (this.#active) return false
        this.value = this.#parseValue(this.initialValue)
        this.#active = true
        this.#renderStdout() 
        return true
    }
    /**Update this progress bar while active. (will automatically update the progress bar in the console) */
    protected update(value:number,stop?:boolean): boolean {
        if (!this.#active) return false
        this.value = this.#parseValue(value)
        this.#renderStdout()
        if (stop || (this.autoStop == "max" && this.value  == this.max) || (this.autoStop == "min" && this.value  == this.min)){
            process.stdout.write("\n")
            this.#active = false
            this.#stopListeners.forEach((cb) => cb())
            this.#stopListeners = []
        }
        return true
    }
    /**Wait for the progress bar to finish. */
    finished(): Promise<void> {
        return new Promise((resolve) => {
            this.#stopListeners.push(resolve)
        })
    }
}

/**## ODTimedProgressBar `class`
 * This is an Open Ticket timed console progress bar.
 * 
 * It is used to create a simple timed progress bar in the console.
 * You can set a fixed duration (milliseconds) in the constructor.
 */
export class ODTimedProgressBar extends ODProgressBar {
    /**The time in milliseconds. */
    time: number
    /**The mode of the timer. */
    mode: "increasing"|"decreasing"

    constructor(id:ODValidId,renderer:ODProgressBarRenderer<{}>,time:number,mode:"increasing"|"decreasing",prefix:string|null,suffix:string|null){
        super(id,renderer,0,time,0,(mode == "increasing") ? "max" : "min",prefix,suffix)
        this.time = time
        this.mode = mode
    }

    /**The timer which is used. */
    async #timer(ms:number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            },ms)
        })
    }
    /**Run the timed progress bar. */
    async #execute(){
        let i = 0
        const fragment = this.time/100
        while (i < 100){
            await this.#timer(fragment)
            i++
            super.update((this.mode == "increasing") ? (i*fragment) : this.time-(i*fragment))
        }
    }
    start(){
        const res = super.start()
        if (!res) return false
        this.#execute()
        return true
    }
}

/**## ODManualProgressBar `class`
 * This is an Open Ticket manual console progress bar.
 * 
 * It is used to create a simple manual progress bar in the console.
 * You can update the progress manually using `update()`.
 */
export class ODManualProgressBar extends ODProgressBar {
    constructor(id:ODValidId,renderer:ODProgressBarRenderer<{}>,amount:number,autoStop:null|"min"|"max",prefix:string|null,suffix:string|null){
        super(id,renderer,0,amount,0,autoStop,prefix,suffix)
    }
    /**Set the value of the progress bar. */
    set(value:number,stop?:boolean){
        super.update(value,stop)
    }
    /**Get the current value of the progress bar. */
    get(){
        return this.value
    }
    /**Increase the value of the progress bar. */
    increase(amount:number,stop?:boolean){
        super.update(this.value+amount,stop)
    }
    /**Decrease the value of the progress bar. */
    decrease(amount:number,stop?:boolean){
        super.update(this.value-amount,stop)
    }
}