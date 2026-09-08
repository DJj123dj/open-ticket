///////////////////////////////////////
//REGISTER MODAL COMPONENTS
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index.js"
import * as discord from "discord.js"

const modals = opendiscord.components.modals
const lang = opendiscord.languages
const generalConfig = opendiscord.configs.get("opendiscord:general")

export async function registerModalComponents(){
    //TICKET QUESTIONS
    modals.add(new api.ODComponentFactory("opendiscord:ticket-questions"))
    modals.get("opendiscord:ticket-questions").workers.add(
        new api.ODWorker("opendiscord:ticket-questions",0,(instance,params,origin) => {
            const {option,user} = params
            
            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:questions-modal",{
                customId:"od:ticket-questions|"+option.id.value+"|"+origin+"|"+user.id, //add user ID for creating tickets for other users
                title:lang.getTranslation("params.uppercase.ticket")+": "+(option.exists("opendiscord:name")) ? option.get("opendiscord:name").value : option.id.value
            }))

            for (const questionId of option.get("opendiscord:questions").value){
                const question = opendiscord.questions.get(questionId)
                if (!question) continue

                if (question instanceof api.ODShortQuestion){
                    //SHORT QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    component.setComponent(new api.ODShortInputComponent(question.id.value,{
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        placeholder:(question.get("opendiscord:placeholder").value) ? question.get("opendiscord:placeholder").value : undefined,
                        minLength:(question.get("opendiscord:length-enabled").value) ? question.get("opendiscord:length-min").value : undefined,
                        maxLength:Math.min(1024-6,(question.get("opendiscord:length-enabled").value) ? question.get("opendiscord:length-max").value : (1024-6)) //embed field limit - 6x` characters
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODParagraphQuestion){
                    //PARAGRAPH QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    component.setComponent(new api.ODParagraphInputComponent(question.id.value,{
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        placeholder:(question.get("opendiscord:placeholder").value) ? question.get("opendiscord:placeholder").value : undefined,
                        minLength:(question.get("opendiscord:length-enabled").value) ? question.get("opendiscord:length-min").value : undefined,
                        maxLength:Math.min(1024-6,(question.get("opendiscord:length-enabled").value) ? question.get("opendiscord:length-max").value : (1024-6)) //embed field limit - 6x` characters
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODDropdownQuestion){
                    //DROPDOWN QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    component.setComponent(new api.ODDropdownComponent(question.id.value,{
                        type:"string",
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        placeholder:(question.get("opendiscord:placeholder").value) ? question.get("opendiscord:placeholder").value : undefined,
                        maxValues:1,
                        options:question.get("opendiscord:choices").value.map((choice) => ({
                            label:choice.title,
                            emoji:(choice.emoji.length > 0) ? choice.emoji : undefined,
                            description:(choice.description.length > 0) ? choice.description : undefined,
                            value:choice.title
                        }))
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODRadioSelectQuestion){
                    //RADIO SELECT QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    component.setComponent(new api.ODRadioGroupComponent(question.id.value,{
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        options:question.get("opendiscord:choices").value.map((choice) => ({
                            label:choice.title,
                            default:choice.selectedByDefault,
                            description:(choice.description.length > 0) ? choice.description : undefined,
                            value:choice.title
                        }))
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODCheckboxSelectQuestion){
                    //CHECKBOX SELECT QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    component.setComponent(new api.ODCheckboxGroupComponent(question.id.value,{
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        minValues:(question.get("opendiscord:limits-enabled").value) ? question.get("opendiscord:limits-min").value : undefined,
                        maxValues:(question.get("opendiscord:limits-enabled").value) ? question.get("opendiscord:limits-max").value : undefined,
                        options:question.get("opendiscord:choices").value.map((choice) => ({
                            label:choice.title,
                            default:choice.selectedByDefault,
                            description:(choice.description.length > 0) ? choice.description : undefined,
                            value:choice.title
                        }))
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODFileUploadQuestion){
                    //FILE UPLOAD QUESTION
                    const component = new api.ODLabelComponent(question.id.value,{
                        title:question.get("opendiscord:name").value,
                        description:(question.get("opendiscord:description").value) ? question.get("opendiscord:description").value : undefined,
                    })
                    const minimumFilesIfRequired = (question.get("opendiscord:required").value) ? 1 : 0
                    component.setComponent(new api.ODFileUploadComponent(question.id.value,{
                        customId:question.id.value,
                        required:question.get("opendiscord:required").value,
                        minAmount:(question.get("opendiscord:limits-enabled").value) ? Math.max(minimumFilesIfRequired,question.get("opendiscord:limits-min").value) : undefined,
                        maxAmount:(question.get("opendiscord:limits-enabled").value) ? question.get("opendiscord:limits-max").value : undefined,
                    }))
                    modal.addComponent(component,"end")
                }else if (question instanceof api.ODTextDisplayQuestion){
                    //TEXT DISPLAY QUESTION
                    const component = new api.ODTextComponent(question.id.value,{
                        content:question.get("opendiscord:text-contents").value
                    })
                    modal.addComponent(component,"end")
                }
            }
        })
    )

    //CLOSE TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:close-ticket-reason"))
    modals.get("opendiscord:close-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:close-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:close-ticket-reason",{
                customId:"od:close-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.close")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.closePlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //REOPEN TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:reopen-ticket-reason"))
    modals.get("opendiscord:reopen-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:reopen-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:reopen-ticket-reason",{
                customId:"od:reopen-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.reopen")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.reopenPlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //DELETE TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:delete-ticket-reason"))
    modals.get("opendiscord:delete-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:delete-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:delete-ticket-reason",{
                customId:"od:delete-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.delete")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.deletePlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //CLAIM TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:claim-ticket-reason"))
    modals.get("opendiscord:claim-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:claim-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:claim-ticket-reason",{
                customId:"od:claim-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.claim")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.claimPlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //UNCLAIM TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:unclaim-ticket-reason"))
    modals.get("opendiscord:unclaim-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:unclaim-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:unclaim-ticket-reason",{
                customId:"od:unclaim-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.unclaim")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.unclaimPlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //PIN TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:pin-ticket-reason"))
    modals.get("opendiscord:pin-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:pin-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:pin-ticket-reason",{
                customId:"od:pin-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.pin")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.pinPlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )

    //UNPIN TICKET REASON
    modals.add(new api.ODComponentFactory("opendiscord:unpin-ticket-reason"))
    modals.get("opendiscord:unpin-ticket-reason").workers.add(
        new api.ODWorker("opendiscord:unpin-ticket-reason",0,async (instance,params,origin) => {
            const {channel,message} = params

            const modal = instance.setComponent(new api.ODModalComponent("opendiscord:unpin-ticket-reason",{
                customId:"od:unpin-ticket-reason|"+channel.id+"|"+message.id,
                title:lang.getTranslation("actions.buttons.unpin")
            }))

            const reasonComponent = new api.ODLabelComponent("reason",{
                title:lang.getTranslation("params.uppercase.reason"),
                description:lang.getTranslation("actions.modal.unpinPlaceholder")
            })
            reasonComponent.setComponent(new api.ODParagraphInputComponent("reason",{
                customId:"reason",
                required:true,
                placeholder:lang.getTranslation("params.uppercase.reason")
            }))
            modal.addComponent(reasonComponent,"end")
        })
    )
}