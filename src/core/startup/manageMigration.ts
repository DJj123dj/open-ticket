import {opendiscord, api, utilities} from "../../index"

export const loadVersionMigrationSystem = async () => {
    //ENTER MIGRATION CONTEXT
    await preloadMigrationContext()

    const lastVersion = await isMigrationRequired()
    opendiscord.versions.add(lastVersion ? lastVersion : api.ODVersion.fromString("opendiscord:last-version",opendiscord.versions.get("opendiscord:version").toString()))
    if (lastVersion && !opendiscord.flags.get("opendiscord:no-migration").value){
        //MIGRATION IS REQUIRED
        opendiscord.log("Detected old data!","info")
        opendiscord.log("Starting closed API context...","debug")
        await utilities.timer(600)
        opendiscord.log("Migrating data to new version...","debug")
        await loadAllVersionMigrations(lastVersion)
        opendiscord.log("Stopping closed API context...","debug")
        await utilities.timer(400)
        opendiscord.log("All data is now up to date!","info")
        await utilities.timer(200)
        console.log("---------------------------------------------------------------------")
    }
    saveAllVersionsToDatabase()

    //DEFAULT FLAGS
    if (opendiscord.flags.exists("opendiscord:no-plugins") && opendiscord.flags.get("opendiscord:no-plugins").value) opendiscord.defaults.setDefault("pluginLoading",false)
    if (opendiscord.flags.exists("opendiscord:soft-plugins") && opendiscord.flags.get("opendiscord:soft-plugins").value) opendiscord.defaults.setDefault("softPluginLoading",true)
    if (opendiscord.flags.exists("opendiscord:crash") && opendiscord.flags.get("opendiscord:crash").value) opendiscord.defaults.setDefault("crashOnError",true)
    if (opendiscord.flags.exists("opendiscord:force-slash-update") && opendiscord.flags.get("opendiscord:force-slash-update").value) opendiscord.defaults.setDefault("forceSlashCommandRegistration",true)

    //LEAVE MIGRATION CONTEXT
    await unloadMigrationContext()
}

const preloadMigrationContext = async () => {
    opendiscord.debug.debug("-- MIGRATION CONTEXT START --")
    await (await import("../../data/framework/flagLoader.js")).loadAllFlags()
    await opendiscord.flags.init()
    await (await import("../../data/framework/configLoader.js")).loadAllConfigs()
    await opendiscord.configs.init()
    await (await import("../../data/framework/databaseLoader.js")).loadAllDatabases()
    await opendiscord.databases.init()
    opendiscord.debug.visible = true
}

const unloadMigrationContext = async () => {
    opendiscord.debug.visible = false
    await opendiscord.databases.loopAll((database,id) => {opendiscord.databases.remove(id)})
    await opendiscord.configs.loopAll((config,id) => {opendiscord.configs.remove(id)})
    await opendiscord.flags.loopAll((flag,id) => {opendiscord.flags.remove(id)})
    opendiscord.debug.debug("-- MIGRATION CONTEXT END --")
}

const isMigrationRequired = async (): Promise<false|api.ODVersion> => {
    const rawVersion = await opendiscord.databases.get("opendiscord:global").get("opendiscord:last-version","opendiscord:version")
    if (!rawVersion) return false
    const version = api.ODVersion.fromString("opendiscord:last-version",rawVersion)
    if (opendiscord.versions.get("opendiscord:version").compare(version) == "higher"){
        return version
    }else return false
}

const loadAllVersionMigrations = async (lastVersion:api.ODVersion) => {
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a,b) => {
        const comparison = a.version.compare(b.version)
        if (comparison == "equal") return 0
        else if (comparison == "higher") return 1
        else return -1
    })
    for (const migration of migrations){
        if (migration.version.compare(lastVersion) == "higher"){
            const success = await migration.migrate()
            if (success) opendiscord.log("Migrated data to "+migration.version.toString()+"!","debug",[
                {key:"success",value:success ? "true" : "false"}
            ])
        }
    }
}

const saveAllVersionsToDatabase = async () => {
    const globalDatabase = opendiscord.databases.get("opendiscord:global")

    await opendiscord.versions.loopAll(async (version,id) => {
        await globalDatabase.set("opendiscord:last-version",id.value,version.toString())    
    })
}