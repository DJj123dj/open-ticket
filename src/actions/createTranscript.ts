///////////////////////////////////////
//TRANSCRIPT CREATION SYSTEM
///////////////////////////////////////
import {opendiscord, api, utilities} from "../index"
import * as discord from "discord.js"

const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")

export const registerActions = async () => {
    opendiscord.actions.add(new api.ODAction("opendiscord:create-transcript"))
    opendiscord.actions.get("opendiscord:create-transcript").workers.add([
        new api.ODWorker("opendiscord:select-compiler",4,async (instance,params,source,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!transcriptConfig.data.general.enabled) return cancel()
            
            await opendiscord.events.get("onTranscriptCreate").emit([opendiscord.transcripts,ticket,channel,user])
            
            instance.errorReason = null
            const participants = await opendiscord.tickets.getAllTicketParticipants(params.ticket)
            if (!participants){
                instance.pendingMessage = null
                instance.errorReason = "Unable to fetch ticket channel participants!"
                throw new api.ODSystemError("ODAction(ot:create-transcript) => Unable to fetch ticket channel participants!")
            }
            instance.participants = participants

            //select transcript compiler
            if (transcriptConfig.data.general.mode == "text") instance.compiler = opendiscord.transcripts.get("opendiscord:text-compiler")
            else if (transcriptConfig.data.general.mode == "html") instance.compiler = opendiscord.transcripts.get("opendiscord:html-compiler")
        }),
        new api.ODWorker("opendiscord:init-transcript",3,async (instance,params,source,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!transcriptConfig.data.general.enabled) return cancel()
            
            //run transcript compiler init()
            await opendiscord.events.get("onTranscriptInit").emit([opendiscord.transcripts,ticket,channel,user])
            if (instance.compiler.init){
                try{
                    const result = await instance.compiler.init(ticket,channel,user)
                    if (result.success && result.pendingMessage && transcriptConfig.data.general.enableChannel){
                        //send init message to channel
                        const post = opendiscord.posts.get("opendiscord:transcripts")
                        if (post){
                            instance.pendingMessage = await post.send(result.pendingMessage)
                        }
                    }else if (!result.success){
                        instance.pendingMessage = null
                        instance.errorReason = result.errorReason
                        throw new api.ODSystemError("ODAction(ot:create-transcript) => Known Init Error => "+result.errorReason)
                    }else instance.pendingMessage = null
                }catch(err){
                    instance.success = false
                    cancel()
                    process.emit("uncaughtException",err)
                    throw new api.ODSystemError("ODAction(ot:create-transcript) => Failed transcript compiler init()! (see error above)")
                }
            }
            await opendiscord.events.get("afterTranscriptInitiated").emit([opendiscord.transcripts,ticket,channel,user])
        }),
        new api.ODWorker("opendiscord:compile-transcript",2,async (instance,params,source,cancel) => {
            const {channel,user,ticket} = params
            if (channel.type != discord.ChannelType.GuildText) return cancel()
            if (!instance.compiler){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:compile-transcript) => Instance is missing transcript compiler!")
            }

            //run transcript compiler compile()
            await opendiscord.events.get("onTranscriptCompile").emit([opendiscord.transcripts,ticket,channel,user])
            if (instance.compiler.compile){
                try{
                    const result = await instance.compiler.compile(ticket,channel,user)
                    if (!result.success){
                        instance.errorReason = result.errorReason
                        throw new api.ODSystemError("ODAction(ot:create-transcript) => Known Compiler Error => "+result.errorReason)
                    }else{
                        instance.result = result
                        instance.success = true
                    }
                }catch(err){
                    instance.success = false
                    cancel()
                    process.emit("uncaughtException",err)
                    throw new api.ODSystemError("ODAction(ot:create-transcript) => Failed transcript compiler compile()! (see error above)")
                }
            }
            await opendiscord.events.get("afterTranscriptCompiled").emit([opendiscord.transcripts,ticket,channel,user])
        }),
        new api.ODWorker("opendiscord:ready-transcript",1,async (instance,params,source,cancel) => {
            if (!instance.result){
                instance.success = false
                cancel()
                throw new api.ODSystemError("ODAction(ot:create-transcript):ODWorker(ot:ready-transcript) => Instance is missing transcript result!")
            }

            //run transcript compiler ready()
            utilities.runAsync(async () => {
                await opendiscord.events.get("onTranscriptReady").emit([opendiscord.transcripts,instance.result.ticket,instance.result.channel,instance.result.user])
                if (instance.compiler.ready){
                    try{
                        const {channelMessage,creatorDmMessage,participantDmMessage,activeAdminDmMessage,everyAdminDmMessage} = await instance.compiler.ready(instance.result)
                        
                        //send channel message
                        if (transcriptConfig.data.general.enableChannel && channelMessage){
                            if (instance.pendingMessage && instance.pendingMessage.message && instance.pendingMessage.success){
                                //edit "pending" message to be the "ready" message
                                instance.pendingMessage.message.edit(channelMessage.message)
                            }else{
                                //send ready message to channel
                                const post = opendiscord.posts.get("opendiscord:transcripts")
                                if (post) await post.send(channelMessage)
                            }
                        }

                        //send dm mesages
                        if (instance.participants){
                            for (const p of instance.participants){
                                if (p.role == "creator" && transcriptConfig.data.general.enableCreatorDM && creatorDmMessage){
                                    //send creator dm message
                                    await opendiscord.client.sendUserDm(p.user,creatorDmMessage)
                                }else if (p.role == "participant" && transcriptConfig.data.general.enableParticipantDM && participantDmMessage){
                                    //send participant dm message
                                    await opendiscord.client.sendUserDm(p.user,participantDmMessage)
                                }else if (p.role == "admin" && transcriptConfig.data.general.enableActiveAdminDM && instance.result.success && instance.result.messages && instance.result.messages.some((msg) => msg.author.id == p.user.id) && activeAdminDmMessage){
                                    //send active admin dm message
                                    await opendiscord.client.sendUserDm(p.user,activeAdminDmMessage)
                                }else if (p.role == "admin" && transcriptConfig.data.general.enableEveryAdminDM && everyAdminDmMessage){
                                    //send every admin dm message
                                    await opendiscord.client.sendUserDm(p.user,everyAdminDmMessage)
                                }
                            }
                        }
                        
                    }catch(err){
                        instance.success = false
                        cancel()
                        process.emit("uncaughtException",err)
                        throw new api.ODSystemError("ODAction(ot:create-transcript) => Failed transcript compiler ready()! (see error above)")
                    }
                }
                await opendiscord.events.get("afterTranscriptReady").emit([opendiscord.transcripts,instance.result.ticket,instance.result.channel,instance.result.user])
            })

            //update stats
            await opendiscord.stats.get("opendiscord:global").setStat("opendiscord:transcripts-created",1,"increase")
            await opendiscord.stats.get("opendiscord:user").setStat("opendiscord:transcripts-created",params.user.id,1,"increase")
            await opendiscord.events.get("afterTranscriptCreated").emit([opendiscord.transcripts,instance.result.ticket,instance.result.channel,instance.result.user])
        }),
        new api.ODWorker("opendiscord:logs",0,(instance,params,source,cancel) => {
            const {user,channel,ticket} = params
            opendiscord.log(user.displayName+" created a transcript!","info",[
                {key:"user",value:user.username},
                {key:"userid",value:user.id,hidden:true},
                {key:"channel",value:"#"+channel.name},
                {key:"channelid",value:channel.id,hidden:true},
                {key:"option",value:ticket.option.id.value},
                {key:"method",value:source,hidden:true},
                {key:"compiler",value:instance.compiler.id.value},
            ])
        })
    ])
}