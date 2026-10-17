///////////////////////////////////////
//OPEN TICKET PROGRESS BAR MAPPINGS
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"

/**## ODProgressBarManagerIdMappings `interface`
 * A list of all available IDs in the default `ODProgressBarManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarManagerIdMappings extends api.ODProgressBarManagerIdConstraint {
    "opendiscord:slash-command-remove":api.ODManualProgressBar,
    "opendiscord:slash-command-create":api.ODManualProgressBar,
    "opendiscord:slash-command-update":api.ODManualProgressBar,
    "opendiscord:context-menu-remove":api.ODManualProgressBar,
    "opendiscord:context-menu-create":api.ODManualProgressBar,
    "opendiscord:context-menu-update":api.ODManualProgressBar,
}

/**## ODProgressBarRendererManagerIdMappings `interface`
 * A list of all available IDs in the default `ODProgressBarRendererManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarRendererManagerIdMappings extends api.ODProgressBarRendererManagerIdConstraint {
    "opendiscord:value-renderer":api.ODDefaultProgressBarRenderer,
    "opendiscord:fraction-renderer":api.ODDefaultProgressBarRenderer,
    "opendiscord:percentage-renderer":api.ODDefaultProgressBarRenderer,
    "opendiscord:time-ms-renderer":api.ODDefaultProgressBarRenderer,
    "opendiscord:time-sec-renderer":api.ODDefaultProgressBarRenderer,
    "opendiscord:time-min-renderer":api.ODDefaultProgressBarRenderer,
}

/////////////////////////////
////// MAPPED MANAGERS //////
/////////////////////////////

/**## ODMappedProgressBarManager `class
 * A special class with types for the Open Ticket `ODProgressBarManager` class.
 */
export class ODMappedProgressBarManager extends api.ODProgressBarManager<ODProgressBarManagerIdMappings, ODProgressBarRendererManagerIdMappings> {}

/**## ODMappedProgressBarRendererManager `class
 * A special class with types for the Open Ticket `ODProgressBarRendererManager` class.
 */
export class ODMappedProgressBarRendererManager extends api.ODProgressBarRendererManager<ODProgressBarRendererManagerIdMappings> {}