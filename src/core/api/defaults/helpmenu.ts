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
    "opendiscord:general":ODHelpMenuCategory_DefaultGeneral,
    "opendiscord:ticket-basic":ODHelpMenuCategory_DefaultTicketBasic,
    "opendiscord:ticket-advanced":ODHelpMenuCategory_DefaultTicketAdvanced,
    "opendiscord:ticket-user":ODHelpMenuCategory_DefaultTicketUser,
    "opendiscord:admin":ODHelpMenuCategory_DefaultAdmin,
    "opendiscord:advanced":ODHelpMenuCategory_DefaultAdvanced,
    "opendiscord:extra":ODHelpMenuCategory_DefaultExtra
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
    "opendiscord:help":ODHelpMenuCommandComponent,
    "opendiscord:ticket":ODHelpMenuCommandComponent|null
}

/**## ODHelpMenuCategory_DefaultGeneral `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:general` category in `opendiscord.helpmenu`!
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
    "opendiscord:close":ODHelpMenuCommandComponent,
    "opendiscord:delete":ODHelpMenuCommandComponent,
    "opendiscord:reopen":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketBasic `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
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
    "opendiscord:pin":ODHelpMenuCommandComponent,
    "opendiscord:unpin":ODHelpMenuCommandComponent,
    "opendiscord:move":ODHelpMenuCommandComponent,
    "opendiscord:rename":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
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
    "opendiscord:claim":ODHelpMenuCommandComponent,
    "opendiscord:unclaim":ODHelpMenuCommandComponent,
    "opendiscord:add":ODHelpMenuCommandComponent,
    "opendiscord:remove":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultTicketUser `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:ticket` category in `opendiscord.helpmenu`!
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
    "opendiscord:panel":ODHelpMenuCommandComponent,
    "opendiscord:blacklist-view":ODHelpMenuCommandComponent,
    "opendiscord:blacklist-add":ODHelpMenuCommandComponent,
    "opendiscord:blacklist-remove":ODHelpMenuCommandComponent,
    "opendiscord:blacklist-get":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultAdmin `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:admin` category in `opendiscord.helpmenu`!
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
    "opendiscord:stats-global":ODHelpMenuCommandComponent,
    "opendiscord:stats-reset":ODHelpMenuCommandComponent,
    "opendiscord:stats-ticket":ODHelpMenuCommandComponent,
    "opendiscord:stats-user":ODHelpMenuCommandComponent,
    "opendiscord:autoclose-disable":ODHelpMenuCommandComponent,
    "opendiscord:autoclose-enable":ODHelpMenuCommandComponent
}

/**## ODHelpMenuCategory_DefaultAdvanced `default_class`
 * This is a special class that adds type definitions & typescript to the ODHelpMenuManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the `opendiscord:advanced` category in `opendiscord.helpmenu`!
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
 * This default class is made for the `opendiscord:general` category in `opendiscord.helpmenu`!
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