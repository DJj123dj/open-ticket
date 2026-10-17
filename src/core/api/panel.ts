///////////////////////////////////////
//OPENTICKET PANEL MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODPanelsJsonConfig_PanelEmbedSettings } from "../mappings/config.js"


/**## ODPanelIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODPanel` class.
 */
export type ODPanelIdConstraint = Record<string, ODPanelData<api.ODValidJsonType>>

/**## ODPanelIdMappings `interface`
 * A list of all available IDs in the default `ODPanel` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPanelIdMappings extends ODPanelIdConstraint {
    "opendiscord:name":ODPanelData<string>,
    "opendiscord:options":ODPanelData<string[]>,
    "opendiscord:dropdown":ODPanelData<boolean>,

    "opendiscord:text":ODPanelData<string>,
    "opendiscord:embed":ODPanelData<ODPanelsJsonConfig_PanelEmbedSettings>,

    "opendiscord:dropdown-placeholder":ODPanelData<string>,
    "opendiscord:maximum-buttons-per-row":ODPanelData<number>,

    "opendiscord:enable-max-tickets-warning-text":ODPanelData<boolean>,
    "opendiscord:enable-max-tickets-warning-embed":ODPanelData<boolean>,

    "opendiscord:describe-options-layout":ODPanelData<"simple"|"normal"|"detailed">,
    "opendiscord:describe-options-custom-title":ODPanelData<string>,
    "opendiscord:describe-options-in-text":ODPanelData<boolean>,
    "opendiscord:describe-options-in-embed-fields":ODPanelData<boolean>,
    "opendiscord:describe-options-in-embed-description":ODPanelData<boolean>
}

/**## ODPanelManager `class`
 * This is an Open Ticket panel manager.
 *
 * This class manages all registered panels in the bot. Only panels which are available in this manager can be auto-updated.
 *
 * Panels are not stored in the database and will be parsed from the config every startup.
 */
export class ODPanelManager extends api.ODManager<ODPanel> {
    constructor(debug:api.ODDebugger) {
        super(debug, "option")
    }

    add(data:ODPanel, overwrite?:boolean): boolean {
        data.useDebug(this.debug, "option data")
        return super.add(data, overwrite)
    }
}

/**## ODPanelDataJson `interface`
 * The JSON representatation from a single panel property.
 */
export interface ODPanelDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:api.ODValidJsonType
}

/**## ODPanelDataJson `interface`
 * The JSON representatation from a single panel.
 */
export interface ODPanelJson {
    /**The id of this panel. */
    id:string,
    /**The version of Open Ticket used to create this panel. */
    version:string,
    /**The full list of properties/variables related to this panel. */
    data:ODPanelDataJson[]
}

/**## ODPanel `class`
 * This is an Open Ticket panel.
 *
 * This class contains all data related to this panel (parsed from the config).
 */
export class ODPanel extends api.ODManager<ODPanelData<api.ODValidJsonType>> {
    /**The id of this panel. (from the config) */
    id:api.ODId

    constructor(id:api.ODValidId, data:ODPanelData<api.ODValidJsonType>[]) {
        super()
        this.id = new api.ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**Convert this panel to a JSON object for storing this panel in the database. */
    toJson(version:api.ODVersion): ODPanelJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })

        return {
            id:this.id.toString(),
            version:version.toString(),
            data
        }
    }

    /**Create a panel from a JSON object in the database. */
    static fromJson(json:ODPanelJson): ODPanel {
        return new ODPanel(json.id, json.data.map((data) => new ODPanelData(data.id, data.value)))
    }

    get<PanelId extends keyof api.ODNoGeneric<ODPanelIdMappings>>(id:PanelId): ODPanelIdMappings[PanelId]
    get(id:api.ODValidId): ODPanelData<api.ODValidJsonType>|null

    get(id:api.ODValidId): ODPanelData<api.ODValidJsonType>|null {
        return super.get(id)
    }

    remove<PanelId extends keyof api.ODNoGeneric<ODPanelIdMappings>>(id:PanelId): ODPanelIdMappings[PanelId]
    remove(id:api.ODValidId): ODPanelData<api.ODValidJsonType>|null

    remove(id:api.ODValidId): ODPanelData<api.ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<ODPanelIdMappings>): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODPanelData `class`
 * This is Open Ticket panel data.
 *
 * This class contains a single property for a panel. (string, number, boolean, object, array, null)
 *
 * When this property is edited, the database will be updated automatically.
 */
export class ODPanelData<DataType extends api.ODValidJsonType>extends api.ODManagerData {
    /**The value of this property. */
    private rawValue:DataType

    constructor(id:api.ODValidId, value:DataType) {
        super(id)
        this.rawValue = value
    }

    /**The value of this property. */
    set value(value:DataType) {
        this.rawValue = value
        this._change()
    }

    get value(): DataType {
        return this.rawValue
    }

    /**Refresh the database. Is only required to be used when updating `ODPanelData` with an object/array as value. */
    refreshDatabase() {
        this._change()
    }
}