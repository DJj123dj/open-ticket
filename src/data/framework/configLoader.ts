import { opendiscord, api, utilities } from "../../index.js"
import * as fjs from "formatted-json-stringify"

export async function loadAllConfigs() {
    const devconfigFlag = opendiscord.flags.get("opendiscord:dev-config")
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false

    opendiscord.configs.add(new api.ODJsonCommentsConfig("opendiscord:general", "general.jsonc", (isDevconfig) ? "./devconfig/" : "./config/", defaultGeneralFormatter))
    opendiscord.configs.add(new api.ODJsonCommentsConfig("opendiscord:questions", "questions.jsonc", (isDevconfig) ? "./devconfig/" : "./config/", defaultQuestionsFormatter))
    opendiscord.configs.add(new api.ODJsonCommentsConfig("opendiscord:options", "options.jsonc", (isDevconfig) ? "./devconfig/" : "./config/", defaultOptionsFormatter))
    opendiscord.configs.add(new api.ODJsonCommentsConfig("opendiscord:panels", "panels.jsonc", (isDevconfig) ? "./devconfig/" : "./config/", defaultPanelsFormatter))
    opendiscord.configs.add(new api.ODJsonCommentsConfig("opendiscord:transcripts", "transcripts.jsonc", (isDevconfig) ? "./devconfig/" : "./config/", defaultTranscriptsFormatter))
}

//FORMATTERS
export const defaultGeneralFormatter = new fjs.TopLevelCommentFormatter(new fjs.MultiCommentFormatter([
    "Hi there! Thank you for installing Open Ticket.",
    "----------------------------------------------",
    "If you need any assistance with configuring the bot,",
    "feel free to use the documentation or join our Discord server:",
    "https://otdocs.dj-dj.be",
    "https://discord.dj-dj.be",
    "----------------------------------------------",
    "SETUP:",
    "1. Install the required dependencies using the command: \"npm install\"",
    "2. Configure the bot in one of the following ways:",
    "     a. (easy) Using the Quick Setup CLI Tool",
    "     b. (difficult) Using the JSON files in `./config/`",
    "",
    "Start the Quick Setup CLI Tool using the command: \"npm run setup\"",
    "After configuration, start the bot using the command: \"npm start\"",
    "",
    "Good luck! DJj123dj & contributors"
].join("\n")), new fjs.ObjectFormatter(null, true, [
    new fjs.PropertyFormatter("_CONFIG_VERSION"),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("Load the bot token from .env or the \"token\" field below. Leave \"token\" empty if using \"tokenFromENV\"."),
    new fjs.PropertyFormatter("token"),
    new fjs.PropertyFormatter("tokenFromENV"),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("mainColor", new fjs.SingleCommentFormatter("Hex color used in most embeds")),
    new fjs.PropertyFormatter("language", new fjs.SingleCommentFormatter("Visit README.md for list")),
    new fjs.PropertyFormatter("prefix", new fjs.SingleCommentFormatter("Prefix used in text commands")),
    new fjs.PropertyFormatter("serverId"),
    new fjs.ArrayFormatter("globalAdmins", false, new fjs.PropertyFormatter(null), undefined, undefined, new fjs.SingleCommentFormatter("Have access to all commands")),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("Enable/disable text or slash commands."),
    new fjs.PropertyFormatter("slashCommands"),
    new fjs.PropertyFormatter("textCommands"),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("Configure the status of the bot."),
    new fjs.ObjectFormatter("status", true, [
        new fjs.PropertyFormatter("enabled"),
        new fjs.PropertyFormatter("type", new fjs.SingleCommentFormatter("Choices: listening, watching, playing, custom")),
        new fjs.PropertyFormatter("mode", new fjs.SingleCommentFormatter("Choices: online, invisible, idle, dnd")),
        new fjs.PropertyFormatter("text"),
        new fjs.PropertyFormatter("state", new fjs.SingleCommentFormatter("Additional text (Leave empty to disable)"))
    ]),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("Send ticket logs to a channel or in DM of the ticket creator."),
    new fjs.ObjectFormatter("logs", true, [
        new fjs.PropertyFormatter("enabled"),
        new fjs.PropertyFormatter("channel"),
        new fjs.ObjectFormatter("logMessages", true, [
            new fjs.DefaultFormatter("creation", false),
            new fjs.DefaultFormatter("closing", false),
            new fjs.DefaultFormatter("deleting", false),
            new fjs.DefaultFormatter("reopening", false),
            new fjs.DefaultFormatter("claiming", false),
            new fjs.DefaultFormatter("pinning", false),
            new fjs.DefaultFormatter("adding", false),
            new fjs.DefaultFormatter("removing", false),
            new fjs.DefaultFormatter("renaming", false),
            new fjs.DefaultFormatter("moving", false),
            new fjs.DefaultFormatter("blacklisting", false),
            new fjs.DefaultFormatter("transferring", false),
            new fjs.DefaultFormatter("topicChange", false),
            new fjs.DefaultFormatter("priorityChange", false),
            new fjs.DefaultFormatter("reactionRole", false)
        ])
    ]),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("A large collection of settings for the ticket system."),
    new fjs.ObjectFormatter("ticketSystem", true, [
        new fjs.PropertyFormatter("preferSlashOverText", new fjs.SingleCommentFormatter("Show slashcmds in help menu's")),
        new fjs.PropertyFormatter("sendErrorOnUnknownCommand", new fjs.SingleCommentFormatter("Send error when command not found")),
        new fjs.PropertyFormatter("questionFieldsInCodeBlock", new fjs.SingleCommentFormatter("Put question answers in code blocks")),
        new fjs.PropertyFormatter("displayFieldsWithQuestions", new fjs.SingleCommentFormatter("Display embed fields together with question answers")),
        new fjs.PropertyFormatter("showGlobalAdminsInPanelRoles", new fjs.SingleCommentFormatter("Include \"globalAdmins\" in panel admin lists")),
        new fjs.PropertyFormatter("disableVerifyBars", new fjs.SingleCommentFormatter("Disable the (❌/✅) buttons")),
        new fjs.PropertyFormatter("useRedErrorEmbeds", new fjs.SingleCommentFormatter("Make errors embeds always red")),
        new fjs.PropertyFormatter("alwaysShowReason", new fjs.SingleCommentFormatter("Show reason even if none is provided")),
        new fjs.PropertyFormatter("emojiStyle", new fjs.SingleCommentFormatter("The style of emoji's in embeds. Choices: before, after, double, disabled")),
        new fjs.PropertyFormatter("pinEmoji", new fjs.SingleCommentFormatter("Channel emoji of pinned tickets (Leave empty to disable)")),
        new fjs.PropertyFormatter("closeEmoji", new fjs.SingleCommentFormatter("Channel emoji of closed tickets (Leave empty to disable)")),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("replyOnTicketCreation", new fjs.SingleCommentFormatter("Reply with a msg when a ticket is created")),
        new fjs.PropertyFormatter("replyOnReactionRole", new fjs.SingleCommentFormatter("Reply with a msg when a reaction role is used")),
        new fjs.PropertyFormatter("askPriorityOnTicketCreation", new fjs.SingleCommentFormatter("Show a dropdown to select priority")),
        new fjs.PropertyFormatter("removeParticipantsOnClose", new fjs.SingleCommentFormatter("Remove non-admins when ticket is closed")),
        new fjs.PropertyFormatter("disableAutocloseAfterReopen", new fjs.SingleCommentFormatter("Disable autoclose after ticket got reopened")),
        new fjs.PropertyFormatter("autodeleteRequiresClosedTicket", new fjs.SingleCommentFormatter("A ticket must be closed before autodelete works")),
        new fjs.PropertyFormatter("adminOnlyDeleteWithoutTranscript", new fjs.SingleCommentFormatter("Only allow \"globalAdmins\" to delete a ticket without transcript")),
        new fjs.PropertyFormatter("allowCloseBeforeMessage", new fjs.SingleCommentFormatter("Allow closing before a message is sent")),
        new fjs.PropertyFormatter("allowCloseBeforeAdminMessage", new fjs.SingleCommentFormatter("Allow closing before an admin has sent a message")),
        new fjs.PropertyFormatter("useTranslatedConfigChecker", new fjs.SingleCommentFormatter("Translate config errors in the console")),
        new fjs.PropertyFormatter("pinFirstTicketMessage", new fjs.SingleCommentFormatter("Pin the ticket message to the channel")),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Enable/disable certain buttons & features of the bot."),
        new fjs.PropertyFormatter("enableTicketClaimButtons"),
        new fjs.PropertyFormatter("enableTicketCloseButtons"),
        new fjs.PropertyFormatter("enableTicketPinButtons"),
        new fjs.PropertyFormatter("enableTicketDeleteButtons"),
        new fjs.PropertyFormatter("enableTicketActionWithReason"),
        new fjs.PropertyFormatter("enableDeleteWithoutTranscript", new fjs.SingleCommentFormatter("Allow deleting tickets without transcript")),
        new fjs.PropertyFormatter("enableCreateTicketForOtherUser", new fjs.SingleCommentFormatter("Allow creating tickets for other users")),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Set the maximum amount of simultaneous tickets."),
        new fjs.ObjectFormatter("limits", true, [
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("globalMaximum"),
            new fjs.PropertyFormatter("userMaximum")
        ]),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Choose which data is shown in the channel topic."),
        new fjs.ObjectFormatter("channelTopic", true, [
            new fjs.PropertyFormatter("showOptionName"),
            new fjs.PropertyFormatter("showOptionDescription"),
            new fjs.PropertyFormatter("showOptionTopic"),
            new fjs.PropertyFormatter("showPriority"),
            new fjs.PropertyFormatter("showClosed"),
            new fjs.PropertyFormatter("showClaimed"),
            new fjs.PropertyFormatter("showPinned"),
            new fjs.PropertyFormatter("showCreator"),
            new fjs.PropertyFormatter("showParticipants")
        ]),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Move closed tickets to a separate category."),
        new fjs.ObjectFormatter("closedCategory", true, [
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("categoryId")
        ]),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Create tickets in a backup category when the original category exceeds 50 channels."),
        new fjs.ObjectFormatter("backupCategory", true, [
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("categoryId")
        ]),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Move claimed tickets to a matching category of the user that claimed the ticket. Set to empty list [] to disable."),
        new fjs.ArrayFormatter("claimedCategories", true, new fjs.ObjectFormatter(null, false, [
            new fjs.PropertyFormatter("user"),
            new fjs.PropertyFormatter("category")
        ]))
    ]),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter([
        "Set permissions for each individual command, button or action.",
        "CHOICES:",
        ">> \"none\"            -> Command disabled",
        ">> \"everyone\"        -> Allowed for everyone",
        ">> \"admin\"           -> Global & ticket admins only",
        ">> \"DISCORD_ROLE_ID\" -> Custom role only"
    ].join("\n")),
    new fjs.ObjectFormatter("permissions", true, [
        new fjs.PropertyFormatter("help"),
        new fjs.PropertyFormatter("panel"),
        new fjs.PropertyFormatter("ticket"),
        new fjs.PropertyFormatter("close"),
        new fjs.PropertyFormatter("delete"),
        new fjs.PropertyFormatter("reopen"),
        new fjs.PropertyFormatter("claim"),
        new fjs.PropertyFormatter("unclaim"),
        new fjs.PropertyFormatter("pin"),
        new fjs.PropertyFormatter("unpin"),
        new fjs.PropertyFormatter("move"),
        new fjs.PropertyFormatter("rename"),
        new fjs.PropertyFormatter("add"),
        new fjs.PropertyFormatter("remove"),
        new fjs.PropertyFormatter("blacklist"),
        new fjs.PropertyFormatter("stats"),
        new fjs.PropertyFormatter("clear"),
        new fjs.PropertyFormatter("autoclose"),
        new fjs.PropertyFormatter("autodelete"),
        new fjs.PropertyFormatter("transfer"),
        new fjs.PropertyFormatter("topic"),
        new fjs.PropertyFormatter("priority"),
        new fjs.PropertyFormatter("transcripts")
    ])
]))

export const defaultQuestionsFormatter = new fjs.TopLevelCommentFormatter(new fjs.MultiCommentFormatter([
    "OPEN TICKET MODAL QUESTIONS",
    "----------------------------------------------",
    "Create customizable modal questions that will be shown before creating a ticket.",
    "Each ticket option (config/options.jsonc) can contain a maximum of 5 questions.",
    "There are 6 types of questions available: short, paragraph, dropdown, radio-select, checkbox-select, text-display",
    "",
    "TIP: Create new questions by copying everything between and including the {...} brackets of a question. Paste it after the last question and make sure that they are seperated by a comma."
].join("\n")), new fjs.ArrayFormatter(null, true, new fjs.ObjectSwitchFormatter(null, [
    {key:"type", value:"short", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A short text input modal question."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("placeholder"),
        new fjs.ObjectFormatter("length", true, [
            new fjs.MultiCommentFormatter("Configure length limits for the answer."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max")
        ])
    ])},
    {key:"type", value:"paragraph", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A paragraph text input modal question."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("placeholder"),
        new fjs.ObjectFormatter("length", true, [
            new fjs.MultiCommentFormatter("Configure length limits for the answer."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max")
        ])
    ])},
    {key:"type", value:"text-display", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("Show text in a modal to provide extra details or explain questions."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("textContents")
    ])},
    {key:"type", value:"dropdown", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A dropdown menu input modal question with up to 25 choices. \"emoji\" & \"description\" fields are optional."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("placeholder"),
        new fjs.ArrayFormatter("choices", true, new fjs.ObjectFormatter(null, false, [
            new fjs.PropertyFormatter("title"),
            new fjs.PropertyFormatter("description"),
            new fjs.PropertyFormatter("emoji")
        ]))
    ])},
    {key:"type", value:"radio-select", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A radio select input modal question with up to 10 choices."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.ArrayFormatter("choices", true, new fjs.ObjectFormatter(null, false, [
            new fjs.PropertyFormatter("title"),
            new fjs.PropertyFormatter("description"),
            new fjs.PropertyFormatter("selectedByDefault")
        ]))
    ])},
    {key:"type", value:"checkbox-select", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A checkbox select input modal question with up to 10 choices."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("limits", true, [
            new fjs.MultiCommentFormatter("Configure checkbox amount limits for the answer."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max")
        ]),
        new fjs.ArrayFormatter("choices", true, new fjs.ObjectFormatter(null, false, [
            new fjs.PropertyFormatter("title"),
            new fjs.PropertyFormatter("description"),
            new fjs.PropertyFormatter("selectedByDefault")
        ]))
    ])},
    {key:"type", value:"file-upload", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A file upload modal question where users can upload one or more files."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("required"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("limits", true, [
            new fjs.MultiCommentFormatter("Configure minimum/maximum amount of files to upload."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("min"),
            new fjs.PropertyFormatter("max")
        ])
    ])}
])))


export const defaultOptionsFormatter = new fjs.TopLevelCommentFormatter(new fjs.MultiCommentFormatter([
    "OPEN TICKET BUTTON OPTIONS",
    "----------------------------------------------",
    "Create customizable ticket, website, reaction-role or sub-panel button options.",
    "Up to 25 options can be added to each panel in (config/panels.jsonc)",
    "There are 4 types of options available: ticket, website, role, sub-panel",
    "",
    "TIP: Create new options by copying everything between and including the {...} brackets of an option. Paste it after the last option and make sure that they are seperated by a comma."
].join("\n")), new fjs.ArrayFormatter(null, true, new fjs.ObjectSwitchFormatter(null, [
    {key:"type", value:"ticket", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A ticket option creates a button to open a ticket."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button", true, [
            new fjs.MultiCommentFormatter("Configure the button style of this option. At least one of \"emoji\" or \"label\" must be provided."),
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
            new fjs.PropertyFormatter("color", new fjs.SingleCommentFormatter("Choices: gray, red, green, blue"))
        ]),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Add up to 5 modal questions IDs from (config/questions.jsonc)."),
        new fjs.ArrayFormatter("questions", false, new fjs.PropertyFormatter(null)),
        new fjs.TextFormatter(""),
        new fjs.ArrayFormatter("ticketAdmins", false, new fjs.PropertyFormatter(null)),
        new fjs.ArrayFormatter("readonlyAdmins", false, new fjs.PropertyFormatter(null)),
        new fjs.PropertyFormatter("allowCreationByBlacklistedUsers"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("channel", true, [
            new fjs.MultiCommentFormatter("Configure the name, topic and category of the ticket option."),
            new fjs.PropertyFormatter("prefix"),
            new fjs.PropertyFormatter("suffix", new fjs.SingleCommentFormatter("Choices: user-name, user-id, random-number, random-hex, counter-dynamic, counter-fixed")),
            new fjs.PropertyFormatter("category", new fjs.SingleCommentFormatter("Leave empty to disable")),
            new fjs.PropertyFormatter("topic", new fjs.SingleCommentFormatter("Leave empty to disable"))
        ]),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("dmMessage", true, [
            new fjs.MultiCommentFormatter("Send a customisable message in DM when creating a ticket."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("text", new fjs.SingleCommentFormatter("Leave empty to disable")),
            new fjs.ObjectFormatter("embed", true, [
                new fjs.PropertyFormatter("enabled"),
                new fjs.PropertyFormatter("title", new fjs.SingleCommentFormatter("Leave empty to disable")),
                new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
                new fjs.PropertyFormatter("customColor", new fjs.SingleCommentFormatter("Leave empty to use default color")),
                new fjs.TextFormatter(""),
                new fjs.PropertyFormatter("image", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
                new fjs.PropertyFormatter("thumbnail", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
                new fjs.MultiCommentFormatter("Embed fields. Set to empty list [] to disable."),
                new fjs.ArrayFormatter("fields", true, new fjs.ObjectFormatter(null, false, [
                    new fjs.PropertyFormatter("name"),
                    new fjs.PropertyFormatter("value"),
                    new fjs.PropertyFormatter("inline")
                ])),
                new fjs.PropertyFormatter("timestamp")
            ])
        ]),
        new fjs.ObjectFormatter("ticketMessage", true, [
            new fjs.MultiCommentFormatter("Send a customisable message in the ticket with close, claim, delete, ... buttons."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("text", new fjs.SingleCommentFormatter("Leave empty to disable")),
            new fjs.ObjectFormatter("embed", true, [
                new fjs.PropertyFormatter("enabled"),
                new fjs.PropertyFormatter("title", new fjs.SingleCommentFormatter("Leave empty to disable")),
                new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
                new fjs.PropertyFormatter("customColor", new fjs.SingleCommentFormatter("Leave empty to use default color")),
                new fjs.TextFormatter(""),
                new fjs.PropertyFormatter("image", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
                new fjs.PropertyFormatter("thumbnail", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
                new fjs.MultiCommentFormatter("Embed fields. Set to empty list [] to disable."),
                new fjs.ArrayFormatter("fields", true, new fjs.ObjectFormatter(null, false, [
                    new fjs.PropertyFormatter("name"),
                    new fjs.PropertyFormatter("value"),
                    new fjs.PropertyFormatter("inline")
                ])),
                new fjs.PropertyFormatter("timestamp")
            ]),
            new fjs.ObjectFormatter("ping", true, [
                new fjs.MultiCommentFormatter("Customise the user & role mentions of this ticket message."),
                new fjs.PropertyFormatter("@here"),
                new fjs.PropertyFormatter("@everyone"),
                new fjs.ArrayFormatter("custom", false, new fjs.PropertyFormatter(null))
            ])
        ]),
        new fjs.ObjectFormatter("autoclose", true, [
            new fjs.MultiCommentFormatter("Autoclose this ticket after a period of inactivity or when the creator leaves the server."),
            new fjs.PropertyFormatter("enableInactiveHours"),
            new fjs.PropertyFormatter("inactiveHours"),
            new fjs.PropertyFormatter("enableUserLeave"),
            new fjs.PropertyFormatter("disableOnClaim")
        ]),
        new fjs.ObjectFormatter("autodelete", true, [
            new fjs.MultiCommentFormatter("Autodelete this ticket after a period of inactivity or when the creator leaves the server."),
            new fjs.PropertyFormatter("enableInactiveDays"),
            new fjs.PropertyFormatter("inactiveDays"),
            new fjs.PropertyFormatter("enableUserLeave"),
            new fjs.PropertyFormatter("disableOnClaim")
        ]),
        new fjs.ObjectFormatter("cooldown", true, [
            new fjs.MultiCommentFormatter("Users must wait a certain period before being able to create another ticket of this type."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("cooldownMinutes")
        ]),
        new fjs.ObjectFormatter("limits", true, [
            new fjs.MultiCommentFormatter("Set the maximum amount of simultaneous tickets of this option."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("globalMaximum"),
            new fjs.PropertyFormatter("userMaximum")
        ]),
        new fjs.ObjectFormatter("slowMode", true, [
            new fjs.MultiCommentFormatter("Enable slow-mode in the ticket channel."),
            new fjs.PropertyFormatter("enabled"),
            new fjs.PropertyFormatter("slowModeSeconds")
        ])
    ])},
    {key:"type", value:"website", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A website option creates a button with a URL to an external website."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button", true, [
            new fjs.MultiCommentFormatter("Configure the button style of this option. At least one of \"emoji\" or \"label\" must be provided."),
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label")
        ]),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("url")
    ])},
    {key:"type", value:"role", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A reaction-role option creates a button for members to choose roles."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button", true, [
            new fjs.MultiCommentFormatter("Configure the button style of this option. At least one of \"emoji\" or \"label\" must be provided."),
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
            new fjs.PropertyFormatter("color", new fjs.SingleCommentFormatter("Choices: gray, red, green, blue"))
        ]),
        new fjs.TextFormatter(""),
        new fjs.ArrayFormatter("roles", false, new fjs.PropertyFormatter(null)),
        new fjs.PropertyFormatter("mode", new fjs.SingleCommentFormatter("What to do with the roles. Choices: add&remove, add, remove")),
        new fjs.ArrayFormatter("removeRolesOnAdd", false, new fjs.PropertyFormatter(null), undefined, undefined, new fjs.SingleCommentFormatter("Remove these old roles when new roles are added.")),
        new fjs.PropertyFormatter("addOnMemberJoin", new fjs.SingleCommentFormatter("Add these roles automatically when joining the server."))
    ])},
    {key:"type", value:"sub-panel", formatter:new fjs.ObjectFormatter(null, true, [
        new fjs.MultiCommentFormatter("A sub-panel option creates a button which sends another panel for additional options."),
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("name"),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("type"),
        new fjs.TextFormatter(""),
        new fjs.ObjectFormatter("button", true, [
            new fjs.MultiCommentFormatter("Configure the button style of this option. At least one of \"emoji\" or \"label\" must be provided."),
            new fjs.PropertyFormatter("emoji"),
            new fjs.PropertyFormatter("label"),
            new fjs.PropertyFormatter("color", new fjs.SingleCommentFormatter("Choices: gray, red, green, blue"))
        ]),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("subPanelId", new fjs.SingleCommentFormatter("Choose a panel ID from (config/panels.jsonc)"))
    ])}
])))

export const defaultPanelsFormatter = new fjs.TopLevelCommentFormatter(new fjs.MultiCommentFormatter([
    "OPEN TICKET PANELS",
    "----------------------------------------------",
    "Create customizable panel messages with buttons or a dropdown.",
    "Add up to 25 options to this panel from (config/options.jsonc)",
    "Panels can be customised with text, images, colors and more.",
    "",
    "Spawn the panel in Discord using: /panel <id>",
    "",
    "TIP: Create new panels by copying everything between and including the {...} brackets of an panel. Paste it after the last panel and make sure that they are seperated by a comma."
].join("\n")), new fjs.ArrayFormatter(null, true, new fjs.ObjectFormatter(null, true, [
    new fjs.MultiCommentFormatter("A panel is creates a message with up to 25 options as buttons or dropdown."),
    new fjs.PropertyFormatter("id"),
    new fjs.PropertyFormatter("name"),
    new fjs.PropertyFormatter("dropdown"),
    new fjs.TextFormatter(""),
    new fjs.MultiCommentFormatter("Add up to 5 option IDs from (config/options.jsonc)."),
    new fjs.ArrayFormatter("options", false, new fjs.PropertyFormatter(null)),
    new fjs.TextFormatter(""),
    new fjs.PropertyFormatter("text", new fjs.SingleCommentFormatter("Leave empty to disable")),
    new fjs.ObjectFormatter("embed", true, [
        new fjs.PropertyFormatter("enabled"),
        new fjs.PropertyFormatter("title", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.PropertyFormatter("description", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("customColor", new fjs.SingleCommentFormatter("Leave empty to use default color")),
        new fjs.PropertyFormatter("url", new fjs.SingleCommentFormatter("URL. Leave empty to disable")),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("image", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
        new fjs.PropertyFormatter("thumbnail", new fjs.SingleCommentFormatter("Image URL. Leave empty to disable")),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("footer", new fjs.SingleCommentFormatter("Leave empty to disable")),
        new fjs.MultiCommentFormatter("Embed fields. Set to empty list [] to disable."),
        new fjs.ArrayFormatter("fields", true, new fjs.ObjectFormatter(null, false, [
            new fjs.PropertyFormatter("name"),
            new fjs.PropertyFormatter("value"),
            new fjs.PropertyFormatter("inline")
        ])),
        new fjs.PropertyFormatter("timestamp")
    ]),
    new fjs.ObjectFormatter("settings", true, [
        new fjs.PropertyFormatter("dropdownPlaceholder", new fjs.SingleCommentFormatter("Leave empty to use default.")),
        new fjs.PropertyFormatter("maximumButtonsPerRow"),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Display the maximum amount of tickets per user."),
        new fjs.PropertyFormatter("enableMaxTicketsWarningInText"),
        new fjs.PropertyFormatter("enableMaxTicketsWarningInEmbed"),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Automatically generate option descriptions from (config/options.jsonc)."),
        new fjs.PropertyFormatter("describeOptionsLayout", new fjs.SingleCommentFormatter("Choices: simple, normal, detailed")),
        new fjs.PropertyFormatter("describeOptionsCustomTitle"),
        new fjs.PropertyFormatter("describeOptionsInText"),
        new fjs.PropertyFormatter("describeOptionsInEmbedFields"),
        new fjs.PropertyFormatter("describeOptionsInEmbedDescription")
    ])
])))

export const defaultTranscriptsFormatter = new fjs.TopLevelCommentFormatter(new fjs.MultiCommentFormatter([
    "OPEN TICKET TRANSCRIPTS",
    "----------------------------------------------",
    "Enable transcript creation when tickets are deleted. There are 2 available transcript types: HTML & Text",
    "",
    "HTML Transcripts (recommended):",
    "Generate transcripts as HTML files to view in the browser. No server or domain required. HTML Transcripts use an external service to process and host the transcripts.",
    "",
    "Text Transcripts:",
    "Generate transcripts as simple .txt files with limited details. Processing happens fully local."
].join("\n")), new fjs.ObjectFormatter(null, true, [
    new fjs.ObjectFormatter("general", true, [
        new fjs.PropertyFormatter("enabled"),
        new fjs.TextFormatter(""),
        new fjs.MultiCommentFormatter("Choose which users and channel get the generated transcript."),
        new fjs.PropertyFormatter("enableChannel"),
        new fjs.PropertyFormatter("enableCreatorDM"),
        new fjs.PropertyFormatter("enableParticipantDM"),
        new fjs.PropertyFormatter("enableActiveAdminDM"),
        new fjs.PropertyFormatter("enableEveryAdminDM"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("channel", new fjs.SingleCommentFormatter("Where to send transcripts. Leave empty when disabled.")),
        new fjs.PropertyFormatter("mode", new fjs.SingleCommentFormatter("The type of transcript to use. Choices: html, text"))
    ]),
    new fjs.ObjectFormatter("embedSettings", true, [
        new fjs.MultiCommentFormatter("Customise the embed which contains the generated transcript file or URL."),
        new fjs.PropertyFormatter("customColor", new fjs.SingleCommentFormatter("Leave empty to use default color")),
        new fjs.PropertyFormatter("listAllParticipants"),
        new fjs.PropertyFormatter("includeTicketStats")
    ]),
    new fjs.ObjectFormatter("textTranscriptStyle", true, [
        new fjs.MultiCommentFormatter("Customise layout of the text transcripts."),
        new fjs.PropertyFormatter("layout", new fjs.SingleCommentFormatter("Choices: simple, normal, detailed")),
        new fjs.PropertyFormatter("includeStats"),
        new fjs.PropertyFormatter("includeIds"),
        new fjs.PropertyFormatter("includeEmbeds"),
        new fjs.PropertyFormatter("includeFiles"),
        new fjs.PropertyFormatter("includeBotMessages"),
        new fjs.TextFormatter(""),
        new fjs.PropertyFormatter("fileMode", new fjs.SingleCommentFormatter("How to name the transcript file? Choices: custom, channel-name, channel-id, user-name, user-id")),
        new fjs.PropertyFormatter("customFileName", new fjs.SingleCommentFormatter("Custom filename without extension"))
    ]),
    new fjs.ObjectFormatter("htmlTranscriptStyle", true, [
        new fjs.MultiCommentFormatter("Customise layout of the HTML transcripts."),
        new fjs.ObjectFormatter("background", true, [
            new fjs.PropertyFormatter("enableCustomBackground"),
            new fjs.PropertyFormatter("backgroundColor", new fjs.SingleCommentFormatter("Leave empty to use Open Ticket color (#f8ba00)")),
            new fjs.PropertyFormatter("backgroundImage", new fjs.SingleCommentFormatter("Image URL to fill entire background. Leave empty to disable"))
        ]),
        new fjs.ObjectFormatter("header", true, [
            new fjs.PropertyFormatter("enableCustomHeader"),
            new fjs.PropertyFormatter("backgroundColor"),
            new fjs.PropertyFormatter("decoColor"),
            new fjs.PropertyFormatter("textColor")
        ]),
        new fjs.ObjectFormatter("stats", true, [
            new fjs.PropertyFormatter("enableCustomStats"),
            new fjs.PropertyFormatter("backgroundColor"),
            new fjs.PropertyFormatter("keyTextColor"),
            new fjs.PropertyFormatter("valueTextColor"),
            new fjs.PropertyFormatter("hideBackgroundColor"),
            new fjs.PropertyFormatter("hideTextColor")
        ]),
        new fjs.ObjectFormatter("favicon", true, [
            new fjs.PropertyFormatter("enableCustomFavicon"),
            new fjs.PropertyFormatter("imageUrl")
        ])
    ])
]))