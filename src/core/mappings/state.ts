///////////////////////////////////////
//OPEN TICKET STATE MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"
import { ODTicketClearFilter } from "../api/ticket.js"

/**## ODStateManagerIdMappings `interface`
 * A list of all available IDs in the default `ODStateManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStateManagerIdMappings extends api.ODStateManagerIdConstraint {
    "opendiscord:interactive-message":ODInteractiveMessageState,
    "opendiscord:clear-message":ODClearMessageState,
    "opendiscord:panel-message":ODPanelMessageState,
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedStateManager `class
 * A special class with types for the Open Ticket `ODStateManager` class.
 */
export class ODMappedStateManager extends api.ODStateManager<ODStateManagerIdMappings> {}

/**## ODInteractiveMessageState `class
 * A special class with state types for interactive Open Ticket message.
 */
export class ODInteractiveMessageState extends api.ODState<{
    /**The method this message was generated with. */
    messageOrigin:"slash"|"text"|"button"|"dropdown"|"modal"|"other",
    /**The type of message. Used when editing messages. */
    messageType:"ticket-message"|"close-message"|"reopen-message"|"autoclose-message"|"claim-message"|"unclaim-message"|"pin-message"|"unpin-message",
    /**A reason this interactive message was generated. */
    messageReason?:string|null,
    /**The original author of this interactive message. */
    messageAuthor?:string,
    /**Additional data of this interactive message. */
    messageExtraData?:any,
}, false, false> {
    constructor(id:api.ODValidId, client:api.ODClientManager, database:api.ODDatabase) {
        super(id, client, database, {})
    }
}

/**## ODClearMessageState `class
 * A special class with state types for the Open Ticket clear tickets message.
 */
export class ODClearMessageState extends api.ODState<{
    /**The method this message was generated with. */
    messageOrigin:"slash"|"text"|"other",
    /**The clear filters. */
    clearFilter:ODTicketClearFilter,
    /**The list of ticket channel names (e.g. `#ticket-1`) to be cleared. */
    clearChannelNameList:string[]
}, false, true> {
    constructor(id:api.ODValidId, client:api.ODClientManager, database:api.ODDatabase) {
        super(id, client, database, {
            autodeleteOnRestart:true
        })
    }
}

/**## ODPanelMessageState `class
 * A special class with state types for the Open Ticket panel message.
 */
export class ODPanelMessageState extends api.ODState<{
    /**The method this message was generated with. */
    messageOrigin:"slash"|"text"|"sub-panel"|"auto-update"|"other",
    /**The Id of the panel associated with this message. */
    panelId:string,
    /**A list of options available in this panel. (buttons or dropdown) */
    panelOptionIds:string[]
    /**Should this panel be auto-updated on restart? */
    panelAutoUpdate:boolean,
    /**Is this panel a sub-panel? */
    isSubPanel:boolean
}, false, false> {
    constructor(id:api.ODValidId, client:api.ODClientManager, database:api.ODDatabase) {
        super(id, client, database, {})
    }
}