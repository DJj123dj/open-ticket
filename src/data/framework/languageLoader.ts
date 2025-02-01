import {opendiscord, api, utilities} from "../../index"

export const loadAllLanguages = async () => {
    //register languages
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:custom","custom.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:english","english.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:dutch","dutch.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:portuguese","portuguese.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:czech","czech.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:german","german.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:catalan","catalan.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:hungarian","hungarian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:spanish","spanish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:romanian","romanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:ukrainian","ukrainian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:indonesian","indonesian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:italian","italian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:estonian","estonian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:finnish","finnish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:danish","danish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:thai","thai.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:turkish","turkish.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:french","french.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:arabic","arabic.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:hindi","hindi.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:lithuanian","lithuanian.json"))
    opendiscord.languages.add(new api.ODJsonLanguage("opendiscord:polish","polish.json"))

    /** How to add more languages?
     * - Register the language to the manager (see above)
     * - Add the language to the list in the "ODLanguageManagerIds_Default" interface (./src/core/api/defaults/language.ts)
     * - Update the language list in the README.md translator list
     * - Update the language counter in the README.md features list
     */
}