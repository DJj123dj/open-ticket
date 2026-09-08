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
    Open Ticket v4.2.2 - © DJdj Development

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
import { loadDumpCommand, loadAllPlugins, loadErrorHandling } from "@open-discord-bots/framework"
import * as utilities from "@open-discord-bots/framework/utilities"
import * as api from "./core/api.js"
import ansis from "ansis"

export * as utilities from "@open-discord-bots/framework/utilities"
export * as api from "./core/api.js"

utilities.checkNodeVersion("openticket")

utilities.moduleInstalled("@open-discord-bots/framework",true)
utilities.moduleInstalled("@discordjs/rest",true)
utilities.moduleInstalled("discord.js",true)
utilities.moduleInstalled("ansis",true)
utilities.moduleInstalled("formatted-json-stringify",true)
utilities.moduleInstalled("typescript",true)
utilities.moduleInstalled("terminal-kit",true)

export const opendiscord: api.ODOpenTicketMain = new api.ODOpenTicketMain()
export * as openticketUtils from "./actions/utilities.js"

utilities.initialStartupLogs(opendiscord,"openticket")

/**The main sequence of Open Ticket. Runs `async` */
const main = async () => {
    //load all events
    (await import("./data/framework/eventLoader.js")).loadAllEvents()

    //error handling system
    loadErrorHandling(opendiscord,"openticket")

    //handle data migration (PART 1)
    const lastVersion = await (await import("./core/startup/manageMigration.js")).loadVersionMigrationSystem()

    //load plugins
    if (opendiscord.sharedFuses.getFuse("pluginLoading")){
        await loadAllPlugins(opendiscord)
    }
    await opendiscord.events.get("afterPluginsLoaded").emit([opendiscord.plugins])
    
    //load plugin classes
    opendiscord.log("Loading plugin classes...","system")
    if (opendiscord.sharedFuses.getFuse("pluginClassLoading")){

    }
    await opendiscord.events.get("onPluginClassLoad").emit([opendiscord.plugins.classes,opendiscord.plugins])
    await opendiscord.events.get("afterPluginClassesLoaded").emit([opendiscord.plugins.classes,opendiscord.plugins])

    //load flags
    opendiscord.log("Loading flags...","system")
    if (opendiscord.sharedFuses.getFuse("flagLoading")){
        await (await import("./data/framework/flagLoader.js")).loadAllFlags()
    }
    await opendiscord.events.get("onFlagLoad").emit([opendiscord.flags])
    await opendiscord.events.get("afterFlagsLoaded").emit([opendiscord.flags])

    //initiate flags
    await opendiscord.events.get("onFlagInit").emit([opendiscord.flags])
    if (opendiscord.sharedFuses.getFuse("flagInitiating")){
        await opendiscord.flags.init()
        opendiscord.debugfile.writeText("\n[ENABLED FLAGS]:\n"+opendiscord.flags.getFiltered((flag) => (flag.value == true)).map((flag) => flag.id.value).join("\n")+"\n")
        await opendiscord.events.get("afterFlagsInitiated").emit([opendiscord.flags])
    }

    //load debug
    if (opendiscord.sharedFuses.getFuse("debugLoading")){
        const debugFlag = opendiscord.flags.get("opendiscord:debug")
        opendiscord.debug.visible = (debugFlag) ? debugFlag.value : false
    }

    //load silent mode
    if (opendiscord.sharedFuses.getFuse("silentLoading")){
        const silentFlag = opendiscord.flags.get("opendiscord:silent")
        opendiscord.console.silent = (silentFlag) ? silentFlag.value : false
        if (opendiscord.console.silent){
            opendiscord.console.silent = false
            opendiscord.log("Silent mode is active! Logs won't be shown in the console.","warning")
            opendiscord.console.silent = true
        }
    }

    //load progress bar renderers
    opendiscord.log("Loading progress bars...","system")
    if (opendiscord.sharedFuses.getFuse("progressBarRendererLoading")){
        await (await import("./data/framework/progressBarLoader.js")).loadAllProgressBarRenderers()
    }
    await opendiscord.events.get("onProgressBarRendererLoad").emit([opendiscord.progressbars.renderers])
    await opendiscord.events.get("afterProgressBarRenderersLoaded").emit([opendiscord.progressbars.renderers])
    
    //load progress bars
    if (opendiscord.sharedFuses.getFuse("progressBarLoading")){
        await (await import("./data/framework/progressBarLoader.js")).loadAllProgressBars()
    }
    await opendiscord.events.get("onProgressBarLoad").emit([opendiscord.progressbars])
    await opendiscord.events.get("afterProgressBarsLoaded").emit([opendiscord.progressbars])

    //load config
    opendiscord.log("Loading configs...","system")
    if (opendiscord.sharedFuses.getFuse("configLoading")){
        await (await import("./data/framework/configLoader.js")).loadAllConfigs()
    }
    await opendiscord.events.get("onConfigLoad").emit([opendiscord.configs])
    await opendiscord.events.get("afterConfigsLoaded").emit([opendiscord.configs])

    //initiate config
    await opendiscord.events.get("onConfigInit").emit([opendiscord.configs])
    if (opendiscord.sharedFuses.getFuse("configInitiating")){
        await opendiscord.configs.init()
        await opendiscord.events.get("afterConfigsInitiated").emit([opendiscord.configs])
    }

    //UTILITY CONFIG
    const generalConfig = opendiscord.configs.get("opendiscord:general")

    if (opendiscord.sharedFuses.getFuse("emojiTitleStyleLoading")){
        //set emoji style based on config
        const emojiStyle = (generalConfig.data && generalConfig.data.ticketSystem && generalConfig.data.ticketSystem.emojiStyle) ? generalConfig.data.ticketSystem.emojiStyle : "before"
        opendiscord.sharedFuses.setFuse("emojiTitleStyle",emojiStyle)
    }
    
    //load database
    opendiscord.log("Loading databases...","system")
    if (opendiscord.sharedFuses.getFuse("databaseLoading")){
        await (await import("./data/framework/databaseLoader.js")).loadAllDatabases()
    }
    await opendiscord.events.get("onDatabaseLoad").emit([opendiscord.databases])
    await opendiscord.events.get("afterDatabasesLoaded").emit([opendiscord.databases])

    //initiate database
    await opendiscord.events.get("onDatabaseInit").emit([opendiscord.databases])
    if (opendiscord.sharedFuses.getFuse("databaseInitiating")){
        await opendiscord.databases.init()
        await opendiscord.events.get("afterDatabasesInitiated").emit([opendiscord.databases])
    }

    //load sessions
    opendiscord.log("Loading sessions...","system")
    if (opendiscord.sharedFuses.getFuse("sessionLoading")){

    }
    await opendiscord.events.get("onSessionLoad").emit([opendiscord.sessions])
    await opendiscord.events.get("afterSessionsLoaded").emit([opendiscord.sessions])    

    //load language
    opendiscord.log("Loading languages...","system")
    if (opendiscord.sharedFuses.getFuse("languageLoading")){
        await (await import("./data/framework/languageLoader.js")).loadAllLanguages()
    }
    await opendiscord.events.get("onLanguageLoad").emit([opendiscord.languages])
    await opendiscord.events.get("afterLanguagesLoaded").emit([opendiscord.languages])   
    
    //initiate language
    await opendiscord.events.get("onLanguageInit").emit([opendiscord.languages])
    if (opendiscord.sharedFuses.getFuse("languageInitiating")){
        await opendiscord.languages.init()
        await opendiscord.events.get("afterLanguagesInitiated").emit([opendiscord.languages])

        //add available languages to list for config checker
        const languageList = opendiscord.sharedFuses.getFuse("languageList")
        const languageIds = opendiscord.languages.getIds().map((id) => {
            if (id.value.startsWith("opendiscord:")){
                //is open ticket language => return without prefix
                return id.value.split("opendiscord:")[1]
            }else return id.value
        })
        languageList.push(...languageIds)
        opendiscord.sharedFuses.setFuse("languageList",languageList)
    }

    //select language
    await opendiscord.events.get("onLanguageSelect").emit([opendiscord.languages])
    if (opendiscord.sharedFuses.getFuse("languageSelection")){
        //set current language
        const languageId = (generalConfig?.data?.language) ? generalConfig.data.language  : "english"
        if (languageId.includes(":")){
            opendiscord.languages.setCurrentLanguage(languageId)
        }else{
            opendiscord.languages.setCurrentLanguage("opendiscord:"+languageId)
        }

        //set backup language
        const backupLanguageId = opendiscord.sharedFuses.getFuse("backupLanguage")
        if (opendiscord.languages.exists(backupLanguageId)){
            opendiscord.languages.setBackupLanguage(backupLanguageId)
            
        }else throw new api.ODSystemError("Unknown backup language '"+backupLanguageId+"'!")

        await opendiscord.events.get("afterLanguagesSelected").emit([opendiscord.languages.get(languageId),opendiscord.languages.get(backupLanguageId),opendiscord.languages])    
    }

    //handle data migration (PART 2)
    if (lastVersion) await (await import("./core/startup/manageMigration.js")).loadAfterStartupMigrations(lastVersion)
    
    //load config checker
    opendiscord.log("Loading config checker...","system")
    if (opendiscord.sharedFuses.getFuse("checkerLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckers()
    }
    await opendiscord.events.get("onCheckerLoad").emit([opendiscord.checkers])
    await opendiscord.events.get("afterCheckersLoaded").emit([opendiscord.checkers])

    //load config checker functions
    if (opendiscord.sharedFuses.getFuse("checkerFunctionLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerFunctions()
    }
    await opendiscord.events.get("onCheckerFunctionLoad").emit([opendiscord.checkers.functions,opendiscord.checkers])
    await opendiscord.events.get("afterCheckerFunctionsLoaded").emit([opendiscord.checkers.functions,opendiscord.checkers])
    
    //execute config checker
    await opendiscord.events.get("onCheckerExecute").emit([opendiscord.checkers])
    if (opendiscord.sharedFuses.getFuse("checkerExecution")){
        const result = opendiscord.checkers.checkAll(true)
        await opendiscord.events.get("afterCheckersExecuted").emit([result,opendiscord.checkers])
    }

    //load config checker translations
    if (opendiscord.sharedFuses.getFuse("checkerTranslationLoading")){
        await (await import("./data/framework/checkerLoader.js")).loadAllConfigCheckerTranslations()
    }
    await opendiscord.events.get("onCheckerTranslationLoad").emit([opendiscord.checkers.translation,((generalConfig && generalConfig.data.ticketSystem && generalConfig.data.ticketSystem.useTranslatedConfigChecker) ? generalConfig.data.ticketSystem.useTranslatedConfigChecker : false),opendiscord.checkers])
    await opendiscord.events.get("afterCheckerTranslationsLoaded").emit([opendiscord.checkers.translation,opendiscord.checkers])

    //render config checker
    const advancedCheckerFlag = opendiscord.flags.get("opendiscord:checker")
    const disableCheckerFlag = opendiscord.flags.get("opendiscord:no-checker")
    const useCliFlag = opendiscord.flags.get("opendiscord:cli")

    await opendiscord.events.get("onCheckerRender").emit([opendiscord.checkers.renderer,opendiscord.checkers])
    if (opendiscord.sharedFuses.getFuse("checkerRendering") && !(disableCheckerFlag ? disableCheckerFlag.value : false) && !(useCliFlag ? useCliFlag.value : false)){
        //check if there is a result (otherwise throw minor error)
        const result = opendiscord.checkers.lastResult
        if (!result) return opendiscord.log("Failed to render Config Checker! (couldn't fetch result)","error")
        
        //get components & check if full mode enabled
        const components = opendiscord.checkers.renderer.getComponents(!(advancedCheckerFlag ? advancedCheckerFlag.value : false),opendiscord.sharedFuses.getFuse("checkerRenderEmpty"),opendiscord.checkers.translation,result)

        //render
        opendiscord.debugfile.writeText("\n[CONFIG CHECKER RESULT]:\n"+ansis.strip(components.join("\n"))+"\n")
        opendiscord.checkers.renderer.render(components)

        //wait 5 seconds when there are warnings (not for errors & info)
        if (result.messages.length > 0 && result.messages.some((msg) => msg.type == "warning") && result.messages.every((msg) => msg.type != "error")) await utilities.timer(5000)

        await opendiscord.events.get("afterCheckersRendered").emit([opendiscord.checkers.renderer,opendiscord.checkers])
    }

    //quit config checker (when required)
    if (opendiscord.checkers.lastResult && !opendiscord.checkers.lastResult.valid && !(disableCheckerFlag ? disableCheckerFlag.value : false) && !(useCliFlag ? useCliFlag.value : false)){
        await opendiscord.events.get("onCheckerQuit").emit([opendiscord.checkers])
        if (opendiscord.sharedFuses.getFuse("checkerQuit")){
            process.exit(1)
            //there is no afterCheckerQuitted event :)
        }
    }

    //switch to CLI context instead of running the bot
    if (useCliFlag && useCliFlag.value){
        await (await (import("./core/cli/cli.js"))).execute()
        await utilities.timer(1000)
        console.log("\n\n"+ansis.red("❌ Something went wrong in the Interactive Setup CLI. Please try again or report a bug in our discord server."))
        process.exit(0)
    }

    //plugin loading before client
    await opendiscord.events.get("onPluginBeforeClientLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeClientLoaded").emit([])

    //client configuration
    opendiscord.log("Loading client...","system")
    if (opendiscord.sharedFuses.getFuse("clientLoading")){
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
        if (opendiscord.sharedFuses.getFuse("clientReady")){
            const client = opendiscord.client

            //check if all servers are valid
            const botServers = await client.getGuilds()
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            const serverId = generalConfig.data.serverId ? generalConfig.data.serverId : ""
            if (!serverId) throw new api.ODSystemError("Server Id Missing!")
            
            const mainServer = botServers.find((g) => g.id == serverId)
            client.mainServer = mainServer ?? null
            //throw if bot isn't member of main server
            if (!mainServer || !client.checkBotInGuild(mainServer)){
                console.log("\n")
                opendiscord.log("The bot isn't a member of the server provided in the config!","error")
                opendiscord.log("Please invite your bot to this server!","info")
                console.log("\n")
                process.exit(1)
            }
            //throw if bot doesn't have permissions in main server
            if (!client.checkGuildPerms(mainServer)){
                console.log("\n")
                opendiscord.log("The bot doesn’t have the required permissions for the server specified in the configuration.","error")
                opendiscord.log("Please give the bot \"Administrator\" permissions or visit the documentation!","info")
                console.log("\n")
                process.exit(1)
            }
            if (opendiscord.sharedFuses.getFuse("clientMultiGuildWarning")){
                //warn if bot is in multiple servers
                if (botServers.length > 1){
                    opendiscord.log("This bot is part of multiple servers, but Open Ticket does not support this.","warning")
                    opendiscord.log("The bot may have weird behaviour when used in external servers!","info")
                    await utilities.timer(2000)
                }
                botServers.forEach((server) => {
                    //warn if bot doesn't have permissions in multiple servers
                    if (!client.checkGuildPerms(server)) opendiscord.log(`The bot doesn’t have the required permissions for the server "${server.name}".`,"warning")
                })
            }

            //load client activity
            opendiscord.log("Loading client activity...","system")
            if (opendiscord.sharedFuses.getFuse("clientActivityLoading")){
                //load config status
                if (generalConfig.data.status && generalConfig.data.status.enabled) opendiscord.client.activity.setStatus(generalConfig.data.status.type,generalConfig.data.status.text,generalConfig.data.status.mode,generalConfig.data.status.state)
            }
            await opendiscord.events.get("onClientActivityLoad").emit([opendiscord.client.activity,opendiscord.client])
            await opendiscord.events.get("afterClientActivityLoaded").emit([opendiscord.client.activity,opendiscord.client])

            //initiate client activity
            await opendiscord.events.get("onClientActivityInit").emit([opendiscord.client.activity,opendiscord.client])
            if (opendiscord.sharedFuses.getFuse("clientActivityInitiating")){
                opendiscord.client.activity.initStatus()
                await opendiscord.events.get("afterClientActivityInitiated").emit([opendiscord.client.activity,opendiscord.client])
            }

            //load priority levels
            opendiscord.log("Loading prioritiy levels...","system")
            if (opendiscord.fuses.getFuse("priorityLoading")){
                await (await import("./data/openticket/priorityLoader.js")).loadAllPriorityLevels()
            }
            await opendiscord.events.get("onPriorityLoad").emit([opendiscord.priorities])
            await opendiscord.events.get("afterPrioritiesLoaded").emit([opendiscord.priorities])

            //load slash commands
            opendiscord.log("Loading slash commands...","system")
            if (opendiscord.sharedFuses.getFuse("slashCommandLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllSlashCommands()
            }
            await opendiscord.events.get("onSlashCommandLoad").emit([opendiscord.client.slashCommands,opendiscord.client])
            await opendiscord.events.get("afterSlashCommandsLoaded").emit([opendiscord.client.slashCommands,opendiscord.client])
            
            //register slash commands (create, update & remove)
            if (opendiscord.sharedFuses.getFuse("forceSlashCommandRegistration")) opendiscord.log("Forcing all slash commands to be re-registered...","system")
            opendiscord.log("Registering slash commands... (this can take up to 2 minutes)","system")
            await opendiscord.events.get("onSlashCommandRegister").emit([opendiscord.client.slashCommands,opendiscord.client])
            if (opendiscord.sharedFuses.getFuse("slashCommandRegistering")){
                //get all commands that are already registered in the bot
                const cmds = await opendiscord.client.slashCommands.getAllRegisteredCommands()
                const removableCmds = cmds.unused.map((cmd) => cmd.cmd)
                const newCmds = cmds.unregistered.map((cmd) => cmd.instance)
                const updatableCmds = cmds.registered.filter((cmd) => cmd.requiresUpdate || opendiscord.sharedFuses.getFuse("forceSlashCommandRegistration")).map((cmd) => cmd.instance)

                //init progress bars
                const removeProgress = opendiscord.progressbars.get("opendiscord:slash-command-remove")
                const createProgress = opendiscord.progressbars.get("opendiscord:slash-command-create")
                const updateProgress = opendiscord.progressbars.get("opendiscord:slash-command-update")

                //remove unused cmds, create new cmds & update existing cmds
                if (opendiscord.sharedFuses.getFuse("allowSlashCommandRemoval")) await opendiscord.client.slashCommands.removeUnusedCommands(removableCmds,undefined,removeProgress)
                await opendiscord.client.slashCommands.createNewCommands(newCmds,createProgress)
                await opendiscord.client.slashCommands.updateExistingCommands(updatableCmds,updateProgress)
                
                await opendiscord.events.get("afterSlashCommandsRegistered").emit([opendiscord.client.slashCommands,opendiscord.client])
            }

            //load context menus
            opendiscord.log("Loading context menus...","system")
            if (opendiscord.sharedFuses.getFuse("contextMenuLoading")){
                await (await import("./data/framework/commandLoader.js")).loadAllContextMenus()
            }
            await opendiscord.events.get("onContextMenuLoad").emit([opendiscord.client.contextMenus,opendiscord.client])
            await opendiscord.events.get("afterContextMenusLoaded").emit([opendiscord.client.contextMenus,opendiscord.client])
            
            //register context menus (create, update & remove)
            if (opendiscord.sharedFuses.getFuse("forceContextMenuRegistration")) opendiscord.log("Forcing all context menus to be re-registered...","system")
            opendiscord.log("Registering context menus... (this can take up to a minute)","system")
            await opendiscord.events.get("onContextMenuRegister").emit([opendiscord.client.contextMenus,opendiscord.client])
            if (opendiscord.sharedFuses.getFuse("contextMenuRegistering")){
                //get all context menus that are already registered in the bot
                const menus = await opendiscord.client.contextMenus.getAllRegisteredMenus()
                const removableMenus = menus.unused.map((menu) => menu.menu)
                const newMenus = menus.unregistered.map((menu) => menu.instance)
                const updatableMenus = menus.registered.filter((menu) => menu.requiresUpdate || opendiscord.sharedFuses.getFuse("forceContextMenuRegistration")).map((menu) => menu.instance)

                //init progress bars
                const removeProgress = opendiscord.progressbars.get("opendiscord:context-menu-remove")
                const createProgress = opendiscord.progressbars.get("opendiscord:context-menu-create")
                const updateProgress = opendiscord.progressbars.get("opendiscord:context-menu-update")

                //remove unused menus, create new menus & update existing menus
                if (opendiscord.sharedFuses.getFuse("allowContextMenuRemoval")) await opendiscord.client.contextMenus.removeUnusedMenus(removableMenus,undefined,removeProgress)
                await opendiscord.client.contextMenus.createNewMenus(newMenus,createProgress)
                await opendiscord.client.contextMenus.updateExistingMenus(updatableMenus,updateProgress)
                
                await opendiscord.events.get("afterContextMenusRegistered").emit([opendiscord.client.contextMenus,opendiscord.client])
            }

            //load text commands
            opendiscord.log("Loading text commands...","system")
            if (opendiscord.sharedFuses.getFuse("allowDumpCommand")){
                loadDumpCommand(opendiscord)
            }
            if (opendiscord.sharedFuses.getFuse("textCommandLoading")){
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
    if (opendiscord.sharedFuses.getFuse("clientInitiating")){
        //init client
        opendiscord.client.initClient()
        await opendiscord.events.get("afterClientInitiated").emit([opendiscord.client])

        //client login
        await opendiscord.client.login().catch((reason) => process.emit("uncaughtException",new api.ODSystemError(reason)))
        opendiscord.log("discord.js client ready!","info")
    }

    //load states
    opendiscord.log("Loading states...","system")
    if (opendiscord.sharedFuses.getFuse("stateLoading")){
        await (await import("./data/framework/stateLoader.js")).loadAllStates()
    }
    await opendiscord.events.get("onStateLoad").emit([opendiscord.states])
    await opendiscord.events.get("afterStatesLoaded").emit([opendiscord.states])

    //init states (async to prevent blocking startup)
    opendiscord.log("Initiating states... (may take a while for many tickets)","system")
    await opendiscord.events.get("onStateInit").emit([opendiscord.states])
    if (opendiscord.sharedFuses.getFuse("stateInitiating")){
        await opendiscord.states.init()
        await opendiscord.events.get("afterStatesInitiated").emit([opendiscord.states])
    }
    opendiscord.log("Message states ready!","info")

    //plugin loading before managers
    await opendiscord.events.get("onPluginBeforeManagerLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeManagerLoaded").emit([])

    //load questions
    opendiscord.log("Loading questions...","system")
    if (opendiscord.fuses.getFuse("questionLoading")){
        await (await import("./data/openticket/questionLoader.js")).loadAllQuestions()
    }
    await opendiscord.events.get("onQuestionLoad").emit([opendiscord.questions])
    await opendiscord.events.get("afterQuestionsLoaded").emit([opendiscord.questions])
    
    //load options
    opendiscord.log("Loading options...","system")
    if (opendiscord.fuses.getFuse("optionLoading")){
        await (await import("./data/openticket/optionLoader.js")).loadAllOptions()
    }
    await opendiscord.events.get("onOptionLoad").emit([opendiscord.options])
    await opendiscord.events.get("afterOptionsLoaded").emit([opendiscord.options])
    
    //load panels
    opendiscord.log("Loading panels...","system")
    if (opendiscord.fuses.getFuse("panelLoading")){
        await (await import("./data/openticket/panelLoader.js")).loadAllPanels()
    }
    await opendiscord.events.get("onPanelLoad").emit([opendiscord.panels])
    await opendiscord.events.get("afterPanelsLoaded").emit([opendiscord.panels])

    //load tickets
    opendiscord.log("Loading tickets...","system")
    if (opendiscord.fuses.getFuse("ticketLoading")){
        opendiscord.tickets.useGuild(opendiscord.client.mainServer)
        await (await import("./data/openticket/ticketLoader.js")).loadAllTickets()
    }
    await opendiscord.events.get("onTicketLoad").emit([opendiscord.tickets])
    await opendiscord.events.get("afterTicketsLoaded").emit([opendiscord.tickets])
    
    //load roles
    opendiscord.log("Loading roles...","system")
    if (opendiscord.fuses.getFuse("roleLoading")){
        await (await import("./data/openticket/roleLoader.js")).loadAllRoles()
    }
    await opendiscord.events.get("onRoleLoad").emit([opendiscord.roles])
    await opendiscord.events.get("afterRolesLoaded").emit([opendiscord.roles])

    //load blacklist
    opendiscord.log("Loading blacklist...","system")
    if (opendiscord.fuses.getFuse("blacklistLoading")){
        await (await import("./data/openticket/blacklistLoader.js")).loadAllBlacklistedUsers()
    }
    await opendiscord.events.get("onBlacklistLoad").emit([opendiscord.blacklist])
    await opendiscord.events.get("afterBlacklistLoaded").emit([opendiscord.blacklist])

    //load transcript compilers
    opendiscord.log("Loading transcripts...","system")
    if (opendiscord.fuses.getFuse("transcriptCompilerLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadAllTranscriptCompilers()
    }
    await opendiscord.events.get("onTranscriptCompilerLoad").emit([opendiscord.transcripts])
    await opendiscord.events.get("afterTranscriptCompilersLoaded").emit([opendiscord.transcripts])

    //load transcript history
    if (opendiscord.fuses.getFuse("transcriptHistoryLoading")){
        await (await import("./data/openticket/transcriptLoader.js")).loadTranscriptHistory()
    }
    await opendiscord.events.get("onTranscriptHistoryLoad").emit([opendiscord.transcripts])
    await opendiscord.events.get("afterTranscriptHistoryLoaded").emit([opendiscord.transcripts])

    //plugin loading before builders
    await opendiscord.events.get("onPluginBeforeBuilderLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeBuilderLoaded").emit([])

    //load button builders
    opendiscord.log("Loading buttons...","system")
    if (opendiscord.sharedFuses.getFuse("buttonBuildersLoading")){
        await (await import("./builders/buttons.js")).registerAllButtons()
    }
    await opendiscord.events.get("onButtonBuilderLoad").emit([opendiscord.builders.buttons,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterButtonBuildersLoaded").emit([opendiscord.builders.buttons,opendiscord.builders,opendiscord.actions])

    //load dropdown builders
    opendiscord.log("Loading dropdowns...","system")
    if (opendiscord.sharedFuses.getFuse("dropdownBuildersLoading")){
        await (await import("./builders/dropdowns.js")).registerAllDropdowns()
    }
    await opendiscord.events.get("onDropdownBuilderLoad").emit([opendiscord.builders.dropdowns,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterDropdownBuildersLoaded").emit([opendiscord.builders.dropdowns,opendiscord.builders,opendiscord.actions])

    //load file builders
    opendiscord.log("Loading files...","system")
    if (opendiscord.sharedFuses.getFuse("fileBuildersLoading")){
        await (await import("./builders/files.js")).registerAllFiles()
    }
    await opendiscord.events.get("onFileBuilderLoad").emit([opendiscord.builders.files,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterFileBuildersLoaded").emit([opendiscord.builders.files,opendiscord.builders,opendiscord.actions])

    //load embed builders
    opendiscord.log("Loading embeds...","system")
    if (opendiscord.sharedFuses.getFuse("embedBuildersLoading")){
        await (await import("./builders/embeds.js")).registerAllEmbeds()
    }
    await opendiscord.events.get("onEmbedBuilderLoad").emit([opendiscord.builders.embeds,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterEmbedBuildersLoaded").emit([opendiscord.builders.embeds,opendiscord.builders,opendiscord.actions])

    //load message builders
    opendiscord.log("Loading messages...","system")
    if (opendiscord.sharedFuses.getFuse("messageBuildersLoading")){
        await (await import("./builders/messages.js")).registerAllMessages()
    }
    await opendiscord.events.get("onMessageBuilderLoad").emit([opendiscord.builders.messages,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterMessageBuildersLoaded").emit([opendiscord.builders.messages,opendiscord.builders,opendiscord.actions])

    //load modal builders
    opendiscord.log("Loading modals...","system")
    if (opendiscord.sharedFuses.getFuse("modalBuildersLoading")){
        //Deprecated, moved to "modal components"
    }
    await opendiscord.events.get("onModalBuilderLoad").emit([opendiscord.builders.modals,opendiscord.builders,opendiscord.actions])
    await opendiscord.events.get("afterModalBuildersLoaded").emit([opendiscord.builders.modals,opendiscord.builders,opendiscord.actions])

    //load shared components
    opendiscord.log("Loading shared components...","system")
    if (opendiscord.sharedFuses.getFuse("sharedComponentsLoading")){
        //TODO!!
    }
    await opendiscord.events.get("onSharedComponentLoad").emit([opendiscord.components.shared,opendiscord.components,opendiscord.actions])
    await opendiscord.events.get("afterSharedComponentsLoaded").emit([opendiscord.components.shared,opendiscord.components,opendiscord.actions])

    //load message components
    opendiscord.log("Loading message components...","system")
    if (opendiscord.sharedFuses.getFuse("messageComponentsLoading")){
        //TODO!!
    }
    await opendiscord.events.get("onMessageComponentLoad").emit([opendiscord.components.messages,opendiscord.components,opendiscord.actions])
    await opendiscord.events.get("afterMessageComponentsLoaded").emit([opendiscord.components.messages,opendiscord.components,opendiscord.actions])

    //load modal components
    opendiscord.log("Loading modal components...","system")
    if (opendiscord.sharedFuses.getFuse("modalComponentsLoading")){
        await (await import("./components/modals.js")).registerModalComponents()
    }
    await opendiscord.events.get("onModalComponentLoad").emit([opendiscord.components.modals,opendiscord.components,opendiscord.actions])
    await opendiscord.events.get("afterModalComponentsLoaded").emit([opendiscord.components.modals,opendiscord.components,opendiscord.actions])

    //load component modifiers
    opendiscord.log("Loading component modifiers...","system")
    if (opendiscord.sharedFuses.getFuse("componentModifiersLoading")){
        await (await import("./components/verifybarModifiers.js")).registerAllVerifyBarModifiers()
    }
    await opendiscord.events.get("onComponentModifierLoad").emit([opendiscord.components.modifiers,opendiscord.components.messages,opendiscord.builders.messages])
    await opendiscord.events.get("afterComponentModifiersLoaded").emit([opendiscord.components.modifiers,opendiscord.components.messages,opendiscord.builders.messages])

    //plugin loading before responders
    await opendiscord.events.get("onPluginBeforeResponderLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeResponderLoaded").emit([])

    //load command responders
    opendiscord.log("Loading command responders...","system")
    if (opendiscord.sharedFuses.getFuse("commandRespondersLoading")){
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
        await (await import("./commands/topic.js")).registerCommandResponders()
        await (await import("./commands/priority.js")).registerCommandResponders()
        await (await import("./commands/transfer.js")).registerCommandResponders()
        await (await import("./commands/transcripts.js")).registerCommandResponders()
    }
    await opendiscord.events.get("onCommandResponderLoad").emit([opendiscord.responders.commands,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterCommandRespondersLoaded").emit([opendiscord.responders.commands,opendiscord.responders,opendiscord.actions])

    //load button responders
    opendiscord.log("Loading button responders...","system")
    if (opendiscord.sharedFuses.getFuse("buttonRespondersLoading")){
        await (await import("./actions/handleVerifyBar.js")).registerButtonResponders()
        await (await import("./actions/handleTranscriptErrors.js")).registerButtonResponders()
        await (await import("./commands/help.js")).registerButtonResponders()
        await (await import("./commands/panel.js")).registerButtonResponders()
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
    if (opendiscord.sharedFuses.getFuse("dropdownRespondersLoading")){
        await (await import("./commands/panel.js")).registerDropdownResponders()
        await (await import("./commands/priority.js")).registerDropdownResponders()
    }
    await opendiscord.events.get("onDropdownResponderLoad").emit([opendiscord.responders.dropdowns,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterDropdownRespondersLoaded").emit([opendiscord.responders.dropdowns,opendiscord.responders,opendiscord.actions])

    //load modal responders
    opendiscord.log("Loading modal responders...","system")
    if (opendiscord.sharedFuses.getFuse("modalRespondersLoading")){
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

    //load context menu responders
    opendiscord.log("Loading context menu responders...","system")
    if (opendiscord.sharedFuses.getFuse("contextMenuRespondersLoading")){
        //TODO!!
    }
    await opendiscord.events.get("onContextMenuResponderLoad").emit([opendiscord.responders.contextMenus,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterContextMenuRespondersLoaded").emit([opendiscord.responders.contextMenus,opendiscord.responders,opendiscord.actions])

    //load autocomplete responders
    opendiscord.log("Loading autocomplete responders...","system")
    if (opendiscord.sharedFuses.getFuse("autocompleteRespondersLoading")){
        await (await import("./commands/autocomplete.js")).registerAutocompleteResponders()
    }
    await opendiscord.events.get("onAutocompleteResponderLoad").emit([opendiscord.responders.autocomplete,opendiscord.responders,opendiscord.actions])
    await opendiscord.events.get("afterAutocompleteRespondersLoaded").emit([opendiscord.responders.autocomplete,opendiscord.responders,opendiscord.actions])

    //plugin loading before finalizations
    await opendiscord.events.get("onPluginBeforeFinalizationLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeFinalizationLoaded").emit([])

    //load actions
    opendiscord.log("Loading actions...","system")
    if (opendiscord.sharedFuses.getFuse("actionsLoading")){
        await (await import("./actions/createTicketPermissions.js")).registerActions()
        await (await import("./actions/calculateTicketCategory.js")).registerActions()
        await (await import("./actions/calculateTicketName.js")).registerActions()
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
        await (await import("./actions/updateTicketTopic.js")).registerActions()
        await (await import("./actions/updateTicketPriority.js")).registerActions()
        await (await import("./actions/transferTicket.js")).registerActions()
    }
    await opendiscord.events.get("onActionLoad").emit([opendiscord.actions])
    await opendiscord.events.get("afterActionsLoaded").emit([opendiscord.actions])

    //load verifybars
    opendiscord.log("Loading verifybars...","system")
    if (opendiscord.sharedFuses.getFuse("verifyBarsLoading")){
        await (await import("./commands/close.js")).registerVerifyBars()
        await (await import("./commands/delete.js")).registerVerifyBars()
        await (await import("./commands/reopen.js")).registerVerifyBars()
        await (await import("./commands/claim.js")).registerVerifyBars()
        await (await import("./commands/unclaim.js")).registerVerifyBars()
        await (await import("./commands/pin.js")).registerVerifyBars()
        await (await import("./commands/unpin.js")).registerVerifyBars()
    }
    await opendiscord.events.get("onVerifyBarLoad").emit([opendiscord.verifybars])
    await opendiscord.events.get("afterVerifyBarsLoaded").emit([opendiscord.verifybars])

    //load permissions
    opendiscord.log("Loading permissions...","system")
    if (opendiscord.sharedFuses.getFuse("permissionsLoading")){
        await (await import("./data/framework/permissionLoader.js")).loadAllPermissions()
    }
    await opendiscord.events.get("onPermissionLoad").emit([opendiscord.permissions])
    await opendiscord.events.get("afterPermissionsLoaded").emit([opendiscord.permissions])

    //load posts
    opendiscord.log("Loading posts...","system")
    if (opendiscord.sharedFuses.getFuse("postsLoading")){
        await (await import("./data/framework/postLoader.js")).loadAllPosts()
    }
    await opendiscord.events.get("onPostLoad").emit([opendiscord.posts])
    await opendiscord.events.get("afterPostsLoaded").emit([opendiscord.posts])

    //init posts
    await opendiscord.events.get("onPostInit").emit([opendiscord.posts])
    if (opendiscord.sharedFuses.getFuse("postsInitiating")){
        if (opendiscord.client.mainServer) await opendiscord.posts.init(opendiscord.client.mainServer)
        await opendiscord.events.get("afterPostsInitiated").emit([opendiscord.posts])
    }

    //load cooldowns
    opendiscord.log("Loading cooldowns...","system")
    if (opendiscord.sharedFuses.getFuse("cooldownsLoading")){
        await (await import("./data/framework/cooldownLoader.js")).loadAllCooldowns()
    }
    await opendiscord.events.get("onCooldownLoad").emit([opendiscord.cooldowns])
    await opendiscord.events.get("afterCooldownsLoaded").emit([opendiscord.cooldowns])
    
    //init cooldowns
    await opendiscord.events.get("onCooldownInit").emit([opendiscord.cooldowns])
    if (opendiscord.sharedFuses.getFuse("cooldownsInitiating")){
        await opendiscord.cooldowns.init()
        await opendiscord.events.get("afterCooldownsInitiated").emit([opendiscord.cooldowns])
    }

    //load help menu categories
    opendiscord.log("Loading help menu...","system")
    if (opendiscord.sharedFuses.getFuse("helpMenuCategoryLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuCategories()
    }
    await opendiscord.events.get("onHelpMenuCategoryLoad").emit([opendiscord.helpmenu])
    await opendiscord.events.get("afterHelpMenuCategoriesLoaded").emit([opendiscord.helpmenu])

    //load help menu components
    if (opendiscord.sharedFuses.getFuse("helpMenuComponentLoading")){
        await (await import("./data/framework/helpMenuLoader.js")).loadAllHelpMenuComponents()
    }
    await opendiscord.events.get("onHelpMenuComponentLoad").emit([opendiscord.helpmenu])
    await opendiscord.events.get("afterHelpMenuComponentsLoaded").emit([opendiscord.helpmenu])

    //load statistic scopes
    opendiscord.log("Loading statistics...","system")
    if (opendiscord.sharedFuses.getFuse("statisticScopesLoading")){
        opendiscord.statistics.useDatabase(opendiscord.databases.get("opendiscord:stats"))
        await (await import("./data/framework/statisticLoader.js")).loadAllStatisticScopes()
    }
    await opendiscord.events.get("onStatisticScopeLoad").emit([opendiscord.statistics])
    await opendiscord.events.get("afterStatisticScopesLoaded").emit([opendiscord.statistics])

    //load statistics
    if (opendiscord.sharedFuses.getFuse("statisticLoading")){
        await (await import("./data/framework/statisticLoader.js")).loadAllStatistics()
    }
    await opendiscord.events.get("onStatisticLoad").emit([opendiscord.statistics])
    await opendiscord.events.get("afterStatisticsLoaded").emit([opendiscord.statistics])

    //init statistics
    await opendiscord.events.get("onStatisticInit").emit([opendiscord.statistics])
    if (opendiscord.sharedFuses.getFuse("statisticInitiating")){
        await opendiscord.statistics.init()
        await opendiscord.events.get("afterStatisticsInitiated").emit([opendiscord.statistics])
    }

    //plugin loading before code
    await opendiscord.events.get("onPluginBeforeTaskLoad").emit([])
    await opendiscord.events.get("afterPluginBeforeTaskLoaded").emit([])

    //load background tasks
    opendiscord.log("Loading background tasks...","system")
    if (opendiscord.sharedFuses.getFuse("taskLoading")){
        await (await import("./data/framework/taskLoader.js")).loadAllTasks()
    }
    await opendiscord.events.get("onTaskLoad").emit([opendiscord.tasks])
    await opendiscord.events.get("afterTasksLoaded").emit([opendiscord.tasks])

    //execute background tasks
    await opendiscord.events.get("onTaskExecute").emit([opendiscord.tasks])
    if (opendiscord.sharedFuses.getFuse("taskExecution")){
        await opendiscord.tasks.execute()
        await opendiscord.events.get("afterTasksExecuted").emit([opendiscord.tasks])
    }

    //finish setup
    opendiscord.log("Setup complete!","info")

    //load livestatus sources
    opendiscord.log("Loading livestatus...","system")
    if (opendiscord.sharedFuses.getFuse("liveStatusLoading")){
        await (await import("./data/framework/liveStatusLoader.js")).loadAllLiveStatusSources()
    }
    await opendiscord.events.get("onLiveStatusSourceLoad").emit([opendiscord.livestatus])
    await opendiscord.events.get("afterLiveStatusSourcesLoaded").emit([opendiscord.livestatus])

    //load startscreen
    opendiscord.log("Loading startscreen...","system")
    if (opendiscord.sharedFuses.getFuse("startScreenLoading")){
        await (await import("./data/framework/startScreenLoader.js")).loadAllStartScreenComponents()
    }
    await opendiscord.events.get("onStartScreenLoad").emit([opendiscord.startscreen])
    await opendiscord.events.get("afterStartScreensLoaded").emit([opendiscord.startscreen])

    //render startscreen
    await opendiscord.events.get("onStartScreenRender").emit([opendiscord.startscreen])
    if (opendiscord.sharedFuses.getFuse("startScreenRendering")){
        await opendiscord.startscreen.renderAllComponents()
        if (opendiscord.languages.getLanguageMetadata(false)?.automated){
            console.log("===================")
            opendiscord.log("You are using a language which has been translated using Google Translate or AI!","warning")
            opendiscord.log("Please help us improve the translation by contributing to our project!","warning")
            console.log("===================")
        }
        if (opendiscord.console.silent){
            opendiscord.console.silent = false
            opendiscord.log("Silent mode is active! Logs won't be shown in the console.","warning")
            opendiscord.console.silent = true
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