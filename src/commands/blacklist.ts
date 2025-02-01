///////////////////////////////////////
//BLACKLIST COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //BLACKLIST COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:blacklist",generalConfig.data.prefix,/^blacklist/))
    opendiscord.responders.commands.get("opendiscord:blacklist").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.blacklist
            
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
        new api.ODWorker("opendiscord:blacklist",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "add" && scope != "get" && scope != "remove" && scope != "view")) return

            if (scope == "view"){
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:blacklist-view").build(source,{guild,channel,user}))
            
            }else if (scope == "get"){
                const data = instance.options.getUser("user",true)
                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:blacklist-get").build(source,{guild,channel,user,data}))

            }else if (scope == "add"){
                const data = instance.options.getUser("user",true)
                const reason = instance.options.getString("reason",false)

                opendiscord.blacklist.add(new api.ODBlacklist(data.id,reason),true)
                opendiscord.log(instance.user.displayName+" added "+data.displayName+" to blacklist!","info",[
                    {key:"user",value:user.username},
                    {key:"userid",value:user.id,hidden:true},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"method",value:source},
                    {key:"reason",value:reason ?? "/"}
                ])

                //manage stats
                await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:users-blacklisted",1,"increase")
                await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:users-blacklisted",user.id,1,"increase")

                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:blacklist-add").build(source,{guild,channel,user,data,reason}))

            }else if (scope == "remove"){
                const data = instance.options.getUser("user",true)
                const reason = instance.options.getString("reason",false)

                opendiscord.blacklist.remove(data.id)
                opendiscord.log(instance.user.displayName+" removed "+data.displayName+" from blacklist!","info",[
                    {key:"user",value:user.username},
                    {key:"userid",value:user.id,hidden:true},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"method",value:source},
                    {key:"reason",value:reason ?? "/"}
                ])

                await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:blacklist-remove").build(source,{guild,channel,user,data,reason}))
            }
        }),
        new api.ODWorker("opendiscord:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild) return
            
            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "add" && scope != "remove")) return
            
            const data = instance.options.getUser("user",true)
            const reason = instance.options.getString("reason",false)

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.blacklisting.logs){
                const logChannel = opendiscord.posts.get("opendiscord:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("opendiscord:blacklist-logs").build(source,{guild,channel,user,mode:scope,data,reason}))
            }

            //to dm
            if (generalConfig.data.system.messages.blacklisting.dm) await opendiscord.client.sendUserDm(user,await opendiscord.builders.messages.getSafe("opendiscord:blacklist-dm").build(source,{guild,channel,user,mode:scope,data,reason}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            const scope = instance.options.getSubCommand()
            opendiscord.log(instance.user.displayName+" used the 'blacklist "+scope+"' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}