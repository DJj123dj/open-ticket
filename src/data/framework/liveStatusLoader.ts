import {openticket, api, utilities} from "../../index"

export const loadAllLiveStatusSources = async () => {
    //DEFAULT DJDJ DEV
    openticket.livestatus.add(new api.ODLiveStatusUrlSource("openticket:default-djdj-dev","https://apis.dj-dj.be/status/openticket.json"))
}