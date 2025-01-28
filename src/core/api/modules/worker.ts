///////////////////////////////////////
//WORKER MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"

/**## ODWorkerCallback `type`
 * This is the callback used in `ODWorker`!
 */
export type ODWorkerCallback<Instance, Source extends string, Params> = (instance:Instance, params:Params, source:Source, cancel:() => void) => void|Promise<void>

/**## ODWorker `class`
 * This is an Open Ticket worker.
 * 
 * You can compare it with a normal javascript callback, but slightly more advanced!
 * 
 * - It has an `id` for identification of the function
 * - A `priority` to know when to execute this callback (related to others)
 * - It knows who called this callback (`source`)
 * - And much more!
 */
export class ODWorker<Instance, Source extends string, Params> extends ODManagerData {
    /**The priority of this worker */
    priority: number
    /**The main callback of this worker */
    callback: ODWorkerCallback<Instance,Source,Params>

    constructor(id:ODValidId, priority:number, callback:ODWorkerCallback<Instance,Source,Params>){
        super(id)
        this.priority = priority
        this.callback = callback
    }
}

/**## ODWorker `class`
 * This is an Open Ticket worker manager.
 * 
 * It manages & executes `ODWorker`'s in the correct order.
 * 
 * You can register a custom worker in this class to create a message or button.
 */
export class ODWorkerManager<Instance, Source extends string, Params> extends ODManager<ODWorker<Instance,Source,Params>> {
    /**The order of execution for workers inside this manager. */
    #priorityOrder: "ascending"|"descending"
    /**The backup worker will be executed when one of the workers fails or cancels execution. */
    backupWorker: ODWorker<{reason:"error"|"cancel"},Source,Params>|null = null
    
    constructor(priorityOrder:"ascending"|"descending"){
        super()
        this.#priorityOrder = priorityOrder
    }
    
    /**Get all workers in sorted order. */
    getSortedWorkers(priority:"ascending"|"descending"){
        const derefArray = [...this.getAll()]

        return derefArray.sort((a,b) => {
            if (priority == "ascending") return a.priority-b.priority
            else return b.priority-a.priority
        })
    }
    /**Execute all workers on an instance using the given source & parameters. */
    async executeWorkers(instance:Instance, source:Source, params:Params){
        const derefParams = {...params}
        const workers = this.getSortedWorkers(this.#priorityOrder)
        let didCancel = false
        let didCrash = false
        
        for (const worker of workers){
            if (didCancel) break
            try {
                await worker.callback(instance,derefParams,source,() => {
                    didCancel = true
                })
            }catch(err){
                process.emit("uncaughtException",err)
                didCrash = true
            }
        }
        if (didCancel && this.backupWorker){
            try{
                await this.backupWorker.callback({reason:"cancel"},derefParams,source,() => {})
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }else if (didCrash && this.backupWorker){
            try{
                await this.backupWorker.callback({reason:"error"},derefParams,source,() => {})
            }catch(err){
                process.emit("uncaughtException",err)
            }
        }
    }
}