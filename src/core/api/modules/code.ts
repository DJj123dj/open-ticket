///////////////////////////////////////
//CODE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger } from "./console"


/**## ODCode `class`
 * This is an open ticket code runner.
 * 
 * It is just a function that will run just before the bot has started completely! 
 * This can be used for code that needs to run at startup, but isn't really time dependent.
 * 
 * - It has an `id` for identification of the function
 * - A `priority` to know when to execute this function (related to others)
 */
export class ODCode extends ODManagerData {
    /**The priority of this code */
    priority: number
    /**The main function of this code */
    func: () => void|Promise<void>

    constructor(id:ODValidId, priority:number, func:() => void|Promise<void>){
        super(id)
        this.priority = priority
        this.func = func
    }
}

/**## ODCodeManager `class`
 * This is an open ticket code manager.
 * 
 * It manages & executes `ODCode`'s in the correct order.
 * 
 * You will probably register a function/code in this class for something that doesn't really need to be timed.
 */
export class ODCodeManager extends ODManager<ODCode> {
    constructor(debug:ODDebugger){
        super(debug,"code")
    }
    
    /**Execute all functions or code. */
    async execute(){
        const derefArray = [...this.getAll()]
        const workers = derefArray.sort((a,b) => b.priority-a.priority)
        
        for (const worker of workers){
            try {
                await worker.func()
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }
    }
}