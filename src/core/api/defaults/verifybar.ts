///////////////////////////////////////
//DEFAULT VERIFYBAR MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODButtonResponderInstance } from "../modules/responder"
import { ODWorkerManager_Default } from "../defaults/worker"
import { ODVerifyBarManager, ODVerifyBar } from "../modules/verifybar"
import * as discord from "discord.js"

/**## ODVerifyBarManagerIds_Default `type`
 * This type is an array of ids available in the `ODVerifyBarManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVerifyBarManagerIds_Default {
    "openticket:claim-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:claim-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:claim-ticket-unclaim-message":{successWorkerIds:"openticket:permissions"|"openticket:claim-ticket",failureWorkerIds:"openticket:back-to-unclaim-message"},
    "openticket:unclaim-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:unclaim-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:unclaim-ticket-claim-message":{successWorkerIds:"openticket:permissions"|"openticket:unclaim-ticket",failureWorkerIds:"openticket:back-to-claim-message"},
    "openticket:pin-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:pin-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:pin-ticket-unpin-message":{successWorkerIds:"openticket:permissions"|"openticket:pin-ticket",failureWorkerIds:"openticket:back-to-unpin-message"},
    "openticket:unpin-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:unpin-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:unpin-ticket-pin-message":{successWorkerIds:"openticket:permissions"|"openticket:unpin-ticket",failureWorkerIds:"openticket:back-to-pin-message"},
    "openticket:close-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:close-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:close-ticket-reopen-message":{successWorkerIds:"openticket:permissions"|"openticket:close-ticket",failureWorkerIds:"openticket:back-to-reopen-message"},
    "openticket:reopen-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:reopen-ticket",failureWorkerIds:"openticket:back-to-ticket-message"},
    "openticket:reopen-ticket-close-message":{successWorkerIds:"openticket:permissions"|"openticket:reopen-ticket",failureWorkerIds:"openticket:back-to-close-message"},
    "openticket:reopen-ticket-autoclose-message":{successWorkerIds:"openticket:permissions"|"openticket:reopen-ticket",failureWorkerIds:"openticket:back-to-autoclose-message"},
    "openticket:delete-ticket-ticket-message":{successWorkerIds:"openticket:permissions"|"openticket:delete-ticket",failureWorkerIds:"openticket:back-to-ticket-message"}
    "openticket:delete-ticket-close-message":{successWorkerIds:"openticket:permissions"|"openticket:delete-ticket",failureWorkerIds:"openticket:back-to-close-message"}
    "openticket:delete-ticket-reopen-message":{successWorkerIds:"openticket:permissions"|"openticket:delete-ticket",failureWorkerIds:"openticket:back-to-reopen-message"}
    "openticket:delete-ticket-autoclose-message":{successWorkerIds:"openticket:permissions"|"openticket:delete-ticket",failureWorkerIds:"openticket:back-to-autoclose-message"}
}

/**## ODVerifyBarManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODVerifyBarManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.verifybars`!
 */
export class ODVerifyBarManager_Default extends ODVerifyBarManager {
    get<VerifyBarId extends keyof ODVerifyBarManagerIds_Default>(id:VerifyBarId): ODVerifyBar_Default<ODVerifyBarManagerIds_Default[VerifyBarId]["successWorkerIds"],ODVerifyBarManagerIds_Default[VerifyBarId]["failureWorkerIds"]>
    get(id:ODValidId): ODVerifyBar|null
    
    get(id:ODValidId): ODVerifyBar|null {
        return super.get(id)
    }

    remove<VerifyBarId extends keyof ODVerifyBarManagerIds_Default>(id:VerifyBarId): ODVerifyBar_Default<ODVerifyBarManagerIds_Default[VerifyBarId]["successWorkerIds"],ODVerifyBarManagerIds_Default[VerifyBarId]["failureWorkerIds"]>
    remove(id:ODValidId): ODVerifyBar|null
    
    remove(id:ODValidId): ODVerifyBar|null {
        return super.remove(id)
    }

    exists(id:keyof ODVerifyBarManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODVerifyBar_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODVerifyBar class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the default `ODVerifyBar`'s!
 */
export class ODVerifyBar_Default<SuccessWorkerIds extends string,FailureWorkerIds extends string> extends ODVerifyBar {
    declare success: ODWorkerManager_Default<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null},SuccessWorkerIds>
    declare failure: ODWorkerManager_Default<ODButtonResponderInstance,"verifybar",{data:string|null,verifybarMessage:discord.Message<boolean>|null},FailureWorkerIds>
}