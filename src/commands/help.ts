///////////////////////////////////////
//HELP COMMAND
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //HELP COMMAND RESPONDER
    openticket.responders.commands.add(new api.ODCommandResponder("openticket:help",generalConfig.data.prefix,"help"))
    openticket.responders.commands.get("openticket:help").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.help

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
        new api.ODWorker("openticket:help",0,async (instance,params,source,cancel) => {
            const preferSlashOverText = generalConfig.data.system.preferSlashOverText
            
            let mode: "slash"|"text"
            if (generalConfig.data.slashCommands && generalConfig.data.textCommands){
                mode = (preferSlashOverText) ? "slash" : "text"

            }else if (!generalConfig.data.slashCommands) mode = "text"
            else mode = "slash"
            
            await instance.reply(await openticket.builders.messages.getSafe("openticket:help-menu").build(source,{mode,page:0}))
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            openticket.log(instance.user.displayName+" used the 'help' command!","info",[
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
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:help-menu-switch",/^od:help-menu-switch_(slash|text)/))
    openticket.responders.buttons.get("openticket:help-menu-switch").workers.add(
        new api.ODWorker("openticket:update-help-menu",0,async (instance,params,source,cancel) => {
            const mode = instance.interaction.customId.split("_")[1] as "slash"|"text"
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0

            const newMode = (mode == "slash") ? "text" : "slash"

            const msg = await openticket.builders.messages.getSafe("openticket:help-menu").build("button",{mode:newMode,page:currentPage})
            await instance.update(msg)
        })
    )

    //HELP MENU PREVIOUS BUTTON RESPONDER
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:help-menu-previous",/^od:help-menu-previous/))
    openticket.responders.buttons.get("openticket:help-menu-previous").workers.add(
        new api.ODWorker("openticket:update-help-menu",0,async (instance,params,source,cancel) => {
            const switchButton = instance.getMessageComponent("button",/^od:help-menu-switch_(slash|text)/)
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0
            const currentMode = (switchButton && switchButton.customId) ? switchButton.customId.split("_")[1] as "text"|"slash" : "slash"

            const msg = await openticket.builders.messages.getSafe("openticket:help-menu").build("button",{mode:currentMode,page:currentPage-1})
            await instance.update(msg)
        })
    )

    //HELP MENU NEXT BUTTON RESPONDER
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:help-menu-next",/^od:help-menu-next/))
    openticket.responders.buttons.get("openticket:help-menu-next").workers.add(
        new api.ODWorker("openticket:update-help-menu",0,async (instance,params,source,cancel) => {
            const switchButton = instance.getMessageComponent("button",/^od:help-menu-switch_(slash|text)/)
            const pageButton = instance.getMessageComponent("button",/^od:help-menu-page_([0-9]+)/)
            const currentPage = (pageButton && pageButton.customId) ? Number(pageButton.customId.split("_")[1]) : 0
            const currentMode = (switchButton && switchButton.customId) ? switchButton.customId.split("_")[1] as "text"|"slash" : "slash"

            const msg = await openticket.builders.messages.getSafe("openticket:help-menu").build("button",{mode:currentMode,page:currentPage+1})
            await instance.update(msg)
        })
    )
}