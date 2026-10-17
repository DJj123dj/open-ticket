///////////////////////////////////////
//TICKET COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities, openticketUtils} from "../index.js"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")
const lang = opendiscord.languages
const panelMsgState = opendiscord.states.get("opendiscord:panel-message")

export async function registerCommandResponders(){
    //TICKET COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:ticket",generalConfig.data.prefix,"ticket"))
    opendiscord.responders.commands.get("opendiscord:ticket").workers.add([
        new api.ODWorker("opendiscord:ticket",0,async (instance,params,origin,cancel) => {
            const {user,member,channel,guild} = instance
            
            //responder checks
            const hasPerms = await openticketUtils.replyHasPermissions(instance,origin,"ticket")
            if (!hasPerms) return cancel()
            
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //get option data
            const optionId = instance.options.getString("id",true)
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //don't allow createTicketForOtherUser to non-global-admins when enabled
            const otherUser = (generalConfig.data.ticketSystem.enableCreateTicketForOtherUser) ? instance.options.getUser("user",false) : null
            if (otherUser && generalConfig.data.ticketSystem.enableCreateTicketForOtherUser){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild,{allowChannelRoleScope:false,allowChannelUserScope:false,allowGlobalRoleScope:true,allowGlobalUserScope:true}))){
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }
            }
            if (otherUser) opendiscord.log(instance.user.displayName+" created a ticket for "+otherUser.displayName+" using the 'ticket' command!","warning",[
                {key:"commanduser",value:user.username},
                {key:"commanduserid",value:user.id,hidden:true},
                {key:"ticketuser",value:otherUser.username},
                {key:"ticketuserid",value:otherUser.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:origin}
            ])
            
            //start ticket creation
            const ticketUser = otherUser ?? user
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //SEND MODAL
                instance.modal(await opendiscord.components.modals.get("opendiscord:ticket-questions").build(origin,{guild,channel,user:ticketUser,option}))
            }else{
                //check ticket permissions (modals need check after submit)
                if (!(await openticketUtils.checkTicketCreationPerms(instance,origin,guild,ticketUser,option))) return cancel()
            
                //CREATE TICKET
                await instance.defer(true)
                const res = await opendiscord.actions.get("opendiscord:create-ticket").run(origin,{guild,user:ticketUser,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel:instance.channel,user:ticketUser,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(origin,{guild,channel:res.channel,user:ticketUser,ticket:res.ticket}))
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,origin,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'ticket' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:origin}
            ])
        })
    ])
}

export async function registerButtonResponders(){
    //TICKET OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:ticket-option",/^od:ticket-option\|([^|]+)/))
    opendiscord.responders.buttons.get("opendiscord:ticket-option").workers.add(
        new api.ODWorker("opendiscord:ticket-option",0,async (instance,params,origin,cancel) => {
            const {guild,channel,user,message} = instance
            
            const match = /^od:ticket-option\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const optionId = match[1]

            //check message state
            const state = await panelMsgState.getMsgState({channel,message})
            if (!state){
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel,user,error:lang.getTranslationWithParams("errors.descriptions.panelStateExpired",["/panel"]),layout:"simple",customTitle:"Message State Expired"}))
                return cancel()
            }
            
            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || channel.isDMBased()) return cancel()

            //get option data
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //SEND MODAL
                instance.modal(await opendiscord.components.modals.get("opendiscord:ticket-questions").build("panel-button",{guild,channel,user,option}))
            }else{
                //check ticket permissions (modals need check after submit)
                if (!(await openticketUtils.checkTicketCreationPerms(instance,"panel-button",guild,user,option))) return cancel()
            
                //CREATE TICKET
                await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update",true)

                const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-button",{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-button",{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        })
    )
}

export async function registerModalResponders(){
    //TICKET QUESTIONS RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:ticket-questions",/^od:ticket-questions\|([^|]+)\|([^|]+)\|([^|]+)/))
    opendiscord.responders.modals.get("opendiscord:ticket-questions").workers.add([
        new api.ODWorker("opendiscord:ticket-questions",0,async (instance,params,origin,cancel) => {
            const {guild,channel} = instance

            const match = /^od:ticket-questions\|([^|]+)\|([^|]+)\|([^|]+)/.exec(instance.interaction.customId)
            if (!match) return cancel()
            const optionId = match[1]
            const originalOrigin = match[2] as ("panel-button"|"panel-dropdown"|"slash"|"text"|"other")
            const user = await opendiscord.client.fetchUser(match[3])
            if (!user) return cancel()
            
            //responder checks
            const isInGuild = await openticketUtils.replyIsInGuild(instance,origin)
            if (!isInGuild || !guild || !channel || channel.isDMBased()) return cancel()

            //get option data
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(origin,{guild:instance.guild,channel,user:instance.user}))
                return cancel()
            }

            //check ticket permissions (modals need check after submit)
            if (!(await openticketUtils.checkTicketCreationPerms(instance,originalOrigin,guild,user,option))) return cancel()

            //get answers
            const answers: api.ODQuestionAnswer[] = []
            for (const questionId of option.get("opendiscord:questions").value){
                const question = opendiscord.questions.get(questionId)
                if (!question) continue
                if (question instanceof api.ODShortQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"short",
                    value:instance.values.getTextField(questionId,false)
                })
                else if (question instanceof api.ODParagraphQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"paragraph",
                    value:instance.values.getTextField(questionId,false)
                })
                else if (question instanceof api.ODDropdownQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"dropdown",
                    value:instance.values.getStringDropdownValues(questionId)[0] ?? null
                })
                else if (question instanceof api.ODRadioSelectQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"radio-select",
                    value:instance.values.getRadioGroup(questionId,false)
                })
                else if (question instanceof api.ODCheckboxSelectQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"checkbox-select",
                    value:(instance.values.getCheckboxGroup(questionId).length > 0) ? instance.values.getCheckboxGroup(questionId).map((opt) => "> "+opt).join("\n") : null
                })
                else if (question instanceof api.ODFileUploadQuestion) answers.push({
                    id:questionId,
                    name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : questionId,
                    type:"file-upload",
                    files:(instance.values.getUploadedFiles(questionId).length > 0) ? instance.values.getUploadedFiles(questionId).map(({id,url,name,title,description,contentType}) => ({id,url,name,title,description,contentType})) : []
                })
            }
            
            await instance.defer((generalConfig.data.ticketSystem.replyOnTicketCreation) ? "reply" : "update",true)

            //CREATE TICKET
            const res = await opendiscord.actions.get("opendiscord:create-ticket").run(originalOrigin,{guild,user,answers,option})
            if (!res.channel || !res.ticket){
                //error
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(origin,{guild,channel,user,error:"Unable to receive ticket or channel from callback! #2",layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.ticketSystem.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(originalOrigin,{guild,channel:res.channel,user,ticket:res.ticket}))
        })
    ])
}