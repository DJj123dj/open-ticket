const discord = require('discord.js')

const bot = require("../../../index")
const tsconfig = bot.tsconfig
const tsembeds = require("../embeds")
const tsdb = require("../tsdb")

const otversion = require("../../../package.json").version
const version = require("../info.json").version

const mentions = require("./mentions").replacementions

/**@typedef {{background:{enableCustomBackground:Boolean, backgroundModus:"color"|"image", backgroundData:String}, header:{enableCustomHeader:Boolean, decoColor:String, backgroundColor:String, textColor:String}, stats:{enableCustomStats:Boolean, backgroundColor:String, keyTextColor:String, valueTextColor:String, hideBackgroundColor:String, hideTextColor:String}, favicon:{enableCustomFavicon:Boolean, imageUrl:String}} OTTranscriptStyle} */
/**@typedef {{name:String, id:String, pfp:String}} OTTranscriptBot */
/**@typedef {{name:String, id:String, guildname:String, guildid:String, guildinvite:String|false, creatorname:String, creatorid:String, closedbyname:String, closedbyid:String, claimedname:String, claimedid:String, creatorpfp:String, closedbypfp:String, claimedpfp:String, closedtime:Number, openedtime:Number, components:{messages:1, files:1, embeds:1, reactions:1, interactions:{dropdowns:1, buttons:1, total:1}, attachments:{invites:1, images:1, gifs:1, stickers:1}}, roleColors:[{id:String,color:String}] }} OTTranscriptTicket */
/**@typedef {{author:{name:String, id:String, color:String, pfp:String, bot:Boolean, verifiedBot:Boolean, system:Boolean}, content:String|false, timestamp:Number, type:"normal", important:Boolean, edited:Boolean, embeds:[{title:String|false, description:String|false, authorimg:String|false, authortext:String|false, footerimg:String|false, footertext:String|false, color:String, image:String|false, thumbnail:String|false, url:String|false, fields:[{name:String,value:String,inline:Boolean}]}], attachments:[{type:"FILE", name:String, fileType:String, size:String, url:String}, {type:"FILE:image", name:String, fileType:String, size:String, url:String}, {type:"URL:invite", guildId:String, guildName:String, guildSize:Number, guildOnline:Number, image:String, url:String}, {type:"URL:gif", url:String}, {type:"BUILDIN:sticker", name:String, url:String}], components:[{type:"buttons", buttons:[{type:"interaction"|"url", label:String|false, icon:String|false, color:"gray"|"green"|"red"|"blue", id:String|false, url:String|false, disabled:Boolean}]}, {type:"dropdown", placeholder:String|false, options:[{label:String|false, icon:String|false, description:String|false, id:String|false}]}, {type:"reactions", reactions:[{amount:1, emoji:String, type:"svg"|"image"|"gif"}]}], reply:{type:"reply"|"command"|false, user:{name:String, id:String, color:String, pfp:String, bot:Boolean, verifiedBot:Boolean, system:Boolean}, replyOptions:{content:String, messageId:String, channelId:String, guildId:String}, commandOptions:{interactionName:String, interactionId:String}}}} OTTranscriptMessage */
/**@typedef {{enabled:Boolean,premiumToken:String, customCredits:{enable:Boolean, replaceText:String, replaceURL:String, enableReportBug:Boolean},customHeaderUrl:{enabled:Boolean, url:String, text:String}, customTranscriptUrl:{enabled:Boolean, name:String}, customFavicon:{enabled:Boolean, image:String},additionalFlags:String[]}} OTTranscriptPremium */

/**@typedef {{version:"2", otversion:String, language:String, style:OTTranscriptStyle, bot:OTTranscriptBot, ticket:OTTranscriptTicket, messages:OTTranscriptMessage[], premium:OTTranscriptPremium}} OTTranscriptCompileInput */

/**@typedef {{style:OTTranscriptStyle,bot:OTTranscriptBot,ticket:OTTranscriptTicket,premium:OTTranscriptPremium}} OTHTMLDataOption */


/**@param {discord.ButtonStyle} buttonstyle */
const buttonStyleToColor = (buttonstyle) => {
    if (buttonstyle == discord.ButtonStyle.Primary){
        return "blue"
    }else if (buttonstyle == discord.ButtonStyle.Secondary){
        return "gray"
    }else if (buttonstyle == discord.ButtonStyle.Danger){
        return "red"
    }else if (buttonstyle == discord.ButtonStyle.Success){
        return "green"
    }else{
        return "gray"
    }
}

/**
 * 
 * @param {discord.Guild} guild 
 * @param {discord.Channel} channel 
 * @param {discord.User} user 
 * @param {discord.Message[]} messagesInv
 * @param {OTHTMLDataOption} data 
 */
exports.compile = (guild,channel,user,messagesInv,data) => {
    const messages = messagesInv.reverse()
    var invisibleMessages = 0
    
    //MESSAGE STATS COUNTS
    var messageAmount = messages.length
    var fileAmount = 0
    var embedAmount = 0
    var reactionsAmount = 0
    var interactionAmount = 0
    messages.forEach((msg) => {
        fileAmount = fileAmount + Array.from(msg.attachments).length
        embedAmount = embedAmount + msg.embeds.length

        msg.reactions.cache.forEach(reaction => {
            reactionsAmount = reactionsAmount + reaction.count
        })
        if (msg.components && msg.components.length > 0){
            msg.components.forEach((component) => {
                if (component.components.length > 0){
                    interactionAmount = interactionAmount + component.components.length
                }else{
                    interactionAmount = interactionAmount+1
                }
                
            })
        }
    })

    /**@type {OTTranscriptMessage[]} */
    const messagesArray = []
    messages.forEach((msg) => {
        if (msg.content || msg.embeds.length > 0 || msg.attachments.toJSON().length > 0 || msg.components.length > 0 || msg.reactions.cache.size > 0){

            const embedArray = []
            const attachmentArray = []
            const componentsArray = []

            msg.attachments.forEach((file) => {
                attachmentArray.push({
                    type:"FILE",
                    name:file.name,
                    fileType:file.contentType,
                    size:Math.round(file.size/1000)+" kb",
                    url:file.url
                })
            })

            msg.embeds.forEach((embed) => {
                embedArray.push({
                    title:embed.title || false,
                    description:embed.description ? mentions(embed.description,guild) : false,
                    authorimg:((embed.author && embed.author.iconURL) ? embed.author.iconURL : false),
                    authortext:(embed.author ? embed.author.name : false),
                    footerimg:((embed.footer && embed.footer.iconURL) ? embed.footer.iconURL : false),
                    footertext:(embed.footer ? embed.footer.text : false),
                    color:embed.hexColor,
                    image:((embed.image && embed.image.url) ? embed.image.url : false),
                    thumbnail:((embed.thumbnail && embed.thumbnail.url) ? embed.thumbnail.url : false),
                    url:(embed.url ? embed.url : false),
                    fields:embed.fields
                })
            })

            const tempreactions = []
            msg.reactions.cache.forEach((reaction) => {
                const count = reaction.count
                const emoji = reaction.emoji

                if (emoji instanceof discord.GuildEmoji){
                    //custom emoji
                    tempreactions.push({
                        amount:count,
                        emoji:(emoji.url) ? emoji.url : "",
                        type:(emoji.animated) ? "gif" : "image"
                    })
                }else if (emoji instanceof discord.ReactionEmoji){
                    //build-in emoji
                    tempreactions.push({
                        amount:count,
                        emoji:emoji.name,
                        type:"svg"
                    })
                }
            })
            componentsArray.push({
                type: "reactions",
                reactions:tempreactions
            })

            msg.components.forEach((actionrow) => {
                var isdropdown = false
                var actioncomponents = []
                actionrow.components.forEach((comp) => {
                    if (comp.type == discord.ComponentType.ActionRow || comp.type == discord.ComponentType.TextInput) return
                    
                    /**
                     * type: "buttons";
                        buttons: [{
                            type: "interaction" | "url";
                            label: string | false;
                            icon: string | false;
                            color: "gray" | "green" | "red" | "blue";
                            id: string | false;
                            url: string | false;
                            disabled: boolean;
                        }];
                    }, {
                        type: "dropdown";
                        placeholder: string | false;
                        options: [{
                            label: string | false;
                            icon: string | false;
                            description: string | false;
                            id: string | false;
                        }];
                    },
                     */
                    if (comp.type == discord.ComponentType.Button){
                        actioncomponents.push({
                            type: (comp.style == discord.ButtonStyle.Link) ? "url" : "interaction",
                            label: (comp.label) ? comp.label : false,
                            icon: (comp.emoji) ? comp.emoji.name : false,
                            color: buttonStyleToColor(comp.style),
                            id: comp.customId ? comp.customId : false,
                            url: (comp.url) ? comp.url : false,
                            disabled: false
                        })
                    }else{
                        isdropdown = true
                        var drpdwnoptions = []
                        /**@type {discord.APISelectMenuOption[]} */
                        const dropdownoptions = comp.options
                        dropdownoptions.forEach((opt) => {
                            drpdwnoptions.push({
                                label: opt.label,
                                icon: (opt.emoji) ? opt.emoji : false,
                                description: (opt.description) ? opt.description : false,
                                id: "hello world :)"
                            })
                        })

                        componentsArray.push({
                            type:"dropdown",
                            placeholder:false,
                            options:drpdwnoptions
                        })
                    }
                })

                if (!isdropdown){
                    componentsArray.push({
                        type:"buttons",
                        buttons:actioncomponents
                    }) 
                }
            })

            const important = msg.guild ? (msg.content.includes("<@"+msg.guild.id+">") || msg.content.includes("<@everyone") || msg.content.includes("@here")): false

            const replytype = (msg.interaction) ? "command" : ((msg.reference) ? "reply" : false)
            if (replytype == "command"){
                const replycolorRAW = msg.guild.members.cache.find((m) => m.id == msg.interaction.user.id)
                const replycolor = (replycolorRAW) ? replycolorRAW.displayHexColor.replace("#000000","#ffffff") : "#ffffff"
                var reply = {
                    type:replytype,
                    commandOptions:{
                        interactionId:msg.interaction.id,
                        interactionName:msg.interaction.commandName
                    },
                    user:{
                        name:msg.interaction.user.displayName,
                        id:msg.interaction.user.id,
                        color:replycolor,
                        pfp:msg.interaction.user.displayAvatarURL(),
                        bot:msg.interaction.user.bot,
                        system:msg.interaction.user.system,
                        verifiedBot:msg.interaction.user.flags.has(discord.UserFlags.VerifiedBot)
                    }
                }
            }else if (replytype == "reply"){

                var replycontentRAW = messages.find((msg2) => msg2.id == msg.reference.messageId)
                var replycontent = (replycontentRAW && replycontentRAW.content) ? replycontentRAW.content.slice(0,(60-replycontentRAW.author.displayName.length)) : "deleted this message"
                const replycolorRAW = (replycontentRAW) ? msg.guild.members.cache.find((m) => m.id == replycontentRAW.author.id) : false
                const replycolor = (replycolorRAW) ? replycolorRAW.displayHexColor.replace("#000000","#ffffff") : "#ffffff"
                
                var user = (replycontentRAW && replycontentRAW.content) ? {
                    name:(replycontentRAW) ? replycontentRAW.author.displayName : "undefined",
                    id:(replycontentRAW) ? replycontentRAW.author.id : "undefined",
                    color:replycolor,
                    pfp:(replycontentRAW) ? replycontentRAW.author.displayName : "",
                    bot:(replycontentRAW) ? replycontentRAW.author.bot : false,
                    system:(replycontentRAW) ? replycontentRAW.author.system : false,
                    verifiedBot:(replycontentRAW) ? replycontentRAW.author.flags.has(discord.UserFlags.VerifiedBot) : false,
                } : {
                    name:"someone",
                    id:"undefined",
                    color:"#ffffff",
                    pfp:"https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f5d1.png",
                    bot:false,
                    system:false,
                    verifiedBot:false,
                }
                
                var reply = {
                    type:replytype,
                    replyOptions:{
                        content:replycontent,
                        messageId: msg.reference.messageId,
                        channelId: msg.reference.channelId,
                        guildId: msg.reference.guildId
                    },
                    user:user
                }
            }else{var reply = {type:replytype}}

            const authorColor = msg.member ? msg.member.displayHexColor.replace("#000000","#ffffff") : "#ffffff"
            messagesArray.push({
                author:{
                    name:msg.author.displayName,
                    id:msg.author.id,
                    color:authorColor,
                    pfp:msg.author.displayAvatarURL(),
                    bot:msg.author.bot,
                    system:msg.author.system,
                    verifiedBot:msg.author.flags.has(discord.UserFlags.VerifiedBot)
                },
                content:mentions(msg.content,guild) || "",
                timestamp:msg.createdTimestamp,
                embeds:embedArray,
                attachments:attachmentArray,
                edited: (typeof msg.editedTimestamp == "number"),
                type:"normal",
                important:important,
                reply:reply,
                components:componentsArray
            })
        }else {invisibleMessages++}
    })

    const dsb = data.style.background
    const dsh = data.style.header
    const dss = data.style.stats
    const dsf = data.style.favicon

    /**@type {OTTranscriptCompileInput} */
    const result = {
        version,otversion,
        language:bot.config.languageFile,
        style:{
            background:{
                backgroundData:dsb.backgroundData || "",
                backgroundModus:dsb.backgroundModus || "",
                enableCustomBackground:dsb.enableCustomBackground || false,
            },
            header:{
                backgroundColor:dsh.backgroundColor || "#202225",
                decoColor:dsh.decoColor || "#F8BA00",
                textColor:dsh.textColor || "#ffffff",
                enableCustomHeader:dsh.enableCustomHeader || false
            },
            stats:{
                backgroundColor:dss.backgroundColor || "#202225",
                keyTextColor:dss.keyTextColor || "#737373",
                valueTextColor:dss.valueTextColor || "#ffffff",
                hideBackgroundColor:dss.hideBackgroundColor || "#40444a",
                hideTextColor:dss.hideTextColor || "#ffffff",
                enableCustomStats:dss.enableCustomStats || false
            }
        },
        bot:{
            name:data.bot.name || "Open Ticket",
            id:data.bot.id || 0,
            pfp:data.bot.pfp || "transcripts.dj-dj.be/favicon.png"
        },
        ticket:{
            name:channel.name,
            id:channel.id,

            guildname:guild.name,
            guildid:guild.id,
            guildinvite:"",

            creatorname:data.ticket.creatorname,
            creatorid:data.ticket.creatorid,
            creatorpfp:data.ticket.creatorpfp,

            closedbyname:user.displayName,
            closedbyid:user.id,
            closedbypfp:user.displayAvatarURL(),

            claimedid:"",
            claimedname:"",
            claimedpfp:"",
            
            closedtime:data.ticket.closedtime,
            openedtime:data.ticket.openedtime,
            
            roleColors:[],
            components:{
                messages:messageAmount,
                embeds:embedAmount,
                files:fileAmount,
                interactions:{
                    buttons:0,
                    dropdowns:0,
                    total:interactionAmount
                },
                reactions:reactionsAmount,
                attachments:{
                    gifs:0,
                    images:0,
                    stickers:0,
                    invites:0
                }
            }
        },
        messages:messagesArray,
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
                image:(dsf.imageUrl) ? dsf.imageUrl : "https://openticket.dj-dj.be"
            },
            additionalFlags:[]
        }
    }


    return result
}