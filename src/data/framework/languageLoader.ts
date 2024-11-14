import {openticket, api, utilities} from "../../index"

export const loadAllLanguages = async () => {
    //register languages
    openticket.languages.add(new api.ODLanguage("openticket:custom","custom.json"))
    openticket.languages.add(new api.ODLanguage("openticket:english","english.json"))
    openticket.languages.add(new api.ODLanguage("openticket:dutch","dutch.json"))
    openticket.languages.add(new api.ODLanguage("openticket:portuguese","portuguese.json"))
    openticket.languages.add(new api.ODLanguage("openticket:czech","czech.json"))
    openticket.languages.add(new api.ODLanguage("openticket:german","german.json"))
    openticket.languages.add(new api.ODLanguage("openticket:catalan","catalan.json"))
    openticket.languages.add(new api.ODLanguage("openticket:hungarian","hungarian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:spanish","spanish.json"))
    openticket.languages.add(new api.ODLanguage("openticket:romanian","romanian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:ukrainian","ukrainian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:indonesian","indonesian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:italian","italian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:estonian","estonian.json"))
    openticket.languages.add(new api.ODLanguage("openticket:finnish","finnish.json"))
    openticket.languages.add(new api.ODLanguage("openticket:danish","danish.json"))
    openticket.languages.add(new api.ODLanguage("openticket:thai","thai.json"))

    //list for config checker
    const languageList = openticket.defaults.getDefault("languageList")
    languageList.push("custom","english","dutch","portuguese","czech","german","catalan","hungarian","spanish","romanian","ukrainian","indonesian","italian","estonian","finnish","danish","thai")
    openticket.defaults.setDefault("languageList",languageList)

    /** How to add more languages?
     * - Register the language to the manager (see above)
     * - Add the language to the list (see above)
     * - Add the language to the list in the "ODLanguageManagerIds_Default" interface (./src/core/api/defaults/language.ts)
     * - Add the language to the list in the README.md
     */
}