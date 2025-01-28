///////////////////////////////////////
//PERMISSION MODULE
///////////////////////////////////////
import { ODId, ODValidId, ODManager, ODSystemError, ODManagerData } from "./base"
import * as discord from "discord.js"
import { ODDebugger } from "./console"

/**## ODPermissionType `type`
 * All available permission types/levels. Can be used in the `ODPermission` class.
 */
export type ODPermissionType = "member"|"support"|"moderator"|"admin"|"owner"|"developer"

/**## ODPermissionScope `type`
 * The scope in which a certain permission is active.
 */
export type ODPermissionScope = "global-user"|"channel-user"|"global-role"|"channel-role"

/**## ODPermissionResult `interface`
 * The result returned by `ODPermissionManager.getPermissions()`.
 */
export interface ODPermissionResult {
    /**The permission type. */
    type:ODPermissionType
    /**The permission scope. */
    scope:ODPermissionScope|"default"
    /**The highest level available for this scope. */
    level:ODPermissionLevel,
    /**The permission which returned this level. */
    source:ODPermission|null
}

/**## ODPermissionLevel `enum`
 * All available permission types/levels. But as `enum` instead of `type`. Used to calculate the level.
 */
export enum ODPermissionLevel {
    /**A normal member. (Default for everyone) */
    member,
    /**Support team. Higher than a normal member. (Used for ticket-admins) */
    support,
    /**Moderator. Higher than the support team. (Unused) */
    moderator,
    /**Admin. Higher than a moderator. (Used for global-admins) */
    admin,
    /**Server owner. (Able to use all commands including `/stats reset`) */
    owner,
    /**Bot owner or all users from dev team. (Able to use all commands including `/stats reset`) */
    developer
}

/**## ODPermission `class`
 * This is an Open Ticket permission.
 * 
 * It defines a single permission level for a specific scope (global/channel & user/role)
 * These permissions only apply to commands & interactions.
 * They are not related to channel permissions in the ticket system.
 * 
 * Register this class to an `ODPermissionManager` to use it!
 */
export class ODPermission extends ODManagerData {
    /**The scope of this permission. */
    readonly scope: ODPermissionScope
    /**The type/level of this permission. */
    readonly permission: ODPermissionType
    /**The user/role of this permission. */
    readonly value: discord.Role|discord.User
    /**The channel that this permission applies to. (`null` when global) */
    readonly channel: discord.Channel|null

    constructor(id:ODValidId, scope:"global-user", permission:ODPermissionType, value:discord.User)
    constructor(id:ODValidId, scope:"global-role", permission:ODPermissionType, value:discord.Role)
    constructor(id:ODValidId, scope:"channel-user", permission:ODPermissionType, value:discord.User, channel:discord.Channel)
    constructor(id:ODValidId, scope:"channel-role", permission:ODPermissionType, value:discord.Role, channel:discord.Channel)
    constructor(id:ODValidId, scope:ODPermissionScope, permission:ODPermissionType, value:discord.Role|discord.User, channel?:discord.Channel){
        super(id)
        this.scope = scope
        this.permission = permission
        this.value = value
        this.channel = channel ?? null
    }
}

/**## ODPermissionSettings `interface`
 * Optional settings for the `getPermissions()` method in the `ODPermissionManager`.
 */
export interface ODPermissionSettings {
    /**Include permissions from the global user scope. */
    allowGlobalUserScope?:boolean,
    /**Include permissions from the global role scope. */
    allowGlobalRoleScope?:boolean,
    /**Include permissions from the channel user scope. */
    allowChannelUserScope?:boolean,
    /**Include permissions from the channel role scope. */
    allowChannelRoleScope?:boolean,
    /**Only include permissions of which the id matches this regex. */
    idRegex?:RegExp
}

/**## ODPermissionCalculationCallback `type`
 * The callback of the permission calculation. (Used in `ODPermissionManager`)
 */
export type ODPermissionCalculationCallback = (user:discord.User, channel?:discord.Channel|null, guild?:discord.Guild|null, settings?:ODPermissionSettings|null) => Promise<ODPermissionResult>

/**## ODPermissionManager `class`
 * This is an Open Ticket permission manager.
 * 
 * It manages all permissions in the bot!
 * Use the `getPermissions()` and `hasPermissions()` methods to get user perms.
 * 
 * Add new permissions using the `ODPermission` class in your plugin!
 */
export class ODPermissionManager extends ODManager<ODPermission> {
    /**The function for calculating permissions in this manager. */
    #calculation: ODPermissionCalculationCallback|null
    /**The result which is returned when no other permissions match. (`member` by default) */
    defaultResult: ODPermissionResult = {
        level:ODPermissionLevel["member"],
        scope:"default",
        type:"member",
        source:null
    }

    constructor(debug:ODDebugger, useDefaultCalculation?:boolean){
        super(debug,"permission")
        this.#calculation = useDefaultCalculation ? this.#defaultCalculation : null
    }

    /**Edit the permission calculation function in this manager. */
    setCalculation(calculation:ODPermissionCalculationCallback){
        this.#calculation = calculation
    }
    /**Edit the result which is returned when no other permissions match. (`member` by default) */
    setDefaultResult(result:ODPermissionResult){
        this.defaultResult = result
    }
    /**Get an `ODPermissionResult` based on a few context factors. Use `hasPermissions()` to simplify the result. */
    getPermissions(user:discord.User, channel?:discord.Channel|null, guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        try{
            if (!this.#calculation) throw new ODSystemError("ODPermissionManager:getPermissions() => missing perms calculation")
            return this.#calculation(user,channel,guild,settings)
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("ODPermissionManager:getPermissions() => failed perms calculation")
        }
    }
    /**Simplifies the `ODPermissionResult` returned from `getPermissions()` and returns a boolean to check if the user matches the required permissions. */
    hasPermissions(minimum:ODPermissionType, data:ODPermissionResult){
        if (minimum == "member") return true
        else if (minimum == "support") return (data.level >= ODPermissionLevel["support"])
        else if (minimum == "moderator") return (data.level >= ODPermissionLevel["moderator"])
        else if (minimum == "admin") return (data.level >= ODPermissionLevel["admin"])
        else if (minimum == "owner") return (data.level >= ODPermissionLevel["owner"])
        else if (minimum == "developer") return (data.level >= ODPermissionLevel["developer"])
        else throw new ODSystemError("Invalid minimum permission type at ODPermissionManager.hasPermissions()")
    }
    /**Check for permissions. (default calculation) */
    async #defaultCalculation(user:discord.User,channel?:discord.Channel|null,guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        const globalCalc = await this.#defaultGlobalCalculation(user,channel,guild,settings)
        const channelCalc = await this.#defaultChannelCalculation(user,channel,guild,settings)

        if (globalCalc.level > channelCalc.level) return globalCalc
        else return channelCalc
    }
    /**Check for global permissions. Result will be compared with the channel perms in `#defaultCalculation()`. */
    async #defaultGlobalCalculation(user:discord.User,channel?:discord.Channel|null,guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        const idRegex = (settings && typeof settings.idRegex != "undefined") ? settings.idRegex : null
        const allowGlobalUserScope = (settings && typeof settings.allowGlobalUserScope != "undefined") ? settings.allowGlobalUserScope : true
        const allowGlobalRoleScope = (settings && typeof settings.allowGlobalRoleScope != "undefined") ? settings.allowGlobalRoleScope : true

        //check for global user permissions
        if (allowGlobalUserScope){
            const users = this.getFiltered((permission) => (!idRegex || (idRegex && idRegex.test(permission.id.value))) && permission.scope == "global-user" && (permission.value instanceof discord.User) && permission.value.id == user.id)

            if (users.length > 0){
                //sort all permisions from highest to lowest
                users.sort((a,b) => {
                    const levelA = ODPermissionLevel[a.permission]
                    const levelB = ODPermissionLevel[b.permission]

                    if (levelB > levelA) return 1
                    else if (levelA > levelB) return -1
                    else return 0
                })

                return {
                    type:users[0].permission,
                    scope:"global-user",
                    level:ODPermissionLevel[users[0].permission],
                    source:users[0] ?? null
                }
            }
        }
            
        //check for global role permissions
        if (allowGlobalRoleScope){
            if (guild){
                const member = await guild.members.fetch(user.id)
                if (member){
                    const memberRoles = member.roles.cache.map((role) => role.id)
                    const roles = this.getFiltered((permission) => (!idRegex || (idRegex && idRegex.test(permission.id.value))) && permission.scope == "global-role" && (permission.value instanceof discord.Role) && memberRoles.includes(permission.value.id) && permission.value.guild.id == guild.id)

                    if (roles.length > 0){
                        //sort all permisions from highest to lowest
                        roles.sort((a,b) => {
                            const levelA = ODPermissionLevel[a.permission]
                            const levelB = ODPermissionLevel[b.permission]
        
                            if (levelB > levelA) return 1
                            else if (levelA > levelB) return -1
                            else return 0
                        })
        
                        return {
                            type:roles[0].permission,
                            scope:"global-role",
                            level:ODPermissionLevel[roles[0].permission],
                            source:roles[0] ?? null
                        }
                    }
                }
            }
        }

        //spread result to prevent accidental referencing
        return {...this.defaultResult}
    }
    /**Check for channel permissions. Result will be compared with the global perms in `#defaultCalculation()`. */
    async #defaultChannelCalculation(user:discord.User,channel?:discord.Channel|null,guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        const idRegex = (settings && typeof settings.idRegex != "undefined") ? settings.idRegex : null
        const allowChannelUserScope = (settings && typeof settings.allowChannelUserScope != "undefined") ? settings.allowChannelUserScope : true
        const allowChannelRoleScope = (settings && typeof settings.allowChannelRoleScope != "undefined") ? settings.allowChannelRoleScope : true
        
        if (guild && channel && !channel.isDMBased()){
            //check for channel user permissions
            if (allowChannelUserScope){
                const users = this.getFiltered((permission) => (!idRegex || (idRegex && idRegex.test(permission.id.value))) && permission.scope == "channel-user" && permission.channel && (permission.channel.id == channel.id) && (permission.value instanceof discord.User) && permission.value.id == user.id)

                if (users.length > 0){
                    //sort all permisions from highest to lowest
                    users.sort((a,b) => {
                        const levelA = ODPermissionLevel[a.permission]
                        const levelB = ODPermissionLevel[b.permission]

                        if (levelB > levelA) return 1
                        else if (levelA > levelB) return -1
                        else return 0
                    })

                    return {
                        type:users[0].permission,
                        scope:"channel-user",
                        level:ODPermissionLevel[users[0].permission],
                        source:users[0] ?? null
                    }
                }
            }
            
            //check for channel role permissions
            if (allowChannelRoleScope){
                const member = await guild.members.fetch(user.id)
                if (member){
                    const memberRoles = member.roles.cache.map((role) => role.id)
                    const roles = this.getFiltered((permission) => (!idRegex || (idRegex && idRegex.test(permission.id.value))) && permission.scope == "channel-role" && permission.channel && (permission.channel.id == channel.id) && (permission.value instanceof discord.Role) && memberRoles.includes(permission.value.id) && permission.value.guild.id == guild.id)

                    if (roles.length > 0){
                        //sort all permisions from highest to lowest
                        roles.sort((a,b) => {
                            const levelA = ODPermissionLevel[a.permission]
                            const levelB = ODPermissionLevel[b.permission]
        
                            if (levelB > levelA) return 1
                            else if (levelA > levelB) return -1
                            else return 0
                        })
        
                        return {
                            type:roles[0].permission,
                            scope:"channel-role",
                            level:ODPermissionLevel[roles[0].permission],
                            source:roles[0] ?? null
                        }
                    }
                }
            }
        }

        //spread result to prevent accidental modification because of referencing
        return {...this.defaultResult}
    }
}