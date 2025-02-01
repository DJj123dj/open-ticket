import {opendiscord, api, utilities} from "../../index"

export const migrations = [
    //MIGRATE TO v4.0.0
    new utilities.ODVersionMigration(api.ODVersion.fromString("openticket:version","v4.0.0"),async () => {
        //nothing needs to be transferred :)
    })
]