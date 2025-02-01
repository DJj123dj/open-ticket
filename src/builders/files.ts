///////////////////////////////////////
//FILE BUILDERS
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const files = opendiscord.builders.files
const lang = opendiscord.languages
const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")

export const registerAllFiles = async () => {
    transcriptFiles()
}


const transcriptFiles = () => {
    //TEXT TRANSCRIPT
    files.add(new api.ODFile("opendiscord:text-transcript"))
    files.get("opendiscord:text-transcript").workers.add(
        new api.ODWorker("opendiscord:text-transcript",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            
            const fileMode = transcriptConfig.data.textTranscriptStyle.fileMode
            const customName = transcriptConfig.data.textTranscriptStyle.customFileName

            const creatorId = ticket.get("opendiscord:opened-by").value ?? "unknown-creator-id"
            const creator = (await opendiscord.tickets.getTicketUser(ticket,"creator"))

            if (fileMode == "custom") instance.setName(customName.split(".")[0]+".txt")
            else if (fileMode == "user-id") instance.setName(creatorId+".txt")
            else if (fileMode == "user-name")  instance.setName((creator ? creator.username : "unknown-creator-name")+".txt")
            else if (fileMode == "channel-id")  instance.setName(channel.id+".txt")
            else if (fileMode == "channel-name")  instance.setName(channel.name+".txt")
            else instance.setName("transcript.txt")

            instance.setDescription(lang.getTranslation("transcripts.success.textFileDescription"))
            
            if (compiler.id.value != "opendiscord:text-compiler" || !result.data || typeof result.data.contents != "string"){
                instance.setContents("<invalid-transcript-compiler>")
                return
            }
            instance.setContents(result.data.contents)
        })
    )
}