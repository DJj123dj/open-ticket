///////////////////////////////////////
//DEFAULT LANGUAGE MODULE
///////////////////////////////////////
import { ODValidId } from "../modules/base"
import { ODLanguageManager, ODLanguage } from "../modules/language"

/**## ODLanguageManagerTranslations_Default `type`
 * This interface is a list of ids available in the `ODLanguageManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export type ODLanguageManagerTranslations_Default = (
    "checker.system.headerOpenTicket"|
    "checker.system.typeError"|
    "checker.system.typeWarning"|
    "checker.system.typeInfo"|
    "checker.system.headerConfigChecker"|
    "checker.system.headerDescription"|
    "checker.system.footerError"|
    "checker.system.footerWarning"|
    "checker.system.footerSupport"|
    "checker.system.compactInformation"|
    "checker.system.dataPath"|
    "checker.system.dataDocs"|
    "checker.system.dataMessages"|
    "checker.messages.invalidType"|
    "checker.messages.propertyMissing"|
    "checker.messages.propertyOptional"|
    "checker.messages.objectDisabled"|
    "checker.messages.nullInvalid"|
    "checker.messages.switchInvalidType"|
    "checker.messages.objectSwitchInvalid"|
    "checker.messages.stringTooShort"|
    "checker.messages.stringTooLong"|
    "checker.messages.stringLengthInvalid"|
    "checker.messages.stringStartsWith"|
    "checker.messages.stringEndsWith"|
    "checker.messages.stringContains"|
    "checker.messages.stringChoices"|
    "checker.messages.stringRegex"|
    "checker.messages.numberTooShort"|
    "checker.messages.numberTooLong"|
    "checker.messages.numberLengthInvalid"|
    "checker.messages.numberTooSmall"|
    "checker.messages.numberTooLarge"|
    "checker.messages.numberNotEqual"|
    "checker.messages.numberStep"|
    "checker.messages.numberStepOffset"|
    "checker.messages.numberStartsWith"|
    "checker.messages.numberEndsWith"|
    "checker.messages.numberContains"|
    "checker.messages.numberChoices"|
    "checker.messages.numberFloat"|
    "checker.messages.numberNegative"|
    "checker.messages.numberPositive"|
    "checker.messages.numberZero"|
    "checker.messages.booleanTrue"|
    "checker.messages.booleanFalse"|
    "checker.messages.arrayEmptyDisabled"|
    "checker.messages.arrayEmptyRequired"|
    "checker.messages.arrayTooShort"|
    "checker.messages.arrayTooLong"|
    "checker.messages.arrayLengthInvalid"|
    "checker.messages.arrayInvalidTypes"|
    "checker.messages.arrayDouble"|
    "checker.messages.discordInvalidId"|
    "checker.messages.discordInvalidIdOptions"|
    "checker.messages.discordInvalidToken"|
    "checker.messages.colorInvalid"|
    "checker.messages.emojiTooShort"|
    "checker.messages.emojiTooLong"|
    "checker.messages.emojiCustom"|
    "checker.messages.emojiInvalid"|
    "checker.messages.urlInvalid"|
    "checker.messages.urlInvalidHttp"|
    "checker.messages.urlInvalidProtocol"|
    "checker.messages.urlInvalidHostname"|
    "checker.messages.urlInvalidExtension"|
    "checker.messages.urlInvalidPath"|
    "checker.messages.idNotUnique"|
    "checker.messages.idNonExistent"|
    "checker.messages.invalidLanguage"|
    "checker.messages.invalidButton"|
    "checker.messages.unusedOption"|
    "checker.messages.unusedQuestion"|
    "checker.messages.dropdownOption"|
    "actions.buttons.create"|
    "actions.buttons.close"|
    "actions.buttons.delete"|
    "actions.buttons.reopen"|
    "actions.buttons.claim"|
    "actions.buttons.unclaim"|
    "actions.buttons.pin"|
    "actions.buttons.unpin"|
    "actions.buttons.clear"|
    "actions.buttons.helpSwitchSlash"|
    "actions.buttons.helpSwitchText"|
    "actions.buttons.helpPage"|
    "actions.buttons.withReason"|
    "actions.buttons.withoutTranscript"|

    "actions.titles.created"|
    "actions.titles.close"|
    "actions.titles.delete"|
    "actions.titles.reopen"|
    "actions.titles.claim"|
    "actions.titles.unclaim"|
    "actions.titles.pin"|
    "actions.titles.unpin"|
    "actions.titles.rename"|
    "actions.titles.move"|
    "actions.titles.add"|
    "actions.titles.remove"|

    "actions.titles.help"|
    "actions.titles.statsReset"|
    "actions.titles.blacklistAdd"|
    "actions.titles.blacklistRemove"|
    "actions.titles.blacklistGet"|
    "actions.titles.blacklistView"|
    "actions.titles.blacklistAddDm"|
    "actions.titles.blacklistRemoveDm"|
    "actions.titles.clear"|
    "actions.titles.roles"|

    "actions.titles.autoclose"|
    "actions.titles.autocloseEnabled"|
    "actions.titles.autocloseDisabled"|
    "actions.titles.autodelete"|
    "actions.titles.autodeleteEnabled"|
    "actions.titles.autodeleteDisabled"|

    "actions.descriptions.create"|
    "actions.descriptions.close"|
    "actions.descriptions.delete"|
    "actions.descriptions.reopen"|
    "actions.descriptions.claim"|
    "actions.descriptions.unclaim"|
    "actions.descriptions.pin"|
    "actions.descriptions.unpin"|
    "actions.descriptions.rename"|
    "actions.descriptions.move"|
    "actions.descriptions.add"|
    "actions.descriptions.remove"|

    "actions.descriptions.helpExplanation"|
    "actions.descriptions.statsReset"|
    "actions.descriptions.statsError"|
    "actions.descriptions.blacklistAdd"|
    "actions.descriptions.blacklistRemove"|
    "actions.descriptions.blacklistGetSuccess"|
    "actions.descriptions.blacklistGetEmpty"|
    "actions.descriptions.blacklistViewEmpty"|
    "actions.descriptions.blacklistViewTip"|
    "actions.descriptions.clearVerify"|
    "actions.descriptions.clearReady"|
    "actions.descriptions.rolesEmpty"|

    "actions.descriptions.autocloseLeave"|
    "actions.descriptions.autocloseTimeout"|
    "actions.descriptions.autodeleteLeave"|
    "actions.descriptions.autodeleteTimeout"|
    "actions.descriptions.autocloseEnabled"|
    "actions.descriptions.autocloseDisabled"|
    "actions.descriptions.autodeleteEnabled"|
    "actions.descriptions.autodeleteDisabled"|

    "actions.descriptions.ticketMessageLimit"|
    "actions.descriptions.ticketMessageAutoclose"|
    "actions.descriptions.ticketMessageAutodelete"|
    "actions.descriptions.panelReady"|

    "actions.modal.closePlaceholder"|
    "actions.modal.deletePlaceholder"|
    "actions.modal.reopenPlaceholder"|
    "actions.modal.claimPlaceholder"|
    "actions.modal.unclaimPlaceholder"|
    "actions.modal.pinPlaceholder"|
    "actions.modal.unpinPlaceholder"|

    "actions.logs.createLog"|
    "actions.logs.closeLog"|
    "actions.logs.closeDm"|
    "actions.logs.deleteLog"|
    "actions.logs.deleteDm"|
    "actions.logs.reopenLog"|
    "actions.logs.reopenDm"|
    "actions.logs.claimLog"|
    "actions.logs.claimDm"|
    "actions.logs.unclaimLog"|
    "actions.logs.unclaimDm"|
    "actions.logs.pinLog"|
    "actions.logs.pinDm"|
    "actions.logs.unpinLog"|
    "actions.logs.unpinDm"|
    "actions.logs.renameLog"|
    "actions.logs.renameDm"|
    "actions.logs.moveLog"|
    "actions.logs.moveDm"|
    "actions.logs.addLog"|
    "actions.logs.addDm"|
    "actions.logs.removeLog"|
    "actions.logs.removeDm"|

    "actions.logs.blacklistAddLog"|
    "actions.logs.blacklistRemoveLog"|
    "actions.logs.blacklistAddDm"|
    "actions.logs.blacklistRemoveDm"|
    "actions.logs.clearLog"|

    "transcripts.success.visit"|
    "transcripts.success.ready"|
    "transcripts.success.textFileDescription"|
    "transcripts.success.htmlProgress"|

    "transcripts.success.createdChannel"|
    "transcripts.success.createdCreator"|
    "transcripts.success.createdParticipant"|
    "transcripts.success.createdActiveAdmin"|
    "transcripts.success.createdEveryAdmin"|
    "transcripts.success.createdOther"|

    "transcripts.errors.retry"|
    "transcripts.errors.continue"|
    "transcripts.errors.backup"|
    "transcripts.errors.error"|

    "errors.titles.internalError"|
    "errors.titles.optionMissing"|
    "errors.titles.optionInvalid"|
    "errors.titles.unknownCommand"|
    "errors.titles.noPermissions"|
    "errors.titles.unknownTicket"|
    "errors.titles.deprecatedTicket"|
    "errors.titles.unknownOption"|
    "errors.titles.unknownPanel"|
    "errors.titles.notInGuild"|
    "errors.titles.channelRename"|
    "errors.titles.busy"|

    "errors.descriptions.askForInfo"|
    "errors.descriptions.askForInfoResolve"|
    "errors.descriptions.internalError"|
    "errors.descriptions.optionMissing"|
    "errors.descriptions.optionInvalid"|
    "errors.descriptions.optionInvalidChoose"|
    "errors.descriptions.unknownCommand"|
    "errors.descriptions.noPermissions"|
    "errors.descriptions.noPermissionsList"|
    "errors.descriptions.noPermissionsCooldown"|
    "errors.descriptions.noPermissionsBlacklist"|
    "errors.descriptions.noPermissionsLimitGlobal"|
    "errors.descriptions.noPermissionsLimitGlobalUser"|
    "errors.descriptions.noPermissionsLimitOption"|
    "errors.descriptions.noPermissionsLimitOptionUser"|
    "errors.descriptions.unknownTicket"|
    "errors.descriptions.deprecatedTicket"|
    "errors.descriptions.notInGuild"|
    "errors.descriptions.channelRename"|
    "errors.descriptions.channelRenameSource"|
    "errors.descriptions.busy"|

    "errors.optionInvalidReasons.stringRegex"|
    "errors.optionInvalidReasons.stringMinLength"|
    "errors.optionInvalidReasons.stringMaxLength"|
    "errors.optionInvalidReasons.numberInvalid"|
    "errors.optionInvalidReasons.numberMin"|
    "errors.optionInvalidReasons.numberMax"|
    "errors.optionInvalidReasons.numberDecimal"|
    "errors.optionInvalidReasons.numberNegative"|
    "errors.optionInvalidReasons.numberPositive"|
    "errors.optionInvalidReasons.numberZero"|
    "errors.optionInvalidReasons.channelNotFound"|
    "errors.optionInvalidReasons.userNotFound"|
    "errors.optionInvalidReasons.roleNotFound"|
    "errors.optionInvalidReasons.memberNotFound"|
    "errors.optionInvalidReasons.mentionableNotFound"|
    "errors.optionInvalidReasons.channelType"|
    "errors.optionInvalidReasons.notInGuild"|

    "errors.permissions.developer"|
    "errors.permissions.owner"|
    "errors.permissions.admin"|
    "errors.permissions.moderator"|
    "errors.permissions.support"|
    "errors.permissions.member"|
    "errors.permissions.discord-administrator"|

    "errors.actionInvalid.close"|
    "errors.actionInvalid.reopen"|
    "errors.actionInvalid.claim"|
    "errors.actionInvalid.unclaim"|
    "errors.actionInvalid.pin"|
    "errors.actionInvalid.unpin"|
    "errors.actionInvalid.add"|
    "errors.actionInvalid.remove"|

    "params.uppercase.ticket"|
    "params.uppercase.tickets"|
    "params.uppercase.reason"|
    "params.uppercase.creator"|
    "params.uppercase.remaining"|
    "params.uppercase.added"|
    "params.uppercase.removed"|
    "params.uppercase.filter"|
    "params.uppercase.claimedBy"|
    "params.uppercase.method"|
    "params.uppercase.type"|
    "params.uppercase.blacklisted"|
    "params.uppercase.panel"|
    "params.uppercase.command"|
    "params.uppercase.system"|
    "params.uppercase.true"|
    "params.uppercase.false"|
    "params.uppercase.syntax"|
    "params.uppercase.originalName"|
    "params.uppercase.newName"|
    "params.uppercase.until"|
    "params.uppercase.validOptions"|
    "params.uppercase.validPanels"|
    "params.uppercase.autoclose"|
    "params.uppercase.autodelete"|
    "params.uppercase.startupDate"|
    "params.uppercase.version"|
    "params.uppercase.name"|
    "params.uppercase.role"|
    "params.uppercase.status"|
    "params.uppercase.claimed"|
    "params.uppercase.pinned"|
    "params.uppercase.creationDate"|

    "params.lowercase.text"|
    "params.lowercase.html"|
    "params.lowercase.command"|
    "params.lowercase.modal"|
    "params.lowercase.button"|
    "params.lowercase.dropdown"|
    "params.lowercase.method"|

    "commands.reason"|
    "commands.help"|
    "commands.panel"|
    "commands.panelId"|
    "commands.panelAutoUpdate"|
    "commands.ticket"|
    "commands.ticketId"|
    "commands.close"|
    "commands.delete"|
    "commands.deleteNoTranscript"|
    "commands.reopen"|
    "commands.claim"|
    "commands.claimUser"|
    "commands.unclaim"|
    "commands.pin"|
    "commands.unpin"|
    "commands.move"|
    "commands.moveId"|
    "commands.rename"|
    "commands.renameName"|
    "commands.add"|
    "commands.addUser"|
    "commands.remove"|
    "commands.removeUser"|
    "commands.blacklist"|
    "commands.blacklistView"|
    "commands.blacklistAdd"|
    "commands.blacklistRemove"|
    "commands.blacklistGet"|
    "commands.blacklistGetUser"|
    "commands.stats"|
    "commands.statsReset"|
    "commands.statsGlobal"|
    "commands.statsUser"|
    "commands.statsUserUser"|
    "commands.statsTicket"|
    "commands.statsTicketTicket"|
    "commands.clear"|
    "commands.clearFilter"|

    "commands.clearFilters.all"|
    "commands.clearFilters.open"|
    "commands.clearFilters.close"|
    "commands.clearFilters.claim"|
    "commands.clearFilters.unclaim"|
    "commands.clearFilters.pin"|
    "commands.clearFilters.unpin"|
    "commands.clearFilters.autoclose"|

    "commands.autoclose"|
    "commands.autocloseDisable"|
    "commands.autocloseEnable"|
    "commands.autocloseEnableTime"|
    "commands.autodelete"|
    "commands.autodeleteDisable"|
    "commands.autodeleteEnable"|
    "commands.autodeleteEnableTime"|

    "helpMenu.help"|
    "helpMenu.ticket"|
    "helpMenu.close"|
    "helpMenu.delete"|
    "helpMenu.reopen"|
    "helpMenu.pin"|
    "helpMenu.unpin"|
    "helpMenu.move"|
    "helpMenu.rename"|
    "helpMenu.claim"|
    "helpMenu.unclaim"|
    "helpMenu.add"|
    "helpMenu.remove"|
    "helpMenu.panel"|
    "helpMenu.blacklistView"|
    "helpMenu.blacklistAdd"|
    "helpMenu.blacklistRemove"|
    "helpMenu.blacklistGet"|
    "helpMenu.statsGlobal"|
    "helpMenu.statsTicket"|
    "helpMenu.statsUser"|
    "helpMenu.statsReset"|
    "helpMenu.autocloseDisable"|
    "helpMenu.autocloseEnable"|
    "helpMenu.autodeleteDisable"|
    "helpMenu.autodeleteEnable"|

    "stats.scopes.global"|
    "stats.scopes.system"|
    "stats.scopes.user"|
    "stats.scopes.ticket"|
    "stats.scopes.participants"|

    "stats.properties.ticketsCreated"|
    "stats.properties.ticketsClosed"|
    "stats.properties.ticketsDeleted"|
    "stats.properties.ticketsReopened"|
    "stats.properties.ticketsAutoclosed"|
    "stats.properties.ticketsClaimed"|
    "stats.properties.ticketsPinned"|
    "stats.properties.ticketsMoved"|
    "stats.properties.usersBlacklisted"|
    "stats.properties.transcriptsCreated"
)

/**## ODLanguageManagerIds_Default `interface`
 * This interface is a list of ids available in the `ODLanguageManager_Default` class.
 * It's used to generate typescript declarations for this class.
 */
export interface ODLanguageManagerIds_Default {
    "opendiscord:custom":ODLanguage,
    "opendiscord:english":ODLanguage,
    "opendiscord:dutch":ODLanguage,
    "opendiscord:portuguese":ODLanguage,
    "opendiscord:czech":ODLanguage,
    "opendiscord:german":ODLanguage,
    "opendiscord:catalan":ODLanguage,
    "opendiscord:hungarian":ODLanguage,
    "opendiscord:spanish":ODLanguage,
    "opendiscord:romanian":ODLanguage,
    "opendiscord:ukrainian":ODLanguage,
    "opendiscord:indonesian":ODLanguage,
    "opendiscord:italian":ODLanguage,
    "opendiscord:estonian":ODLanguage,
    "opendiscord:finnish":ODLanguage,
    "opendiscord:danish":ODLanguage,
    "opendiscord:thai":ODLanguage,
    "opendiscord:turkish":ODLanguage,
    "opendiscord:french":ODLanguage,
    "opendiscord:arabic":ODLanguage,
    "opendiscord:hindi":ODLanguage,
    "opendiscord:lithuanian":ODLanguage,
    "opendiscord:polish":ODLanguage,
    //ADD NEW LANGUAGES HERE!!!
}

/**## ODLanguageManager_Default `default_class`
 * This is a special class that adds type definitions & typescript to the ODLanguageManager class.
 * It doesn't add any extra features!
 * 
 * This default class is made for the global variable `opendiscord.languages`!
 */
export class ODLanguageManager_Default extends ODLanguageManager {
    get<LanguageId extends keyof ODLanguageManagerIds_Default>(id:LanguageId): ODLanguageManagerIds_Default[LanguageId]
    get(id:ODValidId): ODLanguage|null
    
    get(id:ODValidId): ODLanguage|null {
        return super.get(id)
    }

    remove<LanguageId extends keyof ODLanguageManagerIds_Default>(id:LanguageId): ODLanguageManagerIds_Default[LanguageId]
    remove(id:ODValidId): ODLanguage|null
    
    remove(id:ODValidId): ODLanguage|null {
        return super.remove(id)
    }

    exists(id:keyof ODLanguageManagerIds_Default): boolean
    exists(id:ODValidId): boolean
    
    exists(id:ODValidId): boolean {
        return super.exists(id)
    }

    getTranslation(id:ODLanguageManagerTranslations_Default): string
    getTranslation(id:string): string|null

    getTranslation(id:string): string|null {
        return super.getTranslation(id)
    }

    setCurrentLanguage(id:keyof ODLanguageManagerIds_Default): void
    setCurrentLanguage(id:ODValidId): void

    setCurrentLanguage(id:ODValidId): void {
        return super.setCurrentLanguage(id)
    }

    setBackupLanguage(id:keyof ODLanguageManagerIds_Default): void
    setBackupLanguage(id:ODValidId): void

    setBackupLanguage(id:ODValidId): void {
        return super.setBackupLanguage(id)
    }

    getTranslationWithParams(id:ODLanguageManagerTranslations_Default, params:string[]): string
    getTranslationWithParams(id:string, params:string[]): string|null

    getTranslationWithParams(id:string, params:string[]): string|null {
        return super.getTranslationWithParams(id,params)
    }
}