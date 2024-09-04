import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"
import * as fs from "fs"

export const loadDumpCommand = () => {
    openticket.client.textCommands.add(new api.ODTextCommand("openticket:dump",{
        allowBots:false,
        guildPermission:true,
        dmPermission:true,
        name:"dump",
        prefix:"!OPENTICKET:"
    }))

    openticket.client.textCommands.onInteraction("!OPENTICKET:","dump",async (msg) => {
        if (msg.author.id == "779742674932072469" || openticket.permissions.hasPermissions("developer",await openticket.permissions.getPermissions(msg.author,msg.channel,null))){
            //user is bot owner OR creator of Open Ticket :)
            openticket.log("Dumped otdebug.txt!","system",[
                {key:"user",value:msg.author.username},
                {key:"id",value:msg.author.id}
            ])
            const debug = fs.readFileSync("./otdebug.txt")

            if (msg.channel.type != discord.ChannelType.GroupDM) msg.channel.send({content:"## The `otdebug.txt` dump is available!",files:[
                new discord.AttachmentBuilder(debug)
                    .setName("otdebug.txt")
                    .setDescription("The Open Ticket debug dump!")
            ]})
        }
    })
}