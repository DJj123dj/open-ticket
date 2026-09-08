/////////////// STARTUP FLAGS ///////////////
const flags = [
    // Edit flags here when being unable to use the flags in the command prompt.
    //PTERODACTYL PANEL
    //add startup flags here (e.g. "--no-compile") when running via the panel
]
/////////////// STARTUP FLAGS ///////////////

/*
 ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  
██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  
██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     
██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     
╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     
 ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     
 v4.2.2 - Made by DJj123dj & Contributors

 Discord: https://discord.dj-dj.be
 Docs: https://otdocs.dj-dj.be
 Support Us: https://github.com/sponsors/DJj123dj/
 
 */

///////////////////////////////////////////
////////// COMPILATION + STARTUP //////////
///////////////////////////////////////////

import { frameworkStartup } from "@open-discord-bots/framework"
frameworkStartup(flags,"openticket",async () => {
    await import("./dist/src/index.js")
})