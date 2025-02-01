///////////////////////////////////////
//OPENTICKET TICKET MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"
import { ODClientManager_Default } from "../defaults/client"
import { ODTicketOption } from "./option"
import * as discord from "discord.js"

/**## ODTicketManager `class`
 * This is an Open Ticket ticket manager.
 * 
 * This class manages all currently created tickets in the bot.
 * 
 * All tickets which are added, removed or modified in this manager will be updated automatically in the database.
 */
export class ODTicketManager extends ODManager<ODTicket> {
    /**A reference to the main server of the bot */
    #guild: discord.Guild|null = null
    /**A reference to the Open Ticket client manager. */
    #client: ODClientManager_Default
    /**A reference to the Open Ticket debugger. */
    #debug: ODDebugger

    constructor(debug:ODDebugger, client:ODClientManager_Default){
        super(debug,"ticket")
        this.#debug = debug
        this.#client = client
    }
    
    add(data:ODTicket, overwrite?:boolean): boolean {
        data.useDebug(this.#debug,"ticket data")
        return super.add(data,overwrite)
    }
    /**Use a specific guild in this class for fetching the channel*/
    useGuild(guild:discord.Guild|null){
        this.#guild = guild
    }
    /**Get the discord channel for a specific ticket. */
    async getTicketChannel(ticket:ODTicket): Promise<discord.GuildTextBasedChannel|null> {
        if (!this.#guild) return null
        try {
            const channel = await this.#guild.channels.fetch(ticket.id.value)
            if (!channel || !channel.isTextBased()) return null
            return channel
        }catch{
            return null
        }
    }
    /**Get the main ticket message of a ticket channel when found. */
    async getTicketMessage(ticket:ODTicket): Promise<discord.Message<true>|null> {
        const msgId = ticket.get("opendiscord:ticket-message").value
        if (!this.#guild || !msgId) return null
        try {
            const channel = await this.getTicketChannel(ticket)
            if (!channel) return null
            return await channel.messages.fetch(msgId)
        }catch{
            return null
        }
    }
    /**Shortcut for getting a discord.js user within a ticket. */
    async getTicketUser(ticket:ODTicket, user:"creator"|"closer"|"claimer"|"pinner"): Promise<discord.User|null> {
        if (!this.#guild) return null
        try {
            if (user == "creator"){
                const creatorId = ticket.get("opendiscord:opened-by").value
                if (!creatorId) return null
                else return (await this.#guild.client.users.fetch(creatorId))

            }else if (user == "closer"){
                const closerId = ticket.get("opendiscord:closed-by").value
                if (!closerId) return null
                else return (await this.#guild.client.users.fetch(closerId))

            }else if (user == "claimer"){
                const claimerId = ticket.get("opendiscord:claimed-by").value
                if (!claimerId) return null
                else return (await this.#guild.client.users.fetch(claimerId))
                
            }else if (user == "pinner"){
                const pinnerId = ticket.get("opendiscord:pinned-by").value
                if (!pinnerId) return null
                else return (await this.#guild.client.users.fetch(pinnerId))
                
            }else return null
        }catch {return null}
    }
    /**Shortcut for getting all users that are able to view a ticket. */
    async getAllTicketParticipants(ticket:ODTicket): Promise<{user:discord.User,role:"creator"|"participant"|"admin"}[]|null> {
        if (!this.#guild) return null
        const final: {user:discord.User,role:"creator"|"participant"|"admin"}[] = []
        const channel = await this.getTicketChannel(ticket)
        if (!channel) return null

        //add creator
        const creatorId = ticket.get("opendiscord:opened-by").value
        if (creatorId){
            const creator = await this.#client.fetchUser(creatorId)
            if (creator) final.push({user:creator,role:"creator"})
        }

        //add participants
        const participants = ticket.get("opendiscord:participants").value.filter((p) => p.type == "user")
        for (const p of participants){
            if (!final.find((u) => u.user.id == p.id)){
                const participant = await this.#client.fetchUser(p.id)
                if (participant) final.push({user:participant,role:"participant"})
            }
        }

        //add admin roles
        const roles = ticket.get("opendiscord:participants").value.filter((p) => p.type == "role")
        for (const r of roles){
            const role = await this.#client.fetchGuildRole(channel.guild,r.id)
            if (role){
                role.members.forEach((member) => {
                    if (final.find((u) => u.user.id == member.id)) return
                    final.push({user:member.user,role:"admin"})
                })
            }
        }

        return final
    }
}

/**## ODTicketDataJson `interface`
 * The JSON representatation from a single ticket property.
 */
export interface ODTicketDataJson {
    /**The id of this property. */
    id:string,
    /**The value of this property. */
    value:ODValidJsonType
}

/**## ODTicketDataJson `interface`
 * The JSON representatation from a single ticket.
 */
export interface ODTicketJson {
    /**The id of this ticket. */
    id:string,
    /**The option id related to this ticket. */
    option:string,
    /**The version of Open Ticket used to create this ticket. */
    version:string,
    /**The full list of properties/variables related to this ticket. */
    data:ODTicketDataJson[]
}

/**## ODTicketIds `type`
 * This interface is a list of ids available in the `ODTicket` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTicketIds {
    "opendiscord:busy":ODTicketData<boolean>,
    "opendiscord:ticket-message":ODTicketData<string|null>,
    "opendiscord:participants":ODTicketData<{type:"role"|"user",id:string}[]>,
    "opendiscord:channel-suffix":ODTicketData<string>,
    
    "opendiscord:open":ODTicketData<boolean>,
    "opendiscord:opened-by":ODTicketData<string|null>,
    "opendiscord:opened-on":ODTicketData<number|null>,
    "opendiscord:closed":ODTicketData<boolean>,
    "opendiscord:closed-by":ODTicketData<string|null>,
    "opendiscord:closed-on":ODTicketData<number|null>,
    "opendiscord:claimed":ODTicketData<boolean>,
    "opendiscord:claimed-by":ODTicketData<string|null>,
    "opendiscord:claimed-on":ODTicketData<number|null>,
    "opendiscord:pinned":ODTicketData<boolean>,
    "opendiscord:pinned-by":ODTicketData<string|null>,
    "opendiscord:pinned-on":ODTicketData<number|null>,
    "opendiscord:for-deletion":ODTicketData<boolean>,

    "opendiscord:category":ODTicketData<string|null>,
    "opendiscord:category-mode":ODTicketData<null|"normal"|"closed"|"backup"|"claimed">,
    
    "opendiscord:autoclose-enabled":ODTicketData<boolean>,
    "opendiscord:autoclose-hours":ODTicketData<number>,
    "opendiscord:autoclosed":ODTicketData<boolean>,
    "opendiscord:autodelete-enabled":ODTicketData<boolean>,
    "opendiscord:autodelete-days":ODTicketData<number>,

    "opendiscord:answers":ODTicketData<{id:string,name:string,type:"short"|"paragraph",value:string|null}[]>,
}

/**## ODTicket `class`
 * This is an Open Ticket ticket.
 * 
 * This class contains all data related to this ticket (parsed from the database).
 * 
 * These properties contain the current state of the ticket & are used by actions like claiming, pinning, closing, ...
 */
export class ODTicket extends ODManager<ODTicketData<ODValidJsonType>> {
    /**The id of this ticket. (discord channel id) */
    id:ODId
    /**The option related to this ticket. */
    #option: ODTicketOption

    constructor(id:ODValidId, option:ODTicketOption, data:ODTicketData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        this.#option = option
        data.forEach((data) => {
            this.add(data)
        })
    }

    /**The option related to this ticket. */
    set option(option:ODTicketOption){
        this.#option = option
        this._change()
    }
    get option(){
        return this.#option
    }
    
    /**Convert this ticket to a JSON object for storing this ticket in the database. */
    toJson(version:ODVersion): ODTicketJson {
        const data = this.getAll().map((data) => {
            return {
                id:data.id.toString(),
                value:data.value
            }
        })
        
        return {
            id:this.id.toString(),
            option:this.option.id.value,
            version:version.toString(),
            data
        }
    }

    /**Create a ticket from a JSON object in the database. */
    static fromJson(json:ODTicketJson, option:ODTicketOption): ODTicket {
        return new ODTicket(json.id,option,json.data.map((data) => new ODTicketData(data.id,data.value)))
    }

    get<OptionId extends keyof ODTicketIds>(id:OptionId): ODTicketIds[OptionId]
    get(id:ODValidId): ODTicketData<ODValidJsonType>|null
    
    get(id:ODValidId): ODTicketData<ODValidJsonType>|null {
        return super.get(id)
    }

    remove<OptionId extends keyof ODTicketIds>(id:OptionId): ODTicketIds[OptionId]
    remove(id:ODValidId): ODTicketData<ODValidJsonType>|null
    
    remove(id:ODValidId): ODTicketData<ODValidJsonType>|null {
        return super.remove(id)
    }

    exists(id:keyof ODTicketIds): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODTicketData `class`
 * This is Open Ticket ticket data.
 * 
 * This class contains a single property for a ticket. (string, number, boolean, object, array, null)
 * 
 * When this property is edited, the database will be updated automatically.
 */
export class ODTicketData<DataType extends ODValidJsonType> extends ODManagerData {
    /**The value of this property. */
    #value: DataType

    constructor(id:ODValidId, value:DataType){
        super(id)
        this.#value = value
    }

    /**The value of this property. */
    set value(value:DataType){
        this.#value = value
        this._change()
    }
    get value(): DataType {
        return this.#value
    }
    /**Refresh the database. Is only required to be used when updating `ODTicketData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}

/**## ODTicketClearFilter `type`
 * This type contains all possible "clear filters" for the `/clear` command.
 */
export type ODTicketClearFilter = "all"|"open"|"closed"|"claimed"|"unclaimed"|"pinned"|"unpinned"|"autoclosed"