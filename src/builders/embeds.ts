///////////////////////////////////////
//EMBED BUILDERS
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"
import nodepath from "path"

const embeds = opendiscord.builders.embeds
const lang = opendiscord.languages
const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerAllEmbeds = async () => {
    errorEmbeds()
    helpMenuEmbeds()
    statsEmbeds()
    panelEmbeds()
    ticketEmbeds()
    blacklistEmbeds()
    transcriptEmbeds()
    roleEmbeds()
    clearEmbeds()
    autoEmbeds()
}

/**Utility function to get the translated "method" from the source. Mostly used in error embeds. */
const getMethodFromSource = (source:"slash"|"text"|"button"|"dropdown"|"modal"|"other"): string => {
    if (source == "slash" || source == "text") return lang.getTranslation("params.lowercase.command")
    else if (source == "button") return lang.getTranslation("params.lowercase.button")
    else if (source == "dropdown") return lang.getTranslation("params.lowercase.dropdown")
    else if (source == "modal") return lang.getTranslation("params.lowercase.modal")
    else return lang.getTranslation("params.lowercase.method")
}
//lang.getTranslation()

const errorEmbeds = () => {
    //ERROR
    embeds.add(new api.ODEmbed("opendiscord:error"))
    embeds.get("opendiscord:error").workers.add(
        new api.ODWorker("opendiscord:error",0,async (instance,params,source) => {
            const {user,error,layout} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.internalError")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.internalError",[method]) + (layout == "simple") ? "\n"+error : "")
            if (layout == "advanced" && error) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+error+"```"})
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR OPTION MISSING
    embeds.add(new api.ODEmbed("opendiscord:error-option-missing"))
    embeds.get("opendiscord:error-option-missing").workers.add(
        new api.ODWorker("opendiscord:error-option-missing",0,async (instance,params) => {
            const {user,error} = params
            
            const options = error.command.builder.options ?? []
            const optionSyntax = options.map((opt,index) => {
                if (index == error.location){
                    if (opt.required){
                        return "`<"+opt.name+":"+opt.type.replace("guildmember","user")+">`"
                    }else{
                        return "`["+opt.name+":"+opt.type.replace("guildmember","user")+"]`"
                    }
                }else{
                    if (opt.required){
                        return "<"+opt.name+":"+opt.type.replace("guildmember","user")+">"
                    }else{
                        return "["+opt.name+":"+opt.type.replace("guildmember","user")+"]"
                    }
                }
            })
            const commandSyntax = "**"+error.prefix+error.name+" "+optionSyntax.join(" ")+"**"

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.optionMissing")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.optionMissing"))
            instance.addFields({name:lang.getTranslation("params.uppercase.syntax")+":",value:commandSyntax})
        })
    )

    //ERROR OPTION INVALID
    embeds.add(new api.ODEmbed("opendiscord:error-option-invalid"))
    embeds.get("opendiscord:error-option-invalid").workers.add(
        new api.ODWorker("opendiscord:error-option-invalid",0,async (instance,params) => {
            const {user,error} = params
            
            const options = error.command.builder.options ?? []
            const optionSyntax = options.map((opt,index) => {
                if (index == error.location){
                    if (opt.required){
                        return "`<"+opt.name+":"+opt.type.replace("guildmember","user")+">`"
                    }else{
                        return "`["+opt.name+":"+opt.type.replace("guildmember","user")+"]`"
                    }
                }else{
                    if (opt.required){
                        return "<"+opt.name+":"+opt.type.replace("guildmember","user")+">"
                    }else{
                        return "["+opt.name+":"+opt.type.replace("guildmember","user")+"]"
                    }
                }
            })
            const commandSyntax = "**"+error.prefix+error.name+" "+optionSyntax.join(" ")+"**"
            
            let reasonTitle = (error.reason == "boolean" || error.reason == "string_choice") ? lang.getTranslation("errors.descriptions.optionInvalidChoose") : lang.getTranslation("params.uppercase.reason")
            let reasonValue = "<unknown>"
            
            if (error.reason == "boolean" && error.option.type == "boolean") reasonValue = (error.option.falseValue ?? "false")+" OR "+(error.option.trueValue ?? "true")
            else if (error.reason == "string_choice" && error.option.type == "string" && error.option.choices) reasonValue = error.option.choices.join(" OR ")
            else if (error.reason == "string_regex" && error.option.type == "string" && error.option.regex) reasonValue = lang.getTranslation("errors.optionInvalidReasons.stringRegex")
            else if (error.reason == "string_min_length" && error.option.type == "string" && error.option.minLength) reasonValue = lang.getTranslationWithParams("errors.optionInvalidReasons.stringMinLength",[error.option.minLength.toString()])
            else if (error.reason == "string_max_length" && error.option.type == "string" && error.option.maxLength) reasonValue = lang.getTranslationWithParams("errors.optionInvalidReasons.stringMaxLength",[error.option.maxLength.toString()])
            else if (error.reason == "number_invalid" && error.option.type == "number") reasonValue = lang.getTranslation("errors.optionInvalidReasons.numberInvalid")
            else if (error.reason == "number_min" && error.option.type == "number" && error.option.min) reasonValue = lang.getTranslationWithParams("errors.optionInvalidReasons.numberMin",[error.option.min.toString()])
            else if (error.reason == "number_max" && error.option.type == "number" && error.option.max) reasonValue = lang.getTranslationWithParams("errors.optionInvalidReasons.numberMax",[error.option.max.toString()])
            else if (error.reason == "number_decimal" && error.option.type == "number") reasonValue = lang.getTranslation("errors.optionInvalidReasons.numberDecimal")
            else if (error.reason == "number_negative" && error.option.type == "number") reasonValue = lang.getTranslation("errors.optionInvalidReasons.numberNegative")
            else if (error.reason == "number_positive" && error.option.type == "number") reasonValue = lang.getTranslation("errors.optionInvalidReasons.numberPositive")
            else if (error.reason == "number_zero" && error.option.type == "number") reasonValue = lang.getTranslation("errors.optionInvalidReasons.numberZero")
            else if (error.reason == "channel_not_found" && error.option.type == "channel") reasonValue = lang.getTranslation("errors.optionInvalidReasons.channelNotFound")
            else if (error.reason == "user_not_found" && error.option.type == "user") reasonValue = lang.getTranslation("errors.optionInvalidReasons.userNotFound")
            else if (error.reason == "role_not_found" && error.option.type == "role") reasonValue = lang.getTranslation("errors.optionInvalidReasons.roleNotFound")
            else if (error.reason == "member_not_found" && error.option.type == "guildmember") reasonValue = lang.getTranslation("errors.optionInvalidReasons.memberNotFound")
            else if (error.reason == "mentionable_not_found" && error.option.type == "mentionable") reasonValue = lang.getTranslation("errors.optionInvalidReasons.mentionableNotFound")
            else if (error.reason == "channel_type" && error.option.type == "channel") reasonValue = lang.getTranslation("errors.optionInvalidReasons.channelType")
            else if (error.reason == "not_in_guild") reasonValue = lang.getTranslation("errors.optionInvalidReasons.notInGuild")

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.optionInvalid")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.optionInvalid")+"\n"+reasonTitle+": `"+reasonValue+"`")
            instance.addFields({name:lang.getTranslation("params.uppercase.syntax")+":",value:commandSyntax})
        })
    )

    //ERROR UNKNOWN COMMAND
    embeds.add(new api.ODEmbed("opendiscord:error-unknown-command"))
    embeds.get("opendiscord:error-unknown-command").workers.add(
        new api.ODWorker("opendiscord:error-unknown-command",0,async (instance,params) => {
            const {user} = params
            
            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownCommand")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.unknownCommand"))
        })
    )

    //ERROR NO PERMISSIONS
    embeds.add(new api.ODEmbed("opendiscord:error-no-permissions"))
    embeds.get("opendiscord:error-no-permissions").workers.add(
        new api.ODWorker("opendiscord:error-no-permissions",0,async (instance,params,source) => {
            const {user,permissions} = params
            
            const method = getMethodFromSource(source)

            const renderedPerms = permissions.map((perm) => {
                if (perm == "developer") return "- "+lang.getTranslation("errors.permissions.developer")
                else if (perm == "owner") return "- "+lang.getTranslation("errors.permissions.owner")
                else if (perm == "admin") return "- "+lang.getTranslation("errors.permissions.admin")
                else if (perm == "moderator") return "- "+lang.getTranslation("errors.permissions.moderator")
                else if (perm == "support") return "- "+lang.getTranslation("errors.permissions.support")
                else if (perm == "member") return "- "+lang.getTranslation("errors.permissions.member")
                else if (perm == "discord-administrator") return "- "+lang.getTranslation("errors.permissions.discord-administrator")
            }).join("\n")

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.noPermissions")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.noPermissions",[method]))
            if (renderedPerms) instance.addFields({name:lang.getTranslation("errors.descriptions.noPermissionsList"),value:renderedPerms})
        })
    )

    //ERROR NO PERMISSIONS COOLDOWN
    embeds.add(new api.ODEmbed("opendiscord:error-no-permissions-cooldown"))
    embeds.get("opendiscord:error-no-permissions-cooldown").workers.add(
        new api.ODWorker("opendiscord:error-no-permissions-cooldown",0,async (instance,params,source) => {
            const {user} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.noPermissions")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.noPermissionsCooldown",[method]))
            instance.addFields({name:lang.getTranslation("params.uppercase.until")+":",value:discord.time(params.until ?? new Date(),"R")})
        })
    )

    //ERROR NO PERMISSIONS BLACKLISTED
    embeds.add(new api.ODEmbed("opendiscord:error-no-permissions-blacklisted"))
    embeds.get("opendiscord:error-no-permissions-blacklisted").workers.add(
        new api.ODWorker("opendiscord:error-no-permissions-blacklisted",0,async (instance,params,source) => {
            const {user} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.noPermissions")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.noPermissionsBlacklist",[method]))
        })
    )

    //ERROR NO PERMISSIONS LIMITS
    embeds.add(new api.ODEmbed("opendiscord:error-no-permissions-limits"))
    embeds.get("opendiscord:error-no-permissions-limits").workers.add(
        new api.ODWorker("opendiscord:error-no-permissions-limits",0,async (instance,params,source) => {
            const {user,limit} = params
            
            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.noPermissions")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            if (limit == "global") instance.setDescription(lang.getTranslation("errors.descriptions.noPermissionsLimitGlobal"))
            else if (limit == "global-user") instance.setDescription(lang.getTranslation("errors.descriptions.noPermissionsLimitGlobalUser"))
            else if (limit == "option") instance.setDescription(lang.getTranslation("errors.descriptions.noPermissionsLimitOption"))
            else if (limit == "option-user") instance.setDescription(lang.getTranslation("errors.descriptions.noPermissionsLimitOptionUser"))
        })
    )

    //ERROR RESPONDER TIMEOUT
    embeds.add(new api.ODEmbed("opendiscord:error-responder-timeout"))
    embeds.get("opendiscord:error-responder-timeout").workers.add(
        new api.ODWorker("opendiscord:error-responder-timeout",0,async (instance,params,source) => {
            const {user} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.internalError")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.internalError",[method]))
            instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```Responder Timeout```"})
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR TICKET UNKNOWN
    embeds.add(new api.ODEmbed("opendiscord:error-ticket-unknown"))
    embeds.get("opendiscord:error-ticket-unknown").workers.add(
        new api.ODWorker("opendiscord:error-ticket-unknown",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownTicket")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.unknownTicket"))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR TICKET DEPRECATED
    embeds.add(new api.ODEmbed("opendiscord:error-ticket-deprecated"))
    embeds.get("opendiscord:error-ticket-deprecated").workers.add(
        new api.ODWorker("opendiscord:error-ticket-deprecated",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.deprecatedTicket")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.deprecatedTicket"))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR OPTION UNKNOWN
    embeds.add(new api.ODEmbed("opendiscord:error-option-unknown"))
    embeds.get("opendiscord:error-option-unknown").workers.add(
        new api.ODWorker("opendiscord:error-option-unknown",0,async (instance,params,source) => {
            const {user} = params

            const renderedTicketOptions = opendiscord.options.getAll().map((option) => {
                if (option instanceof api.ODTicketOption && option.exists("opendiscord:name")){
                    return "- **"+option.get("opendiscord:name").value+":** `"+option.id.value+"`"
                }else return "- `"+option.id.value+"`"
            }).join("\n")

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownOption")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
            instance.addFields({name:lang.getTranslation("params.uppercase.validOptions")+":",value:renderedTicketOptions})
        })
    )

    //ERROR PANEL UNKNOWN
    embeds.add(new api.ODEmbed("opendiscord:error-panel-unknown"))
    embeds.get("opendiscord:error-panel-unknown").workers.add(
        new api.ODWorker("opendiscord:error-panel-unknown",0,async (instance,params,source) => {
            const {user} = params

            const renderedPanels = opendiscord.panels.getAll().map((panel) => {
                if (panel.exists("opendiscord:name")){
                    return "- **"+panel.get("opendiscord:name").value+":** `"+panel.id.value+"`"
                }else return "- `"+panel.id.value+"`"
            }).join("\n")

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownPanel")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.addFields({name:lang.getTranslation("params.uppercase.validPanels")+":",value:renderedPanels})
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR NOT IN GUILD
    embeds.add(new api.ODEmbed("opendiscord:error-not-in-guild"))
    embeds.get("opendiscord:error-not-in-guild").workers.add(
        new api.ODWorker("opendiscord:error-not-in-guild",0,async (instance,params,source) => {
            const {user} = params

            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.notInGuild")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.notInGuild",[method]))
        })
    )

    //ERROR CHANNEL RENAME
    embeds.add(new api.ODEmbed("opendiscord:error-channel-rename"))
    embeds.get("opendiscord:error-channel-rename").workers.add(
        new api.ODWorker("opendiscord:error-channel-rename",0,async (instance,params,source) => {
            const {channel,user,originalName,newName} = params
            
            const method = (source == "ticket-move" || source == "ticket-pin" || source == "ticket-rename" || source == "ticket-unpin") ? source : getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.channelRename")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.channelRename"))
            instance.setFooter(lang.getTranslationWithParams("errors.descriptions.channelRenameSource",[method]))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.originalName")+":",value:"```#"+originalName+"```",inline:false},
                {name:lang.getTranslation("params.uppercase.newName")+":",value:"```#"+newName+"```",inline:false}
            )
        })
    )

    //ERROR TICKET BUSY
    embeds.add(new api.ODEmbed("opendiscord:error-ticket-busy"))
    embeds.get("opendiscord:error-ticket-busy").workers.add(
        new api.ODWorker("opendiscord:error-ticket-busy",0,async (instance,params,source) => {
            const {user} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.busy")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.busy",[method]))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfoResolve"))
        })
    )
}

const helpMenuEmbeds = () => {
    //HELP MENU
    embeds.add(new api.ODEmbed("opendiscord:help-menu"))
    embeds.get("opendiscord:help-menu").workers.add(
        new api.ODWorker("opendiscord:help-menu",0,async (instance,params) => {
            const {mode,page} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("ℹ️",lang.getTranslation("actions.titles.help")))
            instance.setDescription(lang.getTranslation("actions.descriptions.helpExplanation"))
            instance.setThumbnail(opendiscord.client.client.user.displayAvatarURL())
            
            const data = await opendiscord.helpmenu.render(mode)
            const currentData = data[page] ?? []
            instance.setFields(currentData)
        })
    )
}

const statsEmbeds = () => {
    //STATS GLOBAL
    embeds.add(new api.ODEmbed("opendiscord:stats-global"))
    embeds.get("opendiscord:stats-global").workers.add(
        new api.ODWorker("opendiscord:stats-global",0,async (instance,params) => {
            const {guild,channel,user} = params
            
            const scope = opendiscord.stats.get("opendiscord:global")
            if (!scope) return
            const data = await scope.render("GLOBAL",guild,channel,user)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(scope.name)
            instance.setDescription(data)
            
            if (opendiscord.permissions.hasPermissions("owner",await opendiscord.permissions.getPermissions(user,channel,guild))){
                //show system data when owner or developer
                const systemScope = opendiscord.stats.get("opendiscord:system")
                if (!systemScope) return
                const systemData = await systemScope.render("GLOBAL",guild,channel,user)
                instance.addFields({name:systemScope.name,value:systemData,inline:false})
            }
        })
    )

    //STATS TICKET
    embeds.add(new api.ODEmbed("opendiscord:stats-ticket"))
    embeds.get("opendiscord:stats-ticket").workers.add(
        new api.ODWorker("opendiscord:stats-ticket",0,async (instance,params) => {
            const {guild,channel,user,scopeData} = params
            
            const scope = opendiscord.stats.get("opendiscord:ticket")
            const participantsScope = opendiscord.stats.get("opendiscord:participants")
            if (!scope || !participantsScope) return
            const data = await scope.render(scopeData.id.value,guild,channel,user)
            const participantsData = await participantsScope.render(scopeData.id.value,guild,channel,user)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(scope.name)
            instance.setDescription(data)
            instance.addFields({name:participantsScope.name,value:participantsData,inline:false})
        })
    )

    //STATS USER
    embeds.add(new api.ODEmbed("opendiscord:stats-user"))
    embeds.get("opendiscord:stats-user").workers.add([
        new api.ODWorker("opendiscord:stats-user",0,async (instance,params) => {
            const {guild,channel,user,scopeData} = params
            
            const scope = opendiscord.stats.get("opendiscord:user")
            if (!scope) return
            const data = await scope.render(scopeData.id,guild,channel,user)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(scope.name)
            instance.setDescription(data)
            instance.setThumbnail(scopeData.displayAvatarURL())
        }),
        new api.ODWorker("opendiscord:easter-egg",-1,async (instance,params) => {
            if (!opendiscord.flags.exists("opendiscord:no-easter")) return
            const easterFlag = opendiscord.flags.get("opendiscord:no-easter")
            if (!easterFlag.value){
                //🥚 add easter egg 🥚
                const {user} = params
                if (user.id == utilities.easterEggs.creator){
                    instance.setFooter("💻 Open Ticket Developer")
                }else if (utilities.easterEggs.translators.includes(user.id)){
                    instance.setFooter("💬 Open Ticket Translator")
                }
            }
        })
    ])

    //STATS RESET
    embeds.add(new api.ODEmbed("opendiscord:stats-reset"))
    embeds.get("opendiscord:stats-reset").workers.add(
        new api.ODWorker("opendiscord:stats-reset",0,async (instance,params) => {
            const {user,reason} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.statsReset")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("actions.descriptions.statsReset"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //STATS TICKET UNKNOWN
    embeds.add(new api.ODEmbed("opendiscord:stats-ticket-unknown"))
    embeds.get("opendiscord:stats-ticket-unknown").workers.add(
        new api.ODWorker("opendiscord:stats-ticket-unknown",0,async (instance,params) => {
            const {user,id} = params
            
            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownTicket")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.statsError",[discord.channelMention(id)]))
        })
    )
}

const panelEmbeds = () => {
    //PANEL
    embeds.add(new api.ODEmbed("opendiscord:panel"))
    embeds.get("opendiscord:panel").workers.add(
        new api.ODWorker("opendiscord:panel",0,async (instance,params) => {
            const {panel} = params
            if (!panel.exists("opendiscord:embed")) return
            const embedOptions = panel.get("opendiscord:embed").value
            
            instance.setColor(embedOptions.customColor ? embedOptions.customColor : generalConfig.data.mainColor)
            instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.url) instance.setUrl(embedOptions.url)
            if (embedOptions.footer) instance.setFooter(embedOptions.footer)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            
            if (panel.get("opendiscord:describe-options-in-embed-description").value){
                //describe options in description
                const text = (await import("../data/openticket/panelLoader.js")).describePanelOptions("text",panel)
                instance.setDescription(embedOptions.description+"\n\n"+text)
            }else if (embedOptions.description){
                instance.setDescription(embedOptions.description)
            }

            if (panel.get("opendiscord:enable-max-tickets-warning-embed").value && generalConfig.data.system.limits.enabled){
                instance.setDescription(instance.data.description+"\n\n*"+lang.getTranslationWithParams("actions.descriptions.ticketMessageLimit",[generalConfig.data.system.limits.userMaximum.toString()])+"*")
            }

            if (panel.get("opendiscord:describe-options-in-embed-fields").value){
                //describe options in fields
                const fields = (await import("../data/openticket/panelLoader.js")).describePanelOptions("fields",panel)
                instance.setFields(fields)
            }else if(embedOptions.fields.length > 0){
                instance.setFields(embedOptions.fields)
            }
        })
    )
}

const ticketEmbeds = () => {
    //TICKET CREATED
    embeds.add(new api.ODEmbed("opendiscord:ticket-created"))
    embeds.get("opendiscord:ticket-created").workers.add(
        new api.ODWorker("opendiscord:ticket-created",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🎫",lang.getTranslation("actions.titles.created")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslation("actions.descriptions.create"))
        })
    )

    //TICKET CREATED DM
    embeds.add(new api.ODEmbed("opendiscord:ticket-created-dm"))
    embeds.get("opendiscord:ticket-created-dm").workers.add(
        new api.ODWorker("opendiscord:ticket-created-dm",0,async (instance,params,source) => {
            const {user,ticket} = params
            const embedOptions = ticket.option.get("opendiscord:dm-message-embed").value
            
            instance.setColor(embedOptions.customColor ? (embedOptions.customColor as discord.ColorResolvable) : generalConfig.data.mainColor)
            instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            if (embedOptions.description) instance.setDescription(embedOptions.description)
            if (embedOptions.fields) instance.setFields(embedOptions.fields)
            
            if (ticket.get("opendiscord:closed").value && ticket.get("opendiscord:autodelete-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutodelete",[ticket.option.get("opendiscord:autodelete-days").value.toString()]))
            else if (!ticket.get("opendiscord:closed").value && ticket.get("opendiscord:autoclose-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutoclose",[ticket.option.get("opendiscord:autoclose-hours").value.toString()]))       
        })
    )

    //TICKET CREATED LOGS
    embeds.add(new api.ODEmbed("opendiscord:ticket-created-logs"))
    embeds.get("opendiscord:ticket-created-logs").workers.add(
        new api.ODWorker("opendiscord:ticket-created-logs",0,async (instance,params,source) => {
            const {user,ticket} = params
            
            const method = (source == "panel-button" || source == "panel-dropdown") ? lang.getTranslation("params.uppercase.panel") : (source == "slash" || source == "text") ? lang.getTranslation("params.uppercase.command") : lang.getTranslation("params.uppercase.system")
            const blacklisted = opendiscord.blacklist.exists(user.id) ? lang.getTranslation("params.uppercase.true") : lang.getTranslation("params.uppercase.false")

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🎫",lang.getTranslation("actions.titles.created")))
            instance.setThumbnail(user.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslationWithParams("actions.logs.createLog",[discord.userMention(user.id)]))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.type")+":",value:"```"+ticket.option.get("opendiscord:name").value+"```",inline:false},
                {name:lang.getTranslation("params.uppercase.method")+":",value:"```"+method+"```",inline:true},
                {name:lang.getTranslation("params.uppercase.blacklisted")+":",value:"```"+blacklisted+"```", inline:true}
            )
        })
    )

    //TICKET MESSAGE
    embeds.add(new api.ODEmbed("opendiscord:ticket-message"))
    embeds.get("opendiscord:ticket-message").workers.add(
        new api.ODWorker("opendiscord:ticket-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const embedOptions = ticket.option.get("opendiscord:ticket-message-embed").value
            
            instance.setColor(embedOptions.customColor ? embedOptions.customColor : generalConfig.data.mainColor)
            if (embedOptions.title) instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            if (embedOptions.description) instance.setDescription(embedOptions.description)
            
            if (ticket.option.get("opendiscord:questions").value.length > 0){
                const answers = ticket.get("opendiscord:answers").value
                answers.forEach((answer) => {
                    if (!answer.value || answer.value.length == 0) return
                    if (generalConfig.data.system.questionFieldsInCodeBlock) instance.addFields({name:answer.name,value:"```"+answer.value+"```",inline:false})
                    else instance.addFields({name:answer.name,value:answer.value,inline:false})
                })
            }else if (embedOptions.fields){
                instance.setFields(embedOptions.fields)
            }

            if (ticket.get("opendiscord:closed").value && ticket.get("opendiscord:autodelete-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutodelete",[ticket.option.get("opendiscord:autodelete-days").value.toString()]))
            else if (!ticket.get("opendiscord:closed").value && ticket.get("opendiscord:autoclose-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutoclose",[ticket.option.get("opendiscord:autoclose-hours").value.toString()]))
            
            if (ticket.get("opendiscord:claimed").value){
                const claimUser = await opendiscord.tickets.getTicketUser(ticket,"claimer")
                if (!claimUser) return
                instance.setAuthor(lang.getTranslationWithParams("params.uppercase.claimedBy",[claimUser.displayName]),claimUser.displayAvatarURL())
            }
        })
    )

    //TICKET CLOSED
    embeds.add(new api.ODEmbed("opendiscord:close-message"))
    embeds.get("opendiscord:close-message").workers.add(
        new api.ODWorker("opendiscord:close-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔒",lang.getTranslation("actions.titles.close")))
            instance.setDescription(lang.getTranslation("actions.descriptions.close"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET REOPENED
    embeds.add(new api.ODEmbed("opendiscord:reopen-message"))
    embeds.get("opendiscord:reopen-message").workers.add(
        new api.ODWorker("opendiscord:reopen-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔓",lang.getTranslation("actions.titles.reopen")))
            instance.setDescription(lang.getTranslation("actions.descriptions.reopen"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET DELETED
    embeds.add(new api.ODEmbed("opendiscord:delete-message"))
    embeds.get("opendiscord:delete-message").workers.add(
        new api.ODWorker("opendiscord:delete-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.delete")))
            instance.setDescription(lang.getTranslation("actions.descriptions.delete"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET CLAIMED
    embeds.add(new api.ODEmbed("opendiscord:claim-message"))
    embeds.get("opendiscord:claim-message").workers.add(
        new api.ODWorker("opendiscord:claim-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👋",lang.getTranslation("actions.titles.claim")))
            instance.setDescription(lang.getTranslation("actions.descriptions.claim"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET UNCLAIMED
    embeds.add(new api.ODEmbed("opendiscord:unclaim-message"))
    embeds.get("opendiscord:unclaim-message").workers.add(
        new api.ODWorker("opendiscord:unclaim-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("↩️",lang.getTranslation("actions.titles.unclaim")))
            instance.setDescription(lang.getTranslation("actions.descriptions.unclaim"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET PINNED
    embeds.add(new api.ODEmbed("opendiscord:pin-message"))
    embeds.get("opendiscord:pin-message").workers.add(
        new api.ODWorker("opendiscord:pin-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.pin")))
            instance.setDescription(lang.getTranslation("actions.descriptions.pin"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET UNPINNED
    embeds.add(new api.ODEmbed("opendiscord:unpin-message"))
    embeds.get("opendiscord:unpin-message").workers.add(
        new api.ODWorker("opendiscord:unpin-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.unpin")))
            instance.setDescription(lang.getTranslation("actions.descriptions.unpin"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET RENAMED
    embeds.add(new api.ODEmbed("opendiscord:rename-message"))
    embeds.get("opendiscord:rename-message").workers.add(
        new api.ODWorker("opendiscord:rename-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔄",lang.getTranslation("actions.titles.rename")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.rename",["`#"+data+"`"]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET MOVED
    embeds.add(new api.ODEmbed("opendiscord:move-message"))
    embeds.get("opendiscord:move-message").workers.add(
        new api.ODWorker("opendiscord:move-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔀",lang.getTranslation("actions.titles.move")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.move",["`"+data.get("opendiscord:name").value+"`"]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET USER ADDED
    embeds.add(new api.ODEmbed("opendiscord:add-message"))
    embeds.get("opendiscord:add-message").workers.add(
        new api.ODWorker("opendiscord:add-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.add")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.add",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET USER REMOVED
    embeds.add(new api.ODEmbed("opendiscord:remove-message"))
    embeds.get("opendiscord:remove-message").workers.add(
        new api.ODWorker("opendiscord:remove-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.remove")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.remove",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )
    
    //TICKET ACTION DM
    embeds.add(new api.ODEmbed("opendiscord:ticket-action-dm"))
    embeds.get("opendiscord:ticket-action-dm").workers.add(
        new api.ODWorker("opendiscord:ticket-action-dm",0,async (instance,params,source) => {
            const {user,mode,ticket,reason,additionalData} = params
            const channel = await opendiscord.tickets.getTicketChannel(ticket)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"```#"+(channel ? channel.name : "<unknown>")+"```",inline:false})
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```",inline:false})

            if (mode == "close"){
                instance.setTitle(utilities.emojiTitle("🔒",lang.getTranslation("actions.titles.close")))
                instance.setDescription(lang.getTranslation("actions.logs.closeDm"))
            }else if (mode == "reopen"){
                instance.setTitle(utilities.emojiTitle("🔓",lang.getTranslation("actions.titles.reopen")))
                instance.setDescription(lang.getTranslation("actions.logs.reopenDm"))
            }else if (mode == "delete"){
                instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.delete")))
                instance.setDescription(lang.getTranslation("actions.logs.deleteDm"))
            }else if (mode == "claim"){
                instance.setTitle(utilities.emojiTitle("👋",lang.getTranslation("actions.titles.claim")))
                instance.setDescription(lang.getTranslation("actions.logs.claimDm"))
            }else if (mode == "unclaim"){
                instance.setTitle(utilities.emojiTitle("↩️",lang.getTranslation("actions.titles.unclaim")))
                instance.setDescription(lang.getTranslation("actions.logs.unclaimDm"))
            }else if (mode == "pin"){
                instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.pin")))
                instance.setDescription(lang.getTranslation("actions.logs.pinDm"))
            }else if (mode == "unpin"){
                instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.unpin")))
                instance.setDescription(lang.getTranslation("actions.logs.unpinDm"))
            }else if (mode == "rename"){
                instance.setTitle(utilities.emojiTitle("🔄",lang.getTranslation("actions.titles.rename")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.renameDm",["`#"+(typeof additionalData == "string" ? additionalData : "<unknown>")+"`"]))
            }else if (mode == "move"){
                instance.setTitle(utilities.emojiTitle("🔀",lang.getTranslation("actions.titles.move")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.moveDm",["`"+(additionalData instanceof api.ODTicketOption ? additionalData.get("opendiscord:name").value : "<unknown>")+"`"]))
            }else if (mode == "add"){
                instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.add")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.addDm",[(additionalData instanceof discord.User ? discord.userMention(additionalData.id) : "<unknown>")]))
            }else if (mode == "remove"){
                instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.remove")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.removeDm",[(additionalData instanceof discord.User ? discord.userMention(additionalData.id) : "<unknown>")]))
            }
        })
    )

    //TICKET ACTION LOGS
    embeds.add(new api.ODEmbed("opendiscord:ticket-action-logs"))
    embeds.get("opendiscord:ticket-action-logs").workers.add(
        new api.ODWorker("opendiscord:ticket-action-logs",0,async (instance,params,source) => {
            const {user,mode,ticket,reason,additionalData} = params
            const channel = await opendiscord.tickets.getTicketChannel(ticket)

            instance.setColor(generalConfig.data.mainColor)
            instance.setThumbnail(user.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.ticket")+":",value:"```#"+(channel ? channel.name : "<unknown>")+"```",inline:false},
                //TODO TRANSLATION!!!
                {name:"Option"+":",value:"```"+(ticket.option.get("opendiscord:name").value)+"```",inline:false},
            )
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```",inline:false})

            if (mode == "close"){
                instance.setTitle(utilities.emojiTitle("🔒",lang.getTranslation("actions.titles.close")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.closeLog",[discord.userMention(user.id)]))
            }else if (mode == "reopen"){
                instance.setTitle(utilities.emojiTitle("🔓",lang.getTranslation("actions.titles.reopen")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.reopenLog",[discord.userMention(user.id)]))
            }else if (mode == "delete"){
                instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.delete")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.deleteLog",[discord.userMention(user.id)]))
            }else if (mode == "claim"){
                instance.setTitle(utilities.emojiTitle("👋",lang.getTranslation("actions.titles.claim")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.claimLog",[discord.userMention(user.id)]))
            }else if (mode == "unclaim"){
                instance.setTitle(utilities.emojiTitle("↩️",lang.getTranslation("actions.titles.unclaim")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.unclaimLog",[discord.userMention(user.id)]))
            }else if (mode == "pin"){
                instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.pin")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.pinLog",[discord.userMention(user.id)]))
            }else if (mode == "unpin"){
                instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.unpin")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.unpinLog",[discord.userMention(user.id)]))
            }else if (mode == "rename"){
                instance.setTitle(utilities.emojiTitle("🔄",lang.getTranslation("actions.titles.rename")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.renameLog",["`#"+(typeof additionalData == "string" ? additionalData : "<unknown>")+"`",discord.userMention(user.id)]))
            }else if (mode == "move"){
                instance.setTitle(utilities.emojiTitle("🔀",lang.getTranslation("actions.titles.move")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.moveLog",["`"+(additionalData instanceof api.ODTicketOption ? additionalData.get("opendiscord:name").value : "<unknown>")+"`",discord.userMention(user.id)]))
            }else if (mode == "add"){
                instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.add")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.addLog",[(additionalData instanceof discord.User ? discord.userMention(additionalData.id) : "<unknown>"),discord.userMention(user.id)]))
            }else if (mode == "remove"){
                instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.remove")))
                instance.setDescription(lang.getTranslationWithParams("actions.logs.removeLog",[(additionalData instanceof discord.User ? discord.userMention(additionalData.id) : "<unknown>"),discord.userMention(user.id)]))
            }
        })
    )
}

const blacklistEmbeds = () => {
    //BLACKLIST VIEW
    embeds.add(new api.ODEmbed("opendiscord:blacklist-view"))
    embeds.get("opendiscord:blacklist-view").workers.add(
        new api.ODWorker("opendiscord:blacklist-view",0,async (instance,params,source) => {
            const {user} = params

            const renderedUsers: string[] = []
            await opendiscord.blacklist.loopAll((blacklist,id) => {renderedUsers.push(discord.userMention(id.value)+" - "+(blacklist.reason ? blacklist.reason : "/"))})

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🚫",lang.getTranslation("actions.titles.blacklistView")))
            
            if (renderedUsers.length > 0) instance.setDescription(renderedUsers.join("\n"))
            else{
                instance.setDescription("*"+lang.getTranslation("actions.descriptions.blacklistViewEmpty")+"*")
                instance.setFooter(lang.getTranslation("actions.descriptions.blacklistViewTip"))
            }
        })
    )
    //BLACKLIST GET
    embeds.add(new api.ODEmbed("opendiscord:blacklist-get"))
    embeds.get("opendiscord:blacklist-get").workers.add(
        new api.ODWorker("opendiscord:blacklist-get",0,async (instance,params,source) => {
            const {user,data} = params
            const blacklist = opendiscord.blacklist.get(data.id)

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🚫",lang.getTranslation("actions.titles.blacklistGet")))

            if (blacklist){
                instance.setDescription(lang.getTranslationWithParams("actions.descriptions.blacklistGetSuccess",[discord.userMention(data.id)]))
                if (blacklist.reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+blacklist.reason+"```"})
                
            }else instance.setDescription("*"+lang.getTranslationWithParams("actions.descriptions.blacklistGetEmpty",[discord.userMention(data.id)])+"*")
        })
    )

    //BLACKLIST ADD
    embeds.add(new api.ODEmbed("opendiscord:blacklist-add"))
    embeds.get("opendiscord:blacklist-add").workers.add(
        new api.ODWorker("opendiscord:blacklist-add",0,async (instance,params,source) => {
            const {user,data,reason} = params
            
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🚫",lang.getTranslation("actions.titles.blacklistAdd")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.blacklistAdd",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //BLACKLIST REMOVE
    embeds.add(new api.ODEmbed("opendiscord:blacklist-remove"))
    embeds.get("opendiscord:blacklist-remove").workers.add(
        new api.ODWorker("opendiscord:blacklist-remove",0,async (instance,params,source) => {
            const {user,data,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🆓",lang.getTranslation("actions.titles.blacklistRemove")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.blacklistRemove",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //BLACKLIST DM
    embeds.add(new api.ODEmbed("opendiscord:blacklist-dm"))
    embeds.get("opendiscord:blacklist-dm").workers.add(
        new api.ODWorker("opendiscord:blacklist-dm",0,async (instance,params,source) => {
            const {user,mode,data,reason} = params
            
            const title = (mode == "add") ? lang.getTranslation("actions.titles.blacklistAddDm") : lang.getTranslation("actions.titles.blacklistRemoveDm")
            const text = (mode == "add") ? lang.getTranslation("actions.logs.blacklistAddDm") : lang.getTranslation("actions.logs.blacklistRemoveDm")

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle((mode == "add") ? "🚫" : "🆓",title))
            instance.setTimestamp(new Date())
            instance.setDescription(text)
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```",inline:false})
        })
    )

    //BLACKLIST LOGS
    embeds.add(new api.ODEmbed("opendiscord:blacklist-logs"))
    embeds.get("opendiscord:blacklist-logs").workers.add(
        new api.ODWorker("opendiscord:blacklist-logs",0,async (instance,params,source) => {
            const {user,mode,data,reason} = params
            
            const title = (mode == "add") ? lang.getTranslation("actions.titles.blacklistAdd") : lang.getTranslation("actions.titles.blacklistRemove")
            const text = (mode == "add") ? lang.getTranslationWithParams("actions.logs.blacklistAddLog",[discord.userMention(data.id),discord.userMention(user.id)]) : lang.getTranslationWithParams("actions.logs.blacklistRemoveLog",[discord.userMention(data.id),discord.userMention(user.id)])

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle((mode == "add") ? "🚫" : "🆓",title))
            instance.setThumbnail(data.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(text)
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```",inline:false})
        })
    )
}

const transcriptEmbeds = () => {
    //TRANSCRIPT TEXT READY
    embeds.add(new api.ODEmbed("opendiscord:transcript-text-ready"))
    embeds.get("opendiscord:transcript-text-ready").workers.add(
        new api.ODWorker("opendiscord:transcript-text-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler} = params
            const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")
            
            instance.setColor(transcriptConfig.data.embedSettings.customColor ? transcriptConfig.data.embedSettings.customColor : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})

            const creatorId = ticket.get("opendiscord:opened-by").value
            if (creatorId){
                try{
                    const creator = await channel.client.users.fetch(creatorId)
                    instance.addFields({name:lang.getTranslation("params.uppercase.creator")+":",value:creator.username+" ("+discord.userMention(creator.id)+")"})
                    instance.setThumbnail(creator.displayAvatarURL())
                }catch{}
            }

            if (source == "channel") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdChannel",[lang.getTranslation("params.lowercase.text")]))
            else if (source == "creator-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdCreator",[lang.getTranslation("params.lowercase.text")]))
            else if (source == "participant-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdParticipant",[lang.getTranslation("params.lowercase.text")]))
            else if (source == "active-admin-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdActiveAdmin",[lang.getTranslation("params.lowercase.text")]))
            else if (source == "every-admin-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdEveryAdmin",[lang.getTranslation("params.lowercase.text")]))
            else instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdOther",[lang.getTranslation("params.lowercase.text")]))
        })
    )

    //TRANSCRIPT HTML READY
    embeds.add(new api.ODEmbed("opendiscord:transcript-html-ready"))
    embeds.get("opendiscord:transcript-html-ready").workers.add(
        new api.ODWorker("opendiscord:transcript-html-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")
            
            instance.setColor(transcriptConfig.data.embedSettings.customColor ? transcriptConfig.data.embedSettings.customColor : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})
            if (result.data) instance.setUrl(result.data.url)

            const creatorId = ticket.get("opendiscord:opened-by").value
            if (creatorId){
                try{
                    const creator = await channel.client.users.fetch(creatorId)
                    instance.addFields({name:lang.getTranslation("params.uppercase.creator")+":",value:creator.username+" ("+discord.userMention(creator.id)+")"})
                    instance.setThumbnail(creator.displayAvatarURL())
                }catch{}
            }

            if (source == "channel") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdChannel",[lang.getTranslation("params.lowercase.html")]))
            else if (source == "creator-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdCreator",[lang.getTranslation("params.lowercase.html")]))
            else if (source == "participant-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdParticipant",[lang.getTranslation("params.lowercase.html")]))
            else if (source == "active-admin-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdActiveAdmin",[lang.getTranslation("params.lowercase.html")]))
            else if (source == "every-admin-dm") instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdEveryAdmin",[lang.getTranslation("params.lowercase.html")]))
            else instance.setDescription(lang.getTranslationWithParams("transcripts.success.createdOther",[lang.getTranslation("params.lowercase.html")]))
        })
    )

    //TRANSCRIPT HTML PROGRESS
    embeds.add(new api.ODEmbed("opendiscord:transcript-html-progress"))
    embeds.get("opendiscord:transcript-html-progress").workers.add(
        new api.ODWorker("opendiscord:transcript-html-progress",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,remaining} = params
            
            const remainingDate = new Date(new Date().getTime()+remaining)

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setDescription(lang.getTranslation("transcripts.success.htmlProgress"))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.remaining")+":",value:discord.time(remainingDate,"R"),inline:false})
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})

            const creatorId = ticket.get("opendiscord:opened-by").value
            if (creatorId){
                try{
                    const creator = await channel.client.users.fetch(creatorId)
                    instance.addFields({name:lang.getTranslation("params.uppercase.creator")+":",value:creator.username+" ("+discord.userMention(creator.id)+")"})
                    instance.setThumbnail(creator.displayAvatarURL())
                }catch{}
            }
        })
    )

    //TRANSCRIPT ERROR
    embeds.add(new api.ODEmbed("opendiscord:transcript-error"))
    embeds.get("opendiscord:transcript-error").workers.add(
        new api.ODWorker("opendiscord:transcript-error",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,reason} = params
            
            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌","Transcript Error")) //TODO TRANSLATION!!!
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslation("transcripts.errors.error"))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```",inline:false})
        })
    )
}

const roleEmbeds = () => {
    //REACTION ROLE
    embeds.add(new api.ODEmbed("opendiscord:reaction-role"))
    embeds.get("opendiscord:reaction-role").workers.add(
        new api.ODWorker("opendiscord:reaction-role",0,async (instance,params,source) => {
            const {guild,user,role,result} = params

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🎨",lang.getTranslation("actions.titles.roles")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())

            const newResult = result.filter((r) => r.action != null).sort((a,b) => {
                if (a.action == "added" && b.action == "removed") return -1
                else if (a.action == "removed" && b.action == "added") return 1
                else return 0
            }).map((r) => {
                return (r.action == "added") ? "🟢 "+lang.getTranslation("params.uppercase.added")+" "+discord.roleMention(r.role.id) : "🔴 "+lang.getTranslation("params.uppercase.removed")+" "+discord.roleMention(r.role.id)
            })
            
            if (newResult.length > 0) instance.setDescription(newResult.join("\n"))
            else instance.setDescription(lang.getTranslation("actions.descriptions.rolesEmpty"))
        })
    )
}

const clearEmbeds = () => {
    //CLEAR VERIFY MESSAGE
    embeds.add(new api.ODEmbed("opendiscord:clear-verify-message"))
    embeds.get("opendiscord:clear-verify-message").workers.add(
        new api.ODWorker("opendiscord:clear-verify-message",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⚠️","Clear Tickets")) //TODO TRANSLATION!!!
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslation("actions.descriptions.clearVerify"))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.filter")+":",value:filter,inline:false},
                {name:lang.getTranslation("params.uppercase.tickets")+":",value:"`"+list.join("`\n`")+"`",inline:false}
            )
        })
    )

    //CLEAR MESSAGE
    embeds.add(new api.ODEmbed("opendiscord:clear-message"))
    embeds.get("opendiscord:clear-message").workers.add(
        new api.ODWorker("opendiscord:clear-message",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⚠️",lang.getTranslation("actions.titles.clear")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.clearReady",[list.length.toString()]))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.tickets")+":",value:"`"+list.join("`\n`")+"`",inline:false}
            )
        })
    )

    //CLEAR LOGS
    embeds.add(new api.ODEmbed("opendiscord:clear-logs"))
    embeds.get("opendiscord:clear-logs").workers.add(
        new api.ODWorker("opendiscord:clear-logs",0,async (instance,params,source) => {
            const {guild,channel,user,filter,list} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⚠️",lang.getTranslation("actions.titles.clear")))
            instance.setThumbnail(user.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslationWithParams("actions.logs.clearLog",[list.length.toString(),discord.userMention(user.id)]))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.tickets")+":",value:"`"+list.join("`\n`")+"`",inline:false}
            )
        })
    )
}

const autoEmbeds = () => {
    //AUTOCLOSE MESSAGE
    embeds.add(new api.ODEmbed("opendiscord:autoclose-message"))
    embeds.get("opendiscord:autoclose-message").workers.add(
        new api.ODWorker("opendiscord:autoclose-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const hours: number = ticket.get("opendiscord:autoclose-hours").value
            const description = (source == "leave") ? lang.getTranslation("actions.descriptions.autocloseLeave") : lang.getTranslationWithParams("actions.descriptions.autocloseTimeout",[hours.toString()])

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autoclose")))
            instance.setDescription(description)
            instance.setTimestamp(new Date())
        })
    )

    //AUTODELETE MESSAGE
    embeds.add(new api.ODEmbed("opendiscord:autodelete-message"))
    embeds.get("opendiscord:autodelete-message").workers.add(
        new api.ODWorker("opendiscord:autodelete-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const days: number = ticket.get("opendiscord:autodelete-days").value
            const description = (source == "leave") ? lang.getTranslation("actions.descriptions.autodeleteLeave") : lang.getTranslationWithParams("actions.descriptions.autodeleteTimeout",[days.toString()])

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodelete")))
            instance.setDescription(description)
            instance.setTimestamp(new Date())
        })
    )

    //AUTOCLOSE ENABLE
    embeds.add(new api.ODEmbed("opendiscord:autoclose-enable"))
    embeds.get("opendiscord:autoclose-enable").workers.add(
        new api.ODWorker("opendiscord:autoclose-enable",0,async (instance,params,source) => {
            const {user,ticket,reason,time} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autocloseEnabled")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.autocloseEnabled",[time.toString()]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTODELETE ENABLE
    embeds.add(new api.ODEmbed("opendiscord:autodelete-enable"))
    embeds.get("opendiscord:autodelete-enable").workers.add(
        new api.ODWorker("opendiscord:autodelete-enable",0,async (instance,params,source) => {
            const {user,ticket,reason,time} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodeleteEnabled")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.autodeleteEnabled",[time.toString()]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTOCLOSE DISABLE
    embeds.add(new api.ODEmbed("opendiscord:autoclose-disable"))
    embeds.get("opendiscord:autoclose-disable").workers.add(
        new api.ODWorker("opendiscord:autoclose-disable",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autocloseDisabled")))
            instance.setDescription(lang.getTranslation("actions.descriptions.autocloseDisabled"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTODELETE DISABLE
    embeds.add(new api.ODEmbed("opendiscord:autodelete-disable"))
    embeds.get("opendiscord:autodelete-disable").workers.add(
        new api.ODWorker("opendiscord:autodelete-disable",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodeleteDisabled")))
            instance.setDescription(lang.getTranslation("actions.descriptions.autodeleteDisabled"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )
}