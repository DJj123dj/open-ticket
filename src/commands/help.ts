///////////////////////////////////////
//HELP COMMAND
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("opendiscord:general")

export const registerCommandResponders = async () => {
    //HELP COMMAND RESPONDER
    opendiscord.responders.commands.add(new api.ODCommandResponder("opendiscord:help",generalConfig.data.prefix,"help"))
    opendiscord.responders.commands.get("opendiscord:help").workers.add([
        new api.ODWorker("opendiscord:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.help

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
        new api.ODWorker("opendiscord:help",0,async (instance,params,source,cancel) => {
            const preferSlashOverText = generalConfig.data.system.preferSlashOverText
            
            let mode: "slash"|"text"
            if (generalConfig.data.slashCommands && generalConfig.data.textCommands){
                mode = (preferSlashOverText) ? "slash" : "text"

            }else if (!generalConfig.data.slashCommands) mode = "text"
            else mode = "slash"
            
            await instance.reply(await opendiscord.builders.messages.getSafe("opendiscord:help-menu").build(source,{mode,page:0}))
        }),
        new api.ODWorker("opendiscord:logs",-1,(instance,params,source,cancel) => {
            opendiscord.log(instance.user.displayName+" used the 'help' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //HELP MENU SWITCH BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:help-menu-switch",/^od:help-menu-switch_(slash|text)/))
    opendiscord.responders.buttons.get("opendiscord:help-menu-switch").workers.add(
        new api.ODWorker("opendiscord:update-help-menu",0,async (instance,params,source,cancel) => {
            const mode = instance.interaction.customId.split("_")[1] as "slash"|"text"
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0

            const newMode = (mode == "slash") ? "text" : "slash"

            const msg = await opendiscord.builders.messages.getSafe("opendiscord:help-menu").build("button",{mode:newMode,page:currentPage})
            await instance.update(msg)
        })
    )

    //HELP MENU PREVIOUS BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:help-menu-previous",/^od:help-menu-previous/))
    opendiscord.responders.buttons.get("opendiscord:help-menu-previous").workers.add(
        new api.ODWorker("opendiscord:update-help-menu",0,async (instance,params,source,cancel) => {
            const switchButton = instance.getMessageComponent("button",/^od:help-menu-switch_(slash|text)/)
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0
            const currentMode = (switchButton && switchButton.customId) ? switchButton.customId.split("_")[1] as "text"|"slash" : "slash"

            const msg = await opendiscord.builders.messages.getSafe("opendiscord:help-menu").build("button",{mode:currentMode,page:currentPage-1})
            await instance.update(msg)
        })
    )

    //HELP MENU NEXT BUTTON RESPONDER
    opendiscord.responders.buttons.add(new api.ODButtonResponder("opendiscord:help-menu-next",/^od:help-menu-next/))
    opendiscord.responders.buttons.get("opendiscord:help-menu-next").workers.add(
        new api.ODWorker("opendiscord:update-help-menu",0,async (instance,params,source,cancel) => {
            const switchButton = instance.getMessageComponent("button",/^od:help-menu-switch_(slash|text)/)
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0
            const currentMode = (switchButton && switchButton.customId) ? switchButton.customId.split("_")[1] as "text"|"slash" : "slash"

            const msg = await opendiscord.builders.messages.getSafe("opendiscord:help-menu").build("button",{mode:currentMode,page:currentPage+1})
            await instance.update(msg)
        })
    )
}