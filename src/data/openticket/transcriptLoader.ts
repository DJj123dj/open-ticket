import {opendiscord, api, utilities} from "../../index.js"
import * as discord from "discord.js"

const collector = opendiscord.transcripts.collector
const messages = opendiscord.builders.messages
const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")
const textConfig = transcriptConfig.data.textTranscriptStyle
const htmlVersion = Buffer.from("eW91LXNob3VsZG50LWJlLWxvb2tpbmctYXQtdGhpcy0tLWZvci1tb3JlLWluZm8tY29tbWEtc2VuZC1hLW1lc3NhZ2UtdG8tZGpqMTIzZGo=","base64").toString("utf8")
const htmlDomain = atob("dC5kai1kai5iZQ==")
const lang = opendiscord.languages

export const replaceHtmlTranscriptMentions = async (text:string) => {
    const mainServer = opendiscord.client.mainServer
    if (!mainServer) throw new api.ODSystemError("Unknown mainServer! => Required for mention replacement in Html Transcripts!")

    const usertext = await utilities.asyncReplace(text,/<@([0-9]+)>/g,async (match,id) => {
        const member = await opendiscord.client.fetchGuildMember(mainServer,id)
        return (member ? "<@"+(member.user.displayName).replace(/\s/g,"&nbsp;")+"> " : id) //replace with html spaces => BUG: whitespace CSS isn't "pre-wrap"
    })

    const channeltext = await utilities.asyncReplace(usertext,/<#([0-9]+)>/g,async (match,id) => {
        const channel = await opendiscord.client.fetchGuildChannel(mainServer,id)
        return (channel ? "<#"+channel.name.replace(/\s/g,"&nbsp;")+"> " : id) //replace with html spaces => BUG: whitespace CSS isn't "pre-wrap"
    })

    const roletext = await utilities.asyncReplace(channeltext,/<@&([0-9]+)>/g,async (match,id) => {
        const role = await opendiscord.client.fetchGuildRole(mainServer,id)
        let text = role ? role.name.replace(/\s/g,"&nbsp;") : id
        let color = role ? ((role.hexColor == "#000000") ? "regular" : role.hexColor) : "regular" //when hex color is #000000 => render as default
        return "<@&"+text+"::"+color+"> "
    })

    const defaultroletext = await utilities.asyncReplace(roletext,/@(everyone|here)/g,async (match,id) => {
        return "<@&"+id+"::regular> "
    })
    return defaultroletext
}

/**
 * This function is used to authenticate with the HTML Transcript API.
 * It is NOT the token of the bot but an internal AUTH TOKEN from the API.
 * 
 * Questions? Visit our discord server: https://discord.dj-dj.be
 */
function transcriptAuth(_A:{salt:number,secret:string}){
    const _B = Buffer.from(_A.secret,"hex");const _C = Math["floor"](new Date().getTime()/(30*1000)).toString();const _D = Buffer.from(_C);const _E = Buffer.alloc(_D["length"]);_D.forEach((v,i) => {_E[i] = v ^ _B[i % _B["length"]];});return btoa(JSON.stringify({salt:_A.salt,secret:_A.secret,token:_E.toString("hex")}))
}

export async function loadAllTranscriptCompilers(){
    class ODHTTPHtmlPostRequest extends api.ODHTTPPostRequest {
        constructor(transcriptAuth:string,htmlFinal:api.ODTranscriptHtmlV2Data){
            super(opendiscord,"https://"+htmlDomain+"/api/v2/upload?auth="+htmlVersion+"&token="+transcriptAuth,true,{
                body:JSON.stringify(htmlFinal),
                headers:{
                    "Content-Type":"application/json"
                }
            })
        }
    }

    //TEXT COMPILER
    opendiscord.transcripts.add(new api.ODTranscriptCompiler<{contents:string},null>("opendiscord:text-compiler",undefined,async (ticket,channel,user) => {
        //COMPILE
        const rawMessages = await collector.collectAllMessages(ticket)
        if (!rawMessages) return {ticket,channel,user,success:false,errorReason:"Unable to collect messages! Channel not found!",messages:null,data:null}
        const messages = await collector.convertMessagesToTranscriptData(rawMessages)

        const finalMessages: string[] = []
        finalMessages.push("=============== "+lang.getTranslation("transcripts.text.messagesTitle")+" ===============")

        messages.filter((msg) => textConfig.includeBotMessages || !msg.author.tag).forEach((msg) => {
            const timestamp = utilities.dateString(new Date(msg.timestamp))
            const edited = (msg.edited ? " (edited)" : "")
            const authorId = (textConfig.includeIds ? " ("+msg.author.id+")" : "")
            const msgId = (textConfig.includeIds ? " ("+msg.id+")" : "")

            if (textConfig.layout == "simple"){
                //SIMPLE LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                const embeds = (textConfig.includeEmbeds) ? "\n"+lang.getTranslation("params.uppercase.embeds")+": "+msg.embeds.length : ""
                const files = (textConfig.includeFiles) ? "\n"+lang.getTranslation("params.uppercase.files")+": "+msg.files.length : ""
                const content = (msg.content) ? msg.content : (lang.getTranslation("transcripts.text.emptyContent")+embeds+files)
                finalMessages.push(header+"\n   "+content.split("\n").join("\n    "))
                
            }else if (textConfig.layout == "normal"){
                //NORMAL LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                const embeds = (textConfig.includeEmbeds && msg.embeds.length > 0) ? "\n"+msg.embeds.map((embed) => {
                    return "==== ("+lang.getTranslation("transcripts.text.embedTitle")+") "+(embed.title ?? lang.getTranslation("transcripts.text.noTitle"))+" ====\n"+(embed.description ?? lang.getTranslation("transcripts.text.noDesc"))
                }) : ""
                const files = (textConfig.includeFiles && msg.files.length > 0) ? "\n"+msg.files.map((file) => {
                    return "==== ("+lang.getTranslation("transcripts.text.fileTitle")+") "+(file.name)+" ====\n"+lang.getTranslation("params.uppercase.size")+": "+(file.size+" "+file.unit)+"\nUrl: "+file.url
                }) : ""
                const content = (msg.content) ? msg.content : ""
                finalMessages.push(header+"\n   "+(content+embeds+files).split("\n").join("\n    "))

            }else if (textConfig.layout == "detailed"){
                //ADVANCED LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                const embeds = (textConfig.includeEmbeds && msg.embeds.length > 0) ? "\n"+msg.embeds.map((embed) => {
                    return "\n==== ("+lang.getTranslation("transcripts.text.embedTitle")+") "+(embed.title ?? lang.getTranslation("transcripts.text.noTitle"))+" ====\n"+(embed.description ?? lang.getTranslation("transcripts.text.noDesc"))+(embed.fields.length > 0 ? "\n\n== ("+lang.getTranslation("transcripts.text.fieldsTitle")+") ==\n"+embed.fields.map((field) => field.name+": "+field.value).join("\n") : "")
                }) : ""
                const files = (textConfig.includeFiles && msg.files.length > 0) ? "\n"+msg.files.map((file) => {
                    return "\n==== ("+lang.getTranslation("transcripts.text.fileTitle")+") "+(file.name)+" ====\n"+lang.getTranslation("params.uppercase.size")+": "+(file.size+" "+file.unit)+"\nUrl: "+file.url+"\nAlt: "+(file.alt ?? "/")
                }) : ""
                const reactions = (msg.reactions.filter((r) => !r.custom).length > 0) ? "\n==== ("+lang.getTranslation("transcripts.text.reactionsTitle")+") ====\n"+msg.reactions.filter((r) => !r.custom).map((r) => r.amount+" "+r.emoji).join(" - ") : ""
                const content = (msg.content) ? msg.content : ""
                finalMessages.push(header+"\n   "+(content+embeds+files+reactions).split("\n").join("\n    "))
            }
        })

        const finalStats: string[] = []

        const creationDate = ticket.get("opendiscord:opened-on").value
        const closeDate = ticket.get("opendiscord:closed-on").value
        const claimDate = ticket.get("opendiscord:claimed-on").value
        const pinDate = ticket.get("opendiscord:pinned-on").value
        const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
        const closer = await opendiscord.tickets.getTicketUser(ticket,"closer")
        const claimer = await opendiscord.tickets.getTicketUser(ticket,"claimer")
        const pinner = await opendiscord.tickets.getTicketUser(ticket,"pinner")

        if (textConfig.includeStats){
            finalStats.push("=============== "+lang.getTranslation("transcripts.text.statsTitle")+" ===============")
            if (textConfig.layout == "simple"){
                //SIMPLE LAYOUT
                if (creationDate) finalStats.push(lang.getTranslation("stats.properties.createdOn")+": "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push(lang.getTranslation("stats.properties.createdBy")+": "+creator.displayName)
                finalStats.push("\n")
                
            }else if (textConfig.layout == "normal"){
                //NORMAL LAYOUT
                if (creationDate) finalStats.push(lang.getTranslation("stats.properties.createdOn")+": "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push(lang.getTranslation("stats.properties.createdBy")+": "+creator.displayName)
                if (closer || claimer || pinner) finalStats.push("")
                if (closer) finalStats.push(lang.getTranslation("stats.properties.closedBy")+": "+closer.displayName)
                if (claimer) finalStats.push(lang.getTranslation("stats.properties.claimedBy")+": "+claimer.displayName)
                if (pinner) finalStats.push(lang.getTranslation("stats.properties.pinnedBy")+": "+pinner.displayName)
                finalStats.push(lang.getTranslation("stats.properties.deletedBy")+": "+user.displayName)
                finalStats.push("\n")

            }else if (textConfig.layout == "detailed"){
                //ADVANCED LAYOUT
                if (creationDate) finalStats.push(lang.getTranslation("stats.properties.createdOn")+": "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push(lang.getTranslation("stats.properties.createdBy")+": "+creator.displayName)
                if (closer || closeDate) finalStats.push("")
                if (closeDate) finalStats.push(lang.getTranslation("stats.properties.closedOn")+": "+utilities.dateString(new Date(closeDate)))
                if (closer) finalStats.push(lang.getTranslation("stats.properties.closedBy")+": "+closer.displayName)
                if (claimer || claimDate) finalStats.push("")
                if (claimDate) finalStats.push(lang.getTranslation("stats.properties.claimedOn")+": "+utilities.dateString(new Date(claimDate)))
                if (claimer) finalStats.push(lang.getTranslation("stats.properties.claimedBy")+": "+claimer.displayName)
                if (pinner || pinDate) finalStats.push("")
                if (pinDate) finalStats.push(lang.getTranslation("stats.properties.pinnedOn")+": "+utilities.dateString(new Date(pinDate)))
                if (pinner) finalStats.push(lang.getTranslation("stats.properties.pinnedBy")+": "+pinner.displayName)
                if (closer || claimer || pinner) finalStats.push("")
                finalStats.push(lang.getTranslation("stats.properties.deletedOn")+": "+utilities.dateString(new Date()))
                finalStats.push(lang.getTranslation("stats.properties.deletedBy")+": "+user.displayName)
                finalStats.push("\n")
            }
        }

        const final: string[] = []
        final.push(...finalStats)
        final.push(finalMessages.join("\n\n"))

        return {ticket,channel,user,success:true,errorReason:null,messages,data:{contents:final.join("\n")}}
    },async (result) => {
        //READY
        return {
            channelMessage:await messages.getSafe("opendiscord:transcript-text-ready").build("channel",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:text-compiler")}),
            creatorDmMessage:await messages.getSafe("opendiscord:transcript-text-ready").build("creator-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:text-compiler")}),
            participantDmMessage:await messages.getSafe("opendiscord:transcript-text-ready").build("participant-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:text-compiler")}),
            activeAdminDmMessage:await messages.getSafe("opendiscord:transcript-text-ready").build("active-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:text-compiler")}),
            everyAdminDmMessage:await messages.getSafe("opendiscord:transcript-text-ready").build("every-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:text-compiler")})
        }
    }))

    //HTML COMPILER
    opendiscord.transcripts.add(new api.ODTranscriptCompiler<{url:string,availableUntil:Date},{auth:string}|null>("opendiscord:html-compiler",async (ticket,channel,user) => {
        //INIT
        const req = new api.ODHTTPGetRequest(opendiscord,atob("aHR0cHM6Ly90LmRqLWRqLmJlL2FwaS92Mi9pbml0"),false)
        const res = await req.run()
        //PENDING MESSAGE (not required anymore) => await messages.getSafe("opendiscord:transcript-html-progress").build("channel",{guild:channel.guild,channel,user,ticket,compiler:opendiscord.transcripts.get("opendiscord:html-compiler"),remaining:16000})
        if (res.status == 200 && res.body){
            const data: {salt:number,secret:string} = JSON.parse(atob(res.body))
            return {success:true,errorReason:null,pendingMessage:null,initData:{auth:transcriptAuth(data)}}
        }
        else{
            if (res.status == 503){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_503 error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"The HTML Transcripts are currently unreachable. Please try again later.",pendingMessage:null,initData:null}

            }else if (res.status == 429){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_429 error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"The HTML Transcripts are currently unreachable because the bot is ratelimited. Please try again in a few minutes.",pendingMessage:null,initData:null}

            }else if (res.status == 403){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_403 error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"The HTML Transcripts are unreachable because the bot has been banned from using the API. If you don't know why, please contact us at https://discord.dj-dj.be",pendingMessage:null,initData:null}
                
            }else if (res.status == 500){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_500 error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"Something went wrong while compiling the HTML Transcripts, please report this error at https://discord.dj-dj.be",pendingMessage:null,initData:null}
                
            }else if (res.status == 413){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_413 error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"Unable to upload transcript, file size is too large (Max 5MB)!",pendingMessage:null,initData:null}
                
            }else{
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON_UNKNOWN error! (check otdebug.txt for details)"))
                return {success:false,errorReason:"Something went wrong while compiling the HTML Transcripts, please report this error at https://discord.dj-dj.be",pendingMessage:null,initData:null}
            }
        }
        
    },async (ticket,channel,user,initData) => {
        //COMPILE
        if (!initData) return {ticket,channel,user,success:false,errorReason:"Could not authenticate with HTML Transcript API.",messages:null,data:null}
        const rawMessages = await collector.collectAllMessages(ticket)
        if (!rawMessages) return {ticket,channel,user,success:false,errorReason:"Unable to collect messages! Channel not found!",messages:null,data:null}
        const messages = await collector.convertMessagesToTranscriptData(rawMessages)

        const htmlMessages: api.ODTranscriptHtmlV2Data["messages"] = []
        for (const msg of messages){
            const components: api.ODTranscriptHtmlV2Data["messages"][0]["components"] = []
            msg.components.forEach((component) => {
                if (component.components[0].type == "dropdown"){
                    //row contains dropdown
                    components.push({
                        type:"dropdown",
                        placeholder:component.components[0].placeholder ?? "Nothing Selected",
                        options:component.components[0].options.map((opt) => {
                            return {
                                id:opt.id,
                                label:opt.label ?? false,
                                description:opt.description ?? false,
                                icon:(opt.emoji && !opt.emoji.custom) ? opt.emoji.emoji : false
                            }
                        }),
                        
                    })
                }else if (component.components[0].type == "button"){
                    //row contains buttons
                    components.push({
                        type:"buttons",
                        buttons:component.components.map((button) => {
                            button = button as api.ODTranscriptButtonComponentData
                            return {
                                disabled:button.disabled,
                                type:(button.mode == "button") ? "interaction" : "url",
                                color:button.color,
                                id:button.id ?? false,
                                label:button.label ?? false,
                                icon:(button.emoji) ? button.emoji.emoji : false,
                                url:button.url ?? false
                            }
                        }),
                        
                    })
                }
            })
            components.push({
                type:"reactions",
                reactions:msg.reactions.map((reaction) => {
                    return {
                        amount:reaction.amount,
                        emoji:reaction.emoji,
                        type:(reaction.custom && reaction.animated) ? "gif" : (reaction.custom ? "image" : "svg")
                            
                    }
                })
            })

            const embeds: api.ODTranscriptHtmlV2Data["messages"][0]["embeds"] = []
            for (const embed of msg.embeds){
                embeds.push({
                    title:embed.title ? await replaceHtmlTranscriptMentions(embed.title) : false,
                    color:embed.color,
                    description:embed.description ? await replaceHtmlTranscriptMentions(embed.description) : false,
                    image:embed.image ?? false,
                    thumbnail:embed.thumbnail ?? false,
                    url:embed.url ?? false,
                    authorimg:embed.authorimg ?? false,
                    authortext:embed.authortext ?? false,
                    footerimg:embed.footerimg ?? false,
                    footertext:embed.footertext ?? false,
                    fields:embed.fields
                })
            }

            htmlMessages.push({
                author:{
                    id:msg.author.id,
                    name:msg.author.displayname,
                    pfp:msg.author.pfp,
                    bot:msg.author.tag == "app",
                    system:msg.author.tag == "system",
                    verifiedBot:msg.author.tag == "verified",
                    color:msg.author.color
                },
                edited:msg.edited,
                timestamp:msg.timestamp,
                important:msg.type == "important",
                type:"normal",
                content:msg.content ? await replaceHtmlTranscriptMentions(msg.content) : false,
                embeds,
                attachments:msg.files.map((file) => {
                    return {
                        type:"FILE",
                        fileType:file.type,
                        name:file.name,
                        size:file.size+" "+file.unit,
                        url:file.url
                    }
                }),
                components,
                reply:{
                    type:(msg.reply) ? (msg.reply.type == "interaction" ? "command" : "reply") : false,
                    user:(msg.reply) ? {
                        id:msg.reply.user.id,
                        name:msg.reply.user.displayname,
                        pfp:msg.reply.user.pfp,
                        bot:msg.reply.user.tag == "app",
                        system:msg.reply.user.tag == "system",
                        verifiedBot:msg.reply.user.tag == "verified",
                        color:msg.reply.user.color
                    } : undefined,
                    replyOptions:(msg.reply && msg.reply.type == "message") ? {
                        guildId:msg.reply.guild,
                        channelId:msg.reply.channel,
                        messageId:msg.reply.id,
                        content:(msg.reply.content ?? "<embed>")?.substring(0,80)
                    } : undefined,
                    commandOptions:(msg.reply && msg.reply.type == "interaction") ? {
                        interactionId:"<outdated>",
                        interactionName:msg.reply.name
                    } : undefined
                }
            })
        }

        const htmlComponents: api.ODTranscriptHtmlV2Data["ticket"]["components"] = {
            messages:messages.length,
            embeds:0,
            files:0,
            interactions:{
                buttons:0, //unused
                dropdowns:0, //unused
                total:0
            },
            reactions:0,
            attachments:{
                gifs:0, //unused
                images:0, //unused
                stickers:0, //unused
                invites:0 //unused
            }
        }
        messages.forEach((msg) => {
            htmlComponents.embeds += msg.embeds.length
            htmlComponents.files += msg.files.length
            htmlComponents.reactions += msg.reactions.length
            msg.components.forEach((row) => {
                htmlComponents.interactions.total += row.components.length
            })
        })


        const dsb = transcriptConfig.data.htmlTranscriptStyle.background
        const dsh = transcriptConfig.data.htmlTranscriptStyle.header
        const dss = transcriptConfig.data.htmlTranscriptStyle.stats
        const dsf = transcriptConfig.data.htmlTranscriptStyle.favicon

        const creator = await opendiscord.tickets.getTicketUser(ticket,"creator")
        const closer = await opendiscord.tickets.getTicketUser(ticket,"closer")
        const claimer = await opendiscord.tickets.getTicketUser(ticket,"claimer")
        const pinner = await opendiscord.tickets.getTicketUser(ticket,"pinner")

        const htmlFinal: api.ODTranscriptHtmlV2Data = {
            version:"2.1",
            otversion:opendiscord.versions.get("opendiscord:version").toString(true),
            language:opendiscord.languages.getLanguageMetadata()?.language.toLowerCase() ?? "english",
            style:{
                background:{
                    backgroundData:(dsb.backgroundImage == "") ? dsb.backgroundColor : dsb.backgroundImage,
                    backgroundModus:(dsb.backgroundImage == "") ? "color" : "image",
                    enableCustomBackground:dsb.enableCustomBackground,
                },
                header:{
                    backgroundColor:dsh.backgroundColor || "#202225",
                    decoColor:dsh.decoColor || "#f8ba00",
                    textColor:dsh.textColor || "#ffffff",
                    enableCustomHeader:dsh.enableCustomHeader
                },
                stats:{
                    backgroundColor:dss.backgroundColor || "#202225",
                    keyTextColor:dss.keyTextColor || "#737373",
                    valueTextColor:dss.valueTextColor || "#ffffff",
                    hideBackgroundColor:dss.hideBackgroundColor || "#40444a",
                    hideTextColor:dss.hideTextColor || "#ffffff",
                    enableCustomStats:dss.enableCustomStats
                },
                favicon:{
                    imageUrl:dsf.imageUrl,
                    enableCustomFavicon:dsf.enableCustomFavicon
                }
            },
            bot:{
                name:opendiscord.client.client.user.displayName,
                id:opendiscord.client.client.user.id,
                pfp:opendiscord.client.client.user.displayAvatarURL({extension:"png"}),
            },
            ticket:{
                name:channel.name,
                id:channel.id,

                guildname:channel.guild.name,
                guildid:channel.guild.id,
                guildinvite:false,

                createdname:(creator ? creator.displayName : false),
                createdid:(creator ? creator.id : false),
                createdpfp:(creator ? creator.displayAvatarURL() : false),

                closedname:(closer ? closer.displayName : false),
                closedid:(closer ? closer.id : false),
                closedpfp:(closer ? closer.displayAvatarURL() : false),

                claimedname:(claimer ? claimer.displayName : false),
                claimedid:(claimer ? claimer.id : false),
                claimedpfp:(claimer ? claimer.displayAvatarURL() : false),

                pinnedname:(pinner ? pinner.displayName : false),
                pinnedid:(pinner ? pinner.id : false),
                pinnedpfp:(pinner ? pinner.displayAvatarURL() : false),

                deletedname:user.displayName,
                deletedid:user.id,
                deletedpfp:user.displayAvatarURL(),

                createdtime:ticket.get("opendiscord:opened-on").value ?? false,
                closedtime:ticket.get("opendiscord:closed-on").value ?? false,
                claimedtime:ticket.get("opendiscord:claimed-on").value ?? false,
                pinnedtime:ticket.get("opendiscord:pinned-on").value ?? false,
                deletedtime:new Date().getTime(),
                
                //role colors are currently unused
                roleColors:[],
                components:htmlComponents
            },
            messages:htmlMessages,

            //premium is implemented, but currently unused
            premium:{
                enabled:false,
                premiumToken:"",
                
                customCredits:{
                    enable:false,
                    replaceText:"Powered By Open Ticket!",
                    replaceURL:"https://opendiscord.dj-dj.be",
                    enableReportBug:true
                },
                customHeaderUrl:{
                    enabled:false,
                    url:"https://opendiscord.dj-dj.be",
                    text:"Hello!"
                },
                customTranscriptUrl:{
                    enabled:false,
                    name:"test-server"
                },
                customFavicon:{
                    enabled:dsf.enableCustomFavicon,
                    image:(dsf.imageUrl) ? dsf.imageUrl : "https://t.dj-dj.be/favicon.png"
                },
                additionalFlags:[]
            }
        }
        
        const req = new ODHTTPHtmlPostRequest(initData.auth,htmlFinal)
        const res = await req.run()

        //check status
        if (res.status == 200 && res.body){
            //check body
            var data: api.ODTranscriptHtmlV2Response = JSON.parse(res.body)
            if (!data || data["status"] != "success"){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_JSON_STATUS error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"Failed to read the response of the HTML Transcripts server.",messages:null,data:null}
            }

            return {
                ticket,channel,user,
                success:true,
                errorReason:null,
                messages,
                data:{
                    url:data.url,
                    availableUntil:new Date(data.availableUntil)
                }
            }

        }else{
            if (res.status == 503){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_503 error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"The HTML Transcripts are currently unreachable. Please try again later.",messages:null,data:null}

            }else if (res.status == 429){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_429 error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"The HTML Transcripts are currently unreachable because the bot is ratelimited. Please try again in a few minutes.",messages:null,data:null}

            }else if (res.status == 403){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_403 error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"The HTML Transcripts are unreachable because the bot has been banned from using the API. If you don't know why, please contact us at https://discord.dj-dj.be",messages:null,data:null}
                
            }else if (res.status == 500){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_500 error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"Something went wrong while compiling the HTML Transcripts, please report this error at https://discord.dj-dj.be",messages:null,data:null}
                
            }else if (res.status == 413){
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_413 error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"Unable to upload transcript, file size is too large (Max 5MB)!",messages:null,data:null}
                
            }else{
                opendiscord.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts COMPILE_COMMUNICATON_UNKNOWN error! (check otdebug.txt for details)"))
                return {ticket,channel,user,success:false,errorReason:"Something went wrong while compiling the HTML Transcripts, please report this error at https://discord.dj-dj.be",messages:null,data:null}
            }
        }
    },async (result) => {
        //READY
        //WAIT UNTIL READY (not required anymore) => await utilities.timer(16000)
        return {
            channelMessage:await messages.getSafe("opendiscord:transcript-html-ready").build("channel",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:html-compiler")}),
            creatorDmMessage:await messages.getSafe("opendiscord:transcript-html-ready").build("creator-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:html-compiler")}),
            participantDmMessage:await messages.getSafe("opendiscord:transcript-html-ready").build("participant-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:html-compiler")}),
            activeAdminDmMessage:await messages.getSafe("opendiscord:transcript-html-ready").build("active-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:html-compiler")}),
            everyAdminDmMessage:await messages.getSafe("opendiscord:transcript-html-ready").build("every-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:opendiscord.transcripts.get("opendiscord:html-compiler")})
        }
    }))
}

export async function loadTranscriptHistory(){
    //UNIMPLEMENTED (made for html transcripts v3 update)
}