///////////////////////////////////////
//DEFAULT WORKER MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODWorker, ODWorkerManager } from "../modules/worker"


/**## ODWorkerManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODWorkerManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the worker manager in actions, builders & responders!
 */
export class ODWorkerManager_Default<Instance, Source extends string, Params, WorkerIds extends string> extends ODWorkerManager<Instance,Source,Params> {
    get(id:WorkerIds): ODWorker<Instance,Source,Params>
    get(id:ODValidId): ODWorker<Instance,Source,Params>|null
    
    get(id:ODValidId): ODWorker<Instance,Source,Params>|null {
        return super.get(id)
    }

    remove(id:WorkerIds): ODWorker<Instance,Source,Params>
    remove(id:ODValidId): ODWorker<Instance,Source,Params>|null
    
    remove(id:ODValidId): ODWorker<Instance,Source,Params>|null {
        return super.remove(id)
    }

    exists(id:WorkerIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}