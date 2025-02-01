import {opendiscord, api, utilities} from "../../index"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const loadAllConfigCheckers = async () => {
    opendiscord.checkers.add(new api.ODChecker("opendiscord:general",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:general"),defaultGeneralStructure))
        opendiscord.checkers.add(new api.ODChecker("opendiscord:options",opendiscord.checkers.storage,1,opendiscord.configs.get("opendiscord:options"),defaultOptionsStructure))
        opendiscord.checkers.add(new api.ODChecker("opendiscord:panels",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:panels"),defaultPanelsStructure))
        opendiscord.checkers.add(new api.ODChecker("opendiscord:questions",opendiscord.checkers.storage,2,opendiscord.configs.get("opendiscord:questions"),defaultQuestionsStructure))
        opendiscord.checkers.add(new api.ODChecker("opendiscord:transcripts",opendiscord.checkers.storage,0,opendiscord.configs.get("opendiscord:transcripts"),defaultTranscriptsStructure))
}

export const loadAllConfigCheckerFunctions = async () => {
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:unused-options",defaultUnusedOptionsFunction))
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:unused-questions",defaultUnusedQuestionsFunction))
    opendiscord.checkers.functions.add(new api.ODCheckerFunction("opendiscord:dropdown-options",defaultDropdownOptionsFunction))
}

export const loadAllConfigCheckerTranslations = async () => {
    if ((generalConfig && generalConfig.data.system && generalConfig.data.system.useTranslatedConfigChecker) ? generalConfig.data.system.useTranslatedConfigChecker : false){
        registerDefaultCheckerSystemTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate checker system text
        registerDefaultCheckerMessageTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate checker messages
        registerDefaultCheckerCustomTranslations(opendiscord.checkers.translation,opendiscord.languages) //translate custom checker messages
    }
}

//GLOBAL FUNCTIONS
export const registerDefaultCheckerSystemTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //SYSTEM
    //tm.quickTranslate(lm,"checker.system.headerOpenTicket","other","opendiscord:header-openticket") //OPEN TICKET (ignore)
    tm.quickTranslate(lm,"checker.system.typeError","other","opendiscord:type-error") // [ERROR] (ignore)
    tm.quickTranslate(lm,"checker.system.typeWarning","other","opendiscord:type-warning") // [WARNING] (ignore)
    tm.quickTranslate(lm,"checker.system.typeInfo","other","opendiscord:type-info") // [INFO] (ignore)
    tm.quickTranslate(lm,"checker.system.headerConfigChecker","other","opendiscord:header-configchecker") // CONFIG CHECKER
    tm.quickTranslate(lm,"checker.system.headerDescription","other","opendiscord:header-description") // check for errors in your config files!
    tm.quickTranslate(lm,"checker.system.footerError","other","opendiscord:footer-error") // the bot won't start until all {0}'s are fixed!
    tm.quickTranslate(lm,"checker.system.footerWarning","other","opendiscord:footer-warning") // it's recommended to fix all {0}'s before starting!
    tm.quickTranslate(lm,"checker.system.footerSupport","other","opendiscord:footer-support") // SUPPORT: {0} - DOCS: {1}
    tm.quickTranslate(lm,"checker.system.compactInformation","other","opendiscord:compact-information") // use {0} for more information!
    tm.quickTranslate(lm,"checker.system.dataPath","other","opendiscord:data-path") // path
    tm.quickTranslate(lm,"checker.system.dataDocs","other","opendiscord:data-docs") // docs
    tm.quickTranslate(lm,"checker.system.dataMessages","other","opendiscord:data-message") // message
}

export const registerDefaultCheckerMessageTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //STRUCTURES
    tm.quickTranslate(lm,"checker.messages.invalidType","message","opendiscord:invalid-type") // This property needs to be the type: {0}!
    tm.quickTranslate(lm,"checker.messages.propertyMissing","message","opendiscord:property-missing") // The property {0} is missing from this object!
    tm.quickTranslate(lm,"checker.messages.propertyOptional","message","opendiscord:property-optional") // The property {0} is optional in this object!
    tm.quickTranslate(lm,"checker.messages.objectDisabled","message","opendiscord:object-disabled") // This object is disabled, enable it using {0}!
    tm.quickTranslate(lm,"checker.messages.nullInvalid","message","opendiscord:null-invalid") // This property can't be null!
    tm.quickTranslate(lm,"checker.messages.switchInvalidType","message","opendiscord:switch-invalid-type") // This needs to be one of the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.objectSwitchInvalid","message","opendiscord:object-switch-invalid-type") // This object needs to be one of the following types: {0}!

    tm.quickTranslate(lm,"checker.messages.stringTooShort","message","opendiscord:string-too-short") // This string can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringTooLong","message","opendiscord:string-too-long") // This string can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.stringLengthInvalid","message","opendiscord:string-length-invalid") // This string needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.stringStartsWith","message","opendiscord:string-starts-with") // This string needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.stringEndsWith","message","opendiscord:string-ends-with") // This string needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.stringContains","message","opendiscord:string-contains") // This string needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.stringChoices","message","opendiscord:string-choices") // This string can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.stringRegex","message","opendiscord:string-regex") // This string is invalid!

    tm.quickTranslate(lm,"checker.messages.numberTooShort","message","opendiscord:number-too-short") // This number can't be shorter than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberTooLong","message","opendiscord:number-too-long") // This number can't be longer than {0} characters!
    tm.quickTranslate(lm,"checker.messages.numberLengthInvalid","message","opendiscord:number-length-invalid") // This number needs to be {0} characters long!
    tm.quickTranslate(lm,"checker.messages.numberTooSmall","message","opendiscord:number-too-small") // This number needs to be at least {0}!
    tm.quickTranslate(lm,"checker.messages.numberTooLarge","message","opendiscord:number-too-large") // This number needs to be at most {0}!
    tm.quickTranslate(lm,"checker.messages.numberNotEqual","message","opendiscord:number-not-equal") // This number needs to be {0}!
    tm.quickTranslate(lm,"checker.messages.numberStep","message","opendiscord:number-step") // This number needs to be a multiple of {0}!
    tm.quickTranslate(lm,"checker.messages.numberStepOffset","message","opendiscord:number-step-offset") // This number needs to be a multiple of {0} starting with {1}!
    tm.quickTranslate(lm,"checker.messages.numberStartsWith","message","opendiscord:number-starts-with") // This number needs to start with {0}!
    tm.quickTranslate(lm,"checker.messages.numberEndsWith","message","opendiscord:number-ends-with") // This number needs to end with {0}!
    tm.quickTranslate(lm,"checker.messages.numberContains","message","opendiscord:number-contains") // This number needs to contain {0}!
    tm.quickTranslate(lm,"checker.messages.numberChoices","message","opendiscord:number-choices") // This number can only be one of the following values: {0}!
    tm.quickTranslate(lm,"checker.messages.numberFloat","message","opendiscord:number-float") // This number can't be a decimal!
    tm.quickTranslate(lm,"checker.messages.numberNegative","message","opendiscord:number-negative") // This number can't be negative!
    tm.quickTranslate(lm,"checker.messages.numberPositive","message","opendiscord:number-positive") // This number can't be positive!
    tm.quickTranslate(lm,"checker.messages.numberZero","message","opendiscord:number-zero") // This number can't be zero!

    tm.quickTranslate(lm,"checker.messages.booleanTrue","message","opendiscord:boolean-true") // This boolean can't be true!
    tm.quickTranslate(lm,"checker.messages.booleanFalse","message","opendiscord:boolean-false") // This boolean can't be false!

    tm.quickTranslate(lm,"checker.messages.arrayEmptyDisabled","message","opendiscord:array-empty-disabled") // This array isn't allowed to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayEmptyRequired","message","opendiscord:array-empty-required") // This array is required to be empty!
    tm.quickTranslate(lm,"checker.messages.arrayTooShort","message","opendiscord:array-too-short") // This array needs to have a length of at least {0}!
    tm.quickTranslate(lm,"checker.messages.arrayTooLong","message","opendiscord:array-too-long") // This array needs to have a length of at most {0}!
    tm.quickTranslate(lm,"checker.messages.arrayLengthInvalid","message","opendiscord:array-length-invalid") // This array needs to have a length of {0}!
    tm.quickTranslate(lm,"checker.messages.arrayInvalidTypes","message","opendiscord:array-invalid-types") // This array can only contain the following types: {0}!
    tm.quickTranslate(lm,"checker.messages.arrayDouble","message","opendiscord:array-double") // This array doesn't allow the same value twice!

    tm.quickTranslate(lm,"checker.messages.discordInvalidId","message","opendiscord:discord-invalid-id") // This is an invalid discord {0} id!
    tm.quickTranslate(lm,"checker.messages.discordInvalidIdOptions","message","opendiscord:discord-invalid-id-options") // This is an invalid discord {0} id! You can also use one of these: {1}!
    tm.quickTranslate(lm,"checker.messages.discordInvalidToken","message","opendiscord:discord-invalid-token") // This is an invalid discord token (syntactically)!
    tm.quickTranslate(lm,"checker.messages.colorInvalid","message","opendiscord:color-invalid") // This is an invalid hex color!
    tm.quickTranslate(lm,"checker.messages.emojiTooShort","message","opendiscord:emoji-too-short") // This string needs to have at least {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiTooLong","message","opendiscord:emoji-too-long") // This string needs to have at most {0} emoji's!
    tm.quickTranslate(lm,"checker.messages.emojiCustom","message","opendiscord:emoji-custom") // This emoji can't be a custom discord emoji!
    tm.quickTranslate(lm,"checker.messages.emojiInvalid","message","opendiscord:emoji-invalid") // This is an invalid emoji!
    tm.quickTranslate(lm,"checker.messages.urlInvalid","message","opendiscord:url-invalid") // This url is invalid!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHttp","message","opendiscord:url-invalid-http") // This url can only use the https:// protocol!
    tm.quickTranslate(lm,"checker.messages.urlInvalidProtocol","message","opendiscord:url-invalid-protocol") // This url can only use the http:// & https:// protocols!
    tm.quickTranslate(lm,"checker.messages.urlInvalidHostname","message","opendiscord:url-invalid-hostname") // This url has a disallowed hostname!
    tm.quickTranslate(lm,"checker.messages.urlInvalidExtension","message","opendiscord:url-invalid-extension") // This url has an invalid extension! Choose between: {0}!
    tm.quickTranslate(lm,"checker.messages.urlInvalidPath","message","opendiscord:url-invalid-path") // This url has an invalid path!
    tm.quickTranslate(lm,"checker.messages.idNotUnique","message","opendiscord:id-not-unique") // This id isn't unique, use another id instead!
    tm.quickTranslate(lm,"checker.messages.idNonExistent","message","opendiscord:id-non-existent") // The id {0} doesn't exist!
}

export const registerDefaultCheckerCustomTranslations = (tm:api.ODCheckerTranslationRegister_Default,lm:api.ODLanguageManager_Default) => {
    //CUSTOM
    tm.quickTranslate(lm,"checker.messages.invalidLanguage","message","opendiscord:invalid-language") // This is an invalid language!
    tm.quickTranslate(lm,"checker.messages.invalidButton","message","opendiscord:invalid-button") // This button needs to have at least an {0} or {1}!
    tm.quickTranslate(lm,"checker.messages.unusedOption","message","opendiscord:unused-option") // The option {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.unusedQuestion","message","opendiscord:unused-question") // The question {0} isn't used anywhere!
    tm.quickTranslate(lm,"checker.messages.dropdownOption","message","opendiscord:dropdown-option") // A panel with dropdown enabled can only contain options of the 'ticket' type!
    
    //TODO TRANSLATION!!!
    //tm.quickTranslate(lm,"checker.messages.TODO","message","opendiscord:invalid-version") // The version specified in your config is invalid! Make sure you have updated it to the latest version!
}

//UTILITY FUNCTIONS
const createMsgStructure = (id:api.ODValidId) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"dm",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:msg-dm",{})},
        {key:"logs",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:msg-logs",{})},
    ]})
}
const createTicketEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"title",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-text",{maxLength:256})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-description",{maxLength:4096})},
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:ticket-embed-color",true,true)},
        
        {key:"image",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:ticket-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"thumbnail",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:ticket-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"fields",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("opendiscord:ticket-embed-fields",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("opendiscord:ticket-embed-fields",{children:[
            {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-field-name",{minLength:1,maxLength:256})},
            {key:"value",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-embed-field-value",{minLength:1,maxLength:1024})},
            {key:"inline",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-embed-field-inline",{})}
        ]})})},
        {key:"timestamp",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-embed-timestamp",{})}
    ]})})
}
const createTicketPingStructure = (id:api.ODValidId) => {
    return new api.ODCheckerObjectStructure(id,{children:[
        {key:"@here",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-ping-here",{})},
        {key:"@everyone",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-ping-everyone",{})},
        {key:"custom",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-ping-custom","role",[],{allowDoubles:false})},
    ]})
}
const createPanelEmbedStructure = (id:api.ODValidId) => {
    return new api.ODCheckerEnabledObjectStructure(id,{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure(id,{children:[
        {key:"title",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-text",{maxLength:256})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-description",{maxLength:4096})},
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:panel-embed-color",true,true)},
        {key:"url",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-url",true,{allowHttp:false})},

        {key:"image",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        {key:"thumbnail",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:panel-embed-thumbnail",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        
        {key:"footer",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-footer",{maxLength:2048})},
        {key:"fields",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("opendiscord:panel-embed-fields",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("opendiscord:panel-embed-fields",{children:[
            {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-field-name",{minLength:1,maxLength:256})},
            {key:"value",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-embed-field-value",{minLength:1,maxLength:1024})},
            {key:"inline",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-embed-field-inline",{})}
        ]})})},
        {key:"timestamp",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-embed-timestamp",{})}
    ]})})
}

function loadFromEnv(){
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (generalConfig.data && generalConfig.data.tokenFromENV && typeof generalConfig.data.tokenFromENV == "boolean") return generalConfig.data.tokenFromENV
    else return false
}

//STRUCTURES
export const defaultGeneralStructure = new api.ODCheckerObjectStructure("opendiscord:general",{children:[
    //STATUS
    {key:"_INFO",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:info",{children:[
        {key:"support",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:info-support",{choices:["https://otdocs.dj-dj.be"]})},
        {key:"discord",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:info-discord",{choices:["https://discord.dj-dj.be"]})},
        {key:"version",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:info-version",{custom(checker,value,locationTrace,locationId,locationDocs) {
            const lt = checker.locationTraceDeref(locationTrace)
            
            if (typeof value != "string") return false
            else if (value != "open-ticket-"+opendiscord.versions.get("opendiscord:version").toString()){
                checker.createMessage("opendiscord:invalid-version","warning","The version specified in your config is invalid! Make sure you have updated it to the latest version!",lt,null,[],locationId,locationDocs)
                return false
            }else return true
        },})},
    ]})},

    //BASIC
    {key:"token",optional:false,priority:0,checker:(loadFromEnv()) ? new api.ODCheckerStringStructure("opendiscord:token-disabled",{}) : new api.ODCheckerCustomStructure_DiscordToken("opendiscord:token")},
    {key:"tokenFromENV",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:token-env",{})},
    {key:"mainColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:main-color",true,false)},
    {key:"language",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:language",{
        custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)

            if (typeof value != "string") return false
            else if (!opendiscord.defaults.getDefault("languageList").includes(value)){
                checker.createMessage("opendiscord:invalid-language","error","This is an invalid language!",lt,null,[],locationId,locationDocs)
                return false
            }else return true
        },
    })},
    {key:"prefix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:prefix",{minLength:1})},
    {key:"serverId",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:server-id","server",false,[])},
    {key:"globalAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:global-admins","role",[],{allowDoubles:false})},
    {key:"slashCommands",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:slash-commands",{})},
    {key:"textCommands",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:text-commands",{})},

    //STATUS
    {key:"status",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:status",{
        property:"enabled",
        enabledValue:true,
        checker:new api.ODCheckerObjectStructure("opendiscord:status",{children:[
            {key:"type",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:status-type",{choices:["listening","watching","playing","custom"]})},
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:status-text",{minLength:1,maxLength:128})},
            {key:"status",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:status-type",{choices:["online","invisible","idle","dnd"]})},
        ]})
    })},

    //SYSTEM
    {key:"system",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:system",{children:[
        {key:"removeParticipantsOnClose",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:remove-participants-on-close",{})},
        {key:"replyOnTicketCreation",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:reply-on-ticket-creation",{})},
        {key:"replyOnReactionRole",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:reply-on-reaction-role",{})},
        {key:"useTranslatedConfigChecker",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:use-translated-config-checker",{})},
        {key:"preferSlashOverText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:prefer-slash-over-text",{})},
        {key:"sendErrorOnUnknownCommand",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:send-error-on-unknown-command",{})},
        {key:"questionFieldsInCodeBlock",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:question-fields-in-code-block",{})},
        {key:"disableVerifyBars",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:disable-verify-bars",{})},
        {key:"useRedErrorEmbeds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:use-red-error-embeds",{})},
        {key:"emojiStyle",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:emoji-style",{choices:["before","after","double","disabled"]})},

        {key:"enableTicketClaimButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-claim-buttons",{})},
        {key:"enableTicketCloseButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-close-buttons",{})},
        {key:"enableTicketPinButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-pin-buttons",{})},
        {key:"enableTicketDeleteButtons",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-delete-buttons",{})},
        {key:"enableTicketActionWithReason",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-ticket-action-with-reason",{})},
        {key:"enableDeleteWithoutTranscript",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:enable-delete-without-transcript",{})},

        {key:"logs",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:system-logs",{
            property:"enabled",
            enabledValue:true,
            checker:new api.ODCheckerObjectStructure("opendiscord:system-logs",{children:[
                {key:"channel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:log-channel","channel",false,[])},
            ]})
        })},

        {key:"limits",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:limits",{children:[
            {key:"globalMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})},
            {key:"userMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})}
        ]})})},

        {key:"permissions",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:system-permissions",{children:[
            {key:"help",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-help","role",false,["admin","everyone","none"])},
            {key:"panel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-panel","role",false,["admin","everyone","none"])},
            {key:"ticket",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-ticket","role",false,["admin","everyone","none"])},
            {key:"close",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-close","role",false,["admin","everyone","none"])},
            {key:"delete",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-delete","role",false,["admin","everyone","none"])},
            {key:"reopen",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-reopen","role",false,["admin","everyone","none"])},
            {key:"claim",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-claim","role",false,["admin","everyone","none"])},
            {key:"unclaim",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-unclaim","role",false,["admin","everyone","none"])},
            {key:"pin",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-pin","role",false,["admin","everyone","none"])},
            {key:"unpin",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-unpin","role",false,["admin","everyone","none"])},
            {key:"move",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-move","role",false,["admin","everyone","none"])},
            {key:"rename",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-rename","role",false,["admin","everyone","none"])},
            {key:"add",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-add","role",false,["admin","everyone","none"])},
            {key:"remove",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-remove","role",false,["admin","everyone","none"])},
            {key:"blacklist",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-blacklist","role",false,["admin","everyone","none"])},
            {key:"stats",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-stats","role",false,["admin","everyone","none"])},
            {key:"clear",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-clear","role",false,["admin","everyone","none"])},
            {key:"autoclose",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-autoclose","role",false,["admin","everyone","none"])},
            {key:"autodelete",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:permissions-autodelete","role",false,["admin","everyone","none"])}
        ]})},

        {key:"messages",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:system-permissions",{children:[
            {key:"creation",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-creation")},
            {key:"closing",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-closing")},
            {key:"deleting",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-deleting")},
            {key:"reopening",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-reopening")},
            {key:"claiming",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-claiming")},
            {key:"pinning",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-pinning")},
            {key:"adding",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-adding")},
            {key:"removing",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-removing")},
            {key:"renaming",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-renaming")},
            {key:"moving",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-moving")},
            {key:"blacklisting",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-blacklisting")},
            {key:"roleAdding",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-role-adding")},
            {key:"roleRemoving",optional:false,priority:0,checker:createMsgStructure("opendiscord:msg-role-removing")}
        ]})},
    ]})}
]})

export const defaultOptionsStructure = new api.ODCheckerArrayStructure("opendiscord:options",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectSwitchStructure("opendiscord:options",{objects:[
    //TICKET
    {name:"ticket",priority:0,properties:[{key:"type",value:"ticket"}],checker:new api.ODCheckerObjectStructure("opendiscord:ticket",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:ticket-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-name",{minLength:2,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-description",{maxLength:256})},

        //TICKET BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80})},
            {key:"color",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-color",{choices:["gray","red","green","blue"]})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //TICKET ADMINS
        {key:"ticketAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-ticket-admins","role",[],{allowDoubles:false})},
        {key:"readonlyAdmins",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:ticket-readonly-admins","role",[],{allowDoubles:false})},
        {key:"allowCreationByBlacklistedUsers",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-allow-blacklisted-users",{})},
        {key:"questions",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueIdArray("opendiscord:option-questions","openticket","question-ids","question-ids-used",{allowDoubles:false,maxLength:5})},

        //TICKET CHANNEL
        {key:"channel",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-channel",{children:[
            {key:"prefix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-prefix",{maxLength:25,regex:/^[^\s]*$/})},
            {key:"suffix",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-suffix",{choices:["user-name","user-id","random-number","random-hex","counter-dynamic","counter-fixed"]})},
            
            {key:"category",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-category","category",true,[])},
            {key:"closedCategory",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-closed-category","category",true,[])},
            {key:"backupCategory",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-backup-category","category",true,[])},
            {key:"claimedCategory",optional:false,priority:0,checker:new api.ODCheckerArrayStructure("opendiscord:ticket-channel-claimed-category",{allowDoubles:false,allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("opendiscord:ticket-channel-claimed-category",{children:[
                {key:"user",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-claimed-user","user",false,[])},
                {key:"category",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:ticket-channel-claimed-category","category",false,[])}
            ]})})},
            {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-channel-description",{})},
        ]})},

        //DM MESSAGE
        {key:"dmMessage",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-dm-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-dm-message",{children:[
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-message-text",{maxLength:4096})},
            {key:"embed",optional:false,priority:0,checker:createTicketEmbedStructure("opendiscord:ticket-message-embed")}
        ]})})},

        //TICKET MESSAGE
        {key:"ticketMessage",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-message",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-message",{children:[
            {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-message-text",{maxLength:4096})},
            {key:"embed",optional:false,priority:0,checker:createTicketEmbedStructure("opendiscord:ticket-message-embed")},
            {key:"ping",optional:false,priority:0,checker:createTicketPingStructure("opendiscord:ticket-message-ping")}
        ]})})},

        //AUTOCLOSE
        {key:"autoclose",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-autoclose",{children:[
            {key:"enableInactiveHours",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-enable-hours",{})},
            {key:"inactiveHours",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:ticket-autoclose-hours",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:8544})},
            {key:"enableUserLeave",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-enable-leave",{})},
            {key:"disableOnClaim",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autoclose-disable-claim",{})},
        ]})},

        //AUTODELETE
        {key:"autodelete",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-autodelete",{children:[
            {key:"enableInactiveDays",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-enable-days",{})},
            {key:"inactiveDays",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:ticket-autodelete-days",{zeroAllowed:false,negativeAllowed:false,floatAllowed:true,min:1,max:356})},
            {key:"enableUserLeave",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-enable-leave",{})},
            {key:"disableOnClaim",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:ticket-autodelete-disable-claim",{})},
        ]})},

        //COOLDOWN
        {key:"cooldown",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-cooldown",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-cooldown",{children:[
            {key:"cooldownMinutes",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:ticket-cooldown-minutes",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1,max:512640})},
        ]})})},

        //LIMITS
        {key:"limits",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:ticket-limits",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-limits",{children:[
            {key:"globalMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:ticket-limits-global",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})},
            {key:"userMaximum",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:ticket-limits-user",{zeroAllowed:false,negativeAllowed:false,floatAllowed:false,min:1})}
        ]})})},
    ]})},

    //WEBSITE
    {name:"website",priority:0,properties:[{key:"type",value:"website"}],checker:new api.ODCheckerObjectStructure("opendiscord:options-website",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:website-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:website-name",{minLength:2,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:website-description",{maxLength:256})},
        
        //WEBSITE BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //WEBSITE URL
        {key:"url",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:website-url",false,{allowHttp:false})},
    ]})},

    //REACTION ROLES
    {name:"role",priority:0,properties:[{key:"type",value:"role"}],checker:new api.ODCheckerObjectStructure("opendiscord:options-role",{children:[
        {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:role-id","openticket","option-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
        {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:role-name",{minLength:2,maxLength:50})},
        {key:"description",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:role-description",{maxLength:256})},

        //ROLE BUTTON
        {key:"button",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:ticket-button",{children:[
            {key:"emoji",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_EmojiString("opendiscord:ticket-button-emoji",0,1,true)},
            {key:"label",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-label",{maxLength:80})},
            {key:"color",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:ticket-button-color",{choices:["gray","red","green","blue"]})},
        ],custom:(checker,value,locationTrace,locationId,locationDocs) => {
            const lt = checker.locationTraceDeref(locationTrace)
            //check if emoji & label exists
            if (typeof value != "object") return false
            else if (value && value["emoji"].length < 1 && value["label"].length < 1){
                //label & emoji are both empty
                checker.createMessage("opendiscord:invalid-button","error",`This button needs to have at least an "emoji" or "label"!`,lt,null,[`"emoji"`,`"label"`],locationId,locationDocs)
                return false
            }else return true
        }})},

        //ROLE SETTINGS
        {key:"roles",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:role-roles","role",[],{allowDoubles:false,minLength:1})},
        {key:"mode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:role-mode",{choices:["add","remove","add&remove"]})},
        {key:"removeRolesOnAdd",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordIdArray("opendiscord:role-remove-roles","role",[],{allowDoubles:false})},
        {key:"addOnMemberJoin",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:role-add-on-join",{})},
    ]})},
]})})

export const defaultPanelsStructure = new api.ODCheckerArrayStructure("opendiscord:panels",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("opendiscord:panels",{children:[
    {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:panel-id","openticket","panel-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
    {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-name",{minLength:3,maxLength:50})},
    {key:"dropdown",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-dropdown",{})},
    {key:"options",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueIdArray("opendiscord:panel-options","openticket","option-ids","option-ids-used",{allowDoubles:false,maxLength:25})},
    
    //EMBED & TEXT
    {key:"text",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-text",{maxLength:4096})},
    {key:"embed",optional:false,priority:0,checker:createPanelEmbedStructure("opendiscord:panel-embed")},
    
    //SETTINGS
    {key:"settings",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:panel-settings",{children:[
        {key:"dropdownPlaceholder",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-placeholder",{maxLength:100})},
        {key:"enableMaxTicketsWarningInText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-maxtickets-text",{})},
        {key:"enableMaxTicketsWarningInEmbed",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-maxtickets-embed",{})},
        
        {key:"describeOptionsLayout",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-describe-layout",{choices:["simple","normal","detailed"]})},
        {key:"describeOptionsCustomTitle",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:panel-settings-describe-title",{maxLength:512})},
        {key:"describeOptionsInText",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-text",{})},
        {key:"describeOptionsInEmbedFields",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-fields",{})},
        {key:"describeOptionsInEmbedDescription",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:panel-settings-describe-embed",{})},
    ]})},
]})})

export const defaultQuestionsStructure = new api.ODCheckerArrayStructure("opendiscord:questions",{allowedTypes:["object"],propertyChecker:new api.ODCheckerObjectStructure("opendiscord:questions",{children:[
    {key:"id",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UniqueId("opendiscord:question-id","openticket","question-ids",{regex:/^[A-Za-z0-9-éèçàêâôûî]+$/,minLength:3,maxLength:40})},
    {key:"name",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:question-name",{minLength:3,maxLength:45})},
    {key:"type",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:question-type",{choices:["short","paragraph"]})},
    
    {key:"required",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:question-required",{})},
    {key:"placeholder",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:question-placeholder",{maxLength:100})},
    
    {key:"length",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:question-length",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:question-length",{children:[
        {key:"min",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:question-length-min",{min:0,max:1024,negativeAllowed:false,floatAllowed:false})},
        {key:"max",optional:false,priority:0,checker:new api.ODCheckerNumberStructure("opendiscord:question-length-max",{min:1,max:1024,negativeAllowed:false,floatAllowed:false})},
    ]})})},
]})})

export const defaultTranscriptsStructure = new api.ODCheckerObjectStructure("opendiscord:transcripts",{children:[
    //GENERAL
    {key:"general",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-general",{property:"enabled",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-general",{children:[
        {key:"enableChannel",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-channel",{})},
        {key:"enableCreatorDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-creator-dm",{})},
        {key:"enableParticipantDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-participant-dm",{})},
        {key:"enableActiveAdminDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-active-admin-dm",{})},
        {key:"enableEveryAdminDM",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-enable-every-admin-dm",{})},

        {key:"channel",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_DiscordId("opendiscord:transcripts-channel","channel",true,[])},
        {key:"mode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:transcripts-mode",{choices:["html","text"]})},
    ]})})},

    //EMBED SETTINGS
    {key:"embedSettings",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-embed-settings",{children:[
        {key:"customColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-embed-color",false,true)},
        {key:"listAllParticipants",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-embed-list-participants",{})},
        {key:"includeTicketStats",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-embed-include-ticket-stats",{})},
    ]})},

    //TEXT STYLE
    {key:"textTranscriptStyle",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-text",{children:[
        {key:"layout",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:transcripts-text-layout",{choices:["simple","normal","detailed"]})},
        {key:"includeStats",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-stats",{})},
        {key:"includeIds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-ids",{})},
        {key:"includeEmbeds",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-embeds",{})},
        {key:"includeFiles",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-files",{})},
        {key:"includeBotMessages",optional:false,priority:0,checker:new api.ODCheckerBooleanStructure("opendiscord:transcripts-text-include-bots",{})},

        {key:"fileMode",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:transcripts-text-file-mode",{choices:["custom","channel-name","channel-id","user-name","user-id"]})},
        {key:"customFileName",optional:false,priority:0,checker:new api.ODCheckerStringStructure("opendiscord:transcripts-file-name",{maxLength:512,regex:/^[^\.#%&{}\\<>*?/!'":@`|=]*$/})},
    ]})},

    //HTML STYLE
    {key:"htmlTranscriptStyle",optional:false,priority:0,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html",{children:[
        //HTML BACKGROUND
        {key:"background",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-background",{property:"enableCustomBackground",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-background",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-background-color",false,true)},
            {key:"backgroundImage",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:transcripts-html-background-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp",".gif"]})},
        ]})})},

        //HTML HEADER
        {key:"header",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-header",{property:"enableCustomHeader",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-header",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-bgcolor",false,false)},
            {key:"decoColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-decocolor",false,false)},
            {key:"textColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-header-textcolor",false,false)},
        ]})})},

        //HTML STATS
        {key:"stats",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-stats",{property:"enableCustomStats",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-stats",{children:[
            {key:"backgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-bgcolor",false,false)},
            {key:"keyTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-keycolor",false,false)},
            {key:"valueTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-valuecolor",false,false)},
            {key:"hideBackgroundColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-hidebgcolor",false,false)},
            {key:"hideTextColor",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_HexColor("opendiscord:transcripts-html-stats-hidecolor",false,false)},
        ]})})},

        //HTML FAVICON
        {key:"favicon",optional:false,priority:0,checker:new api.ODCheckerEnabledObjectStructure("opendiscord:transcripts-html-favicon",{property:"enableCustomFavicon",enabledValue:true,checker:new api.ODCheckerObjectStructure("opendiscord:transcripts-html-favicon",{children:[
            {key:"imageUrl",optional:false,priority:0,checker:new api.ODCheckerCustomStructure_UrlString("opendiscord:transcripts-html-favicon-image",true,{allowHttp:false,allowedExtensions:[".png",".jpg",".jpeg",".webp"]})},
        ]})})},
    ]})},
]})

export const defaultUnusedOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const optionList: string[] = manager.storage.get("openticket","option-ids")
    const usedOptionList: string[] = manager.storage.get("openticket","option-ids-used")
    if (!optionList || ! usedOptionList) return {valid:true,messages:[]}

    const optionChecker = manager.get("opendiscord:options")
    if (!optionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    optionList.forEach((id) => {
        if (!usedOptionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("opendiscord:options","opendiscord:unused-option",optionChecker.config.file,"warning",`The option "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("opendiscord:unused-options"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultUnusedQuestionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {
    const questionList: string[] = manager.storage.get("openticket","question-ids")
    const usedQuestionList: string[] = manager.storage.get("openticket","question-ids-used")
    if (!questionList || ! usedQuestionList) return {valid:true,messages:[]}

    const questionChecker = manager.get("opendiscord:questions")
    if (!questionChecker) return {valid:true,messages:[]}

    const final: api.ODCheckerMessage[] = []
    questionList.forEach((id) => {
        if (!usedQuestionList.includes(id)){
            //id isn't used anywhere => create warning
            final.push(functions.createMessage("opendiscord:questions","opendiscord:unused-question",questionChecker.config.file,"warning",`The question "${id}" isn't used anywhere!`,[],null,[`"${id}"`],new api.ODId("opendiscord:unused-questions"),null))
        }
    })

    return {valid:true,messages:final}
}

export const defaultDropdownOptionsFunction = (manager:api.ODCheckerManager, functions:api.ODCheckerFunctionManager): api.ODCheckerResult => {

    const panelList: string[] = manager.storage.get("openticket","panel-ids")
    if (!panelList) return {valid:true,messages:[]}

    const panelConfig = opendiscord.configs.get("opendiscord:panels")
    if (!panelConfig) return {valid:true,messages:[]}
    
    const optionConfig = opendiscord.configs.get("opendiscord:options")
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
            final.push(functions.createMessage("opendiscord:panels","opendiscord:dropdown-option",panelConfig.file,"error","A panel with dropdown enabled can only contain options of the 'ticket' type!",[index,"options"],null,[],new api.ODId("opendiscord:dropdown-options"),null))
        }
    })

    return {valid:(final.length < 1),messages:final}
}