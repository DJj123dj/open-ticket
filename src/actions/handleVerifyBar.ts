///////////////////////////////////////
//VERIFYBAR SYSTEM
///////////////////////////////////////
import {openticket, api, utilities} from "../index"

export const registerButtonResponders = async () => {
    //VERIFYBAR SUCCESS
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:verifybar-success",/^od:verifybar-success_([^_]+)/))
    openticket.responders.buttons.get("openticket:verifybar-success").workers.add(
        new api.ODWorker("openticket:handle-verifybar",0,async (instance,params,source,cancel) => {
            const id = instance.interaction.customId.split("_")[1]
            const customData = instance.interaction.customId.split("_")[2] as string|undefined
            
            const verifybar = openticket.verifybars.get(id)
            if (!verifybar) return
            if (verifybar.success) await verifybar.success.executeWorkers(instance,"verifybar",{data:customData ?? null,verifybarMessage:instance.message})
        })
    )

    //VERIFYBAR FAILURE
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:verifybar-failure",/^od:verifybar-failure_([^_]+)/))
    openticket.responders.buttons.get("openticket:verifybar-failure").workers.add(
        new api.ODWorker("openticket:handle-verifybar",0,async (instance,params,source,cancel) => {
            const id = instance.interaction.customId.split("_")[1]
            const customData = instance.interaction.customId.split("_")[2] as string|undefined
            
            const verifybar = openticket.verifybars.get(id)
            if (!verifybar) return
            if (verifybar.failure) await verifybar.failure.executeWorkers(instance,"verifybar",{data:customData ?? null,verifybarMessage:instance.message})
        })
    )
}