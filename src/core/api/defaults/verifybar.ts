///////////////////////////////////////
//DEFAULT VERIFYBAR MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODButtonResponderInstance } from "../modules/responder"
import { ODWorkerManager_Default } from "../defaults/worker"
import { ODVerifyBarManager, ODVerifyBar } from "../modules/verifybar"
import * as discord from "discord.js"

/**## ODVerifyBarManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODVerifyBarManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVerifyBarManagerIds_Default {
    "opendiscord:claim-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:claim-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:claim-ticket-unclaim-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:claim-ticket",failureWorkerIds:"opendiscord:back-to-unclaim-message"},
    "opendiscord:unclaim-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:unclaim-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:unclaim-ticket-claim-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:unclaim-ticket",failureWorkerIds:"opendiscord:back-to-claim-message"},
    "opendiscord:pin-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:pin-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:pin-ticket-unpin-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:pin-ticket",failureWorkerIds:"opendiscord:back-to-unpin-message"},
    "opendiscord:unpin-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:unpin-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:unpin-ticket-pin-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:unpin-ticket",failureWorkerIds:"opendiscord:back-to-pin-message"},
    "opendiscord:close-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:close-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:close-ticket-reopen-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:close-ticket",failureWorkerIds:"opendiscord:back-to-reopen-message"},
    "opendiscord:reopen-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:reopen-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"},
    "opendiscord:reopen-ticket-close-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:reopen-ticket",failureWorkerIds:"opendiscord:back-to-close-message"},
    "opendiscord:reopen-ticket-autoclose-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:reopen-ticket",failureWorkerIds:"opendiscord:back-to-autoclose-message"},
    "opendiscord:delete-ticket-ticket-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:delete-ticket",failureWorkerIds:"opendiscord:back-to-ticket-message"}
    "opendiscord:delete-ticket-close-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:delete-ticket",failureWorkerIds:"opendiscord:back-to-close-message"}
    "opendiscord:delete-ticket-reopen-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:delete-ticket",failureWorkerIds:"opendiscord:back-to-reopen-message"}
    "opendiscord:delete-ticket-autoclose-message":{successWorkerIds:"opendiscord:permissions"|"opendiscord:delete-ticket",failureWorkerIds:"opendiscord:back-to-autoclose-message"}
}

/**## ODVerifyBarManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODVerifyBarManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.verifybars`!
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