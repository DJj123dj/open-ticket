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
    Open Ticket v4.0.0 - © DJdj Development

    support us: https://github.com/sponsors/DJj123dj
    discord: https://discord.dj-dj.be
    website: https://openticket.dj-dj.be
    github: https://otgithub.dj-dj.be
    documentation: https://otdocs.dj-dj.be

    Config files:
    ./config/....json

    Send ./otdebug.txt to us when there is an error!
*/

//initialize API & check npm libraries
import { api, opendiscord, utilities } from "./core/startup/init"
export { api, opendiscord, utilities } from "./core/startup/init"
import ansis from "ansis"

/**The main sequence of Open Ticket. Runs `async` */
const main = async () => {
    //load all events
    (await import("./data/framework/eventLoader.js")).loadAllEvents()

    //error handling system
    process.on("uncaughtException",async (error,origin) => {
        try{
            await opendiscord.events.get("onErrorHandling").emit([error,origin])
            if (opendiscord.defaults.getDefault("errorHandling")){
                //custom error messages for known errors
                if (error.message.toLowerCase().includes("used disallowed intents")){
                    //invalid intents
                    opendiscord.log("Open Ticket doesn't work without Privileged Gateway Intents enabled!","error")
                    opendiscord.log("Enable them in the discord developer portal!","info")
                    console.log("\n")
                    process.exit(1)
                }else if (error.message.toLowerCase().includes("invalid discord bot token provided")){
                    //invalid token
                    opendiscord.log("An invalid discord auth token was provided!","error")
                    opendiscord.log("Check the config if you have inserted the bot token correctly!","info")
                    console.log("\n")
                    process.exit(1)
                }else{
                    //unknown error
                    const errmsg = new api.ODError(error,origin)
                    opendiscord.log(errmsg)
                    if (opendiscord.defaults.getDefault("crashOnError")) process.exit(1)
                    await opendiscord.events.get("afterErrorHandling").emit([error,origin,errmsg])
                }
            }
            
        }catch(err){
            console.log("[ERROR HANDLER ERROR]:",err)
        }
    })

    //handle data migration
    await (await import("./core/startup/manageMigration.js")).loadVersionMigrationSystem()

    //load plugins
    if (opendiscord.defaults.getDefault("pluginLoading")){
        await (await import("./core/startup/pluginLauncher.js")).loadAllPlugins()
    }
    await opendiscord.events.get("afterPluginsLoaded").emit([opendiscord.plugins])
    
    //load plugin classes
    opendiscord.log("Loading plugin classes...","system")
    if (opendiscord.defaults.getDefault("pluginClassLoading")){

    }
    await opendiscord.events.get("onPluginClassLoad").emit([opendiscord.plugins.classes,opendiscord.plugins])
    await opendiscord.events.get("afterPluginClassesLoaded").emit([opendiscord.plugins.classes,opendiscord.plugins])

    //load flags
    opendiscord.log("Loading flags...","system")
    if (opendiscord.defaults.getDefault("flagLoading")){
        await (await import("./data/framework/flagLoader.js")).loadAllFlags()
    }
    await opendiscord.events.get("onFlagLoad").emit([opendiscord.flags])
    await opendiscord.events.get("afterFlagsLoaded").emit([opendiscord.flags])

    //initiate flags
    await opendiscord.events.get("onFlagInit").emit([opendiscord.flags])
    if (opendiscord.defaults.getDefault("flagInitiating")){
        await opendiscord.flags.init()
        opendiscord.debugfile.writeText("\n[ENABLED FLAGS]:\n"+opendiscord.flags.getFiltered((flag) => (flag.value == true)).map((flag) => flag.id.value).join("\n")+"\n")
        await opendiscord.events.get("afterFlagsInitiated").emit([opendiscord.flags])
    }

    //load debug
    if (opendiscord.defaults.getDefault("debugLoading")){
        const debugFlag = opendiscord.flags.get("opendiscord:debug")
        opendiscord.debug.visible = (debugFlag) ? debugFlag.value : false
    }

    //load progress bar renderers
    opendiscord.log("Loading progress bars...","system")
    if (opendiscord.defaults.getDefault("progressBarRendererLoading")){
        await (await import("./data/framework/progressBarLoader.js")).loadAllProgressBarRenderers()
    }
    await opendiscord.events.get("onProgressBarRendererLoad").emit([opendiscord.progressbars.renderers])
    await opendiscord.events.get("afterProgressBarRenderersLoaded").emit([opendiscord.progressbars.renderers])
    
    //load progress bars
    if (opendiscord.defaults.getDefault("progressBarLoading")){
        await (await import("./data/framework/progressBarLoader.js")).loadAllProgressBars()
    }
    await opendiscord.events.get("onProgressBarLoad").emit([opendiscord.progressbars])
    await opendiscord.events.get("afterProgressBarsLoaded").emit([opendiscord.progressbars])

    //load config
    opendiscord.log("Loading configs...","system")
    if (opendiscord.defaults.getDefault("configLoading")){
        await (await import("./data/framework/configLoader.js")).loadAllConfigs()
    }
    await opendiscord.events.get("onConfigLoad").emit([opendiscord.configs])
    await opendiscord.events.get("afterConfigsLoaded").emit([opendiscord.configs])

    //initiate config
    await opendiscord.events.get("onConfigInit").emit([opendiscord.configs])
    if (opendiscord.defaults.getDefault("configInitiating")){
        await opendiscord.configs.init()
        await opendiscord.events.get("afterConfigsInitiated").emit([opendiscord.configs])
    }

    //UTILITY CONFIG
    const generalConfig = opendiscord.configs.get("opendiscord:general")

    if (opendiscord.defaults.getDefault("emojiTitleStyleLoading")){
        //set emoji style based on config
        opendiscord.defaults.setDefault("emojiTitleStyle",generalConfig.data.system.emojiStyle)
    }
    
    //load database
    opendiscord.log("Loading databases...","system")
    if (opendiscord.defaults.getDefault("databaseLoading")){
        await (await import("./data/framework/databaseLoader.js")).loadAllDatabases()
    }
    await opendiscord.events.get("onDatabaseLoad").emit([opendiscord.databases])
    await opendiscord.events.get("afterDatabasesLoaded").emit([opendiscord.databases])

    //initiate database
    await opendiscord.events.get("onDatabaseInit").emit([opendiscord.databases])
    if (opendiscord.defaults.getDefault("databaseInitiating")){
        await opendiscord.databases.init()
        await opendiscord.events.get("afterDatabasesInitiated").emit([opendiscord.databases])
    }

    //load sessions
    opendiscord.log("Loading sessions...","system")
    if (opendiscord.defaults.getDefault("sessionLoading")){

    }
    await opendiscord.events.get("onSessionLoad").emit([opendiscord.sessions])
    await opendiscord.events.get("afterSessionsLoaded").emit([opendiscord.sessions])    

    //load language
    opendiscord.log("Loading languages...","system")
    if (opendiscord.defaults.getDefault("languageLoading")){
        await (await import("./data/framework/languageLoader.js")).loadAllLanguages()
    }
    await opendiscord.events.get("onLanguageLoad").emit([opendiscord.languages])
    await opendiscord.events.get("afterLanguagesLoaded").emit([opendiscord.languages])   
    
    //initiate language
    await opendiscord.events.get("onLanguageInit").emit([opendiscord.languages])
    if (opendiscord.defaults.getDefault("languageInitiating")){
        await opendiscord.languages.init()
        await opendiscord.events.get("afterLanguagesInitiated").emit([opendiscord.languages])

        //add available languages to list for config checker
        const languageList = opendiscord.defaults.getDefault("languageList")
        const languageIds = opendiscord.languages.getIds().map((id) => {
            if (id.value.startsWith("opendiscord:")){
                //is open ticket language => return without prefix
                return id.value.split("opendiscord:")[1]
            }else return id.value
        })
        languageList.push(...languageIds)
        opendiscord.defaults.setDefault("languageList",languageList)
    }

    //select language
    await opendiscord.events.get("onLanguageSelect").emit([opendiscord.languages])
    if (opendiscord.defaults.getDefault("languageSelection")){
        //set current language
        const languageId = (generalConfig?.data?.language) ? generalConfig.data.language  : "english"
        if (languageId.includes(":")){
            opendiscord.languages.setCurrentLanguage(languageId)
        }else{
            opendiscord.languages.setCurrentLanguage("opendiscord:"+languageId)
        }

        //set backup language
        const backupLanguageId = opendiscord.defaults.getDefault("backupLanguage")
        if (opendiscord.languages.exists(backupLanguageId)){
            opendiscord.languages.setBackupLanguage(backupLanguageId)
            
        }else throw new api.ODSystemError("Unknown backup language '"+backupLanguageId+"'!")

        await opendiscord.events.get("afterLanguagesSelected").emit([opendiscord.languages.get(languageId),opendiscord.languages.get(backupLanguageId),opendiscord.languages])    
    }
    
    //load config checker
    opendiscord.log("Loading config checker...","system")
    if (opendiscord.defaults.getDefault("checkerLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckers()
    }
    await opendiscord.events.get("onCheckerLoad").emit([opendiscord.checkers])
    await opendiscord.events.get("afterCheckersLoaded").emit([opendiscord.checkers])

    //load config checker functions
    if (opendiscord.defaults.getDefault("checkerFunctionLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerFunctions()
    }
    await opendiscord.events.get("onCheckerFunctionLoad").emit([opendiscord.checkers.functions,opendiscord.checkers])
    await opendiscord.events.get("afterCheckerFunctionsLoaded").emit([opendiscord.checkers.functions,opendiscord.checkers])
    
    //execute config checker
    await opendiscord.events.get("onCheckerExecute").emit([opendiscord.checkers])
    if (opendiscord.defaults.getDefault("checkerExecution")){
        const result = opendiscord.checkers.checkAll(true)
        await opendiscord.events.get("afterCheckersExecuted").emit([result,opendiscord.checkers])
    }

    //load config checker translations
    if (opendiscord.defaults.getDefault("checkerTranslationLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerTranslations()
    }
    await opendiscord.events.get("onCheckerTranslationLoad").emit([opendiscord.checkers.translation,((generalConfig && generalConfig.data.system && generalConfig.data.system.useTranslatedConfigChecker) ? generalConfig.data.system.useTranslatedConfigChecker : false),opendiscord.checkers])
    await opendiscord.events.get("afterCheckerTranslationsLoaded").emit([opendiscord.checkers.translation,opendiscord.checkers])

    //render config checker
    const advancedCheckerFlag = opendiscord.flags.get("opendiscord:checker")
    const disableCheckerFlag = opendiscord.flags.get("opendiscord:no-checker")

    await opendiscord.events.get("onCheckerRender").emit([opendiscord.checkers.renderer,opendiscord.checkers])
    if (opendiscord.defaults.getDefault("checkerRendering") && !(disableCheckerFlag ? disableCheckerFlag.value : false)){
        //check if there is a result (otherwise throw minor error)
        const result = opendiscord.checkers.lastResult
        if (!result) return opendiscord.log("Failed to render Config Checker! (couldn't fetch result)","error")
        
        //get components & check if full mode enabled
        const components = opendiscord.checkers.renderer.getComponents(!(advancedCheckerFlag ? advancedCheckerFlag.value : false),opendiscord.defaults.getDefault("checkerRenderEmpty"),opendiscord.checkers.translation,result)

        //render
        opendiscord.debugfile.writeText("\n[CONFIG CHECKER RESULT]:\n"+ansis.strip(components.join("\n"))+"\n")
        opendiscord.checkers.renderer.render(components)

        //wait 5 seconds when there are warnings (not for errors & info)
        if (result.messages.length > 0 && result.messages.some((msg) => msg.type == "warning") && result.messages.every((msg) => msg.type != "error")) await utilities.timer(5000)

        await opendiscord.events.get("afterCheckersRendered").emit([opendiscord.checkers.renderer,opendiscord.checkers])
    }

    //quit config checker (when required)
    if (opendiscord.checkers.lastResult && !opendiscord.checkers.lastResult.valid && !(disableCheckerFlag ? disableCheckerFlag.value : false)){
        await opendiscord.events.get("onCheckerQuit").emit([opendiscord.checkers])
        if (opendiscord.defaults.getDefault("checkerQuit")){
            process.exit(0)
            //there is no afterCheckerQuitted event :)
        }
    }

    //plugin loading before client
    await opendiscord.events.get("onPluginBeforeClientLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeClientLoaded").emit([])

    //client configuration
    opendiscord.log("Loading client...","system")
    if (opendiscord.defaults.getDefault("clientLoading")){
        //add intents (for basic permissions)
        opendiscord.client.intents.push(
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
        opendiscord.client.privileges.push("MessageContent","GuildMembers")

        //add partials (required for DM messages)
        opendiscord.client.partials.push("Channel","Message")

        //add permissions (not required when Administrator)
        opendiscord.client.permissions.push(
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
        const configToken = opendiscord.configs.get("opendiscord:general").data.token ? opendiscord.configs.get("opendiscord:general").data.token : ""
        const envToken = opendiscord.env.getVariable("TOKEN") ? opendiscord.env.getVariable("TOKEN") : ""
        const token = opendiscord.configs.get("opendiscord:general").data.tokenFromENV ? envToken : configToken
        opendiscord.client.token = token
    }
    await opendiscord.events.get("onClientLoad").emit([opendiscord.client])
    await opendiscord.events.get("afterClientLoaded").emit([opendiscord.client])

    //client ready
    opendiscord.client.readyListener = async () => {
        opendiscord.log("Loading client setup...","system")
        await opendiscord.events.get("onClientReady").emit([opendiscord.client])
        if (opendiscord.defaults.getDefault("clientReady")){
            const client = opendiscord.client

            //check if all servers are valid
            const botServers = client.getGuilds()
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            const serverId = generalConfig.data.serverId ? generalConfig.data.serverId : ""
            if (!serverId) throw new api.ODSystemError("Server Id Missing!")
            
            const mainServer = botServers.find((g) => g.id == serverId)
            client.mainServer = mainServer ?? null
            //throw if bot isn't member of main server
            if (!mainServer || !client.checkBotInGuild(mainServer)){
                console.log("\n")
                opendiscord.log("The bot isn't a member of the server provided in the config!","error")
                opendiscord.log("Please invite your bot to the server!","info")
                console.log("\n")
                process.exit(0)
            }
            //throw if bot doesn't have permissions in main server
            if (!client.checkGuildPerms(mainServer)){
                console.log("\n")
                opendiscord.log("The bot doesn't have the correct permissions in the server provided in the config!","error")
                opendiscord.log("Please give the bot \"Administrator\" permissions or visit the documentation!","info")
                console.log("\n")
                process.exit(0)
            }
            if (opendiscord.defaults.getDefault("clientMultiGuildWarning")){
                //warn if bot is in multiple servers
                if (botServers.length > 1){
                    opendiscord.log("This bot is part of multiple servers, but Open Ticket doesn't have support for it!","warning")
                    opendiscord.log("It may result in the bot crashing & glitching when used in these servers!","info")
                }
                botServers.forEach((server) => {
                    //warn if bot doesn't have permissions in multiple servers
                    if (!client.checkGuildPerms(server)) opendiscord.log(`The bot doesn't have the correct permissions in the server "${server.name}"!`,"warning")
                })
            }

            //load client activity
            opendiscord.log("Loading client activity...","system")
            if (opendiscord.defaults.getDefault("clientActivityLoading")){
                //load config status
                if (generalConfig.data.status && generalConfig.data.status.enabled) opendiscord.client.activity.setStatus(generalConfig.data.status.type,generalConfig.data.status.text,generalConfig.data.status.status)
            }
            await opendiscord.events.get("onClientActivityLoad").emit([opendiscord.client.activity,opendiscord.client])
            await opendiscord.events.get("afterClientActivityLoaded").emit([opendiscord.client.activity,opendiscord.client])

            //initiate client activity
            await opendiscord.events.get("onClientActivityInit").emit([opendiscord.client.activity,opendiscord.client])
            if (opendiscord.defaults.getDefault("clientActivityInitiating")){
                opendiscord.client.activity.initStatus()
                await opendiscord.events.get("afterClientActivityInitiated").emit([opendiscord.client.activity,opendiscord.client])
            }

            //load slash commands
            opendiscord.log("Loading slash commands...","system")
            if (opendiscord.defaults.getDefault("slashCommandLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllSlashCommands()
            }
            await opendiscord.events.get("onSlashCommandLoad").emit([opendiscord.client.slashCommands,opendiscord.client])
            await opendiscord.events.get("afterSlashCommandsLoaded").emit([opendiscord.client.slashCommands,opendiscord.client])
            
            //register slash commands (create, update & remove)
            if (opendiscord.defaults.getDefault("forceSlashCommandRegistration")) opendiscord.log("Forcing all slash commands to be re-registered...","system")
            opendiscord.log("Registering slash commands... (this can take up to 2 minutes)","system")
            await opendiscord.events.get("onSlashCommandRegister").emit([opendiscord.client.slashCommands,opendiscord.client])
            if (opendiscord.defaults.getDefault("slashCommandRegistering")){
                //get all commands that are already registered in the bot
                const cmds = await opendiscord.client.slashCommands.getAllRegisteredCommands()
                const removableCmds = cmds.unused.map((cmd) => cmd.cmd)
                const newCmds = cmds.unregistered.map((cmd) => cmd.instance)
                const updatableCmds = cmds.registered.filter((cmd) => cmd.requiresUpdate || opendiscord.defaults.getDefault("forceSlashCommandRegistration")).map((cmd) => cmd.instance)

                //init progress bars
                const removeProgress = opendiscord.progressbars.get("opendiscord:slash-command-remove")
                const createProgress = opendiscord.progressbars.get("opendiscord:slash-command-create")
                const updateProgress = opendiscord.progressbars.get("opendiscord:slash-command-update")

                //remove unused cmds, create new cmds & update existing cmds
                if (opendiscord.defaults.getDefault("allowSlashCommandRemoval")) await opendiscord.client.slashCommands.removeUnusedCommands(removableCmds,undefined,removeProgress)
                await opendiscord.client.slashCommands.createNewCommands(newCmds,createProgress)
                await opendiscord.client.slashCommands.updateExistingCommands(updatableCmds,updateProgress)
                
                await opendiscord.events.get("afterSlashCommandsRegistered").emit([opendiscord.client.slashCommands,opendiscord.client])
            }

            //load text commands
            opendiscord.log("Loading text commands...","system")
            if (opendiscord.defaults.getDefault("allowDumpCommand")){
                (await import("./core/startup/dump.js")).loadDumpCommand()
            }
            if (opendiscord.defaults.getDefault("textCommandLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllTextCommands()
            }
            await opendiscord.events.get("onTextCommandLoad").emit([opendiscord.client.textCommands,opendiscord.client])
            await opendiscord.events.get("afterTextCommandsLoaded").emit([opendiscord.client.textCommands,opendiscord.client])

            //client ready
            await opendiscord.events.get("afterClientReady").emit([opendiscord.client])
        }
    }

    //client init (login)
    opendiscord.log("Logging in...","system")
    await opendiscord.events.get("onClientInit").emit([opendiscord.client])
    if (opendiscord.defaults.getDefault("clientInitiating")){
        //init client
        opendiscord.client.initClient()
        await opendiscord.events.get("afterClientInitiated").emit([opendiscord.client])

        //client login
        await opendiscord.client.login().catch((reason) => process.emit("uncaughtException",new api.ODSystemError(reason)))
        opendiscord.log("discord.js client ready!","info")
    }

    //plugin loading before managers
    await opendiscord.events.get("onPluginBeforeManagerLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeManagerLoaded").emit([])

    //load questions
    opendiscord.log("Loading questions...","system")
    if (opendiscord.defaults.getDefault("questionLoading")){
        await (await import("./data/openticket/questionLoader.js")).loadAllQuestions()
    }
    await opendiscord.events.get("onQuestionLoad").emit([opendiscord.questions])
    await opendiscord.events.get("afterQuestionsLoaded").emit([opendiscord.questions])
    
    //load options
    opendiscord.log("Loading options...","system")
    if (opendiscord.defaults.getDefault("optionLoading")){
        await (await import("./data/openticket/optionLoader.js")).loadAllOptions()
    }
    await opendiscord.events.get("onOptionLoad").emit([opendiscord.options])
    await opendiscord.events.get("afterOptionsLoaded").emit([opendiscord.options])
    
    //load panels
    opendiscord.log("Loading panels...","system")
    if (opendiscord.defaults.getDefault("panelLoading")){
        await (await import("./data/openticket/panelLoader.js")).loadAllPanels()
    }
    await opendiscord.events.get("onPanelLoad").emit([opendiscord.panels])
    await opendiscord.events.get("afterPanelsLoaded").emit([opendiscord.panels])

    //load tickets
    opendiscord.log("Loading tickets...","system")
    if (opendiscord.defaults.getDefault("ticketLoading")){
        opendiscord.tickets.useGuild(opendiscord.client.mainServer)
        await (await import("./data/openticket/ticketLoader.js")).loadAllTickets()
    }
    await opendiscord.events.get("onTicketLoad").emit([opendiscord.tickets])
    await opendiscord.events.get("afterTicketsLoaded").emit([opendiscord.tickets])
    
    //load roles
    opendiscord.log("Loading roles...","system")
    if (opendiscord.defaults.getDefault("roleLoading")){
        await (await import("./data/openticket/roleLoader.js")).loadAllRoles()
    }
    await opendiscord.events.get("onRoleLoad").emit([opendiscord.roles])
    await opendiscord.events.get("afterRolesLoaded").emit([opendiscord.roles])

    //load blacklist
    opendiscord.log("Loading blacklist...","system")
    if (opendiscord.defaults.getDefault("blacklistLoading")){
        await (await import("./data/openticket/blacklistLoader.js")).loadAllBlacklistedUsers()
    }
    await opendiscord.events.get("onBlacklistLoad").emit([opendiscord.blacklist])
    await opendiscord.events.get("afterBlacklistLoaded").emit([opendiscord.blacklist])

    //load transcript compilers
    opendiscord.log("Loading transcripts...","system")
    if (opendiscord.defaults.getDefault("transcriptCompilerLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadAllTranscriptCompilers()
    }
    await opendiscord.events.get("onTranscriptCompilerLoad").emit([opendiscord.transcripts])
    await opendiscord.events.get("afterTranscriptCompilersLoaded").emit([opendiscord.transcripts])

    //load transcript history
    if (opendiscord.defaults.getDefault("transcriptHistoryLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadTranscriptHistory()
    }
    await opendiscord.events.get("onTranscriptHistoryLoad").emit([opendiscord.transcripts])
    await opendiscord.events.get("afterTranscriptHistoryLoaded").emit([opendiscord.transcripts])

    //plugin loading before builders
    await opendiscord.events.get("onPluginBeforeBuilderLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeBuilderLoaded").emit([])

    //load button builders
    opendiscord.log("Loading buttons...","system")
    if (opendiscord.defaults.getDefault("buttonBuildersLoading")){
        await (await import("./builders/buttons.js")).registerAllButtons()
    }
    await opendiscord.events.get("onButtonBuilderLoad").emit([opendiscord.builders.buttons,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterButtonBuildersLoaded").emit([opendiscord.builders.buttons,opendiscord.builders,opendiscord.actions])

    //load dropdown builders
    opendiscord.log("Loading dropdowns...","system")
    if (opendiscord.defaults.getDefault("dropdownBuildersLoading")){
        await (await import("./builders/dropdowns.js")).registerAllDropdowns()
    }
    await opendiscord.events.get("onDropdownBuilderLoad").emit([opendiscord.builders.dropdowns,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterDropdownBuildersLoaded").emit([opendiscord.builders.dropdowns,opendiscord.builders,opendiscord.actions])

    //load file builders
    opendiscord.log("Loading files...","system")
    if (opendiscord.defaults.getDefault("fileBuildersLoading")){
        await (await import("./builders/files.js")).registerAllFiles()
    }
    await opendiscord.events.get("onFileBuilderLoad").emit([opendiscord.builders.files,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterFileBuildersLoaded").emit([opendiscord.builders.files,opendiscord.builders,opendiscord.actions])

    //load embed builders
    opendiscord.log("Loading embeds...","system")
    if (opendiscord.defaults.getDefault("embedBuildersLoading")){
        await (await import("./builders/embeds.js")).registerAllEmbeds()
    }
    await opendiscord.events.get("onEmbedBuilderLoad").emit([opendiscord.builders.embeds,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterEmbedBuildersLoaded").emit([opendiscord.builders.embeds,opendiscord.builders,opendiscord.actions])

    //load message builders
    opendiscord.log("Loading messages...","system")
    if (opendiscord.defaults.getDefault("messageBuildersLoading")){
        await (await import("./builders/messages.js")).registerAllMessages()
    }
    await opendiscord.events.get("onMessageBuilderLoad").emit([opendiscord.builders.messages,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterMessageBuildersLoaded").emit([opendiscord.builders.messages,opendiscord.builders,opendiscord.actions])

    //load modal builders
    opendiscord.log("Loading modals...","system")
    if (opendiscord.defaults.getDefault("modalBuildersLoading")){
        await (await import("./builders/modals.js")).registerAllModals()
    }
    await opendiscord.events.get("onModalBuilderLoad").emit([opendiscord.builders.modals,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterModalBuildersLoaded").emit([opendiscord.builders.modals,opendiscord.builders,opendiscord.actions])

    //plugin loading before responders
    await opendiscord.events.get("onPluginBeforeResponderLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeResponderLoaded").emit([])

    //load command responders
    opendiscord.log("Loading command responders...","system")
    if (opendiscord.defaults.getDefault("commandRespondersLoading")){
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
    await opendiscord.events.get("onCommandResponderLoad").emit([opendiscord.responders.commands,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterCommandRespondersLoaded").emit([opendiscord.responders.commands,opendiscord.responders,opendiscord.actions])

    //load button responders
    opendiscord.log("Loading button responders...","system")
    if (opendiscord.defaults.getDefault("buttonRespondersLoading")){
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
    await opendiscord.events.get("onButtonResponderLoad").emit([opendiscord.responders.buttons,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterButtonRespondersLoaded").emit([opendiscord.responders.buttons,opendiscord.responders,opendiscord.actions])

    //load dropdown responders
    opendiscord.log("Loading dropdown responders...","system")
    if (opendiscord.defaults.getDefault("dropdownRespondersLoading")){
        await (await import("./commands/ticket.js")).registerDropdownResponders()
    }
    await opendiscord.events.get("onDropdownResponderLoad").emit([opendiscord.responders.dropdowns,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterDropdownRespondersLoaded").emit([opendiscord.responders.dropdowns,opendiscord.responders,opendiscord.actions])

    //load modal responders
    opendiscord.log("Loading modal responders...","system")
    if (opendiscord.defaults.getDefault("modalRespondersLoading")){
        await (await import("./commands/ticket.js")).registerModalResponders()
        await (await import("./commands/close.js")).registerModalResponders()
        await (await import("./commands/reopen.js")).registerModalResponders()
        await (await import("./commands/delete.js")).registerModalResponders()
        await (await import("./commands/claim.js")).registerModalResponders()
        await (await import("./commands/unclaim.js")).registerModalResponders()
        await (await import("./commands/pin.js")).registerModalResponders()
        await (await import("./commands/unpin.js")).registerModalResponders()
    }
    await opendiscord.events.get("onModalResponderLoad").emit([opendiscord.responders.modals,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterModalRespondersLoaded").emit([opendiscord.responders.modals,opendiscord.responders,opendiscord.actions])

    //plugin loading before finalizations
    await opendiscord.events.get("onPluginBeforeFinalizationLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeFinalizationLoaded").emit([])

    //load actions
    opendiscord.log("Loading actions...","system")
    if (opendiscord.defaults.getDefault("actionsLoading")){
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
    await opendiscord.events.get("onActionLoad").emit([opendiscord.actions])
    await opendiscord.events.get("afterActionsLoaded").emit([opendiscord.actions])

    //load verifybars
    opendiscord.log("Loading verifybars...","system")
    if (opendiscord.defaults.getDefault("verifyBarsLoading")){
        await (await import("./actions/closeTicket.js")).registerVerifyBars()
        await (await import("./actions/deleteTicket.js")).registerVerifyBars()
        await (await import("./actions/reopenTicket.js")).registerVerifyBars()
        await (await import("./actions/claimTicket.js")).registerVerifyBars()
        await (await import("./actions/unclaimTicket.js")).registerVerifyBars()
        await (await import("./actions/pinTicket.js")).registerVerifyBars()
        await (await import("./actions/unpinTicket.js")).registerVerifyBars()
    }
    await opendiscord.events.get("onVerifyBarLoad").emit([opendiscord.verifybars])
    await opendiscord.events.get("afterVerifyBarsLoaded").emit([opendiscord.verifybars])

    //load permissions
    opendiscord.log("Loading permissions...","system")
    if (opendiscord.defaults.getDefault("permissionsLoading")){
        await (await import("./data/framework/permissionLoader.js")).loadAllPermissions()
    }
    await opendiscord.events.get("onPermissionLoad").emit([opendiscord.permissions])
    await opendiscord.events.get("afterPermissionsLoaded").emit([opendiscord.permissions])

    //load posts
    opendiscord.log("Loading posts...","system")
    if (opendiscord.defaults.getDefault("postsLoading")){
        await (await import("./data/framework/postLoader.js")).loadAllPosts()
    }
    await opendiscord.events.get("onPostLoad").emit([opendiscord.posts])
    await opendiscord.events.get("afterPostsLoaded").emit([opendiscord.posts])

    //init posts
    await opendiscord.events.get("onPostInit").emit([opendiscord.posts])
    if (opendiscord.defaults.getDefault("postsInitiating")){
        if (opendiscord.client.mainServer) opendiscord.posts.init(opendiscord.client.mainServer)
        await opendiscord.events.get("afterPostsInitiated").emit([opendiscord.posts])
    }

    //load cooldowns
    opendiscord.log("Loading cooldowns...","system")
    if (opendiscord.defaults.getDefault("cooldownsLoading")){
        await (await import("./data/framework/cooldownLoader.js")).loadAllCooldowns()
    }
    await opendiscord.events.get("onCooldownLoad").emit([opendiscord.cooldowns])
    await opendiscord.events.get("afterCooldownsLoaded").emit([opendiscord.cooldowns])
    
    //init cooldowns
    await opendiscord.events.get("onCooldownInit").emit([opendiscord.cooldowns])
    if (opendiscord.defaults.getDefault("cooldownsInitiating")){
        await opendiscord.cooldowns.init()
        await opendiscord.events.get("afterCooldownsInitiated").emit([opendiscord.cooldowns])
    }

    //load help menu categories
    opendiscord.log("Loading help menu...","system")
    if (opendiscord.defaults.getDefault("helpMenuCategoryLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuCategories()
    }
    await opendiscord.events.get("onHelpMenuCategoryLoad").emit([opendiscord.helpmenu])
    await opendiscord.events.get("afterHelpMenuCategoriesLoaded").emit([opendiscord.helpmenu])

    //load help menu components
    if (opendiscord.defaults.getDefault("helpMenuComponentLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuComponents()
    }
    await opendiscord.events.get("onHelpMenuComponentLoad").emit([opendiscord.helpmenu])
    await opendiscord.events.get("afterHelpMenuComponentsLoaded").emit([opendiscord.helpmenu])

    //load stat scopes
    opendiscord.log("Loading stats...","system")
    if (opendiscord.defaults.getDefault("statScopesLoading")){
        opendiscord.stats.useDatabase(opendiscord.databases.get("opendiscord:stats"))
        await (await import("./data/framework/statLoader.js")).loadAllStatScopes()
    }
    await opendiscord.events.get("onStatScopeLoad").emit([opendiscord.stats])
    await opendiscord.events.get("afterStatScopesLoaded").emit([opendiscord.stats])

    //load stats
    if (opendiscord.defaults.getDefault("statLoading")){
        await (await import("./data/framework/statLoader.js")).loadAllStats()
    }
    await opendiscord.events.get("onStatLoad").emit([opendiscord.stats])
    await opendiscord.events.get("afterStatsLoaded").emit([opendiscord.stats])

    //init stats
    await opendiscord.events.get("onStatInit").emit([opendiscord.stats])
    if (opendiscord.defaults.getDefault("statInitiating")){
        await opendiscord.stats.init()
        await opendiscord.events.get("afterStatsInitiated").emit([opendiscord.stats])
    }

    //plugin loading before code
    await opendiscord.events.get("onPluginBeforeCodeLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeCodeLoaded").emit([])

    //load code
    opendiscord.log("Loading code...","system")
    if (opendiscord.defaults.getDefault("codeLoading")){
        await (await import("./data/framework/codeLoader.js")).loadAllCode()
    }
    await opendiscord.events.get("onCodeLoad").emit([opendiscord.code])
    await opendiscord.events.get("afterCodeLoaded").emit([opendiscord.code])

    //execute code
    await opendiscord.events.get("onCodeExecute").emit([opendiscord.code])
    if (opendiscord.defaults.getDefault("codeExecution")){
        await opendiscord.code.execute()
        await opendiscord.events.get("afterCodeExecuted").emit([opendiscord.code])
    }

    //finish setup
    opendiscord.log("Setup complete!","info")

    //load livestatus sources
    opendiscord.log("Loading livestatus...","system")
    if (opendiscord.defaults.getDefault("liveStatusLoading")){
        await (await import("./data/framework/liveStatusLoader.js")).loadAllLiveStatusSources()
    }
    await opendiscord.events.get("onLiveStatusSourceLoad").emit([opendiscord.livestatus])
    await opendiscord.events.get("afterLiveStatusSourcesLoaded").emit([opendiscord.livestatus])

    //load startscreen
    opendiscord.log("Loading startscreen...","system")
    if (opendiscord.defaults.getDefault("startScreenLoading")){
        await (await import("./data/framework/startScreenLoader.js")).loadAllStartScreenComponents()
    }
    await opendiscord.events.get("onStartScreenLoad").emit([opendiscord.startscreen])
    await opendiscord.events.get("afterStartScreensLoaded").emit([opendiscord.startscreen])

    //render startscreen
    await opendiscord.events.get("onStartScreenRender").emit([opendiscord.startscreen])
    if (opendiscord.defaults.getDefault("startScreenRendering")){
        await opendiscord.startscreen.renderAllComponents()
        if (opendiscord.languages.getLanguageMetadata(false)?.automated){
            console.log("===================")
            opendiscord.log("You are currently using a language which has been translated by Google Translate!","warning")
            opendiscord.log("Please help us improve the translation by contributing to our project!","warning")
            console.log("===================")
        }

        await opendiscord.events.get("afterStartScreensRendered").emit([opendiscord.startscreen])
    }

    //YIPPPIE!!
    //The startup of Open Ticket is completed :)
    await opendiscord.events.get("beforeReadyForUsage").emit([])
    opendiscord.readyStartupDate = new Date()
    await opendiscord.events.get("onReadyForUsage").emit([])
}
main()