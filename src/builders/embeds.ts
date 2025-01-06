///////////////////////////////////////
//EMBED BUILDERS
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"
import nodepath from "path"

const embeds = openticket.builders.embeds
const lang = openticket.languages
const generalConfig = openticket.configs.get("openticket:general")

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
    embeds.add(new api.ODEmbed("openticket:error"))
    embeds.get("openticket:error").workers.add(
        new api.ODWorker("openticket:error",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-option-missing"))
    embeds.get("openticket:error-option-missing").workers.add(
        new api.ODWorker("openticket:error-option-missing",0,async (instance,params) => {
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
    embeds.add(new api.ODEmbed("openticket:error-option-invalid"))
    embeds.get("openticket:error-option-invalid").workers.add(
        new api.ODWorker("openticket:error-option-invalid",0,async (instance,params) => {
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
    embeds.add(new api.ODEmbed("openticket:error-unknown-command"))
    embeds.get("openticket:error-unknown-command").workers.add(
        new api.ODWorker("openticket:error-unknown-command",0,async (instance,params) => {
            const {user} = params
            
            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownCommand")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.unknownCommand"))
        })
    )

    //ERROR NO PERMISSIONS
    embeds.add(new api.ODEmbed("openticket:error-no-permissions"))
    embeds.get("openticket:error-no-permissions").workers.add(
        new api.ODWorker("openticket:error-no-permissions",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-no-permissions-cooldown"))
    embeds.get("openticket:error-no-permissions-cooldown").workers.add(
        new api.ODWorker("openticket:error-no-permissions-cooldown",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-no-permissions-blacklisted"))
    embeds.get("openticket:error-no-permissions-blacklisted").workers.add(
        new api.ODWorker("openticket:error-no-permissions-blacklisted",0,async (instance,params,source) => {
            const {user} = params
            
            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.noPermissions")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.noPermissionsBlacklist",[method]))
        })
    )

    //ERROR NO PERMISSIONS LIMITS
    embeds.add(new api.ODEmbed("openticket:error-no-permissions-limits"))
    embeds.get("openticket:error-no-permissions-limits").workers.add(
        new api.ODWorker("openticket:error-no-permissions-limits",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-responder-timeout"))
    embeds.get("openticket:error-responder-timeout").workers.add(
        new api.ODWorker("openticket:error-responder-timeout",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-ticket-unknown"))
    embeds.get("openticket:error-ticket-unknown").workers.add(
        new api.ODWorker("openticket:error-ticket-unknown",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.unknownTicket")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.unknownTicket"))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR TICKET DEPRECATED
    embeds.add(new api.ODEmbed("openticket:error-ticket-deprecated"))
    embeds.get("openticket:error-ticket-deprecated").workers.add(
        new api.ODWorker("openticket:error-ticket-deprecated",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.deprecatedTicket")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("errors.descriptions.deprecatedTicket"))
            instance.setFooter(lang.getTranslation("errors.descriptions.askForInfo"))
        })
    )

    //ERROR OPTION UNKNOWN
    embeds.add(new api.ODEmbed("openticket:error-option-unknown"))
    embeds.get("openticket:error-option-unknown").workers.add(
        new api.ODWorker("openticket:error-option-unknown",0,async (instance,params,source) => {
            const {user} = params

            const renderedTicketOptions = openticket.options.getAll().map((option) => {
                if (option instanceof api.ODTicketOption && option.exists("openticket:name")){
                    return "- **"+option.get("openticket:name").value+":** `"+option.id.value+"`"
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
    embeds.add(new api.ODEmbed("openticket:error-panel-unknown"))
    embeds.get("openticket:error-panel-unknown").workers.add(
        new api.ODWorker("openticket:error-panel-unknown",0,async (instance,params,source) => {
            const {user} = params

            const renderedPanels = openticket.panels.getAll().map((panel) => {
                if (panel.exists("openticket:name")){
                    return "- **"+panel.get("openticket:name").value+":** `"+panel.id.value+"`"
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
    embeds.add(new api.ODEmbed("openticket:error-not-in-guild"))
    embeds.get("openticket:error-not-in-guild").workers.add(
        new api.ODWorker("openticket:error-not-in-guild",0,async (instance,params,source) => {
            const {user} = params

            const method = getMethodFromSource(source)

            instance.setColor(generalConfig.data.system.useRedErrorEmbeds ? "Red" : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("❌",lang.getTranslation("errors.titles.notInGuild")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslationWithParams("errors.descriptions.notInGuild",[method]))
        })
    )

    //ERROR CHANNEL RENAME
    embeds.add(new api.ODEmbed("openticket:error-channel-rename"))
    embeds.get("openticket:error-channel-rename").workers.add(
        new api.ODWorker("openticket:error-channel-rename",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:error-ticket-busy"))
    embeds.get("openticket:error-ticket-busy").workers.add(
        new api.ODWorker("openticket:error-ticket-busy",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:help-menu"))
    embeds.get("openticket:help-menu").workers.add(
        new api.ODWorker("openticket:help-menu",0,async (instance,params) => {
            const {mode,page} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("ℹ️",lang.getTranslation("actions.titles.help")))
            instance.setDescription(lang.getTranslation("actions.descriptions.helpExplanation"))
            instance.setThumbnail(openticket.client.client.user.displayAvatarURL())
            
            const data = await openticket.helpmenu.render(mode)
            const currentData = data[page] ?? []
            instance.setFields(currentData)
        })
    )
}

const statsEmbeds = () => {
    //STATS GLOBAL
    embeds.add(new api.ODEmbed("openticket:stats-global"))
    embeds.get("openticket:stats-global").workers.add(
        new api.ODWorker("openticket:stats-global",0,async (instance,params) => {
            const {guild,channel,user} = params
            
            const scope = openticket.stats.get("openticket:global")
            if (!scope) return
            const data = await scope.render("GLOBAL",guild,channel,user)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(scope.name)
            instance.setDescription(data)
            
            if (openticket.permissions.hasPermissions("owner",await openticket.permissions.getPermissions(user,channel,guild))){
                //show system data when owner or developer
                const systemScope = openticket.stats.get("openticket:system")
                if (!systemScope) return
                const systemData = await systemScope.render("GLOBAL",guild,channel,user)
                instance.addFields({name:systemScope.name,value:systemData,inline:false})
            }
        })
    )

    //STATS TICKET
    embeds.add(new api.ODEmbed("openticket:stats-ticket"))
    embeds.get("openticket:stats-ticket").workers.add(
        new api.ODWorker("openticket:stats-ticket",0,async (instance,params) => {
            const {guild,channel,user,scopeData} = params
            
            const scope = openticket.stats.get("openticket:ticket")
            const participantsScope = openticket.stats.get("openticket:participants")
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
    embeds.add(new api.ODEmbed("openticket:stats-user"))
    embeds.get("openticket:stats-user").workers.add([
        new api.ODWorker("openticket:stats-user",0,async (instance,params) => {
            const {guild,channel,user,scopeData} = params
            
            const scope = openticket.stats.get("openticket:user")
            if (!scope) return
            const data = await scope.render(scopeData.id,guild,channel,user)
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(scope.name)
            instance.setDescription(data)
            instance.setThumbnail(scopeData.displayAvatarURL())
        }),
        new api.ODWorker("openticket:easter-egg",-1,async (instance,params) => {
            if (!openticket.flags.exists("openticket:no-easter")) return
            const easterFlag = openticket.flags.get("openticket:no-easter")
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
    embeds.add(new api.ODEmbed("openticket:stats-reset"))
    embeds.get("openticket:stats-reset").workers.add(
        new api.ODWorker("openticket:stats-reset",0,async (instance,params) => {
            const {user,reason} = params
            
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.statsReset")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setDescription(lang.getTranslation("actions.descriptions.statsReset"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //STATS TICKET UNKNOWN
    embeds.add(new api.ODEmbed("openticket:stats-ticket-unknown"))
    embeds.get("openticket:stats-ticket-unknown").workers.add(
        new api.ODWorker("openticket:stats-ticket-unknown",0,async (instance,params) => {
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
    embeds.add(new api.ODEmbed("openticket:panel"))
    embeds.get("openticket:panel").workers.add(
        new api.ODWorker("openticket:panel",0,async (instance,params) => {
            const {panel} = params
            if (!panel.exists("openticket:embed")) return
            const embedOptions = panel.get("openticket:embed").value
            
            instance.setColor(embedOptions.customColor ? embedOptions.customColor : generalConfig.data.mainColor)
            instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.url) instance.setUrl(embedOptions.url)
            if (embedOptions.footer) instance.setFooter(embedOptions.footer)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            
            if (panel.get("openticket:describe-options-in-embed-description").value){
                //describe options in description
                const text = (await import("../data/openticket/panelLoader.js")).describePanelOptions("text",panel)
                instance.setDescription(embedOptions.description+"\n\n"+text)
            }else if (embedOptions.description){
                instance.setDescription(embedOptions.description)
            }

            if (panel.get("openticket:enable-max-tickets-warning-embed").value && generalConfig.data.system.limits.enabled){
                instance.setDescription(instance.data.description+"\n\n*"+lang.getTranslationWithParams("actions.descriptions.ticketMessageLimit",[generalConfig.data.system.limits.userMaximum.toString()])+"*")
            }

            if (panel.get("openticket:describe-options-in-embed-fields").value){
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
    embeds.add(new api.ODEmbed("openticket:ticket-created"))
    embeds.get("openticket:ticket-created").workers.add(
        new api.ODWorker("openticket:ticket-created",0,async (instance,params,source) => {
            const {user} = params

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🎫",lang.getTranslation("actions.titles.created")))
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslation("actions.descriptions.create"))
        })
    )

    //TICKET CREATED DM
    embeds.add(new api.ODEmbed("openticket:ticket-created-dm"))
    embeds.get("openticket:ticket-created-dm").workers.add(
        new api.ODWorker("openticket:ticket-created-dm",0,async (instance,params,source) => {
            const {user,ticket} = params
            const embedOptions = ticket.option.get("openticket:dm-message-embed").value
            
            instance.setColor(embedOptions.customColor ? (embedOptions.customColor as discord.ColorResolvable) : generalConfig.data.mainColor)
            instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            if (embedOptions.description) instance.setDescription(embedOptions.description)
            if (embedOptions.fields) instance.setFields(embedOptions.fields)
            
            if (ticket.get("openticket:closed").value && ticket.get("openticket:autodelete-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutodelete",[ticket.option.get("openticket:autodelete-days").value.toString()]))
            else if (!ticket.get("openticket:closed").value && ticket.get("openticket:autoclose-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutoclose",[ticket.option.get("openticket:autoclose-hours").value.toString()]))       
        })
    )

    //TICKET CREATED LOGS
    embeds.add(new api.ODEmbed("openticket:ticket-created-logs"))
    embeds.get("openticket:ticket-created-logs").workers.add(
        new api.ODWorker("openticket:ticket-created-logs",0,async (instance,params,source) => {
            const {user,ticket} = params
            
            const method = (source == "panel-button" || source == "panel-dropdown") ? lang.getTranslation("params.uppercase.panel") : (source == "slash" || source == "text") ? lang.getTranslation("params.uppercase.command") : lang.getTranslation("params.uppercase.system")
            const blacklisted = openticket.blacklist.exists(user.id) ? lang.getTranslation("params.uppercase.true") : lang.getTranslation("params.uppercase.false")

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🎫",lang.getTranslation("actions.titles.created")))
            instance.setThumbnail(user.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.setDescription(lang.getTranslationWithParams("actions.logs.createLog",[discord.userMention(user.id)]))
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.type")+":",value:"```"+ticket.option.get("openticket:name").value+"```",inline:false},
                {name:lang.getTranslation("params.uppercase.method")+":",value:"```"+method+"```",inline:true},
                {name:lang.getTranslation("params.uppercase.blacklisted")+":",value:"```"+blacklisted+"```", inline:true}
            )
        })
    )

    //TICKET MESSAGE
    embeds.add(new api.ODEmbed("openticket:ticket-message"))
    embeds.get("openticket:ticket-message").workers.add(
        new api.ODWorker("openticket:ticket-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const embedOptions = ticket.option.get("openticket:ticket-message-embed").value
            
            instance.setColor(embedOptions.customColor ? embedOptions.customColor : generalConfig.data.mainColor)
            if (embedOptions.title) instance.setTitle(embedOptions.title)
            if (embedOptions.thumbnail) instance.setThumbnail(embedOptions.thumbnail)
            if (embedOptions.image) instance.setImage(embedOptions.image)
            if (embedOptions.timestamp) instance.setTimestamp(new Date())
            if (embedOptions.description) instance.setDescription(embedOptions.description)
            
            if (ticket.option.get("openticket:questions").value.length > 0){
                const answers = ticket.get("openticket:answers").value
                answers.forEach((answer) => {
                    if (!answer.value || answer.value.length == 0) return
                    if (generalConfig.data.system.questionFieldsInCodeBlock) instance.addFields({name:answer.name,value:"```"+answer.value+"```",inline:false})
                    else instance.addFields({name:answer.name,value:answer.value,inline:false})
                })
            }else if (embedOptions.fields){
                instance.setFields(embedOptions.fields)
            }

            if (ticket.get("openticket:closed").value && ticket.get("openticket:autodelete-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutodelete",[ticket.option.get("openticket:autodelete-days").value.toString()]))
            else if (!ticket.get("openticket:closed").value && ticket.get("openticket:autoclose-enabled").value) instance.setFooter("⏱️ "+lang.getTranslationWithParams("actions.descriptions.ticketMessageAutoclose",[ticket.option.get("openticket:autoclose-hours").value.toString()]))
            
            if (ticket.get("openticket:claimed").value){
                const claimUser = await openticket.tickets.getTicketUser(ticket,"claimer")
                if (!claimUser) return
                instance.setAuthor(lang.getTranslationWithParams("params.uppercase.claimedBy",[claimUser.displayName]),claimUser.displayAvatarURL())
            }
        })
    )

    //TICKET CLOSED
    embeds.add(new api.ODEmbed("openticket:close-message"))
    embeds.get("openticket:close-message").workers.add(
        new api.ODWorker("openticket:close-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔒",lang.getTranslation("actions.titles.close")))
            instance.setDescription(lang.getTranslation("actions.descriptions.close"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET REOPENED
    embeds.add(new api.ODEmbed("openticket:reopen-message"))
    embeds.get("openticket:reopen-message").workers.add(
        new api.ODWorker("openticket:reopen-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔓",lang.getTranslation("actions.titles.reopen")))
            instance.setDescription(lang.getTranslation("actions.descriptions.reopen"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET DELETED
    embeds.add(new api.ODEmbed("openticket:delete-message"))
    embeds.get("openticket:delete-message").workers.add(
        new api.ODWorker("openticket:delete-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🗑️",lang.getTranslation("actions.titles.delete")))
            instance.setDescription(lang.getTranslation("actions.descriptions.delete"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET CLAIMED
    embeds.add(new api.ODEmbed("openticket:claim-message"))
    embeds.get("openticket:claim-message").workers.add(
        new api.ODWorker("openticket:claim-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👋",lang.getTranslation("actions.titles.claim")))
            instance.setDescription(lang.getTranslation("actions.descriptions.claim"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET UNCLAIMED
    embeds.add(new api.ODEmbed("openticket:unclaim-message"))
    embeds.get("openticket:unclaim-message").workers.add(
        new api.ODWorker("openticket:unclaim-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("↩️",lang.getTranslation("actions.titles.unclaim")))
            instance.setDescription(lang.getTranslation("actions.descriptions.unclaim"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET PINNED
    embeds.add(new api.ODEmbed("openticket:pin-message"))
    embeds.get("openticket:pin-message").workers.add(
        new api.ODWorker("openticket:pin-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.pin")))
            instance.setDescription(lang.getTranslation("actions.descriptions.pin"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET UNPINNED
    embeds.add(new api.ODEmbed("openticket:unpin-message"))
    embeds.get("openticket:unpin-message").workers.add(
        new api.ODWorker("openticket:unpin-message",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📌",lang.getTranslation("actions.titles.unpin")))
            instance.setDescription(lang.getTranslation("actions.descriptions.unpin"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET RENAMED
    embeds.add(new api.ODEmbed("openticket:rename-message"))
    embeds.get("openticket:rename-message").workers.add(
        new api.ODWorker("openticket:rename-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔄",lang.getTranslation("actions.titles.rename")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.rename",["`#"+data+"`"]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET MOVED
    embeds.add(new api.ODEmbed("openticket:move-message"))
    embeds.get("openticket:move-message").workers.add(
        new api.ODWorker("openticket:move-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🔀",lang.getTranslation("actions.titles.move")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.move",["`"+data.get("openticket:name").value+"`"]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET USER ADDED
    embeds.add(new api.ODEmbed("openticket:add-message"))
    embeds.get("openticket:add-message").workers.add(
        new api.ODWorker("openticket:add-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.add")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.add",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //TICKET USER REMOVED
    embeds.add(new api.ODEmbed("openticket:remove-message"))
    embeds.get("openticket:remove-message").workers.add(
        new api.ODWorker("openticket:remove-message",0,async (instance,params,source) => {
            const {user,ticket,reason,data} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("👤",lang.getTranslation("actions.titles.remove")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.remove",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )
    
    //TICKET ACTION DM
    embeds.add(new api.ODEmbed("openticket:ticket-action-dm"))
    embeds.get("openticket:ticket-action-dm").workers.add(
        new api.ODWorker("openticket:ticket-action-dm",0,async (instance,params,source) => {
            const {user,mode,ticket,reason,additionalData} = params
            const channel = await openticket.tickets.getTicketChannel(ticket)
            
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
                instance.setDescription(lang.getTranslationWithParams("actions.logs.moveDm",["`"+(additionalData instanceof api.ODTicketOption ? additionalData.get("openticket:name").value : "<unknown>")+"`"]))
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
    embeds.add(new api.ODEmbed("openticket:ticket-action-logs"))
    embeds.get("openticket:ticket-action-logs").workers.add(
        new api.ODWorker("openticket:ticket-action-logs",0,async (instance,params,source) => {
            const {user,mode,ticket,reason,additionalData} = params
            const channel = await openticket.tickets.getTicketChannel(ticket)

            instance.setColor(generalConfig.data.mainColor)
            instance.setThumbnail(user.displayAvatarURL())
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setTimestamp(new Date())
            instance.addFields(
                {name:lang.getTranslation("params.uppercase.ticket")+":",value:"```#"+(channel ? channel.name : "<unknown>")+"```",inline:false},
                //TODO TRANSLATION!!!
                {name:"Option"+":",value:"```"+(ticket.option.get("openticket:name").value)+"```",inline:false},
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
                instance.setDescription(lang.getTranslationWithParams("actions.logs.moveLog",["`"+(additionalData instanceof api.ODTicketOption ? additionalData.get("openticket:name").value : "<unknown>")+"`",discord.userMention(user.id)]))
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
    embeds.add(new api.ODEmbed("openticket:blacklist-view"))
    embeds.get("openticket:blacklist-view").workers.add(
        new api.ODWorker("openticket:blacklist-view",0,async (instance,params,source) => {
            const {user} = params

            const renderedUsers: string[] = []
            await openticket.blacklist.loopAll((blacklist,id) => {renderedUsers.push(discord.userMention(id.value)+" - "+(blacklist.reason ? blacklist.reason : "/"))})

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
    embeds.add(new api.ODEmbed("openticket:blacklist-get"))
    embeds.get("openticket:blacklist-get").workers.add(
        new api.ODWorker("openticket:blacklist-get",0,async (instance,params,source) => {
            const {user,data} = params
            const blacklist = openticket.blacklist.get(data.id)

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
    embeds.add(new api.ODEmbed("openticket:blacklist-add"))
    embeds.get("openticket:blacklist-add").workers.add(
        new api.ODWorker("openticket:blacklist-add",0,async (instance,params,source) => {
            const {user,data,reason} = params
            
            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🚫",lang.getTranslation("actions.titles.blacklistAdd")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.blacklistAdd",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //BLACKLIST REMOVE
    embeds.add(new api.ODEmbed("openticket:blacklist-remove"))
    embeds.get("openticket:blacklist-remove").workers.add(
        new api.ODWorker("openticket:blacklist-remove",0,async (instance,params,source) => {
            const {user,data,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("🆓",lang.getTranslation("actions.titles.blacklistRemove")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.blacklistRemove",[discord.userMention(data.id)]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //BLACKLIST DM
    embeds.add(new api.ODEmbed("openticket:blacklist-dm"))
    embeds.get("openticket:blacklist-dm").workers.add(
        new api.ODWorker("openticket:blacklist-dm",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:blacklist-logs"))
    embeds.get("openticket:blacklist-logs").workers.add(
        new api.ODWorker("openticket:blacklist-logs",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:transcript-text-ready"))
    embeds.get("openticket:transcript-text-ready").workers.add(
        new api.ODWorker("openticket:transcript-text-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler} = params
            const transcriptConfig = openticket.configs.get("openticket:transcripts")
            
            instance.setColor(transcriptConfig.data.embedSettings.customColor ? transcriptConfig.data.embedSettings.customColor : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})

            const creatorId = ticket.get("openticket:opened-by").value
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
    embeds.add(new api.ODEmbed("openticket:transcript-html-ready"))
    embeds.get("openticket:transcript-html-ready").workers.add(
        new api.ODWorker("openticket:transcript-html-ready",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            const transcriptConfig = openticket.configs.get("openticket:transcripts")
            
            instance.setColor(transcriptConfig.data.embedSettings.customColor ? transcriptConfig.data.embedSettings.customColor : generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})
            if (result.data) instance.setUrl(result.data.url)

            const creatorId = ticket.get("openticket:opened-by").value
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
    embeds.add(new api.ODEmbed("openticket:transcript-html-progress"))
    embeds.get("openticket:transcript-html-progress").workers.add(
        new api.ODWorker("openticket:transcript-html-progress",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,remaining} = params
            
            const remainingDate = new Date(new Date().getTime()+remaining)

            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("📄",lang.getTranslation("transcripts.success.ready")))
            instance.setDescription(lang.getTranslation("transcripts.success.htmlProgress"))
            instance.setTimestamp(new Date())
            instance.addFields({name:lang.getTranslation("params.uppercase.remaining")+":",value:discord.time(remainingDate,"R"),inline:false})
            instance.addFields({name:lang.getTranslation("params.uppercase.ticket")+":",value:"#"+channel.name,inline:false})

            const creatorId = ticket.get("openticket:opened-by").value
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
    embeds.add(new api.ODEmbed("openticket:transcript-error"))
    embeds.get("openticket:transcript-error").workers.add(
        new api.ODWorker("openticket:transcript-error",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:reaction-role"))
    embeds.get("openticket:reaction-role").workers.add(
        new api.ODWorker("openticket:reaction-role",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:clear-verify-message"))
    embeds.get("openticket:clear-verify-message").workers.add(
        new api.ODWorker("openticket:clear-verify-message",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:clear-message"))
    embeds.get("openticket:clear-message").workers.add(
        new api.ODWorker("openticket:clear-message",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:clear-logs"))
    embeds.get("openticket:clear-logs").workers.add(
        new api.ODWorker("openticket:clear-logs",0,async (instance,params,source) => {
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
    embeds.add(new api.ODEmbed("openticket:autoclose-message"))
    embeds.get("openticket:autoclose-message").workers.add(
        new api.ODWorker("openticket:autoclose-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const hours: number = ticket.get("openticket:autoclose-hours").value
            const description = (source == "leave") ? lang.getTranslation("actions.descriptions.autocloseLeave") : lang.getTranslationWithParams("actions.descriptions.autocloseTimeout",[hours.toString()])

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autoclose")))
            instance.setDescription(description)
            instance.setTimestamp(new Date())
        })
    )

    //AUTODELETE MESSAGE
    embeds.add(new api.ODEmbed("openticket:autodelete-message"))
    embeds.get("openticket:autodelete-message").workers.add(
        new api.ODWorker("openticket:autodelete-message",0,async (instance,params,source) => {
            const {user,ticket} = params
            const days: number = ticket.get("openticket:autodelete-days").value
            const description = (source == "leave") ? lang.getTranslation("actions.descriptions.autodeleteLeave") : lang.getTranslationWithParams("actions.descriptions.autodeleteTimeout",[days.toString()])

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodelete")))
            instance.setDescription(description)
            instance.setTimestamp(new Date())
        })
    )

    //AUTOCLOSE ENABLE
    embeds.add(new api.ODEmbed("openticket:autoclose-enable"))
    embeds.get("openticket:autoclose-enable").workers.add(
        new api.ODWorker("openticket:autoclose-enable",0,async (instance,params,source) => {
            const {user,ticket,reason,time} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autocloseEnabled")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.autocloseEnabled",[time.toString()]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTODELETE ENABLE
    embeds.add(new api.ODEmbed("openticket:autodelete-enable"))
    embeds.get("openticket:autodelete-enable").workers.add(
        new api.ODWorker("openticket:autodelete-enable",0,async (instance,params,source) => {
            const {user,ticket,reason,time} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodeleteEnabled")))
            instance.setDescription(lang.getTranslationWithParams("actions.descriptions.autodeleteEnabled",[time.toString()]))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTOCLOSE DISABLE
    embeds.add(new api.ODEmbed("openticket:autoclose-disable"))
    embeds.get("openticket:autoclose-disable").workers.add(
        new api.ODWorker("openticket:autoclose-disable",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autocloseDisabled")))
            instance.setDescription(lang.getTranslation("actions.descriptions.autocloseDisabled"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )

    //AUTODELETE DISABLE
    embeds.add(new api.ODEmbed("openticket:autodelete-disable"))
    embeds.get("openticket:autodelete-disable").workers.add(
        new api.ODWorker("openticket:autodelete-disable",0,async (instance,params,source) => {
            const {user,ticket,reason} = params

            instance.setAuthor(user.displayName,user.displayAvatarURL())
            instance.setColor(generalConfig.data.mainColor)
            instance.setTitle(utilities.emojiTitle("⏱️",lang.getTranslation("actions.titles.autodeleteDisabled")))
            instance.setDescription(lang.getTranslation("actions.descriptions.autodeleteDisabled"))
            if (reason) instance.addFields({name:lang.getTranslation("params.uppercase.reason")+":",value:"```"+reason+"```"})
        })
    )
}