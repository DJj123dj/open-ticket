///////////////////////////////////////
//OPENTICKET TICKET MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidJsonType, ODValidId, ODVersion, ODManagerData } from "../modules/base"
import { ODDebugger } from "../modules/console"
import { ODClientManager_Default } from "../defaults/client"
import { ODOption, ODOptionJson, ODTicketOption } from "./option"
import * as discord from "discord.js"

export class ODTicketManager extends ODManager<ODTicket> {
    /**A reference to the main server of the bot */
    #guild: discord.Guild|null = null
    #client: ODClientManager_Default
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
        const msgId = ticket.get("openticket:ticket-message").value
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
                const creatorId = ticket.get("openticket:opened-by").value
                if (!creatorId) return null
                else return (await this.#guild.client.users.fetch(creatorId))

            }else if (user == "closer"){
                const closerId = ticket.get("openticket:closed-by").value
                if (!closerId) return null
                else return (await this.#guild.client.users.fetch(closerId))

            }else if (user == "claimer"){
                const claimerId = ticket.get("openticket:claimed-by").value
                if (!claimerId) return null
                else return (await this.#guild.client.users.fetch(claimerId))
                
            }else if (user == "pinner"){
                const pinnerId = ticket.get("openticket:pinned-by").value
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
        const creatorId = ticket.get("openticket:opened-by").value
        if (creatorId){
            const creator = await this.#client.fetchUser(creatorId)
            if (creator) final.push({user:creator,role:"creator"})
        }

        //add participants
        const participants = ticket.get("openticket:participants").value.filter((p) => p.type == "user")
        for (const p of participants){
            if (!final.find((u) => u.user.id == p.id)){
                const participant = await this.#client.fetchUser(p.id)
                if (participant) final.push({user:participant,role:"participant"})
            }
        }

        //add admin roles
        const roles = ticket.get("openticket:participants").value.filter((p) => p.type == "role")
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

export interface ODTicketDataJson {
    id:string,
    value:ODValidJsonType
}

export interface ODTicketJson {
    id:string,
    option:string,
    version:string,
    data:ODTicketDataJson[]
}

/**## ODTicketIds `type`
 * This interface is a list of ids available in the `ODTicket` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTicketIds {
    "openticket:busy":ODTicketData<boolean>,
    "openticket:ticket-message":ODTicketData<string|null>,
    "openticket:participants":ODTicketData<{type:"role"|"user",id:string}[]>,
    "openticket:channel-suffix":ODTicketData<string>,
    
    "openticket:open":ODTicketData<boolean>,
    "openticket:opened-by":ODTicketData<string|null>,
    "openticket:opened-on":ODTicketData<number|null>,
    "openticket:closed":ODTicketData<boolean>,
    "openticket:closed-by":ODTicketData<string|null>,
    "openticket:closed-on":ODTicketData<number|null>,
    "openticket:claimed":ODTicketData<boolean>,
    "openticket:claimed-by":ODTicketData<string|null>,
    "openticket:claimed-on":ODTicketData<number|null>,
    "openticket:pinned":ODTicketData<boolean>,
    "openticket:pinned-by":ODTicketData<string|null>,
    "openticket:pinned-on":ODTicketData<number|null>,
    "openticket:for-deletion":ODTicketData<boolean>,

    "openticket:category":ODTicketData<string|null>,
    "openticket:category-mode":ODTicketData<null|"normal"|"closed"|"backup"|"claimed">,
    
    "openticket:autoclose-enabled":ODTicketData<boolean>,
    "openticket:autoclose-hours":ODTicketData<number>,
    "openticket:autoclosed":ODTicketData<boolean>,
    "openticket:autodelete-enabled":ODTicketData<boolean>,
    "openticket:autodelete-days":ODTicketData<number>,

    "openticket:answers":ODTicketData<{id:string,name:string,type:"short"|"paragraph",value:string|null}[]>,
}

export class ODTicket extends ODManager<ODTicketData<ODValidJsonType>> {
    id:ODId
    #option: ODTicketOption

    constructor(id:ODValidId, option:ODTicketOption, data:ODTicketData<ODValidJsonType>[]){
        super()
        this.id = new ODId(id)
        this.#option = option
        data.forEach((data) => {
            this.add(data)
        })
    }

    set option(option:ODTicketOption){
        this.#option = option
        this._change()
    }
    get option(){
        return this.#option
    }
    
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

export class ODTicketData<DataType extends ODValidJsonType> extends ODManagerData {
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
    /**Refresh the database. Is only required to be used when updating `ODTicketData` with an object/array as value. */
    refreshDatabase(){
        this._change()
    }
}

export type ODTicketClearFilter = "all"|"open"|"closed"|"claimed"|"unclaimed"|"pinned"|"unpinned"|"autoclosed"