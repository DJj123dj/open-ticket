///////////////////////////////////////
//OPENTICKET PANEL MODULE
///////////////////////////////////////
import { ODJsonConfig_DefaultPanelEmbedSettingsType } from "../defaults/config"
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODValidButtonColor, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"

export class ODPanelManager extends ODManager<ODPanel> {
    #debug: ODDebugger

    constructor(debug:ODDebugger){
        super(debug,"option")
        this.#debug = debug
    }
    
    add(data:ODPanel, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"option data")
        return super.add(data,overwrite)
    }
}

export interface ODPanelDataJson {
    id:string,
    value:ODValidJsonType
}

export interface ODPanelJson {
    id:string,
    version:string,
    data:ODPanelDataJson[]
}

/**## ODPanelIds `type`
 * This interface is a list of ids available in the `ODPanel` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODPanelIds {
    "openticket:name":ODPanelData<string>,
    "openticket:options":ODPanelData<string[]>,
    "openticket:dropdown":ODPanelData<boolean>,

    "openticket:text":ODPanelData<string>,
    "openticket:embed":ODPanelData<ODJsonConfig_DefaultPanelEmbedSettingsType>,

    "openticket:dropdown-placeholder":ODPanelData<string>,
    
    "openticket:enable-max-tickets-warning-text":ODPanelData<boolean>,
    "openticket:enable-max-tickets-warning-embed":ODPanelData<boolean>,
    
    "openticket:describe-options-layout":ODPanelData<"simple"|"normal"|"detailed">,
    "openticket:describe-options-custom-title":ODPanelData<string>,
    "openticket:describe-options-in-text":ODPanelData<boolean>,
    "openticket:describe-options-in-embed-fields":ODPanelData<boolean>,
    "openticket:describe-options-in-embed-description":ODPanelData<boolean>
}

export class ODPanel extends ODManager<ODPanelData<ODValidJsonType>> {
    id:ODId

    constructor(id:ODValidId, data:ODPanelData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        data.forEach((data) => {
            this.add(data)
        })
    }

    toJson(version:ODVersion): ODPanelJson {
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

    static fromJson(json:ODPanelJson): ODPanel {
        return new ODPanel(json.id,json.data.map((data) => new ODPanelData(data.id,data.value)))
    }

    get<PanelId extends keyof ODPanelIds>(id:PanelId): ODPanelIds[PanelId]
    get(id:ODValidId): ODPanelData<ODValidJsonType>|null
    
    get(id:ODValidId): ODPanelData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<PanelId extends keyof ODPanelIds>(id:PanelId): ODPanelIds[PanelId]
    remove(id:ODValidId): ODPanelData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODPanelData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODPanelIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

export class ODPanelData<DataType extends ODValidJsonType> extends ODManagerData {
    #value: DataType

    constructor(id:ODValidId, value:DataType){
        super(id)
        this.#value = value
    }

    set value(value:DataType){
        this.#value = value
        this._change()
    }
    get value(): DataType {
        return this.#value
    }
    /**Refresh the database. Is only required to be used when updating `ODPanelData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}