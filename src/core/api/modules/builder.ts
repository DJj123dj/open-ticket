///////////////////////////////////////
//BUILDER MODULE
///////////////////////////////////////
import { ODId, ODValidButtonColor, ODValidId, ODSystemError, ODInterfaceWithPartialProperty, ODManagerWithSafety, ODManagerData } from "./base"
import * as discord from "discord.js"
import { ODWorkerManager, ODWorkerCallback, ODWorker } from "./worker"
import { ODDebugger } from "./console"

/**## ODBuilderImplementation `class`
 * This is an Open Ticket builder implementation.
 * 
 * It is a basic implementation of the `ODWorkerManager` used by all `ODBuilder` classes.
 * 
 * This class can't be used stand-alone & needs to be extended from!
 */
export class ODBuilderImplementation<Instance,Source extends string,Params,BuildType extends {id:ODId}> extends ODManagerData {
    /**The manager that has all workers of this implementation */
    workers: ODWorkerManager<Instance,Source,Params>
    /**Cache a build or create it every time from scratch when this.build() gets executed. */
    allowCache: boolean = false
    /**Did the build already got created/cached? */
    didCache: boolean = false
    /**The cache of this build. */
    cache:BuildType|null = null

    constructor(id:ODValidId, callback?:ODWorkerCallback<Instance,Source,Params>, priority?:number, callbackId?:ODValidId){
        super(id)
        this.workers = new ODWorkerManager("ascending")
        if (callback) this.workers.add(new ODWorker(callbackId ? callbackId : id,priority ?? 0,callback))
    }

    /**Set if caching is allowed */
    setCacheMode(allowed:boolean){
        this.allowCache = allowed
        this.resetCache()
        return this
    }
    /**Reset the current cache */
    resetCache(){
        this.cache = null
        this.didCache = false
        return this
    }
    /**Execute all workers & return the result. */
    async build(source:Source, params:Params): Promise<BuildType> {
        throw new ODSystemError("Tried to build an unimplemented ODBuilderImplementation")
    }
}

/**## ODBuilderManager `class`
 * This is an Open Ticket builder manager.
 * 
 * It contains all Open Ticket builders. You can find messages, embeds, files & dropdowns, buttons & modals all here!
 * 
 * Using the Open Ticket builder system has a few advantages compared to vanilla discord.js:
 * - plugins can extend/edit messages
 * - automatically reply on error
 * - independent workers (with priority)
 * - fail-safe design using try-catch
 * - cache frequently used objects
 * - get to know the source of the build request for a specific message, button, etc
 * - And so much more!
 */
export class ODBuilderManager {
    /**The manager for all button builders */
    buttons: ODButtonManager
    /**The manager for all dropdown builders */
    dropdowns: ODDropdownManager
    /**The manager for all file/attachment builders */
    files: ODFileManager
    /**The manager for all embed builders */
    embeds: ODEmbedManager
    /**The manager for all message builders */
    messages: ODMessageManager
    /**The manager for all modal builders */
    modals: ODModalManager

    constructor(debug:ODDebugger){
        this.buttons = new ODButtonManager(debug)
        this.dropdowns = new ODDropdownManager(debug)
        this.files = new ODFileManager(debug)
        this.embeds = new ODEmbedManager(debug)
        this.messages = new ODMessageManager(debug)
        this.modals = new ODModalManager(debug)
    }
}

/**## ODComponentBuildResult `interface`
 * This interface contains the result from a built component (button/dropdown). This can be used in the `ODMessage` builder!
 */
export interface ODComponentBuildResult {
    /**The id of this component (button or dropdown) */
    id:ODId,
    /**The discord component or `\n` when it is a spacer between action rows */
    component:discord.MessageActionRowComponentBuilder|"\n"|null
}

/**## ODButtonManager `class`
 * This is an Open Ticket button manager.
 * 
 * It contains all Open Ticket button builders. Here, you can add your own buttons or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODButtonManager extends ODManagerWithSafety<ODButton<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODButton("opendiscord:unknown-button",(instance,params,source,cancel) => {
                instance.setCustomId("od:unknown-button")
                instance.setMode("button")
                instance.setColor("red")
                instance.setLabel("<ODError:Unknown Button>")
                instance.setEmoji("✖")
                instance.setDisabled(true)
                cancel()
            })
        },debug,"button")
    }

    /**Get a newline component for buttons & dropdowns! */
    getNewLine(id:ODValidId): ODComponentBuildResult {
        return {
            id:new ODId(id),
            component:"\n"
        }
    }
}

/**## ODButtonData `interface`
 * This interface contains the data to build a button.
 */
export interface ODButtonData {
    /**The custom id of this button */
    customId:string,
    /**The mode of this button */
    mode:"button"|"url",
    /**The url for when the mode is set to "url" */
    url:string|null,
    /**The button color */
    color:ODValidButtonColor|null,
    /**The button label */
    label:string|null,
    /**The button emoji */
    emoji:string|null,
    /**Is the button disabled? */
    disabled:boolean
}

/**## ODButtonInstance `class`
 * This is an Open Ticket button instance.
 * 
 * It contains all properties & functions to build a button!
 */
export class ODButtonInstance {
    /**The current data of this button */
    data: ODButtonData = {
        customId:"",
        mode:"button",
        url:null,
        color:null,
        label:null,
        emoji:null,
        disabled:false
    }

    /**Set the custom id of this button */
    setCustomId(id:ODButtonData["customId"]){
        this.data.customId = id
        return this
    }
    /**Set the mode of this button */
    setMode(mode:ODButtonData["mode"]){
        this.data.mode = mode
        return this
    }
    /**Set the url of this button */
    setUrl(url:ODButtonData["url"]){
        this.data.url = url
        return this
    }
    /**Set the color of this button */
    setColor(color:ODButtonData["color"]){
        this.data.color = color
        return this
    }
    /**Set the label of this button */
    setLabel(label:ODButtonData["label"]){
        this.data.label = label
        return this
    }
    /**Set the emoji of this button */
    setEmoji(emoji:ODButtonData["emoji"]){
        this.data.emoji = emoji
        return this
    }
    /**Disable this button */
    setDisabled(disabled:ODButtonData["disabled"]){
        this.data.disabled = disabled
        return this
    }
}

/**## ODButton `class`
 * This is an Open Ticket button builder.
 * 
 * With this class, you can create a button to use in a message.
 * The only difference with normal buttons is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODButton<Source extends string,Params> extends ODBuilderImplementation<ODButtonInstance,Source,Params,ODComponentBuildResult> {
    /**Build this button & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        try {
            //create instance
            const instance = new ODButtonInstance()

            //wait for workers to finish
            await this.workers.executeWorkers(instance,source,params)

            //create the discord.js button
            const button = new discord.ButtonBuilder()
            if (instance.data.mode == "button") button.setCustomId(instance.data.customId)
            if (instance.data.mode == "url") button.setStyle(discord.ButtonStyle.Link)
            else if (instance.data.color == "gray") button.setStyle(discord.ButtonStyle.Secondary)
            else if (instance.data.color == "blue") button.setStyle(discord.ButtonStyle.Primary)
            else if (instance.data.color == "green") button.setStyle(discord.ButtonStyle.Success)
            else if (instance.data.color == "red") button.setStyle(discord.ButtonStyle.Danger)
            if (instance.data.url) button.setURL(instance.data.url)
            if (instance.data.label) button.setLabel(instance.data.label)
            if (instance.data.emoji) button.setEmoji(instance.data.emoji)
            if (instance.data.disabled) button.setDisabled(instance.data.disabled)
            if (!instance.data.emoji && !instance.data.label) button.setLabel(instance.data.customId)

            this.cache = {id:this.id,component:button}
            this.didCache = true
            return {id:this.id,component:button}
        }catch(err){
            process.emit("uncaughtException",new ODSystemError("ODButton:build(\""+this.id.value+"\") => Major Error (see next error)"))
            process.emit("uncaughtException",err)
            return {id:this.id,component:null}
        }
    }
}

/**## ODDropdownManager `class`
 * This is an Open Ticket dropdown manager.
 * 
 * It contains all Open Ticket dropdown builders. Here, you can add your own dropdowns or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODDropdownManager extends ODManagerWithSafety<ODDropdown<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODDropdown("opendiscord:unknown-dropdown",(instance,params,source,cancel) => {
                instance.setCustomId("od:unknown-dropdown")
                instance.setType("string")
                instance.setPlaceholder("❌ <ODError:Unknown Dropdown>")
                instance.setDisabled(true)
                instance.setOptions([
                    {emoji:"❌",label:"<ODError:Unknown Dropdown>",value:"error"}
                ])
                cancel()
            })
        },debug,"dropdown")
    }

    /**Get a newline component for buttons & dropdowns! */
    getNewLine(id:ODValidId): ODComponentBuildResult {
        return {
            id:new ODId(id),
            component:"\n"
        }
    }
}

/**## ODDropdownData `interface`
 * This interface contains the data to build a dropdown.
 */
export interface ODDropdownData {
    /**The custom id of this dropdown */
    customId:string,
    /**The type of this dropdown */
    type:"string"|"role"|"channel"|"user"|"mentionable",
    /**The placeholder of this dropdown */
    placeholder:string|null,
    /**The minimum amount of items to be selected in this dropdown */
    minValues:number|null,
    /**The maximum amount of items to be selected in this dropdown */
    maxValues:number|null,
    /**Is this dropdown disabled? */
    disabled:boolean,
    /**Allowed channel types when the type is "channel" */
    channelTypes:discord.ChannelType[]

    /**The options when the type is "string" */
    options:discord.SelectMenuComponentOptionData[],
    /**The options when the type is "user" */
    users:discord.User[],
    /**The options when the type is "role" */
    roles:discord.Role[],
    /**The options when the type is "channel" */
    channels:discord.Channel[],
    /**The options when the type is "mentionable" */
    mentionables:(discord.User|discord.Role)[],
}

/**## ODDropdownInstance `class`
 * This is an Open Ticket dropdown instance.
 * 
 * It contains all properties & functions to build a dropdown!
 */
export class ODDropdownInstance {
    /**The current data of this dropdown */
    data: ODDropdownData = {
        customId:"",
        type:"string",
        placeholder:null,
        minValues:null,
        maxValues:null,
        disabled:false,
        channelTypes:[],

        options:[],
        users:[],
        roles:[],
        channels:[],
        mentionables:[]
    }

    /**Set the custom id of this dropdown */
    setCustomId(id:ODDropdownData["customId"]){
        this.data.customId = id
        return this
    }
    /**Set the type of this dropdown */
    setType(type:ODDropdownData["type"]){
        this.data.type = type
        return this
    }
    /**Set the placeholder of this dropdown */
    setPlaceholder(placeholder:ODDropdownData["placeholder"]){
        this.data.placeholder = placeholder
        return this
    }
    /**Set the minimum amount of values in this dropdown */
    setMinValues(minValues:ODDropdownData["minValues"]){
        this.data.minValues = minValues
        return this
    }
    /**Set the maximum amount of values ax this dropdown */
    setMaxValues(maxValues:ODDropdownData["maxValues"]){
        this.data.maxValues = maxValues
        return this
    }
    /**Set the disabled of this dropdown */
    setDisabled(disabled:ODDropdownData["disabled"]){
        this.data.disabled = disabled
        return this
    }
    /**Set the channel types of this dropdown */
    setChannelTypes(channelTypes:ODDropdownData["channelTypes"]){
        this.data.channelTypes = channelTypes
        return this
    }
    /**Set the options of this dropdown (when `type == "string"`) */
    setOptions(options:ODDropdownData["options"]){
        this.data.options = options
        return this
    }
    /**Set the users of this dropdown (when `type == "user"`) */
    setUsers(users:ODDropdownData["users"]){
        this.data.users = users
        return this
    }
    /**Set the roles of this dropdown (when `type == "role"`) */
    setRoles(roles:ODDropdownData["roles"]){
        this.data.roles = roles
        return this
    }
    /**Set the channels of this dropdown (when `type == "channel"`) */
    setChannels(channels:ODDropdownData["channels"]){
        this.data.channels = channels
        return this
    }
    /**Set the mentionables of this dropdown (when `type == "mentionable"`) */
    setMentionables(mentionables:ODDropdownData["mentionables"]){
        this.data.mentionables = mentionables
        return this
    }
}

/**## ODDropdown `class`
 * This is an Open Ticket dropdown builder.
 * 
 * With this class, you can create a dropdown to use in a message.
 * The only difference with normal dropdowns is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODDropdown<Source extends string,Params> extends ODBuilderImplementation<ODDropdownInstance,Source,Params,ODComponentBuildResult> {
    /**Build this dropdown & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        try{
            //create instance
            const instance = new ODDropdownInstance()

            //wait for workers to finish
            await this.workers.executeWorkers(instance,source,params)

            //create the discord.js dropdown
            if (instance.data.type == "string"){
                const dropdown = new discord.StringSelectMenuBuilder()
                dropdown.setCustomId(instance.data.customId)
                dropdown.setOptions(...instance.data.options)
                if (instance.data.placeholder) dropdown.setPlaceholder(instance.data.placeholder)
                if (instance.data.minValues) dropdown.setMinValues(instance.data.minValues)
                if (instance.data.maxValues) dropdown.setMaxValues(instance.data.maxValues)
                if (instance.data.disabled) dropdown.setDisabled(instance.data.disabled)
                
                this.cache = {id:this.id,component:dropdown}
                this.didCache = true
                return {id:this.id,component:dropdown}

            }else if (instance.data.type == "user"){
                const dropdown = new discord.UserSelectMenuBuilder()
                dropdown.setCustomId(instance.data.customId)
                if (instance.data.users.length > 0) dropdown.setDefaultUsers(...instance.data.users.map((u) => u.id))
                if (instance.data.placeholder) dropdown.setPlaceholder(instance.data.placeholder)
                if (instance.data.minValues) dropdown.setMinValues(instance.data.minValues)
                if (instance.data.maxValues) dropdown.setMaxValues(instance.data.maxValues)
                if (instance.data.disabled) dropdown.setDisabled(instance.data.disabled)
                
                this.cache = {id:this.id,component:dropdown}
                this.didCache = true
                return {id:this.id,component:dropdown}

            }else if (instance.data.type == "role"){
                const dropdown = new discord.RoleSelectMenuBuilder()
                dropdown.setCustomId(instance.data.customId)
                if (instance.data.roles.length > 0) dropdown.setDefaultRoles(...instance.data.roles.map((r) => r.id))
                if (instance.data.placeholder) dropdown.setPlaceholder(instance.data.placeholder)
                if (instance.data.minValues) dropdown.setMinValues(instance.data.minValues)
                if (instance.data.maxValues) dropdown.setMaxValues(instance.data.maxValues)
                if (instance.data.disabled) dropdown.setDisabled(instance.data.disabled)
                
                this.cache = {id:this.id,component:dropdown}
                this.didCache = true
                return {id:this.id,component:dropdown}

            }else if (instance.data.type == "channel"){
                const dropdown = new discord.ChannelSelectMenuBuilder()
                dropdown.setCustomId(instance.data.customId)
                if (instance.data.channels.length > 0) dropdown.setDefaultChannels(...instance.data.channels.map((c) => c.id))
                if (instance.data.placeholder) dropdown.setPlaceholder(instance.data.placeholder)
                if (instance.data.minValues) dropdown.setMinValues(instance.data.minValues)
                if (instance.data.maxValues) dropdown.setMaxValues(instance.data.maxValues)
                if (instance.data.disabled) dropdown.setDisabled(instance.data.disabled)
                
                this.cache = {id:this.id,component:dropdown}
                this.didCache = true
                return {id:this.id,component:dropdown}

            }else if (instance.data.type == "mentionable"){
                const dropdown = new discord.MentionableSelectMenuBuilder()

                const values: ({type:discord.SelectMenuDefaultValueType.User,id:string}|{type:discord.SelectMenuDefaultValueType.Role,id:string})[] = []
                instance.data.mentionables.forEach((m) => {
                    if (m instanceof discord.User){
                        values.push({type:discord.SelectMenuDefaultValueType.User,id:m.id})
                    }else{
                        values.push({type:discord.SelectMenuDefaultValueType.Role,id:m.id})
                    }
                })

                dropdown.setCustomId(instance.data.customId)
                if (instance.data.mentionables.length > 0) dropdown.setDefaultValues(...values)
                if (instance.data.placeholder) dropdown.setPlaceholder(instance.data.placeholder)
                if (instance.data.minValues) dropdown.setMinValues(instance.data.minValues)
                if (instance.data.maxValues) dropdown.setMaxValues(instance.data.maxValues)
                if (instance.data.disabled) dropdown.setDisabled(instance.data.disabled)
                
                this.cache = {id:this.id,component:dropdown}
                this.didCache = true
                return {id:this.id,component:dropdown}
            }else{
                throw new Error("Tried to build an ODDropdown with unknown type!")
            }
        }catch(err){
            process.emit("uncaughtException",new ODSystemError("ODDropdown:build(\""+this.id.value+"\") => Major Error (see next error)"))
            process.emit("uncaughtException",err)
            return {id:this.id,component:null}
        }
    }
}

/**## ODFileManager `class`
 * This is an Open Ticket file manager.
 * 
 * It contains all Open Ticket file builders. Here, you can add your own files or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODFileManager extends ODManagerWithSafety<ODFile<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODFile("opendiscord:unknown-file",(instance,params,source,cancel) => {
                instance.setName("openticket_unknown-file.txt")
                instance.setDescription("❌ <ODError:Unknown File>")
                instance.setContents("Couldn't find file in registery `opendiscord.builders.files`")
                cancel()
            })
        },debug,"file")
    }
}

/**## ODFileData `interface`
 * This interface contains the data to build a file.
 */
export interface ODFileData {
    /**The file buffer, string or raw data */
    file:discord.BufferResolvable
    /**The name of the file */
    name:string,
    /**The description of the file */
    description:string|null,
    /**Set the file to be a spoiler */
    spoiler:boolean
}

/**## ODFileBuildResult `interface`
 * This interface contains the result from a built file (attachment). This can be used in the `ODMessage` builder!
 */
export interface ODFileBuildResult {
    /**The id of this file */
    id:ODId,
    /**The discord file */
    file:discord.AttachmentBuilder|null
}

/**## ODFileInstance `class`
 * This is an Open Ticket file instance.
 * 
 * It contains all properties & functions to build a file!
 */
export class ODFileInstance {
    /**The current data of this file */
    data: ODFileData = {
        file:"",
        name:"file.txt",
        description:null,
        spoiler:false
    }

    /**Set the file path of this attachment */
    setFile(file:string){
        this.data.file = file
        return this
    }
    /**Set the file contents of this attachment */
    setContents(contents:string|Buffer){
        this.data.file = (typeof contents == "string") ? Buffer.from(contents) : contents
        return this
    }
    /**Set the name of this attachment */
    setName(name:ODFileData["name"]){
        this.data.name = name
        return this
    }
    /**Set the description of this attachment */
    setDescription(description:ODFileData["description"]){
        this.data.description = description
        return this
    }
    /**Set this attachment to show as a spoiler */
    setSpoiler(spoiler:ODFileData["spoiler"]){
        this.data.spoiler = spoiler
        return this
    }
}

/**## ODFile `class`
 * This is an Open Ticket file builder.
 * 
 * With this class, you can create a file to use in a message.
 * The only difference with normal files is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODFile<Source extends string,Params> extends ODBuilderImplementation<ODFileInstance,Source,Params,ODFileBuildResult> {
    /**Build this attachment & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        try{
            //create instance
            const instance = new ODFileInstance()

            //wait for workers to finish
            await this.workers.executeWorkers(instance,source,params)

            //create the discord.js attachment
            const file = new discord.AttachmentBuilder(instance.data.file)
            file.setName(instance.data.name ? instance.data.name : "file.txt")
            if (instance.data.description) file.setDescription(instance.data.description)
            if (instance.data.spoiler) file.setSpoiler(instance.data.spoiler)
            

            this.cache = {id:this.id,file}
            this.didCache = true
            return {id:this.id,file}
        }catch(err){
            process.emit("uncaughtException",new ODSystemError("ODFile:build(\""+this.id.value+"\") => Major Error (see next error)"))
            process.emit("uncaughtException",err)
            return {id:this.id,file:null}
        }
    }
}

/**## ODEmbedManager `class`
 * This is an Open Ticket embed manager.
 * 
 * It contains all Open Ticket embed builders. Here, you can add your own embeds or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODEmbedManager extends ODManagerWithSafety<ODEmbed<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODEmbed("opendiscord:unknown-embed",(instance,params,source,cancel) => {
                instance.setFooter("opendiscord:unknown-embed")
                instance.setColor("#ff0000")
                instance.setTitle("❌ <ODError:Unknown Embed>")
                instance.setDescription("Couldn't find embed in registery `opendiscord.builders.embeds`")
                cancel()
            })
        },debug,"embed")
    }
}

/**## ODEmbedData `interface`
 * This interface contains the data to build an embed.
 */
export interface ODEmbedData {
    /**The title of the embed */
    title:string|null,
    /**The color of the embed */
    color:discord.ColorResolvable|null,
    /**The url of the embed */
    url:string|null,
    /**The description of the embed */
    description:string|null,
    /**The author text of the embed */
    authorText:string|null,
    /**The author image of the embed */
    authorImage:string|null,
    /**The author url of the embed */
    authorUrl:string|null,
    /**The footer text of the embed */
    footerText:string|null,
    /**The footer image of the embed */
    footerImage:string|null,
    /**The image of the embed */
    image:string|null,
    /**The thumbnail of the embed */
    thumbnail:string|null,
    /**The fields of the embed */
    fields:ODInterfaceWithPartialProperty<discord.EmbedField,"inline">[],
    /**The timestamp of the embed */
    timestamp:number|Date|null
}

/**## ODEmbedBuildResult `interface`
 * This interface contains the result from a built embed. This can be used in the `ODMessage` builder!
 */
export interface ODEmbedBuildResult {
    /**The id of this embed */
    id:ODId,
    /**The discord embed */
    embed:discord.EmbedBuilder|null
}

/**## ODEmbedInstance `class`
 * This is an Open Ticket embed instance.
 * 
 * It contains all properties & functions to build an embed!
 */
export class ODEmbedInstance {
    /**The current data of this embed */
    data: ODEmbedData = {
        title:null,
        color:null,
        url:null,
        description:null,
        authorText:null,
        authorImage:null,
        authorUrl:null,
        footerText:null,
        footerImage:null,
        image:null,
        thumbnail:null,
        fields:[],
        timestamp:null
    }

    /**Set the title of this embed */
    setTitle(title:ODEmbedData["title"]){
        this.data.title = title
        return this
    }
    /**Set the color of this embed */
    setColor(color:ODEmbedData["color"]){
        this.data.color = color
        return this
    }
    /**Set the url of this embed */
    setUrl(url:ODEmbedData["url"]){
        this.data.url = url
        return this
    }
    /**Set the description of this embed */
    setDescription(description:ODEmbedData["description"]){
        this.data.description = description
        return this
    }
    /**Set the author of this embed */
    setAuthor(text:ODEmbedData["authorText"], image?:ODEmbedData["authorImage"], url?:ODEmbedData["authorUrl"]){
        this.data.authorText = text
        this.data.authorImage = image ?? null
        this.data.authorUrl = url ?? null
        return this
    }
    /**Set the footer of this embed */
    setFooter(text:ODEmbedData["footerText"], image?:ODEmbedData["footerImage"]){
        this.data.footerText = text
        this.data.footerImage = image ?? null
        return this
    }
    /**Set the image of this embed */
    setImage(image:ODEmbedData["image"]){
        this.data.image = image
        return this
    }
    /**Set the thumbnail of this embed */
    setThumbnail(thumbnail:ODEmbedData["thumbnail"]){
        this.data.thumbnail = thumbnail
        return this
    }
    /**Set the fields of this embed */
    setFields(fields:ODEmbedData["fields"]){
        //TEMP CHECKS
        fields.forEach((field,index) => {
            if (field.value.length >= 1024) throw new ODSystemError("ODEmbed:setFields() => field "+index+" reached 1024 character limit!")
            if (field.name.length >= 256) throw new ODSystemError("ODEmbed:setFields() => field "+index+" reached 256 name character limit!")
        })

        this.data.fields = fields
        return this
    }
    /**Add fields to this embed */
    addFields(...fields:ODEmbedData["fields"]){
        //TEMP CHECKS
        fields.forEach((field,index) => {
            if (field.value.length >= 1024) throw new ODSystemError("ODEmbed:addFields() => field "+index+" reached 1024 character limit!")
            if (field.name.length >= 256) throw new ODSystemError("ODEmbed:addFields() => field "+index+" reached 256 name character limit!")
        })

        this.data.fields.push(...fields)
        return this
    }
    /**Clear all fields from this embed */
    clearFields(){
        this.data.fields = []
        return this
    }
    /**Set the timestamp of this embed */
    setTimestamp(timestamp:ODEmbedData["timestamp"]){
        this.data.timestamp = timestamp
        return this
    }
}

/**## ODEmbed `class`
 * This is an Open Ticket embed builder.
 * 
 * With this class, you can create a embed to use in a message.
 * The only difference with normal embeds is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODEmbed<Source extends string,Params> extends ODBuilderImplementation<ODEmbedInstance,Source,Params,ODEmbedBuildResult> {
    /**Build this embed & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        try{
            //create instance
            const instance = new ODEmbedInstance()

            //wait for workers to finish
            await this.workers.executeWorkers(instance,source,params)

            //create the discord.js embed
            const embed = new discord.EmbedBuilder()
            if (instance.data.title) embed.setTitle(instance.data.title)
            if (instance.data.color) embed.setColor(instance.data.color)
            if (instance.data.url) embed.setURL(instance.data.url)
            if (instance.data.description) embed.setDescription(instance.data.description)
            if (instance.data.authorText) embed.setAuthor({
                name:instance.data.authorText,
                iconURL:instance.data.authorImage ?? undefined,
                url:instance.data.authorUrl ?? undefined
            })
            if (instance.data.footerText) embed.setFooter({
                text:instance.data.footerText,
                iconURL:instance.data.footerImage ?? undefined,
            })
            if (instance.data.image) embed.setImage(instance.data.image)
            if (instance.data.thumbnail) embed.setThumbnail(instance.data.thumbnail)
            if (instance.data.timestamp) embed.setTimestamp(instance.data.timestamp)
            if (instance.data.fields.length > 0) embed.setFields(instance.data.fields)

            this.cache = {id:this.id,embed}
            this.didCache = true
            return {id:this.id,embed}
        }catch(err){
            process.emit("uncaughtException",new ODSystemError("ODEmbed:build(\""+this.id.value+"\") => Major Error (see next error)"))
            process.emit("uncaughtException",err)
            return {id:this.id,embed:null}
        }
    }
}

/**## ODMessageManager `class`
 * This is an Open Ticket message manager.
 * 
 * It contains all Open Ticket message builders. Here, you can add your own messages or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODMessageManager extends ODManagerWithSafety<ODMessage<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODMessage("opendiscord:unknown-message",(instance,params,source,cancel) => {
                instance.setContent("**❌ <ODError:Unknown Message>**\nCouldn't find message in registery `opendiscord.builders.messages`")
                cancel()
            })
        },debug,"message")
    }
}

/**## ODMessageData `interface`
 * This interface contains the data to build a message.
 */
export interface ODMessageData {
    /**The content of this message. `null` when no content */
    content:string|null,
    /**Poll data for this message */
    poll:discord.PollData|null,
    /**Try to make this message ephemeral when available */
    ephemeral:boolean,

    /**Embeds from this message */
    embeds:ODEmbedBuildResult[],
    /**Components from this message */
    components:ODComponentBuildResult[],
    /**Files from this message */
    files:ODFileBuildResult[],

    /**Additional options that aren't covered by the Open Ticket api!*/
    additionalOptions:Omit<discord.MessageCreateOptions,"poll"|"content"|"embeds"|"components"|"files"|"flags">
}

/**## ODMessageBuildResult `interface`
 * This interface contains the result from a built message. This can be sent in a discord channel!
 */
export interface ODMessageBuildResult {
    /**The id of this message */
    id:ODId,
    /**The discord message */
    message:Omit<discord.MessageCreateOptions,"flags">,
    /**When enabled, the bot will try to send this as an ephemeral message */
    ephemeral:boolean
}

/**## ODMessageBuildSentResult `interface`
 * This interface contains the result from a sent built message. This can be used to edit, view & save the message that got created.
 */
export interface ODMessageBuildSentResult<InGuild extends boolean> {
    /**Did the message get sent successfully? */
    success:boolean,
    /**The message that got sent. */
    message:discord.Message<InGuild>|null
}

/**## ODMessageInstance `class`
 * This is an Open Ticket message instance.
 * 
 * It contains all properties & functions to build a message!
 */
export class ODMessageInstance {
    /**The current data of this message */
    data: ODMessageData = {
        content:null,
        poll:null,
        ephemeral:false,

        embeds:[],
        components:[],
        files:[],

        additionalOptions:{
        }
    }

    /**Set the content of this message */
    setContent(content:ODMessageData["content"]){
        this.data.content = content
        return this
    }
    /**Set the poll of this message */
    setPoll(poll:ODMessageData["poll"]){
        this.data.poll = poll
        return this
    }
    /**Make this message ephemeral when possible */
    setEphemeral(ephemeral:ODMessageData["ephemeral"]){
        this.data.ephemeral = ephemeral
        return this
    }
    /**Set the embeds of this message */
    setEmbeds(...embeds:ODEmbedBuildResult[]){
        this.data.embeds = embeds
        return this
    }
    /**Add an embed to this message! */
    addEmbed(embed:ODEmbedBuildResult){
        this.data.embeds.push(embed)
        return this
    }
    /**Remove an embed from this message */
    removeEmbed(id:ODValidId){
        const index = this.data.embeds.findIndex((embed) => embed.id.value === new ODId(id).value)
        if (index > -1) this.data.embeds.splice(index,1)
        return this
    }
    /**Get an embed from this message */
    getEmbed(id:ODValidId){
        const embed = this.data.embeds.find((embed) => embed.id.value === new ODId(id).value)
        if (embed) return embed.embed
        else return null
    }
    /**Set the components of this message */
    setComponents(...components:ODComponentBuildResult[]){
        this.data.components = components
        return this
    }
    /**Add a component to this message! */
    addComponent(component:ODComponentBuildResult){
        this.data.components.push(component)
        return this
    }
    /**Remove a component from this message */
    removeComponent(id:ODValidId){
        const index = this.data.components.findIndex((component) => component.id.value === new ODId(id).value)
        if (index > -1) this.data.components.splice(index,1)
        return this
    }
    /**Get a component from this message */
    getComponent(id:ODValidId){
        const component = this.data.components.find((component) => component.id.value === new ODId(id).value)
        if (component) return component.component
        else return null
    }
    /**Set the files of this message */
    setFiles(...files:ODFileBuildResult[]){
        this.data.files = files
        return this
    }
    /**Add a file to this message! */
    addFile(file:ODFileBuildResult){
        this.data.files.push(file)
        return this
    }
    /**Remove a file from this message */
    removeFile(id:ODValidId){
        const index = this.data.files.findIndex((file) => file.id.value === new ODId(id).value)
        if (index > -1) this.data.files.splice(index,1)
        return this
    }
    /**Get a file from this message */
    getFile(id:ODValidId){
        const file = this.data.files.find((file) => file.id.value === new ODId(id).value)
        if (file) return file.file
        else return null
    }
}

/**## ODMessage `class`
 * This is an Open Ticket message builder.
 * 
 * With this class, you can create a message to send in a discord channel.
 * The only difference with normal messages is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODMessage<Source extends string,Params> extends ODBuilderImplementation<ODMessageInstance,Source,Params,ODMessageBuildResult> {
    /**Build this message & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        //create instance
        const instance = new ODMessageInstance()

        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)

        //create the discord.js message
        const componentArray: discord.ActionRowBuilder<discord.MessageActionRowComponentBuilder>[] = []
        let currentRow: discord.ActionRowBuilder<discord.MessageActionRowComponentBuilder> = new discord.ActionRowBuilder()
        instance.data.components.forEach((c) => {
            //return when component crashed
            if (c.component == null) return
            else if (c.component == "\n"){
                //create new current row when required
                if (currentRow.components.length > 0){
                    componentArray.push(currentRow)
                    currentRow = new discord.ActionRowBuilder()
                }
            }else if (c.component instanceof discord.BaseSelectMenuBuilder){
                //push current row when not empty
                if (currentRow.components.length > 0){
                    componentArray.push(currentRow)
                    currentRow = new discord.ActionRowBuilder()
                }
                currentRow.addComponents(c.component)
                //create new current row after dropdown
                componentArray.push(currentRow)
                currentRow = new discord.ActionRowBuilder()
            }else{
                //push button to current row
                currentRow.addComponents(c.component)
            }

            //create new row when 5 rows in length
            if (currentRow.components.length == 5){
                componentArray.push(currentRow)
                currentRow = new discord.ActionRowBuilder()
            }
        })
        //push final row to array
        if (currentRow.components.length > 0) componentArray.push(currentRow)

        const filteredEmbeds = instance.data.embeds.map((e) => e.embed).filter((e) => e instanceof discord.EmbedBuilder) as discord.EmbedBuilder[]
        const filteredFiles = instance.data.files.map((f) => f.file).filter((f) => f instanceof discord.AttachmentBuilder) as discord.AttachmentBuilder[]
        
        const message : discord.MessageCreateOptions = {
            content:instance.data.content ?? "",
            poll:instance.data.poll ?? undefined,
            embeds:filteredEmbeds,
            components:componentArray,
            files:filteredFiles
        }
        
        let result = {id:this.id,message,ephemeral:instance.data.ephemeral}

        Object.assign(result.message,instance.data.additionalOptions)

        this.cache = result
        this.didCache = true
        return result
    }
}

/**## ODModalManager `class`
 * This is an Open Ticket modal manager.
 * 
 * It contains all Open Ticket modal builders. Here, you can add your own modals or edit existing ones!
 * 
 * It's recommended to use this system in combination with all the other Open Ticket builders!
 */
export class ODModalManager extends ODManagerWithSafety<ODModal<string,any>> {
    constructor(debug:ODDebugger){
        super(() => {
            return new ODModal("opendiscord:unknown-modal",(instance,params,source,cancel) => {
                instance.setCustomId("od:unknown-modal")
                instance.setTitle("❌ <ODError:Unknown Modal>")
                instance.setQuestions(
                    {
                        style:"short",
                        customId:"error",
                        label:"error",
                        placeholder:"Contact the bot creator for more info!"
                    }
                )
                cancel()
            })
        },debug,"modal")
    }
}

/**## ODModalDataQuestion `interface`
 * This interface contains the data to build a modal question.
 */
export interface ODModalDataQuestion {
    /**The style of this modal question */
    style:"short"|"paragraph",
    /**The custom id of this modal question */
    customId:string
    /**The label of this modal question */
    label?:string,
    /**The min length of this modal question */
    minLength?:number,
    /**The max length of this modal question */
    maxLength?:number,
    /**Is this modal question required? */
    required?:boolean,
    /**The placeholder of this modal question */
    placeholder?:string,
    /**The initial value of this modal question */
    value?:string
}

/**## ODModalData `interface`
 * This interface contains the data to build a modal.
 */
export interface ODModalData {
    /**The custom id of this modal */
    customId:string,
    /**The title of this modal */
    title:string|null,
    /**The collection of questions in this modal */
    questions:ODModalDataQuestion[],
}

/**## ODModalBuildResult `interface`
 * This interface contains the result from a built modal (form). This can be used in the `ODMessage` builder!
 */
export interface ODModalBuildResult {
    /**The id of this modal */
    id:ODId,
    /**The discord modal */
    modal:discord.ModalBuilder
}

/**## ODModalInstance `class`
 * This is an Open Ticket modal instance.
 * 
 * It contains all properties & functions to build a modal!
 */
export class ODModalInstance {
    /**The current data of this modal */
    data: ODModalData = {
        customId:"",
        title:null,
        questions:[]
    }

    /**Set the custom id of this modal */
    setCustomId(customId:ODModalData["customId"]){
        this.data.customId = customId
        return this
    }
    /**Set the title of this modal */
    setTitle(title:ODModalData["title"]){
        this.data.title = title
        return this
    }
    /**Set the questions of this modal */
    setQuestions(...questions:ODModalData["questions"]){
        this.data.questions = questions
        return this
    }
    /**Add a question to this modal! */
    addQuestion(question:ODModalDataQuestion){
        this.data.questions.push(question)
        return this
    }
    /**Remove a question from this modal */
    removeQuestion(customId:string){
        const index = this.data.questions.findIndex((question) => question.customId === customId)
        if (index > -1) this.data.questions.splice(index,1)
        return this
    }
    /**Get a question from this modal */
    getQuestion(customId:string){
        const question = this.data.questions.find((question) => question.customId === customId)
        if (question) return question
        else return null
    }
}

/**## ODModal `class`
 * This is an Open Ticket modal builder.
 * 
 * With this class, you can create a modal to use as response in interactions.
 * The only difference with normal modals is that this one can be edited by Open Ticket plugins!
 * 
 * This is possible by using "workers" or multiple functions that will be executed in priority order!
 */
export class ODModal<Source extends string,Params> extends ODBuilderImplementation<ODModalInstance,Source,Params,ODModalBuildResult> {
    /**Build this modal & compile it for discord.js */
    async build(source:Source, params:Params){
        if (this.didCache && this.cache && this.allowCache) return this.cache
        
        //create instance
        const instance = new ODModalInstance()

        //wait for workers to finish
        await this.workers.executeWorkers(instance,source,params)

        //create the discord.js modal
        const modal = new discord.ModalBuilder()
        modal.setCustomId(instance.data.customId)
        if (instance.data.title) modal.setTitle(instance.data.title)
        else modal.setTitle(instance.data.customId)
        
        instance.data.questions.forEach((question) => {
            const input = new discord.TextInputBuilder()
                .setStyle(question.style == "paragraph" ? discord.TextInputStyle.Paragraph : discord.TextInputStyle.Short)
                .setCustomId(question.customId)
                .setLabel(question.label ? question.label : question.customId)
                .setRequired(question.required ? true : false)
            
            if (question.minLength) input.setMinLength(question.minLength)
            if (question.maxLength) input.setMaxLength(question.maxLength)
            if (question.value) input.setValue(question.value)
            if (question.placeholder) input.setPlaceholder(question.placeholder)

            modal.addComponents(
                new discord.ActionRowBuilder<discord.ModalActionRowComponentBuilder>()
                    .addComponents(input)
            )
        })

        this.cache = {id:this.id,modal}
        this.didCache = true
        return {id:this.id,modal}
    }
}