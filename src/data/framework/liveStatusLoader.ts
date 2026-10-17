import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllLiveStatusSources() {
    //DEFAULT DJDJ DEV
    opendiscord.livestatus.add(new api.ODLiveStatusUrlSource(opendiscord, "opendiscord:default-djdj-dev", "https://raw.githubusercontent.com/open-discord-bots/open-ticket/refs/heads/dev/src/livestatus.json"))
}