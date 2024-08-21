///////////////////////////////////////
//BLACKLIST COMMAND
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //BLACKLIST COMMAND RESPONDER
    openticket.responders.commands.add(new api.ODCommandResponder("openticket:blacklist",generalConfig.data.prefix,/^blacklist/))
    openticket.responders.commands.get("openticket:blacklist").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.blacklist
            
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
        new api.ODWorker("openticket:blacklist",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild){
                //error
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "add" && scope != "get" && scope != "remove" && scope != "view")) return

            if (scope == "view"){
                await instance.reply(await openticket.builders.messages.getSafe("openticket:blacklist-view").build(source,{guild,channel,user}))
            
            }else if (scope == "get"){
                const data = instance.options.getUser("user",true)
                await instance.reply(await openticket.builders.messages.getSafe("openticket:blacklist-get").build(source,{guild,channel,user,data}))

            }else if (scope == "add"){
                const data = instance.options.getUser("user",true)
                const reason = instance.options.getString("reason",false)

                openticket.blacklist.add(new api.ODBlacklist(data.id,reason),true)
                openticket.log(instance.user.displayName+" added "+data.displayName+" to blacklist!","info",[
                    {key:"user",value:user.username},
                    {key:"userid",value:user.id,hidden:true},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"method",value:source},
                    {key:"reason",value:reason ?? "/"}
                ])

                //manage stats
                openticket.stats.get("openticket:global").setStat("openticket:users-blacklisted",1,"increase")
                openticket.stats.get("openticket:user").setStat("openticket:users-blacklisted",user.id,1,"increase")

                await instance.reply(await openticket.builders.messages.getSafe("openticket:blacklist-add").build(source,{guild,channel,user,data,reason}))

            }else if (scope == "remove"){
                const data = instance.options.getUser("user",true)
                const reason = instance.options.getString("reason",false)

                openticket.blacklist.remove(data.id)
                openticket.log(instance.user.displayName+" removed "+data.displayName+" from blacklist!","info",[
                    {key:"user",value:user.username},
                    {key:"userid",value:user.id,hidden:true},
                    {key:"channelid",value:channel.id,hidden:true},
                    {key:"method",value:source},
                    {key:"reason",value:reason ?? "/"}
                ])

                await instance.reply(await openticket.builders.messages.getSafe("openticket:blacklist-remove").build(source,{guild,channel,user,data,reason}))
            }
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild) return
            
            const scope = instance.options.getSubCommand()
            if (!scope || (scope != "add" && scope != "remove")) return
            
            const data = instance.options.getUser("user",true)
            const reason = instance.options.getString("reason",false)

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.blacklisting.logs){
                const logChannel = openticket.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await openticket.builders.messages.getSafe("openticket:blacklist-logs").build(source,{guild,channel,user,mode:scope,data,reason}))
            }

            //to dm
            if (generalConfig.data.system.messages.blacklisting.dm) await openticket.client.sendUserDm(user,await openticket.builders.messages.getSafe("openticket:blacklist-dm").build(source,{guild,channel,user,mode:scope,data,reason}))
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            const scope = instance.options.getSubCommand()
            openticket.log(instance.user.displayName+" used the 'blacklist "+scope+"' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}