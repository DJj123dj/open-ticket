///////////////////////////////////////
//CODE MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger } from "./console"


/**## ODCode `class`
 * This is an Open Ticket code runner.
 * 
 * Using this, you're able to execute a function just before the startup screen. (90% of the code is already loaded)
 * You can also specify a priority to change the execution order.
 * In Open Ticket, this is used for the following processes:
 * - Autoclose/delete
 * - Database syncronisation (with tickets, stats & used options)
 * - Panel auto-update
 * - Database Garbage Collection (removing tickets that don't exist anymore)
 * - And more!
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
 * This is an Open Ticket code manager.
 * 
 * It manages & executes `ODCode`'s in the correct order.
 * 
 * Use this to register a function/code which executes just before the startup screen. (90% is already loaded)
 */
export class ODCodeManager extends ODManager<ODCode> {
    constructor(debug:ODDebugger){
        super(debug,"code")
    }
    
    /**Execute all `ODCode` functions in order of their priority (high to low). */
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