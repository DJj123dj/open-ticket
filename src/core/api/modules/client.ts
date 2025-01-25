///////////////////////////////////////
//DISCORD CLIENT MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import * as discord from "discord.js"
import {REST} from "@discordjs/rest"
import { ODConsoleWarningMessage, ODDebugger } from "./console"
import { ODMessageBuildResult, ODMessageBuildSentResult } from "./builder"
import { ODManualProgressBar } from "./progressbar"

/**## ODClientIntents `type`
 * A list of intents required when inviting the bot.
 */
export type ODClientIntents = ("Guilds"|"GuildMembers"|"GuildModeration"|"GuildEmojisAndStickers"|"GuildIntegrations"|"GuildWebhooks"|"GuildInvites"|"GuildVoiceStates"|"GuildPresences"|"GuildMessages"|"GuildMessageReactions"|"GuildMessageTyping"|"DirectMessages"|"DirectMessageReactions"|"DirectMessageTyping"|"MessageContent"|"GuildScheduledEvents"|"AutoModerationConfiguration"|"AutoModerationExecution")
/**## ODClientPriviligedIntents `type`
 * A list of priviliged intents required to be enabled in the developer portal.
 */
export type ODClientPriviligedIntents = ("GuildMembers"|"MessageContent"|"Presence")
/**## ODClientPartials `type`
 * A list of partials required for the bot to work. (`Message` & `Channel` are for receiving DM messages from uncached channels)
 */
export type ODClientPartials = ("User"|"Channel"|"GuildMember"|"Message"|"Reaction"|"GuildScheduledEvent"|"ThreadMember")
/**## ODClientPermissions `type`
 * A list of permissions required in the server that the bot is active in.
 */
export type ODClientPermissions = ("CreateInstantInvite"|"KickMembers"|"BanMembers"|"Administrator"|"ManageChannels"|"ManageGuild"|"AddReactions"|"ViewAuditLog"|"PrioritySpeaker"|"Stream"|"ViewChannel"|"SendMessages"|"SendTTSMessages"|"ManageMessages"|"EmbedLinks"|"AttachFiles"|"ReadMessageHistory"|"MentionEveryone"|"UseExternalEmojis"|"ViewGuildInsights"|"Connect"|"Speak"|"MuteMembers"|"DeafenMembers"|"MoveMembers"|"UseVAD"|"ChangeNickname"|"ManageNicknames"|"ManageRoles"|"ManageWebhooks"|"ManageGuildExpressions"|"UseApplicationCommands"|"RequestToSpeak"|"ManageEvents"|"ManageThreads"|"CreatePublicThreads"|"CreatePrivateThreads"|"UseExternalStickers"|"SendMessagesInThreads"|"UseEmbeddedActivities"|"ModerateMembers"|"ViewCreatorMonetizationAnalytics"|"UseSoundboard"|"UseExternalSounds"|"SendVoiceMessages")

/**## ODClientManager `class`
 * This is an open ticket client manager.
 * 
 * It is responsible for managing the discord.js client. Here, you can set the status, register slash commands and much more!
 * 
 * If you want, you can also listen for custom events on the `ODClientManager.client` variable (`discord.Client`)
 */
export class ODClientManager {
    /**Alias to open ticket debugger. */
    #debug: ODDebugger

    /**List of required bot intents. Add intents to this list using the `onClientLoad` event. */
    intents: ODClientIntents[] = []
    /**List of required bot privileged intents. Add intents to this list using the `onClientLoad` event. */
    privileges: ODClientPriviligedIntents[] = []
    /**List of required bot partials. Add intents to this list using the `onClientLoad` event. **❌ Only use when neccessery!** */
    partials: ODClientPartials[] = []
    /**List of required bot permissions. Add permissions to this list using the `onClientLoad` event. */
    permissions: ODClientPermissions[] = []
    /**The discord bot token, empty by default. */
    set token(value:string){
        this.#token = value
        this.rest.setToken(value)
    }
    get token(){
        return this.#token
    }
    /**The discord  bot token. **DON'T USE THIS!!!** (use `ODClientManager.token` instead) */
    #token: string = ""
    
    /**The discord.js `discord.Client`. Only use it when initiated! */
    client: discord.Client<true> = new discord.Client({intents:[]}) //temporary client
    /**The discord.js REST client. Used for stuff that discord.js can't handle :) */
    rest: discord.REST = new REST({version:"10"})
    /**Is the bot initiated? */
    initiated: boolean = false
    /**Is the bot logged in? */
    loggedIn: boolean = false
    /**Is the bot ready? */
    ready: boolean = false

    /**The main server of the bot. Provided by serverId in the config */
    mainServer: discord.Guild|null = null
    /**(❌ DO NOD OVERWRITE ❌) Internal open ticket function to continue the startup when the client is ready! */
    readyListener: (() => Promise<void>)|null = null
    /**The status manager is responsible for setting the bot status. */
    activity: ODClientActivityManager
    /**The slash command manager is responsible for all slash commands & their events inside the bot. */
    slashCommands: ODSlashCommandManager
    /**The text command manager is responsible for all text commands & their events inside the bot. */
    textCommands: ODTextCommandManager

    constructor(debug:ODDebugger){
        this.#debug = debug
        this.activity = new ODClientActivityManager(this.#debug,this)
        this.slashCommands = new ODSlashCommandManager(this.#debug,this)
        this.textCommands = new ODTextCommandManager(this.#debug,this)
    }

    /**Initiate the `client` variable & add the intents & partials to the bot. */
    initClient(){
        if (!this.intents.every((value) => typeof discord.GatewayIntentBits[value] != "undefined")) throw new ODSystemError("Client has non-existing intents!")
        if (!this.privileges.every((value) => typeof {GuildMembers:true,MessageContent:true,Presence:true}[value] != "undefined")) throw new ODSystemError("Client has non-existing privileged intents!")
        if (!this.partials.every((value) => typeof discord.Partials[value] != "undefined")) throw new ODSystemError("Client has non-existing partials!")
        if (!this.permissions.every((value) => typeof discord.PermissionFlagsBits[value] != "undefined")) throw new ODSystemError("Client has non-existing partials!")

        const intents = this.intents.map((value) => discord.GatewayIntentBits[value])
        const partials = this.partials.map((value) => discord.Partials[value])

        const oldClient = this.client
        this.client = new discord.Client({intents,partials})

        //@ts-ignore
        oldClient.eventNames().forEach((event:keyof discord.ClientEvents) => {
            //@ts-ignore
            const callbacks = oldClient.rawListeners(event)
            callbacks.forEach((cb:() => void) => {
                this.client.on(event,cb)
            })
        })

        this.initiated = true

        this.#debug.debug("Created client with intents: "+this.intents.join(", "))
        this.#debug.debug("Created client with privileged intents: "+this.privileges.join(", "))
        this.#debug.debug("Created client with partials: "+this.partials.join(", "))
        this.#debug.debug("Created client with permissions: "+this.permissions.join(", "))
    }
    /**Get all servers the bot is part of. */
    getGuilds(){
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")
        
        return this.client.guilds.cache.map((guild) => guild)
    }
    /**Check if the bot is in a specific guild */
    checkBotInGuild(guild:discord.Guild){
        return (guild.members.me) ? true : false
    }
    /**Check if a specific guild has all required permissions (or `Administrator`) */
    checkGuildPerms(guild:discord.Guild){
        if (!guild.members.me) throw new ODSystemError("Client isn't a member in this server!") 
        const perms = guild.members.me.permissions
        if (perms.has("Administrator")) return true
        else{
            return this.permissions.every((perm) => {
                return perms.has(perm)
            })
        }
    }
    /**Log-in with a discord auth token. */
    login(): Promise<boolean> {
        return new Promise(async (resolve,reject) => {
            if (!this.initiated) reject("Client isn't initiated yet!")
            if (!this.token) reject("Client doesn't have a token!")
            
            try {
                this.client.once("ready",async () => {
                    this.ready = true

                    //set slashCommandManager to client applicationCommandManager
                    if (!this.client.application) throw new ODSystemError("Couldn't get client application! Unable to register slash commands!")
                    this.slashCommands.commandManager = this.client.application.commands

                    if (this.readyListener) await this.readyListener()
                    resolve(true)
                })

                this.#debug.debug("Actual discord.js client.login()")
                await this.client.login(this.token)
                this.#debug.debug("Finished discord.js client.login()")
                this.loggedIn = true
            }catch(err){
                if (err.message.toLowerCase().includes("used disallowed intents")){
                    process.emit("uncaughtException",new ODSystemError("Used disallowed intents"))
                }else if (err.message.toLowerCase().includes("tokeninvalid") || err.message.toLowerCase().includes("an invalid token was provided")){
                    process.emit("uncaughtException",new ODSystemError("Invalid discord bot token provided"))
                }else reject("OT Login Error: "+err)
            }
        })
    }
    /**A simplified shortcut to get a `discord.User` :) */
    async fetchUser(id:string): Promise<discord.User|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            return await this.client.users.fetch(id)
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.Guild` :) */
    async fetchGuild(id:string): Promise<discord.Guild|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            return await this.client.guilds.fetch(id)
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.Channel` :) */
    async fetchChannel(id:string): Promise<discord.Channel|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            return await this.client.channels.fetch(id)
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.GuildBasedChannel` :) */
    async fetchGuildChannel(guildId:string|discord.Guild, id:string): Promise<discord.GuildBasedChannel|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            const guild = (guildId instanceof discord.Guild) ? guildId : await this.fetchGuild(guildId)
            if (!guild) return null
            const channel = await guild.channels.fetch(id)
            return channel
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.TextChannel` :) */
    async fetchGuildTextChannel(guildId:string|discord.Guild, id:string): Promise<discord.TextChannel|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            const guild = (guildId instanceof discord.Guild) ? guildId : await this.fetchGuild(guildId)
            if (!guild) return null
            const channel = await guild.channels.fetch(id)
            if (!channel || channel.type != discord.ChannelType.GuildText) return null
            return channel
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.CategoryChannel` :) */
    async fetchGuildCategoryChannel(guildId:string|discord.Guild, id:string): Promise<discord.CategoryChannel|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            const guild = (guildId instanceof discord.Guild) ? guildId : await this.fetchGuild(guildId)
            if (!guild) return null
            const channel = await guild.channels.fetch(id)
            if (!channel || channel.type != discord.ChannelType.GuildCategory) return null
            return channel
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.GuildMember` :) */
    async fetchGuildMember(guildId:string|discord.Guild, id:string): Promise<discord.GuildMember|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")
        if (typeof id != "string") throw new ODSystemError("TEMP ERROR => ODClientManager.fetchGuildMember() => id param isn't string")

        try{
            const guild = (guildId instanceof discord.Guild) ? guildId : await this.fetchGuild(guildId)
            if (!guild) return null
            return await guild.members.fetch(id)
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.Role` :) */
    async fetchGuildRole(guildId:string|discord.Guild, id:string): Promise<discord.Role|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")
        if (typeof id != "string") throw new ODSystemError("TEMP ERROR => ODClientManager.fetchGuildRole() => id param isn't string")

        try{
            const guild = (guildId instanceof discord.Guild) ? guildId : await this.fetchGuild(guildId)
            if (!guild) return null
            return await guild.roles.fetch(id)
        }catch{
            return null
        }
    }
    /**A simplified shortcut to get a `discord.Message` :) */
    async fetchGuildChannelMessage(guildId:string|discord.Guild, channelId:string|discord.TextChannel, id:string): Promise<discord.Message<true>|null>
    async fetchGuildChannelMessage(channelId:discord.TextChannel, id:string): Promise<discord.Message<true>|null>
    async fetchGuildChannelMessage(guildId:string|discord.Guild|discord.TextChannel, channelId:string|discord.TextChannel|string, id?:string): Promise<discord.Message<true>|null> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            if (guildId instanceof discord.TextChannel && typeof channelId == "string"){
                const channel = guildId
                return await channel.messages.fetch(channelId)
            }else if (!(guildId instanceof discord.TextChannel) && id){
                const channel = (channelId instanceof discord.TextChannel) ? channelId : await this.fetchGuildTextChannel(guildId,channelId)
                if (!channel) return null
                return await channel.messages.fetch(id)
            }else return null
        }catch{
            return null
        }
    }
    /**A simplified shortcut to send a DM to a user :) */
    async sendUserDm(user:string|discord.User, message:ODMessageBuildResult): Promise<ODMessageBuildSentResult<false>> {
        if (!this.initiated) throw new ODSystemError("Client isn't initiated yet!")
        if (!this.ready) throw new ODSystemError("Client isn't ready yet!")

        try{
            if (user instanceof discord.User){
                if (user.bot) return {success:false,message:null}
                const channel = await user.createDM()
                const msg = await channel.send(message.message)
                return {success:true,message:msg}
            }else{
                const newUser = await this.fetchUser(user)
                if (!newUser) throw new Error()
                if (newUser.bot) return {success:false,message:null}
                const channel = await newUser.createDM()
                const msg = await channel.send(message.message)
                return {success:true,message:msg}
            }
        }catch{
            try{
                this.#debug.console.log("Failed to send DM to user! ","warning",[
                    {key:"id",value:(user instanceof discord.User ? user.id : user)},
                    {key:"message",value:message.id.value}
                ])
            }catch{}
            return {success:false,message:null}
        }
    }
}

/**## ODClientActivityType `type`
 * Possible activity types for the bot.
 */
export type ODClientActivityType = ("playing"|"listening"|"watching"|"custom"|false)
/**## ODClientPermissions `type`
 * Possible activity statuses for the bot.
 */
export type ODClientActivityStatus = ("online"|"invisible"|"idle"|"dnd")


/**## ODClientActivityManager `class`
 * This is an open ticket client activity manager.
 * 
 * It's responsible for managing the client status. Here, you can set the activity & status of the bot.
 * 
 * It also has a built-in refresh function, so the status will refresh every 10 minutes to keep it visible.
 */
export class ODClientActivityManager {
    /**Alias to open ticket debugger. */
    #debug: ODDebugger

    /**Copy of discord.js client */
    manager: ODClientManager
    /**The current status type */
    type: ODClientActivityType = false
    /**The current status text */
    text: string = ""
    /**The current status status */
    status: ODClientActivityStatus = "online"

    /**The timer responsible for refreshing the status. Stop it using `clearInterval(interval)` */
    interval?: NodeJS.Timeout
    /**status refresh interval in seconds (5 minutes by default)*/
    refreshInterval: number = 600
    /**Is the status already initiated? */
    initiated: boolean = false

    constructor(debug:ODDebugger, manager:ODClientManager){
        this.#debug = debug
        this.manager = manager
    }

    /**Update the status. When already initiated, it can take up to 10min to see the updated status in discord. */
    setStatus(type:ODClientActivityType, text:string, status:ODClientActivityStatus, forceUpdate?:boolean){
        this.type = type
        this.text = text
        this.status = status
        if (forceUpdate) this.#updateClientActivity(this.type,this.text)
    }

    /**When initiating the status, the bot starts updating the status using `discord.js`. Returns `true` when successfull. */
    initStatus(): boolean {
        if (this.initiated || !this.manager.ready) return false
        this.#updateClientActivity(this.type,this.text)
        this.interval = setInterval(() => {
            this.#updateClientActivity(this.type,this.text)
            this.#debug.debug("Client status update cycle")
        },this.refreshInterval*1000)
        this.initiated = true
        this.#debug.debug("Client status initiated")
        return true
    }

    /**Update the client status */
    #updateClientActivity(type:ODClientActivityType,text:string){
        if (!this.manager.client.user) throw new ODSystemError("Couldn't set client status: client.user == undefined")
        if (type == false){
            this.manager.client.user.setActivity()
            return
        }
        this.manager.client.user.setPresence({
            activities:[{
                type:this.#getStatusTypeEnum(type),
                state:undefined,
                name:text,
            }],
            status:this.status
        })
    }
    /**Get the enum that links to the correct type */
    #getStatusTypeEnum(type:Exclude<ODClientActivityType,false>){
        if (type == "playing") return discord.ActivityType.Playing
        else if (type == "listening") return discord.ActivityType.Listening
        else if (type == "watching") return discord.ActivityType.Watching
        else if (type == "custom") return discord.ActivityType.Custom
        else return discord.ActivityType.Listening
    }
    /**Get the status type (for displaying the status) */
    getStatusType(): "listening "|"playing "|"watching "|"" {
        if (this.type == "listening" || this.type == "playing" || this.type == "watching") return this.type+" " as "listening "|"playing "|"watching "|""
        else return ""
    }
}

/**## ODSlashCommandUniversalTranslation `interface`
 * A universal template for a slash command translation. (used in names & descriptions)
 * 
 * Why universal? Both **existing slash commands** & **unregistered templates** can be converted to this type.
 */
export interface ODSlashCommandUniversalTranslation {
    /**The language code or locale of this language. */
    language:`${discord.Locale}`,
    /**The translation of the name in this language. */
    value:string
}

/**## ODSlashCommandUniversalOptionChoice `interface`
 * A universal template for a slash command option choice. (used in `string` options)
 * 
 * Why universal? Both **existing slash commands** & **unregistered templates** can be converted to this type.
 */
export interface ODSlashCommandUniversalOptionChoice {
    /**The name of this choice. */
    name:string,
    /**All localized names of this choice. */
    nameLocalizations:readonly ODSlashCommandUniversalTranslation[],
    /**The value of this choice. */
    value:string
}

/**## ODSlashCommandUniversalOption `interface`
 * A universal template for a slash command option.
 * 
 * Why universal? Both **existing slash commands** & **unregistered templates** can be converted to this type.
 */
export interface ODSlashCommandUniversalOption {
    /**The type of this option. */
    type:discord.ApplicationCommandOptionType,
    /**The name of this option. */
    name:string,
    /**All localized names of this option. */
    nameLocalizations:readonly ODSlashCommandUniversalTranslation[],
    /**The description of this option. */
    description:string,
    /**All localized descriptions of this option. */
    descriptionLocalizations:readonly ODSlashCommandUniversalTranslation[],
    /**Is this option required? */
    required:boolean,

    /**Is autocomplete enabled in this option? */
    autocomplete:boolean|null,
    /**Choices for this option (only when type is `string`) */
    choices:ODSlashCommandUniversalOptionChoice[],
    /**A list of sub-options for this option (only when type is `subCommand` or `subCommandGroup`) */
    options:readonly ODSlashCommandUniversalOption[],
    /**A list of allowed channel types for this option (only when type is `channel`) */
    channelTypes:readonly discord.ChannelType[],
    /**The minimum amount required for this option (only when type is `number` or `integer`) */
    minValue:number|null,
    /**The maximum amount required for this option (only when type is `number` or `integer`) */
    maxValue:number|null,
    /**The minimum length required for this option (only when type is `string`) */
    minLength:number|null,
    /**The maximum length required for this option (only when type is `string`) */
    maxLength:number|null
}

/**## ODSlashCommandUniversalCommand `interface`
 * A universal template for a slash command.
 * 
 * Why universal? Both **existing slash commands** & **unregistered templates** can be converted to this type.
 */
export interface ODSlashCommandUniversalCommand {
    /**The type of this command. (required => `ChatInput`) */
    type:discord.ApplicationCommandType.ChatInput,
    /**The name of this command. */
    name:string,
    /**All localized names of this command. */
    nameLocalizations:readonly ODSlashCommandUniversalTranslation[],
    /**The description of this command. */
    description:string,
    /**All localized descriptions of this command. */
    descriptionLocalizations:readonly ODSlashCommandUniversalTranslation[],
    /**The id of the guild this command is registered in. */
    guildId:string|null,
    /**Is this command for 18+ users only? */
    nsfw:boolean,
    /**A list of options for this command. */
    options:readonly ODSlashCommandUniversalOption[],
    /**A bitfield of the user permissions required to use this command. */
    defaultMemberPermissions:bigint,
    /**Is this command available in DM? */
    dmPermission:boolean,
    /**A list of contexts where you can install this command. */
    integrationTypes:readonly discord.ApplicationIntegrationType[],
    /**A list of contexts where you can use this command. */
    contexts:readonly discord.InteractionContextType[]
}

/**## ODSlashCommandBuilder `interface`
 * The builder for slash commands. Here you can add options to the command.
 */
export interface ODSlashCommandBuilder extends discord.ChatInputApplicationCommandData {
    /**@deprecated `dmPermission` is deprecated. Use `context` instead! (Not using contexts might result in the slash command being re-registered on every startup!) */
    dmPermission?:boolean
    /**This field is required in Open Ticket for future compatibility. */
    integrationTypes:discord.ApplicationIntegrationType[],
    /**This field is required in Open Ticket for future compatibility. */
    contexts:discord.InteractionContextType[]
}

export class ODSlashCommandComparator {
    /**Convert a `discord.ApplicationCommandOptionChoiceData<string>` to a universal Open Ticket slash command option choice object for comparison. */
    #convertOptionChoice(choice:discord.ApplicationCommandOptionChoiceData<string>): ODSlashCommandUniversalOptionChoice {
        const nameLoc = choice.nameLocalizations ?? {}
        return {
            name:choice.name,
            nameLocalizations:Object.keys(nameLoc).map((key) => {return {language:key as `${discord.Locale}`,value:nameLoc[key]}}),
            value:choice.value
        }
    }
    /**Convert a `discord.ApplicationCommandOptionData` to a universal Open Ticket slash command option object for comparison. */
    #convertBuilderOption(option:discord.ApplicationCommandOptionData): ODSlashCommandUniversalOption {
        const nameLoc = option.nameLocalizations ?? {}
        const descLoc = option.descriptionLocalizations ?? {}
        return {
            type:option.type,
            name:option.name,
            nameLocalizations:Object.keys(nameLoc).map((key) => {return {language:key as `${discord.Locale}`,value:nameLoc[key]}}),
            description:option.description,
            descriptionLocalizations:Object.keys(descLoc).map((key) => {return {language:key as `${discord.Locale}`,value:descLoc[key]}}),
            required:(option.type != discord.ApplicationCommandOptionType.SubcommandGroup && option.type != discord.ApplicationCommandOptionType.Subcommand && option.required) ? true : false,

            autocomplete:option.autocomplete ?? false,
            choices:(option.type == discord.ApplicationCommandOptionType.String && !option.autocomplete && option.choices) ? option.choices.map((choice) => this.#convertOptionChoice(choice)) : [],
            options:((option.type == discord.ApplicationCommandOptionType.SubcommandGroup || option.type == discord.ApplicationCommandOptionType.Subcommand) && option.options) ? option.options.map((opt) => this.#convertBuilderOption(opt)) : [],
            channelTypes:(option.type == discord.ApplicationCommandOptionType.Channel && option.channelTypes) ? option.channelTypes : [],
            minValue:(option.type == discord.ApplicationCommandOptionType.Number && option.minValue) ? option.minValue : null,
            maxValue:(option.type == discord.ApplicationCommandOptionType.Number && option.maxValue) ? option.maxValue : null,
            minLength:(option.type == discord.ApplicationCommandOptionType.String && option.minLength) ? option.minLength : null,
            maxLength:(option.type == discord.ApplicationCommandOptionType.String && option.maxLength) ? option.maxLength : null
        }
    }
    /**Convert a `discord.ApplicationCommandOption` to a universal Open Ticket slash command option object for comparison. */
    #convertCommandOption(option:discord.ApplicationCommandOption): ODSlashCommandUniversalOption {
        const nameLoc = option.nameLocalizations ?? {}
        const descLoc = option.descriptionLocalizations ?? {}

        return {
            type:option.type,
            name:option.name,
            nameLocalizations:Object.keys(nameLoc).map((key) => {return {language:key as `${discord.Locale}`,value:nameLoc[key]}}),
            description:option.description,
            descriptionLocalizations:Object.keys(descLoc).map((key) => {return {language:key as `${discord.Locale}`,value:descLoc[key]}}),
            required:(option.type != discord.ApplicationCommandOptionType.SubcommandGroup && option.type != discord.ApplicationCommandOptionType.Subcommand && option.required) ? true : false,

            autocomplete:option.autocomplete ?? false,
            choices:(option.type == discord.ApplicationCommandOptionType.String && !option.autocomplete && option.choices) ? option.choices.map((choice) => this.#convertOptionChoice(choice)) : [],
            options:((option.type == discord.ApplicationCommandOptionType.SubcommandGroup || option.type == discord.ApplicationCommandOptionType.Subcommand) && option.options) ? option.options.map((opt) => this.#convertBuilderOption(opt)) : [],
            channelTypes:(option.type == discord.ApplicationCommandOptionType.Channel && option.channelTypes) ? option.channelTypes : [],
            minValue:(option.type == discord.ApplicationCommandOptionType.Number && option.minValue) ? option.minValue : null,
            maxValue:(option.type == discord.ApplicationCommandOptionType.Number && option.maxValue) ? option.maxValue : null,
            minLength:(option.type == discord.ApplicationCommandOptionType.String && option.minLength) ? option.minLength : null,
            maxLength:(option.type == discord.ApplicationCommandOptionType.String && option.maxLength) ? option.maxLength : null
        }
    }
    /**Convert a `ODSlashCommandBuilder` to a universal Open Ticket slash command object for comparison. */
    convertBuilder(builder:ODSlashCommandBuilder,guildId:string|null): ODSlashCommandUniversalCommand {
        if (builder.type != discord.ApplicationCommandType.ChatInput) throw new ODSystemError("ODSlashCommandComparator:convertBuilder() is not supported for other types than 'ChatInput'!")
        const nameLoc = builder.nameLocalizations ?? {}
        const descLoc = builder.descriptionLocalizations ?? {}
        return {
            type:1,
            name:builder.name,
            nameLocalizations:Object.keys(nameLoc).map((key) => {return {language:key as `${discord.Locale}`,value:nameLoc[key]}}),
            description:builder.description,
            descriptionLocalizations:Object.keys(descLoc).map((key) => {return {language:key as `${discord.Locale}`,value:descLoc[key]}}),
            guildId:guildId,
            nsfw:builder.nsfw ?? false,
            options:builder.options ? builder.options.map((opt) => this.#convertBuilderOption(opt)) : [],
            defaultMemberPermissions:discord.PermissionsBitField.resolve(builder.defaultMemberPermissions ?? ["ViewChannel"]),
            dmPermission:(builder.contexts && builder.contexts.includes(discord.InteractionContextType.BotDM)) ?? false,
            integrationTypes:builder.integrationTypes ?? [discord.ApplicationIntegrationType.GuildInstall],
            contexts:builder.contexts ?? []
        }
    }
    /**Convert a `discord.ApplicationCommand` to a universal Open Ticket slash command object for comparison. */
    convertCommand(cmd:discord.ApplicationCommand): ODSlashCommandUniversalCommand {
        if (cmd.type != discord.ApplicationCommandType.ChatInput) throw new ODSystemError("ODSlashCommandComparator:convertCommand() is not supported for other types than 'ChatInput'!")
        const nameLoc = cmd.nameLocalizations ?? {}
        const descLoc = cmd.descriptionLocalizations ?? {}
        return {
            type:1,
            name:cmd.name,
            nameLocalizations:Object.keys(nameLoc).map((key) => {return {language:key as `${discord.Locale}`,value:nameLoc[key]}}),
            description:cmd.description,
            descriptionLocalizations:Object.keys(descLoc).map((key) => {return {language:key as `${discord.Locale}`,value:descLoc[key]}}),
            guildId:cmd.guildId,
            nsfw:cmd.nsfw,
            options:cmd.options ? cmd.options.map((opt) => this.#convertCommandOption(opt)) : [],
            defaultMemberPermissions:discord.PermissionsBitField.resolve(cmd.defaultMemberPermissions ?? ["ViewChannel"]),
            dmPermission:(cmd.contexts && cmd.contexts.includes(discord.InteractionContextType.BotDM)) ? true : false,
            integrationTypes:cmd.integrationTypes ?? [discord.ApplicationIntegrationType.GuildInstall],
            contexts:cmd.contexts ?? []
        }
    }
    /**Returns `true` when the 2 slash command options are the same. */
    compareOption(optA:ODSlashCommandUniversalOption,optB:ODSlashCommandUniversalOption): boolean {
        if (optA.name != optB.name) return false
        if (optA.description != optB.description) return false
        if (optA.type != optB.type) return false
        if (optA.required != optB.required) return false
        if (optA.autocomplete != optB.autocomplete) return false
        if (optA.minValue != optB.minValue) return false
        if (optA.maxValue != optB.maxValue) return false
        if (optA.minLength != optB.minLength) return false
        if (optA.maxLength != optB.maxLength) return false

        //nameLocalizations
        if (optA.nameLocalizations.length != optB.nameLocalizations.length) return false
        if (!optA.nameLocalizations.every((nameA) => {
            const nameB = optB.nameLocalizations.find((nameB) => nameB.language == nameA.language)
            if (!nameB || nameA.value != nameB.value) return false
            else return true
        })) return false
        
        //descriptionLocalizations
        if (optA.descriptionLocalizations.length != optB.descriptionLocalizations.length) return false
        if (!optA.descriptionLocalizations.every((descA) => {
            const descB = optB.descriptionLocalizations.find((descB) => descB.language == descA.language)
            if (!descB || descA.value != descB.value) return false
            else return true
        })) return false

        //choices
        if (optA.choices.length != optB.choices.length) return false
        if (!optA.choices.every((choiceA,index) => {
            const choiceB = optB.choices[index]
            if (choiceA.name != choiceB.name) return false
            if (choiceA.value != choiceB.value) return false

            //nameLocalizations
            if (choiceA.nameLocalizations.length != choiceB.nameLocalizations.length) return false
            if (!choiceA.nameLocalizations.every((nameA) => {
                const nameB = choiceB.nameLocalizations.find((nameB) => nameB.language == nameA.language)
                if (!nameB || nameA.value != nameB.value) return false
                else return true
            })) return false

            return true
        })) return false

        //channelTypes
        if (optA.channelTypes.length != optB.channelTypes.length) return false
        if (!optA.channelTypes.every((typeA) => {
            return optB.channelTypes.includes(typeA)
        })) return false

        //options
        if (optA.options.length != optB.options.length) return false
        if (!optA.options.every((subOptA,index) => {
            return this.compareOption(subOptA,optB.options[index])
        })) return false

        return true
    }
    /**Returns `true` when the 2 slash commands are the same. */
    compare(cmdA:ODSlashCommandUniversalCommand,cmdB:ODSlashCommandUniversalCommand): boolean {
        if (cmdA.name != cmdB.name) return false
        if (cmdA.description != cmdB.description) return false
        if (cmdA.type != cmdB.type) return false
        if (cmdA.nsfw != cmdB.nsfw) return false
        if (cmdA.guildId != cmdB.guildId) return false
        if (cmdA.dmPermission != cmdB.dmPermission) return false
        if (cmdA.defaultMemberPermissions != cmdB.defaultMemberPermissions) return false

        //nameLocalizations
        if (cmdA.nameLocalizations.length != cmdB.nameLocalizations.length) return false
        if (!cmdA.nameLocalizations.every((nameA) => {
            const nameB = cmdB.nameLocalizations.find((nameB) => nameB.language == nameA.language)
            if (!nameB || nameA.value != nameB.value) return false
            else return true
        })) return false
        
        //descriptionLocalizations
        if (cmdA.descriptionLocalizations.length != cmdB.descriptionLocalizations.length) return false
        if (!cmdA.descriptionLocalizations.every((descA) => {
            const descB = cmdB.descriptionLocalizations.find((descB) => descB.language == descA.language)
            if (!descB || descA.value != descB.value) return false
            else return true
        })) return false

        //contexts
        if (cmdA.contexts.length != cmdB.contexts.length) return false
        if (!cmdA.contexts.every((contextA) => {
            return cmdB.contexts.includes(contextA)
        })) return false

        //integrationTypes
        if (cmdA.integrationTypes.length != cmdB.integrationTypes.length) return false
        if (!cmdA.integrationTypes.every((integrationA) => {
            return cmdB.integrationTypes.includes(integrationA)
        })) return false

        //options
        if (cmdA.options.length != cmdB.options.length) return false
        if (!cmdA.options.every((optA,index) => {
            return this.compareOption(optA,cmdB.options[index])
        })) return false

        return true
    }
}

/**## ODSlashCommandInteractionCallback `type`
 * Callback for the slash command interaction listener.
 */
export type ODSlashCommandInteractionCallback = (interaction:discord.ChatInputCommandInteraction,cmd:ODSlashCommand) => void

/**## ODSlashCommandRegisteredResult `type`
 * The result which will be returned when getting all (un)registered slash commands from the manager.
 */
export type ODSlashCommandRegisteredResult = {
    /**A list of all registered commands. */
    registered:{
        /**The instance (`ODSlashCommand`) from this command. */
        instance:ODSlashCommand,
        /**The (universal) slash command object/template of this command. */
        cmd:ODSlashCommandUniversalCommand,
        /**Does this command require an update? */
        requiresUpdate:boolean
    }[],
    /**A list of all unregistered commands. */
    unregistered:{
        /**The instance (`ODSlashCommand`) from this command. */
        instance:ODSlashCommand,
        /**The (universal) slash command object/template of this command. */
        cmd:null,
        /**Does this command require an update? */
        requiresUpdate:true
    }[],
    /**A list of all unused commands (not found in `ODSlashCommandManager`). */
    unused:{
        /**The instance (`ODSlashCommand`) from this command. */
        instance:null,
        /**The (universal) slash command object/template of this command. */
        cmd:ODSlashCommandUniversalCommand,
        /**Does this command require an update? */
        requiresUpdate:false
    }[]
}

/**## ODSlashCommandManager `class`
 * This is an open ticket client slash manager.
 * 
 * It's responsible for managing all the slash commands from the client.
 * 
 * Here, you can add & remove slash commands & the bot will do the (de)registering.
 */
export class ODSlashCommandManager extends ODManager<ODSlashCommand> {
    /**Alias to open ticket debugger. */
    #debug: ODDebugger
    
    /**Refrerence to discord.js client. */
    manager: ODClientManager
    /**Discord.js application commands manager. */
    commandManager: discord.ApplicationCommandManager|null
    /**Collection of all interaction listeners. */
    #interactionListeners: {name:string|RegExp, callback:ODSlashCommandInteractionCallback}[] = []
    /**Set the soft limit for maximum amount of listeners. A warning will be shown when there are more listeners than this limit. */
    listenerLimit: number = 100
    /**A utility class used to compare 2 slash commands with each other. */
    comparator: ODSlashCommandComparator = new ODSlashCommandComparator()

    constructor(debug:ODDebugger, manager:ODClientManager){
        super(debug,"slash command")
        this.#debug = debug
        this.manager = manager
        this.commandManager = (manager.client.application) ? manager.client.application.commands : null
    }

    /**Get all registered & unregistered slash commands. */
    async getAllRegisteredCommands(guildId?:string): Promise<ODSlashCommandRegisteredResult> {
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        
        const cmds = (await this.commandManager.fetch({guildId})).toJSON()
        const registered: {instance:ODSlashCommand, cmd:ODSlashCommandUniversalCommand, requiresUpdate:boolean}[] = []
        const unregistered: {instance:ODSlashCommand, cmd:null, requiresUpdate:true}[] = []
        const unused: {instance:null, cmd:ODSlashCommandUniversalCommand, requiresUpdate:false}[] = []

        await this.loopAll((instance) => {
            if (guildId && instance.guildId != guildId) return
            
            const index = cmds.findIndex((cmd) => cmd.name == instance.name)
            const cmd = cmds[index]
            cmds.splice(index,1)
            if (cmd){
                //command is registered (and may need to be updated)
                const universalBuilder = this.comparator.convertBuilder(instance.builder,instance.guildId)
                const universalCmd = this.comparator.convertCommand(cmd)
                const didChange = !this.comparator.compare(universalBuilder,universalCmd)
                const requiresUpdate = didChange || (instance.requiresUpdate ? instance.requiresUpdate(universalCmd) : false)
                registered.push({instance,cmd:universalCmd,requiresUpdate})
                
                //command is not registered
            }else unregistered.push({instance,cmd:null,requiresUpdate:true})
        })

        cmds.forEach((cmd) => {
            //command does not exist in the manager
            unused.push({instance:null,cmd:this.comparator.convertCommand(cmd),requiresUpdate:false})
        })

        return {registered,unregistered,unused}
    }
    /**Create all commands that are not registered yet.*/
    async createNewCommands(instances:ODSlashCommand[],progress?:ODManualProgressBar){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        if (instances.length > 0 && progress){
            progress.max = instances.length
            progress.start()
        }

        for (const instance of instances){
            await this.createCmd(instance)
            this.#debug.debug("Created new slash command",[
                {key:"id",value:instance.id.value},
                {key:"name",value:instance.name}
            ])
            if (progress) progress.increase(1)
        }
    }
    /**Update all commands that are already registered. */
    async updateExistingCommands(instances:ODSlashCommand[],progress?:ODManualProgressBar){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        if (instances.length > 0 && progress){
            progress.max = instances.length
            progress.start()
        }

        for (const instance of instances){
            await this.createCmd(instance)
            this.#debug.debug("Updated existing slash command",[{key:"id",value:instance.id.value},{key:"name",value:instance.name}])
            if (progress) progress.increase(1)
        }
    }
    /**Remove all commands that are registered but unused by Open Ticket. */
    async removeUnusedCommands(instances:ODSlashCommandUniversalCommand[],guildId?:string,progress?:ODManualProgressBar){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        if (instances.length > 0 && progress){
            progress.max = instances.length
            progress.start()
        }

        const cmds = await this.commandManager.fetch({guildId})
        
        for (const instance of instances){
            const cmd = cmds.find((cmd) => cmd.name == instance.name)
            if (cmd){
                try {
                    await cmd.delete()
                    this.#debug.debug("Removed existing slash command",[{key:"name",value:cmd.name},{key:"guildId",value:guildId ?? "/"}])
                }catch(err){
                    process.emit("uncaughtException",err)
                    throw new ODSystemError("Failed to delete slash command '/"+cmd.name+"'!")
                }
            }
            if (progress) progress.increase(1)
        }
    }
    /**Create a slash command. **(SYSTEM ONLY)** => Use `ODSlashCommandManager` for registering commands the default way! */
    async createCmd(cmd:ODSlashCommand){
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        try {
            await this.commandManager.create(cmd.builder,(cmd.guildId ?? undefined))
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Failed to register slash command '/"+cmd.name+"'!")
        }
    }
    /**Start listening to the discord.js client `interactionCreate` event. */
    startListeningToInteractions(){
        this.manager.client.on("interactionCreate",(interaction) => {
            //return when not in main server or DM
            if (!this.manager.mainServer || (interaction.guild && interaction.guild.id != this.manager.mainServer.id)) return

            if (!interaction.isChatInputCommand()) return
            const cmd = this.getFiltered((cmd) => cmd.name == interaction.commandName)[0]
            if (!cmd) return

            this.#interactionListeners.forEach((listener) => {
                if (typeof listener.name == "string" && (interaction.commandName != listener.name)) return
                else if (listener.name instanceof RegExp && !listener.name.test(interaction.commandName)) return

                //this is a valid listener
                listener.callback(interaction,cmd)
            })
        })
    }
    /**Callback on interaction from one or multiple slash commands. */
    onInteraction(commandName:string|RegExp, callback:ODSlashCommandInteractionCallback){
        this.#interactionListeners.push({
            name:commandName,
            callback
        })

        if (this.#interactionListeners.length > this.listenerLimit){
            this.#debug.console.log(new ODConsoleWarningMessage("Possible slash command interaction memory leak detected!",[
                {key:"listeners",value:this.#interactionListeners.length.toString()}
            ]))
        }
    }
}

/**## ODSlashCommandUpdateFunction `type`
 * The function responsible for updating slash commands when they already exist.
 */
export type ODSlashCommandUpdateFunction = (command:ODSlashCommandUniversalCommand) => boolean

/**## ODSlashCommand `class`
 * This is an open ticket slash command.
 * 
 * When registered, you can listen for this command using the `ODCommandResponder`. The advantages of using this class for creating a slash command are:
 * - automatic option parsing (even for channels, users, roles & mentions)!
 * - automatic registration in discord.js
 * - error reporting to the user when the bot fails to respond
 * - plugins can extend this command
 * - the bot won't re-register the command when it already exists (except when requested)!
 * 
 * And more!
 */
export class ODSlashCommand extends ODManagerData {
    /**The discord.js builder for this slash command. */
    builder: ODSlashCommandBuilder
    /**The id of the guild this command is for. Null when not set. */
    guildId: string|null
    /**Function to check if the slash command requires to be updated (when it already exists). */
    requiresUpdate: ODSlashCommandUpdateFunction|null = null

    constructor(id:ODValidId, builder:ODSlashCommandBuilder, requiresUpdate?:ODSlashCommandUpdateFunction, guildId?:string){
        super(id)
        if (builder.type != discord.ApplicationCommandType.ChatInput) throw new ODSystemError("ApplicationCommandData is required to be the 'ChatInput' type!")
        
        this.builder = builder
        this.guildId = guildId ?? null
        this.requiresUpdate = requiresUpdate ?? null
    }

    /**The name of this slash command. */
    get name(): string {
        return this.builder.name
    }
    set name(name:string){
        this.builder.name = name
    }
}

/**## ODTextCommandBuilderBaseOptionType `type`
 * The types available in the text command option builder.
 */
export type ODTextCommandBuilderBaseOptionType = "string"|"number"|"boolean"|"user"|"guildmember"|"role"|"mentionable"|"channel"

/**## ODTextCommandBuilderBaseOption `interface`
 * The default option builder for text commands.
 */
export interface ODTextCommandBuilderBaseOption {
    /**The name of this option */
    name:string,
    /**The type of this option */
    type:ODTextCommandBuilderBaseOptionType,
    /**Is this option required? (optional options can only exist at the end of the command!) */
    required?:boolean
}

/**## ODTextCommandBuilderStringOption `interface`
 * The string option builder for text commands.
 */
export interface ODTextCommandBuilderStringOption extends ODTextCommandBuilderBaseOption {
    type:"string",
    /**Set the maximum length of this string */
    maxLength?:number,
    /**Set the minimum length of this string */
    minLength?:number,
    /**The string needs to match this regex or it will be invalid */
    regex?:RegExp,
    /**The string needs to match one of these choices or it will be invalid */
    choices?:string[],
    /**When this is the last option, allow this string to contain spaces */
    allowSpaces?:boolean
}

/**## ODTextCommandBuilderNumberOption `interface`
 * The number option builder for text commands.
 */
export interface ODTextCommandBuilderNumberOption extends ODTextCommandBuilderBaseOption {
    type:"number",
    /**The number can't be higher than this value */
    max?:number,
    /**The number can't be lower than this value */
    min?:number,
    /**Allow the number to be negative */
    allowNegative?:boolean,
    /**Allow the number to be positive */
    allowPositive?:boolean,
    /**Allow the number to be zero */
    allowZero?:boolean,
    /**Allow a number with decimal */
    allowDecimal?:boolean
}

/**## ODTextCommandBuilderBooleanOption `interface`
 * The boolean option builder for text commands.
 */
export interface ODTextCommandBuilderBooleanOption extends ODTextCommandBuilderBaseOption {
    type:"boolean",
    /**The value when `true` */
    trueValue?:string,
    /**The value when `false` */
    falseValue?:string
}

/**## ODTextCommandBuilderChannelOption `interface`
 * The channel option builder for text commands.
 */
export interface ODTextCommandBuilderChannelOption extends ODTextCommandBuilderBaseOption {
    type:"channel",
    /**When specified, only allow the following channel types */
    channelTypes?:discord.GuildChannelType[]
}

/**## ODTextCommandBuilderRoleOption `interface`
 * The role option builder for text commands.
 */
export interface ODTextCommandBuilderRoleOption extends ODTextCommandBuilderBaseOption {
    type:"role"
}

/**## ODTextCommandBuilderUserOption `interface`
 * The user option builder for text commands.
 */
export interface ODTextCommandBuilderUserOption extends ODTextCommandBuilderBaseOption {
    type:"user"
}

/**## ODTextCommandBuilderGuildMemberOption `interface`
 * The guild member option builder for text commands.
 */
export interface ODTextCommandBuilderGuildMemberOption extends ODTextCommandBuilderBaseOption {
    type:"guildmember"
}

/**## ODTextCommandBuilderMentionableOption `interface`
 * The mentionable option builder for text commands.
 */
export interface ODTextCommandBuilderMentionableOption extends ODTextCommandBuilderBaseOption {
    type:"mentionable"
}

/**## ODTextCommandBuilderOption `type`
 * The option builder for text commands.
 */
export type ODTextCommandBuilderOption = (
    ODTextCommandBuilderStringOption|
    ODTextCommandBuilderBooleanOption|
    ODTextCommandBuilderNumberOption|
    ODTextCommandBuilderChannelOption|
    ODTextCommandBuilderRoleOption|
    ODTextCommandBuilderUserOption|
    ODTextCommandBuilderGuildMemberOption|
    ODTextCommandBuilderMentionableOption
)

/**## ODTextCommandBuilder `interface`
 * The builder for text commands. Here you can add options to the command.
 */
export interface ODTextCommandBuilder {
    /**The prefix of this command */
    prefix:string,
    /**The name of this command (can include spaces for subcommands) */
    name:string,
    /**Is this command allowed in dm? */
    dmPermission?:boolean,
    /**Is this command allowed in guilds? */
    guildPermission?:boolean,
    /**When specified, only allow this command to be executed in the following guilds */
    allowedGuildIds?:string[],
    /**Are bots allowed to execute this command? */
    allowBots?:boolean
    /**The options for this text command (like slash commands) */
    options?:ODTextCommandBuilderOption[]
}

/**## ODTextCommand `class`
 * This is an open ticket text command.
 * 
 * When registered, you can listen for this command using the `ODCommandResponder`. The advantages of using this class for creating a text command are:
 * - automatic option parsing (even for channels, users, roles & mentions)!
 * - automatic errors on invalid parameters
 * - error reporting to the user when the bot fails to respond
 * - plugins can extend this command
 * 
 * And more!
 */
export class ODTextCommand extends ODManagerData {
    /**The builder for this slash command. */
    builder: ODTextCommandBuilder
    /**The name of this slash command. */
    name: string

    constructor(id:ODValidId, builder:ODTextCommandBuilder){
        super(id)
        this.builder = builder
        this.name = builder.name
    }
}

/**## ODTextCommandInteractionOptionBase `interface`
 * The object returned for options from a text command interaction.
 */
export interface ODTextCommandInteractionOptionBase<Name,Type> {
    /**The name of this option */
    name:string,
    /**The type of this option */
    type:Name,
    /**The value of this option */
    value:Type
}

/**## ODTextCommandInteractionOption `type`
 * A list of types returned for options from a text command interaction.
 */
export type ODTextCommandInteractionOption = (
    ODTextCommandInteractionOptionBase<"string",string>|
    ODTextCommandInteractionOptionBase<"number",number>|
    ODTextCommandInteractionOptionBase<"boolean",boolean>|
    ODTextCommandInteractionOptionBase<"channel",discord.GuildBasedChannel>|
    ODTextCommandInteractionOptionBase<"role",discord.Role>|
    ODTextCommandInteractionOptionBase<"user",discord.User>|
    ODTextCommandInteractionOptionBase<"guildmember",discord.GuildMember>|
    ODTextCommandInteractionOptionBase<"mentionable",discord.Role|discord.User>
)

/**## ODTextCommandInteractionCallback `type`
 * Callback for the text command interaction listener.
 */
export type ODTextCommandInteractionCallback = (msg:discord.Message, cmd:ODTextCommand, options:ODTextCommandInteractionOption[]) => void

/**## ODTextCommandErrorBase `interface`
 * The object returned from a text command error callback.
 */
export interface ODTextCommandErrorBase {
    /**The type of text command error */
    type:"unknown_prefix"|"unknown_command"|"invalid_option"|"missing_option",
    /**The message this error originates from */
    msg:discord.Message
}

/**## ODTextCommandErrorUnknownPrefix `interface`
 * The object returned from a text command unknown prefix error callback.
 */
export interface ODTextCommandErrorUnknownPrefix extends ODTextCommandErrorBase {
    type:"unknown_prefix"
}

/**## ODTextCommandErrorUnknownCommand `interface`
 * The object returned from a text command unknown command error callback.
 */
export interface ODTextCommandErrorUnknownCommand extends ODTextCommandErrorBase {
    type:"unknown_command"
}

/**## ODTextCommandErrorInvalidOptionReason `type`
 * A list of reasons for the invalid_option error to be thrown.
 */
export type ODTextCommandErrorInvalidOptionReason = (
    "boolean"|
    "number_max"|
    "number_min"|
    "number_decimal"|
    "number_negative"|
    "number_positive"|
    "number_zero"|
    "number_invalid"|
    "string_max_length"|
    "string_min_length"|
    "string_regex"|
    "string_choice"|
    "not_in_guild"|
    "channel_not_found"|
    "channel_type"|
    "user_not_found"|
    "member_not_found"|
    "role_not_found"|
    "mentionable_not_found"
)

/**## ODTextCommandErrorInvalidOption `interface`
 * The object returned from a text command invalid option error callback.
 */
export interface ODTextCommandErrorInvalidOption extends ODTextCommandErrorBase {
    type:"invalid_option",
    /**The command this error originates from */
    command:ODTextCommand,
    /**The command prefix this error originates from */
    prefix:string,
    /**The command name this error originates from (can include spaces for subcommands) */
    name:string,
    /**The option that this error originates from */
    option:ODTextCommandBuilderOption
    /**The location that this option was found */
    location:number,
    /**The current value of this invalid option */
    value:string,
    /**The reason for this invalid option */
    reason:ODTextCommandErrorInvalidOptionReason
}

/**## ODTextCommandErrorMissingOption `interface`
 * The object returned from a text command missing option error callback.
 */
export interface ODTextCommandErrorMissingOption extends ODTextCommandErrorBase {
    type:"missing_option",
    /**The command this error originates from */
    command:ODTextCommand,
    /**The command prefix this error originates from */
    prefix:string,
    /**The command name this error originates from (can include spaces for subcommands) */
    name:string,
    /**The option that this error originates from */
    option:ODTextCommandBuilderOption
    /**The location that this option was found */
    location:number
}

/**## ODTextCommandError `type`
 * A list of types returned for errors from a text command interaction.
 */
export type ODTextCommandError = (
    ODTextCommandErrorUnknownPrefix|
    ODTextCommandErrorUnknownCommand|
    ODTextCommandErrorInvalidOption|
    ODTextCommandErrorMissingOption
)

/**## ODTextCommandErrorCallback `type`
 * Callback for the text command error listener.
 */
export type ODTextCommandErrorCallback = (error:ODTextCommandError) => void

/**## ODTextCommandManager `class`
 * This is an open ticket client text manager.
 * 
 * It's responsible for managing all the text commands from the client.
 * 
 * Here, you can add & remove text commands & the bot will do the (de)registering.
 */
export class ODTextCommandManager extends ODManager<ODTextCommand> {
    /**Alias to open ticket debugger. */
    #debug: ODDebugger
    /**Copy of discord.js client. */
    manager: ODClientManager
    /**Collection of all interaction listeners. */
    #interactionListeners: {prefix:string, name:string|RegExp, callback:ODTextCommandInteractionCallback}[] = []
    /**Collection of all error listeners. */
    #errorListeners: ODTextCommandErrorCallback[] = []
    /**Set the soft limit for maximum amount of listeners. A warning will be shown when there are more listeners than this limit. */
    listenerLimit: number = 100

    constructor(debug:ODDebugger, manager:ODClientManager){
        super(debug,"text command")
        this.#debug = debug
        this.manager = manager
    }
    
    /*Check if a message is a registered command. */
    async #checkMessage(msg:discord.Message){
        if (this.manager.client.user && msg.author.id == this.manager.client.user.id) return false

        //filter commands for correct prefix
        const validPrefixCommands: {cmd:ODTextCommand,newContent:string}[] = []
        await this.loopAll((cmd) => {
            if (msg.content.startsWith(cmd.builder.prefix)) validPrefixCommands.push({
                cmd:cmd,
                newContent:msg.content.substring(cmd.builder.prefix.length)
            })
        })

        //return when no command with prefix
        if (validPrefixCommands.length == 0){
                this.#errorListeners.forEach((cb) => cb({
                type:"unknown_prefix",
                msg:msg
            }))
            return false
        }

        //filter commands for correct name
        const validNameCommands: {cmd:ODTextCommand,newContent:string}[] = []
        validPrefixCommands.forEach((cmd) => {
            if (cmd.newContent.startsWith(cmd.cmd.builder.name+" ") || cmd.newContent == cmd.cmd.builder.name) validNameCommands.push({
                cmd:cmd.cmd,
                newContent:cmd.newContent.substring(cmd.cmd.builder.name.length+1) //+1 because of space after command name
            })
        })

        //return when no command with name
        if (validNameCommands.length == 0){
            this.#errorListeners.forEach((cb) => cb({
                type:"unknown_command",
                msg:msg
            }))
            return false
        }

        //the final command
        const command = validNameCommands[0]
        const builder = command.cmd.builder

        //check additional options
        if (typeof builder.allowBots != "undefined" && !builder.allowBots && msg.author.bot) return false
        else if (typeof builder.dmPermission != "undefined" && !builder.dmPermission && msg.channel.type == discord.ChannelType.DM) return false
        else if (typeof builder.guildPermission != "undefined" && !builder.guildPermission && msg.guild) return false
        else if (typeof builder.allowedGuildIds != "undefined" && msg.guild && !builder.allowedGuildIds.includes(msg.guild.id)) return false
        
        //check all command options & return when incorrect
        const options = await this.#checkOptions(command.cmd,command.newContent,msg)
        if (!options.valid) return false

        //a command matched this message => emit event
        this.#interactionListeners.forEach((listener) => {
            if (typeof listener.prefix == "string" && (command.cmd.builder.prefix != listener.prefix)) return
            if (typeof listener.name == "string" && (command.cmd.name.split(" ")[0] != listener.name)) return
            else if (listener.name instanceof RegExp && !listener.name.test(command.cmd.name.split(" ")[0])) return

            //this is a valid listener
            listener.callback(msg,command.cmd,options.data)
        })
        return true
    }
    /**Check if all options of a command are correct. */
    async #checkOptions(cmd:ODTextCommand, newContent:string, msg:discord.Message){
        const options = cmd.builder.options
        if (!options) return {valid:true,data:[]}
        
        let tempContent = newContent
        let optionInvalid = false
        const optionData: ODTextCommandInteractionOption[] = []

        const optionError = (type:"invalid_option"|"missing_option", option:ODTextCommandBuilderOption, location:number, value?:string, reason?:ODTextCommandErrorInvalidOptionReason) => {
            //ERROR INVALID
            if (type == "invalid_option" && value && reason){
                this.#errorListeners.forEach((cb) => cb({
                    type:"invalid_option",
                    msg:msg,
                    prefix:cmd.builder.prefix,
                    command:cmd,
                    name:cmd.builder.name,
                    option,
                    location,
                    value,
                    reason
                }))
            }else if (type == "missing_option"){
                this.#errorListeners.forEach((cb) => cb({
                    type:"missing_option",
                    msg:msg,
                    prefix:cmd.builder.prefix,
                    command:cmd,
                    name:cmd.builder.name,
                    option,
                    location
                }))
            }
            optionInvalid = true
        }

        for (let location = 0;location < options.length;location++){
            const option = options[location]
            if (optionInvalid) break

            //CHECK BOOLEAN
            if (option.type == "boolean"){
                const falseValue = option.falseValue ?? "false"
                const trueValue = option.trueValue ?? "true"
                
                if (tempContent.startsWith(falseValue+" ")){
                    //FALSE VALUE
                    optionData.push({
                        name:option.name,
                        type:"boolean",
                        value:false
                    })
                    tempContent = tempContent.substring(falseValue.length+1)

                }else if (tempContent.startsWith(trueValue+" ")){
                    //TRUE VALUE
                    optionData.push({
                        name:option.name,
                        type:"boolean",
                        value:true
                    })
                    tempContent = tempContent.substring(trueValue.length+1)

                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidregex = /^[^ ]+/
                    const invalidRes = invalidregex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"boolean")
                    else optionError("missing_option",option,location)
                }
            
            //CHECK NUMBER
            }else if (option.type == "number"){
                const numRegex = /^[0-9\.\,]+/
                const res = numRegex.exec(tempContent)
                if (res){
                    const value = res[0].replace(/\,/g,".")
                    tempContent = tempContent.substring(value.length+1)
                    const numValue = Number(value)

                    if (isNaN(numValue)){
                        optionError("invalid_option",option,location,value,"number_invalid")

                    }else if (typeof option.allowDecimal == "boolean" && !option.allowDecimal && (numValue % 1) !== 0){
                        optionError("invalid_option",option,location,value,"number_decimal")

                    }else if (typeof option.allowNegative == "boolean" && !option.allowNegative && numValue < 0){
                        optionError("invalid_option",option,location,value,"number_negative")

                    }else if (typeof option.allowPositive == "boolean" && !option.allowPositive && numValue > 0){
                        optionError("invalid_option",option,location,value,"number_positive")

                    }else if (typeof option.allowZero == "boolean" && !option.allowZero && numValue == 0){
                        optionError("invalid_option",option,location,value,"number_zero")

                    }else if (typeof option.max == "number" && numValue > option.max){
                        optionError("invalid_option",option,location,value,"number_max")

                    }else if (typeof option.min == "number" && numValue < option.min){
                        optionError("invalid_option",option,location,value,"number_min")

                    }else{
                        //VALID NUMBER
                        optionData.push({
                            name:option.name,
                            type:"number",
                            value:numValue
                        })
                    }
                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"number_invalid")
                    else optionError("missing_option",option,location)
                }
            //CHECK STRING
            }else if (option.type == "string"){
                if (option.allowSpaces){
                    //STRING WITH SPACES
                    const value = tempContent
                    tempContent = ""

                    if (typeof option.minLength == "number" && value.length < option.minLength){
                        optionError("invalid_option",option,location,value,"string_min_length")

                    }else if (typeof option.maxLength == "number" && value.length > option.maxLength){
                        optionError("invalid_option",option,location,value,"string_max_length")

                    }else if (option.regex && !option.regex.test(value)){
                        optionError("invalid_option",option,location,value,"string_regex")

                    }else if (option.choices && !option.choices.includes(value)){
                        optionError("invalid_option",option,location,value,"string_choice")

                    }else if (option.required && value === ""){
                        //REQUIRED => ERROR IF NOD EXISTING
                        optionError("missing_option",option,location)
                        
                    }else{
                        //VALID STRING
                        optionData.push({
                            name:option.name,
                            type:"string",
                            value
                        })
                    }
                }else{
                    //STRING WITHOUT SPACES
                    const stringRegex = /^[^ ]+/
                    const res = stringRegex.exec(tempContent)
                    if (res){
                        const value = res[0]
                        tempContent = tempContent.substring(value.length+1)

                        if (typeof option.minLength == "number" && value.length < option.minLength){
                            optionError("invalid_option",option,location,value,"string_min_length")
                            
                        }else if (typeof option.maxLength == "number" && value.length > option.maxLength){
                            optionError("invalid_option",option,location,value,"string_max_length")

                        }else if (option.regex && !option.regex.test(value)){
                            optionError("invalid_option",option,location,value,"string_regex")

                        }else if (option.choices && !option.choices.includes(value)){
                            optionError("invalid_option",option,location,value,"string_choice")
    
                        }else{
                            //VALID STRING
                            optionData.push({
                                name:option.name,
                                type:"string",
                                value
                            })
                        }
                    }else if (option.required){
                        //REQUIRED => ERROR IF NOD EXISTING
                        optionError("missing_option",option,location)
                    }
                }
            //CHECK CHANNEL
            }else if (option.type == "channel"){
                const channelRegex = /^(?:<#)?([0-9]+)>?/
                const res = channelRegex.exec(tempContent)
                if (res){
                    const value = res[0]
                    tempContent = tempContent.substring(value.length+1)   
                    const channelId = res[1]

                    if (!msg.guild){
                        optionError("invalid_option",option,location,value,"not_in_guild")
                    }else{
                        try{
                            const channel = await msg.guild.channels.fetch(channelId)
                            if (!channel){
                                optionError("invalid_option",option,location,value,"channel_not_found")

                            }else if (option.channelTypes && !option.channelTypes.includes(channel.type)){
                                optionError("invalid_option",option,location,value,"channel_type")

                            }else{
                                //VALID CHANNEL
                                optionData.push({
                                    name:option.name,
                                    type:"channel",
                                    value:channel
                                })
                            }
                        }catch{
                            optionError("invalid_option",option,location,value,"channel_not_found")
                        }
                    }  
                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"channel_not_found")
                    else optionError("missing_option",option,location)
                }
            //CHECK ROLE
            }else if (option.type == "role"){
                const roleRegex = /^(?:<@&)?([0-9]+)>?/
                const res = roleRegex.exec(tempContent)
                if (res){
                    const value = res[0]
                    tempContent = tempContent.substring(value.length+1)   
                    const roleId = res[1]

                    if (!msg.guild){
                        optionError("invalid_option",option,location,value,"not_in_guild")
                    }else{
                        try{
                            const role = await msg.guild.roles.fetch(roleId)
                            if (!role){
                                optionError("invalid_option",option,location,value,"role_not_found")
                            }else{
                                //VALID ROLE
                                optionData.push({
                                    name:option.name,
                                    type:"role",
                                    value:role
                                })
                            }
                        }catch{
                            optionError("invalid_option",option,location,value,"role_not_found")
                        }
                    }
                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"role_not_found")
                    else optionError("missing_option",option,location)
                }
            //CHECK GUILD MEMBER
            }else if (option.type == "guildmember"){
                const memberRegex = /^(?:<@)?([0-9]+)>?/
                const res = memberRegex.exec(tempContent)
                if (res){
                    const value = res[0]
                    tempContent = tempContent.substring(value.length+1)   
                    const memberId = res[1]

                    if (!msg.guild){
                        optionError("invalid_option",option,location,value,"not_in_guild")
                    }else{
                        try{
                            const member = await msg.guild.members.fetch(memberId)
                            if (!member){
                                optionError("invalid_option",option,location,value,"member_not_found")
                            }else{
                                //VALID GUILD MEMBER
                                optionData.push({
                                    name:option.name,
                                    type:"guildmember",
                                    value:member
                                })
                            }
                        }catch{
                            optionError("invalid_option",option,location,value,"member_not_found")
                        }
                    }
                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"member_not_found")
                    else optionError("missing_option",option,location)
                }
            //CHECK USER
            }else if (option.type == "user"){
                const userRegex = /^(?:<@)?([0-9]+)>?/
                const res = userRegex.exec(tempContent)
                if (res){
                    const value = res[0]
                    tempContent = tempContent.substring(value.length+1)   
                    const userId = res[1]

                    try{
                        const user = await this.manager.client.users.fetch(userId)
                        if (!user){
                            optionError("invalid_option",option,location,value,"user_not_found")
                        }else{
                            //VALID USER
                            optionData.push({
                                name:option.name,
                                type:"user",
                                value:user
                            })
                        }
                    }catch{
                        optionError("invalid_option",option,location,value,"user_not_found")
                    }
                }else if (option.required){
                    //REQUIRED => ERROR IF NOD EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"user_not_found")
                    else optionError("missing_option",option,location)
                }
            //CHECK MENTIONABLE
            }else if (option.type == "mentionable"){
                const mentionableRegex = /^<(@&?)([0-9]+)>/
                const res = mentionableRegex.exec(tempContent)
                if (res){
                    const value = res[0]
                    const type = (res[1] == "@&") ? "role" : "user"
                    tempContent = tempContent.substring(value.length+1)   
                    const mentionableId = res[2]

                    if (!msg.guild){
                        optionError("invalid_option",option,location,value,"not_in_guild")
                    }else if (type == "role"){
                        try {
                            const role = await msg.guild.roles.fetch(mentionableId)
                            if (!role){
                                optionError("invalid_option",option,location,value,"mentionable_not_found")
                            }else{
                                //VALID ROLE
                                optionData.push({
                                    name:option.name,
                                    type:"mentionable",
                                    value:role
                                })
                            }
                        }catch{
                            optionError("invalid_option",option,location,value,"mentionable_not_found")
                        }
                    }else if (type == "user"){
                        try{
                            const user = await this.manager.client.users.fetch(mentionableId)
                            if (!user){
                                optionError("invalid_option",option,location,value,"mentionable_not_found")
                            }else{
                                //VALID USER
                                optionData.push({
                                    name:option.name,
                                    type:"mentionable",
                                    value:user
                                })
                            }
                        }catch{
                            optionError("invalid_option",option,location,value,"mentionable_not_found")
                        }
                    }
                }else if (option.required){
                    //REQUIRED => ERROR IF NOT EXISTING
                    const invalidRegex = /^[^ ]+/
                    const invalidRes = invalidRegex.exec(tempContent)
                    if (invalidRes) optionError("invalid_option",option,location,invalidRes[0],"mentionable_not_found")
                    else optionError("missing_option",option,location)
                }
            }
        }
        return {valid:!optionInvalid,data:optionData}
    }
    /**Start listening to the discord.js client `messageCreate` event. */
    startListeningToInteractions(){
        this.manager.client.on("messageCreate",(msg) => {
            //return when not in main server or DM
            if (!this.manager.mainServer || (msg.guild && msg.guild.id != this.manager.mainServer.id)) return
            this.#checkMessage(msg)
        })
    }
    /**Check if optional values are only present at the end of the command. */
    #checkBuilderOptions(builder:ODTextCommandBuilder): {valid:boolean,reason:"required_after_optional"|"allowspaces_not_last"|null} {
        let optionalVisited = false
        let valid = true
        let reason: "required_after_optional"|"allowspaces_not_last"|null = null
        if (!builder.options) return {valid:true,reason:null}
        builder.options.forEach((opt,index,list) => {
            if (!opt.required) optionalVisited = true
            if (optionalVisited && opt.required){
                valid = false
                reason = "required_after_optional"
            }

            if (opt.type == "string" && opt.allowSpaces && ((index+1) != list.length)){
                valid = false
                reason = "allowspaces_not_last"
            }
        })

        return {valid,reason}
    }
    /**Callback on interaction from one of the registered text commands */
    onInteraction(commandPrefix:string,commandName:string|RegExp, callback:ODTextCommandInteractionCallback){
        this.#interactionListeners.push({
            prefix:commandPrefix,
            name:commandName,
            callback
        })

        if (this.#interactionListeners.length > this.listenerLimit){
            this.#debug.console.log(new ODConsoleWarningMessage("Possible text command interaction memory leak detected!",[
                {key:"listeners",value:this.#interactionListeners.length.toString()}
            ]))
        }
    }
    /**Callback on error from all the registered text commands */
    onError(callback:ODTextCommandErrorCallback){
        this.#errorListeners.push(callback)
    }

    add(data:ODTextCommand, overwrite?:boolean): boolean {
        const checkResult = this.#checkBuilderOptions(data.builder)
        if (!checkResult.valid && checkResult.reason == "required_after_optional") throw new ODSystemError("Invalid text command '"+data.id.value+"' => optional options are only allowed at the end of a command!")
        else if (!checkResult.valid && checkResult.reason == "allowspaces_not_last") throw new ODSystemError("Invalid text command '"+data.id.value+"' => string option with 'allowSpaces' is only allowed at the end of a command!")
        else return super.add(data,overwrite)
    }
}