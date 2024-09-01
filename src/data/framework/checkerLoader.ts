import {openticket, api, utilities} from "../../index"

const generalConfig = openticket.configs.get("openticket:general")

export const loadAllConfigCheckers = async () => {
    openticket.checkers.add(new api.ODChecker("openticket:general",openticket.checkers.storage,0,openticket.configs.get("openticket:general"),defaultGeneralStructure))
        openticket.checkers.add(new api.ODChecker("openticket:options",openticket.checkers.storage,1,openticket.configs.get("openticket:options"),defaultOptionsStructure))
        openticket.checkers.add(new api.ODChecker("openticket:panels",openticket.checkers.storage,0,openticket.configs.get("openticket:panels"),defaultPanelsStructure))
        openticket.checkers.add(new api.ODChecker("openticket:questions",openticket.checkers.storage,2,openticket.configs.get("openticket:questions"),defaultQuestionsStructure))
        openticket.checkers.add(new api.ODChecker("openticket:transcripts",openticket.checkers.storage,0,openticket.configs.get("openticket:transcripts"),defaultTranscriptsStructure))
}

export const loadAllConfigCheckerFunctions = async () => {
    openticket.checkers.functions.add(new api.ODCheckerFunction("openticket:unused-options",defaultUnusedOptionsFunction))
    openticket.checkers.functions.add(new api.ODCheckerFunction("openticket:unused-questions",defaultUnusedQuestionsFunction))
    openticket.checkers.functions.add(new api.ODCheckerFunction("openticket:dropdown-options",defaultDropdownOptionsFunction))
}

export const loadAllConfigCheckerTranslations = async () => {
    if ((generalConfig && generalConfig.data.system && generalConfig.data.system.useTranslatedConfigChecker) ? generalConfig.data.system.useTranslatedConfigChecker : false){
        registerDefaultCheckerSystemTranslations() //translate checker system text
        registerDefaultCheckerMessageTranslations() //translate checker messages
        registerDefaultCheckerCustomTranslations() //translate custom checker messages
    }
}

//GLOBAL FUNCTIONS
export const registerDefaultCheckerSystemTranslations = () => {
    const tm = openticket.checkers.translation
    const lm = openticket.languages

    //SYSTEM
    //tm.quickTranslate(lm,"checker.system.headerOpenTicket","other","openticket:header-openticket") //OPEN TICKET (ignore)
    tm.quickTranslate(lm,"checker.system.typeError","other","openticket:type-error") // [ERROR] (ignore)
    tm.quickTranslate(lm,"checker.system.typeWarning","other","openticket:type-warning") // [WARNING] (ignore)
    tm.quickTranslate(lm,"checker.system.typeInfo","other","openticket:type-info") // [INFO] (ignore)
    tm.quickTranslate(lm,"checker.system.headerConfigChecker","other","openticket:header-configchecker") // CONFIG CHECKER
    tm.quickTranslate(lm,"checker.system.headerDescription","other","openticket:header-description") // check for errors in you config files!
    tm.quickTranslate(lm,"checker.system.footerError","other","openticket:footer-error") // the bot won't start until all {0}'s are fixed!
    tm.quickTranslate(lm,"checker.system.footerWarning","other","openticket:footer-warning") // it's recommended to fix all {0}'s before starting!
    tm.quickTranslate(lm,"checker.system.footerSupport","other","openticket:footer-support") // SUPPORT: {0} - DOCS: {1}
    tm.quickTranslate(lm,"checker.system.compactInformation","other","openticket:compact-information") // use {0} for more information!
    tm.quickTranslate(lm,"checker.system.dataPath","other","openticket:data-path") // path
    tm.quickTranslate(lm,"checker.system.dataDocs","other","openticket:data-docs") // docs
    tm.quickTranslate(lm,"checker.system.dataMessages","other","openticket:data-message") // message
}

export const registerDefaultCheckerMessageTranslations = () => {
    const tm = openticket.checkers.translation
    const lm = openticket.languages

    //STRUCTURES
    tm.quickTranslate(lm,"checker.messages.invalidType","message","openticket:invalid-type") // This property needs to be the type: {0}!
    tm.quickTranslate(lm,"checker.messages.propertyMissing","message","openticket:property-missing") // The property {0} is missing from this object!
    tm.quickTranslate(lm,"checker.messages.propertyOptional","message","openticket:property-optional") // The property {0} is optional in this object!
    tm.quickTranslate(lm,"checker.messages.objectDisabled","message","openticket:object-disabled") // This object is disabled, enable it using {0}!
    tm.quickTranslate(lm,"checker.messages.nullInvalid","message","openticket:null-invalid") // This property can't be null!
    tm.quickTranslate(lm,"checker.messages.switchInvalidType","message","openticket:switch-invalid-type") // This needs to be one of the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.objectSwitchInvalid","message","openticket:object-switch-invalid-type") // This object needs to be one of the following types: {0}!

    tm.quickTranslate(lm,"checker.messages.stringTooShort","message","openticket:string-too-short") // This string can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringTooLong","message","openticket:string-too-long") // This string can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringLengthInvalid","message","openticket:string-length-invalid") // This string needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.stringStartsWith","message","openticket:string-starts-with") // This string needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.stringEndsWith","message","openticket:string-ends-with") // This string needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.stringContains","message","openticket:string-contains") // This string needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.stringChoices","message","openticket:string-choices") // This string can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.stringRegex","message","openticket:string-regex") // This string is invalid!

    tm.quickTranslate(lm,"checker.messages.numberTooShort","message","openticket:number-too-short") // This number can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberTooLong","message","openticket:number-too-long") // This number can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberLengthInvalid","message","openticket:number-length-invalid") // This number needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.numberTooSmall","message","openticket:number-too-small") // This number needs to be at least {0}!
    tm.quickTranslate(lm,"checker.messages.numberTooLarge","message","openticket:number-too-large") // This number needs to be at most {0}!
    tm.quickTranslate(lm,"checker.messages.numberNotEqual","message","openticket:number-not-equal") // This number needs to be {0}!
    tm.quickTranslate(lm,"checker.messages.numberStep","message","openticket:number-step") // This number needs to be a multiple of {0}!
    tm.quickTranslate(lm,"checker.messages.numberStepOffset","message","openticket:number-step-offset") // This number needs to be a multiple of {0} starting with {1}!
    tm.quickTranslate(lm,"checker.messages.numberStartsWith","message","openticket:number-starts-with") // This number needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.numberEndsWith","message","openticket:number-ends-with") // This number needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.numberContains","message","openticket:number-contains") // This number needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.numberChoices","message","openticket:number-choices") // This number can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.numberFloat","message","openticket:number-float") // This number can't be a decimal!
    tm.quickTranslate(lm,"checker.messages.numberNegative","message","openticket:number-negative") // This number can't be negative!
    tm.quickTranslate(lm,"checker.messages.numberPositive","message","openticket:number-positive") // This number can't be positive!
    tm.quickTranslate(lm,"checker.messages.numberZero","message","openticket:number-zero") // This number can't be zero!

    tm.quickTranslate(lm,"checker.messages.booleanTrue","message","openticket:boolean-true") // This boolean can't be true!
    tm.quickTranslate(lm,"checker.messages.booleanFalse","message","openticket:boolean-false") // This boolean can't be false!

    tm.quickTranslate(lm,"checker.messages.arrayEmptyDisabled","message","openticket:array-empty-disabled") // This array isn't allowed to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayEmptyRequired","message","openticket:array-empty-required") // This array is required to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayTooShort","message","openticket:array-too-short") // This array needs to have a length of at least {0}!
    tm.quickTranslate(lm,"checker.messages.arrayTooLong","message","openticket:array-too-long") // This array needs to have a length of at most {0}!
    tm.quickTranslate(lm,"checker.messages.arrayLengthInvalid","message","openticket:array-length-invalid") // This array needs to have a length of {0}!
    tm.quickTranslate(lm,"checker.messages.arrayInvalidTypes","message","openticket:array-invalid-types") // This array can only contain the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.arrayDouble","message","openticket:array-double") // This array doesn't allow the same value twice!

    tm.quickTranslate(lm,"checker.messages.discordInvalidId","message","openticket:discord-invalid-id") // This is an invalid discord {0} id!
    tm.quickTranslate(lm,"checker.messages.discordInvalidIdOptions","message","openticket:discord-invalid-id-options") // This is an invalid discord {0} id! You can also use one of these: {1}!
    tm.quickTranslate(lm,"checker.messages.discordInvalidToken","message","openticket:discord-invalid-token") // This is an invalid discord token (syntactically)!
    tm.quickTranslate(lm,"checker.messages.colorInvalid","message","openticket:color-invalid") // This is an invalid hex color!
    tm.quickTranslate(lm,"checker.messages.emojiTooShort","message","openticket:emoji-too-short") // This string needs to have at least {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiTooLong","message","openticket:emoji-too-long") // This string needs to have at most {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiCustom","message","openticket:emoji-custom") // This emoji can't be a custom discord emoji!
    tm.quickTranslate(lm,"checker.messages.emojiInvalid","message","openticket:emoji-invalid") // This is an invalid emoji!
    tm.quickTranslate(lm,"checker.messages.urlInvalid","message","openticket:url-invalid") // This url is invalid!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHttp","message","openticket:url-invalid-http") // This url can only use the https:// protocol!
    tm.quickTranslate(lm,"checker.messages.urlInvalidProtocol","message","openticket:url-invalid-protocol") // This url can only use the http:// & https:// protocols!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHostname","message","openticket:url-invalid-hostname") // This url has a disallowed hostname!
    tm.quickTranslate(lm,"checker.messages.urlInvalidExtension","message","openticket:url-invalid-extension") // This url has an invalid extension! Choose between: {0}!
    tm.quickTranslate(lm,"checker.messages.urlInvalidPath","message","openticket:url-invalid-path") // This url has an invalid path!
    tm.quickTranslate(lm,"checker.messages.idNotUnique","message","openticket:id-not-unique") // This id isn't unique, use another id instead!
    tm.quickTranslate(lm,"checker.messages.idNonExistent","message","openticket:id-non-existent") // The id {0} doesn't exist!
}

export const registerDefaultCheckerCustomTranslations = () => {
    const tm = openticket.checkers.translation
    const lm = openticket.languages

    //CUSTOM
    tm.quickTranslate(lm,"checker.messages.invalidLanguage","message","openticket:invalid-language") // This is an invalid language!
    tm.quickTranslate(lm,"checker.messages.invalidButton","message","openticket:invalid-button") // This button needs to have at least an {0} or {1}!
    tm.quickTranslate(lm,"checker.messages.unusedOption","message","openticket:unused-option") // The option {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.unusedQuestion","message","openticket:unused-question") // The question {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.dropdownOption","message","openticket:dropdown-option") // A panel with dropdown enabled can only contain options of the 'ticket' type!
}

//UTILITY FUNCTIONS
const createMsgStructure = (id:api.ODValidId) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"dm",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:msg-dm",{})},
        {key:"logs",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:msg-logs",{})},
    ]})
}
const createTicketEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"title",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-embed-text",{maxLength:256})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-embed-description",{maxLength:4096})},
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:ticket-embed-color",true,true)},
        
        {key:"image",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:ticket-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"thumbnail",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:ticket-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"fields",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("openticket:ticket-embed-fields",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("openticket:ticket-embed-fields",{children:[
            {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-embed-field-name",{minLength:1,maxLength:256})},
            {key:"value",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-embed-field-value",{minLength:1,maxLength:1024})},
            {key:"inline",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-embed-field-inline",{})}
        ]})})},
        {key:"timestamp",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-embed-timestamp",{})}
    ]})})
}
const createTicketPingStructure = (id:api.ODValidId) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"@here",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-ping-here",{})},
        {key:"@everyone",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-ping-everyone",{})},
        {key:"custom",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:ticket-ping-custom","role",[],{allowDoubles:false})},
    ]})
}
const createPanelEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"title",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-embed-text",{maxLength:256})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-embed-description",{maxLength:4096})},
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:panel-embed-color",true,true)},
        {key:"url",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:panel-embed-url",true,{allowHttp:false})},

        {key:"image",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:panel-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"thumbnail",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:panel-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        
        {key:"footer",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-embed-footer",{maxLength:2048})},
        {key:"fields",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("openticket:panel-embed-fields",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("openticket:panel-embed-fields",{children:[
            {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-embed-field-name",{minLength:1,maxLength:256})},
            {key:"value",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-embed-field-value",{minLength:1,maxLength:1024})},
            {key:"inline",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-embed-field-inline",{})}
        ]})})},
        {key:"timestamp",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-embed-timestamp",{})}
    ]})})
}

//STRUCTURES
export const defaultGeneralStructure = new api.ODCheckerObjectStructure("openticket:general",{children:[
    //BASIC
    {key:"token",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordToken("openticket:token")},
    {key:"tokenFromENV",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:token-env",{})},
    {key:"mainColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:main-color",true,false)},
    {key:"language",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:language",{
        custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            else if (!openticket.defaults.getDefault("languageList").includes(value)){
                checker.createMessage("openticket:invalid-language","error","This is an invalid language!",lt,null,[],locationId,locationDocs)
                return false
            }else return true
        },
    })},
    {key:"prefix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:prefix",{minLength:1})},
    {key:"serverId",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:server-id","server",false,[])},
    {key:"globalAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:global-admins","role",[],{allowDoubles:false})},
    {key:"slashCommands",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:slash-commands",{})},
    {key:"textCommands",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:text-commands",{})},

    //STATUS
    {key:"status",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:status",{
        property:"enabled",
        enabledValue:true,
        checker:new api.ODCheckerObjectStructure("openticket:status",{children:[
            {key:"type",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:status-type",{choices:["listening","watching","playing","custom"]})},
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:status-text",{minLength:1,maxLength:128})},
            {key:"status",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:status-type",{choices:["online","invisible","idle","dnd"]})},
        ]})
    })},

    //SYSTEM
    {key:"system",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:system",{children:[
        {key:"removeParticipantsOnClose",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:remove-participants-on-close",{})},
        {key:"replyOnTicketCreation",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:reply-on-ticket-creation",{})},
        {key:"replyOnReactionRole",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:reply-on-reaction-role",{})},
        {key:"useTranslatedConfigChecker",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:use-translated-config-checker",{})},
        {key:"preferSlashOverText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:prefer-slash-over-text",{})},
        {key:"sendErrorOnUnknownCommand",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:send-error-on-unknown-command",{})},
        {key:"questionFieldsInCodeBlock",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:question-fields-in-code-block",{})},
        {key:"disableVerifyBars",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:disable-verify-bars",{})},
        {key:"useRedErrorEmbeds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:use-red-error-embeds",{})},
        {key:"emojiStyle",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:emoji-style",{choices:["before","after","double","disabled"]})},

        {key:"enableTicketClaimButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-ticket-claim-buttons",{})},
        {key:"enableTicketCloseButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-ticket-close-buttons",{})},
        {key:"enableTicketPinButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-ticket-pin-buttons",{})},
        {key:"enableTicketDeleteButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-ticket-delete-buttons",{})},
        {key:"enableTicketActionWithReason",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-ticket-action-with-reason",{})},
        {key:"enableDeleteWithoutTranscript",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:enable-delete-without-transcript",{})},

        {key:"logs",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:system-logs",{
            property:"enabled",
            enabledValue:true,
            checker:new api.ODCheckerObjectStructure("openticket:system-logs",{children:[
                {key:"channel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:log-channel","channel",false,[])},
            ]})
        })},

        {key:"limits",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:limits",{children:[
            {key:"globalMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})},
            {key:"userMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})}
        ]})})},

        {key:"permissions",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:system-permissions",{children:[
            {key:"help",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-help","role",false,["admin","everyone","none"])},
            {key:"panel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-panel","role",false,["admin","everyone","none"])},
            {key:"ticket",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-ticket","role",false,["admin","everyone","none"])},
            {key:"close",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-close","role",false,["admin","everyone","none"])},
            {key:"delete",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-delete","role",false,["admin","everyone","none"])},
            {key:"reopen",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-reopen","role",false,["admin","everyone","none"])},
            {key:"claim",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-claim","role",false,["admin","everyone","none"])},
            {key:"unclaim",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-unclaim","role",false,["admin","everyone","none"])},
            {key:"pin",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-pin","role",false,["admin","everyone","none"])},
            {key:"unpin",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-unpin","role",false,["admin","everyone","none"])},
            {key:"move",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-move","role",false,["admin","everyone","none"])},
            {key:"rename",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-rename","role",false,["admin","everyone","none"])},
            {key:"add",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-add","role",false,["admin","everyone","none"])},
            {key:"remove",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-remove","role",false,["admin","everyone","none"])},
            {key:"blacklist",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-blacklist","role",false,["admin","everyone","none"])},
            {key:"stats",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-stats","role",false,["admin","everyone","none"])},
            {key:"clear",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-clear","role",false,["admin","everyone","none"])},
            {key:"autoclose",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-autoclose","role",false,["admin","everyone","none"])},
            {key:"autodelete",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:permissions-autodelete","role",false,["admin","everyone","none"])}
        ]})},

        {key:"messages",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:system-permissions",{children:[
            {key:"creation",optional:false,priority:0,checker:createMsgStructure("openticket:msg-creation")},
            {key:"closing",optional:false,priority:0,checker:createMsgStructure("openticket:msg-closing")},
            {key:"deleting",optional:false,priority:0,checker:createMsgStructure("openticket:msg-deleting")},
            {key:"reopening",optional:false,priority:0,checker:createMsgStructure("openticket:msg-reopening")},
            {key:"claiming",optional:false,priority:0,checker:createMsgStructure("openticket:msg-claiming")},
            {key:"pinning",optional:false,priority:0,checker:createMsgStructure("openticket:msg-pinning")},
            {key:"adding",optional:false,priority:0,checker:createMsgStructure("openticket:msg-adding")},
            {key:"removing",optional:false,priority:0,checker:createMsgStructure("openticket:msg-removing")},
            {key:"renaming",optional:false,priority:0,checker:createMsgStructure("openticket:msg-renaming")},
            {key:"moving",optional:false,priority:0,checker:createMsgStructure("openticket:msg-moving")},
            {key:"blacklisting",optional:false,priority:0,checker:createMsgStructure("openticket:msg-blacklisting")},
            {key:"roleAdding",optional:false,priority:0,checker:createMsgStructure("openticket:msg-role-adding")},
            {key:"roleRemoving",optional:false,priority:0,checker:createMsgStructure("openticket:msg-role-removing")}
        ]})},
    ]})}
]})

export const defaultOptionsStructure = new api.ODCheckerArrayStructure("openticket:options",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectSwitchStructure("openticket:options",{objects:[
    //TICKET
    {name:"ticket",priority:0,properties:[{key:"type",value:"ticket"}],checker:new api.ODCheckerObjectStructure("openticket:ticket",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("openticket:ticket-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-name",{minLength:3,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-description",{maxLength:256})},

        //TICKET BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("openticket:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-button-label",{maxLength:50})},
            {key:"color",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-button-color",{choices:["gray","red","green","blue"]})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("openticket:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //TICKET ADMINS
        {key:"ticketAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:ticket-ticket-admins","role",[],{allowDoubles:false})},
        {key:"readonlyAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:ticket-readonly-admins","role",[],{allowDoubles:false})},
        {key:"allowCreationByBlacklistedUsers",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-allow-blacklisted-users",{})},
        {key:"questions",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueIdArray("openticket:option-questions","openticket","question-ids","question-ids-used",{allowDoubles:false,maxLength:5})},

        //TICKET CHANNEL
        {key:"channel",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-channel",{children:[
            {key:"prefix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-channel-prefix",{maxLength:25,regex:/^[^\s]*$/})},
            {key:"suffix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-channel-suffix",{choices:["user-name","user-id","random-number","random-hex","counter-dynamic","counter-fixed"]})},
            
            {key:"category",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:ticket-channel-category","category",true,[])},
            {key:"closedCategory",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:ticket-channel-closed-category","category",true,[])},
            {key:"backupCategory",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:ticket-channel-backup-category","category",true,[])},
            {key:"claimedCategory",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("openticket:ticket-channel-claimed-category",{allowDoubles:false,allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("openticket:ticket-channel-claimed-category",{children:[
                {key:"user",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:ticket-channel-claimed-user","user",false,[])},
                {key:"category",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:ticket-channel-claimed-category","category",false,[])}
            ]})})},
            {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-channel-description",{})},
        ]})},

        //DM MESSAGE
        {key:"dmMessage",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:ticket-dm-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:ticket-dm-message",{children:[
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-message-text",{maxLength:4096})},
            {key:"embed",optional:false,priority:0,checker:createTicketEmbedStructure("openticket:ticket-message-embed")}
        ]})})},

        //TICKET MESSAGE
        {key:"ticketMessage",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:ticket-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:ticket-message",{children:[
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-message-text",{maxLength:4096})},
            {key:"embed",optional:false,priority:0,checker:createTicketEmbedStructure("openticket:ticket-message-embed")},
            {key:"ping",optional:false,priority:0,checker:createTicketPingStructure("openticket:ticket-message-ping")}
        ]})})},

        //AUTOCLOSE
        {key:"autoclose",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-autoclose",{children:[
            {key:"enableInactiveHours",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autoclose-enable-hours",{})},
            {key:"inactiveHours",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:ticket-autoclose-hours",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:8544})},
            {key:"enableUserLeave",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autoclose-enable-leave",{})},
            {key:"disableOnClaim",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autoclose-disable-claim",{})},
        ]})},

        //AUTODELETE
        {key:"autodelete",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-autodelete",{children:[
            {key:"enableInactiveDays",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autodelete-enable-days",{})},
            {key:"inactiveDays",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:ticket-autodelete-days",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:356})},
            {key:"enableUserLeave",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autodelete-enable-leave",{})},
            {key:"disableOnClaim",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:ticket-autodelete-disable-claim",{})},
        ]})},

        //COOLDOWN
        {key:"cooldown",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:ticket-cooldown",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:ticket-cooldown",{children:[
            {key:"cooldownMinutes",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:ticket-cooldown-minutes",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,max:512640})},
        ]})})},

        //LIMITS
        {key:"limits",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:ticket-limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:ticket-limits",{children:[
            {key:"globalMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:ticket-limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})},
            {key:"userMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:ticket-limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})}
        ]})})},
    ]})},

    //WEBSITE
    {name:"website",priority:0,properties:[{key:"type",value:"website"}],checker:new api.ODCheckerObjectStructure("openticket:options-website",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("openticket:website-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:website-name",{minLength:3,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:website-description",{maxLength:256})},
        
        //WEBSITE BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("openticket:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-button-label",{maxLength:50})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("openticket:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //WEBSITE URL
        {key:"url",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:website-url",false,{allowHttp:false})},
    ]})},

    //REACTION ROLES
    {name:"role",priority:0,properties:[{key:"type",value:"role"}],checker:new api.ODCheckerObjectStructure("openticket:options-role",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("openticket:role-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:role-name",{minLength:3,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:role-description",{maxLength:256})},

        //ROLE BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("openticket:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-button-label",{maxLength:50})},
            {key:"color",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:ticket-button-color",{choices:["gray","red","green","blue"]})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("openticket:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //ROLE SETTINGS
        {key:"roles",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:role-roles","role",[],{allowDoubles:false,minLength:1})},
        {key:"mode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:role-mode",{choices:["add","remove","add&remove"]})},
        {key:"removeRolesOnAdd",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("openticket:role-remove-roles","role",[],{allowDoubles:false})},
        {key:"addOnMemberJoin",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:role-add-on-join",{})},
    ]})},
]})})

export const defaultPanelsStructure = new api.ODCheckerArrayStructure("openticket:panels",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("openticket:panels",{children:[
    {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("openticket:panel-id","openticket","panel-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
    {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-name",{minLength:3,maxLength:50})},
    {key:"dropdown",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-dropdown",{})},
    {key:"options",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueIdArray("openticket:panel-options","openticket","option-ids","option-ids-used",{allowDoubles:false,maxLength:25})},
    
    //EMBED & TEXT
    {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-text",{maxLength:4096})},
    {key:"embed",optional:false,priority:0,checker:createPanelEmbedStructure("openticket:panel-embed")},
    
    //SETTINGS
    {key:"settings",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:panel-settings",{children:[
        {key:"dropdownPlaceholder",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-settings-placeholder",{maxLength:100})},
        {key:"enableMaxTicketsWarningInText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-settings-maxtickets-text",{})},
        {key:"enableMaxTicketsWarningInEmbed",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-settings-maxtickets-embed",{})},
        
        {key:"describeOptionsLayout",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-settings-describe-layout",{choices:["simple","normal","detailed"]})},
        {key:"describeOptionsCustomTitle",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:panel-settings-describe-title",{maxLength:512})},
        {key:"describeOptionsInText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-settings-describe-text",{})},
        {key:"describeOptionsInEmbedFields",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-settings-describe-fields",{})},
        {key:"describeOptionsInEmbedDescription",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:panel-settings-describe-embed",{})},
    ]})},
]})})

export const defaultQuestionsStructure = new api.ODCheckerArrayStructure("openticket:questions",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("openticket:questions",{children:[
    {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("openticket:question-id","openticket","question-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
    {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:question-name",{minLength:3,maxLength:50})},
    {key:"type",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:question-type",{choices:["short","paragraph"]})},
    
    {key:"required",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:question-required",{})},
    {key:"placeholder",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:question-placeholder",{maxLength:100})},
    
    {key:"length",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:question-length",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:question-length",{children:[
        {key:"min",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:question-length-min",{min:0,max:1024,negativeAllowed:false,floatAllowed:false})},
        {key:"max",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("openticket:question-length-max",{min:1,max:1024,negativeAllowed:false,floatAllowed:false})},
    ]})})},
]})})

export const defaultTranscriptsStructure = new api.ODCheckerObjectStructure("openticket:transcripts",{children:[
    //GENERAL
    {key:"general",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:transcripts-general",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:transcripts-general",{children:[
        {key:"enableChannel",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-enable-channel",{})},
        {key:"enableCreatorDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-enable-creator-dm",{})},
        {key:"enableParticipantDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-enable-participant-dm",{})},
        {key:"enableActiveAdminDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-enable-active-admin-dm",{})},
        {key:"enableEveryAdminDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-enable-every-admin-dm",{})},

        {key:"channel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("openticket:transcripts-channel","channel",true,[])},
        {key:"mode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:transcripts-mode",{choices:["html","text"]})},
    ]})})},

    //EMBED SETTINGS
    {key:"embedSettings",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:transcripts-embed-settings",{children:[
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-embed-color",false,true)},
        {key:"listAllParticipants",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-embed-list-participants",{})},
        {key:"includeTicketStats",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-embed-include-ticket-stats",{})},
    ]})},

    //TEXT STYLE
    {key:"textTranscriptStyle",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:transcripts-text",{children:[
        {key:"layout",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:transcripts-text-layout",{choices:["simple","normal","detailed"]})},
        {key:"includeStats",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-text-include-stats",{})},
        {key:"includeIds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-text-include-ids",{})},
        {key:"includeEmbeds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-text-include-embeds",{})},
        {key:"includeFiles",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-text-include-files",{})},
        {key:"includeBotMessages",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("openticket:transcripts-text-include-bots",{})},

        {key:"fileMode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:transcripts-text-file-mode",{choices:["custom","channel-name","channel-id","user-name","user-id"]})},
        {key:"customFileName",optional:false,priority:0,checker:new api.ODCheckerStringStructure("openticket:transcripts-file-name",{maxLength:512,regex:/^[^\.#%&{}\\<>*?/!'":@`|=]*$/})},
    ]})},

    //HTML STYLE
    {key:"htmlTranscriptStyle",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("openticket:transcripts-html",{children:[
        //HTML BACKGROUND
        {key:"background",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:transcripts-html-background",{property:"enableCustomBackground",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:transcripts-html-background",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-background-color",false,true)},
            {key:"backgroundImage",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:transcripts-html-background-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        ]})})},

        //HTML HEADER
        {key:"header",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:transcripts-html-header",{property:"enableCustomHeader",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:transcripts-html-header",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-header-bgcolor",false,false)},
            {key:"decoColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-header-decocolor",false,false)},
            {key:"textColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-header-textcolor",false,false)},
        ]})})},

        //HTML STATS
        {key:"stats",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:transcripts-html-stats",{property:"enableCustomStats",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:transcripts-html-stats",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-stats-bgcolor",false,false)},
            {key:"keyTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-stats-keycolor",false,false)},
            {key:"valueTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-stats-valuecolor",false,false)},
            {key:"hideBackgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-stats-hidebgcolor",false,false)},
            {key:"hideTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("openticket:transcripts-html-stats-hidecolor",false,false)},
        ]})})},

        //HTML FAVICON
        {key:"favicon",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("openticket:transcripts-html-favicon",{property:"enableCustomFavicon",enabledValue:true,checker:new api.ODCheckerObjectStructure("openticket:transcripts-html-favicon",{children:[
            {key:"imageUrl",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("openticket:transcripts-html-favicon-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp"]})},
        ]})})},
    ]})},
]})

export const defaultUnusedOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const optionList: string[] = manager.storage.get("openticket","option-ids")
    const usedOptionList: string[] = manager.storage.get("openticket","option-ids-used")
    if (!optionList || ! usedOptionList) return {valid:true,messages:[]}

    const optionChecker = manager.get("openticket:options")
    if (!optionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    optionList.forEach((id) => {
        if (!usedOptionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("openticket:options","openticket:unused-option",optionChecker.config.file,"warning",`The option "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("openticket:unused-options"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultUnusedQuestionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const questionList: string[] = manager.storage.get("openticket","question-ids")
    const usedQuestionList: string[] = manager.storage.get("openticket","question-ids-used")
    if (!questionList || ! usedQuestionList) return {valid:true,messages:[]}

    const questionChecker = manager.get("openticket:questions")
    if (!questionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    questionList.forEach((id) => {
        if (!usedQuestionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("openticket:questions","openticket:unused-question",questionChecker.config.file,"warning",`The question "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("openticket:unused-questions"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultDropdownOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {

    const panelList: string[] = manager.storage.get("openticket","panel-ids")
    if (!panelList) return {valid:true,messages:[]}

    const panelConfig = openticket.configs.get("openticket:panels")
    if (!panelConfig) return {valid:true,messages:[]}
    
    const optionConfig = openticket.configs.get("openticket:options")
    if (!optionConfig) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    panelList.forEach((id,index) => {
        const panel = panelConfig.data.find((panel) => panel.id == id)
        if (!panel || !panel.dropdown) return false
        if (panel.options.some((optId) => {
            const option = optionConfig.data.find((option) => option.id == optId)
            if (!option) return false
            if (option.type != "ticket") return true
            else return false
        })){
            //give error when non-ticket options exist in dropdown panel!
            final.push(functions.createMessage("openticket:panels","openticket:dropdown-option",panelConfig.file,"error","A panel with dropdown enabled can only contain options of the 'ticket' type!",[index,"options"],null,[],new api.ODId("openticket:dropdown-options"),null))
        }
    })

    return {valid:(final.length < 1),messages:final}
}