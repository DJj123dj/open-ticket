import {openticket, api, utilities} from "../../index"

export const loadAllLanguages = async () => {
    openticket.languages.add(new api.ODLanguage("openticket:custom","custom.json"))
    openticket.languages.add(new api.ODLanguage("openticket:english","english.json"))
    openticket.languages.add(new api.ODLanguage("openticket:dutch","dutch.json"))
    openticket.languages.add(new api.ODLanguage("openticket:portuguese","portuguese.json"))
    openticket.languages.add(new api.ODLanguage("openticket:czech","czech.json"))
    openticket.languages.add(new api.ODLanguage("openticket:german","german.json"))
    openticket.languages.add(new api.ODLanguage("openticket:catalan","catalan.json"))

    /** How to add more languages?
     * - Add the language to the list above
     * - Add the language to the "languageList" in the "ODDefaultsManager" class
     * - Add the language to the list in the "ODLanguageManagerIds_Default" interface
     */
}