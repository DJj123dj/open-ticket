import {openticket, api, utilities} from "../../index"
import * as discord from "discord.js"

const collector = openticket.transcripts.collector
const messages = openticket.builders.messages
const transcriptConfig = openticket.configs.get("openticket:transcripts")
const textConfig = transcriptConfig.data.textTranscriptStyle
const htmlVersion = Buffer.from("b3BlbnRpY2tldFRSQU5TQ1JJUFQxMjM0","base64").toString("utf8")

export const replaceHtmlTranscriptMentions = async (text:string) => {
    const mainServer = openticket.client.mainServer
    if (!mainServer) throw new api.ODSystemError("Unknown mainServer! => Required for mention replacement in Html Transcripts!")

    const usertext = await utilities.asyncReplace(text,/<@([0-9]+)>/g,async (match,id) => {
        const member = await openticket.client.fetchGuildMember(mainServer,id)
        return (member ? "<@"+(member.user.displayName).replace(/\s/g,"&nbsp;")+"> " : id) //replace with html spaces => BUG: whitespace CSS isn't "pre-wrap"
    })

    const channeltext = await utilities.asyncReplace(usertext,/<#([0-9]+)>/g,async (match,id) => {
        const channel = await openticket.client.fetchGuildChannel(mainServer,id)
        return (channel ? "<#"+channel.name.replace(/\s/g,"&nbsp;")+"> " : id) //replace with html spaces => BUG: whitespace CSS isn't "pre-wrap"
    })

    const roletext = await utilities.asyncReplace(channeltext,/<@&([0-9]+)>/g,async (match,id) => {
        const role = await openticket.client.fetchGuildRole(mainServer,id)
        let text = role ? role.name.replace(/\s/g,"&nbsp;") : id
        let color = role ? ((role.hexColor == "#000000") ? "regular" : role.hexColor) : "regular" //when hex color is #000000 => render as default
        return "<@&"+text+"::"+color+"> "
    })

    const defaultroletext = await utilities.asyncReplace(roletext,/@(everyone|here)/g,async (match,id) => {
        return "<@&"+id+"::regular> "
    })
    return defaultroletext
}

export const loadAllTranscriptCompilers = async () => {
    class ODHTTPHtmlPostRequest extends api.ODHTTPPostRequest {
        constructor(domain:string, htmlFinal:api.ODTranscriptHtmlV2Data){
            super("https://"+domain+"/transcripts/upload?auth="+htmlVersion+"&version=2",true,{
                body:JSON.stringify(htmlFinal)
            })
        }
    }

    //TEXT COMPILER
    openticket.transcripts.add(new api.ODTranscriptCompiler<{contents:string}>("openticket:text-compiler",undefined,async (ticket,channel,user) => {
        //COMPILE
        const rawMessages = await collector.collectAllMessages(ticket)
        if (!rawMessages) return {ticket,channel,user,success:false,errorReason:"Unable to collect messages!",messages:null,data:null}
        const messages = await collector.convertMessagesToTranscriptData(rawMessages)

        const finalMessages: string[] = []
        //TODO TRANSLATION!!!
        finalMessages.push("=============== MESSAGES ===============")

        messages.filter((msg) => textConfig.includeBotMessages || !msg.author.tag).forEach((msg) => {
            const timestamp = utilities.dateString(new Date(msg.timestamp))
            const edited = (msg.edited ? " (edited)" : "")
            const authorId = (textConfig.includeIds ? " ("+msg.author.id+")" : "")
            const msgId = (textConfig.includeIds ? " ("+msg.id+")" : "")

            if (textConfig.layout == "simple"){
                //SIMPLE LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                //TODO TRANSLATION!!!
                const embeds = (textConfig.includeEmbeds) ? "\nEmbeds: "+msg.embeds.length : ""
                const files = (textConfig.includeFiles) ? "\nFiles: "+msg.files.length : ""
                //TODO TRANSLATION!!!
                const content = (msg.content) ? msg.content : ("<content is empty>"+embeds+files)
                finalMessages.push(header+"\n   "+content.split("\n").join("\n    "))
                
            }else if (textConfig.layout == "normal"){
                //NORMAL LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                const embeds = (textConfig.includeEmbeds && msg.embeds.length > 0) ? "\n"+msg.embeds.map((embed) => {
                    //TODO TRANSLATION!!!
                    return "==== (EMBED) "+(embed.title ?? "<no-title>")+" ====\n"+(embed.description ?? "<no-description>")
                }) : ""
                const files = (textConfig.includeFiles && msg.files.length > 0) ? "\n"+msg.files.map((file) => {
                    //TODO TRANSLATION!!!
                    return "==== (FILE) "+(file.name)+" ====\nSize: "+(file.size+" "+file.unit)+"\nUrl: "+file.url
                }) : ""
                const content = (msg.content) ? msg.content : ""
                finalMessages.push(header+"\n   "+(content+embeds+files).split("\n").join("\n    "))

            }else if (textConfig.layout == "detailed"){
                //ADVANCED LAYOUT
                const header = "["+timestamp+" | "+msg.author.displayname+authorId+"]"+edited+msgId
                const embeds = (textConfig.includeEmbeds && msg.embeds.length > 0) ? "\n"+msg.embeds.map((embed) => {
                    //TODO TRANSLATION!!!
                    return "\n==== (EMBED) "+(embed.title ?? "<no-title>")+" ====\n"+(embed.description ?? "<no-description>")+(embed.fields.length > 0 ? "\n\n== (FIELDS) ==\n"+embed.fields.map((field) => field.name+": "+field.value).join("\n") : "")
                }) : ""
                const files = (textConfig.includeFiles && msg.files.length > 0) ? "\n"+msg.files.map((file) => {
                    //TODO TRANSLATION!!!
                    return "\n==== (FILE) "+(file.name)+" ====\nSize: "+(file.size+" "+file.unit)+"\nUrl: "+file.url+"\nAlt: "+(file.alt ?? "/")
                }) : ""
                //TODO TRANSLATION!!!
                const reactions = (msg.reactions.filter((r) => !r.custom).length > 0) ? "\n==== (REACTIONS) ====\n"+msg.reactions.filter((r) => !r.custom).map((r) => r.amount+" "+r.emoji).join(" - ") : ""
                const content = (msg.content) ? msg.content : ""
                finalMessages.push(header+"\n   "+(content+embeds+files+reactions).split("\n").join("\n    "))
            }
        })

        const finalStats: string[] = []

        const creationDate = ticket.get("openticket:opened-on").value
        const closeDate = ticket.get("openticket:closed-on").value
        const claimDate = ticket.get("openticket:claimed-on").value
        const pinDate = ticket.get("openticket:pinned-on").value
        const creator = await openticket.tickets.getTicketUser(ticket,"creator")
        const closer = await openticket.tickets.getTicketUser(ticket,"closer")
        const claimer = await openticket.tickets.getTicketUser(ticket,"claimer")
        const pinner = await openticket.tickets.getTicketUser(ticket,"pinner")

        if (textConfig.includeStats){
            //TODO TRANSLATION!!!
            finalStats.push("=============== STATS ===============")
            if (textConfig.layout == "simple"){
                //SIMPLE LAYOUT
                //TODO TRANSLATION!!!
                if (creationDate) finalStats.push("Created On: "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push("Created By: "+creator.displayName)
                finalStats.push("\n")
                
            }else if (textConfig.layout == "normal"){
                //NORMAL LAYOUT
                //TODO TRANSLATION!!!
                if (creationDate) finalStats.push("Created On: "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push("Created By: "+creator.displayName)
                finalStats.push("")
                if (closer) finalStats.push("Closed By: "+closer.displayName)
                if (claimer) finalStats.push("Claimed By: "+claimer.displayName)
                if (pinner) finalStats.push("Pinned By: "+pinner.displayName)
                finalStats.push("Deleted By: "+user.displayName)
                finalStats.push("\n")

            }else if (textConfig.layout == "detailed"){
                //ADVANCED LAYOUT
                //TODO TRANSLATION!!!
                if (creationDate) finalStats.push("Created On: "+utilities.dateString(new Date(creationDate)))
                if (creator) finalStats.push("Created By: "+creator.displayName)
                finalStats.push("")
                if (closeDate) finalStats.push("Closed On: "+utilities.dateString(new Date(closeDate)))
                if (closer) finalStats.push("Closed By: "+closer.displayName)
                finalStats.push("")
                if (claimDate) finalStats.push("Claimed On: "+utilities.dateString(new Date(claimDate)))
                if (claimer) finalStats.push("Claimed By: "+claimer.displayName)
                finalStats.push("")
                if (pinDate) finalStats.push("Pinned On: "+utilities.dateString(new Date(pinDate)))
                if (pinner) finalStats.push("Pinned By: "+pinner.displayName)
                finalStats.push("")
                finalStats.push("Deleted On: "+utilities.dateString(new Date()))
                finalStats.push("Deleted By: "+user.displayName)
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
            channelMessage:await messages.getSafe("openticket:transcript-text-ready").build("channel",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:text-compiler")}),
            creatorDmMessage:await messages.getSafe("openticket:transcript-text-ready").build("creator-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:text-compiler")}),
            participantDmMessage:await messages.getSafe("openticket:transcript-text-ready").build("participant-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:text-compiler")}),
            activeAdminDmMessage:await messages.getSafe("openticket:transcript-text-ready").build("active-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:text-compiler")}),
            everyAdminDmMessage:await messages.getSafe("openticket:transcript-text-ready").build("every-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:text-compiler")})
        }
    }))

    //HTML COMPILER
    openticket.transcripts.add(new api.ODTranscriptCompiler<{url:string}>("openticket:html-compiler",async (ticket,channel,user) => {
        //INIT
        const req = new api.ODHTTPGetRequest("https://apis.dj-dj.be/transcripts/status.json",false)
        const res = await req.run()
        if (!res || res.status != 200 || !res.body){
            openticket.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
            process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_COMMUNICATON error! (check otdebug.txt for details)"))
            return {success:false,errorReason:"HTML Transcripts are currently unavailable!",pendingMessage:null}
        }
        try{
            const data = JSON.parse(res.body)
            if (!data || data["v2"] != "online") return {success:false,errorReason:"HTML Transcripts are currently unavailable due to maintenance!",pendingMessage:null}
        }catch{
            openticket.debugfile.writeNote("HTML Transcripts Error => unable to parse status! body:\n"+res.body)
            process.emit("uncaughtException",new api.ODSystemError("HTML Transcripts INIT_STATUS_PARSE error! (check otdebug.txt for details)"))
            return {success:false,errorReason:"HTML Transcripts are currently unavailable due to JSON parse error!",pendingMessage:null}
        }
        
        return {success:true,errorReason:null,pendingMessage:await messages.getSafe("openticket:transcript-html-progress").build("channel",{guild:channel.guild,channel,user,ticket,compiler:openticket.transcripts.get("openticket:html-compiler"),remaining:16000})}
    },async (ticket,channel,user) => {
        //COMPILE
        const rawMessages = await collector.collectAllMessages(ticket)
        if (!rawMessages) return {ticket,channel,user,success:false,errorReason:"Unable to collect messages!",messages:null,data:null}
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

        const creator = await openticket.tickets.getTicketUser(ticket,"creator")
        const claimer = await openticket.tickets.getTicketUser(ticket,"claimer")
        const closer = await openticket.tickets.getTicketUser(ticket,"closer")

        const htmlFinal: api.ODTranscriptHtmlV2Data = {
            version:"2",
            otversion:openticket.versions.get("openticket:version").toString(true),
            bot:{
                name:openticket.client.client.user.displayName,
                id:openticket.client.client.user.id,
                pfp:openticket.client.client.user.displayAvatarURL({extension:"png"}),
            },
            language:openticket.languages.getLanguageMetadata()?.language ?? "english",
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
            ticket:{
                name:channel.name,
                id:channel.id,

                guildname:channel.guild.name,
                guildid:channel.guild.id,
                guildinvite:"",

                creatorname:(creator ? creator.displayName : "<unknown>"),
                creatorid:(creator ? creator.id : "<unknown>"),
                creatorpfp:(creator ? creator.displayAvatarURL() : "https://transcripts.dj-dj.be/favicon.png"),

                //closer is ticket deleter (small bug)
                closedbyname:user.displayName,
                closedbyid:user.id,
                closedbypfp:user.displayAvatarURL(),

                //claiming is currently unused
                claimedname:(claimer ? claimer.displayName : "<not-claimed>"),
                claimedid:(claimer ? claimer.id : "<not-claimed>"),
                claimedpfp:(claimer ? claimer.displayAvatarURL() : "https://transcripts.dj-dj.be/favicon.png"),
                
                closedtime:new Date().getTime(),
                openedtime:ticket.get("openticket:opened-on").value ?? new Date().getTime(),
                
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
                    replaceURL:"https://openticket.dj-dj.be",
                    enableReportBug:true
                },
                customHeaderUrl:{
                    enabled:false,
                    url:"https://openticket.dj-dj.be",
                    text:"Hello!"
                },
                customTranscriptUrl:{
                    enabled:false,
                    name:"test-server"
                },
                customFavicon:{
                    enabled:dsf.enableCustomFavicon,
                    image:(dsf.imageUrl) ? dsf.imageUrl : "https://transcripts.dj-dj.be/favicon.png"
                },
                additionalFlags:[]
            }
        }
        
        const req = new ODHTTPHtmlPostRequest("apis.dj-dj.be",htmlFinal)
        const res = await req.run()
        //check status
        if (!res || res.status != 200 || !res.body){
            //ratelimit error
            if (res.status == 429) return {ticket,channel,user,success:false,errorReason:"Failed to upload HTML Transcripts! (Ratelimit)\nTry again in a few minutes!",messages,data:null}
            
            //unknown status error
            openticket.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
            return {ticket,channel,user,success:false,errorReason:"Failed to upload HTML Transcripts! (Unknown Error)",messages,data:null}
        }
        //check body
        try{
            var data: api.ODTranscriptHtmlV2Response = JSON.parse(res.body)
            if (!data || data["status"] != "success"){
                openticket.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
                return {ticket,channel,user,success:false,errorReason:"Failed to upload HTML Transcripts! (Server 500 Error)",messages,data:null}}
        }catch{
            openticket.debugfile.writeNote("HTML Transcripts Error => status: "+res.status+", body:\n"+res.body)
            return {ticket,channel,user,success:false,errorReason:"Failed to upload HTML Transcripts! (JSON parse error)",messages,data:null}
        }

        const url = "https://transcripts.dj-dj.be/v2/"+data.time+"_"+data.id+".html"
        return {ticket,channel,user,success:true,errorReason:null,messages,data:{url}}
    },async (result) => {
        //READY
        await utilities.timer(16000) //wait until transcript is ready
        return {
            channelMessage:await messages.getSafe("openticket:transcript-html-ready").build("channel",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:html-compiler")}),
            creatorDmMessage:await messages.getSafe("openticket:transcript-html-ready").build("creator-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:html-compiler")}),
            participantDmMessage:await messages.getSafe("openticket:transcript-html-ready").build("participant-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:html-compiler")}),
            activeAdminDmMessage:await messages.getSafe("openticket:transcript-html-ready").build("active-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:html-compiler")}),
            everyAdminDmMessage:await messages.getSafe("openticket:transcript-html-ready").build("every-admin-dm",{guild:result.channel.guild,channel:result.channel,user:result.user,ticket:result.ticket,result,compiler:openticket.transcripts.get("openticket:html-compiler")})
        }
    }))
}

export const loadTranscriptHistory = async () => {
    //UNIMPLEMENTED (made for html transcripts v3 update)
}