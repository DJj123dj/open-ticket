///////////////////////////////////////
//RESPONDER MODULE
///////////////////////////////////////
import { ODId, ODManager, ODValidId, ODSystemError, ODManagerData } from "./base"
import * as discord from "discord.js"
import { ODWorkerManager, ODWorkerCallback, ODWorker } from "./worker"
import { ODDebugger } from "./console"
import { ODClientManager, ODSlashCommand, ODTextCommand, ODTextCommandInteractionOption } from "./client"
import { ODDropdownData, ODMessageBuildResult, ODMessageBuildSentResult, ODModalBuildResult } from "./builder"

/**## ODResponderImplementation `class`
 * This is an Open Ticket responder implementation.
 * 
 * It is a basic implementation of the `ODWorkerManager` used by all `ODResponder` classes.
 * 
 * This class can't be used stand-alone & needs to be extended from!
 */
export class ODResponderImplementation<Instance,Source extends string,Params> extends ODManagerData {
    /**The manager that has all workers of this implementation */
    workers: ODWorkerManager<Instance,Source,Params>
    /**The `commandName` or `customId` needs to match this string or regex for this responder to be executed. */
    match: string|RegExp

    constructor(id:ODValidId, match:string|RegExp, callback?:ODWorkerCallback<Instance,Source,Params>, priority?:number, callbackId?:ODValidId){
        super(id)
        this.match = match
        this.workers = new ODWorkerManager("descending")
        if (callback) this.workers.add(new ODWorker(callbackId ? callbackId : id,priority ?? 0,callback))
    }
    /**Execute all workers & return the result. */
    async respond(instance:Instance, source:Source, params:Params): Promise<void> {
        throw new ODSystemError("Tried to build an unimplemented ODResponderImplementation")
    }
}

/**## ODResponderTimeoutErrorCallback `type`
 * This is the callback for the responder timeout function. It will be executed when something went wrong or the action takes too much time.
 */
export type ODResponderTimeoutErrorCallback<Instance, Source extends "slash"|"text"|"button"|"dropdown"|"modal"|"other"> = (instance:Instance, source:Source) => void|Promise<void>

/**## ODResponderManager `class`
 * This is an Open Ticket responder manager.
 * 
 * It contains all Open Ticket responders. Responders can respond to an interaction, button, dropdown, modal or command.
 * 
 * Using the Open Ticket responder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit replies
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - write code once => reply to both slash & text commands at the same time!
 * - know where the request came from & parse options/subcommands & without errors!
 * - And so much more!
 */
export class ODResponderManager {
    /**A manager for all (text & slash) command responders. */
    commands: ODCommandResponderManager
    /**A manager for all button responders. */
    buttons: ODButtonResponderManager
    /**A manager for all dropdown/select menu responders. */
    dropdowns: ODDropdownResponderManager
    /**A manager for all modal responders. */
    modals: ODModalResponderManager

    constructor(debug:ODDebugger, client:ODClientManager){
        this.commands = new ODCommandResponderManager(debug,"command responder",client)
        this.buttons = new ODButtonResponderManager(debug,"button responder",client)
        this.dropdowns = new ODDropdownResponderManager(debug,"dropdown responder",client)
        this.modals = new ODModalResponderManager(debug,"modal responder",client)
    }
}

/**## ODCommandResponderManager `class`
 * This is an Open Ticket command responder manager.
 * 
 * It contains all Open Ticket command responders. These can respond to text & slash commands.
 * 
 * Using the Open Ticket responder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit replies
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - write code once => reply to both slash & text commands at the same time!
 * - know where the request came from & parse options/subcommands & without errors!
 * - And so much more!
 */
export class ODCommandResponderManager extends ODManager<ODCommandResponder<"slash"|"text",any>> {
    /**An alias to the Open Ticket client manager. */
    #client: ODClientManager
    /**The callback executed when the default workers take too much time to reply. */
    #timeoutErrorCallback: ODResponderTimeoutErrorCallback<ODCommandResponderInstance,"slash"|"text">|null = null
    /**The amount of milliseconds before the timeout error callback is executed. */
    #timeoutMs: number|null = null
    
    constructor(debug:ODDebugger, debugname:string, client:ODClientManager){
        super(debug,debugname)
        this.#client = client
    }

    /**Set the message to send when the response times out! */
    setTimeoutErrorCallback(callback:ODResponderTimeoutErrorCallback<ODCommandResponderInstance,"slash"|"text">|null, ms:number|null){
        this.#timeoutErrorCallback = callback
        this.#timeoutMs = ms
    }

    add(data:ODCommandResponder<"slash"|"text",any>, overwrite?:boolean){
        const res = super.add(data,overwrite)
        
        //add the callback to the slash command manager
        this.#client.slashCommands.onInteraction(data.match,(interaction,cmd) => {
            const newData = this.get(data.id)
            if (!newData) return
            newData.respond(new ODCommandResponderInstance(interaction,cmd,this.#timeoutErrorCallback,this.#timeoutMs),"slash",{})
        })

        //add the callback to the text command manager
        this.#client.textCommands.onInteraction(data.prefix,data.match,(interaction,cmd,options) => {
            const newData = this.get(data.id)
            if (!newData) return
            newData.respond(new ODCommandResponderInstance(interaction,cmd,this.#timeoutErrorCallback,this.#timeoutMs,options),"text",{})
        })

        return res
    }
}

/**## ODCommandResponderInstanceOptions `class`
 * This is an Open Ticket command responder instance options manager.
 * 
 * This class will manage all options & subcommands from slash & text commands.
 */
export class ODCommandResponderInstanceOptions {
    /**The interaction to get data from. */
    #interaction: discord.ChatInputCommandInteraction|discord.Message
    /**The command which is related to the interaction. */
    #cmd:ODSlashCommand|ODTextCommand
    /**A list of options which have been parsed by the text command parser. */
    #options: ODTextCommandInteractionOption[]

    constructor(interaction:discord.ChatInputCommandInteraction|discord.Message, cmd:ODSlashCommand|ODTextCommand, options?:ODTextCommandInteractionOption[]){
        this.#interaction = interaction
        this.#cmd = cmd
        this.#options = options ?? []
    }

    /**Get a string option. */
    getString(name:string,required:true): string
    getString(name:string,required:false): string|null
    getString(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getString(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getString() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "string" && opt.name == name)
            if (opt && typeof opt.value == "string") return opt.value
            else return null

        }else return null
    }
    /**Get a boolean option. */
    getBoolean(name:string,required:true): boolean
    getBoolean(name:string,required:false): boolean|null
    getBoolean(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getBoolean(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getBoolean() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "boolean" && opt.name == name)
            if (opt && typeof opt.value == "boolean") return opt.value
            else return null

        }else return null
    }
    /**Get a number option. */
    getNumber(name:string,required:true): number
    getNumber(name:string,required:false): number|null
    getNumber(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getNumber(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getNumber() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "number" && opt.name == name)
            if (opt && typeof opt.value == "number") return opt.value
            else return null

        }else return null
    }
    /**Get a channel option. */
    getChannel(name:string,required:true): discord.TextChannel|discord.VoiceChannel|discord.StageChannel|discord.NewsChannel|discord.MediaChannel|discord.ForumChannel|discord.CategoryChannel
    getChannel(name:string,required:false): discord.TextChannel|discord.VoiceChannel|discord.StageChannel|discord.NewsChannel|discord.MediaChannel|discord.ForumChannel|discord.CategoryChannel|null
    getChannel(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getChannel(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getChannel() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "channel" && opt.name == name)
            if (opt && (opt.value instanceof discord.TextChannel || opt.value instanceof discord.VoiceChannel || opt.value instanceof discord.StageChannel || opt.value instanceof discord.NewsChannel || opt.value instanceof discord.MediaChannel || opt.value instanceof discord.ForumChannel || opt.value instanceof discord.CategoryChannel)) return opt.value
            else return null

        }else return null
    }
    /**Get a role option. */
    getRole(name:string,required:true): discord.Role
    getRole(name:string,required:false): discord.Role|null
    getRole(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getRole(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getRole() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "role" && opt.name == name)
            if (opt && opt.value instanceof discord.Role) return opt.value
            else return null

        }else return null
    }
    /**Get a user option. */
    getUser(name:string,required:true): discord.User
    getUser(name:string,required:false): discord.User|null
    getUser(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getUser(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getUser() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "user" && opt.name == name)
            if (opt && opt.value instanceof discord.User) return opt.value
            else return null

        }else return null
    }
    /**Get a guild member option. */
    getGuildMember(name:string,required:true): discord.GuildMember
    getGuildMember(name:string,required:false): discord.GuildMember|null
    getGuildMember(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                const member = this.#interaction.options.getMember(name)
                if (!member && required) throw new ODSystemError("ODCommandResponderInstanceOptions:getGuildMember() slash command option not found!")
                return member
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getGuildMember() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "guildmember" && opt.name == name)
            if (opt && opt.value instanceof discord.GuildMember) return opt.value
            else return null

        }else return null
    }
    /**Get a mentionable option. */
    getMentionable(name:string,required:true): discord.User|discord.GuildMember|discord.Role
    getMentionable(name:string,required:false): discord.User|discord.GuildMember|discord.Role|null
    getMentionable(name:string,required:boolean){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getMentionable(name,required)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getGuildMember() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message){
            const opt = this.#options.find((opt) => opt.type == "mentionable" && opt.name == name)
            if (opt && (opt.value instanceof discord.User || opt.value instanceof discord.GuildMember || opt.value instanceof discord.Role)) return opt.value
            else return null

        }else return null
    }
    /**Get a subgroup. */
    getSubGroup(): string|null
    getSubGroup(){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getSubcommandGroup(true)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getSubGroup() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message && this.#cmd instanceof ODTextCommand){
            //0: name, 1:sub/group, 2:sub
            const splittedName: string[] = this.#cmd.builder.name.split(" ")
            return splittedName[1] ?? null

        }else return null
    }
    /**Get a subcommand. */
    getSubCommand(): string|null
    getSubCommand(){
        if (this.#interaction instanceof discord.ChatInputCommandInteraction){
            try {
                return this.#interaction.options.getSubcommand(true)
            }catch{
                throw new ODSystemError("ODCommandResponderInstanceOptions:getSubCommand() slash command option not found!")
            }

        }else if (this.#interaction instanceof discord.Message && this.#cmd instanceof ODTextCommand){
            //0: name, 1:sub/group, 2:sub
            const splittedName: string[] = this.#cmd.builder.name.split(" ")
            
            //return the second subcommand when there is a subgroup
            if (splittedName.length > 2){
                return splittedName[2] ?? null
            }else return splittedName[1] ?? null

        }else return null
    }
}


/**## ODCommandResponderInstance `class`
 * This is an Open Ticket command responder instance.
 * 
 * An instance is an active slash interaction or used text command. You can reply to the command using `reply()` for both slash & text commands.
 */
export class ODCommandResponderInstance {
    /**The interaction which is the source of this instance. */
    interaction: discord.ChatInputCommandInteraction|discord.Message
    /**The command wich is the source of this instance. */
    cmd:ODSlashCommand|ODTextCommand
    /**The type/source of instance. (from text or slash command) */
    type: "message"|"interaction"
    /**Did a worker already reply to this instance/interaction? */
    didReply: boolean = false
    /**The manager for all options of this command. */
    options: ODCommandResponderInstanceOptions
    /**The user who triggered this command. */
    user: discord.User
    /**The guild member who triggered this command. */
    member: discord.GuildMember|null
    /**The guild where this command was triggered. */
    guild: discord.Guild|null
    /**The channel where this command was triggered. */
    channel: discord.TextBasedChannel

    constructor(interaction:discord.ChatInputCommandInteraction|discord.Message, cmd:ODSlashCommand|ODTextCommand, errorCallback:ODResponderTimeoutErrorCallback<ODCommandResponderInstance,"slash"|"text">|null, timeoutMs:number|null, options?:ODTextCommandInteractionOption[]){
        if (!interaction.channel) throw new ODSystemError("ODCommandResponderInstance: Unable to find interaction channel!")
        this.interaction = interaction
        this.cmd = cmd
        this.type = (interaction instanceof discord.Message) ? "message" : "interaction"
        this.options = new ODCommandResponderInstanceOptions(interaction,cmd,options)
        this.user = (interaction instanceof discord.Message) ? interaction.author : interaction.user
        this.member = (interaction.member instanceof discord.GuildMember) ? interaction.member : null
        this.guild = interaction.guild
        this.channel = interaction.channel


        setTimeout(async () => {
            if (!this.didReply){
                try {
                    if (!errorCallback){
                        this.reply({id:new ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                            content:":x: **Something went wrong while replying to this command!**"
                        }})
                    }else{
                        await errorCallback(this,(this.type == "interaction") ? "slash" : "text")
                    }
                    
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            }
        },timeoutMs ?? 2500)
    }

    /**Reply to this command. */
    async reply(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try {
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.type == "interaction" && this.interaction instanceof discord.ChatInputCommandInteraction){
                if (this.interaction.replied || this.interaction.deferred){
                    const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                    this.didReply = true
                    return {success:true,message:sent}
                }else{
                    const sent = await this.interaction.reply(Object.assign(msg.message,{flags:msgFlags}))
                    this.didReply = true
                    return {success:true,message:await sent.fetch()}
                }
            }else if (this.type == "message" && this.interaction instanceof discord.Message && this.interaction.channel.type != discord.ChannelType.GroupDM){
                const sent = await this.interaction.channel.send(msg.message)
                this.didReply = true
                return {success:true,message:sent}
            }else return {success:false,message:null}
        }catch{
            return {success:false,message:null}
        }
    }
    /**Defer this command. */
    async defer(ephemeral:boolean){
        if (this.type != "interaction" || !(this.interaction instanceof discord.ChatInputCommandInteraction)) return false
        if (this.interaction.deferred) return false
        const msgFlags: number[] = ephemeral ? [discord.MessageFlags.Ephemeral] : []
        await this.interaction.deferReply({flags:msgFlags})
        this.didReply = true
        return true
    }
    /**Show a modal as reply to this command. */
    async modal(modal:ODModalBuildResult){
        if (this.type != "interaction" || !(this.interaction instanceof discord.ChatInputCommandInteraction)) return false
        this.interaction.showModal(modal.modal)
        this.didReply = true
        return true
    }
}

/**## ODCommandResponder `class`
 * This is an Open Ticket command responder.
 * 
 * This class manages all workers which are executed when the related command is triggered.
 */
export class ODCommandResponder<Source extends "slash"|"text",Params> extends ODResponderImplementation<ODCommandResponderInstance,Source,Params> {
    /**The prefix of the text command needs to match this */
    prefix: string
    
    constructor(id:ODValidId, prefix:string, match:string|RegExp, callback?:ODWorkerCallback<ODCommandResponderInstance,Source,Params>, priority?:number, callbackId?:ODValidId){
        super(id,match,callback,priority,callbackId)
        this.prefix = prefix
    }

    /**Respond to this command */
    async respond(instance:ODCommandResponderInstance, source:Source, params:Params){
        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)
    }
}

/**## ODButtonResponderManager `class`
 * This is an Open Ticket button responder manager.
 * 
 * It contains all Open Ticket button responders. These can respond to button interactions.
 * 
 * Using the Open Ticket responder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit replies
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - know where the request came from!
 * - And so much more!
 */
export class ODButtonResponderManager extends ODManager<ODButtonResponder<"button",any>> {
    /**An alias to the Open Ticket client manager. */
    #client: ODClientManager
    /**The callback executed when the default workers take too much time to reply. */
    #timeoutErrorCallback: ODResponderTimeoutErrorCallback<ODButtonResponderInstance,"button">|null = null
    /**The amount of milliseconds before the timeout error callback is executed. */
    #timeoutMs: number|null = null
    /**A list of listeners which will listen to the raw interactionCreate event from discord.js */
    #listeners: ((interaction:discord.ButtonInteraction) => void)[] = []

    constructor(debug:ODDebugger, debugname:string, client:ODClientManager){
        super(debug,debugname)
        this.#client = client

        this.#client.client.on("interactionCreate",(interaction) => {
            if (!interaction.isButton()) return
            this.#listeners.forEach((cb) => cb(interaction))
        })
    }

    /**Set the message to send when the response times out! */
    setTimeoutErrorCallback(callback:ODResponderTimeoutErrorCallback<ODButtonResponderInstance,"button">|null, ms:number|null){
        this.#timeoutErrorCallback = callback
        this.#timeoutMs = ms
    }

    add(data:ODButtonResponder<"button",any>, overwrite?:boolean){
        const res = super.add(data,overwrite)
        
        this.#listeners.push((interaction) => {
            const newData = this.get(data.id)
            if (!newData) return
            if ((typeof newData.match == "string") ? interaction.customId == newData.match : newData.match.test(interaction.customId)) newData.respond(new ODButtonResponderInstance(interaction,this.#timeoutErrorCallback,this.#timeoutMs),"button",{})
        })

        return res
    }
}

/**## ODButtonResponderInstance `class`
 * This is an Open Ticket button responder instance.
 * 
 * An instance is an active button interaction. You can reply to the button using `reply()`.
 */
export class ODButtonResponderInstance {
    /**The interaction which is the source of this instance. */
    interaction: discord.ButtonInteraction
    /**Did a worker already reply to this instance/interaction? */
    didReply: boolean = false
    /**The user who triggered this button. */
    user: discord.User
    /**The guild member who triggered this button. */
    member: discord.GuildMember|null
    /**The guild where this button was triggered. */
    guild: discord.Guild|null
    /**The channel where this button was triggered. */
    channel: discord.TextBasedChannel
    /**The message this button originates from. */
    message: discord.Message

    constructor(interaction:discord.ButtonInteraction, errorCallback:ODResponderTimeoutErrorCallback<ODButtonResponderInstance,"button">|null, timeoutMs:number|null){
        if (!interaction.channel) throw new ODSystemError("ODButtonResponderInstance: Unable to find interaction channel!")
        this.interaction = interaction
        this.user = interaction.user
        this.member = (interaction.member instanceof discord.GuildMember) ? interaction.member : null
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.message = interaction.message
        
        setTimeout(async () => {
            if (!this.didReply){
                try {
                    if (!errorCallback){
                        this.reply({id:new ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                            content:":x: **Something went wrong while replying to this button!**"
                        }})
                    }else{
                        await errorCallback(this,"button")
                    }
                    
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            }
        },timeoutMs ?? 2500)
    }

    /**Reply to this button. */
    async reply(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try{
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:sent}
            }else{
                const sent = await this.interaction.reply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }
        }catch{
            return {success:false,message:null}
        }
    }
    /**Update the message of this button. */
    async update(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try{
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }else{
                const sent = await this.interaction.update(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }
        }catch{
            return {success:false,message:null}
        }
    }
    /**Defer this button. */
    async defer(type:"reply"|"update", ephemeral:boolean){
        if (this.interaction.deferred) return false
        if (type == "reply"){
            const msgFlags: number[] = ephemeral ? [discord.MessageFlags.Ephemeral] : []
            await this.interaction.deferReply({flags:msgFlags})
        }else{
            await this.interaction.deferUpdate()
        }
        this.didReply = true
        return true
    }
    /**Show a modal as reply to this button. */
    async modal(modal:ODModalBuildResult){
        this.interaction.showModal(modal.modal)
        this.didReply = true
        return true
    }

    /**Get a component from the original message of this button. */
    getMessageComponent(type:"button",id:string|RegExp): discord.ButtonComponent|null
    getMessageComponent(type:"string-dropdown",id:string|RegExp): discord.StringSelectMenuComponent|null
    getMessageComponent(type:"user-dropdown",id:string|RegExp): discord.UserSelectMenuComponent|null
    getMessageComponent(type:"channel-dropdown",id:string|RegExp): discord.ChannelSelectMenuComponent|null
    getMessageComponent(type:"role-dropdown",id:string|RegExp): discord.RoleSelectMenuComponent|null
    getMessageComponent(type:"mentionable-dropdown",id:string|RegExp): discord.MentionableSelectMenuComponent|null

    getMessageComponent(type:"button"|"string-dropdown"|"user-dropdown"|"channel-dropdown"|"role-dropdown"|"mentionable-dropdown", id:string|RegExp): discord.ButtonComponent|discord.StringSelectMenuComponent|discord.RoleSelectMenuComponent|discord.ChannelSelectMenuComponent|discord.MentionableSelectMenuComponent|discord.UserSelectMenuComponent|null {
        let result: discord.ButtonComponent|discord.StringSelectMenuComponent|discord.RoleSelectMenuComponent|discord.ChannelSelectMenuComponent|discord.MentionableSelectMenuComponent|discord.UserSelectMenuComponent|null = null
        this.message.components.forEach((row) => {
            row.components.forEach((component) => {
                if (type == "button" && component.type == discord.ComponentType.Button && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "string-dropdown" && component.type == discord.ComponentType.StringSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "user-dropdown" && component.type == discord.ComponentType.UserSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "channel-dropdown" && component.type == discord.ComponentType.ChannelSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "role-dropdown" && component.type == discord.ComponentType.RoleSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "mentionable-dropdown" && component.type == discord.ComponentType.MentionableSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
            })
        })

        return result
    }

    /**Get the first embed of the original message if it exists. */
    getMessageEmbed(): discord.Embed|null {
        return this.message.embeds[0] ?? null
    }
}

/**## ODButtonResponder `class`
 * This is an Open Ticket button responder.
 * 
 * This class manages all workers which are executed when the related button is triggered.
 */
export class ODButtonResponder<Source extends string,Params> extends ODResponderImplementation<ODButtonResponderInstance,Source,Params> {
    /**Respond to this button */
    async respond(instance:ODButtonResponderInstance, source:Source, params:Params){
        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)
    }
}

/**## ODDropdownResponderManager `class`
 * This is an Open Ticket dropdown responder manager.
 * 
 * It contains all Open Ticket dropdown responders. These can respond to dropdown interactions.
 * 
 * Using the Open Ticket responder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit replies
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - know where the request came from!
 * - And so much more!
 */
export class ODDropdownResponderManager extends ODManager<ODDropdownResponder<"dropdown",any>> {
    /**An alias to the Open Ticket client manager. */
    #client: ODClientManager
    /**The callback executed when the default workers take too much time to reply. */
    #timeoutErrorCallback: ODResponderTimeoutErrorCallback<ODDropdownResponderInstance,"dropdown">|null = null
    /**The amount of milliseconds before the timeout error callback is executed. */
    #timeoutMs: number|null = null
    /**A list of listeners which will listen to the raw interactionCreate event from discord.js */
    #listeners: ((interaction:discord.AnySelectMenuInteraction) => void)[] = []

    constructor(debug:ODDebugger, debugname:string, client:ODClientManager){
        super(debug,debugname)
        this.#client = client

        this.#client.client.on("interactionCreate",(interaction) => {
            if (!interaction.isAnySelectMenu()) return
            this.#listeners.forEach((cb) => cb(interaction))
        })
    }

    /**Set the message to send when the response times out! */
    setTimeoutErrorCallback(callback:ODResponderTimeoutErrorCallback<ODDropdownResponderInstance,"dropdown">|null, ms:number|null){
        this.#timeoutErrorCallback = callback
        this.#timeoutMs = ms
    }

    add(data:ODDropdownResponder<"dropdown",any>, overwrite?:boolean){
        const res = super.add(data,overwrite)
        
        this.#listeners.push((interaction) => {
            const newData = this.get(data.id)
            if (!newData) return
            if ((typeof newData.match == "string") ? interaction.customId == newData.match : newData.match.test(interaction.customId)) newData.respond(new ODDropdownResponderInstance(interaction,this.#timeoutErrorCallback,this.#timeoutMs),"dropdown",{})
        })

        return res
    }
}

/**## ODDropdownResponderInstanceValues `class`
 * This is an Open Ticket dropdown responder instance values manager.
 * 
 * This class will manage all values from the dropdowns & select menus.
 */
export class ODDropdownResponderInstanceValues {
    /**The interaction to get data from. */
    #interaction: discord.AnySelectMenuInteraction
    /**The type of this dropdown. */
    #type: ODDropdownData["type"]

    constructor(interaction:discord.AnySelectMenuInteraction, type:ODDropdownData["type"]){
        this.#interaction = interaction
        this.#type = type

        if (interaction.isChannelSelectMenu()){
            interaction.values
        }
    }

    /**Get the selected values. */
    getStringValues(): string[] {
        try {
            return this.#interaction.values
        }catch{
            throw new ODSystemError("ODDropdownResponderInstanceValues:getStringValues() invalid values!")
        }
    }
    /**Get the selected roles. */
    async getRoleValues(): Promise<discord.Role[]> {
        if (this.#type != "role") throw new ODSystemError("ODDropdownResponderInstanceValues:getRoleValues() dropdown type isn't role!")
        try {
            const result: discord.Role[] = []
            for (const id of this.#interaction.values){
                if (!this.#interaction.guild) break
                const role = await this.#interaction.guild.roles.fetch(id)
                if (role) result.push(role)
            }
            return result
        }catch{
            throw new ODSystemError("ODDropdownResponderInstanceValues:getRoleValues() invalid values!")
        }
    }
    /**Get the selected users. */
    async getUserValues(): Promise<discord.User[]> {
        if (this.#type != "role") throw new ODSystemError("ODDropdownResponderInstanceValues:getUserValues() dropdown type isn't user!")
        try {
            const result: discord.User[] = []
            for (const id of this.#interaction.values){
                const user = await this.#interaction.client.users.fetch(id)
                if (user) result.push(user)
            }
            return result
        }catch{
            throw new ODSystemError("ODDropdownResponderInstanceValues:getUserValues() invalid values!")
        }
    }
    /**Get the selected channels. */
    async getChannelValues(): Promise<discord.GuildBasedChannel[]> {
        if (this.#type != "role") throw new ODSystemError("ODDropdownResponderInstanceValues:getChannelValues() dropdown type isn't channel!")
        try {
            const result: discord.GuildBasedChannel[] = []
            for (const id of this.#interaction.values){
                if (!this.#interaction.guild) break
                const guild = await this.#interaction.guild.channels.fetch(id)
                if (guild) result.push(guild)
            }
            return result
        }catch{
            throw new ODSystemError("ODDropdownResponderInstanceValues:getChannelValues() invalid values!")
        }
    }
}

/**## ODDropdownResponderInstance `class`
 * This is an Open Ticket dropdown responder instance.
 * 
 * An instance is an active dropdown interaction. You can reply to the dropdown using `reply()`.
 */
export class ODDropdownResponderInstance {
    /**The interaction which is the source of this instance. */
    interaction: discord.AnySelectMenuInteraction
    /**Did a worker already reply to this instance/interaction? */
    didReply: boolean = false
    /**The dropdown type. */
    type: ODDropdownData["type"]
    /**The manager for all values of this dropdown. */
    values: ODDropdownResponderInstanceValues
    /**The user who triggered this dropdown. */
    user: discord.User
    /**The guild member who triggered this dropdown. */
    member: discord.GuildMember|null
    /**The guild where this dropdown was triggered. */
    guild: discord.Guild|null
    /**The channel where this dropdown was triggered. */
    channel: discord.TextBasedChannel
    /**The message this dropdown originates from. */
    message: discord.Message

    constructor(interaction:discord.AnySelectMenuInteraction, errorCallback:ODResponderTimeoutErrorCallback<ODDropdownResponderInstance,"dropdown">|null, timeoutMs:number|null){
        if (!interaction.channel) throw new ODSystemError("ODDropdownResponderInstance: Unable to find interaction channel!")
        this.interaction = interaction
        if (interaction.isStringSelectMenu()){
            this.type = "string"
        }else if (interaction.isRoleSelectMenu()){
            this.type = "role"
        }else if (interaction.isUserSelectMenu()){
            this.type = "user"
        }else if (interaction.isChannelSelectMenu()){
            this.type = "channel"
        }else if (interaction.isMentionableSelectMenu()){
            this.type = "mentionable"
        }else throw new ODSystemError("ODDropdownResponderInstance: invalid dropdown type!")
        
        this.values = new ODDropdownResponderInstanceValues(interaction,this.type)
        this.user = interaction.user
        this.member = (interaction.member instanceof discord.GuildMember) ? interaction.member : null
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.message = interaction.message
        
        setTimeout(async () => {
            if (!this.didReply){
                try {
                    if (!errorCallback){
                        this.reply({id:new ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                            content:":x: **Something went wrong while replying to this dropdown!**"
                        }})
                    }else{
                        await errorCallback(this,"dropdown")
                    }
                    
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            }
        },timeoutMs ?? 2500)
    }

    /**Reply to this dropdown. */
    async reply(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try {
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:sent}
            }else{
                const sent = await this.interaction.reply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }
        }catch{
            return {success:false,message:null}
        }
    }
    /**Update the message of this dropdown. */
    async update(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try{
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }else{
                const sent = await this.interaction.update(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }
        }catch{
            return {success:false,message:null}
        }
    }
    /**Defer this dropdown. */
    async defer(type:"reply"|"update", ephemeral:boolean){
        if (this.interaction.deferred) return false
        if (type == "reply"){
            const msgFlags: number[] = ephemeral ? [discord.MessageFlags.Ephemeral] : []
            await this.interaction.deferReply({flags:msgFlags})
        }else{
            await this.interaction.deferUpdate()
        }
        this.didReply = true
        return true
    }
    /**Show a modal as reply to this dropdown. */
    async modal(modal:ODModalBuildResult){
        this.interaction.showModal(modal.modal)
        this.didReply = true
        return true
    }

    /**Get a component from the original message of this dropdown. */
    getMessageComponent(type:"button",id:string|RegExp): discord.ButtonComponent|null
    getMessageComponent(type:"string-dropdown",id:string|RegExp): discord.StringSelectMenuComponent|null
    getMessageComponent(type:"user-dropdown",id:string|RegExp): discord.UserSelectMenuComponent|null
    getMessageComponent(type:"channel-dropdown",id:string|RegExp): discord.ChannelSelectMenuComponent|null
    getMessageComponent(type:"role-dropdown",id:string|RegExp): discord.RoleSelectMenuComponent|null
    getMessageComponent(type:"mentionable-dropdown",id:string|RegExp): discord.MentionableSelectMenuComponent|null

    getMessageComponent(type:"button"|"string-dropdown"|"user-dropdown"|"channel-dropdown"|"role-dropdown"|"mentionable-dropdown", id:string|RegExp): discord.ButtonComponent|discord.StringSelectMenuComponent|discord.RoleSelectMenuComponent|discord.ChannelSelectMenuComponent|discord.MentionableSelectMenuComponent|discord.UserSelectMenuComponent|null {
        let result: discord.ButtonComponent|discord.StringSelectMenuComponent|discord.RoleSelectMenuComponent|discord.ChannelSelectMenuComponent|discord.MentionableSelectMenuComponent|discord.UserSelectMenuComponent|null = null
        this.message.components.forEach((row) => {
            row.components.forEach((component) => {
                if (type == "button" && component.type == discord.ComponentType.Button && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "string-dropdown" && component.type == discord.ComponentType.StringSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "user-dropdown" && component.type == discord.ComponentType.UserSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "channel-dropdown" && component.type == discord.ComponentType.ChannelSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "role-dropdown" && component.type == discord.ComponentType.RoleSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
                else if (type == "mentionable-dropdown" && component.type == discord.ComponentType.MentionableSelect && component.customId && ((typeof id == "string") ? component.customId == id : id.test(component.customId))) result = component
            })
        })

        return result
    }

    /**Get the first embed of the original message if it exists. */
    getMessageEmbed(): discord.Embed|null {
        return this.message.embeds[0] ?? null
    }
}

/**## ODDropdownResponder `class`
 * This is an Open Ticket dropdown responder.
 * 
 * This class manages all workers which are executed when the related dropdown is triggered.
 */
export class ODDropdownResponder<Source extends string,Params> extends ODResponderImplementation<ODDropdownResponderInstance,Source,Params> {
    /**Respond to this dropdown */
    async respond(instance:ODDropdownResponderInstance, source:Source, params:Params){
        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)
    }
}

/**## ODModalResponderManager `class`
 * This is an Open Ticket modal responder manager.
 * 
 * It contains all Open Ticket modal responders. These can respond to modal interactions.
 * 
 * Using the Open Ticket responder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit replies
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - know where the request came from!
 * - And so much more!
 */
export class ODModalResponderManager extends ODManager<ODModalResponder<"modal",any>> {
    /**An alias to the Open Ticket client manager. */
    #client: ODClientManager
    /**The callback executed when the default workers take too much time to reply. */
    #timeoutErrorCallback: ODResponderTimeoutErrorCallback<ODModalResponderInstance,"modal">|null = null
    /**The amount of milliseconds before the timeout error callback is executed. */
    #timeoutMs: number|null = null
    /**A list of listeners which will listen to the raw interactionCreate event from discord.js */
    #listeners: ((interaction:discord.ModalSubmitInteraction) => void)[] = []

    constructor(debug:ODDebugger, debugname:string, client:ODClientManager){
        super(debug,debugname)
        this.#client = client

        this.#client.client.on("interactionCreate",(interaction) => {
            if (!interaction.isModalSubmit()) return
            this.#listeners.forEach((cb) => cb(interaction))
        })
    }

    /**Set the message to send when the response times out! */
    setTimeoutErrorCallback(callback:ODResponderTimeoutErrorCallback<ODModalResponderInstance,"modal">|null, ms:number|null){
        this.#timeoutErrorCallback = callback
        this.#timeoutMs = ms
    }

    add(data:ODModalResponder<"modal",any>, overwrite?:boolean){
        const res = super.add(data,overwrite)
        
        this.#listeners.push((interaction) => {
            const newData = this.get(data.id)
            if (!newData) return
            if ((typeof newData.match == "string") ? interaction.customId == newData.match : newData.match.test(interaction.customId)) newData.respond(new ODModalResponderInstance(interaction,this.#timeoutErrorCallback,this.#timeoutMs),"modal",{})
        })

        return res
    }
}

/**## ODModalResponderInstanceValues `class`
 * This is an Open Ticket modal responder instance values manager.
 * 
 * This class will manage all fields from the modals.
 */
export class ODModalResponderInstanceValues {
    /**The interaction to get data from. */
    #interaction: discord.ModalSubmitInteraction

    constructor(interaction:discord.ModalSubmitInteraction){
        this.#interaction = interaction
    }

    /**Get the value of a text field. */
    getTextField(name:string,required:true): string
    getTextField(name:string,required:false): string|null
    getTextField(name:string,required:boolean){
        try {
            const data = this.#interaction.fields.getField(name,discord.ComponentType.TextInput)
            if (!data && required) throw new ODSystemError("ODModalResponderInstanceValues:getTextField() field not found!")
            return (data) ? data.value : null
        }catch{
            throw new ODSystemError("ODModalResponderInstanceValues:getTextField() field not found!")
        }
    }
}

/**## ODModalResponderInstance `class`
 * This is an Open Ticket modal responder instance.
 * 
 * An instance is an active modal interaction. You can reply to the modal using `reply()`.
 */
export class ODModalResponderInstance {
    /**The interaction which is the source of this instance. */
    interaction: discord.ModalSubmitInteraction
    /**Did a worker already reply to this instance/interaction? */
    didReply: boolean = false
    /**The manager for all fields of this modal. */
    values: ODModalResponderInstanceValues
    /**The user who triggered this modal. */
    user: discord.User
    /**The guild member who triggered this modal. */
    member: discord.GuildMember|null
    /**The guild where this modal was triggered. */
    guild: discord.Guild|null
    /**The channel where this modal was triggered. */
    channel: discord.TextBasedChannel|null

    constructor(interaction:discord.ModalSubmitInteraction, errorCallback:ODResponderTimeoutErrorCallback<ODModalResponderInstance,"modal">|null, timeoutMs:number|null){
        this.interaction = interaction
        this.values = new ODModalResponderInstanceValues(interaction)
        this.user = interaction.user
        this.member = (interaction.member instanceof discord.GuildMember) ? interaction.member : null
        this.guild = interaction.guild
        this.channel = interaction.channel
        
        setTimeout(async () => {
            if (!this.didReply){
                try {
                    if (!errorCallback){
                        this.reply({id:new ODId("looks-like-we-got-an-error-here"), ephemeral:true, message:{
                            content:":x: **Something went wrong while replying to this modal!**"
                        }})
                    }else{
                        await errorCallback(this,"modal")
                    }
                    
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            }
        },timeoutMs ?? 2500)
    }

    /**Reply to this modal. */
    async reply(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try{
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:sent}
            }else{
                const sent = await this.interaction.reply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }
        }catch{
            return {success:false,message:null}
        }
    }
    /**Update the message of this modal. */
    async update(msg:ODMessageBuildResult): Promise<ODMessageBuildSentResult<boolean>> {
        try{
            const msgFlags: number[] = msg.ephemeral ? [discord.MessageFlags.Ephemeral] : []
            if (this.interaction.replied || this.interaction.deferred){
                const sent = await this.interaction.editReply(Object.assign(msg.message,{flags:msgFlags}))
                this.didReply = true
                return {success:true,message:await sent.fetch()}
            }else throw new ODSystemError()
        }catch{
            return {success:false,message:null}
        }
    }
    /**Defer this modal. */
    async defer(type:"reply"|"update", ephemeral:boolean){
        if (this.interaction.deferred) return false
        if (type == "reply"){
            const msgFlags: number[] = ephemeral ? [discord.MessageFlags.Ephemeral] : []
            await this.interaction.deferReply({flags:msgFlags})
        }else{
            await this.interaction.deferUpdate()
        }
        this.didReply = true
        return true
    }
}

/**## ODModalResponder `class`
 * This is an Open Ticket modal responder.
 * 
 * This class manages all workers which are executed when the related modal is triggered.
 */
export class ODModalResponder<Source extends string,Params> extends ODResponderImplementation<ODModalResponderInstance,Source,Params> {
    /**Respond to this modal */
    async respond(instance:ODModalResponderInstance, source:Source, params:Params){
        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)
    }
}