///////////////////////////////////////
//TICKET COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //TICKET COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:ticket",generalConfig.data.prefix,/^ticket/))
    opendiscord.responders.commands.get("opendiscord:ticket").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.ticket
            
            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!opendiscord.permissions.hasPermissions("support",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await opendiscord.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("opendiscord:ticket",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //get option
            const optionId = instance.options.getString("id",true)
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //check ticket permissions
            const res = await opendiscord.actions.get("opendiscord:create-ticket-permissions").run(source,{guild,user,option})
            if (!res.valid){
                //error
                if (res.reason == "blacklist") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-blacklisted").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                else if (res.reason == "cooldown") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-cooldown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,until:res.cooldownUntil}))
                else if (res.reason == "global-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global"}))
                else if (res.reason == "global-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global-user"}))
                else if (res.reason == "option-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option"}))
                else if (res.reason == "option-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option-user"}))
                else instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Unknown invalid_permission reason => calculation failed #1",layout:"advanced"}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //send modal
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build(source,{guild,channel,user,option}))
            }else{
                //create ticket
                await instance.defer(true)
                const res = await opendiscord.actions.get("opendiscord:create-ticket").run(source,{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(source,{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'ticket' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //TICKET OPTION BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:ticket-option",/^od:ticket-option_/))
    opendiscord.responders.buttons.get("opendiscord:ticket-option").workers.add(
        new api.ODWorker("opendiscord:ticket-option",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //get option
            const optionId = instance.interaction.customId.split("_")[2]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //check ticket permissions
            const res = await opendiscord.actions.get("opendiscord:create-ticket-permissions").run("panel-button",{guild,user,option})
            if (!res.valid){
                //error
                if (res.reason == "blacklist") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-blacklisted").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                else if (res.reason == "cooldown") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-cooldown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,until:res.cooldownUntil}))
                else if (res.reason == "global-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global"}))
                else if (res.reason == "global-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global-user"}))
                else if (res.reason == "option-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option"}))
                else if (res.reason == "option-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option-user"}))
                else instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Unknown invalid_permission reason => calculation failed #1",layout:"advanced"}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //send modal
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build("panel-button",{guild,channel,user,option}))
            }else{
                //create ticket
                await instance.defer("reply",true)
                const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-button",{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                if (generalConfig.data.system.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-button",{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        })
    )
}

export const registerDropdownResponders = async () => {
    //PANEL DROPDOWN TICKETS DROPDOWN RESPONDER
    opendiscord.responders.dropdowns.add(new api.ODDropdownResponder("opendiscord:panel-dropdown-tickets",/^od:panel-dropdown_/))
    opendiscord.responders.dropdowns.get("opendiscord:panel-dropdown-tickets").workers.add(
        new api.ODWorker("opendiscord:panel-dropdown-tickets",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //get option
            const optionId = instance.values.getStringValues()[0].split("_")[2]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                return cancel()
            }

            //check ticket permissions
            const res = await opendiscord.actions.get("opendiscord:create-ticket-permissions").run("panel-dropdown",{guild,user,option})
            if (!res.valid){
                //error
                if (res.reason == "blacklist") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-blacklisted").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user}))
                else if (res.reason == "cooldown") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-cooldown").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,until:res.cooldownUntil}))
                else if (res.reason == "global-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global"}))
                else if (res.reason == "global-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"global-user"}))
                else if (res.reason == "option-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option"}))
                else if (res.reason == "option-user-limit") instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions-limits").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,limit:"option-user"}))
                else instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Unknown invalid_permission reason => calculation failed #1",layout:"advanced"}))
                return cancel()
            }

            //start ticket creation
            if (option.exists("opendiscord:questions") && option.get("opendiscord:questions").value.length > 0){
                //send modal
                instance.modal(await opendiscord.builders.modals.getSafe("opendiscord:ticket-questions").build("panel-dropdown",{guild,channel,user,option}))
            }else{
                //create ticket
                await instance.defer("reply",true)
                const res = await opendiscord.actions.get("opendiscord:create-ticket").run("panel-dropdown",{guild,user,answers:[],option})
                if (!res.channel || !res.ticket){
                    //error
                    await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild,channel:instance.channel,user,error:"Unable to receive ticket or channel from callback! #1",layout:"advanced"}))
                    return cancel()
                }
                if (generalConfig.data.system.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build("panel-dropdown",{guild,channel:res.channel,user,ticket:res.ticket}))
            }
        })
    )
}

export const registerModalResponders = async () => {
    //TICKET QUESTIONS RESPONDER
    opendiscord.responders.modals.add(new api.ODModalResponder("opendiscord:ticket-questions",/^od:ticket-questions_/))
    opendiscord.responders.modals.get("opendiscord:ticket-questions").workers.add([
        new api.ODWorker("opendiscord:ticket-questions",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!channel) throw new api.ODSystemError("The 'Ticket Questions' modal requires a channel for responding!")
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel,user:instance.user}))
                return cancel()
            }

            const originalSource = instance.interaction.customId.split("_")[2] as ("panel-button"|"panel-dropdown"|"slash"|"text"|"other")

            //get option
            const optionId = instance.interaction.customId.split("_")[1]
            const option = opendiscord.options.get(optionId)
            if (!option || !(option instanceof api.ODTicketOption)){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-option-unknown").build(source,{guild:instance.guild,channel,user:instance.user}))
                return cancel()
            }

            //get answers
            const answers: {id:string,name:string,type:"short"|"paragraph",value:string|null}[] = []
            option.get("opendiscord:questions").value.forEach((id) => {
                const question = opendiscord.questions.get(id)
                if (!question) return
                if (question instanceof api.ODShortQuestion){
                    answers.push({
                        id,
                        name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : id,
                        type:"short",
                        value:instance.values.getTextField(id,false)
                    })
                }else if (question instanceof api.ODParagraphQuestion){
                    answers.push({
                        id,
                        name:question.exists("opendiscord:name") ? question.get("opendiscord:name")?.value : id,
                        type:"paragraph",
                        value:instance.values.getTextField(id,false)
                    })
                }
            })

            //create ticket
            await instance.defer("reply",true)
            const res = await opendiscord.actions.get("opendiscord:create-ticket").run(originalSource,{guild,user,answers,option})
            if (!res.channel || !res.ticket){
                //error
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build(source,{guild,channel,user,error:"Unable to receive ticket or channel from callback! #2",layout:"advanced"}))
                return cancel()
            }
            if (generalConfig.data.system.replyOnTicketCreation) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:ticket-created").build(originalSource,{guild,channel:res.channel,user,ticket:res.ticket}))
        })
    ])
}