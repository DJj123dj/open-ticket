///////////////////////////////////////
//SESSION MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODDebugger } from "./console"
import * as crypto from "crypto"

/**## ODSessionManager `class`
 * This is an Open Ticket session manager.
 * 
 * It contains all sessions in Open Ticket. Sessions are a sort of temporary storage which will be cleared when the bot stops.
 * Data in sessions have a randomly generated key which will always be unique.
 * 
 * Visit the `ODSession` class for more info
 */
export class ODSessionManager extends ODManager<ODSession> {
    constructor(debug:ODDebugger){
        super(debug,"session")
    }
}

/**## ODSessionInstance `interface`
 * This interface represents a single session instance. It contains an id, data & some dates.
 */
export interface ODSessionInstance {
    /**The id of this session instance. */
    id:string,
    /**The creation date of this session instance. */
    creation:number,
    /**The custom amount of minutes before this session expires. */
    timeout:number|null,
    /**This is the data from this session instance */
    data:any
}

/**## ODSessionTimeoutCallback `type`
 * This is the callback used for session timeout listeners.
 */
export type ODSessionTimeoutCallback = (id:string, timeout:"default"|"custom", data:any, creation:Date) => void

/**## ODSession `class`
 * This is an Open Ticket session.
 * 
 * It can be used to create 100% unique id's for usage in the bot. An id can also store additional data which isn't saved to the filesystem.
 * You can almost compare it to the PHP session system.
 */
export class ODSession extends ODManagerData {
    /**The history of previously generated instance ids. Used to reduce the risk of generating the same id twice. */
    #idHistory: string[] = []
    /**The max length of the instance id history. */
    #maxIdHistoryLength: number = 500
    /**An array of all the currently active session instances. */
    sessions: ODSessionInstance[] = []
    /**The default amount of minutes before a session automatically stops. */
    timeoutMinutes: number = 30
    /**The id of the auto-timeout session checker interval */
    #intervalId: NodeJS.Timeout
    /**Listeners for when a session times-out. */
    #timeoutListeners: ODSessionTimeoutCallback[] = []

    constructor(id:ODValidId, intervalSeconds?:number){
        super(id)

        //create the auto-timeout session checker
        this.#intervalId = setInterval(() => {
            const deletableSessions: {instance:ODSessionInstance,reason:"default"|"custom"}[] = []
            
            //collect all deletable sessions
            this.sessions.forEach((session) => {
                if (session.timeout && (new Date().getTime() - session.creation) > session.timeout*60000){
                    //stop session => custom timeout
                    deletableSessions.push({instance:session,reason:"custom"})
                }else if (!session.timeout && (new Date().getTime() - session.creation) > this.timeoutMinutes*60000){
                    //stop session => default timeout
                    deletableSessions.push({instance:session,reason:"default"})
                }
            })

            //permanently delete sessions
            deletableSessions.forEach((session) => {
                const index = this.sessions.findIndex((s) => s.id === session.instance.id)
                this.sessions.splice(index,1)

                //emit timeout listeners
                this.#timeoutListeners.forEach((cb) => cb(session.instance.id,session.reason,session.instance.data,new Date(session.instance.creation)))
            })

        },((intervalSeconds) ? (intervalSeconds * 1000) : 60000))
    }

    /**Create a unique hex id of 8 characters and add it to the instance id history */
    #createUniqueId(): string {
        const hex = crypto.randomBytes(4).toString("hex")
        if (this.#idHistory.includes(hex)){
            return this.#createUniqueId()
        }else{
            this.#idHistory.push(hex)
            if (this.#idHistory.length > this.#maxIdHistoryLength) this.#idHistory.shift()
            return hex
        }
    }
    /**Stop the global interval that automatically deletes timed-out sessions. (This action can't be reverted!) */
    stopAutoTimeout(){
        clearInterval(this.#intervalId)
    }

    /**Start a session instance with data. Returns the unique id required to access the session. */
    start(data?:any): string {
        const id = this.#createUniqueId()
        this.sessions.push({
            id,data,
            creation:new Date().getTime(),
            timeout:null
        })
        return id
    }
    /**Get the data of a session instance. Returns `null` when not found. */
    data(id:string): any|null {
        const session = this.sessions.find((session) => session.id === id)
        if (!session) return null
        return session.data
    }
    /**Stop & delete a session instance. Returns `true` when sucessful. */
    stop(id:string): boolean {
        const index = this.sessions.findIndex((session) => session.id === id)
        if (index < 0) return false
        this.sessions.splice(index,1)
        return true
    }
    /**Update the data of a session instance. Returns `true` when sucessful. */
    update(id:string, data:any): boolean {
        const session = this.sessions.find((session) => session.id === id)
        if (!session) return false
        session.data = data
        return true
    }
    /**Change the global or session timeout minutes. Returns `true` when sucessful. */
    setTimeout(min:number, id?:string): boolean {
        if (!id){
            //change global timeout minutes
            this.timeoutMinutes = min
            return true
        }else{
            //change session instance timeout minutes
            const session = this.sessions.find((session) => session.id === id)
            if (!session) return false
            session.timeout = min
            return true
        }
    }
    /**Listen for a session timeout (default or custom) */
    onTimeout(callback:ODSessionTimeoutCallback){
        this.#timeoutListeners.push(callback)
    }
}