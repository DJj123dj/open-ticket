import {opendiscord, api, utilities} from "../../index"
import fs from "fs"
import { ODPluginError } from "../api/api"

export const loadAllPlugins = async () => {
    //start launching plugins
    opendiscord.log("Loading plugins...","system")
    let initPluginError: boolean = false

    if (!fs.existsSync("./plugins")){
        opendiscord.log("Couldn't find ./plugins directory, canceling all plugin execution!","error")
        return
    }
    const plugins = fs.readdirSync("./plugins")

    //check & validate
    plugins.forEach(async (p) => {
        //prechecks
        if (!fs.statSync("./plugins/"+p).isDirectory()) return opendiscord.log("Plugin is not a directory, canceling plugin execution...","plugin",[
            {key:"plugin",value:"./plugins/"+p}
        ])
        if (!fs.existsSync("./plugins/"+p+"/plugin.json")){
            initPluginError = true
            opendiscord.log("Plugin doesn't have a plugin.json, canceling plugin execution...","plugin",[
                {key:"plugin",value:"./plugins/"+p}
            ])
            return
        }

        //plugin loading
        try {
            const rawplugindata: api.ODPluginData = JSON.parse(fs.readFileSync("./plugins/"+p+"/plugin.json").toString())

            if (typeof rawplugindata != "object") throw new ODPluginError("Failed to load plugin.json")
            if (typeof rawplugindata.id != "string") throw new ODPluginError("Failed to load plugin.json/id")
            if (typeof rawplugindata.name != "string") throw new ODPluginError("Failed to load plugin.json/name")
            if (typeof rawplugindata.version != "string") throw new ODPluginError("Failed to load plugin.json/version")
            if (typeof rawplugindata.startFile != "string") throw new ODPluginError("Failed to load plugin.json/startFile")
            
            if (typeof rawplugindata.enabled != "boolean") throw new ODPluginError("Failed to load plugin.json/enabled")
            if (typeof rawplugindata.priority != "number") throw new ODPluginError("Failed to load plugin.json/priority")
            if (!Array.isArray(rawplugindata.events)) throw new ODPluginError("Failed to load plugin.json/events")
            
            if (!Array.isArray(rawplugindata.npmDependencies)) throw new ODPluginError("Failed to load plugin.json/npmDependencies")
            if (!Array.isArray(rawplugindata.requiredPlugins)) throw new ODPluginError("Failed to load plugin.json/requiredPlugins")
            if (!Array.isArray(rawplugindata.incompatiblePlugins)) throw new ODPluginError("Failed to load plugin.json/incompatiblePlugins")
            
            if (typeof rawplugindata.details != "object") throw new ODPluginError("Failed to load plugin.json/details")
            if (typeof rawplugindata.details.author != "string") throw new ODPluginError("Failed to load plugin.json/details/author")
            if (typeof rawplugindata.details.shortDescription != "string") throw new ODPluginError("Failed to load plugin.json/details/shortDescription")
            if (typeof rawplugindata.details.longDescription != "string") throw new ODPluginError("Failed to load plugin.json/details/longDescription")
            if (typeof rawplugindata.details.imageUrl != "string") throw new ODPluginError("Failed to load plugin.json/details/imageUrl")
            if (typeof rawplugindata.details.projectUrl != "string") throw new ODPluginError("Failed to load plugin.json/details/projectUrl")
            if (!Array.isArray(rawplugindata.details.tags)) throw new ODPluginError("Failed to load plugin.json/details/tags")
            
            if (rawplugindata.id != p) throw new ODPluginError("Failed to load plugin, directory name is required to match the id")
            
            if (opendiscord.plugins.exists(rawplugindata.id)) throw new ODPluginError("Failed to load plugin, this id already exists in another plugin")

            //plugin.json is valid => load plugin
            const plugin = new api.ODPlugin(p,rawplugindata)
            opendiscord.plugins.add(plugin)

        }catch(e){
            //when any of the above errors happen, crash the bot when soft mode isn't enabled
            initPluginError = true
            opendiscord.log(e.message+", canceling plugin execution...","plugin",[
                {key:"path",value:"./plugins/"+p}
            ])
            opendiscord.log("You can see more about this error in the ./otdebug.txt file!","info")
            opendiscord.debugfile.writeText(e.stack)
            
            //try to get some crashed plugin data
            try{
                const rawplugindata: api.ODPluginData = JSON.parse(fs.readFileSync("./plugins/"+p+"/plugin.json").toString())
                opendiscord.plugins.unknownCrashedPlugins.push({
                    name:rawplugindata.name ?? "./plugins/"+p,
                    description:(rawplugindata.details && rawplugindata.details.shortDescription) ? rawplugindata.details.shortDescription : "This plugin crashed :(",
                })
            }catch{}
        }
    })

    //sorted plugins (based on priority)
    const sortedPlugins = opendiscord.plugins.getAll().sort((a,b) => {
        return (b.priority - a.priority)
    })

    //check for incompatible & missing plugins/dependencies
    const incompatibilities: {from:string,to:string}[] = []
    const missingDependencies: {id:string,missing:string}[] = []
    const missingPlugins: {id:string,missing:string}[] = []

    //go through all plugins for errors
    sortedPlugins.filter((plugin) => plugin.enabled).forEach((plugin) => {
        const from = plugin.id.value
        plugin.dependenciesInstalled().forEach((missing) => missingDependencies.push({id:from,missing}))
        plugin.pluginsIncompatible(opendiscord.plugins).forEach((incompatible) => incompatibilities.push({from,to:incompatible}))
        plugin.pluginsInstalled(opendiscord.plugins).forEach((missing) => missingPlugins.push({id:from,missing}))
    })

    //handle all incompatibilities
    const alreadyLoggedCompatPlugins: string[] = []
    incompatibilities.forEach((match) => {
        if (alreadyLoggedCompatPlugins.includes(match.from) || alreadyLoggedCompatPlugins.includes(match.to)) return
        else alreadyLoggedCompatPlugins.push(match.from,match.to)

        const fromPlugin = opendiscord.plugins.get(match.from)
        if (fromPlugin && !fromPlugin.crashed){
            fromPlugin.crashed = true
            fromPlugin.crashReason = "incompatible.plugin"
        }
        const toPlugin = opendiscord.plugins.get(match.to)
        if (toPlugin && !toPlugin.crashed){
            toPlugin.crashed = true
            toPlugin.crashReason = "incompatible.plugin"
        }

        opendiscord.log(`Incompatible plugins => "${match.from}" & "${match.to}", canceling plugin execution...`,"plugin",[
            {key:"path1",value:"./plugins/"+match.from},
            {key:"path2",value:"./plugins/"+match.to}
        ])
        initPluginError = true
    })

    //handle all missing dependencies
    missingDependencies.forEach((match) => {
        const plugin = opendiscord.plugins.get(match.id)
        if (plugin && !plugin.crashed){
            plugin.crashed = true
            plugin.crashReason = "missing.dependency"
        }

        opendiscord.log(`Missing npm dependency "${match.missing}", canceling plugin execution...`,"plugin",[
            {key:"path",value:"./plugins/"+match.id}
        ])
        initPluginError = true
    })

    //handle all missing plugins
    missingPlugins.forEach((match) => {
        const plugin = opendiscord.plugins.get(match.id)
        if (plugin && !plugin.crashed){
            plugin.crashed = true
            plugin.crashReason = "missing.plugin"
        }

        opendiscord.log(`Missing required plugin "${match.missing}", canceling plugin execution...`,"plugin",[
            {key:"path",value:"./plugins/"+match.id}
        ])
        initPluginError = true
    })

    //exit on error (when soft mode disabled)
    if (!opendiscord.defaults.getDefault("softPluginLoading") && initPluginError){
        console.log("")
        opendiscord.log("Please fix all plugin errors above & try again!","error")
        process.exit(1)
    }

    //preload all events required for every plugin
    for (const plugin of sortedPlugins){
        if (plugin.enabled) plugin.data.events.forEach((event) => opendiscord.events.add(new api.ODEvent(event)))
    }
    
    //execute all working plugins
    for (const plugin of sortedPlugins){
        const status = await plugin.execute(opendiscord.debug,false)
        
        //exit on error (when soft mode disabled)
        if (!status && !opendiscord.defaults.getDefault("softPluginLoading")){
            console.log("")
            opendiscord.log("Please fix all plugin errors above & try again!","error")
            process.exit(1)
        }
    }

    for (const plugin of sortedPlugins){
        if (plugin.enabled){
            opendiscord.debug.debug("Plugin \""+plugin.id.value+"\" loaded",[
                {key:"status",value:(plugin.crashed ? "crashed" : "success")},
                {key:"crashReason",value:(plugin.crashed ? (plugin.crashReason ?? "/") : "/")},
                {key:"author",value:plugin.details.author},
                {key:"version",value:plugin.version.toString()},
                {key:"priority",value:plugin.priority.toString()}
            ])
        }else{
            opendiscord.debug.debug("Plugin \""+plugin.id.value+"\" disabled",[
                {key:"author",value:plugin.details.author},
                {key:"version",value:plugin.version.toString()},
                {key:"priority",value:plugin.priority.toString()}
            ])
        }
    }
}