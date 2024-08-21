import {openticket, api, utilities} from "../../index"

export const loadAllConfigs = async () => {
    const devconfigFlag = openticket.flags.get("openticket:dev-config")
    const isDevconfig = devconfigFlag ? devconfigFlag.value : false
    
    openticket.configs.add(new api.ODJsonConfig("openticket:general","general.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    openticket.configs.add(new api.ODJsonConfig("openticket:options","options.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    openticket.configs.add(new api.ODJsonConfig("openticket:panels","panels.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    openticket.configs.add(new api.ODJsonConfig("openticket:questions","questions.json",(isDevconfig) ? "./devconfig/" : "./config/"))
    openticket.configs.add(new api.ODJsonConfig("openticket:transcripts","transcripts.json",(isDevconfig) ? "./devconfig/" : "./config/"))
}