import {opendiscord, api, utilities} from "../../index"
import * as discord from "discord.js"

const lang = opendiscord.languages

export const loadAllSlashCommands = async () => {
    const commands = opendiscord.client.slashCommands
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (!generalConfig) return

    const act = discord.ApplicationCommandType
    const acot = discord.ApplicationCommandOptionType

    if (!generalConfig.data.slashCommands) return

    //create panel choices
    const panelChoices : {name:string, value:string}[] = []
    opendiscord.configs.get("opendiscord:panels").data.forEach((panel) => {
        panelChoices.push({name:panel.name, value:panel.id})
    })

    //create ticket choices
    const ticketChoices : {name:string, value:string}[] = []
    opendiscord.configs.get("opendiscord:options").data.forEach((option) => {
        if (option.type != "ticket") return
        ticketChoices.push({name:option.name, value:option.id})
    })

    const allowedCommands: string[] = []
    for (const key in generalConfig.data.system.permissions){
        if (generalConfig.data.system.permissions[key] != "none") allowedCommands.push(key)
    }

    //HELP
    if (allowedCommands.includes("help")) commands.add(new api.ODSlashCommand("opendiscord:help",{
        type:act.ChatInput,
        name:"help",
        description:lang.getTranslation("commands.help"),
        contexts:[discord.InteractionContextType.BotDM,discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
    }))

    //PANEL
    if (allowedCommands.includes("panel")) commands.add(new api.ODSlashCommand("opendiscord:panel",{
        type:act.ChatInput,
        name:"panel",
        description:lang.getTranslation("commands.panel"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"id",
                description:lang.getTranslation("commands.panelId"),
                type:acot.String,
                required:true,
                choices:panelChoices
            },
            {
                name:"auto-update",
                description:lang.getTranslation("commands.panelAutoUpdate"),
                type:acot.Boolean,
                required:false
            }
        ]
    },(current) => {
        //check if this slash command needs to be updated
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String)
        if (!idOption || idOption.choices.length != panelChoices.length) return true
        if (!panelChoices.every((panel) => {
            return (idOption.choices.find((c) => c.value == panel.value && c.name == panel.name)) ? true : false
        })) return true
        return false
    }))

    //TICKET (when enabled)
    if (allowedCommands.includes("ticket")) commands.add(new api.ODSlashCommand("opendiscord:ticket",{
        type:act.ChatInput,
        name:"ticket",
        description:lang.getTranslation("commands.ticket"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"id",
                description:lang.getTranslation("commands.ticketId"),
                type:acot.String,
                required:true,
                choices:ticketChoices
            }
        ]
    },(current) => {
        //check if this slash command needs to be updated
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String)
        if (!idOption || idOption.choices.length != ticketChoices.length) return true
        if (!ticketChoices.every((ticket) => {
            return (idOption.choices.find((c) => c.value == ticket.value && c.name == ticket.name)) ? true : false
        })) return true
        return false
    }))

    //CLOSE
    if (allowedCommands.includes("close")) commands.add(new api.ODSlashCommand("opendiscord:close",{
        type:act.ChatInput,
        name:"close",
        description:lang.getTranslation("commands.close"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //DELETE
    if (allowedCommands.includes("delete") && generalConfig.data.system.enableDeleteWithoutTranscript) commands.add(new api.ODSlashCommand("opendiscord:delete",{
        type:act.ChatInput,
        name:"delete",
        description:lang.getTranslation("commands.delete"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            },
            {
                name:"notranscript",
                description:lang.getTranslation("commands.deleteNoTranscript"),
                type:acot.Boolean,
                required:false
            }
        ]
    }))
    else if (allowedCommands.includes("delete")) commands.add(new api.ODSlashCommand("opendiscord:delete",{
        type:act.ChatInput,
        name:"delete",
        description:lang.getTranslation("commands.delete"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //REOPEN
    if (allowedCommands.includes("reopen")) commands.add(new api.ODSlashCommand("opendiscord:reopen",{
        type:act.ChatInput,
        name:"reopen",
        description:lang.getTranslation("commands.reopen"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //CLAIM
    if (allowedCommands.includes("claim")) commands.add(new api.ODSlashCommand("opendiscord:claim",{
        type:act.ChatInput,
        name:"claim",
        description:lang.getTranslation("commands.claim"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"user",
                description:lang.getTranslation("commands.claimUser"),
                type:acot.User,
                required:false
            },
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //UNCLAIM
    if (allowedCommands.includes("unclaim")) commands.add(new api.ODSlashCommand("opendiscord:unclaim",{
        type:act.ChatInput,
        name:"unclaim",
        description:lang.getTranslation("commands.unclaim"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //PIN
    if (allowedCommands.includes("pin")) commands.add(new api.ODSlashCommand("opendiscord:pin",{
        type:act.ChatInput,
        name:"pin",
        description:lang.getTranslation("commands.pin"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //UNPIN
    if (allowedCommands.includes("unpin")) commands.add(new api.ODSlashCommand("opendiscord:unpin",{
        type:act.ChatInput,
        name:"unpin",
        description:lang.getTranslation("commands.unpin"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //MOVE
    if (allowedCommands.includes("move")) commands.add(new api.ODSlashCommand("opendiscord:move",{
        type:act.ChatInput,
        name:"move",
        description:lang.getTranslation("commands.move"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"id",
                description:lang.getTranslation("commands.moveId"),
                type:acot.String,
                required:true,
                choices:ticketChoices
            },
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    },(current) => {
        //check if this slash command needs to be updated
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String)
        if (!idOption || idOption.choices.length != ticketChoices.length) return true
        if (!ticketChoices.every((ticket) => {
            return (idOption.choices.find((c) => c.value == ticket.value && c.name == ticket.name)) ? true : false
        })) return true
        return false
    }))

    //RENAME
    if (allowedCommands.includes("rename")) commands.add(new api.ODSlashCommand("opendiscord:rename",{
        type:act.ChatInput,
        name:"rename",
        description:lang.getTranslation("commands.rename"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"name",
                description:lang.getTranslation("commands.renameName"),
                type:acot.String,
                required:true,
                maxLength:100
            },
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //ADD
    if (allowedCommands.includes("add")) commands.add(new api.ODSlashCommand("opendiscord:add",{
        type:act.ChatInput,
        name:"add",
        description:lang.getTranslation("commands.add"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"user",
                description:lang.getTranslation("commands.addUser"),
                type:acot.User,
                required:true
            },
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //REMOVE
    if (allowedCommands.includes("remove")) commands.add(new api.ODSlashCommand("opendiscord:remove",{
        type:act.ChatInput,
        name:"remove",
        description:lang.getTranslation("commands.remove"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"user",
                description:lang.getTranslation("commands.removeUser"),
                type:acot.User,
                required:true
            },
            {
                name:"reason",
                description:lang.getTranslation("commands.reason"),
                type:acot.String,
                required:false
            }
        ]
    }))

    //BLACKLIST
    if (allowedCommands.includes("blacklist")) commands.add(new api.ODSlashCommand("opendiscord:blacklist",{
        type:act.ChatInput,
        name:"blacklist",
        description:lang.getTranslation("commands.blacklist"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"view",
                description:lang.getTranslation("commands.blacklistView"),
                type:acot.Subcommand
            },
            {
                name:"add",
                description:lang.getTranslation("commands.blacklistAdd"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"user",
                        description:lang.getTranslation("commands.addUser"),
                        type:acot.User,
                        required:true
                    },
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            },
            {
                name:"remove",
                description:lang.getTranslation("commands.blacklistRemove"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"user",
                        description:lang.getTranslation("commands.removeUser"),
                        type:acot.User,
                        required:true
                    },
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            },
            {
                name:"get",
                description:lang.getTranslation("commands.blacklistGet"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"user",
                        description:lang.getTranslation("commands.blacklistGetUser"),
                        type:acot.User,
                        required:true
                    }
                ]
            }
        ]
    }))

    //STATS
    if (allowedCommands.includes("stats")) commands.add(new api.ODSlashCommand("opendiscord:stats",{
        type:act.ChatInput,
        name:"stats",
        description:lang.getTranslation("commands.stats"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"reset",
                description:lang.getTranslation("commands.statsReset"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            },
            {
                name:"global",
                description:lang.getTranslation("commands.statsGlobal"),
                type:acot.Subcommand
            },
            {
                name:"user",
                description:lang.getTranslation("commands.statsUser"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"user",
                        description:lang.getTranslation("commands.statsUserUser"),
                        type:acot.User,
                        required:false
                    }
                ]
            },
            {
                name:"ticket",
                description:lang.getTranslation("commands.statsTicket"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"ticket",
                        description:lang.getTranslation("commands.statsTicketTicket"),
                        type:acot.Channel,
                        required:false
                    }
                ]
            }
        ]
    }))

    //CLEAR
    if (allowedCommands.includes("clear")) commands.add(new api.ODSlashCommand("opendiscord:clear",{
        type:act.ChatInput,
        name:"clear",
        description:lang.getTranslation("commands.clear"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"filter",
                description:lang.getTranslation("commands.clearFilter"),
                type:acot.String,
                required:false,
                choices:[
                    {name:lang.getTranslation("commands.clearFilters.all"), value:"all"},
                    {name:lang.getTranslation("commands.clearFilters.open"), value:"open"},
                    {name:lang.getTranslation("commands.clearFilters.close"), value:"closed"},
                    {name:lang.getTranslation("commands.clearFilters.claim"), value:"claimed"},
                    {name:lang.getTranslation("commands.clearFilters.unclaim"), value:"unclaimed"},
                    {name:lang.getTranslation("commands.clearFilters.pin"), value:"pinned"},
                    {name:lang.getTranslation("commands.clearFilters.unpin"), value:"unpinned"},
                    {name:lang.getTranslation("commands.clearFilters.autoclose"), value:"autoclosed"}
                ]
            }
        ]
    }))

    //AUTOCLOSE
    if (allowedCommands.includes("autoclose")) commands.add(new api.ODSlashCommand("opendiscord:autoclose",{
        type:act.ChatInput,
        name:"autoclose",
        description:lang.getTranslation("commands.autoclose"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"disable",
                description:lang.getTranslation("commands.autocloseDisable"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            },
            {
                name:"enable",
                description:lang.getTranslation("commands.autocloseEnable"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"time",
                        description:lang.getTranslation("commands.autocloseEnableTime"),
                        type:acot.Number,
                        required:true,
                        minValue:0.01
                    },
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            }
        ]
    }))

    //AUTODELETE
    if (allowedCommands.includes("autodelete")) commands.add(new api.ODSlashCommand("opendiscord:autodelete",{
        type:act.ChatInput,
        name:"autodelete",
        description:lang.getTranslation("commands.autodelete"),
        contexts:[discord.InteractionContextType.Guild],
        integrationTypes:[discord.ApplicationIntegrationType.GuildInstall],
        options:[
            {
                name:"disable",
                description:lang.getTranslation("commands.autodeleteDisable"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            },
            {
                name:"enable",
                description:lang.getTranslation("commands.autodeleteEnable"),
                type:acot.Subcommand,
                options:[
                    {
                        name:"time",
                        description:lang.getTranslation("commands.autodeleteEnableTime"),
                        type:acot.Number,
                        required:true,
                        minValue:0.01
                    },
                    {
                        name:"reason",
                        description:lang.getTranslation("commands.reason"),
                        type:acot.String,
                        required:false
                    }
                ]
            }
        ]
    }))
}

export const loadAllTextCommands = async () => {
    const commands = opendiscord.client.textCommands
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (!generalConfig) return

    if (!generalConfig.data.textCommands) return
    const prefix = generalConfig.data.prefix
    
    //create panel choices
    const panelChoices : string[] = []
    opendiscord.configs.get("opendiscord:panels").data.forEach((panel) => {
        panelChoices.push(panel.id)
    })

    //create ticket choices
    const ticketChoices : string[] = []
    opendiscord.configs.get("opendiscord:options").data.forEach((option) => {
        if (option.type != "ticket") return
        ticketChoices.push(option.id)
    })

    const allowedCommands: string[] = []
    for (const key in generalConfig.data.system.permissions){
        if (generalConfig.data.system.permissions[key] != "none") allowedCommands.push(key)
    }

    //HELP
    if (allowedCommands.includes("help")) commands.add(new api.ODTextCommand("opendiscord:help",{
        name:"help",
        prefix,
        dmPermission:true,
        guildPermission:true,
        allowBots:false
    }))

    //PANEL
    if (allowedCommands.includes("panel")) commands.add(new api.ODTextCommand("opendiscord:panel",{
        name:"panel",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"id",
                type:"string",
                required:true
            },
            {
                name:"auto-update",
                type:"boolean",
                required:false
            }
        ]
    }))

    //CLOSE
    if (allowedCommands.includes("close")) commands.add(new api.ODTextCommand("opendiscord:close",{
        name:"close",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //DELETE
    if (allowedCommands.includes("delete")) commands.add(new api.ODTextCommand("opendiscord:delete",{
        name:"delete",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //REOPEN
    if (allowedCommands.includes("reopen")) commands.add(new api.ODTextCommand("opendiscord:reopen",{
        name:"reopen",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //CLAIM
    if (allowedCommands.includes("claim")) commands.add(new api.ODTextCommand("opendiscord:claim",{
        name:"claim",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:false
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //UNCLAIM
    if (allowedCommands.includes("unclaim")) commands.add(new api.ODTextCommand("opendiscord:unclaim",{
        name:"unclaim",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //PIN
    if (allowedCommands.includes("pin")) commands.add(new api.ODTextCommand("opendiscord:pin",{
        name:"pin",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //UNPIN
    if (allowedCommands.includes("unpin")) commands.add(new api.ODTextCommand("opendiscord:unpin",{
        name:"unpin",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //MOVE
    if (allowedCommands.includes("move")) commands.add(new api.ODTextCommand("opendiscord:move",{
        name:"move",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"id",
                type:"string",
                required:true,
                choices:ticketChoices
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //RENAME
    if (allowedCommands.includes("rename")) commands.add(new api.ODTextCommand("opendiscord:rename",{
        name:"rename",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"name",
                type:"string",
                required:true,
                maxLength:100
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //ADD
    if (allowedCommands.includes("add")) commands.add(new api.ODTextCommand("opendiscord:add",{
        name:"add",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:true
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //REMOVE
    if (allowedCommands.includes("remove")) commands.add(new api.ODTextCommand("opendiscord:remove",{
        name:"remove",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:true
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //BLACKLIST
    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("opendiscord:blacklist-view",{
        name:"blacklist view",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false
    }))

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("opendiscord:blacklist-add",{
        name:"blacklist add",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:true
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("opendiscord:blacklist-remove",{
        name:"blacklist remove",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:true
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("opendiscord:blacklist-get",{
        name:"blacklist get",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:true
            }
        ]
    }))

    //STATS
    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("opendiscord:stats-global",{
        name:"stats global",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false
    }))

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("opendiscord:stats-reset",{
        name:"stats reset",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("opendiscord:stats-user",{
        name:"stats user",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"user",
                type:"user",
                required:false
            }
        ]
    }))

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("opendiscord:stats-ticket",{
        name:"stats ticket",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"ticket",
                type:"channel",
                required:false,
                channelTypes:[discord.ChannelType.GuildText]
            }
        ]
    }))

    //CLEAR
    if (allowedCommands.includes("clear")) commands.add(new api.ODTextCommand("opendiscord:clear",{
        name:"clear",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"filter",
                type:"string",
                required:false,
                allowSpaces:false,
                choices:[
                    "all",
                    "open",
                    "closed",
                    "claimed",
                    "unclaimed",
                    "pinned",
                    "unpinned",
                    "autoclosed"
                ]
            }
        ]
    }))

    //AUTOCLOSE
    if (allowedCommands.includes("autoclose")) commands.add(new api.ODTextCommand("opendiscord:autoclose-disable",{
        name:"autoclose disable",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    if (allowedCommands.includes("autoclose")) commands.add(new api.ODTextCommand("opendiscord:autoclose-enable",{
        name:"autoclose enable",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"time",
                type:"number",
                required:true,
                min:0.01,
                allowZero:false,
                allowNegative:false
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    //AUTODELETE
    if (allowedCommands.includes("autodelete")) commands.add(new api.ODTextCommand("opendiscord:autodelete-disable",{
        name:"autodelete disable",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))

    if (allowedCommands.includes("autodelete")) commands.add(new api.ODTextCommand("opendiscord:autodelete-enable",{
        name:"autodelete enable",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false,
        options:[
            {
                name:"time",
                type:"number",
                required:true,
                min:0.01,
                allowZero:false,
                allowNegative:false
            },
            {
                name:"reason",
                type:"string",
                required:false,
                allowSpaces:true
            }
        ]
    }))
}