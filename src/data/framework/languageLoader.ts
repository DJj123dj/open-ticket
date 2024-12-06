import {openticket, api, utilities} from "../../index"

export const loadAllLanguages = async () => {
    //register languages
    openticket.languages.add(new api.ODJsonLanguage("openticket:custom","custom.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:english","english.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:dutch","dutch.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:portuguese","portuguese.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:czech","czech.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:german","german.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:catalan","catalan.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:hungarian","hungarian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:spanish","spanish.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:romanian","romanian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:ukrainian","ukrainian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:indonesian","indonesian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:italian","italian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:estonian","estonian.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:finnish","finnish.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:danish","danish.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:thai","thai.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:turkish","turkish.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:french","french.json"))
    openticket.languages.add(new api.ODJsonLanguage("openticket:arabic","arabic.json"))

    /** How to add more languages?
     * - Register the language to the manager (see above)
     * - Add the language to the list in the "ODLanguageManagerIds_Default" interface (./src/core/api/defaults/language.ts)
     * - Update the language list in the README.md translator list
     * - Update the language counter in the README.md features list
     */
}