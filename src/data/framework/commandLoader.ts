import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"

const lang = openticket.languages

export const loadAllSlashCommands = async () => {
    const commands = openticket.client.slashCommands
    const generalConfig = openticket.configs.get("openticket:general")
    if (!generalConfig) return

    const act = discord.ApplicationCommandType
    const acot = discord.ApplicationCommandOptionType

    if (!generalConfig.data.slashCommands) return

    //create panel choices
    const panelChoices : {name:string, value:string}[] = []
    openticket.configs.get("openticket:panels").data.forEach((panel) => {
        panelChoices.push({name:panel.name, value:panel.id})
    })

    //create ticket choices
    const ticketChoices : {name:string, value:string}[] = []
    openticket.configs.get("openticket:options").data.forEach((option) => {
        if (option.type != "ticket") return
        ticketChoices.push({name:option.name, value:option.id})
    })

    const allowedCommands: string[] = []
    for (const key in generalConfig.data.system.permissions){
        if (generalConfig.data.system.permissions[key] != "none") allowedCommands.push(key)
    }

    //HELP
    if (allowedCommands.includes("help")) commands.add(new api.ODSlashCommand("openticket:help",{
        type:act.ChatInput,
        name:"help",
        description:lang.getTranslation("commands.help"),
        dmPermission:true
    }))

    //PANEL
    if (allowedCommands.includes("panel")) commands.add(new api.ODSlashCommand("openticket:panel",{
        type:act.ChatInput,
        name:"panel",
        description:lang.getTranslation("commands.panel"),
        dmPermission:false,
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
        if (!current.options) return true
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String) as discord.ApplicationCommandStringOptionData|undefined
        if (!idOption || !idOption.choices || idOption.choices.length != panelChoices.length) return true
        else if (!panelChoices.every((panel) => {
            if (!idOption.choices) return false
            else if (!idOption.choices.find((choice) => choice.value == panel.value && choice.name == panel.name)) return false
            else return true
        })) return true
        else return false
    }))

    //TICKET (when enabled)
    if (allowedCommands.includes("ticket")) commands.add(new api.ODSlashCommand("openticket:ticket",{
        type:act.ChatInput,
        name:"ticket",
        description:lang.getTranslation("commands.ticket"),
        dmPermission:false,
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
        if (!current.options) return true
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String) as discord.ApplicationCommandStringOptionData|undefined
        if (!idOption || !idOption.choices || idOption.choices.length != ticketChoices.length) return true
        else if (!ticketChoices.every((ticket) => {
            if (!idOption.choices) return false
            else if (!idOption.choices.find((choice) => choice.value == ticket.value && choice.name == ticket.name)) return false
            else return true
        })) return true
        else return false
    }))

    //CLOSE
    if (allowedCommands.includes("close")) commands.add(new api.ODSlashCommand("openticket:close",{
        type:act.ChatInput,
        name:"close",
        description:lang.getTranslation("commands.close"),
        dmPermission:false,
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
    if (allowedCommands.includes("delete") && generalConfig.data.system.enableDeleteWithoutTranscript) commands.add(new api.ODSlashCommand("openticket:delete",{
        type:act.ChatInput,
        name:"delete",
        description:lang.getTranslation("commands.delete"),
        dmPermission:false,
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
    else if (allowedCommands.includes("delete")) commands.add(new api.ODSlashCommand("openticket:delete",{
        type:act.ChatInput,
        name:"delete",
        description:lang.getTranslation("commands.delete"),
        dmPermission:false,
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
    if (allowedCommands.includes("reopen")) commands.add(new api.ODSlashCommand("openticket:reopen",{
        type:act.ChatInput,
        name:"reopen",
        description:lang.getTranslation("commands.reopen"),
        dmPermission:false,
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
    if (allowedCommands.includes("claim")) commands.add(new api.ODSlashCommand("openticket:claim",{
        type:act.ChatInput,
        name:"claim",
        description:lang.getTranslation("commands.claim"),
        dmPermission:false,
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
    if (allowedCommands.includes("unclaim")) commands.add(new api.ODSlashCommand("openticket:unclaim",{
        type:act.ChatInput,
        name:"unclaim",
        description:lang.getTranslation("commands.unclaim"),
        dmPermission:false,
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
    if (allowedCommands.includes("pin")) commands.add(new api.ODSlashCommand("openticket:pin",{
        type:act.ChatInput,
        name:"pin",
        description:lang.getTranslation("commands.pin"),
        dmPermission:false,
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
    if (allowedCommands.includes("unpin")) commands.add(new api.ODSlashCommand("openticket:unpin",{
        type:act.ChatInput,
        name:"unpin",
        description:lang.getTranslation("commands.unpin"),
        dmPermission:false,
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
    if (allowedCommands.includes("move")) commands.add(new api.ODSlashCommand("openticket:move",{
        type:act.ChatInput,
        name:"move",
        description:lang.getTranslation("commands.move"),
        dmPermission:false,
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
        if (!current.options) return true
        const idOption = current.options.find((opt) => opt.name == "id" && opt.type == acot.String) as discord.ApplicationCommandStringOptionData|undefined
        if (!idOption || !idOption.choices || idOption.choices.length != ticketChoices.length) return true
        else if (!ticketChoices.every((ticket) => {
            if (!idOption.choices) return false
            else if (!idOption.choices.find((choice) => choice.value == ticket.value && choice.name == ticket.name)) return false
            else return true
        })) return true
        else return false
    }))

    //RENAME
    if (allowedCommands.includes("rename")) commands.add(new api.ODSlashCommand("openticket:rename",{
        type:act.ChatInput,
        name:"rename",
        description:lang.getTranslation("commands.rename"),
        dmPermission:false,
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
    if (allowedCommands.includes("add")) commands.add(new api.ODSlashCommand("openticket:add",{
        type:act.ChatInput,
        name:"add",
        description:lang.getTranslation("commands.add"),
        dmPermission:false,
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
    if (allowedCommands.includes("remove")) commands.add(new api.ODSlashCommand("openticket:remove",{
        type:act.ChatInput,
        name:"remove",
        description:lang.getTranslation("commands.remove"),
        dmPermission:false,
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
    if (allowedCommands.includes("blacklist")) commands.add(new api.ODSlashCommand("openticket:blacklist",{
        type:act.ChatInput,
        name:"blacklist",
        description:lang.getTranslation("commands.blacklist"),
        dmPermission:false,
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
    if (allowedCommands.includes("stats")) commands.add(new api.ODSlashCommand("openticket:stats",{
        type:act.ChatInput,
        name:"stats",
        description:lang.getTranslation("commands.stats"),
        dmPermission:false,
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
    if (allowedCommands.includes("clear")) commands.add(new api.ODSlashCommand("openticket:clear",{
        type:act.ChatInput,
        name:"clear",
        description:lang.getTranslation("commands.clear"),
        dmPermission:false,
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
    if (allowedCommands.includes("autoclose")) commands.add(new api.ODSlashCommand("openticket:autoclose",{
        type:act.ChatInput,
        name:"autoclose",
        description:lang.getTranslation("commands.autoclose"),
        dmPermission:false,
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
    if (allowedCommands.includes("autodelete")) commands.add(new api.ODSlashCommand("openticket:autodelete",{
        type:act.ChatInput,
        name:"autodelete",
        description:lang.getTranslation("commands.autodelete"),
        dmPermission:false,
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
    const commands = openticket.client.textCommands
    const generalConfig = openticket.configs.get("openticket:general")
    if (!generalConfig) return

    if (!generalConfig.data.textCommands) return
    const prefix = generalConfig.data.prefix
    
    //create panel choices
    const panelChoices : string[] = []
    openticket.configs.get("openticket:panels").data.forEach((panel) => {
        panelChoices.push(panel.id)
    })

    //create ticket choices
    const ticketChoices : string[] = []
    openticket.configs.get("openticket:options").data.forEach((option) => {
        if (option.type != "ticket") return
        ticketChoices.push(option.id)
    })

    const allowedCommands: string[] = []
    for (const key in generalConfig.data.system.permissions){
        if (generalConfig.data.system.permissions[key] != "none") allowedCommands.push(key)
    }

    //HELP
    if (allowedCommands.includes("help")) commands.add(new api.ODTextCommand("openticket:help",{
        name:"help",
        prefix,
        dmPermission:true,
        guildPermission:true,
        allowBots:false
    }))

    //PANEL
    if (allowedCommands.includes("panel")) commands.add(new api.ODTextCommand("openticket:panel",{
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
    if (allowedCommands.includes("close")) commands.add(new api.ODTextCommand("openticket:close",{
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
    if (allowedCommands.includes("delete")) commands.add(new api.ODTextCommand("openticket:delete",{
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
    if (allowedCommands.includes("reopen")) commands.add(new api.ODTextCommand("openticket:reopen",{
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
    if (allowedCommands.includes("claim")) commands.add(new api.ODTextCommand("openticket:claim",{
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
    if (allowedCommands.includes("unclaim")) commands.add(new api.ODTextCommand("openticket:unclaim",{
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
    if (allowedCommands.includes("pin")) commands.add(new api.ODTextCommand("openticket:pin",{
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
    if (allowedCommands.includes("unpin")) commands.add(new api.ODTextCommand("openticket:unpin",{
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
    if (allowedCommands.includes("move")) commands.add(new api.ODTextCommand("openticket:move",{
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
    if (allowedCommands.includes("rename")) commands.add(new api.ODTextCommand("openticket:rename",{
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
    if (allowedCommands.includes("add")) commands.add(new api.ODTextCommand("openticket:add",{
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
    if (allowedCommands.includes("remove")) commands.add(new api.ODTextCommand("openticket:remove",{
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
    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("openticket:blacklist-view",{
        name:"blacklist view",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false
    }))

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("openticket:blacklist-add",{
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

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("openticket:blacklist-remove",{
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

    if (allowedCommands.includes("blacklist")) commands.add(new api.ODTextCommand("openticket:blacklist-get",{
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
    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("openticket:stats-global",{
        name:"stats global",
        prefix,
        dmPermission:false,
        guildPermission:true,
        allowBots:false
    }))

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("openticket:stats-reset",{
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

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("openticket:stats-user",{
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

    if (allowedCommands.includes("stats")) commands.add(new api.ODTextCommand("openticket:stats-ticket",{
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
    if (allowedCommands.includes("clear")) commands.add(new api.ODTextCommand("openticket:clear",{
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
    if (allowedCommands.includes("autoclose")) commands.add(new api.ODTextCommand("openticket:autoclose-disable",{
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

    if (allowedCommands.includes("autoclose")) commands.add(new api.ODTextCommand("openticket:autoclose-enable",{
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
    if (allowedCommands.includes("autodelete")) commands.add(new api.ODTextCommand("openticket:autodelete-disable",{
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

    if (allowedCommands.includes("autodelete")) commands.add(new api.ODTextCommand("openticket:autodelete-enable",{
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