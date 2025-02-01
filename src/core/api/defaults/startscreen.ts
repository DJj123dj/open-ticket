///////////////////////////////////////
//DEFAULT STARTSCREEN MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODStartScreenCategoryComponent, ODStartScreenComponent, ODStartScreenFlagsCategoryComponent, ODStartScreenHeaderComponent, ODStartScreenLiveStatusCategoryComponent, ODStartScreenLogoComponent, ODStartScreenManager, ODStartScreenPluginsCategoryComponent, ODStartScreenPropertiesCategoryComponent } from "../modules/startscreen"

/**## ODStartScreenManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODStartScreenManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODStartScreenManagerIds_Default {
    "opendiscord:logo":ODStartScreenLogoComponent,
    "opendiscord:header":ODStartScreenHeaderComponent,
    "opendiscord:flags":ODStartScreenFlagsCategoryComponent,
    "opendiscord:plugins":ODStartScreenPluginsCategoryComponent,
    "opendiscord:stats":ODStartScreenPropertiesCategoryComponent,
    "opendiscord:livestatus":ODStartScreenLiveStatusCategoryComponent,
    "opendiscord:logs":ODStartScreenCategoryComponent
}

/**## ODStartScreenManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODStartScreenManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.startscreen`!
 */
export class ODStartScreenManager_Default extends ODStartScreenManager {
    get<StartScreenId extends keyof ODStartScreenManagerIds_Default>(id:StartScreenId): ODStartScreenManagerIds_Default[StartScreenId]
    get(id:ODValidId): ODStartScreenComponent|null
    
    get(id:ODValidId): ODStartScreenComponent|null {
        return super.get(id)
    }

    remove<StartScreenId extends keyof ODStartScreenManagerIds_Default>(id:StartScreenId): ODStartScreenManagerIds_Default[StartScreenId]
    remove(id:ODValidId): ODStartScreenComponent|null
    
    remove(id:ODValidId): ODStartScreenComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODStartScreenManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}