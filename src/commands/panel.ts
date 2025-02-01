///////////////////////////////////////
//STATS COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //PANEL COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:panel",generalConfig.data.prefix,/^panel/))
    opendiscord.responders.commands.get("opendiscord:panel").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.panel
            
            //command is disabled
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
        new api.ODWorker("opendiscord:panel",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild || instance.channel.type == discord.ChannelType.GroupDM){
                //error
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-not-in-guild").build(source,{channel:instance.channel,user:instance.user}))
                return cancel()
            }
            
            const id = instance.options.getString("id",true)
            const panel = opendiscord.panels.get(id)

            if (!panel){
                //invalid panel
                instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:error-panel-unknown").build(source,{guild,channel,user}))
                return cancel()
            } 
            
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:panel-ready").build(source,{guild,channel,user,panel}))
            const panelMessage = await instance.channel.send((await opendiscord.builders.messages.getSafe("opendiscord:panel").build(source,{guild,channel,user,panel})).message)

            //add panel to database on auto-update
            if (instance.options.getBoolean("auto-update",false)){
                const globalDatabase = opendiscord.databases.get("opendiscord:global")
                await globalDatabase.set("opendiscord:panel-update",panelMessage.channel.id+"_"+panelMessage.id,panel.id.value)
            }
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'panel' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}