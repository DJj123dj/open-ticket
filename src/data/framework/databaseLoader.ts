import {opendiscord, api, utilities} from "../../index"
import * as fjs from "formatted-json-stringify"

const devdatabaseFlag = opendiscord.flags.get("opendiscord:dev-database")
const isDevdatabase = devdatabaseFlag ? devdatabaseFlag.value : false

export const loadAllDatabases = async () => {
    opendiscord.databases.add(defaultGlobalDatabase)
    opendiscord.databases.add(defaultStatsDatabase)
    opendiscord.databases.add(defaultTicketsDatabase)
    opendiscord.databases.add(defaultUsersDatabase)
    opendiscord.databases.add(defaultOptionsDatabase)
}

const defaultInlineFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectFormatter(null,false,[
    new fjs.PropertyFormatter("category"),
    new fjs.PropertyFormatter("key"),
    new fjs.DefaultFormatter("value",false)
]))

const defaultTicketFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("category"),
    new fjs.PropertyFormatter("key"),
    new fjs.ObjectFormatter("value",true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("option"),
        new fjs.PropertyFormatter("version"),
        new fjs.ArrayFormatter("data",true,new fjs.ObjectFormatter(null,false,[
            new fjs.PropertyFormatter("id"),
            new fjs.DefaultFormatter("value",false)
        ]))
    ])
]))

const defaultOptionFormatter = new fjs.ArrayFormatter(null,true,new fjs.ObjectFormatter(null,true,[
    new fjs.PropertyFormatter("category"),
    new fjs.PropertyFormatter("key"),
    new fjs.ObjectFormatter("value",true,[
        new fjs.PropertyFormatter("id"),
        new fjs.PropertyFormatter("type"),
        new fjs.PropertyFormatter("version"),
        new fjs.ArrayFormatter("data",true,new fjs.ObjectFormatter(null,false,[
            new fjs.PropertyFormatter("id"),
            new fjs.DefaultFormatter("value",false)
        ]))
    ])
]))

export const defaultGlobalDatabase = new api.ODFormattedJsonDatabase("opendiscord:global","global.json",defaultInlineFormatter,(isDevdatabase) ? "./devdatabase/" : "./database/")
export const defaultStatsDatabase = new api.ODFormattedJsonDatabase("opendiscord:stats","stats.json",defaultInlineFormatter,(isDevdatabase) ? "./devdatabase/" : "./database/")
export const defaultTicketsDatabase = new api.ODFormattedJsonDatabase("opendiscord:tickets","tickets.json",defaultTicketFormatter,(isDevdatabase) ? "./devdatabase/" : "./database/")
export const defaultUsersDatabase = new api.ODFormattedJsonDatabase("opendiscord:users","users.json",defaultInlineFormatter,(isDevdatabase) ? "./devdatabase/" : "./database/")
export const defaultOptionsDatabase = new api.ODFormattedJsonDatabase("opendiscord:options","options.json",defaultOptionFormatter,(isDevdatabase) ? "./devdatabase/" : "./database/")