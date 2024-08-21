///////////////////////////////////////
//OPENTICKET BLACKLIST MODULE
///////////////////////////////////////
import { ODManager, ODManagerData, ODValidId } from "../modules/base"
import { ODDebugger } from "../modules/console"

export class ODBlacklist extends ODManagerData {
    #reason: string|null

    constructor(id:ODValidId,reason:string|null){
        super(id)
        this.#reason = reason
    }

    set reason(reason:string|null) {
        this.#reason = reason
        this._change()
    }
    get reason(){
        return this.#reason
    }
}

export class ODBlacklistManager extends ODManager<ODBlacklist> {
    constructor(debug:ODDebugger){
        super(debug,"blacklist")
    }
}