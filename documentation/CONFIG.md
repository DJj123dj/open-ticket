# config file
[![discord](https://img.shields.io/badge/discord-join%20our%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3) 
[![version](https://img.shields.io/badge/version-1.3.1%20stable-brightgreen.svg?style=flat-square)](https://github.com/DJj123dj/open-ticket/releases/tag/v1.3.1) 
[![npm](https://img.shields.io/badge/npm-external%20libraries%20needed-CB3837.svg?style=flat-square&logo=npm)](#packages) 
[![license](https://img.shields.io/badge/license-GPL%203.0-important.svg?style=flat-square)](https://github.com/DJj123dj/open-ticket/blob/main/LICENSE)

In this file you find all the information about commands in the config.json file

- server_name ➜ the name of your server (optional) _**type: string**_
- server_logo ➜ the logo of your server (optional) _**type: url**_
- bot_name ➜ the name from the bot _**type: string**_
- main_color ➜ the color used in embeds _**type: hex color (#000000)**_
- auth_token ➜ your bot's token _**type: string**_
- botperms_role ➜ this role can do all admin commands from the bot _**type: discord role id**_
- prefix ➜ the prefix _**type: string**_
- credits ➜ disable the credits _**type: boolean**_

## status: (the status from the bot)
- type ➜ set the status type _**type: string (PLAYING | LISTENING | WATCHING | CUSTOM)**
- text ➜ set the status text _**type: string**_

## system: (the configuration for the ticket system)
- ticket_channel ➜ channel where you are going to set `!ticket msg` _**type: discord channel id**_
- max_allowed_tickets ➜ the maximum allowed tickets per person _**type: number**_
- enable_DM_Messages ➜ enable DM messages _**type: boolean**_
- enable_category ➜ enable category _**type: boolean**_
- ticket_category ➜ the category id _**type: discord category id**_
- has@everyoneaccess ➜ when enabled everyone has acces to the tickets _**type: boolean**_
- member_role ➜ this role doesn't have access to tickets _**type: discord role id**_
- enable_transcript ➜ enable the transcript _**type: boolean**_
- transcript_channel ➜ the transcript channel id _**type: discord channel id**_

## messages: (general, dm, ticket)
- nopermissions ➜ the message when someone doesn't have permissions _**type: string**_
- alreadyCreated ➜ if you have too much tickets open _**type: string**_
- newTicket ➜ when you create a new ticket _**type: string**_
- closeTicket ➜ when you close a ticket _**type: string**_
- newTicketEmbed ➜ the first message in the ticket channel _**type: string**

## layout: (ticketEmbed, ticketMsg, transcript)
`transcript` doesn't have all the options

- customColorEnabled ➜ custom embed color enabled _**type: boolean**
- customColor ➜ the custom color _**type: hex color (#000000)**
- footerEnabled ➜ custom footer enabled _**type: boolean**
- footer ➜ the custom footer _**type: string**
- thumbnailEnabled ➜ custom thumbnail enabled _**type: boolean**
- thumbnailURL ➜ the image _**type: string**

## options: (per ticket)
color is not needed when `isURL` is `true`

- enabled ➜ enable this ticket _**type: boolean**
- icon ➜ the button emoji _**type: emoji or custom emoji**
- description ➜ ticket description _**type: string**
- name ➜ ticket name _**type: string**
- channel_prefix ➜ ticket prefix _**type: string**
- color ➜ button color _**type: string (red|green|blue|gray|none)**
- isURL ➜ create link to a website instead of a normal ticket _**type: boolean**
- url ➜ the website to go to _**type: string**

# thanks for using open-ticket
I didn't know that open-tickets was going to be so much used. I will be creating more updates in the future!

If you have an idea for new updates you can always say it in my discord server!

open-tickets v1.3.1