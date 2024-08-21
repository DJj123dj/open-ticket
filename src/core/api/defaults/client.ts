///////////////////////////////////////
//DEFAULT CLIENT MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODClientManager, ODSlashCommand, ODTextCommand, ODSlashCommandManager, ODTextCommandManager, ODSlashCommandInteractionCallback, ODTextCommandInteractionCallback } from "../modules/client"

/**## ODClientManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODClientManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.client`!
 */
export class ODClientManager_Default extends ODClientManager {
    declare slashCommands: ODSlashCommandManager_Default
    declare textCommands: ODTextCommandManager_Default
}

/**## ODSlashCommandManagerIds_Default `type`
 * This type is an array of ids available in the `ODSlashCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSlashCommandManagerIds_Default {
    "openticket:help":ODSlashCommand,
    "openticket:panel":ODSlashCommand,
    "openticket:ticket":ODSlashCommand,
    "openticket:close":ODSlashCommand,
    "openticket:delete":ODSlashCommand,
    "openticket:reopen":ODSlashCommand,
    "openticket:claim":ODSlashCommand,
    "openticket:unclaim":ODSlashCommand,
    "openticket:pin":ODSlashCommand,
    "openticket:unpin":ODSlashCommand,
    "openticket:move":ODSlashCommand,
    "openticket:rename":ODSlashCommand,
    "openticket:add":ODSlashCommand,
    "openticket:remove":ODSlashCommand,
    "openticket:blacklist":ODSlashCommand,
    "openticket:stats":ODSlashCommand,
    "openticket:clear":ODSlashCommand,
    "openticket:autoclose":ODSlashCommand,
    "openticket:autodelete":ODSlashCommand,
}

/**## ODSlashCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODSlashCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.client.slashCommands`!
 */
export class ODSlashCommandManager_Default extends ODSlashCommandManager {
    get<SlashCommandId extends keyof ODSlashCommandManagerIds_Default>(id:SlashCommandId): ODSlashCommandManagerIds_Default[SlashCommandId]
    get(id:ODValidId): ODSlashCommand|null
    
    get(id:ODValidId): ODSlashCommand|null {
        return super.get(id)
    }
    
    remove<SlashCommandId extends keyof ODSlashCommandManagerIds_Default>(id:SlashCommandId): ODSlashCommandManagerIds_Default[SlashCommandId]
    remove(id:ODValidId): ODSlashCommand|null
    
    remove(id:ODValidId): ODSlashCommand|null {
        return super.remove(id)
    }

    exists(id:keyof ODSlashCommandManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    onInteraction(commandName:keyof ODSlashCommandManagerIds_Default, callback:ODSlashCommandInteractionCallback): void
    onInteraction(commandName:string|RegExp, callback:ODSlashCommandInteractionCallback): void

    onInteraction(commandName:string|RegExp, callback:ODSlashCommandInteractionCallback): void {
        return super.onInteraction(commandName,callback)
    }
}

/**## ODTextCommandManagerIds_Default `type`
 * This type is an array of ids available in the `ODTextCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTextCommandManagerIds_Default {
    "openticket:help":ODTextCommand,
    "openticket:panel":ODTextCommand,
    "openticket:close":ODTextCommand,
    "openticket:delete":ODTextCommand,
    "openticket:reopen":ODTextCommand,
    "openticket:claim":ODTextCommand,
    "openticket:unclaim":ODTextCommand,
    "openticket:pin":ODTextCommand,
    "openticket:unpin":ODTextCommand,
    "openticket:move":ODTextCommand,
    "openticket:rename":ODTextCommand,
    "openticket:add":ODTextCommand,
    "openticket:remove":ODTextCommand,
    "openticket:blacklist-view":ODTextCommand,
    "openticket:blacklist-add":ODTextCommand,
    "openticket:blacklist-remove":ODTextCommand,
    "openticket:blacklist-get":ODTextCommand,
    "openticket:stats-global":ODTextCommand,
    "openticket:stats-reset":ODTextCommand,
    "openticket:stats-ticket":ODTextCommand,
    "openticket:stats-user":ODTextCommand,
    "openticket:clear":ODTextCommand,
    "openticket:autoclose-disable":ODTextCommand,
    "openticket:autoclose-enable":ODTextCommand,
    "openticket:autodelete-disable":ODTextCommand,
    "openticket:autodelete-enable":ODTextCommand
}

/**## ODTextCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODTextCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `openticket.client.textCommands`!
 */
export class ODTextCommandManager_Default extends ODTextCommandManager {
    get<TextCommandId extends keyof ODTextCommandManagerIds_Default>(id:TextCommandId): ODTextCommandManagerIds_Default[TextCommandId]
    get(id:ODValidId): ODTextCommand|null
    
    get(id:ODValidId): ODTextCommand|null {
        return super.get(id)
    }
    
    remove<TextCommandId extends keyof ODTextCommandManagerIds_Default>(id:TextCommandId): ODTextCommandManagerIds_Default[TextCommandId]
    remove(id:ODValidId): ODTextCommand|null
    
    remove(id:ODValidId): ODTextCommand|null {
        return super.remove(id)
    }

    exists(id:keyof ODTextCommandManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    onInteraction(prefix:string, id:keyof ODTextCommandManagerIds_Default, callback:ODTextCommandInteractionCallback): void
    onInteraction(commandPrefix:string, commandName:string|RegExp, callback:ODTextCommandInteractionCallback): void

    onInteraction(commandPrefix:string, commandName:string|RegExp, callback:ODTextCommandInteractionCallback): void {
        return super.onInteraction(commandPrefix,commandName,callback)
    }
}