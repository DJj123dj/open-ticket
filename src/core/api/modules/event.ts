///////////////////////////////////////
//EVENT MODULE
///////////////////////////////////////
import { ODManagerData, ODManager, ODValidId } from "./base"
import { ODConsoleWarningMessage, ODDebugger } from "./console"

/**## ODEvent `class`
 * This is an Open Ticket event.
 * 
 * This class is made to work with the `ODEventManager` to handle events.
 * The function of this specific class is to manage all listeners for a specifc event!
 */
export class ODEvent extends ODManagerData {
    /**Alias to Open Ticket debugger. */
    #debug?: ODDebugger
    /**The list of permanent listeners. */
    listeners: Function[] = []
    /**The list of one-time listeners. List is cleared every time the event is emitted. */
    oncelisteners: Function[] = []
    /**The max listener limit before a possible memory leak will be announced */
    listenerLimit: number = 25

    /**Use the Open Ticket debugger in this manager for logs*/
    useDebug(debug:ODDebugger|null){
        this.#debug = debug ?? undefined
    }
    /**Get a collection of listeners combined from both types. Also clears the one-time listeners array! */
    #getCurrentListeners(){
        const final: Function[] = []
        this.oncelisteners.forEach((l) => final.push(l))
        this.listeners.forEach((l) => final.push(l))

        this.oncelisteners = []
        return final
    }
    /**Edit the listener limit */
    setListenerLimit(limit:number){
        this.listenerLimit = limit
    }
    /**Add a permanent callback to this event. This will stay as long as the bot is running! */
    listen(callback:Function){
        this.listeners.push(callback)

        if (this.listeners.length > this.listenerLimit){
            if (this.#debug) this.#debug.console.log(new ODConsoleWarningMessage("Possible event memory leak detected!",[
                {key:"event",value:this.id.value},
                {key:"listeners",value:this.listeners.length.toString()}
            ]))
        }
    }
    /**Add a one-time-only callback to this event. This will only trigger the callback once! */
    listenOnce(callback:Function){
        this.oncelisteners.push(callback)
    }
    /**Wait until this event is fired! Be carefull with it, because it could block the entire bot when wrongly used! */
    async wait(): Promise<any[]> {
        return new Promise((resolve,reject) => {
            this.oncelisteners.push((...args:any) => {resolve(args)})
        })
    }
    /**Emit this event to all listeners. You are required to provide all parameters of the event! */
    async emit(params:any[]): Promise<void> {
        for (const listener of this.#getCurrentListeners()){
            try{
                await listener(...params)
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }
    }
}

/**## ODEventManager `class`
 * This is an Open Ticket event manager.
 * 
 * This class is made to manage all events in the bot. You can compare it with the built-in node.js `EventEmitter`
 * 
 * It's not recommended to create this class yourself. Plugin events should be registered in their `plugin.json` file instead.
 * All events are available in the `opendiscord.events` global!
 */
export class ODEventManager extends ODManager<ODEvent> {
    /**Reference to the Open Ticket debugger */
    #debug: ODDebugger

    constructor(debug:ODDebugger){
        super(debug,"event")
        this.#debug = debug
    }

    add(data:ODEvent, overwrite?:boolean): boolean {
        data.useDebug(this.#debug)
        return super.add(data,overwrite)
    }
    remove(id:ODValidId): ODEvent|null {
        const data = super.remove(id)
        if (data) data.useDebug(null)
        return data
    }
}