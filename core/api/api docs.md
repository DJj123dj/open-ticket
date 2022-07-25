# OT-API Documentation
Extend open ticket with your own features!

The api is made for EXTENDING open ticket, not replacing! So with this api you are not able to replace existing features! You can only add your own features!

### DISCLAIMER:
Only edit or extend the code when you know what you are doing!

If open ticket crashes while you change the code, then we can't help you!

**DO IT ON YOUR OWN RISK!**

## Events:
Everything in the `events.js` file!

### onTicketOpen(...)
This function is executed when a new ticket is created. It happens after everything else is done, so the channel is already created!

Parameters:
- user: `discord.User`
- channel: `discord.TextChannel`
- guild: `discord.Guild`
- date: `Date`
- ticketdata: `OT TicketData` or `false` (more info further down this document)

### onTicketClose(...)
This function is executed when a ticket gets closed, it can happen multiple times with one ticket (because of reopen).

Parameters:
- user: `discord.User`
- channel: `discord.TextChannel`
- guild: `discord.Guild`
- date: `Date`
- ticketdata: `OT TicketData` or `false` (more info further down this document)

### onTicketDelete(...)
This function is executed when a ticket gets deleted, it can happen only 1 time.

Parameters:
- user: `discord.User`
- channel: `discord.TextChannel`
- guild: `discord.Guild`
- date: `Date`
- ticketdata: `OT TicketData` or `false` (more info further down this document)

### onTicketReopen(...)
...

### onTranscriptCreation(...)
...

### onCommand(...)
...

### onReactionRole(...)
...