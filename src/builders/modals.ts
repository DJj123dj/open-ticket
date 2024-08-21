///////////////////////////////////////
//MODAL BUILDERS
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const modals = openticket.builders.modals
const lang = openticket.languages

export const registerAllModals = async () => {
    ticketModals()
}
const ticketModals = () => {
    //TICKET QUESTIONS
    modals.add(new api.ODModal("openticket:ticket-questions"))
    modals.get("openticket:ticket-questions").workers.add(
        new api.ODWorker("openticket:ticket-questions",0,async (instance,params,source) => {
            const {option} = params
            
            instance.setCustomId("od:ticket-questions_"+option.id.value+"_"+source)
            instance.setTitle(option.exists("openticket:name") ? option.get("openticket:name").value : option.id.value)
            const questionIds = option.get("openticket:questions").value
            questionIds.forEach((id) => {
                const question = openticket.questions.get(id)
                if (!question) return
                if (question instanceof api.ODShortQuestion) instance.addQuestion({
                    customId:question.id.value,
                    label:question.get("openticket:name").value,
                    style:"short",
                    required:question.get("openticket:required").value,
                    placeholder:(question.get("openticket:placeholder").value) ? question.get("openticket:placeholder").value : undefined,
                    minLength:(question.get("openticket:length-enabled").value) ? question.get("openticket:length-min").value : undefined,
                    maxLength:(question.get("openticket:length-enabled").value) ? question.get("openticket:length-max").value : undefined
                })
                else if (question instanceof api.ODParagraphQuestion) instance.addQuestion({
                    customId:question.id.value,
                    label:question.get("openticket:name").value,
                    style:"paragraph",
                    required:question.get("openticket:required").value,
                    placeholder:(question.get("openticket:placeholder").value) ? question.get("openticket:placeholder").value : undefined,
                    minLength:(question.get("openticket:length-enabled").value) ? question.get("openticket:length-min").value : undefined,
                    maxLength:(question.get("openticket:length-enabled").value) ? question.get("openticket:length-max").value : undefined
                })
            })
        })
    )

    //CLOSE TICKET REASON
    modals.add(new api.ODModal("openticket:close-ticket-reason"))
    modals.get("openticket:close-ticket-reason").workers.add(
        new api.ODWorker("openticket:close-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:close-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.close"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.closePlaceholder")
            })
        })
    )

    //REOPEN TICKET REASON
    modals.add(new api.ODModal("openticket:reopen-ticket-reason"))
    modals.get("openticket:reopen-ticket-reason").workers.add(
        new api.ODWorker("openticket:reopen-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:reopen-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.reopen"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.reopenPlaceholder")
            })
        })
    )

    //DELETE TICKET REASON
    modals.add(new api.ODModal("openticket:delete-ticket-reason"))
    modals.get("openticket:delete-ticket-reason").workers.add(
        new api.ODWorker("openticket:delete-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:delete-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.delete"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.deletePlaceholder")
            })
        })
    )

    //CLAIM TICKET REASON
    modals.add(new api.ODModal("openticket:claim-ticket-reason"))
    modals.get("openticket:claim-ticket-reason").workers.add(
        new api.ODWorker("openticket:claim-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:claim-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.claim"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.claimPlaceholder")
            })
        })
    )

    //UNCLAIM TICKET REASON
    modals.add(new api.ODModal("openticket:unclaim-ticket-reason"))
    modals.get("openticket:unclaim-ticket-reason").workers.add(
        new api.ODWorker("openticket:unclaim-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:unclaim-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.unclaim"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.unclaimPlaceholder")
            })
        })
    )

    //PIN TICKET REASON
    modals.add(new api.ODModal("openticket:pin-ticket-reason"))
    modals.get("openticket:pin-ticket-reason").workers.add(
        new api.ODWorker("openticket:pin-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:pin-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.pin"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.pinPlaceholder")
            })
        })
    )

    //UNPIN TICKET REASON
    modals.add(new api.ODModal("openticket:unpin-ticket-reason"))
    modals.get("openticket:unpin-ticket-reason").workers.add(
        new api.ODWorker("openticket:unpin-ticket-reason",0,async (instance,params,source) => {
            const {ticket} = params

            instance.setCustomId("od:unpin-ticket-reason_"+ticket.id.value+"_"+source)
            instance.setTitle(lang.getTranslation("actions.buttons.unpin"))
            instance.addQuestion({
                customId:"reason",
                label:lang.getTranslation("params.uppercase.reason"),
                style:"paragraph",
                required:true,
                placeholder:lang.getTranslation("actions.modal.unpinPlaceholder")
            })
        })
    )
}