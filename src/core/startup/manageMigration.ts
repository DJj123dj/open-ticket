import { opendiscord, api, utilities } from "../../index.js"
import fs from "fs"
import path from "path"

/**Check if the no-migration flag is active. */
function isMigrationAllowedFromFlag() {
    return (!process.argv.includes("--no-migration") && !process.argv.includes("-nm"))
}

/**Read the global.json database raw to detect the last version of the bot. */
function getRawLastVersion() {
    const isDevDatabase = process.argv.includes("--dev-database") || process.argv.includes("-dd")
    const globalDatabaseLocation = path.join(process.cwd(), (isDevDatabase) ? "./devdatabase/global.json" : "./database/global.json")
    const rawData: api.ODJsonDatabaseStructure = JSON.parse(fs.readFileSync(globalDatabaseLocation).toString())
    const lastVersion = rawData.find((d) => d.category === "opendiscord:last-version" && d.key === "opendiscord:version")?.value ?? null
    return lastVersion as string|null
}

/**Check if migration is required. Returns the last version used in the database. */
async function isMigrationRequired(): Promise<false|api.ODVersion> {
    const rawVersion = getRawLastVersion()
    if (!rawVersion) return false
    const version = api.ODVersion.fromString("opendiscord:last-version", rawVersion)
    if (opendiscord.versions.get("opendiscord:version").compare(version) === "higher"){
        return version
    }else return false
}

/**Save all versions in `opendiscord.versions` to the global database. */
async function saveAllVersionsToDatabase() {
    const globalDatabase = opendiscord.databases.get("opendiscord:global")

    await opendiscord.versions.loopAll(async (version, id) => {
        await globalDatabase.set("opendiscord:last-version", id.value, version.toString())
    })
}

/**Initialize the migration context by loading the built-in flags, configs & databases. */
async function preloadMigrationContext() {
    opendiscord.debug.debug("-- MIGRATION CONTEXT START --")
    await (await import("../../data/framework/flagLoader.js")).loadAllFlags()
    await opendiscord.flags.init()
    await (await import("../../data/framework/configLoader.js")).loadAllConfigs()
    await opendiscord.configs.init()
    await (await import("../../data/framework/databaseLoader.js")).loadAllDatabases()
    await opendiscord.databases.init()
    opendiscord.debug.visible = true
}

export async function loadVersionMigrationSystem() {
    const lastVersion = await isMigrationRequired()

    //save last version in version manager (OR set to current version if no migration is required)
    opendiscord.versions.add(lastVersion ? lastVersion : api.ODVersion.fromString("opendiscord:last-version", opendiscord.versions.get("opendiscord:version").toString()))

    //MIGRATION IS REQUIRED
    if (lastVersion && isMigrationAllowedFromFlag()){
        //BEFORE STARTUP MIGRATION
        opendiscord.log("Detected old data!", "info")
        await loadBeforeStartupMigrations(lastVersion)
    }

    //ENTER MIGRATION CONTEXT (must be separate for flags to work)
    await preloadMigrationContext()

    if (lastVersion && isMigrationAllowedFromFlag()){
        //CONTEXT MIGRATION
        opendiscord.log("Starting restricted API context...", "debug")
        await utilities.timer(600)
        opendiscord.log("Migrating data to new version...", "debug")
        await loadContextMigrations(lastVersion)
        opendiscord.log("Stopping restricted API context...", "debug")
        await utilities.timer(400)
        opendiscord.log("All data is now up to date!", "info")
        await utilities.timer(200)
        console.log("---------------------------------------------------------------------")
    }
    saveAllVersionsToDatabase()

    //SET FUSES & PROPERTIES OF SPECIAL FLAGS
    if (opendiscord.flags.exists("opendiscord:no-plugins") && opendiscord.flags.get("opendiscord:no-plugins").value) opendiscord.sharedFuses.setFuse("pluginLoading", false)
    if (opendiscord.flags.exists("opendiscord:soft-plugins") && opendiscord.flags.get("opendiscord:soft-plugins").value) opendiscord.sharedFuses.setFuse("softPluginLoading", true)
    if (opendiscord.flags.exists("opendiscord:crash") && opendiscord.flags.get("opendiscord:crash").value) opendiscord.sharedFuses.setFuse("crashOnError", true)
    if (opendiscord.flags.exists("opendiscord:force-slash-update") && opendiscord.flags.get("opendiscord:force-slash-update").value){
        opendiscord.sharedFuses.setFuse("forceSlashCommandRegistration", true)
        opendiscord.sharedFuses.setFuse("forceContextMenuRegistration", true)
    }
    if (opendiscord.flags.exists("opendiscord:silent") && opendiscord.flags.get("opendiscord:silent").value) opendiscord.console.silent = true

    //LEAVE MIGRATION CONTEXT
    await unloadMigrationContext()

    return lastVersion
}

/**Unload the migration context to start the bot normally. */
async function unloadMigrationContext() {
    opendiscord.debug.visible = false
    await opendiscord.databases.loopAll((database, id) => {opendiscord.databases.remove(id)})
    await opendiscord.configs.loopAll((config, id) => {opendiscord.configs.remove(id)})
    await opendiscord.flags.loopAll((flag, id) => {opendiscord.flags.remove(id)})
    opendiscord.debug.debug("-- MIGRATION CONTEXT END --")
}

/**Create a backup of the (dev)config & database before migrating. */
function createMigrationBackup() {
    if (fs.existsSync("./.backup/")) fs.rmSync("./.backup/", {force:true, recursive:true})
    fs.mkdirSync("./.backup/")

    const devconfigFlag = opendiscord.flags.get("opendiscord:dev-config")
    const isDevConfig = devconfigFlag ? devconfigFlag.value : false
    const devDatabaseFlag = opendiscord.flags.get("opendiscord:dev-database")
    const isDevDatabase = devDatabaseFlag ? devDatabaseFlag.value : false

    if (isDevConfig) fs.cpSync("./devconfig/", "./.backup/devconfig/", {force:true, recursive:true})
    else fs.cpSync("./config/", "./.backup/config/", {force:true, recursive:true})
    if (isDevDatabase) fs.cpSync("./devdatabase/", "./.backup/devdatabase/", {force:true, recursive:true})
    else fs.cpSync("./database/", "./.backup/database/", {force:true, recursive:true})
}

/**Execute all version migration functions which are handled before any flags, configs or databases are loaded. */
async function loadBeforeStartupMigrations(lastVersion:api.ODVersion) {
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a, b) => {
        const comparison = a.version.compare(b.version)
        if (comparison === "equal") return 0
        else if (comparison === "higher") return 1
        else return -1
    })
    if (migrations.length > 0){
        //create backup of config & database
        createMigrationBackup()
    }

    for (const migration of migrations){
        if (migration.version.compare(lastVersion) === "higher"){
            const success = await migration.migrateBeforeStartup()
            if (success) opendiscord.log("Migrated data to " + migration.version.toString() + "!", "debug", [
                {key:"success", value:success ? "true" : "false"},
                {key:"type", value:"before-startup"}
            ])
            else throw new api.ODSystemError("Migration Error: Unable to migrate database & config to the new version of the bot.")
        }
    }
}

/**Execute all version migration functions which are handled in the restricted migration context. */
async function loadContextMigrations(lastVersion:api.ODVersion) {
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a, b) => {
        const comparison = a.version.compare(b.version)
        if (comparison === "equal") return 0
        else if (comparison === "higher") return 1
        else return -1
    })
    if (migrations.length > 0){
        //create backup of config & database
        createMigrationBackup()
    }

    for (const migration of migrations){
        if (migration.version.compare(lastVersion) === "higher"){
            const success = await migration.migrateInContext()
            if (success) opendiscord.log("Migrated data to " + migration.version.toString() + "!", "debug", [
                {key:"success", value:success ? "true" : "false"},
                {key:"type", value:"restricted-context"}
            ])
            else throw new api.ODSystemError("Migration Error: Unable to migrate database & config to the new version of the bot.")
        }
    }
}

/**Execute all version migration functions which are handled in the normal startup sequence. */
export async function loadAfterStartupMigrations(lastVersion:api.ODVersion) {
    const migrations = (await import("./migration.js")).migrations
    migrations.sort((a, b) => {
        const comparison = a.version.compare(b.version)
        if (comparison === "equal") return 0
        else if (comparison === "higher") return 1
        else return -1
    })
    if (migrations.length > 0){
        //create backup of config & database
        createMigrationBackup()
    }

    for (const migration of migrations){
        if (migration.version.compare(lastVersion) === "higher"){
            const success = await migration.migrateAfterStartup()
            if (success) opendiscord.log("Migrated data to " + migration.version.toString() + "!", "debug", [
                {key:"success", value:success ? "true" : "false"},
                {key:"type", value:"after-startup"}
            ])
            else throw new api.ODSystemError("Migration Error: Unable to migrate database & config to the new version of the bot.")
        }
    }
}