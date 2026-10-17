///////////////////////////////////////
//OPEN TICKET COMPONENT MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import * as discord from "discord.js"
import { ODTicketOption } from "../api/option.js"
import { ODTicket } from "../api/ticket.js"

/**## ODSharedComponentManagerIdMappings `interface`
 * A list of all available IDs in the default `ODSharedComponentManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSharedComponentManagerIdMappings extends api.ODSharedComponentManagerIdConstraint {
    //"opendiscord:example-component":{component:api.ODComponent<object,any>,origin:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:example-component"},
}

/**## ODMessageComponentManagerIdMappings `interface`
 * A list of all available IDs in the default `ODMessageComponentManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODMessageComponentManagerIdMappings extends api.ODComponentManagerIdConstraint {
    //"opendiscord:example-message":{origin:"slash"|"text"|"other",params:{guild:discord.Guild|null,channel:discord.TextBasedChannel,user:discord.User},workers:"opendiscord:example-message"},
}

/**## ODModalComponentManagerIdMappings `interface`
 * A list of all available IDs in the default `ODModalComponentManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODModalComponentManagerIdMappings extends api.ODComponentManagerIdConstraint {
    "opendiscord:ticket-questions":{origin:"panel-button"|"panel-dropdown"|"slash"|"text"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, option:ODTicketOption}, workers:"opendiscord:ticket-questions"},
    "opendiscord:close-ticket-reason":{origin:"ticket-message"|"reopen-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:close-ticket-reason"}
    "opendiscord:reopen-ticket-reason":{origin:"ticket-message"|"close-message"|"autoclose-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:reopen-ticket-reason"}
    "opendiscord:delete-ticket-reason":{origin:"ticket-message"|"reopen-message"|"close-message"|"autoclose-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:delete-ticket-reason"}
    "opendiscord:claim-ticket-reason":{origin:"ticket-message"|"unclaim-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:claim-ticket-reason"}
    "opendiscord:unclaim-ticket-reason":{origin:"ticket-message"|"claim-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:unclaim-ticket-reason"}
    "opendiscord:pin-ticket-reason":{origin:"ticket-message"|"unpin-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:pin-ticket-reason"}
    "opendiscord:unpin-ticket-reason":{origin:"ticket-message"|"pin-message"|"other", params:{guild:discord.Guild, channel:discord.TextBasedChannel, user:discord.User, ticket:ODTicket, message:discord.Message}, workers:"opendiscord:unpin-ticket-reason"}
}

/**## ODComponentModifierManagerIdMappings `interface`
 * A list of all available IDs in the default `ODComponentModifierManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODComponentModifierManagerIdMappings extends api.ODComponentModifierManagerIdConstraint {
    "opendiscord:close-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"reopen-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:reopen-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"close-message"|"autoclose-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:delete-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"close-message"|"autoclose-message"|"reopen-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:claim-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"unclaim-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:unclaim-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"claim-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:pin-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"unpin-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
    "opendiscord:unpin-ticket-verifybar":api.ODMessageComponentModifier<"ticket-message"|"pin-message", {guild:discord.Guild|null, channel:discord.TextBasedChannel, user:discord.User, verifybar:api.ODVerifyBar<string>}, string>,
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedSharedComponentManager `class
 * A special class with types for the Open Ticket `ODSharedComponentManager` class.
 */
export class ODMappedSharedComponentManager extends api.ODSharedComponentManager<ODSharedComponentManagerIdMappings> {}

/**## ODMappedMessageComponentManager `class
 * A special class with types for the Open Ticket `ODMessageComponentManager` class.
 */
export class ODMappedMessageComponentManager extends api.ODMessageComponentManager<ODMessageComponentManagerIdMappings> {}

/**## ODMappedModalComponentManager `class
 * A special class with types for the Open Ticket `ODModalComponentManager` class.
 */
export class ODMappedModalComponentManager extends api.ODModalComponentManager<ODModalComponentManagerIdMappings> {}

/**## ODMappedComponentModifierManager `class
 * A special class with types for the Open Ticket `ODComponentModifierManager` class.
 */
export class ODMappedComponentModifierManager extends api.ODComponentModifierManager<ODComponentModifierManagerIdMappings> {}

/**## ODMappedComponentManager `class
 * A special class with types for the Open Ticket `ODBuilderManager` class.
 */
export class ODMappedComponentManager extends api.ODComponentManager<ODSharedComponentManagerIdMappings, ODMessageComponentManagerIdMappings, ODModalComponentManagerIdMappings, ODComponentModifierManagerIdMappings> {}