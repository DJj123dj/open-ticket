import {opendiscord, api, utilities} from "../../index"

export const loadAllConfigs = async () => {
    const devconfigFlag = opendiscord.flags.get("openticket:dev-config")
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false
    
    opendiscord.configs.add(new api.ODJsonConfig("openticket:general","general.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("openticket:options","options.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("openticket:panels","panels.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("openticket:questions","questions.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    opendiscord.configs.add(new api.ODJsonConfig("openticket:transcripts","transcripts.json",(isDevconfig) ? "./devconfig/" : "./config/"))
}