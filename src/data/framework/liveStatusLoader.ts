import {openticket, api, utilities} from "../../index"

export const loadAllLiveStatusSources = async () => {
    //DEFAULT DJDJ DEV
    openticket.livestatus.add(new api.ODLiveStatusUrlSource("openticket:default-djdj-dev","https://raw.githubusercontent.com/DJj123dj/open-ticket/refs/heads/dev/src/livestatus.json"))
}