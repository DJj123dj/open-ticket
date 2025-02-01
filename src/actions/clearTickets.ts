///////////////////////////////////////
//CLEAR TICKETS SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const generalConfig = opendiscord.configs.get("openticket:general")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("openticket:clear-tickets"))
    opendiscord.actions.get("openticket:clear-tickets").workers.add([
        new api.ODWorker("openticket:clear-tickets",2,async (instance,params,source,cancel) => {
            const {guild,channel,user,filter,list} = params
            
            await opendiscord.events.get("onTicketsClear").emit([list,user,channel,filter])
            const nameList: string[] = []
            for (const ticket of list){
                const ticketChannel = await opendiscord.tickets.getTicketChannel(ticket)
                if (!ticketChannel) return
                nameList.push("#"+ticketChannel.name)
                await opendiscord.actions.get("openticket:delete-ticket").run("clear",{guild,channel:ticketChannel,user,ticket,reason:"Cleared Ticket",sendMessage:true,withoutTranscript:false})
            }
            instance.list = nameList
            await opendiscord.events.get("afterTicketsCleared").emit([list,user,channel,filter])
        }),
        new api.ODWorker("openticket:discord-logs",1,async (instance,params,source,cancel) => {
            const {guild,channel,user,filter,list} = params

            //to logs
            if (generalConfig.data.system.logs.enabled && generalConfig.data.system.messages.deleting.logs){
                const logChannel = opendiscord.posts.get("openticket:logs")
                if (logChannel) logChannel.send(await opendiscord.builders.messages.getSafe("openticket:clear-logs").build(source,{guild,channel,user,filter,list:instance.list ?? []}))
            }
        }),
        new api.ODWorker("openticket:logs",0,(instance,params,source,cancel) => {
            const {guild,user,filter,list} = params
            opendiscord.log(user.displayName+" cleared "+list.length+" tickets!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"method",value:source},
                {key:"filter",value:filter}
            ])
        })
    ])
}