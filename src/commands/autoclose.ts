///////////////////////////////////////
//AUTOCLOSE COMMAND
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //AUTOCLOSE COMMAND RESPONDER
    openticket.responders.commands.add(new api.ODCommandResponder("openticket:autoclose",generalConfig.data.prefix,/^autoclose/))
    openticket.responders.commands.get("openticket:autoclose").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.autoclose
            
            if (permissionMode == "none"){
                //no permissions
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                if (!openticket.permissions.hasPermissions("support",await openticket.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["support"]}))
                    return cancel()
                }else return
            }else{
                if (!instance.guild || !instance.member){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #1",layout:"advanced"}))
                    return cancel()
                }
                const role = await openticket.client.fetchGuildRole(instance.guild,permissionMode)
                if (!role){
                    //error
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,error:"Permission Error: Not in Server #2",layout:"advanced"}))
                    return cancel()
                }
                if (!role.members.has(instance.member.id)){
                    //no permissions
                    instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                    return cancel()
                }else return
            }
        }),
        new api.ODWorker("openticket:autoclose",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            const ticket = openticket.tickets.get(channel.id)
            if (!ticket || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-unknown").build("button",{guild,channel,user}))
                return
            }
            //return when already closed
            if (ticket.get("openticket:closed").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error").build("button",{guild,channel,user,error:openticket.languages.getTranslation("errors.actionInvalid.close"),layout:"simple"}))
                return cancel()
            }
            //return when busy
            if (ticket.get("openticket:busy").value){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-ticket-busy").build("button",{guild,channel,user}))
                return cancel()
            }

            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "disable" && scope != "enable")) return

            if (scope == "disable"){
                const reason = instance.options.getString("reason",false)
                ticket.get("openticket:autoclose-enabled").value = false
                ticket.get("openticket:autoclose-hours").value = 0
                await instance.reply(await openticket.builders.messages.getSafe("openticket:autoclose-disable").build(source,{guild,channel,user,ticket,reason}))
            
            }else if (scope == "enable"){
                const time = instance.options.getNumber("time",true)
                const reason = instance.options.getString("reason",false)
                ticket.get("openticket:autoclose-enabled").value = true
                ticket.get("openticket:autoclose-hours").value = time
                await instance.reply(await openticket.builders.messages.getSafe("openticket:autoclose-enable").build(source,{guild,channel,user,ticket,reason,time}))
            }
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            const scope = instance.options.getSubCommand()
            const reason = instance.options.getString("reason",false)
            openticket.log(instance.user.displayName+" used the 'autoclose "+scope+"' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source},
                {key:"reason",value:reason ?? "/"},
            ])
        })
    ])
}