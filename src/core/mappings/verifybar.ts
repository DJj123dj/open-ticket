///////////////////////////////////////
//OPEN TICKET VERIFYBAR MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODVerifyBarManagerIdMappings `interface`
 * A list of all available IDs in the default `ODVerifyBarManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODVerifyBarManagerIdMappings extends api.ODVerifyBarManagerIdConstraint {
    "opendiscord:close-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:close-ticket">,
    "opendiscord:reopen-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:reopen-ticket">,
    "opendiscord:delete-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason"|"accept-without-transcript", "opendiscord:delete-ticket">,
    "opendiscord:claim-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:claim-ticket">,
    "opendiscord:unclaim-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:unclaim-ticket">,
    "opendiscord:pin-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:pin-ticket">,
    "opendiscord:unpin-ticket":api.ODVerifyBar<"accept"|"cancel"|"accept-with-reason", "opendiscord:unpin-ticket">,
}

/**## ODVerifyButtonId `enum`
 * Frequently used button ids in Open Ticket verify bars.
 */
export enum ODVerifyButtonId {
    Cancel = "cancel",
    Accept = "accept",
    AcceptWithReason = "accept-with-reason",
    AcceptWithoutTranscript = "accept-without-transcript"
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedVerifyBarManager `class
 * A special class with types for the Open Ticket `ODVerifyBarManager` class.
 */
export class ODMappedVerifyBarManager extends api.ODVerifyBarManager<ODVerifyBarManagerIdMappings> {}