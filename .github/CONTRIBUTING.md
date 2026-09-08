# Contributing Guidelines
<img src="https://apis.dj-dj.be/cdn/openticket/logo.png" alt="Open Ticket Logo" width="500px">

[![discord](https://img.shields.io/badge/discord-support%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3)  [![version](https://img.shields.io/badge/version-4.2.2-brightgreen.svg?style=flat-square)](https://github.com/open-discord-bots/open-ticket/releases/tag/v4.2.2)  [![Sponsor DJj123dj](https://img.shields.io/badge/sponsor-DJj123dj-ea4aaa?style=flat-square&logo=githubsponsors)](https://github.com/sponsors/DJj123dj)

These are the Contributing Guidelines of Open Ticket!<br>
Here you can find everything you need to know about contributing to Open Ticket.<br>
This includes new features, translations & bug fixes.

### 💬 Translations
#### Step 1: View & Check
1. Check the [`./languages/`](./languages/) folder for existing translations.
2. When it doesn't exist yet, visit **[step 2](#step-2-translation)**.
3. When it does exist, check if it is outdated, incorrect or incomplete.
4. If you match one of these requirements, you can also visit **[step 2](#step-2-translating)**.

#### Step 2: Translation
1. If your language doesn't exist yet, copy the [`english.json`](./../languages/english.json) file and rename it to your language.
2. **(❌ Not Recommended)** You are allowed to use `Google Translate` or `DeepL`, but only when you say it in the pull request and enable the `"automated"` boolean.
3. Only translate existing values in the json file. Don't add or remove any values from the file.
4. You're **NOT REQUIRED** to translate everything! If you only want to translate a part of it, it's okay!
5. If you are unable to translate something, leave it in `English`.

#### Step 3: Metadata
Metadata can be found in the `_TRANSLATION` variable.
|Value         |Notes                                                                                            |
|--------------|-------------------------------------------------------------------------------------------------|
|`otversion`   |The Open Ticket version of this translation. **❌ DON'T EDIT!**                                  |
|`translators` |The discord usernames from the translators. Add your name to the list when you've contributed.   |
|`lastedited`  |The last edited date in the `DD/MM/YYYY` format.                                                 |
|`language`    |The full name of the language with capital letter.                                               |
|`automated`   |Enable this boolean when this translation has been made using ChatGPT, Google Translate, ...     |

> #### ✅ You are also allowed to add your username to the [`README.md`](./../README.md) translator list!

#### Step 4: Uploading
1. When adding a new language, please mention @DJj123dj. He will add the code required for the language to work.
2. There are currently 3 ways of uploading translations:
   -  Create a pull request to the [__`dev` branch!__](https://github.com/open-discord-bots/open-ticket/tree/dev)
   -  Create a ticket in our [discord server](https://discord.dj-dj.be)!
   -  Send a DM to @DJj123dj on discord!
3. Now you'll need to wait until the next Open Ticket version for it to be added.

#### Step 5: Rewards
Translators get some rewards for translating Open Ticket!
- ✅ Credits in the [`README.md`](./../README.md) translator list!
- ✅ Credits in the changelog!
- ✅ Credits in the documentation!
- ✅ Credits in the translation JSON file!
- ✅ A special role in our [Discord server](https://discord.dj-dj.be)!

### 🧩 Plugins
#### Step 1: Creating Plugins
The documentation for creating plugins will be ready soon!<br>
In the meantime, you can already look at existing plugins or try it at your own!

#### Step 2: Uploading Plugins
Create a pull request in the [**`open-discord-plugins`**](https://odplugins.dj-dj.be/) repository or contact DJj123dj in our [Discord server](https://discord.dj-dj.be)!

### 📦 Features
Feature requests are required to be made in one of the following ways:
- ✅ In our [Discord server](https://discord.dj-dj.be)
- ✅ Create an issue on GitHub
- ✅ Message DJj123dj in DM on Discord
- ✅ Email to support@dj-dj.be

> **We won't accept pull requests for features. Only for bugs, small fixes, translation and plugins!**

### 🕷️ Bug Fixes
You are able to report bugs in one of the following ways:
- ✅ In our [Discord server](https://discord.dj-dj.be)
- ✅ Create an issue on GitHub
- ✅ Message DJj123dj in DM on Discord
- ✅ Email to support@dj-dj.be

📌 **If you want, you can also create a pull request to fix the bug yourself :)**

#### 🔴 Security Vulnerabilities
If you've found a bug which could affect the **SECURITY OF THE BOT** or may be potentially dangerous to the users of the bot,
you are **REQUIRED to send the bug privately via one of the following methods:**
- 🔴 Message DJj123dj in DM on Discord
- 🔴 Email to support@dj-dj.be

> ### Please try to always include the `otdebug.txt` file!

---
<img src="https://apis.dj-dj.be/cdn/openticket/logo.png" alt="Open Ticket Logo" width="170px">

**Contributing Guidelines**<br>
[Changelog](https://otgithub.dj-dj.be/releases) - [Documentation](https://otdocs.dj-dj.be) - [Website](https://openticket.dj-dj.be) - [Support Server](https://discord.dj-dj.be) - [License](./LICENSE.md)<br>

© 2021 - 2026 - [DJdj Development](https://www.dj-dj.be) - [Terms](https://www.dj-dj.be/terms) - [Privacy Policy](https://www.dj-dj.be/privacy) - [Support Us](https://github.com/sponsors/DJj123dj)