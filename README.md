# open-ticket
[![discord](https://img.shields.io/badge/discord-join%20our%20server-5865F2.svg?style=flat-square&logo=discord)](https://discord.com/invite/26vT9wt3n3) 
[![version](https://img.shields.io/badge/version-1.2.2%20stable-brightgreen.svg?style=flat-square)](https://github.com/DJj123dj/open-ticket/releases/tag/v1.2.2) 
[![npm](https://img.shields.io/badge/npm-external%20libraries%20needed-CB3837.svg?style=flat-square&logo=npm)](#) 
[![license](https://img.shields.io/badge/license-GPL%203.0-important.svg?style=flat-square)](#) 

This is an open-source discord ticket bot, you can configure it and it comes with cool features like transcripts & custom options!

<img src="logo.png" alt="Open Ticket logo" style="height: 300px; width:300px;"/>

## features
- discord interaction buttons
- transcripts
- add/remove users from ticket
- custom colors & name
- has tickets for questions, partners & job applications
- uses discord.js 13
- configure your own ticket options
- remove credits if you want


## installation
You need `node.js 16` to run this project, if you don't want to install `node.js 16` then there is a npm package that can help you.

You can clone this project for download.

### packages
- canvas => version `^2.8.0`
- discord.js => version `^13.2.0`
- express => version `^4.17.1`
- node-localstorage => version `^2.2.1`

The packages are also in package.json!

### node.js 16 package
if you don't want to install `node.js 16`, you can install this package too
- node => version ^16.10.0

_npm install node@16_

## running
you can run `node index.js` but i would recommend you to use `npm start`

if there are any errors, you can open an **issue on github** or **contact me in the discord server**.

### config (required)
=> main config
- `server_name` => the name from your server.
- `server_logo`=> the logo from your server.
- `bot_name`=> the bot's name.
- `main_color`=> the color used in all embeds.
- `auth_token`=> the bot's token (Discord Developer Portal)
- `botperms_role`=> the id from a role that can run admin commands with the bot.
- `prefix`=> the bot's prefix.

- `credits_please-do-not-remove` => remove the credits or not

=> status config
- `status/type` => PLAYING | STREAMING | LISTENING | WATCHING | CUSTOM | COMPETING
- `status/text` => the status text

=> ticket system config
- `system/ticket_channel` => the channel where you are going to put the !ticket msg.
- `system/ticket_category` => the category for tickets.
- `system/member_role` => this role doesn't have access to tickets 
(WARNING: @everyone does have access to tickets, so make sure all members have a member role!).
- `system/transcript_channel` => the channel for transcripts.
- `system/enable_transcripts` => enable transcripts.
- `system/enable_category` => enable tickets in category.

=> ticket options config
- `options/ticket.../enabled` => set this option TRUE or FALSE.
- `options/ticket.../icon` => set an emoji for this ticket option.
- `options/ticket.../description` => set a description for this ticket option.
- `options/ticket.../name` => set a name for this ticket option.
- `options/ticket.../channel_prefix` => this will be the prefix for channel names (empty is disabled!)

### intents & permissions
In the discord developer portal in the "bot" panel you will find 3 switches under the title "Gateaway Intents". The following switches should always be turned on
- `SERVER MEMBERS INTENT`
- `MESSAGE CONTENT INTENT`

The bot needs `ADMINISTRATOR` permissions to work the best.

## credits
Please don't remove the credits from the bot 😊.

_v1.2.2_

© 2021 - DJdj Development | [website](https://www.dj-dj.be) | [discord](https://discord.com/invite/26vT9wt3n3)