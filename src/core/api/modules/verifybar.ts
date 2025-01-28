///////////////////////////////////////
//VERIFYBAR MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODMessage } from "./builder"
import { ODDebugger } from "./console"
import { ODButtonResponderInstance } from "./responder"
import * as discord from "discord.js"
import { ODWorkerManager } from "./worker"

/**## ODVerifyBar `class`
 * This is an Open Ticket verifybar.
 * 
 * It is contains 2 sets of workers and a lot of utilities for the (✅ ❌) verifybars in the bot.
 * 
 * It doesn't contain the code which activates or spawns the verifybars!
 */
export class ODVerifyBar extends ODManagerData {
    /**All workers that will run when the verifybar is accepted. */
    success: ODWorkerManager<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null}>
    /**All workers that will run when the verifybar is stopped. */
    failure: ODWorkerManager<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null}>
    /**The message that will be built wen activating this verifybar. */
    message: ODMessage<"verifybar",{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>}>
    /**When disabled, it will skip the verifybar and instantly fire the `success` workers. */
    enabled: boolean

    constructor(id:ODValidId, message:ODMessage<"verifybar",{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalMessage:discord.Message<boolean>}>, enabled?:boolean){
        super(id)
        this.success = new ODWorkerManager("descending")
        this.failure = new ODWorkerManager("descending")
        this.message = message
        this.enabled = enabled ?? true
    }

    /**Build the message and reply to a button with this verifybar. */
    async activate(responder:ODButtonResponderInstance){
        if (this.enabled){
            //show verifybar
            const {guild,channel,user,message} = responder
            await responder.update(await this.message.build("verifybar",{guild,channel,user,verifybar:this,originalMessage:message}))
        }else{
            //instant success
            if (this.success) await this.success.executeWorkers(responder,"verifybar",{data:null,verifybarMessage:null})
        }
    }
}

/**## ODVerifyBarManager `class`
 * This is an Open Ticket verifybar manager.
 * 
 * It contains all (✅ ❌) verifybars in the bot.
 * The `ODVerifyBar` classes contain `ODWorkerManager`'s that will be fired when the continue/stop buttons are pressed.
 * 
 * It doesn't contain the code which activates the verifybars! This should be implemented by your own.
 */
export class ODVerifyBarManager extends ODManager<ODVerifyBar> {
    constructor(debug:ODDebugger){
        super(debug,"verifybar")
    }
}