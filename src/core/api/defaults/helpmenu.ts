///////////////////////////////////////
//DEFAULT HELP MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODHelpMenuCategory, ODHelpMenuCommandComponent, ODHelpMenuComponent, ODHelpMenuManager } from "../modules/helpmenu"

/**## ODHelpMenuManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODHelpMenuManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerIds_Default {
    "openticket:general":ODHelpMenuCategory_DefaultGeneral,
    "openticket:ticket-basic":ODHelpMenuCategory_DefaultTicketBasic,
    "openticket:ticket-advanced":ODHelpMenuCategory_DefaultTicketAdvanced,
    "openticket:ticket-user":ODHelpMenuCategory_DefaultTicketUser,
    "openticket:admin":ODHelpMenuCategory_DefaultAdmin,
    "openticket:advanced":ODHelpMenuCategory_DefaultAdvanced,
    "openticket:extra":ODHelpMenuCategory_DefaultExtra
}

/**## ODHelpMenuManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.helpmenu`!
 */
export class ODHelpMenuManager_Default extends ODHelpMenuManager {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerIds_Default>(id:HelpMenuCategoryId): ODHelpMenuManagerIds_Default[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuCategory|null
    
    get(id:ODValidId): ODHelpMenuCategory|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerIds_Default>(id:HelpMenuCategoryId): ODHelpMenuManagerIds_Default[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuCategory|null
    
    remove(id:ODValidId): ODHelpMenuCategory|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultGeneral `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultGeneral` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultGeneral {
    "openticket:help":ODHelpMenuCommandComponent,
    "openticket:ticket":ODHelpMenuCommandComponent|null
}

/**## ODHelpMenuCategory_DefaultGeneral `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:general` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultGeneral extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultGeneral>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultGeneral[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultGeneral>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultGeneral[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultGeneral): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketBasic `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketBasic` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketBasic {
    "openticket:close":ODHelpMenuCommandComponent,
    "openticket:delete":ODHelpMenuCommandComponent,
    "openticket:reopen":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketBasic `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketBasic extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketBasic[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketBasic[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketBasic): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketAdvanced` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced {
    "openticket:pin":ODHelpMenuCommandComponent,
    "openticket:unpin":ODHelpMenuCommandComponent,
    "openticket:move":ODHelpMenuCommandComponent,
    "openticket:rename":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketAdvanced extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketAdvanced): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultTicketUser `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultTicketUser` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultTicketUser {
    "openticket:claim":ODHelpMenuCommandComponent,
    "openticket:unclaim":ODHelpMenuCommandComponent,
    "openticket:add":ODHelpMenuCommandComponent,
    "openticket:remove":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketUser `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:ticket` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultTicketUser extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketUser[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultTicketUser[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultTicketUser): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultAdmin `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultAdmin` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultAdmin {
    "openticket:panel":ODHelpMenuCommandComponent,
    "openticket:blacklist-view":ODHelpMenuCommandComponent,
    "openticket:blacklist-add":ODHelpMenuCommandComponent,
    "openticket:blacklist-remove":ODHelpMenuCommandComponent,
    "openticket:blacklist-get":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultAdmin `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:admin` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultAdmin extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdmin>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdmin[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdmin>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdmin[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultAdmin): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultAdvanced `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultAdvanced` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultAdvanced {
    "openticket:stats-global":ODHelpMenuCommandComponent,
    "openticket:stats-reset":ODHelpMenuCommandComponent,
    "openticket:stats-ticket":ODHelpMenuCommandComponent,
    "openticket:stats-user":ODHelpMenuCommandComponent,
    "openticket:autoclose-disable":ODHelpMenuCommandComponent,
    "openticket:autoclose-enable":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:advanced` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultAdvanced extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdvanced[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultAdvanced[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultAdvanced): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODHelpMenuManagerCategoryIds_DefaultExtra `type`
 * This interface is a list of ids available in the `ODHelpMenuCategory_DefaultExtra` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODHelpMenuManagerCategoryIds_DefaultExtra {}

/**## ODHelpMenuCategory_DefaultExtra `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `openticket:general` category in `opendiscord.helpmenu`!
 */
export class ODHelpMenuCategory_DefaultExtra extends ODHelpMenuCategory {
    get<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultExtra>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultExtra[HelpMenuCategoryId]
    get(id:ODValidId): ODHelpMenuComponent|null
    
    get(id:ODValidId): ODHelpMenuComponent|null {
        return super.get(id)
    }

    remove<HelpMenuCategoryId extends keyof ODHelpMenuManagerCategoryIds_DefaultExtra>(id:HelpMenuCategoryId): ODHelpMenuManagerCategoryIds_DefaultExtra[HelpMenuCategoryId]
    remove(id:ODValidId): ODHelpMenuComponent|null
    
    remove(id:ODValidId): ODHelpMenuComponent|null {
        return super.remove(id)
    }

    exists(id:keyof ODHelpMenuManagerCategoryIds_DefaultExtra): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}