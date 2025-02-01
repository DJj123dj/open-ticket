///////////////////////////////////////
//DEFAULT CLIENT MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODClientManager, ODSlashCommand, ODTextCommand, ODSlashCommandManager, ODTextCommandManager, ODSlashCommandInteractionCallback, ODTextCommandInteractionCallback } from "../modules/client"

/**## ODClientManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODClientManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client`!
 */
export class ODClientManager_Default extends ODClientManager {
    declare slashCommands: ODSlashCommandManager_Default
    declare textCommands: ODTextCommandManager_Default
}

/**## ODSlashCommandManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODSlashCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODSlashCommandManagerIds_Default {
    "opendiscord:help":ODSlashCommand,
    "opendiscord:panel":ODSlashCommand,
    "opendiscord:ticket":ODSlashCommand,
    "opendiscord:close":ODSlashCommand,
    "opendiscord:delete":ODSlashCommand,
    "opendiscord:reopen":ODSlashCommand,
    "opendiscord:claim":ODSlashCommand,
    "opendiscord:unclaim":ODSlashCommand,
    "opendiscord:pin":ODSlashCommand,
    "opendiscord:unpin":ODSlashCommand,
    "opendiscord:move":ODSlashCommand,
    "opendiscord:rename":ODSlashCommand,
    "opendiscord:add":ODSlashCommand,
    "opendiscord:remove":ODSlashCommand,
    "opendiscord:blacklist":ODSlashCommand,
    "opendiscord:stats":ODSlashCommand,
    "opendiscord:clear":ODSlashCommand,
    "opendiscord:autoclose":ODSlashCommand,
    "opendiscord:autodelete":ODSlashCommand,
}

/**## ODSlashCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODSlashCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client.slashCommands`!
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

/**## ODTextCommandManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODTextCommandManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTextCommandManagerIds_Default {
    "opendiscord:dump":ODTextCommand,
    "opendiscord:help":ODTextCommand,
    "opendiscord:panel":ODTextCommand,
    "opendiscord:close":ODTextCommand,
    "opendiscord:delete":ODTextCommand,
    "opendiscord:reopen":ODTextCommand,
    "opendiscord:claim":ODTextCommand,
    "opendiscord:unclaim":ODTextCommand,
    "opendiscord:pin":ODTextCommand,
    "opendiscord:unpin":ODTextCommand,
    "opendiscord:move":ODTextCommand,
    "opendiscord:rename":ODTextCommand,
    "opendiscord:add":ODTextCommand,
    "opendiscord:remove":ODTextCommand,
    "opendiscord:blacklist-view":ODTextCommand,
    "opendiscord:blacklist-add":ODTextCommand,
    "opendiscord:blacklist-remove":ODTextCommand,
    "opendiscord:blacklist-get":ODTextCommand,
    "opendiscord:stats-global":ODTextCommand,
    "opendiscord:stats-reset":ODTextCommand,
    "opendiscord:stats-ticket":ODTextCommand,
    "opendiscord:stats-user":ODTextCommand,
    "opendiscord:clear":ODTextCommand,
    "opendiscord:autoclose-disable":ODTextCommand,
    "opendiscord:autoclose-enable":ODTextCommand,
    "opendiscord:autodelete-disable":ODTextCommand,
    "opendiscord:autodelete-enable":ODTextCommand
}

/**## ODTextCommandManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODTextCommandManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.client.textCommands`!
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

    onInteraction(commandPrefix:string, commandName:string|RegExp, callback:ODTextCommandInteractionCallback): void {
        return super.onInteraction(commandPrefix,commandName,callback)
    }
}