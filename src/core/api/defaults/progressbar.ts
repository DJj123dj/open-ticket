///////////////////////////////////////
//DEFAULT PROGRESS BAR MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODProgressBar, ODProgressBarManager, ODProgressBarRenderer, ODProgressBarRendererManager } from "../modules/progressbar"


/**## ODProgressBarRendererManagerIds_Default `type`
 * This type is an array of ids available in the `ODProgressBarRendererManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarRendererManagerIds_Default {
    "test-progressbar-renderer":ODProgressBarRenderer<{}>
}

/**## ODProgressBarRendererManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODProgressBarRendererManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.progressbars.renderers`!
 */
export class ODProgressBarRendererManager_Default extends ODProgressBarRendererManager {
    get<ProgressBarId extends keyof ODProgressBarRendererManagerIds_Default>(id:ProgressBarId): ODProgressBarRendererManagerIds_Default[ProgressBarId]
    get(id:ODValidId): ODProgressBarRenderer<{}>|null
    
    get(id:ODValidId): ODProgressBarRenderer<{}>|null {
        return super.get(id)
    }

    remove<ProgressBarId extends keyof ODProgressBarRendererManagerIds_Default>(id:ProgressBarId): ODProgressBarRendererManagerIds_Default[ProgressBarId]
    remove(id:ODValidId): ODProgressBarRenderer<{}>|null
    
    remove(id:ODValidId): ODProgressBarRenderer<{}>|null {
        return super.remove(id)
    }

    exists(id:keyof ODProgressBarRendererManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODProgressBarManagerIds_Default `type`
 * This type is an array of ids available in the `ODProgressBarManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODProgressBarManagerIds_Default {
    "test-progressbar":ODProgressBar
}

/**## ODProgressBarManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODProgressBarManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.progressbars`!
 */
export class ODProgressBarManager_Default extends ODProgressBarManager {
    declare renderers: ODProgressBarRendererManager_Default

    get<ProgressBarId extends keyof ODProgressBarManagerIds_Default>(id:ProgressBarId): ODProgressBarManagerIds_Default[ProgressBarId]
    get(id:ODValidId): ODProgressBar|null
    
    get(id:ODValidId): ODProgressBar|null {
        return super.get(id)
    }

    remove<ProgressBarId extends keyof ODProgressBarManagerIds_Default>(id:ProgressBarId): ODProgressBarManagerIds_Default[ProgressBarId]
    remove(id:ODValidId): ODProgressBar|null
    
    remove(id:ODValidId): ODProgressBar|null {
        return super.remove(id)
    }

    exists(id:keyof ODProgressBarManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}