///////////////////////////////////////
//FILE BUILDERS
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const files = opendiscord.builders.files
const lang = opendiscord.languages
const transcriptConfig = opendiscord.configs.get("openticket:transcripts")

export const registerAllFiles = async () => {
    transcriptFiles()
}


const transcriptFiles = () => {
    //TEXT TRANSCRIPT
    files.add(new api.ODFile("openticket:text-transcript"))
    files.get("openticket:text-transcript").workers.add(
        new api.ODWorker("openticket:text-transcript",0,async (instance,params,source) => {
            const {guild,channel,user,ticket,compiler,result} = params
            
            const fileMode = transcriptConfig.data.textTranscriptStyle.fileMode
            const customName = transcriptConfig.data.textTranscriptStyle.customFileName

            const creatorId = ticket.get("openticket:opened-by").value ?? "unknown-creator-id"
            const creator = (await opendiscord.tickets.getTicketUser(ticket,"creator"))

            if (fileMode == "custom") instance.setName(customName.split(".")[0]+".txt")
            else if (fileMode == "user-id") instance.setName(creatorId+".txt")
            else if (fileMode == "user-name")  instance.setName((creator ? creator.username : "unknown-creator-name")+".txt")
            else if (fileMode == "channel-id")  instance.setName(channel.id+".txt")
            else if (fileMode == "channel-name")  instance.setName(channel.name+".txt")
            else instance.setName("transcript.txt")

            instance.setDescription(lang.getTranslation("transcripts.success.textFileDescription"))
            
            if (compiler.id.value != "openticket:text-compiler" || !result.data || typeof result.data.contents != "string"){
                instance.setContents("<invalid-transcript-compiler>")
                return
            }
            instance.setContents(result.data.contents)
        })
    )
}