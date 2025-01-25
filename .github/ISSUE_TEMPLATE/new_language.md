---
name: New Language
about: Do you want to add a new language to Open Ticket?
title: "Language Name"
labels: "New Translation"
---

### Language Name
The name of the new language.

### Language Description/Details:
A clear and concise description of the translation/language.

### Checklist
Before the language is fully implemented, the following checklist must be met:
- [ ] **📌 Created a language file in the `./languages/` directory.**
- [ ] **📌 The translation file uses the `<lowercase-language-name>.json` format.**
- [ ] **📌 The `"_TRANSLATION"` metadata in the language file is correctly configured.**
  - [ ] The `"otversion"` is correct.
  - [ ] The `"translators"` list is up to date has the discord/github usernames from all translators.
  - [ ] The `"lastedited"` variable is the last edited date in the following format: `DD/MM/YYYY`.
  - [ ] The `"language"` variable is the name of the language in English.
  - [ ] `"automated"` is enabled when `Google Translate`, `DeepL`, `ChatGPT` or any other kind of translation tools were used.
- [ ] **📌 The language has been added to the `README.md` list.**
- [ ] **📌 The language counters have been updated in the `README.md`.**
- [ ] **📌 The language has been added to the list in the `ODLanguageManagerIds_Default` interface in (`./src/core/api/defaults/language.ts`).**
- [ ] **📌 The language has been added to the list in `./src/data/languageLoader.ts`.**

### Additional Notes:
Add any other context about the problem here.