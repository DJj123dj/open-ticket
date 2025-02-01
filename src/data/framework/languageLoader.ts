import {opendiscord, api, utilities} from "../../index"

export const loadAllLanguages = async () => {
    //register languages
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:custom","custom.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:english","english.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:dutch","dutch.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:portuguese","portuguese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:czech","czech.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:german","german.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:catalan","catalan.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:hungarian","hungarian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:spanish","spanish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:romanian","romanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:ukrainian","ukrainian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:indonesian","indonesian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:italian","italian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:estonian","estonian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:finnish","finnish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:danish","danish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:thai","thai.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:turkish","turkish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:french","french.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:arabic","arabic.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:hindi","hindi.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:lithuanian","lithuanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("openticket:polish","polish.json"))

    /** How to add more languages?
     * - Register the language to the manager (see above)
     * - Add the language to the list in the "ODLanguageManagerIds_Default" interface (./src/core/api/defaults/language.ts)
     * - Update the language list in the README.md translator list
     * - Update the language counter in the README.md features list
     */
}