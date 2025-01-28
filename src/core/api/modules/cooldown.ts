///////////////////////////////////////
//COOLDOWN MODULE
///////////////////////////////////////
import { ODId, ODValidId, ODManager, ODSystemError, ODManagerData } from "./base"
import { ODDebugger } from "./console"

/**## ODCooldownManager `class`
 * This is an Open Ticket cooldown manager.
 * 
 * It is responsible for managing all cooldowns in Open Ticket. An example of this is the ticket creation cooldown.
 * 
 * There are many types of cooldowns available, but you can also create your own!
 */
export class ODCooldownManager extends ODManager<ODCooldown<object>> {
    constructor(debug:ODDebugger){
        super(debug,"cooldown")
    }
    /**Initiate all cooldowns in this manager. */
    async init(){
        for (const cooldown of this.getAll()){
            await cooldown.init()
        }
    }
}

/**## ODCooldownData `class`
 * This is Open Ticket cooldown data.
 * 
 * It contains the instance of an active cooldown (e.g. for a user). It is handled by the cooldown itself.
 */
export class ODCooldownData<Data extends object> extends ODManagerData {
    /**Is this cooldown active? */
    active: boolean
    /**Additional data of this cooldown instance. (different for each cooldown type) */
    data: Data

    constructor(id:ODValidId,active:boolean,data:Data){
        super(id)
        this.active = active
        this.data = data
    }
}

/**## ODCooldown `class`
 * This is an Open Ticket cooldown.
 * 
 * It doesn't do anything on it's own, but it provides the methods that are used to interact with a cooldown.
 * This class can be extended from to create a working cooldown.
 * 
 * There are also premade cooldowns available in the bot!
 */
export class ODCooldown<Data extends object> extends ODManagerData {
    data: ODManager<ODCooldownData<Data>> = new ODManager()
    /**Is this cooldown already initialized? */
    ready: boolean = false

    constructor(id:ODValidId){
        super(id)
    }

    /**Check this id and start cooldown when it exeeds the limit! Returns `true` when on cooldown! */
    use(id:string): boolean {
        throw new ODSystemError("Tried to use an unimplemented ODCooldown!")
    }
    /**Check this id without starting or updating the cooldown. Returns `true` when on cooldown! */
    check(id:string): boolean {
        throw new ODSystemError("Tried to use an unimplemented ODCooldown!")
    }
    /**Remove the cooldown for an id when available.*/
    delete(id:string){
        throw new ODSystemError("Tried to use an unimplemented ODCooldown!")
    }
    /**Initialize the internal systems of this cooldown. */
    async init(){
        throw new ODSystemError("Tried to use an unimplemented ODCooldown!")
    }
}

/**## ODCounterCooldown `class`
 * This is an Open Ticket counter cooldown.
 * 
 * It is is a cooldown based on a counter. When the number exceeds the limit, the cooldown is activated.
 * The number will automatically be decreased with a set amount & interval.
 */
export class ODCounterCooldown extends ODCooldown<{value:number}> {
    /**The cooldown will activate when exceeding this limit. */
    activeLimit: number
    /**The cooldown will deactivate when below this limit. */
    cancelLimit: number
    /**The amount to increase the counter with everytime the cooldown is triggered/updated. */
    increment: number
    /**The amount to decrease the counter over time. */
    decrement: number
    /**The interval between decrements in milliseconds. */
    invervalMs: number

    constructor(id:ODValidId, activeLimit:number, cancelLimit:number, increment:number, decrement:number, intervalMs:number){
        super(id)
        this.activeLimit = activeLimit
        this.cancelLimit = cancelLimit
        this.increment = increment
        this.decrement = decrement
        this.invervalMs = intervalMs
    }

    use(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            if (cooldown.active){
                return true

            }else if (cooldown.data.value < this.activeLimit){
                cooldown.data.value = cooldown.data.value + this.increment
                return false

            }else{
                cooldown.active = true
                return false
            }
        }else{
            //cooldown for this id doesn't exist
            this.data.add(new ODCooldownData(id,(this.increment >= this.activeLimit),{
                value:this.increment
            }))
            return false
        }
    }
    check(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            return cooldown.active
        }else return false
    }
    delete(id:string): void {
        this.data.remove(id)
    }
    async init(){
        if (this.ready) return
        setInterval(async () => {
            await this.data.loopAll((cooldown) => {
                cooldown.data.value = cooldown.data.value - this.decrement
                if (cooldown.data.value <= this.cancelLimit){
                    cooldown.active = false
                }
                if (cooldown.data.value <= 0){
                    this.data.remove(cooldown.id)
                }
            })
        },this.invervalMs)
        this.ready = true
    }
}

/**## ODIncrementalCounterCooldown `class`
 * This is an Open Ticket incremental counter cooldown.
 * 
 * It is is a cooldown based on an incremental counter. It is exactly the same as the normal counter,
 * with the only difference being that it still increments when the limit is already exeeded.
 */
export class ODIncrementalCounterCooldown extends ODCooldown<{value:number}> {
    /**The cooldown will activate when exceeding this limit. */
    activeLimit: number
    /**The cooldown will deactivate when below this limit. */
    cancelLimit: number
    /**The amount to increase the counter with everytime the cooldown is triggered/updated. */
    increment: number
    /**The amount to decrease the counter over time. */
    decrement: number
    /**The interval between decrements in milliseconds. */
    invervalMs: number

    constructor(id:ODValidId, activeLimit:number, cancelLimit:number, increment:number, decrement:number, intervalMs:number){
        super(id)
        this.activeLimit = activeLimit
        this.cancelLimit = cancelLimit
        this.increment = increment
        this.decrement = decrement
        this.invervalMs = intervalMs
    }

    use(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            if (cooldown.active){
                cooldown.data.value = cooldown.data.value + this.increment
                return true

            }else if (cooldown.data.value < this.activeLimit){
                cooldown.data.value = cooldown.data.value + this.increment
                return false

            }else{
                cooldown.active = true
                return false
            }
        }else{
            //cooldown for this id doesn't exist
            this.data.add(new ODCooldownData(id,(this.increment >= this.activeLimit),{
                value:this.increment
            }))
            return false
        }
    }
    check(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            return cooldown.active
        }else return false
    }
    delete(id:string): void {
        this.data.remove(id)
    }
    async init(){
        if (this.ready) return
        setInterval(async () => {
            await this.data.loopAll((cooldown) => {
                cooldown.data.value = cooldown.data.value - this.decrement
                if (cooldown.data.value <= this.cancelLimit){
                    cooldown.active = false
                }
                if (cooldown.data.value <= 0){
                    this.data.remove(cooldown.id)
                }
            })
        },this.invervalMs)
        this.ready = true
    }
}

/**## ODTimeoutCooldown `class`
 * This is an Open Ticket timeout cooldown.
 * 
 * It is a cooldown based on a timer. When triggered/updated, the cooldown is activated for the set amount of time.
 * After the timer has timed out, the cooldown will be deleted.
 */
export class ODTimeoutCooldown extends ODCooldown<{date:number}> {
    /**The amount of milliseconds before the cooldown times-out */
    timeoutMs: number

    constructor(id:ODValidId, timeoutMs:number){
        super(id)
        this.timeoutMs = timeoutMs
    }

    use(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            if ((new Date().getTime() - cooldown.data.date) > this.timeoutMs){
                this.data.remove(id)
                return false
            }else{
                return true
            }
        }else{
            //cooldown for this id doesn't exist
            this.data.add(new ODCooldownData(id,true,{
                date:new Date().getTime()
            }))
            return false
        }
    }
    check(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            return true
        }else return false
    }
    delete(id:string): void {
        this.data.remove(id)
    }
    /**Get the remaining amount of milliseconds before the timeout stops. */
    remaining(id:string): number|null {
        const cooldown = this.data.get(id)
        if (!cooldown) return null
        const rawResult = this.timeoutMs - (new Date().getTime() - cooldown.data.date)
        return (rawResult > 0) ? rawResult : 0
    }
    async init(){
        if (this.ready) return
        this.ready = true
    }
}

/**## ODIncrementalTimeoutCooldown `class`
 * This is an Open Ticket incremental timeout cooldown.
 * 
 * It is is a cooldown based on an incremental timer. It is exactly the same as the normal timer,
 * with the only difference being that it adds additional time when triggered/updated while the cooldown is already active.
 */
export class ODIncrementalTimeoutCooldown extends ODCooldown<{date:number}> {
    /**The amount of milliseconds before the cooldown times-out */
    timeoutMs: number
    /**The amount of milliseconds to add when triggered/updated while the cooldown is already active. */
    incrementMs: number

    constructor(id:ODValidId, timeoutMs:number, incrementMs:number){
        super(id)
        this.timeoutMs = timeoutMs
        this.incrementMs = incrementMs
    }

    use(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            if ((new Date().getTime() - cooldown.data.date) > this.timeoutMs){
                this.data.remove(id)
                return false
            }else{
                cooldown.data.date = cooldown.data.date + this.incrementMs
                return true
            }
        }else{
            //cooldown for this id doesn't exist
            this.data.add(new ODCooldownData(id,true,{
                date:new Date().getTime()
            }))
            return false
        }
    }
    check(id:string): boolean {
        const cooldown = this.data.get(id)
        if (cooldown){
            //cooldown for this id already exists
            return true
        }else return false
    }
    delete(id:string): void {
        this.data.remove(id)
    }
    /**Get the remaining amount of milliseconds before the timeout stops. */
    remaining(id:string): number|null {
        const cooldown = this.data.get(id)
        if (!cooldown) return null
        const rawResult = this.timeoutMs - (new Date().getTime() - cooldown.data.date)
        return (rawResult > 0) ? rawResult : 0
    }
    async init(){
        if (this.ready) return
        this.ready = true
    }
}