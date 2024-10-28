///////////////////////////////////////
//DISCORD CLIENT MODULE
///////////////////////////////////////
import { ODId, ODManager, ODManagerData, ODSystemError, ODValidId } from "./base"
import * as discord from "discord.js"
import { ODConsoleWarningMessage, ODDebugger } from "./console"
import { ODMessageBuildResult, ODMessageBuildSentResult } from "./builder"

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
    /**The bot token, empty by default. */
    token: string = ""
    
    /**The discord.js `discord.Client`. Only use it when initiated! */
    client: discord.Client<true> = new discord.Client({intents:[]}) //temporary client
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
                if (err.message.toLowerCase() == "used disallowed intents"){
                    process.emit("uncaughtException",new ODSystemError("Used disallowed intents"))
                }else reject("login error: "+err)
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
                state:text,
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

/**## ODSlashCommandInteractionCallback `type`
 * Callback for the slash command interaction listener.
 */
export type ODSlashCommandInteractionCallback = (interaction:discord.ChatInputCommandInteraction,cmd:ODSlashCommand) => void

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
    
    /**Copy of discord.js client. */
    manager: ODClientManager
    /**Discord.js application commands manager. */
    commandManager: discord.ApplicationCommandManager|null
    /**Collection of all interaction listeners. */
    #interactionListeners: {name:string|RegExp, callback:ODSlashCommandInteractionCallback}[] = []
    /**Set the soft limit for maximum amount of listeners. A warning will be shown when there are more listeners than this limit. */
    listenerLimit: number = 100

    constructor(debug:ODDebugger, manager:ODClientManager){
        super(debug,"slash command")
        this.#debug = debug
        this.manager = manager
        this.commandManager = (manager.client.application) ? manager.client.application.commands : null
    }

    /**Create all commands that don't exist yet. (global by default OR guildId for per-server) */
    async createNewCommands(guildId?:string){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        const cmds = await this.#existsCmd(guildId)

        let i = 0
        while (i < cmds.nonExisting.length){
            await this.#createCmd(cmds.nonExisting[i])
            this.#debug.debug("Created new slash command",[{key:"id",value:cmds.nonExisting[i].id.value},{key:"name",value:cmds.nonExisting[i].name}])
            i++
        }
    }
    /**Update all commands that already exist. (global by default OR guildId for per-server) */
    async updateExistingCommands(guildId?:string,force?:boolean){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        const cmds = await this.#existsCmd(guildId)
        const filtered = cmds.existing.filter((cmd) => (cmd.requiresUpdate == true || force))
        
        for (const cmd of filtered){
            await this.#createCmd(cmd.cmd)
            this.#debug.debug("Updated existing slash command",[
                {key:"id",value:cmd.cmd.id.value},
                {key:"name",value:cmd.cmd.name},
                {key:"force",value:force ? "true" : "false"}
            ])
        }
    }
    /**Remove all commands that exist but aren't used by open ticket. (global by default OR guildId for per-server) */
    async removeUnusedCommands(guildId?:string){
        if (!this.manager.ready) throw new ODSystemError("Client isn't ready yet! Unable to register slash commands!")
        const cmds = (await this.#unusedCmd(guildId)).map((cmd) => cmd.name)
        await this.#removeCmd(cmds,guildId)
    }
    /**Create a slash command from an `ODSlashCommand` class */
    async #createCmd(cmd:ODSlashCommand){
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        try {
            await this.commandManager.create(cmd.builder,(cmd.guildId ?? undefined))
        }catch(err){
            process.emit("uncaughtException",err)
            throw new ODSystemError("Failed to register slash command '/"+cmd.name+"'!")
        }
    }
    /**Remove slash cmds by name */
    async #removeCmd(names:string[],guildId?:string){
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")

        const cmds = await this.commandManager.fetch({guildId})
        
        cmds?.forEach((cmd) => {
            if (!names.includes(cmd.name)) return
            cmd.delete()
            this.#debug.debug("Removed existing slash command",[{key:"name",value:cmd.name}])
        })
    }
    /**Get all existing & non-existing slash commands. */
    async #existsCmd(guildId?:string){
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        
        const cmds = await this.commandManager.fetch({guildId})
        const existing: {cmd:ODSlashCommand, requiresUpdate:boolean}[] = []
        const nonExisting: ODSlashCommand[] = []

        await this.loopAll((cmd) => {
            if (guildId && cmd.guildId != guildId) return
            const result = cmds.find((cmddata) => cmddata.name == cmd.name)
            if (result){
                //command already exists (and may need to be updated)
                const requiresUpdate = cmd.requiresUpdate ? cmd.requiresUpdate({
                    name:result.name,
                    description:result.description,
                    options:result.options as readonly discord.ApplicationCommandOptionData[],
                    nsfw:result.nsfw,
                    dmPermission:result.dmPermission ?? undefined,
                    defaultMemberPermissions:result.defaultMemberPermissions,
                    nameLocalizations:result.nameLocalizations ?? undefined,
                    descriptionLocalizations:result.descriptionLocalizations ?? undefined
                }) : false
                existing.push({cmd,requiresUpdate})
                
                //command doesn't exists yet
            }else nonExisting.push(cmd)
        })

        return {existing,nonExisting}
    }
    /**Get all unused slash commands. */
    async #unusedCmd(guildId?:string){
        if (!this.commandManager) throw new ODSystemError("Couldn't get client application to register slash commands!")
        
        const cmds = await this.commandManager.fetch({guildId})
        const unused: discord.ApplicationCommand[] = []

        const allCommands = this.getAll()
        cmds.forEach((cmddata) => {
            if (guildId && cmddata.guildId != guildId) return
            
            if (!allCommands.find((cmd) => {
                if (cmd.name != cmddata.name) return false
                if (cmd.builder.description != cmddata.description) return false
                return this.#checkUnusedOptions(cmddata.options,cmd.builder.options ?? [])

            })) unused.push(cmddata)
        })

        return unused
    }
    /**Returns `true` if the options are the same in both arrays. It will work recursively! */
    #checkUnusedOptions(currentOptions:readonly discord.ApplicationCommandOption[], newOptions:readonly discord.ApplicationCommandOptionData[]){
        if ((!newOptions || newOptions.length == 0) && currentOptions.length == 0) return true
        else if (newOptions && newOptions.length != currentOptions.length) return false

        if (!currentOptions.every((currentOpt,index) => {
            const newOpt = newOptions[index]
            if (newOpt.name != currentOpt.name) return false
            if (newOpt.type != currentOpt.type) return false
            if (newOpt.description != currentOpt.description) return false
            
            if (newOpt.type == discord.ApplicationCommandOptionType.Number && currentOpt.type == discord.ApplicationCommandOptionType.Number){
                //check for min & max values when type is number
                if (newOpt.minValue != currentOpt.minValue) return false
                if (newOpt.maxValue != currentOpt.maxValue) return false
            }
            if (newOpt.type == discord.ApplicationCommandOptionType.String && currentOpt.type == discord.ApplicationCommandOptionType.String){
                //check for min & max length values when type is string
                if (newOpt.minLength != currentOpt.minLength) return false
                if (newOpt.maxLength != currentOpt.maxLength) return false
            }

            //check for required normal options
            if (currentOpt.type != discord.ApplicationCommandOptionType.SubcommandGroup && currentOpt.type != discord.ApplicationCommandOptionType.Subcommand && newOpt.type != discord.ApplicationCommandOptionType.SubcommandGroup && newOpt.type != discord.ApplicationCommandOptionType.Subcommand){
                if (currentOpt.required != newOpt.required) return false
            
            //check for sub-options in subcommands
            }else if ((currentOpt.type == discord.ApplicationCommandOptionType.SubcommandGroup && newOpt.type == discord.ApplicationCommandOptionType.SubcommandGroup) || (currentOpt.type == discord.ApplicationCommandOptionType.Subcommand && newOpt.type == discord.ApplicationCommandOptionType.Subcommand)){
                if (currentOpt.options && newOpt.options){
                    return this.#checkUnusedOptions(currentOpt.options,newOpt.options)
                }
            }

            return true
        })) return false
        return true
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

/**## ODSlashCommandBuilder `interface`
 * The builder for slash commands. Here you can add options to the command.
 */
export interface ODSlashCommandBuilder extends discord.ChatInputApplicationCommandData {}

/**## ODSlashCommandUpdateFunction `type`
 * The function responsible for updating slash commands when they already exist.
 */
export type ODSlashCommandUpdateFunction = (current:ODSlashCommandBuilder) => boolean

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
    /**The name of this slash command. */
    name: string
    /**The id of the guild this command is for. Null when not set. */
    guildId: string|null
    /**Function to check if the slash command requires to be updated (when it already exists). */
    requiresUpdate: ODSlashCommandUpdateFunction|null = null

    constructor(id:ODValidId, builder:ODSlashCommandBuilder, requiresUpdate?:ODSlashCommandUpdateFunction, guildId?:string){
        super(id)
        if (builder.type != discord.ApplicationCommandType.ChatInput) throw new ODSystemError("ApplicationCommandData is required to be the 'ChatInput' type!")
        
        this.builder = builder
        this.name = builder.name
        this.guildId = guildId ?? null
        this.requiresUpdate = requiresUpdate ?? null
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