import { api, opendiscord, utilities } from "#opendiscord"
import * as discord from "discord.js"
if (opendiscord.project !== "openticket") throw new api.ODPluginError("This plugin only works in Open Ticket.")

/**============= Warning! =============
 *
 * This plugin is not yet enabled and will not run by default.
 * Please enable this plugin in the "plugin.json" file!
 *
 * =====================================
 */


//Add optional Typescript type-safety. This improves the developer experience.
declare module "#opendiscord-types" {
    export interface ODPluginManagerIdMappings {
        "example-plugin":api.ODPlugin
    }
    export interface ODConfigManagerIdMappings {
        "example-plugin:config":api.ODJsonConfig<{testVariable1:boolean, testVariable2:number, testVariable3:string}>
    }
}

//REGISTER CONFIG
opendiscord.events.get("onConfigLoad").listen((configs) => {
    //Let's register our example config. The plugin, all systems and even other plugins can access it.
    configs.add(new api.ODJsonConfig("example-plugin:config", "config.json", "./plugins/example-plugin/"))
    /*===== What did we do? =====
     * "example-plugin:config"     --> Is the ID of this config. It will be used throughout the code to access this config file.
     * "config.json"               --> Is the FILENAME of this config with extension.
     * "./plugins/example-plugin/" --> Is the DIRECTORY of this config. It is set to "./config/" by default, but we want to change it to our plugin directory.
    */
})

//CONFIG READY FOR USAGE
opendiscord.events.get("afterConfigsInitiated").listen((configs) => {
    //After the "afterConfigsInitiated" event is fired, configs can be read without problems.
    //Almost all events happen after this one, so you don't need to worry about it.

    const ourConfig = configs.get("example-plugin:config")
    opendiscord.log("The example config loaded successfully!", "plugin", [
        {key:"test-property-1", value:ourConfig.data.testVariable1.toString()},
        {key:"test-property-2", value:ourConfig.data.testVariable2.toString()},
        {key:"test-property-3", value:ourConfig.data.testVariable3.toString()}
    ])
})

//LISTEN FOR TICKET EVENTS
opendiscord.events.get("onTicketCreate").listen((creator) => {
    //Do something before a ticket is created (just after the button press)
    opendiscord.log("Ticket is getting created...", "plugin")
})
opendiscord.events.get("afterTicketCreated").listen((ticket, creator, channel) => {
    //Do something after a ticket is created and ready for usage
    opendiscord.log("Ticket ready!", "plugin")
})
opendiscord.events.get("onTicketClose").listen((ticket, closer, channel, reason) => {
    //Do something when a ticket will be closed
    opendiscord.log("Ticket is getting closed...", "plugin")
})

//MODIFY BUILT-IN OPEN TICKET MESSAGES
opendiscord.events.get("afterEmbedBuildersLoaded").listen((embeds) => {
    //Let's modify the close message to include a URL in the embed.
    embeds.get("opendiscord:close-message").workers.add(new api.ODWorker("example-plugin:testing", 0, (instance, params, origin, cancel) => {
        instance.setUrl("https://example.com")
    }))
})