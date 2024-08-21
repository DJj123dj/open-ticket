import {openticket, api, utilities} from "../../index"

export const loadAllPosts = async () => {
    const generalConfig = openticket.configs.get("openticket:general")
    if (!generalConfig) return
    const transcriptConfig = openticket.configs.get("openticket:transcripts")
    if (!transcriptConfig) return

    //LOGS CHANNEL
    if (generalConfig.data.system.logs.enabled) openticket.posts.add(new api.ODPost("openticket:logs",generalConfig.data.system.logs.channel))

    //TRANSCRIPTS CHANNEL
    if (transcriptConfig.data.general.enabled && transcriptConfig.data.general.enableChannel) openticket.posts.add(new api.ODPost("openticket:transcripts",transcriptConfig.data.general.channel))
}