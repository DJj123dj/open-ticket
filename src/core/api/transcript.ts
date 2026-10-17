///////////////////////////////////////
//OPENTICKET TRANSCRIPT MODULE
///////////////////////////////////////
import * as api from "@open-discord-bots/framework/api"
import { ODTicket, ODTicketManager } from "./ticket.js"
import * as discord from "discord.js"

/**## ODTranscriptManagerIdConstraint `type`
 * The constraint/layout for id mappings/interfaces of the `ODTranscriptManager` class.
 */
export type ODTranscriptManagerIdConstraint = Record<string, ODTranscriptCompiler<any, null|object>>

/**## ODTranscriptManagerIdMappings `interface`
 * A list of all available IDs in the default `ODTranscriptManager` class in `opendiscord`.
 * It's used to generate typescript declarations for this class.
 */
export interface ODTranscriptManagerIdMappings extends ODTranscriptManagerIdConstraint {
    "opendiscord:html-compiler":ODTranscriptCompiler<{url:string, availableUntil:Date}, {auth:string}>,
    "opendiscord:text-compiler":ODTranscriptCompiler<{contents:string}, null>,
}

/**## ODTranscriptManager `class`
 * This is an Open Ticket transcript manager.
 *
 * This class manages all transcript generators in the bot.
 *
 * The 2 default built-in transcript generators are: `opendiscord:html-compiler` & `opendiscord:text-compiler`.
 */
export class ODTranscriptManager<IdList extends ODTranscriptManagerIdConstraint = ODTranscriptManagerIdConstraint>extends api.ODManager<ODTranscriptCompiler<any, null|object>> {
    /**The manager responsible for collecting all messages in a channel. */
    collector:ODTranscriptCollector
    /**Alias for the client manager. */
    private client:api.ODClientManager

    constructor(debug:api.ODDebugger, tickets:ODTicketManager, client:api.ODClientManager, permissions:api.ODPermissionManager) {
        super(debug, "transcript compiler")
        this.client = client
        this.collector = new ODTranscriptCollector(tickets, client, permissions)
    }

    get<CompilerId extends keyof api.ODNoGeneric<IdList>>(id:CompilerId): IdList[CompilerId]
    get(id:api.ODValidId): ODTranscriptCompiler<any, null|object>|null

    get(id:api.ODValidId): ODTranscriptCompiler<any, null|object>|null {
        return super.get(id)
    }

    remove<CompilerId extends keyof api.ODNoGeneric<IdList>>(id:CompilerId): IdList[CompilerId]
    remove(id:api.ODValidId): ODTranscriptCompiler<any, null|object>|null

    remove(id:api.ODValidId): ODTranscriptCompiler<any, null|object>|null {
        return super.remove(id)
    }

    exists(id:keyof api.ODNoGeneric<IdList>): boolean
    exists(id:api.ODValidId): boolean

    exists(id:api.ODValidId): boolean {
        return super.exists(id)
    }
}

/**## ODTranscriptHistoryData `interface`
 * The transcript data stored in the transcripts database of deleted tickets.
 */
export interface ODTranscriptHistoryData {
    ticketId:string,
    ticketName:string,
    ticketCreatorId:string,
    ticketCreatedDate:number|null,
    ticketDeletedDate:number|null,
    transcriptType:"localContents"|"remoteUrl",
    transcriptContents:string|null,
    transcriptUrl:string|null,
}

/**## ODMappedTranscriptManager `class
 * A special class with types for the Open Ticket `ODTranscriptManager` class.
 */
export class ODMappedTranscriptManager extends ODTranscriptManager<ODTranscriptManagerIdMappings> {}

/**## ODTranscriptCompilerInitFunction `type`
 * This function will initiate/prepare the transcript system for an incoming transcript.
 */
export type ODTranscriptCompilerInitFunction<InitData extends object|null> = (ticket:ODTicket, channel:discord.TextChannel, user:discord.User) => (ODTranscriptCompilerInitResult<InitData>)|Promise<ODTranscriptCompilerInitResult<InitData>>

/**## ODTranscriptCompilerCompileFunction `type`
 * This function will generate/compile the transcript itself.
 */
export type ODTranscriptCompilerCompileFunction<Data extends object, InitData extends object|null> = (ticket:ODTicket, channel:discord.TextChannel, user:discord.User, initData:InitData) => ODTranscriptCompilerCompileResult<Data>|Promise<ODTranscriptCompilerCompileResult<Data>>

/**## ODTicketClearFilter `type`
 * This function will finish, clear-up & shut-down the transcript system. This will also initiate the sending of the messages to all recipients.
 */
export type ODTranscriptCompilerReadyFunction<Data extends object> = (result:ODTranscriptCompilerCompileResult<Data>) => ODTranscriptCompilerReadyResult|Promise<ODTranscriptCompilerReadyResult>

/**## ODTranscriptCompilerInitResult `interface`
 * This is the result which is returned by the `init()` function.
 */
export interface ODTranscriptCompilerInitResult<InitData extends object|null> {
    /**Was the initialization successfull? */
    success:boolean,
    /**When not successfull, what was the reason? This will also be shown to the user. */
    errorReason:string|null,
    /**An optional message which will be sent while the transcript is being generated. */
    pendingMessage:api.ODMessageBuildResult|api.ODMessageComponentBuildResult|null,
    /**An optional object containing data from the init() function which can be used in the compiler. */
    initData:InitData,
}

/**## ODTranscriptCompilerCompileResult `interface`
 * This is the result which is returned by the `compile()` function.
 */
export interface ODTranscriptCompilerCompileResult<Data extends object> {
    /**The ticket this transcript is being created for. */
    ticket:ODTicket,
    /**The channel this transcript is being created for. */
    channel:discord.TextChannel,
    /**The user who created the transcript. */
    user:discord.User
    /**Was the compilation successfull? */
    success:boolean,
    /**When not successfull, what was the reason? This will also be shown to the user. */
    errorReason:string|null,
    /**A list of all messages sent in the ticket channel. */
    messages:ODTranscriptMessageData[]|null,
    /**The result returned by the `compiler()` function. Contains the transcript contents, url or something else. */
    data:Data|null
}

/**## ODTranscriptCompilerReadyResult `interface`
 * This is the result which is returned by the `ready()` function.
 */
export interface ODTranscriptCompilerReadyResult {
    /**The message to be sent in the specified channel in the server. */
    channelMessage?:api.ODMessageBuildResult|api.ODMessageComponentBuildResult,
    /**The message to be sent to the DM of the ticket creator. */
    creatorDmMessage?:api.ODMessageBuildResult|api.ODMessageComponentBuildResult,
    /**The message to be sent to the DM of all participants. */
    participantDmMessage?:api.ODMessageBuildResult|api.ODMessageComponentBuildResult,
    /**The message to be sent to the DM of all admins who actively participated in the ticket. */
    activeAdminDmMessage?:api.ODMessageBuildResult|api.ODMessageComponentBuildResult,
    /**The message to be sent to the DM of all admins who were assigned to this ticket. */
    everyAdminDmMessage?:api.ODMessageBuildResult|api.ODMessageComponentBuildResult
}

/**## ODTranscriptCompiler `class`
 * This is an Open Ticket transcript compiler.
 *
 * This class manages all functions to generate a transcript.
 *
 * These functions should be defined when creating this compiler. Existing compilers already exist for html & text transcripts.
 */
export class ODTranscriptCompiler<Data extends object, InitData extends (object|null)>extends api.ODManagerData {
    /*Initialise the system every time a transcript is created. Returns optional "pending" message to display while the transcript is being compiled. */
    init:ODTranscriptCompilerInitFunction<InitData>|null
    /*Compile or create the transcript. Returns data to give to the ready() function for message creation. */
    compile:ODTranscriptCompilerCompileFunction<Data, InitData>|null
    /*Unload the system & create the final transcript message that will be sent. */
    ready:ODTranscriptCompilerReadyFunction<Data>|null

    constructor(id:api.ODValidId, init?:ODTranscriptCompilerInitFunction<InitData>, compile?:ODTranscriptCompilerCompileFunction<Data, InitData>, ready?:ODTranscriptCompilerReadyFunction<Data>|null) {
        super(id)
        this.init = init ?? null
        this.compile = compile ?? null
        this.ready = ready ?? null
    }
}

/**## ODTranscriptCollector `class`
 * This is an Open Ticket transcript collector.
 *
 * The only goal of this class is to collect & parse all messages from a ticket channel.
 *
 * It also contains utility functions for counting all messages, calculating file sizes & more!
 */
export class ODTranscriptCollector {
    /**Alias for the ticket manager. */
    private tickets:ODTicketManager
    /**Alias for the client manager. */
    private client:api.ODClientManager
    /**Alias for the permissions manager. */
    private permissions:api.ODPermissionManager

    constructor(tickets:ODTicketManager, client:api.ODClientManager, permissions:api.ODPermissionManager) {
        this.tickets = tickets
        this.client = client
        this.permissions = permissions
    }

    /**Collect all messages from a given ticket channel. It may not include all messages depending on the ratelimit. */
    async collectAllMessages(ticket:ODTicket, include?:ODTranscriptCollectorIncludeSettings): Promise<discord.Message<true>[]|null> {
        const newInclude: ODTranscriptCollectorIncludeSettings = include ?? {users:true, bots:true, client:true}
        const channel = await this.tickets.getTicketChannel(ticket)
        if (!channel) return null

        const final: discord.Message<true>[] = []
        const limit: number = 2000
        let lastId: string = ""
        while (true){
            const options: discord.FetchMessagesOptions = {limit:100}
            if (lastId) options.before = lastId

            const messages = await channel.messages.fetch(options)
            messages.forEach((msg) => {
                if (msg.author.id === msg.client.user.id && newInclude.client) final.push(msg)
                else if ((msg.author.bot || msg.author.system) && newInclude.bots) final.push(msg)
                else if (newInclude.users) final.push(msg)
            })

            const lastMessage = messages.last()
            if (messages.size !== 100 || final.length >= limit || !lastMessage)break
            else lastId = lastMessage.id
        }
        return final.reverse()
    }

    /**Count all messages from a given ticket channel. It may not include all messages depending on the ratelimit. */
    async countAllMessages(ticket:ODTicket, include?:ODTranscriptCollectorIncludeSettings) {
        const messages = await this.collectAllMessages(ticket, include)
        if (!messages) return null
        return messages.length
    }

    /**Convert an array of discord messages to an array of `ODTranscriptMessageData`'s. This is used to simplify the process of the transcript compilers. */
    async convertMessagesToTranscriptData(messages:discord.Message<true>[]): Promise<ODTranscriptMessageData[]> {
        const final: ODTranscriptMessageData[] = []
        for (const msg of messages){
            const {guild, channel, id, createdTimestamp} = msg

            //create message author
            const author = this.handleUserData(msg.author, msg.member)

            //create message type
            let type: ODTranscriptMessageType = "default"
            if (msg.mentions.everyone || msg.content.includes("@here")) type = "important"
            else if (msg.flags.has("Ephemeral")) type = "ephemeral"
            else if (msg.type === discord.MessageType.UserJoin) type = "welcome.message"
            else if (msg.type === discord.MessageType.ChannelPinnedMessage) type = "pinned.message"
            else if (msg.type === discord.MessageType.GuildBoost || msg.type === discord.MessageType.GuildBoostTier1 || msg.type === discord.MessageType.GuildBoostTier2 || msg.type === discord.MessageType.GuildBoostTier3) type = "boost.message"
            else if (msg.type === discord.MessageType.ThreadCreated) type = "thread.message"

            //create message embeds
            const embeds: ODTranscriptEmbedData[] = []
            msg.embeds.forEach((embed) => {
                embeds.push({
                    title:embed.title,
                    description:embed.description,
                    authorimg:(embed.author && embed.author.iconURL) ? embed.author.iconURL : null,
                    authortext:(embed.author) ? embed.author.name : null,
                    footerimg:(embed.footer && embed.footer.iconURL) ? embed.footer.iconURL : null,
                    footertext:(embed.footer) ? embed.footer.text : null,
                    color:(embed.hexColor as discord.HexColorString) ?? "#000000",
                    image:(embed.image) ? embed.image.url : null,
                    thumbnail:(embed.thumbnail) ? embed.thumbnail.url : null,
                    url:embed.url,
                    fields:embed.fields.map((field) => {return {name:field.name, value:field.value, inline:field.inline ?? false}})
                })
            })

            //create message files
            const files: ODTranscriptFileData[] = []
            msg.attachments.forEach((attachment) => {
                const {size, unit} = this.calculateFileSize(attachment.size)
                files.push({
                    type:attachment.contentType ?? "unknown",
                    size,
                    unit,
                    name:attachment.name,
                    url:attachment.url,
                    spoiler:attachment.spoiler,
                    alt:attachment.description
                })
            })

            //create message components
            const rows: ODTranscriptComponentRowData[] = []
            msg.components.forEach((row) => {
                const components: ODTranscriptComponentRowData["components"] = []
                if (row.type !== discord.ComponentType.ActionRow) return
                row.components.forEach((component) => {
                    if (component.type === discord.ComponentType.Button){
                        components.push({
                            id:component.customId,
                            disabled:component.disabled,
                            type:"button",
                            label:component.label,
                            emoji:this.handleComponentEmoji(msg, component.emoji),
                            color:this.handleButtonComponentStyle(component.style),
                            mode:(component.style === discord.ButtonStyle.Link) ? "url" : "button",
                            url:component.url
                        })
                    }else if (component.type === discord.ComponentType.StringSelect){
                        components.push({
                            id:component.customId,
                            disabled:component.disabled,
                            type:"dropdown",
                            placeholder:component.placeholder,
                            options:component.options.map((option) => {
                                return {
                                    id:option.value,
                                    label:option.label,
                                    description:option.description ?? null,
                                    emoji:this.handleComponentEmoji(msg, option.emoji ?? null)
                                }
                            })
                        })
                    }
                })
                rows.push({components})
            })

            //create message reply
            let reply: ODTranscriptMessageReplyData|ODTranscriptInteractionReplyData|null = null
            if (msg.reference && msg.reference.messageId && msg.reference.guildId){
                //normal message reply
                try {
                    const replyChannel = await msg.client.channels.fetch(msg.reference.channelId)
                    if (replyChannel && !replyChannel.isDMBased() && replyChannel.isTextBased()){
                        const replyMessage = await replyChannel.messages.fetch(msg.reference.messageId)
                        if (replyMessage){
                            const replyUser = this.handleUserData(replyMessage.author, replyMessage.member)

                            reply = {
                                type:"message",
                                guild:msg.reference.guildId,
                                channel:msg.reference.channelId,
                                id:msg.reference.messageId,
                                user:replyUser,
                                content:(replyMessage.content !== "") ? replyMessage.content : null
                            }
                        }
                    }
                }catch {}

            }else if (msg.interactionMetadata){
                try {
                    //get slash command name from undocumented property in discord REST API
                    const restMsg = await this.client.rest.get(discord.Routes.channelMessage(msg.channelId, msg.id)) as discord.APIMessage & {interaction_metadata:{name:string}}
                    const commandName = restMsg.interaction_metadata.name ?? "unknown-command"
                    //slash command reply
                    let member: discord.GuildMember|null = null
                    try {
                        member = await msg.guild.members.fetch(msg.interactionMetadata.user.id)
                    }catch {} //member not found (user left the server)
                    reply = {
                        type:"interaction",
                        name:commandName,
                        user:this.handleUserData(msg.interactionMetadata.user, member)
                    }
                }catch(err){
                    process.emit("uncaughtException", err)
                }
            }

            //create message reactions
            const reactions: ODTranscriptReactionData[] = []
            msg.reactions.cache.forEach((reaction) => {
                const {count, emoji} = reaction

                if (emoji instanceof discord.ReactionEmoji && !emoji.id && emoji.name){
                    //build-in emoji
                    reactions.push({
                        id:null,
                        name:null,
                        custom:false,
                        animated:false,
                        emoji:emoji.name,
                        amount:count,
                        super:false //unimplemented in discord.js
                    })
                }else if (emoji instanceof discord.ReactionEmoji && emoji.id){
                    //custom emoji
                    reactions.push({
                        id:emoji.id,
                        name:emoji.name,
                        custom:true,
                        animated:emoji.animated ?? false,
                        emoji:(emoji.animated ? emoji.imageURL({extension:"gif"}) : emoji.imageURL({extension:"png"})) ?? "❌",
                        amount:count,
                        super:false //unimplemented in discord.js
                    })
                }
            })

            //create message
            final.push({
                author,
                guild:guild.id,
                channel:channel.id,
                id,
                edited:(msg.editedAt) ? true : false,
                timestamp:createdTimestamp,
                type,
                content:(msg.content !== "") ? msg.content : null,
                embeds,
                files,
                components:rows,
                reply,
                reactions
            })
        }
        return final
    }

    /**Calculate a human-readable file size. Used in transcripts. */
    calculateFileSize(bytes:number): {size:number, unit:"B"|"KB"|"MB"|"GB"|"TB"} {
        if (bytes < 1024) return {size:Math.round(bytes), unit:"B"}
        else if (bytes < 1024 * 1024) return {size:Math.round(bytes / 1024), unit:"KB"}
        else if (bytes < 1024 * 1024 * 1024) return {size:Math.round(bytes / (1024 * 1024)), unit:"MB"}
        else if (bytes < 1024 * 1024 * 1024 * 1024) return {size:Math.round(bytes / (1024 * 1024 * 1024)), unit:"GB"}
        else return {size:Math.round(bytes / (1024 * 1024 * 1024 * 1024)), unit:"TB"}
    }

    /**Get the `ODTranscriptEmojiData` from a discord.js component emoji. */
    private handleComponentEmoji(message:discord.Message<true>, rawEmoji:discord.APIMessageComponentEmoji|null): ODTranscriptEmojiData|null {
        if (!rawEmoji) return null
        //return built-in emoji
        if (rawEmoji.name) return {
            id:null,
            name:null,
            custom:false,
            animated:false,
            emoji:rawEmoji.name
        }
        if (!rawEmoji.id) return null
        const emoji = message.client.emojis.resolve(rawEmoji.id)
        if (!emoji) return null
        //return custom emoji
        return {
            id:emoji.id,
            name:emoji.name,
            custom:true,
            animated:emoji.animated ?? false,
            emoji:(emoji.animated ? emoji.imageURL({extension:"gif"}) : emoji.imageURL({extension:"png"}))
        }
    }

    /**Create the `ODValidButtonColor` from the discord.js button style. */
    private handleButtonComponentStyle(style:discord.ButtonStyle): api.ODValidButtonColor {
        if (style === discord.ButtonStyle.Danger) return "red"
        else if (style === discord.ButtonStyle.Success) return "green"
        else if (style === discord.ButtonStyle.Primary) return "blue"
        else return "gray"
    }

    /**Create the `ODTranscriptUserData` from a discord.js user. */
    private handleUserData(user:discord.User, member?:discord.GuildMember|null): ODTranscriptUserData {
        const userData: ODTranscriptUserData = {
            id:user.id,
            username:user.username,
            displayname:user.displayName,
            pfp:user.displayAvatarURL(),
            tag:null,
            color:"#ffffff"
        }
        if (user.flags && user.flags.has("VerifiedBot")) userData.tag = "verified"
        else if (user.system) userData.tag = "system"
        else if (user.bot) userData.tag = "app"
        if (member) userData.color = member.roles.highest.hexColor.replace("#000000", "#ffffff") as discord.HexColorString

        return userData
    }

    /**Analyse the ticket for the amount of messages users & admins have sent in the ticket. */
    async ticketUserMessagesAnalysis(ticket:ODTicket, guild:discord.Guild, channel:discord.GuildTextBasedChannel) {
        const messages = await this.collectAllMessages(ticket, {bots:true, client:true, users:true})
        if (!messages) return null
        const parsedMessages = await this.convertMessagesToTranscriptData(messages)
        let userMessages = 0
        let adminMessages = 0

        for (const msg of parsedMessages){
            if (msg.author.tag || msg.author.id === this.client.client.user.id) continue
            const user = await this.client.fetchUser(msg.author.id)
            if (!user) continue
            const isAdmin = this.permissions.hasPermissions("support", await this.permissions.getPermissions(user, channel, guild))
            if (isAdmin) adminMessages++
            else userMessages++
        }

        return {userMessages, adminMessages, totalMessages:userMessages + adminMessages}
    }
}

/**## ODTranscriptCollectorIncludeSettings `interface`
 * Additional settings for the `ODTranscriptCollector`
 */
export interface ODTranscriptCollectorIncludeSettings {
    /**Collect messages from normal discord users. */
    users:boolean,
    /**Collect messages from bots & system users. */
    bots:boolean,
    /**Collect messages from this bot. */
    client:boolean
}

/**## ODTranscriptMessageData `interface`
 * A universal representatation of a discord message for transcripts.
 */
export interface ODTranscriptMessageData {
    /**The message author. */
    author:ODTranscriptUserData,
    /**The server this message originated from. */
    guild:string,
    /**The channel this message originated from. */
    channel:string,
    /**The id of this message. */
    id:string,
    /**Is this message edited? */
    edited:boolean,
    /**The unix timestamp of the creation of this message. */
    timestamp:number,
    /**The type of message. */
    type:ODTranscriptMessageType,
    /**The contents of this message. */
    content:string|null,
    /**The embeds of this message. */
    embeds:ODTranscriptEmbedData[],
    /**The files of this message. */
    files:ODTranscriptFileData[],
    /**The components (buttons & dropdowns) of this message. */
    components:ODTranscriptComponentRowData[],
    /**When this message is a reply to something, the data will be here. */
    reply:(ODTranscriptMessageReplyData|ODTranscriptInteractionReplyData|null),
    /**All reactions of htis message. */
    reactions:ODTranscriptReactionData[]
}

/**## ODTranscriptMessageType `type`
 * A message type for the `ODTranscriptMessageData` interface.
 */
export type ODTranscriptMessageType = "default"|"important"|"ephemeral"|"pinned.message"|"welcome.message"|"boost.message"|"thread.message"

/**## ODTranscriptUserData `interface`
 * A universal representatation of a discord user for transcripts.
 */
export interface ODTranscriptUserData {
    /**The id of this user. */
    id:string,
    /**The username of this user. */
    username:string,
    /**The display name of this user. */
    displayname:string,
    /**The profile picture url of this user. */
    pfp:string,
    /**The additional tag of this user. */
    tag:"app"|"verified"|"system"|null,
    /**When in a server, this is the color of the highest role. */
    color:discord.HexColorString
}

/**## ODTranscriptEmbedData `interface`
 * A universal representatation of a discord embed for transcripts.
 */
export interface ODTranscriptEmbedData {
    /**The title of this embed. */
    title:string|null,
    /**The description of this embed. */
    description:string|null,
    /**The author image of this embed. */
    authorimg:string|null,
    /**The author text of this embed. */
    authortext:string|null,
    /**The footer image of this embed. */
    footerimg:string|null
    /**The footer text of this embed. */
    footertext:string|null,
    /**The color of this embed (hex color). */
    color:discord.HexColorString,
    /**The image of this embed. */
    image:string|null,
    /**The thumbnail of this embed. */
    thumbnail:string|null,
    /**The url in the title of this embed. */
    url:string|null,
    /**All fields available in this embed. */
    fields:ODTranscriptEmbedFieldData[]
}

/**## ODTranscriptEmbedFieldData `interface`
 * A universal representatation of a discord embed field for transcripts.
 */
export interface ODTranscriptEmbedFieldData {
    /**The name of this embed field. */
    name:string,
    /**The value or contents of this embed field. */
    value:string,
    /**Is this field rendered inline? */
    inline:boolean
}

/**## ODTranscriptFileData `interface`
 * A universal representatation of a discord message attachment for transcripts.
 */
export interface ODTranscriptFileData {
    /**The file type or extension. */
    type:string,
    /**The size of this file. */
    size:number,
    /**The unit used for the size of this file. */
    unit:"B"|"KB"|"MB"|"GB"|"TB",
    /**The name of this file. */
    name:string,
    /**The url of this file. */
    url:string,
    /**Is this file a spoiler? */
    spoiler:boolean,
    /**The alternative text for this file. */
    alt:string|null
}

/**## ODTranscriptComponentRowData `interface`
 * A universal representatation of a discord message action row for transcripts.
 */
export interface ODTranscriptComponentRowData {
    /**All components (buttons & dropdowns) present in this action row. */
    components:(ODTranscriptButtonComponentData|ODTranscriptDropdownComponentData)[]
}

/**## ODTranscriptComponentData `interface`
 * A universal representatation of a discord message action row component for transcripts.
 */
export interface ODTranscriptComponentData {
    /**The custom id of this component. */
    id:string|null,
    /**Is this component disabled? */
    disabled:boolean
    /**The type of this component. */
    type:"button"|"dropdown"
}

/**## ODTranscriptButtonComponentData `interface`
 * A universal representatation of a discord message button for transcripts.
 */
export interface ODTranscriptButtonComponentData extends ODTranscriptComponentData {
    /**The type of this component. */
    type:"button"
    /**The label of this button. */
    label:string|null,
    /**The emoji of this button. */
    emoji:ODTranscriptEmojiData|null,
    /**The color of this button. */
    color:api.ODValidButtonColor,
    /**Is this button a url or button? */
    mode:"url"|"button",
    /**The url of this button. */
    url:string|null
}

/**## ODTranscriptDropdownComponentData `interface`
 * A universal representatation of a discord message dropdown for transcripts.
 */
export interface ODTranscriptDropdownComponentData extends ODTranscriptComponentData {
    /**The type of this component. */
    type:"dropdown"
    /**The placeholder in this dropdown. */
    placeholder:string|null,
    /**All options available in this dropdown. */
    options:ODTranscriptDropdownComponentOptionData[]
}

/**## ODTranscriptDropdownComponentOptionData `interface`
 * A universal representatation of a discord message dropdown option for transcripts.
 */
export interface ODTranscriptDropdownComponentOptionData {
    /**The custom id of this dropdown option. */
    id:string,
    /**The label of this dropdown option. */
    label:string|null,
    /**The description of this dropdown option. */
    description:string|null,
    /**The emoji of this dropdown option. */
    emoji:ODTranscriptEmojiData|null
}

/**## ODTranscriptReplyData `interface`
 * A universal representatation of a discord reply/interaction for transcripts.
 */
export interface ODTranscriptReplyData {
    /**The type of reply. */
    type:"interaction"|"message",
}

/**## ODTranscriptReplyData `interface`
 * A universal representatation of a discord interaction reply for transcripts.
 */
export interface ODTranscriptInteractionReplyData extends ODTranscriptReplyData {
    /**The type of reply. */
    type:"interaction",
    /**The bot used for this interaction. */
    user:ODTranscriptUserData,
    /**The name of the slash command used. */
    name:string
}

/**## ODTranscriptReplyData `interface`
 * A universal representatation of a discord message reply for transcripts.
 */
export interface ODTranscriptMessageReplyData extends ODTranscriptReplyData {
    /**The type of reply. */
    type:"message",
    /**The server this message originated from. */
    guild:string,
    /**The channel this message originated from. */
    channel:string,
    /**The id of this message. */
    id:string,
    /**The author of this message. */
    user:ODTranscriptUserData,
    /**The content of this message. */
    content:string|null
}

/**## ODTranscriptEmojiData `interface`
 * A universal representatation of a discord emoji for transcripts.
 */
export interface ODTranscriptEmojiData {
    /**The id of this emoji. */
    id:string|null,
    /**The name of this emoji. */
    name:string|null,
    /**Is this emoji animated? */
    animated:boolean,
    /**Is this a custom emoji (img/gif)? */
    custom:boolean,
    /**The url or emoji. */
    emoji:string,
}

/**## ODTranscriptReactionData `interface`
 * A universal representatation of a discord message reaction for transcripts.
 */
export interface ODTranscriptReactionData extends ODTranscriptEmojiData {
    /**The amount of emojis for this reaction.  */
    amount:number,
    /**Is this a super (nitro) reaction? */
    super:boolean
}

/**## ODTranscriptHtmlV2Data `interface`
 * The structure of the data sent to the Open Ticket HTML Transcripts v2 API.
 */
export interface ODTranscriptHtmlV2Data {
    version:"2.1",
    otversion:string,
    language:string,
    style:{
        background:{
            enableCustomBackground:boolean,
            backgroundModus:"color"|"image",
            backgroundData:string
        },
        header:{
            enableCustomHeader:boolean,
            decoColor:string,
            backgroundColor:string,
            textColor:string
        },
        stats:{
            enableCustomStats:boolean,
            backgroundColor:string,
            keyTextColor:string,
            valueTextColor:string,
            hideBackgroundColor:string,
            hideTextColor:string
        },
        favicon:{
            enableCustomFavicon:boolean,
            imageUrl:string
        }
    },
    bot:{
        name:string,
        id:string,
        pfp:string
    },
    ticket:{
        name:string,
        id:string,

        guildname:string,
        guildid:string,
        guildinvite:string|false,

        createdname:string|false,
        createdid:string|false,
        closedname:string|false,
        closedid:string|false,
        claimedname:string|false,
        claimedid:string|false,
        pinnedname:string|false,
        pinnedid:string|false,
        deletedname:string|false,
        deletedid:string|false,

        createdpfp:string|false,
        closedpfp:string|false,
        claimedpfp:string|false,
        pinnedpfp:string|false,
        deletedpfp:string|false,

        createdtime:number|false,
        closedtime:number|false,
        claimedtime:number|false,
        pinnedtime:number|false,
        deletedtime:number|false,

        components:{
            messages:number,
            files:number,
            embeds:number,
            reactions:number,
            interactions:{
                dropdowns:number,
                buttons:number,
                total:number
            },
            attachments:{
                invites:number,
                images:number,
                gifs:number,
                stickers:number
            }
        },
        roleColors:{id:string, color:string}[]
    },
    messages:{
        author:{
            name:string,
            id:string,
            color:string,
            pfp:string,
            bot:boolean,
            verifiedBot:boolean,
            system:boolean
        },
        content:string|false,
        timestamp:number,
        type:"normal",
        important:boolean,
        edited:boolean,
        embeds:{
            title:string|false,
            description:string|false,
            authorimg:string|false,
            authortext:string|false,
            footerimg:string|false,
            footertext:string|false,
            color:string,
            image:string|false,
            thumbnail:string|false,
            url:string|false,
            fields:{name:string, value:string, inline:boolean}[]
        }[],
        attachments:(
            {
                type:"FILE",
                name:string,
                fileType:string,
                size:string,
                url:string
            }|{
                type:"FILE:image",
                name:string,
                fileType:string,
                size:string,
                url:string
            }|{
                type:"URL:invite",
                guildId:string,
                guildName:string,
                guildSize:number,
                guildOnline:number,
                image:string,
                url:string
            }|{
                type:"URL:gif",
                url:string
            }|{
                type:"BUILDIN:sticker",
                name:string,
                url:string
            }
        )[],
        components:(
            {
                type:"buttons",
                buttons:{
                    type:"interaction"|"url",
                    label:string|false,
                    icon:string|false,
                    color:"gray"|"green"|"red"|"blue",
                    id:string|false,
                    url:string|false,
                    disabled:boolean
                }[]
            }|{
                type:"dropdown",
                placeholder:string|false,
                options:{
                    label:string|false,
                    icon:string|false,
                    description:string|false,
                    id:string|false
                }[]
            }|{
                type:"reactions",
                reactions:{
                    amount:number,
                    emoji:string,
                    type:"svg"|"image"|"gif"
                }[]
            }
        )[],
        reply:{
            type:"reply"|"command"|false,
            user?:{
                name:string,
                id:string,
                color:string,
                pfp:string,
                bot:boolean,
                verifiedBot:boolean,
                system:boolean
            },
            replyOptions?:{
                content:string,
                messageId:string,
                channelId:string,
                guildId:string
            },
            commandOptions?:{
                interactionName:string,
                interactionId:string
            }
        }
    }[],
    //sadly enough, no premium yet :)
    premium:{
        enabled:boolean,
        premiumToken:string,
        customCredits:{
            enable:boolean,
            replaceText:string,
            replaceURL:string,
            enableReportBug:boolean
        },
        customHeaderUrl:{
            enabled:boolean,
            url:string,
            text:string
        },
        customTranscriptUrl:{
            enabled:boolean,
            name:string
        },
        customFavicon:{
            enabled:boolean,
            image:string
        },
        additionalFlags:string[]
    }
}

/**## ODTranscriptHtmlV2Response `interface`
 * The structure of the response received from the Open Ticket HTML Transcripts v2 API.
 */
export interface ODTranscriptHtmlV2Response {
    status:"success"|"error",
    type:"transcript",
    url:string,
    availableUntil:number, //UNIMPLEMENTED
    time:number,
    id:string
}