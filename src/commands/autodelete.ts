///////////////////////////////////////
//AUTODELETE COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //AUTODELETE COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:autodelete",generalConfig.data.prefix,/^autodelete/))
    opendiscord.responders.commands.get("opendiscord:autodelete").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.autodelete
            
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
        new api.ODWorker("opendiscord:autodelete",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            const ticket = opendiscord.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }
            //return when busy
            if (ticket.get("opendiscord:busy").value){
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "disable" && scope != "enable")) return

            if (scope == "disable"){
                const reason = instance.options.getString("reason",false)
                ticket.get("opendiscord:autodelete-enabled").value = false
                ticket.get("opendiscord:autodelete-days").value = 0
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:autodelete-disable").build(source,{guild,channel,user,ticket,reason}))
            
            }else if (scope == "enable"){
                const time = instance.options.getNumber("time",true)
                const reason = instance.options.getString("reason",false)
                ticket.get("opendiscord:autodelete-enabled").value = true
                ticket.get("opendiscord:autodelete-days").value = time
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:autodelete-enable").build(source,{guild,channel,user,ticket,reason,time}))
            }

            //update ticket message
            const ticketMessage = await opendiscord.tickets.getTicketMessage(ticket)
            if (ticketMessage){
                try{
                    ticketMessage.edit((await opendiscord.builders.messages.getSafe("opendiscord:ticket-message").build("other",{guild,channel,user,ticket})).message)
                }catch(e){
                    opendiscord.log("Unable to edit ticket message on autodelete "+scope+"!","error",[
                        {key:"channel",value:"#"+channel.name},
                        {key:"channelid",value:channel.id,hidden:true},
                        {key:"messageid",value:ticketMessage.id},
                        {key:"option",value:ticket.option.id.value}
                    ])
                    opendiscord.debugfile.writeErrorMessage(new api.ODError(e,"uncaughtException"))
                }
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            const scope = instance.options.getSubCommand()
            const reason = instance.options.getString("reason",false)
            opendiscord.log(instance.user.displayName+" used the 'autodelete "+scope+"' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source},
                {key:"reason",value:reason ?? "/"},
            ])
        })
    ])
}