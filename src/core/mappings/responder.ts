///////////////////////////////////////
//OPEN TICKET RESPONDER MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODCommandResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODCommandResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODCommandResponderManagerIdMappings extends api.ODCommandResponderManagerIdConstraint {
    "opendiscord:help":{origin:"slash"|"text", params:{}, workers:"opendiscord:help"|"opendiscord:logs"},
    "opendiscord:stats":{origin:"slash"|"text", params:{}, workers:"opendiscord:stats"|"opendiscord:logs"},
    "opendiscord:panel":{origin:"slash"|"text", params:{}, workers:"opendiscord:panel"|"opendiscord:logs"},
    "opendiscord:ticket":{origin:"slash"|"text", params:{}, workers:"opendiscord:ticket"|"opendiscord:logs"},
    "opendiscord:blacklist":{origin:"slash"|"text", params:{}, workers:"opendiscord:blacklist"|"opendiscord:discord-logs"|"opendiscord:logs"},

    "opendiscord:close":{origin:"slash"|"text", params:{}, workers:"opendiscord:close"|"opendiscord:logs"},
    "opendiscord:reopen":{origin:"slash"|"text", params:{}, workers:"opendiscord:reopen"|"opendiscord:logs"},
    "opendiscord:delete":{origin:"slash"|"text", params:{}, workers:"opendiscord:delete"|"opendiscord:logs"},
    "opendiscord:claim":{origin:"slash"|"text", params:{}, workers:"opendiscord:claim"|"opendiscord:logs"},
    "opendiscord:unclaim":{origin:"slash"|"text", params:{}, workers:"opendiscord:unclaim"|"opendiscord:logs"},
    "opendiscord:pin":{origin:"slash"|"text", params:{}, workers:"opendiscord:pin"|"opendiscord:logs"},
    "opendiscord:unpin":{origin:"slash"|"text", params:{}, workers:"opendiscord:unpin"|"opendiscord:logs"},

    "opendiscord:rename":{origin:"slash"|"text", params:{}, workers:"opendiscord:rename"|"opendiscord:logs"},
    "opendiscord:move":{origin:"slash"|"text", params:{}, workers:"opendiscord:move"|"opendiscord:logs"},
    "opendiscord:add":{origin:"slash"|"text", params:{}, workers:"opendiscord:add"|"opendiscord:logs"},
    "opendiscord:remove":{origin:"slash"|"text", params:{}, workers:"opendiscord:remove"|"opendiscord:logs"},
    "opendiscord:clear":{origin:"slash"|"text", params:{}, workers:"opendiscord:clear"|"opendiscord:logs"},
    "opendiscord:topic":{origin:"slash"|"text", params:{}, workers:"opendiscord:topic"|"opendiscord:logs"},
    "opendiscord:priority":{origin:"slash"|"text", params:{}, workers:"opendiscord:priority"|"opendiscord:logs"},
    "opendiscord:transfer":{origin:"slash"|"text", params:{}, workers:"opendiscord:transfer"|"opendiscord:logs"},
    "opendiscord:transcripts":{origin:"slash"|"text", params:{}, workers:"opendiscord:transcripts"|"opendiscord:logs"},

    "opendiscord:autoclose":{origin:"slash"|"text", params:{}, workers:"opendiscord:autoclose"|"opendiscord:logs"},
    "opendiscord:autodelete":{origin:"slash"|"text", params:{}, workers:"opendiscord:autodelete"|"opendiscord:logs"},
}

/**## ODButtonResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODButtonResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODButtonResponderManagerIdMappings extends api.ODButtonResponderManagerIdConstraint {
    "opendiscord:verifybar-button":{origin:"button", params:{}, workers:"opendiscord:verifybar-button"},

    "opendiscord:help-menu-switch":{origin:"button", params:{}, workers:"opendiscord:update-help-menu"},
    "opendiscord:help-menu-previous":{origin:"button", params:{}, workers:"opendiscord:update-help-menu"},
    "opendiscord:help-menu-next":{origin:"button", params:{}, workers:"opendiscord:update-help-menu"},

    "opendiscord:ticket-option":{origin:"button", params:{}, workers:"opendiscord:ticket-option"},
    "opendiscord:role-option":{origin:"button", params:{}, workers:"opendiscord:role-option"},
    "opendiscord:subpanel-option":{origin:"button", params:{}, workers:"opendiscord:subpanel-option"},

    "opendiscord:claim-ticket":{origin:"button", params:{}, workers:"opendiscord:claim-ticket"},
    "opendiscord:unclaim-ticket":{origin:"button", params:{}, workers:"opendiscord:unclaim-ticket"},
    "opendiscord:pin-ticket":{origin:"button", params:{}, workers:"opendiscord:pin-ticket"},
    "opendiscord:unpin-ticket":{origin:"button", params:{}, workers:"opendiscord:unpin-ticket"},
    "opendiscord:close-ticket":{origin:"button", params:{}, workers:"opendiscord:close-ticket"},
    "opendiscord:reopen-ticket":{origin:"button", params:{}, workers:"opendiscord:reopen-ticket"},
    "opendiscord:delete-ticket":{origin:"button", params:{}, workers:"opendiscord:delete-ticket"},

    "opendiscord:transcript-error-retry":{origin:"button", params:{}, workers:"opendiscord:delete-ticket"|"opendiscord:logs"},
    "opendiscord:transcript-error-continue":{origin:"button", params:{}, workers:"opendiscord:delete-ticket"|"opendiscord:logs"},
    "opendiscord:clear-continue":{origin:"button", params:{}, workers:"opendiscord:clear-continue"},
}

/**## ODDropdownResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODDropdownResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODDropdownResponderManagerIdMappings extends api.ODDropdownResponderManagerIdConstraint {
    "opendiscord:panel-dropdown":{origin:"dropdown", params:{}, workers:"opendiscord:dropdown-ticket"|"opendiscord:dropdown-role"|"opendiscord:dropdown-subpanel"},
    "opendiscord:priority-dropdown":{origin:"dropdown", params:{}, workers:"opendiscord:priority-dropdown"},
}

/**## ODModalResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODModalResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODModalResponderManagerIdMappings extends api.ODModalResponderManagerIdConstraint {
    "opendiscord:ticket-questions":{origin:"modal", params:{}, workers:"opendiscord:ticket-questions"},
    "opendiscord:close-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:close-ticket-reason"},
    "opendiscord:reopen-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:reopen-ticket-reason"},
    "opendiscord:delete-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:delete-ticket-reason"},
    "opendiscord:claim-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:claim-ticket-reason"},
    "opendiscord:unclaim-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:unclaim-ticket-reason"},
    "opendiscord:pin-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:pin-ticket-reason"},
    "opendiscord:unpin-ticket-reason":{origin:"modal", params:{}, workers:"opendiscord:unpin-ticket-reason"},
}

/**## ODContextMenuResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODContextMenuResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODContextMenuResponderManagerIdMappings extends api.ODContextMenuResponderManagerIdConstraint {
    //"opendiscord:example":{origin:"context-menu",params:{},workers:"opendiscord:example"},
}

/**## ODAutocompleteResponderManagerIdMappings `interface`
 * A list of all available IDs in the default `ODAutocompleteResponderManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODAutocompleteResponderManagerIdMappings extends api.ODAutocompleteResponderManagerIdConstraint {
    "opendiscord:panel-id":{origin:"autocomplete", params:{}, workers:"opendiscord:panel-id"},
    "opendiscord:option-id":{origin:"autocomplete", params:{}, workers:"opendiscord:option-id"}
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedCommandResponderManager `class
 * A special class with types for the Open Ticket `ODCommandResponderManager` class.
 */
export class ODMappedCommandResponderManager extends api.ODCommandResponderManager<ODCommandResponderManagerIdMappings> {}

/**## ODMappedButtonResponderManager `class
 * A special class with types for the Open Ticket `ODButtonResponderManager` class.
 */
export class ODMappedButtonResponderManager extends api.ODButtonResponderManager<ODButtonResponderManagerIdMappings> {}

/**## ODMappedDropdownResponderManager `class
 * A special class with types for the Open Ticket `ODDropdownResponderManager` class.
 */
export class ODMappedDropdownResponderManager extends api.ODDropdownResponderManager<ODDropdownResponderManagerIdMappings> {}

/**## ODMappedModalResponderManager `class
 * A special class with types for the Open Ticket `ODModalResponderManager` class.
 */
export class ODMappedModalResponderManager extends api.ODModalResponderManager<ODModalResponderManagerIdMappings> {}

/**## ODMappedContextMenuResponderManager `class
 * A special class with types for the Open Ticket `ODContextMenuResponderManager` class.
 */
export class ODMappedContextMenuResponderManager extends api.ODContextMenuResponderManager<ODContextMenuResponderManagerIdMappings> {}

/**## ODMappedAutocompleteResponderManager `class
 * A special class with types for the Open Ticket `ODAutocompleteResponderManager` class.
 */
export class ODMappedAutocompleteResponderManager extends api.ODAutocompleteResponderManager<ODAutocompleteResponderManagerIdMappings> {}

/**## ODMappedResponderManager `class
 * A special class with types for the Open Ticket `ODResponderManager` class.
 */
export class ODMappedResponderManager extends api.ODResponderManager<ODCommandResponderManagerIdMappings, ODButtonResponderManagerIdMappings, ODDropdownResponderManagerIdMappings, ODModalResponderManagerIdMappings, ODContextMenuResponderManagerIdMappings, ODAutocompleteResponderManagerIdMappings> {}