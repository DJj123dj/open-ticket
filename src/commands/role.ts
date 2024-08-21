///////////////////////////////////////
//ROLE BUTTON (not command)
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerButtonResponders = async () => {
    //ROLE OPTION BUTTON RESPONDER
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:role-option",/^od:role-option_/))
    openticket.responders.buttons.get("openticket:role-option").workers.add(
        new api.ODWorker("openticket:role-option",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //get option
            const optionId = instance.interaction.customId.split("_")[2]
            const option = openticket.options.get(optionId)
            if (!option || !(option instanceof api.ODRoleOption)){
                //error
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-option-unknown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //reaction role
            await instance.defer("reply",true)
            const res = await openticket.actions.get("openticket:reaction-role").run("panel-button",{guild,user,option,overwriteMode:null})
            if (!res.result || !res.role){
                //error
                await instance.reply(await openticket.builders.messages.getSafe("openticket:error").build(source,{guild,channel:instance.channel,user,error:"Unable to receive role update data from worker!",layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.system.replyOnReactionRole) await instance.reply(await openticket.builders.messages.getSafe("openticket:reaction-role").build("panel-button",{guild,user,role:res.role,result:res.result}))
        })
    )
}