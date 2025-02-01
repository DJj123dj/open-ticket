///////////////////////////////////////
//CONSOLE MODULE
///////////////////////////////////////
import { ODHTTPGetRequest, ODVersion, ODSystemError, ODPluginError, ODManager, ODManagerData, ODValidId } from "./base"
import { ODMain } from "../main"
import nodepath from "path"
import fs from "fs"
import ansis from "ansis"

/**## ODValidConsoleColor `type`
 * This is a collection of all the supported console colors within Open Ticket.
 */
export type ODValidConsoleColor = "white"|"red"|"yellow"|"green"|"blue"|"gray"|"cyan"|"magenta"

/**## ODConsoleMessageParam `type`
 * This interface contains all data required for a console log parameter within Open Ticket.
 */
export interface ODConsoleMessageParam {
    /**The key of this parameter. */
    key:string,
    /**The value of this parameter. */
    value:string,
    /**When enabled, this parameter will only be shown in the debug file. */
    hidden?:boolean
}

/**## ODConsoleMessage `class`
 * This is an Open Ticket console message.
 * 
 * It is used to create beautiful & styled logs in the console with a prefix, message & parameters.
 * It also has full color support using `ansis` and parameters are parsed for you!
 */
export class ODConsoleMessage {
    /**The main message sent in the console */
    message: string
    /**An array of all the parameters in this message */
    params: ODConsoleMessageParam[]
    /**The prefix of this message (!uppercase recommended!) */
    prefix: string
    /**The color of the prefix of this message */
    color: ODValidConsoleColor
    
    constructor(message:string, prefix:string, color:ODValidConsoleColor, params?:ODConsoleMessageParam[]){
        this.message = message
        this.params = params ? params : []
        this.prefix = prefix

        if (["white","red","yellow","green","blue","gray","cyan","magenta"].includes(color)){
            this.color = color
        }else{
            this.color = "white"
        }
    }
    /**Render this message to the console using `console.log`! Returns `false` when something went wrong. */
    render(){
        try {
            const prefixcolor = ansis[this.color]

            const paramsstring = " "+this.createParamsString("gray")
            const message = prefixcolor("["+this.prefix+"] ")+this.message

            console.log(message+paramsstring)
            return true
        }catch{
            return false
        }
    }
    /**Create a more-detailed, non-colored version of this message to store it in the `otdebug.txt` file! */
    toDebugString(){
        const pstrings: string[] = []
        this.params.forEach((p) => {
            pstrings.push(p.key+": "+p.value)
        })
        const pstring = (pstrings.length > 0) ? " ("+pstrings.join(", ")+")" : ""
        const date = new Date()
        const dstring = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return `[${dstring} ${this.prefix}] ${this.message}${pstring}`
    }
    /**Render the parameters of this message in a specific color. */
    createParamsString(color:ODValidConsoleColor){
        let validcolor: ODValidConsoleColor = "white"
        if (["white","red","yellow","green","blue","gray","cyan","magenta"].includes(color)){
            validcolor = color
        }

        const pstrings: string[] = []
        this.params.forEach((p) => {
            if (!p.hidden) pstrings.push(p.key+": "+p.value)
        })

        return (pstrings.length > 0) ? ansis[validcolor](" ("+pstrings.join(", ")+")") : ""
    }
    /**Set the message */
    setMessage(message:string){
        this.message = message
        return this
    }
    /**Set the params */
    setParams(params:ODConsoleMessageParam[]){
        this.params = params
        return this
    }
    /**Set the prefix */
    setPrefix(prefix:string){
        this.prefix = prefix
        return this
    }
    /**Set the prefix color */
    setColor(color:ODValidConsoleColor){
        if (["white","red","yellow","green","blue","gray","cyan","magenta"].includes(color)){
            this.color = color
        }else{
            this.color = "white"
        }
        return this
    }
}

/**## ODConsoleInfoMessage `class`
 * This is an Open Ticket console info message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "INFO" messages!
 */
export class ODConsoleInfoMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"INFO","blue",params)
    }
}

/**## ODConsoleSystemMessage `class`
 * This is an Open Ticket console system message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "SYSTEM" messages!
 */
export class ODConsoleSystemMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"SYSTEM","green",params)
    }
}

/**## ODConsolePluginMessage `class`
 * This is an Open Ticket console plugin message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "PLUGIN" messages!
 */
export class ODConsolePluginMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"PLUGIN","magenta",params)
    }
}

/**## ODConsoleDebugMessage `class`
 * This is an Open Ticket console debug message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "DEBUG" messages!
 */
export class ODConsoleDebugMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"DEBUG","cyan",params)
    }
}

/**## ODConsoleWarningMessage `class`
 * This is an Open Ticket console warning message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "WARNING" messages!
 */
export class ODConsoleWarningMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"WARNING","yellow",params)
    }
}

/**## ODConsoleErrorMessage `class`
 * This is an Open Ticket console error message.
 * 
 * It is the same as a normal `ODConsoleMessage`, but it has a predefined prefix & color scheme for the "ERROR" messages!
 */
export class ODConsoleErrorMessage extends ODConsoleMessage {
    constructor(message:string,params?:ODConsoleMessageParam[]){
        super(message,"ERROR","red",params)
    }
}

/**## ODError `class`
 * This is an Open Ticket error.
 * 
 * It is used to render and log Node.js errors & crashes in a styled way to the console & `otdebug.txt` file!
 */
export class ODError {
    /**The original error that this class wraps around */
    error: Error|ODSystemError|ODPluginError
    /**The origin of the original error */
    origin: NodeJS.UncaughtExceptionOrigin

    constructor(error:Error|ODSystemError|ODPluginError, origin:NodeJS.UncaughtExceptionOrigin){
        this.error = error
        this.origin = origin
    }

    /**Render this error to the console using `console.log`! Returns `false` when something went wrong. */
    render(){
        try {
            let prefix = (this.error["_ODErrorType"] == "plugin") ? "PLUGIN ERROR" : ((this.error["_ODErrorType"] == "system") ? "OPENTICKET ERROR" : "UNKNOWN ERROR")
            //title
            console.log(ansis.red("["+prefix+"]: ")+this.error.message+" | origin: "+this.origin)
            //stack trace
            if (this.error.stack) console.log(ansis.gray(this.error.stack))
            //additional message
            if (this.error["_ODErrorType"] == "plugin") console.log(ansis.red.bold("\nPlease report this error to the plugin developer and help us create a more stable plugin!"))
            else console.log(ansis.red.bold("\nPlease report this error to our discord server and help us create a more stable ticket bot!"))
            console.log(ansis.red("Also send the "+ansis.cyan.bold("otdebug.txt")+" file! It would help a lot!\n"))
            return true
        }catch{
            return false
        }
    }
    /**Create a more-detailed, non-colored version of this error to store it in the `otdebug.txt` file! */
    toDebugString(){
        return "[UNKNOWN OD ERROR]: "+this.error.message+" | origin: "+this.origin+"\n"+this.error.stack
    }
}

/**## ODConsoleMessageTypes `type`
 * This is a collection of all the default console message types within Open Ticket.
 */
export type ODConsoleMessageTypes = "info"|"system"|"plugin"|"debug"|"warning"|"error"

/**## ODConsoleManager `class`
 * This is the Open Ticket console manager.
 * 
 * It handles the entire console system of Open Ticket. It's also the place where you need to log `ODConsoleMessage`'s.
 * This manager keeps a short history of messages sent to the console which is configurable by plugins.
 * 
 * The debug file (`otdebug.txt`) is handled in a sub-manager!
 */
export class ODConsoleManager {
    /**The history of `ODConsoleMessage`'s and `ODError`'s since startup */
    history: (ODConsoleMessage|ODError)[] = []
    /**The max length of the history. The oldest messages will be removed when over the limit */
    historylength = 100
    /**An alias to the debugfile manager. (`otdebug.txt`) */
    debugfile: ODDebugFileManager

    constructor(historylength:number, debugfile:ODDebugFileManager){
        this.historylength = historylength
        this.debugfile = debugfile
    }

    /**Log a message to the console ... But in the Open Ticket way :) */
    log(message:ODConsoleMessage): void
    log(message:ODError): void
    log(message:string, type?:ODConsoleMessageTypes, params?:ODConsoleMessageParam[]): void
    log(message:ODConsoleMessage|ODError|string, type?:ODConsoleMessageTypes, params?:ODConsoleMessageParam[]){
        if (message instanceof ODConsoleMessage){
            message.render()
            if (this.debugfile) this.debugfile.writeConsoleMessage(message)
            this.history.push(message)

        }else if (message instanceof ODError){
            message.render()
            if (this.debugfile) this.debugfile.writeErrorMessage(message)
            this.history.push(message)
            
        }else if (["string","number","boolean","object"].includes(typeof message)){
            let newMessage: ODConsoleMessage
            if (type == "info") newMessage = new ODConsoleInfoMessage(message,params)
            else if (type == "system") newMessage = new ODConsoleSystemMessage(message,params)
            else if (type == "plugin") newMessage = new ODConsolePluginMessage(message,params)
            else if (type == "debug") newMessage = new ODConsoleDebugMessage(message,params)
            else if (type == "warning") newMessage = new ODConsoleWarningMessage(message,params)
            else if (type == "error") newMessage = new ODConsoleErrorMessage(message,params)
            else newMessage = new ODConsoleSystemMessage(message,params)

            newMessage.render()
            if (this.debugfile) this.debugfile.writeConsoleMessage(newMessage)
            this.history.push(newMessage)
        }
        this.#purgeHistory()
    }
    /**Shorten the history when it exceeds the max history length! */
    #purgeHistory(){
        if (this.history.length > this.historylength) this.history.shift()
    }
}

/**## ODDebugFileManager `class`
 * This is the Open Ticket debug file manager.
 * 
 * It manages the Open Ticket debug file (`otdebug.txt`) which keeps a history of all system logs.
 * There are even internal logs that aren't logged to the console which are available in this file!
 * 
 * Using this class, you can change the max length of this file and some other cool things!
 */
export class ODDebugFileManager {
    /**The path to the debugfile (`./otdebug.txt` by default) */
    path: string
    /**The filename of the debugfile (`otdebug.txt` by default) */
    filename: string
    /**The current version of the bot used in the debug file. */
    version: ODVersion
    /**The max length of the debug file. */
    maxlines: number
    
    constructor(path:string, filename:string, maxlines:number, version:ODVersion){
        this.path = nodepath.join(path,filename)
        this.filename = filename
        this.version = version
        this.maxlines = maxlines

        this.#writeStartupStats()
    }

    /**Check if the debug file exists */
    #existsDebugFile(){
        return fs.existsSync(this.path)
    }
    /**Read from the debug file */
    #readDebugFile(){
        if (this.#existsDebugFile()){
            try {
                return fs.readFileSync(this.path).toString()
            }catch{
                return false
            }
        }else{
            return false
        }
    }
    /**Write to the debug file and shorten it when needed. */
    #writeDebugFile(text:string){
        const currenttext = this.#readDebugFile()
        if (currenttext){
            const splitted = currenttext.split("\n")
            
            if (splitted.length+text.split("\n").length > this.maxlines){
                splitted.splice(7,(text.split("\n").length))
            }

            splitted.push(text)
            fs.writeFileSync(this.path,splitted.join("\n"))
        }else{
            //write new file:
            const newtext = this.#createStatsText()+text
            fs.writeFileSync(this.path,newtext)
        }
    }
    /**Generate the stats/header of the debug file (containing the version) */
    #createStatsText(){
        const date = new Date()
        const dstring = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        return [
            "=========================",
            "OPEN TICKET DEBUG FILE:",
            "version: "+this.version.toString(),
            "last startup: "+dstring,
            "=========================\n\n"
        ].join("\n")
    }
    /**Write the stats/header to the debug file on startup */
    #writeStartupStats(){
        const currenttext = this.#readDebugFile()
        if (currenttext){
            //edit previous file:
            const splitted = currenttext.split("\n")
            splitted.splice(0,7)
            
            if (splitted.length+11 > this.maxlines){
                splitted.splice(0,((splitted.length+11) - this.maxlines))
            }

            splitted.unshift(this.#createStatsText())
            splitted.push("\n---------------------------------------------------------------------\n---------------------------------------------------------------------\n")
            
            fs.writeFileSync(this.path,splitted.join("\n"))
        }else{
            //write new file:
            const newtext = this.#createStatsText()
            fs.writeFileSync(this.path,newtext)
        }
    }
    /**Write an `ODConsoleMessage` to the debug file */
    writeConsoleMessage(message:ODConsoleMessage){
        this.#writeDebugFile(message.toDebugString())
    }
    /**Write an `ODError` to the debug file */
    writeErrorMessage(error:ODError){
        this.#writeDebugFile(error.toDebugString())
    }
    /**Write custom text to the debug file */
    writeText(text:string){
        this.#writeDebugFile(text)
    }
    /**Write a custom note to the debug file (starting with `[NOTE]:`) */
    writeNote(text:string){
        this.#writeDebugFile("[NOTE]: "+text)
    }
}

/**## ODDebugger `class`
 * This is the Open Ticket debugger.
 * 
 * It is a simple wrapper around the `ODConsoleManager` to handle debugging (primarily for `ODManagers`).
 * Messages created using this debugger are only logged to the debug file unless specified otherwise.
 * 
 * You will probably notice this class being used in the `ODManager` constructor.
 * 
 * Using this system, all additions & removals inside a manager are logged to the debug file. This makes searching for errors a lot easier!
 */
export class ODDebugger {
    /**An alias to the Open Ticket console manager. */
    console: ODConsoleManager
    /**When enabled, debug logs are also shown in the console. */
    visible: boolean = false

    constructor(console:ODConsoleManager){
        this.console = console
    }

    /**Create a debug message. This will always be logged to `otdebug.txt` & sometimes to the console (when enabled). Returns `true` when visible */
    debug(message:string, params?:{key:string,value:string}[]): boolean {
        if (this.visible){
            this.console.log(new ODConsoleDebugMessage(message,params))
            return true
        }else{
            this.console.debugfile.writeConsoleMessage(new ODConsoleDebugMessage(message,params))
            return false
        }
    }
}

/**## ODLivestatusColor `type`
 * This is a collection of all the colors available within the LiveStatus system.
 */
export type ODLiveStatusColor = "normal"|"red"|"green"|"blue"|"yellow"|"white"|"gray"|"magenta"|"cyan"

/**## ODLiveStatusSourceData `interface`
 * This is an interface containing all raw data received from the LiveStatus system.
 */
export interface ODLiveStatusSourceData {
    /**The message to display */
    message:{
        /**The title of the message to display */
        title:string,
        /**The title color of the message to display */
        titleColor:ODLiveStatusColor,
        /**The description of the message to display */
        description:string,
        /**The description color of the message to display */
        descriptionColor:ODLiveStatusColor
    },
    /**The message will only be shown when the bot matches all statements */
    active:{
        /**A list of versions to match */
        versions:string[],
        /**A list of languages to match */
        languages:string[],
        /**All languages should match */
        allLanguages:boolean,
        /**Match when the bot is using plugins */
        usingPlugins:boolean,
        /**Match when the bot is not using plugins */
        notUsingPlugins:boolean,
        /**Match when the bot is using slash commands */
        usingSlashCommands:boolean,
        /**Match when the bot is not using slash commands */
        notUsingSlashCommands:boolean,
        /**Match when the bot is not using transcripts */
        notUsingTranscripts:boolean,
        /**Match when the bot is using text transcripts */
        usingTextTranscripts:boolean,
        /**Match when the bot is using html transcripts */
        usingHtmlTranscripts:boolean
    }
}

/**## ODLiveStatusSource `class`
 * This is the Open Ticket livestatus source.
 * 
 * It is an empty template for a livestatus source.
 * By default, you should use `ODLiveStatusUrlSource` or `ODLiveStatusFileSource`,
 * unless you want to create one on your own!
 * 
 * This class doesn't do anything on it's own! It's just a template!
 */
export class ODLiveStatusSource extends ODManagerData {
    /**The raw data of this source */
    data: ODLiveStatusSourceData[]

    constructor(id:ODValidId, data:ODLiveStatusSourceData[]){
        super(id)
        this.data = data
    }

    /**Change the current data using this method! */
    setData(data:ODLiveStatusSourceData[]){
        this.data = data
    }
    /**Get all messages relevant to the bot based on some parameters. */
    async getMessages(main:ODMain): Promise<ODLiveStatusSourceData[]> {
        const validMessages: ODLiveStatusSourceData[] = []

        //parse data from ODMain
        const currentVersion: string = main.versions.get("opendiscord:version").toString(true)
        const usingSlashCommands: boolean = main.configs.get("opendiscord:general").data.slashCommands
        const usingTranscripts: false|"text"|"html" = false as false|"text"|"html" //TODO
        const currentLanguage: string = main.languages.getCurrentLanguageId()
        const usingPlugins: boolean = (main.plugins.getLength() > 0)

        //check data for each message
        this.data.forEach((msg) => {
            const {active} = msg

            const correctVersion = active.versions.includes(currentVersion)
            const correctSlashMode = (usingSlashCommands && active.usingSlashCommands) || (!usingSlashCommands && active.notUsingSlashCommands)
            const correctTranscriptMode = (usingTranscripts == "text" && active.usingTextTranscripts) || (usingTranscripts == "html" && active.usingHtmlTranscripts) || (!usingTranscripts && active.notUsingTranscripts)
            const correctLanguage = active.languages.includes(currentLanguage) || active.allLanguages
            const correctPlugins = (usingPlugins && active.usingPlugins) || (!usingPlugins && active.notUsingPlugins)

            if (correctVersion && correctLanguage && correctPlugins && correctSlashMode && correctTranscriptMode) validMessages.push(msg)
        })
        
        //return the valid messages
        return validMessages
    }
}

/**## ODLiveStatusFileSource `class`
 * This is the Open Ticket livestatus file source.
 * 
 * It is a LiveStatus source that will read the data from a local file.
 * 
 * This can be used for testing/extending the LiveStatus system!
 */
export class ODLiveStatusFileSource extends ODLiveStatusSource {
    /**The path to the source file */
    path: string
    
    constructor(id:ODValidId, path:string){
        if (fs.existsSync(path)){
            super(id,JSON.parse(fs.readFileSync(path).toString()))
        }else throw new ODSystemError("LiveStatus source file doesn't exist!")
        this.path = path
    }
}

/**## ODLiveStatusUrlSource `class`
 * This is the Open Ticket livestatus url source.
 * 
 * It is a LiveStatus source that will read the data from a http URL (json file).
 * 
 * This is the default way of receiving LiveStatus messages!
 */
export class ODLiveStatusUrlSource extends ODLiveStatusSource {
    /**The url used in the request */
    url: string
    /**The `ODHTTPGetRequest` helper to fetch the url! */
    request: ODHTTPGetRequest

    constructor(id:ODValidId, url:string){
        super(id,[])
        this.url = url
        this.request = new ODHTTPGetRequest(url,false)
    }
    async getMessages(main:ODMain): Promise<ODLiveStatusSourceData[]> {
        //additional setup
        this.request.url = this.url
        const rawRes = await this.request.run()
        if (rawRes.status != 200) throw new ODSystemError("ODLiveStatusUrlSource => Request Failed!")
        try{
            this.setData(JSON.parse(rawRes.body))
        }catch{
            throw new ODSystemError("ODLiveStatusUrlSource => Request Failed!")
        }

        //default
        return super.getMessages(main)
    }
}

/**## ODLiveStatusManager `class`
 * This is the Open Ticket livestatus manager.
 * 
 * It manages all LiveStatus sources and has the renderer for all LiveStatus messages.
 * 
 * You can use this to customise or add stuff to the LiveStatus system.
 * Access it in the global `opendiscord.startscreen.livestatus` variable!
 */
export class ODLiveStatusManager extends ODManager<ODLiveStatusSource> {
    /**The class responsible for rendering the livestatus messages. */
    renderer: ODLiveStatusRenderer
    /**A reference to the ODMain or "openticket" global variable */
    #main: ODMain

    constructor(debug:ODDebugger, main:ODMain){
        super(debug,"livestatus source")
        this.renderer = new ODLiveStatusRenderer(main.console)
        this.#main = main
    }

    /**Get the messages from all sources combined! */
    async getAllMessages(): Promise<ODLiveStatusSourceData[]> {
        const messages: ODLiveStatusSourceData[] = []
        for (const source of this.getAll()){
            try {
                messages.push(...(await source.getMessages(this.#main)))
            }catch{}
        }
        return messages
    }
}

/**## ODLiveStatusRenderer `class`
 * This is the Open Ticket livestatus renderer.
 * 
 * It's responsible for rendering all LiveStatus messages to the console.
 */
export class ODLiveStatusRenderer {
    /**A reference to the ODConsoleManager or "opendiscord.console" global variable */
    #console: ODConsoleManager

    constructor(console:ODConsoleManager){
        this.#console = console
    }

    /**Render all messages */
    render(messages:ODLiveStatusSourceData[]): string {
        try {
            //process data
            const final: string[] = []
            messages.forEach((msg) => {
                const titleColor = msg.message.titleColor
                const title = "["+msg.message.title+"] "
                
                const descriptionColor = msg.message.descriptionColor
                const description = msg.message.description.split("\n").map((text,row) => {
                    //first row row doesn't need prefix
                    if (row < 1) return text
                    //other rows do need a prefix
                    let text2 = text
                    for (const i of title){
                        text2 = " "+text2
                    }
                    return text2
                }).join("\n")


                if (!["red","yellow","green","blue","gray","magenta","cyan"].includes(titleColor)) var finalTitle = ansis.white(title)
                else var finalTitle = ansis[titleColor](title)
                if (!["red","yellow","green","blue","gray","magenta","cyan"].includes(descriptionColor)) var finalDescription = ansis.white(description)
                else var finalDescription = ansis[descriptionColor](description)

                final.push(finalTitle+finalDescription)
            })

            //return all messages
            return final.join("\n")
        }catch{
            this.#console.log("Failed to render LiveStatus messages!","error")
            return ""
        }
    }
}