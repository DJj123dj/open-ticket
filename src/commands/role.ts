///////////////////////////////////////
//ROLE BUTTON (not command)
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerButtonResponders = async () => {
    //ROLE OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:role-option",/^od:role-option_/))
    opendiscord.responders.buttons.get("opendiscord:role-option").workers.add(
        new api.ODWorker("opendiscord:role-option",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //get option
            const optionId = instance.interaction.customId.split("_")[2]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODRoleOption)){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //reaction role
            await instance.defer("reply",true)
            const res = await opendiscord.actions.get("opendiscord:reaction-role").run("panel-button",{guild,user,option,overwriteMode:null})
            if (!res.result || !res.role){
                //error
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild,channel:instance.channel,user,error:"Unable to receive role update data from worker!",layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.system.replyOnReactionRole) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:reaction-role").build("panel-button",{guild,user,role:res.role,result:res.result}))
        })
    )
}