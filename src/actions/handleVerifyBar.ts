///////////////////////////////////////
//VERIFYBAR SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"

export const registerButtonResponders = async () => {
    //VERIFYBAR SUCCESS
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:verifybar-success",/^od:verifybar-success_([^_]+)/))
    opendiscord.responders.buttons.get("opendiscord:verifybar-success").workers.add(
        new api.ODWorker("opendiscord:handle-verifybar",0,async (instance,params,source,cancel) => {
            const id = instance.interaction.customId.split("_")[1]
            const customData = instance.interaction.customId.split("_")[2] as string|undefined
            
            const verifybar = opendiscord.verifybars.get(id)
            if (!verifybar) return
            if (verifybar.success) await verifybar.success.executeWorkers(instance,"verifybar",{data:customData ?? null,verifybarMessage:instance.message})
        })
    )

    //VERIFYBAR FAILURE
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:verifybar-failure",/^od:verifybar-failure_([^_]+)/))
    opendiscord.responders.buttons.get("opendiscord:verifybar-failure").workers.add(
        new api.ODWorker("opendiscord:handle-verifybar",0,async (instance,params,source,cancel) => {
            const id = instance.interaction.customId.split("_")[1]
            const customData = instance.interaction.customId.split("_")[2] as string|undefined
            
            const verifybar = opendiscord.verifybars.get(id)
            if (!verifybar) return
            if (verifybar.failure) await verifybar.failure.executeWorkers(instance,"verifybar",{data:customData ?? null,verifybarMessage:instance.message})
        })
    )
}