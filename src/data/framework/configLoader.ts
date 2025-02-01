import {opendiscord, api, utilities} from "../../index"

export const loadAllConfigs = async () => {
    const devconfigFlag = opendiscord.flags.get("opendiscord:dev-config")
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false
    
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:general","general.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:options","options.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:panels","panels.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:questions","questions.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("opendiscord:transcripts","transcripts.json",(isDevconfig) ? "./devconfig/" : "./config/"))
}