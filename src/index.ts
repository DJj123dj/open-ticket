/*
   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  
  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  
  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     
  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     
  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     
   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     
                                                                       
    > Hey! We are looking for you!
    > Do you speak a language that isn't yet in our /languages directory?
    > Or do you speak one that isn't up-to-date anymore? 
    > Open Ticket needs translators for lots of different languages!
    > Feel free to join our translator team and help us improve Open Ticket!
    
    SUGGESTIONS:
    =====================
    Did you know that almost 70% of all Open Ticket features were requested by the community?
    Feel free to suggest new ideas in our discord server or via github issues!
    They are always welcome!

    INFORMATION:
    ============
    Open Ticket v4.0.0  -  © DJdj Development

    discord: https://discord.dj-dj.be
    website: https://openticket.dj-dj.be
    github: https://otgithub.dj-dj.be
    documentation: https://otdocs.dj-dj.be

    Config files:
    ./config/....json

    Send ./otdebug.txt to us when there is an error!
*/

//initialize API & check npm libraries
import { api, openticket, utilities } from "./core/startup/init"
export { api, openticket, utilities } from "./core/startup/init"
import ansis from "ansis"

/**The main sequence of Open Ticket. Runs `async` */
const main = async () => {
    //load all events
    (await import("./data/framework/eventLoader.js")).loadAllEvents()

    //error handling system
    process.on("uncaughtException",async (error,origin) => {
        try{
            await openticket.events.get("onErrorHandling").emit([error,origin])
            if (openticket.defaults.getDefault("errorHandling")){
                //custom error messages for known errors
                if (error.message == "Used disallowed intents"){
                    //invalid intents
                    openticket.log("Open Ticket doesn't work without Privileged Gateway Intents enabled!","error")
                    openticket.log("Enable them in the discord developer portal!","info")
                    console.log("\n")
                    process.exit(1)
                }else if (error.message == "An invalid token was provided."){
                    //invalid token
                    openticket.log("An invalid discord auth token was provided!","error")
                    openticket.log("Check the config if you have copied the token correctly!","info")
                    console.log("\n")
                    process.exit(1)
                }else{
                    //unknown error
                    const errmsg = new api.ODError(error,origin)
                    openticket.log(errmsg)
                    if (openticket.defaults.getDefault("crashOnError")) process.exit(1)
                    await openticket.events.get("afterErrorHandling").emit([error,origin,errmsg])
                }
            }
            
        }catch(err){
            console.log("[ERROR HANDLER ERROR]:",err)
        }
    })

    //handle data migration
    await (await import("./core/startup/manageMigration.js")).loadVersionMigrationSystem()

    //load plugins
    if (openticket.defaults.getDefault("pluginLoading")){
        await (await import("./core/startup/pluginLauncher.js")).loadAllPlugins()
    }
    await openticket.events.get("afterPluginsLoaded").emit([openticket.plugins])
    
    //load plugin classes
    openticket.log("Loading plugin classes...","system")
    if (openticket.defaults.getDefault("pluginClassLoading")){

    }
    await openticket.events.get("onPluginClassLoad").emit([openticket.plugins.classes,openticket.plugins])
    await openticket.events.get("afterPluginClassesLoaded").emit([openticket.plugins.classes,openticket.plugins])

    //load plugin events
    openticket.log("Loading plugin events...","system")
    if (openticket.defaults.getDefault("pluginEventLoading")){
    
    }
    await openticket.events.get("onPluginEventLoad").emit([openticket.plugins.events,openticket.plugins])
    await openticket.events.get("afterPluginEventsLoaded").emit([openticket.plugins.events,openticket.plugins])

    //load flags
    openticket.log("Loading flags...","system")
    if (openticket.defaults.getDefault("flagLoading")){
        await (await import("./data/framework/flagLoader.js")).loadAllFlags()
    }
    await openticket.events.get("onFlagLoad").emit([openticket.flags])
    await openticket.events.get("afterFlagsLoaded").emit([openticket.flags])

    //initiate flags
    await openticket.events.get("onFlagInit").emit([openticket.flags])
    if (openticket.defaults.getDefault("flagInitiating")){
        openticket.flags.init()
        openticket.debugfile.writeText("\n[ENABLED FLAGS]:\n"+openticket.flags.getFiltered((flag) => (flag.value == true)).map((flag) => flag.id.value).join("\n")+"\n")
        await openticket.events.get("afterFlagsInitiated").emit([openticket.flags])
    }

    //load debug
    if (openticket.defaults.getDefault("debugLoading")){
        const debugFlag = openticket.flags.get("openticket:debug")
        openticket.debug.visible = (debugFlag) ? debugFlag.value : false
    }

    //load config
    openticket.log("Loading configs...","system")
    if (openticket.defaults.getDefault("configLoading")){
        await (await import("./data/framework/configLoader.js")).loadAllConfigs()
    }
    await openticket.events.get("onConfigLoad").emit([openticket.configs])
    await openticket.events.get("afterConfigsLoaded").emit([openticket.configs])

    //UTILITY CONFIG
    const generalConfig = openticket.configs.get("openticket:general")

    if (openticket.defaults.getDefault("emojiTitleStyleLoading")){
        //set emoji style based on config
        openticket.defaults.setDefault("emojiTitleStyle",generalConfig.data.system.emojiStyle)
    }
    
    //load database
    openticket.log("Loading databases...","system")
    if (openticket.defaults.getDefault("databaseLoading")){
        await (await import("./data/framework/databaseLoader.js")).loadAllDatabases()
    }
    await openticket.events.get("onDatabaseLoad").emit([openticket.databases])
    await openticket.events.get("afterDatabasesLoaded").emit([openticket.databases])

    //load sessions
    openticket.log("Loading sessions...","system")
    if (openticket.defaults.getDefault("sessionLoading")){

    }
    await openticket.events.get("onSessionLoad").emit([openticket.sessions])
    await openticket.events.get("afterSessionsLoaded").emit([openticket.sessions])    

    //load language
    openticket.log("Loading languages...","system")
    if (openticket.defaults.getDefault("languageLoading")){
        await (await import("./data/framework/languageLoader.js")).loadAllLanguages()
    }
    await openticket.events.get("onLanguageLoad").emit([openticket.languages])
    await openticket.events.get("afterLanguagesLoaded").emit([openticket.languages])    

    //select language
    await openticket.events.get("onLanguageSelect").emit([openticket.languages])
    if (openticket.defaults.getDefault("languageSelection")){
        //set current language
        const languageId = (generalConfig && generalConfig.data.language) ? generalConfig.data.language  : "english"
        if (languageId.includes(":")){
            openticket.languages.setCurrentLanguage(languageId)
        }else{
            openticket.languages.setCurrentLanguage("openticket:"+languageId)
        }

        //set backup language
        const backupLanguageId = openticket.defaults.getDefault("backupLanguage")
        if (openticket.languages.exists(backupLanguageId)){
            openticket.languages.setBackupLanguage(backupLanguageId)
            
        }else throw new api.ODSystemError("Unknown backup language '"+backupLanguageId+"'!")

        await openticket.events.get("afterLanguagesSelected").emit([openticket.languages.get(languageId),openticket.languages.get(backupLanguageId),openticket.languages])    
    }
    
    //load config checker
    openticket.log("Loading config checker...","system")
    if (openticket.defaults.getDefault("checkerLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckers()
    }
    await openticket.events.get("onCheckerLoad").emit([openticket.checkers])
    await openticket.events.get("afterCheckersLoaded").emit([openticket.checkers])

    //load config checker functions
    if (openticket.defaults.getDefault("checkerFunctionLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerFunctions()
    }
    await openticket.events.get("onCheckerFunctionLoad").emit([openticket.checkers.functions,openticket.checkers])
    await openticket.events.get("afterCheckerFunctionsLoaded").emit([openticket.checkers.functions,openticket.checkers])
    
    //execute config checker
    await openticket.events.get("onCheckerExecute").emit([openticket.checkers])
    if (openticket.defaults.getDefault("checkerExecution")){
        const result = openticket.checkers.checkAll(true)
        await openticket.events.get("afterCheckersExecuted").emit([result,openticket.checkers])
    }

    //load config checker translations
    if (openticket.defaults.getDefault("checkerTranslationLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerTranslations()
    }
    await openticket.events.get("onCheckerTranslationLoad").emit([openticket.checkers.translation,((generalConfig && generalConfig.data.system && generalConfig.data.system.useTranslatedConfigChecker) ? generalConfig.data.system.useTranslatedConfigChecker : false),openticket.checkers])
    await openticket.events.get("afterCheckerTranslationsLoaded").emit([openticket.checkers.translation,openticket.checkers])

    //render config checker
    const advancedCheckerFlag = openticket.flags.get("openticket:checker")
    const disableCheckerFlag = openticket.flags.get("openticket:no-checker")

    await openticket.events.get("onCheckerRender").emit([openticket.checkers.renderer,openticket.checkers])
    if (openticket.defaults.getDefault("checkerRendering") && !(disableCheckerFlag ? disableCheckerFlag.value : false)){
        //check if there is a result (otherwise throw minor error)
        const result = openticket.checkers.lastResult
        if (!result) return openticket.log("Failed to render Config Checker! (couldn't fetch result)","error")
        
        //get components & check if full mode enabled
        const components = openticket.checkers.renderer.getComponents(!(advancedCheckerFlag ? advancedCheckerFlag.value : false),openticket.defaults.getDefault("checkerRenderEmpty"),openticket.checkers.translation,result)

        //render
        openticket.debugfile.writeText("\n[CONFIG CHECKER RESULT]:\n"+ansis.strip(components.join("\n"))+"\n")
        openticket.checkers.renderer.render(components)
        await openticket.events.get("afterCheckersRendered").emit([openticket.checkers.renderer,openticket.checkers])
    }

    //quit config checker (when required)
    if (openticket.checkers.lastResult && !openticket.checkers.lastResult.valid && !(disableCheckerFlag ? disableCheckerFlag.value : false)){
        await openticket.events.get("onCheckerQuit").emit([openticket.checkers])
        if (openticket.defaults.getDefault("checkerQuit")){
            process.exit(0)
            //there is no afterCheckerQuitted event :)
        }
    }

    //client configuration
    openticket.log("Loading client...","system")
    if (openticket.defaults.getDefault("clientLoading")){
        //add intents (for basic permissions)
        openticket.client.intents.push(
            "Guilds",
            "GuildMessages",
            "DirectMessages",
            "GuildEmojisAndStickers",
            "GuildMembers",
            "MessageContent",
            "GuildWebhooks",
            "GuildInvites"
        )

        //add privileged intents (required for transcripts)
        openticket.client.privileges.push("MessageContent","GuildMembers")

        //add partials (required for DM messages)
        openticket.client.partials.push("Channel","Message")

        //add permissions (not required when Administrator)
        openticket.client.permissions.push(
            "AddReactions",
            "AttachFiles",
            "CreatePrivateThreads",
            "CreatePublicThreads",
            "EmbedLinks",
            "ManageChannels",
            "ManageGuild",
            "ManageMessages",
            "ChangeNickname",
            "ManageRoles",
            "ManageThreads",
            "ManageWebhooks",
            "MentionEveryone",
            "ReadMessageHistory",
            "SendMessages",
            "SendMessagesInThreads",
            "UseApplicationCommands",
            "UseExternalEmojis",
            "ViewAuditLog",
            "ViewChannel"
        )

        //get token from config or env
        const configToken = openticket.configs.get("openticket:general").data.token ? openticket.configs.get("openticket:general").data.token : ""
        const envToken = openticket.env.getVariable("TOKEN") ? openticket.env.getVariable("TOKEN") : ""
        const token = openticket.configs.get("openticket:general").data.tokenFromENV ? envToken : configToken
        openticket.client.token = token
    }
    await openticket.events.get("onClientLoad").emit([openticket.client])
    await openticket.events.get("afterClientLoaded").emit([openticket.client])

    //client ready
    openticket.client.readyListener = async () => {
        openticket.log("Loading client setup...","system")
        await openticket.events.get("onClientReady").emit([openticket.client])
        if (openticket.defaults.getDefault("clientReady")){
            const client = openticket.client

            //check if all servers are valid
            const botServers = client.getGuilds()
            const generalConfig = openticket.configs.get("openticket:general")
            const serverId = generalConfig.data.serverId ? generalConfig.data.serverId : ""
            if (!serverId) throw new api.ODSystemError("Server Id Missing!")
            
            const mainServer = botServers.find((g) => g.id == serverId)
            client.mainServer = mainServer ?? null
            //throw if bot isn't member of main server
            if (!mainServer || !client.checkBotInGuild(mainServer)){
                console.log("\n")
                openticket.log("The bot isn't a member of the server provided in the config!","error")
                openticket.log("Please invite your bot to the server!","info")
                console.log("\n")
                process.exit(0)
            }
            //throw if bot doesn't have permissions in main server
            if (!client.checkGuildPerms(mainServer)){
                console.log("\n")
                openticket.log("The bot doesn't have the correct permissions in the server provided in the config!","error")
                openticket.log("Please give the bot \"Administrator\" permissions or visit the documentation!","info")
                console.log("\n")
                process.exit(0)
            }
            if (openticket.defaults.getDefault("clientMultiGuildWarning")){
                //warn if bot is in multiple servers
                if (botServers.length > 1){
                    openticket.log("This bot is part of multiple servers, but Open Ticket doesn't have support for it!","warning")
                    openticket.log("It may result in the bot crashing & glitching when used in these servers!","info")
                }
                botServers.forEach((server) => {
                    //warn if bot doesn't have permissions in multiple servers
                    if (!client.checkGuildPerms(server)) openticket.log(`The bot doesn't have the correct permissions in the server "${server.name}"!`,"warning")
                })
            }

            //load client activity
            openticket.log("Loading client activity...","system")
            if (openticket.defaults.getDefault("clientActivityLoading")){
                //load config status
                if (generalConfig.data.status && generalConfig.data.status.enabled) openticket.client.activity.setStatus(generalConfig.data.status.type,generalConfig.data.status.text,generalConfig.data.status.status)
            }
            await openticket.events.get("onClientActivityLoad").emit([openticket.client.activity,openticket.client])
            await openticket.events.get("afterClientActivityLoaded").emit([openticket.client.activity,openticket.client])

            //initiate client activity
            await openticket.events.get("onClientActivityInit").emit([openticket.client.activity,openticket.client])
            if (openticket.defaults.getDefault("clientActivityInitiating")){
                openticket.client.activity.initStatus()
                await openticket.events.get("afterClientActivityInitiated").emit([openticket.client.activity,openticket.client])
            }

            //load slash commands
            openticket.log("Loading slash commands...","system")
            if (openticket.defaults.getDefault("slashCommandLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllSlashCommands()
            }
            await openticket.events.get("onSlashCommandLoad").emit([openticket.client.slashCommands,openticket.client])
            await openticket.events.get("afterSlashCommandsLoaded").emit([openticket.client.slashCommands,openticket.client])
            
            //register slash commands (create, update & remove)
            if (openticket.defaults.getDefault("forceSlashCommandRegistration")) openticket.log("Forcing all slash commands to be re-registered...","system")
            openticket.log("Registering slash commands... (this can take up to 2 minutes)","system")
            await openticket.events.get("onSlashCommandRegister").emit([openticket.client.slashCommands,openticket.client])
            if (openticket.defaults.getDefault("slashCommandRegistering")){
                //GLOBAL
                await openticket.client.slashCommands.removeUnusedCommands() //remove all commands that aren't used
                await openticket.client.slashCommands.createNewCommands() //create all new commands that don't exist yet
                await openticket.client.slashCommands.updateExistingCommands(undefined,openticket.defaults.getDefault("forceSlashCommandRegistration")) //update all commands that need to be re-registered

                //DEFAULT SERVER
                await openticket.client.slashCommands.removeUnusedCommands(serverId) //remove all commands that aren't used
                await openticket.client.slashCommands.createNewCommands(serverId) //create all new commands that don't exist yet
                await openticket.client.slashCommands.updateExistingCommands(serverId) //update all commands that need to be re-registered
                
                await openticket.events.get("afterSlashCommandsRegistered").emit([openticket.client.slashCommands,openticket.client])
            }

            //load text commands
            openticket.log("Loading text commands...","system")
            if (openticket.defaults.getDefault("textCommandLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllTextCommands()
            }
            await openticket.events.get("onTextCommandLoad").emit([openticket.client.textCommands,openticket.client])
            await openticket.events.get("afterTextCommandsLoaded").emit([openticket.client.textCommands,openticket.client])

            //client ready
            await openticket.events.get("afterClientReady").emit([openticket.client])
        }
    }

    //client init (login)
    openticket.log("Logging in...","system")
    await openticket.events.get("onClientInit").emit([openticket.client])
    if (openticket.defaults.getDefault("clientInitiating")){
        //init client
        openticket.client.initClient()
        await openticket.events.get("afterClientInitiated").emit([openticket.client])

        //client login
        await openticket.client.login()
        openticket.log("discord.js client ready!","info")
    }

    //load questions
    openticket.log("Loading questions...","system")
    if (openticket.defaults.getDefault("questionLoading")){
        await (await import("./data/openticket/questionLoader.js")).loadAllQuestions()
    }
    await openticket.events.get("onQuestionLoad").emit([openticket.questions])
    await openticket.events.get("afterQuestionsLoaded").emit([openticket.questions])
    
    //load options
    openticket.log("Loading options...","system")
    if (openticket.defaults.getDefault("optionLoading")){
        await (await import("./data/openticket/optionLoader.js")).loadAllOptions()
    }
    await openticket.events.get("onOptionLoad").emit([openticket.options])
    await openticket.events.get("afterOptionsLoaded").emit([openticket.options])
    
    //load panels
    openticket.log("Loading panels...","system")
    if (openticket.defaults.getDefault("panelLoading")){
        await (await import("./data/openticket/panelLoader.js")).loadAllPanels()
    }
    await openticket.events.get("onPanelLoad").emit([openticket.panels])
    await openticket.events.get("afterPanelsLoaded").emit([openticket.panels])

    //load tickets
    openticket.log("Loading tickets...","system")
    if (openticket.defaults.getDefault("ticketLoading")){
        openticket.tickets.useGuild(openticket.client.mainServer)
        await (await import("./data/openticket/ticketLoader.js")).loadAllTickets()
    }
    await openticket.events.get("onTicketLoad").emit([openticket.tickets])
    await openticket.events.get("afterTicketsLoaded").emit([openticket.tickets])
    
    //load roles
    openticket.log("Loading roles...","system")
    if (openticket.defaults.getDefault("roleLoading")){
        await (await import("./data/openticket/roleLoader.js")).loadAllRoles()
    }
    await openticket.events.get("onRoleLoad").emit([openticket.roles])
    await openticket.events.get("afterRolesLoaded").emit([openticket.roles])

    //load blacklist
    openticket.log("Loading blacklist...","system")
    if (openticket.defaults.getDefault("blacklistLoading")){
        await (await import("./data/openticket/blacklistLoader.js")).loadAllBlacklistedUsers()
    }
    await openticket.events.get("onBlacklistLoad").emit([openticket.blacklist])
    await openticket.events.get("afterBlacklistLoaded").emit([openticket.blacklist])

    //load transcript compilers
    openticket.log("Loading transcripts...","system")
    if (openticket.defaults.getDefault("transcriptCompilerLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadAllTranscriptCompilers()
    }
    await openticket.events.get("onTranscriptCompilerLoad").emit([openticket.transcripts])
    await openticket.events.get("afterTranscriptCompilersLoaded").emit([openticket.transcripts])

    //load transcript history
    if (openticket.defaults.getDefault("transcriptHistoryLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadTranscriptHistory()
    }
    await openticket.events.get("onTranscriptHistoryLoad").emit([openticket.transcripts])
    await openticket.events.get("afterTranscriptHistoryLoaded").emit([openticket.transcripts])

    //load button builders
    openticket.log("Loading buttons...","system")
    if (openticket.defaults.getDefault("buttonBuildersLoading")){
        await (await import("./builders/buttons.js")).registerAllButtons()
    }
    await openticket.events.get("onButtonBuilderLoad").emit([openticket.builders.buttons,openticket.builders,openticket.actions])
    await openticket.events.get("afterButtonBuildersLoaded").emit([openticket.builders.buttons,openticket.builders,openticket.actions])

    //load dropdown builders
    openticket.log("Loading dropdowns...","system")
    if (openticket.defaults.getDefault("dropdownBuildersLoading")){
        await (await import("./builders/dropdowns.js")).registerAllDropdowns()
    }
    await openticket.events.get("onDropdownBuilderLoad").emit([openticket.builders.dropdowns,openticket.builders,openticket.actions])
    await openticket.events.get("afterDropdownBuildersLoaded").emit([openticket.builders.dropdowns,openticket.builders,openticket.actions])

    //load file builders
    openticket.log("Loading files...","system")
    if (openticket.defaults.getDefault("fileBuildersLoading")){
        await (await import("./builders/files.js")).registerAllFiles()
    }
    await openticket.events.get("onFileBuilderLoad").emit([openticket.builders.files,openticket.builders,openticket.actions])
    await openticket.events.get("afterFileBuildersLoaded").emit([openticket.builders.files,openticket.builders,openticket.actions])

    //load embed builders
    openticket.log("Loading embeds...","system")
    if (openticket.defaults.getDefault("embedBuildersLoading")){
        await (await import("./builders/embeds.js")).registerAllEmbeds()
    }
    await openticket.events.get("onEmbedBuilderLoad").emit([openticket.builders.embeds,openticket.builders,openticket.actions])
    await openticket.events.get("afterEmbedBuildersLoaded").emit([openticket.builders.embeds,openticket.builders,openticket.actions])

    //load message builders
    openticket.log("Loading messages...","system")
    if (openticket.defaults.getDefault("messageBuildersLoading")){
        await (await import("./builders/messages.js")).registerAllMessages()
    }
    await openticket.events.get("onMessageBuilderLoad").emit([openticket.builders.messages,openticket.builders,openticket.actions])
    await openticket.events.get("afterMessageBuildersLoaded").emit([openticket.builders.messages,openticket.builders,openticket.actions])

    //load modal builders
    openticket.log("Loading modals...","system")
    if (openticket.defaults.getDefault("modalBuildersLoading")){
        await (await import("./builders/modals.js")).registerAllModals()
    }
    await openticket.events.get("onModalBuilderLoad").emit([openticket.builders.modals,openticket.builders,openticket.actions])
    await openticket.events.get("afterModalBuildersLoaded").emit([openticket.builders.modals,openticket.builders,openticket.actions])

    //load command responders
    openticket.log("Loading command responders...","system")
    if (openticket.defaults.getDefault("commandRespondersLoading")){
        await (await import("./commands/help.js")).registerCommandResponders()
        await (await import("./commands/stats.js")).registerCommandResponders()
        await (await import("./commands/panel.js")).registerCommandResponders()
        await (await import("./commands/ticket.js")).registerCommandResponders()
        await (await import("./commands/blacklist.js")).registerCommandResponders()
        await (await import("./commands/close.js")).registerCommandResponders()
        await (await import("./commands/reopen.js")).registerCommandResponders()
        await (await import("./commands/delete.js")).registerCommandResponders()
        await (await import("./commands/claim.js")).registerCommandResponders()
        await (await import("./commands/unclaim.js")).registerCommandResponders()
        await (await import("./commands/pin.js")).registerCommandResponders()
        await (await import("./commands/unpin.js")).registerCommandResponders()
        await (await import("./commands/rename.js")).registerCommandResponders()
        await (await import("./commands/move.js")).registerCommandResponders()
        await (await import("./commands/add.js")).registerCommandResponders()
        await (await import("./commands/remove.js")).registerCommandResponders()
        await (await import("./commands/clear.js")).registerCommandResponders()
        await (await import("./commands/autoclose.js")).registerCommandResponders()
        await (await import("./commands/autodelete.js")).registerCommandResponders()
    }
    await openticket.events.get("onCommandResponderLoad").emit([openticket.responders.commands,openticket.responders,openticket.actions])
    await openticket.events.get("afterCommandRespondersLoaded").emit([openticket.responders.commands,openticket.responders,openticket.actions])

    //load button responders
    openticket.log("Loading button responders...","system")
    if (openticket.defaults.getDefault("buttonRespondersLoading")){
        await (await import("./actions/handleVerifyBar.js")).registerButtonResponders()
        await (await import("./actions/handleTranscriptErrors.js")).registerButtonResponders()
        await (await import("./commands/help.js")).registerButtonResponders()
        await (await import("./commands/ticket.js")).registerButtonResponders()
        await (await import("./commands/close.js")).registerButtonResponders()
        await (await import("./commands/reopen.js")).registerButtonResponders()
        await (await import("./commands/delete.js")).registerButtonResponders()
        await (await import("./commands/claim.js")).registerButtonResponders()
        await (await import("./commands/unclaim.js")).registerButtonResponders()
        await (await import("./commands/pin.js")).registerButtonResponders()
        await (await import("./commands/unpin.js")).registerButtonResponders()
        await (await import("./commands/role.js")).registerButtonResponders()
        await (await import("./commands/clear.js")).registerButtonResponders()
    }
    await openticket.events.get("onButtonResponderLoad").emit([openticket.responders.buttons,openticket.responders,openticket.actions])
    await openticket.events.get("afterButtonRespondersLoaded").emit([openticket.responders.buttons,openticket.responders,openticket.actions])

    //load dropdown responders
    openticket.log("Loading dropdown responders...","system")
    if (openticket.defaults.getDefault("dropdownRespondersLoading")){
        await (await import("./commands/ticket.js")).registerDropdownResponders()
    }
    await openticket.events.get("onDropdownResponderLoad").emit([openticket.responders.dropdowns,openticket.responders,openticket.actions])
    await openticket.events.get("afterDropdownRespondersLoaded").emit([openticket.responders.dropdowns,openticket.responders,openticket.actions])

    //load modal responders
    openticket.log("Loading modal responders...","system")
    if (openticket.defaults.getDefault("modalRespondersLoading")){
        await (await import("./commands/ticket.js")).registerModalResponders()
        await (await import("./commands/close.js")).registerModalResponders()
        await (await import("./commands/reopen.js")).registerModalResponders()
        await (await import("./commands/delete.js")).registerModalResponders()
        await (await import("./commands/claim.js")).registerModalResponders()
        await (await import("./commands/unclaim.js")).registerModalResponders()
        await (await import("./commands/pin.js")).registerModalResponders()
        await (await import("./commands/unpin.js")).registerModalResponders()
    }
    await openticket.events.get("onModalResponderLoad").emit([openticket.responders.modals,openticket.responders,openticket.actions])
    await openticket.events.get("afterModalRespondersLoaded").emit([openticket.responders.modals,openticket.responders,openticket.actions])

    //load actions
    openticket.log("Loading actions...","system")
    if (openticket.defaults.getDefault("actionsLoading")){
        await (await import("./actions/createTicketPermissions.js")).registerActions()
        await (await import("./actions/createTranscript.js")).registerActions()
        await (await import("./actions/createTicket.js")).registerActions()
        await (await import("./actions/closeTicket.js")).registerActions()
        await (await import("./actions/deleteTicket.js")).registerActions()
        await (await import("./actions/reopenTicket.js")).registerActions()
        await (await import("./actions/claimTicket.js")).registerActions()
        await (await import("./actions/unclaimTicket.js")).registerActions()
        await (await import("./actions/pinTicket.js")).registerActions()
        await (await import("./actions/unpinTicket.js")).registerActions()
        await (await import("./actions/renameTicket.js")).registerActions()
        await (await import("./actions/moveTicket.js")).registerActions()
        await (await import("./actions/addTicketUser.js")).registerActions()
        await (await import("./actions/removeTicketUser.js")).registerActions()
        await (await import("./actions/reactionRole.js")).registerActions()
        await (await import("./actions/clearTickets.js")).registerActions()
    }
    await openticket.events.get("onActionLoad").emit([openticket.actions])
    await openticket.events.get("afterActionsLoaded").emit([openticket.actions])

    //load verifybars
    openticket.log("Loading verifybars...","system")
    if (openticket.defaults.getDefault("verifyBarsLoading")){
        await (await import("./actions/closeTicket.js")).registerVerifyBars()
        await (await import("./actions/deleteTicket.js")).registerVerifyBars()
        await (await import("./actions/reopenTicket.js")).registerVerifyBars()
        await (await import("./actions/claimTicket.js")).registerVerifyBars()
        await (await import("./actions/unclaimTicket.js")).registerVerifyBars()
        await (await import("./actions/pinTicket.js")).registerVerifyBars()
        await (await import("./actions/unpinTicket.js")).registerVerifyBars()
    }
    await openticket.events.get("onVerifyBarLoad").emit([openticket.verifybars])
    await openticket.events.get("afterVerifyBarsLoaded").emit([openticket.verifybars])

    //load permissions
    openticket.log("Loading permissions...","system")
    if (openticket.defaults.getDefault("permissionsLoading")){
        await (await import("./data/framework/permissionLoader.js")).loadAllPermissions()
    }
    await openticket.events.get("onPermissionLoad").emit([openticket.permissions])
    await openticket.events.get("afterPermissionsLoaded").emit([openticket.permissions])

    //load posts
    openticket.log("Loading posts...","system")
    if (openticket.defaults.getDefault("postsLoading")){
        await (await import("./data/framework/postLoader.js")).loadAllPosts()
    }
    await openticket.events.get("onPostLoad").emit([openticket.posts])
    await openticket.events.get("afterPostsLoaded").emit([openticket.posts])

    //init posts
    await openticket.events.get("onPostInit").emit([openticket.posts])
    if (openticket.defaults.getDefault("postsInitiating")){
        if (openticket.client.mainServer) openticket.posts.init(openticket.client.mainServer)
        await openticket.events.get("afterPostsInitiated").emit([openticket.posts])
    }

    //load cooldowns
    openticket.log("Loading cooldowns...","system")
    if (openticket.defaults.getDefault("cooldownsLoading")){
        await (await import("./data/framework/cooldownLoader.js")).loadAllCooldowns()
    }
    await openticket.events.get("onCooldownLoad").emit([openticket.cooldowns])
    await openticket.events.get("afterCooldownsLoaded").emit([openticket.cooldowns])
    
    //init cooldowns
    await openticket.events.get("onCooldownInit").emit([openticket.cooldowns])
    if (openticket.defaults.getDefault("cooldownsInitiating")){
        await openticket.cooldowns.init()
        await openticket.events.get("afterCooldownsInitiated").emit([openticket.cooldowns])
    }

    //load help menu categories
    openticket.log("Loading help menu...","system")
    if (openticket.defaults.getDefault("helpMenuCategoryLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuCategories()
    }
    await openticket.events.get("onHelpMenuCategoryLoad").emit([openticket.helpmenu])
    await openticket.events.get("afterHelpMenuCategoriesLoaded").emit([openticket.helpmenu])

    //load help menu components
    if (openticket.defaults.getDefault("helpMenuComponentLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuComponents()
    }
    await openticket.events.get("onHelpMenuComponentLoad").emit([openticket.helpmenu])
    await openticket.events.get("afterHelpMenuComponentsLoaded").emit([openticket.helpmenu])

    //load stat scopes
    openticket.log("Loading stats...","system")
    if (openticket.defaults.getDefault("statScopesLoading")){
        openticket.stats.useDatabase(openticket.databases.get("openticket:stats"))
        await (await import("./data/framework/statLoader.js")).loadAllStatScopes()
    }
    await openticket.events.get("onStatScopeLoad").emit([openticket.stats])
    await openticket.events.get("afterStatScopesLoaded").emit([openticket.stats])

    //load stats
    if (openticket.defaults.getDefault("statLoading")){
        await (await import("./data/framework/statLoader.js")).loadAllStats()
    }
    await openticket.events.get("onStatLoad").emit([openticket.stats])
    await openticket.events.get("afterStatsLoaded").emit([openticket.stats])

    //init stats
    await openticket.events.get("onStatInit").emit([openticket.stats])
    if (openticket.defaults.getDefault("statInitiating")){
        await openticket.stats.init()
        await openticket.events.get("afterStatsInitiated").emit([openticket.stats])
    }

    //load code
    openticket.log("Loading code...","system")
    if (openticket.defaults.getDefault("codeLoading")){
        await (await import("./data/framework/codeLoader.js")).loadAllCode()
    }
    await openticket.events.get("onCodeLoad").emit([openticket.code])
    await openticket.events.get("afterCodeLoaded").emit([openticket.code])

    //execute code
    await openticket.events.get("onCodeExecute").emit([openticket.code])
    if (openticket.defaults.getDefault("codeExecution")){
        await openticket.code.execute()
        await openticket.events.get("afterCodeExecuted").emit([openticket.code])
    }

    //finish setup
    openticket.log("Setup complete!","info")

    //load livestatus sources
    openticket.log("Loading livestatus...","system")
    if (openticket.defaults.getDefault("liveStatusLoading")){
        await (await import("./data/framework/liveStatusLoader.js")).loadAllLiveStatusSources()
    }
    await openticket.events.get("onLiveStatusSourceLoad").emit([openticket.livestatus])
    await openticket.events.get("afterLiveStatusSourcesLoaded").emit([openticket.livestatus])

    //load startscreen
    openticket.log("Loading startscreen...","system")
    if (openticket.defaults.getDefault("startScreenLoading")){
        await (await import("./data/framework/startScreenLoader.js")).loadAllStartScreenComponents()
    }
    await openticket.events.get("onStartScreenLoad").emit([openticket.startscreen])
    await openticket.events.get("afterStartScreensLoaded").emit([openticket.startscreen])

    //render startscreen
    await openticket.events.get("onStartScreenRender").emit([openticket.startscreen])
    if (openticket.defaults.getDefault("startScreenRendering")){
        await openticket.startscreen.renderAllComponents()

        await openticket.events.get("afterStartScreensRendered").emit([openticket.startscreen])
    }

    //YIPPPIE!!
    //The startup of Open Ticket is completed :)
}
main()