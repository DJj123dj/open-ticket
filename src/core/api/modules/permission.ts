///////////////////////////////////////
//PERMISSION MODULE
///////////////////////////////////////
import { ODId, ODValidId, ODManager, ODSystemError, ODManagerData } from "./base"
import * as discord from "discord.js"
import { ODDebugger } from "./console"

export type ODPermissionType = "member"|"support"|"moderator"|"admin"|"owner"|"developer"
export type ODPermissionScope = "global-user"|"channel-user"|"global-role"|"channel-role"
export interface ODPermissionResult {
    type:ODPermissionType
    scope:ODPermissionScope|"default"
    level:ODPermissionLevel,
    source:ODPermission|null
}

export enum ODPermissionLevel {
    member,
    support,
    moderator,
    admin,
    owner,
    developer
}

export class ODPermission extends ODManagerData {
    readonly scope: ODPermissionScope
    readonly permission: ODPermissionType
    readonly value: discord.Role|discord.User
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

export interface ODPermissionSettings {
    allowGlobalUserScope?:boolean,
    allowGlobalRoleScope?:boolean,
    allowChannelUserScope?:boolean,
    allowChannelRoleScope?:boolean,
    idRegex?:RegExp
}

export type ODPermissionCalculationCallback = (user:discord.User, channel?:discord.Channel|null, guild?:discord.Guild|null, settings?:ODPermissionSettings|null) => Promise<ODPermissionResult>

export class ODPermissionManager extends ODManager<ODPermission> {
    #calculation: ODPermissionCalculationCallback|null
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

    setCalculation(calculation:ODPermissionCalculationCallback){
        this.#calculation = calculation
    }
    setDefaultResult(result:ODPermissionResult){
        this.defaultResult = result
    }
    getPermissions(user:discord.User, channel?:discord.Channel|null, guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        try{
            if (!this.#calculation) throw new ODSystemError("ODPermissionManager:getPermissions() => missing perms calculation")
            return this.#calculation(user,channel,guild,settings)
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("ODPermissionManager:getPermissions() => failed perms calculation")
        }
    }
    hasPermissions(minimum:ODPermissionType, data:ODPermissionResult){
        if (minimum == "member") return true
        else if (minimum == "support") return (data.level >= ODPermissionLevel["support"])
        else if (minimum == "moderator") return (data.level >= ODPermissionLevel["moderator"])
        else if (minimum == "admin") return (data.level >= ODPermissionLevel["admin"])
        else if (minimum == "owner") return (data.level >= ODPermissionLevel["owner"])
        else if (minimum == "developer") return (data.level >= ODPermissionLevel["developer"])
        else throw new ODSystemError("Invalid minimum permission type at ODPermissionManager.hasPermissions()")
    }
    async #defaultCalculation(user:discord.User,channel?:discord.Channel|null,guild?:discord.Guild|null, settings?:ODPermissionSettings|null): Promise<ODPermissionResult> {
        const globalCalc = await this.#defaultGlobalCalculation(user,channel,guild,settings)
        const channelCalc = await this.#defaultChannelCalculation(user,channel,guild,settings)

        if (globalCalc.level > channelCalc.level) return globalCalc
        else return channelCalc
    }
    /**Check for global permissions. Then this result can be compared with the channel one. */
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
    /**Check for channel permissions. Then this result can be compared with the global one. */
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

        //spread result to prevent accidental referencing
        return {...this.defaultResult}
    }
}