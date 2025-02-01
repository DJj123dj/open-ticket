///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //STATS COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:stats",generalConfig.data.prefix,/^stats/))
    opendiscord.responders.commands.get("opendiscord:stats").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.stats
            
            //command is disabled
            if (permissionMode == "none"){
                //no permissions
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }

            //reset subcommand is owner/developer only
            if (instance.options.getSubCommand() == "reset"){
                if (!opendiscord.permissions.hasPermissions("owner",await opendiscord.permissions.getPermissions(instance.user,instance.channel,instance.guild))){
                    //no permissions
                    instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-no-permissions").build(source,{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:["owner","developer"]}))
                    return cancel()
                }else return
            }

            //permissions for normal scopes
            if (permissionMode == "everyone") return
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
        new api.ODWorker("opendiscord:stats",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "global" && scope != "ticket" && scope != "user" && scope != "reset")) return

            if (scope == "global"){
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-global").build(source,{guild,channel,user}))
            
            }else if (scope == "ticket"){
                const id = instance.options.getChannel("ticket",false)?.id ?? channel.id
                const ticket = opendiscord.tickets.get(id)
                
                if (ticket) await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-ticket").build(source,{guild,channel,user,scopeData:ticket}))
                else await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-ticket-unknown").build(source,{guild,channel,user,id}))

            }else if (scope == "user"){
                const statsUser = instance.options.getUser("user",false) ?? user
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-user").build(source,{guild,channel,user,scopeData:statsUser}))

            }else if (scope == "reset"){
                const reason = instance.options.getString("reason",false)
                opendiscord.stats.reset()
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:stats-reset").build(source,{guild,channel,user,reason}))

            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            const scope = instance.options.getSubCommand()
            let data: string
            if (scope == "ticket"){
                data = instance.options.getChannel("ticket",false)?.id ?? instance.channel.id
            }else if (scope == "user"){
                data = instance.options.getUser("user",false)?.id ?? instance.user.id
            }else data = "/"
            opendiscord.log(instance.user.displayName+" used the 'stats "+scope+"' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source},
                {key:"data",value:data},
            ])
        })
    ])
}