///////////////////////////////////////
//ADD COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //ADD COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:add",generalConfig.data.prefix,"add"))
    opendiscord.responders.commands.get("opendiscord:add").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.add

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
        new api.ODWorker("opendiscord:add",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return cancel()
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const data = instance.options.getUser("user",true)
            const reason = instance.options.getString("reason",false)

            //return when user already added to ticket
            const participants = await opendiscord.tickets.getAllTicketParticipants(ticket)
            if (!participants || participants.find((p) => p.user.id == data.id)){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error").build("button",{guild,channel,user,error:opendiscord.languages.getTranslation("errors.actionInvalid.add"),layout:"simple"}))
                return cancel()
            }

            //start adding user to ticket
            await instance.defer(false)
            await opendiscord.actions.get("opendiscord:add-ticket-user").run(source,{guild,channel,user,ticket,reason,sendMessage:false,data})
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:add-message").build(source,{guild,channel,user,ticket,reason,data}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'add' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}