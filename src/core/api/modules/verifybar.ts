///////////////////////////////////////
//VERIFYBAR MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODValidId } from "./base"
import { ODMessage } from "./builder"
import { ODDebugger } from "./console"
import { ODButtonResponderInstance } from "./responder"
import * as discord from "discord.js"
import { ODWorkerManager } from "./worker"

export type ODVerifyBarCallback = (responder:ODButtonResponderInstance,customData?:string) => void|Promise<void>

export class ODVerifyBar extends ODManagerData {
    success: ODWorkerManager<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null}>
    failure: ODWorkerManager<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null}>
    message: ODMessage<"verifybar",{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,verifybar:ODVerifyBar,originalMessage:discord.Message<boolean>}>
    enabled: boolean

    constructor(id:ODValidId, message:ODMessage<"verifybar",{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User,originalMessage:discord.Message<boolean>}>, enabled?:boolean){
        super(id)
        this.success = new ODWorkerManager("descending")
        this.failure = new ODWorkerManager("descending")
        this.message = message
        this.enabled = enabled ?? true
    }

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

export class ODVerifyBarManager extends ODManager<ODVerifyBar> {
    constructor(debug:ODDebugger){
        super(debug,"verifybar")
    }
}