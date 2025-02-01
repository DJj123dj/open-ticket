import {opendiscord, api, utilities} from "../../index"

export const loadAllPosts = async () => {
    const generalConfig = opendiscord.configs.get("opendiscord:general")
    if (!generalConfig) return
    const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")
    if (!transcriptConfig) return

    //LOGS CHANNEL
    if (generalConfig.data.system.logs.enabled) opendiscord.posts.add(new api.ODPost("opendiscord:logs",generalConfig.data.system.logs.channel))

    //TRANSCRIPTS CHANNEL
    if (transcriptConfig.data.general.enabled && transcriptConfig.data.general.enableChannel) opendiscord.posts.add(new api.ODPost("opendiscord:transcripts",transcriptConfig.data.general.channel))
}