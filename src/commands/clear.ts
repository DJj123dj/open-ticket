///////////////////////////////////////
//CLEAR COMMAND
///////////////////////////////////////
import {openticket, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = openticket.configs.get("openticket:general")

export const registerCommandResponders = async () => {
    //CLEAR COMMAND RESPONDER
    openticket.responders.commands.add(new api.ODCommandResponder("openticket:clear",generalConfig.data.prefix,"clear"))
    openticket.responders.commands.get("openticket:clear").workers.add([
        new api.ODWorker("openticket:permissions",1,async (instance,params,source,cancel) => {
            const permissionMode = generalConfig.data.system.permissions.clear

            if (permissionMode == "none"){
                //no permissions
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-no-permissions").build("button",{guild:instance.guild,channel:instance.channel,user:instance.user,permissions:[]}))
                return cancel()
            }else if (permissionMode == "everyone") return
            else if (permissionMode == "admin"){
                //only allow global admins (ticket admins aren't allowed to clear tickets)
                if (!openticket.permissions.hasPermissions("support",await openticket.permissions.getPermissions(instance.user,instance.channel,instance.guild,{allowChannelUserScope:false,allowChannelRoleScope:false}))){
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
        new api.ODWorker("openticket:clear",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild || channel.isDMBased()){
                instance.reply(await openticket.builders.messages.getSafe("openticket:error-not-in-guild").build("button",{channel,user}))
                return cancel()
            }
            
            const tempFilter = instance.options.getString("filter",false)
            const filter = (tempFilter) ? tempFilter.toLowerCase() as api.ODTicketClearFilter : "all"
            const list: string[] = []
            const ticketList = openticket.tickets.getAll().filter((ticket) => {
                if (filter == "all") return true
                else if (filter == "open" && ticket.get("openticket:open").value) return true
                else if (filter == "closed" && ticket.get("openticket:closed").value) return true
                else if (filter == "claimed" && ticket.get("openticket:claimed").value) return true
                else if (filter == "pinned" && ticket.get("openticket:pinned").value) return true
                else if (filter == "unclaimed" && !ticket.get("openticket:claimed").value) return true
                else if (filter == "unpinned" && !ticket.get("openticket:pinned").value) return true
                else if (filter == "autoclosed" && ticket.get("openticket:closed").value) return true
                else return false
            })
            for (const ticket of ticketList){
                const ticketChannel = await openticket.tickets.getTicketChannel(ticket)
                if (ticketChannel) list.push("#"+ticketChannel.name)
            }

            //reply with clear verify
            await instance.defer(true)
            await instance.reply(await openticket.builders.messages.getSafe("openticket:clear-verify-message").build(source,{guild,channel,user,filter,list}))
        }),
        new api.ODWorker("openticket:logs",-1,(instance,params,source,cancel) => {
            openticket.log(instance.user.displayName+" used the 'clear' command!","info",[
                {key:"user",value:instance.user.username},
                {key:"userid",value:instance.user.id,hidden:true},
                {key:"channelid",value:instance.channel.id,hidden:true},
                {key:"method",value:source}
            ])
        })
    ])
}

export const registerButtonResponders = async () => {
    //CLEAR CONTINUE BUTTON RESPONDER
    openticket.responders.buttons.add(new api.ODButtonResponder("openticket:clear-continue",/^od:clear-continue_/))
    openticket.responders.buttons.get("openticket:clear-continue").workers.add(
        new api.ODWorker("openticket:clear-continue",0,async (instance,params,source,cancel) => {
            const {guild,channel,user} = instance
            if (!guild || channel.isDMBased()) return
            const originalSource = instance.interaction.customId.split("_")[1]
            if (originalSource != "slash" && originalSource != "text" && originalSource != "other") return
            const filter = instance.interaction.customId.split("_")[2] as api.ODTicketClearFilter
            
            //start ticket clear
            instance.defer("update",true)
            const list: string[] = []
            const ticketList = openticket.tickets.getAll().filter((ticket) => {
                if (filter == "all") return true
                else if (filter == "open" && ticket.get("openticket:open").value) return true
                else if (filter == "closed" && ticket.get("openticket:closed").value) return true
                else if (filter == "claimed" && ticket.get("openticket:claimed").value) return true
                else if (filter == "pinned" && ticket.get("openticket:pinned").value) return true
                else if (filter == "unclaimed" && !ticket.get("openticket:claimed").value) return true
                else if (filter == "unpinned" && !ticket.get("openticket:pinned").value) return true
                else if (filter == "autoclosed" && ticket.get("openticket:closed").value) return true
                else return false
            })
            for (const ticket of ticketList){
                const ticketChannel = await openticket.tickets.getTicketChannel(ticket)
                if (ticketChannel) list.push("#"+ticketChannel.name)
            }

            await openticket.actions.get("openticket:clear-tickets").run(originalSource,{guild,channel,user,filter,list:ticketList})
            await instance.update(await openticket.builders.messages.getSafe("openticket:clear-message").build(originalSource,{guild,channel,user,filter,list}))
        })
    )
}