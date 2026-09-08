import { opendiscord, api, utilities } from "../../index.js"
import fs from "fs"
import path from "path"

export const migrations = [
    //MIGRATE TO v4.0.0
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.0"),{}),
    
    //MIGRATE TO v4.0.1
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.1"),{
        afterStartupMigrate:async () => {
            //add opendiscord:panel-message properties for all existing panels.
            const globalDatabase = opendiscord.databases.get("opendiscord:global")
            for (const panel of (await globalDatabase.getCategory("opendiscord:panel-update") ?? [])){
                globalDatabase.set("opendiscord:panel-message",panel.key,panel.value)
            }
        }
    }),

    //MIGRATE TO v4.0.2
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.2"),{}),
    
    //MIGRATE TO v4.0.3
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.3"),{}),

    //MIGRATE TO v4.0.4
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.4"),{}),

    //MIGRATE TO v4.0.5
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.5"),{}),

    //MIGRATE TO v4.0.6
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.6"),{}),

    //MIGRATE TO v4.0.7
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.0.7"),{}),

    //MIGRATE TO v4.1.0
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.0"),{
        afterStartupMigrate:async () => {
            //migrate config
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            const optionConfig = opendiscord.configs.get("opendiscord:options")

            if (!generalConfig.data.status.state){
                //only migrate config when it hasn't been done manually by the user.

                if (!generalConfig.data["_INFO"]) throw new api.ODSystemError("Couldn't find general.json '_INFO' category.")
                generalConfig.data["_INFO"].version = "open-ticket-v4.1.0"

                if (!generalConfig.data.status) throw new api.ODSystemError("Couldn't find general.json 'status' category.")
                generalConfig.data.status.mode = generalConfig.data.status["status"] ?? "online"
                generalConfig.data.status.state = ""
                delete generalConfig.data.status["status"]

                if (!generalConfig.data["system"]) throw new api.ODSystemError("Couldn't find general.json 'system' category.")
                generalConfig.data["system"].displayFieldsWithQuestions = false
                generalConfig.data["system"].showGlobalAdminsInPanelRoles = false
                generalConfig.data["system"].alwaysShowReason = false
                generalConfig.data["system"].pinEmoji = "📌"
                generalConfig.data["system"].askPriorityOnTicketCreation = false
                generalConfig.data["system"].disableAutocloseAfterReopen = true
                generalConfig.data["system"].autodeleteRequiresClosedTicket = true
                generalConfig.data["system"].adminOnlyDeleteWithoutTranscript = true
                generalConfig.data["system"].allowCloseBeforeMessage = false
                generalConfig.data["system"].allowCloseBeforeAdminMessage = true
                generalConfig.data["system"].pinFirstTicketMessage = false

                generalConfig.data["system"].channelTopic = {
                    showOptionName:true,
                    showOptionDescription:false,
                    showOptionTopic:true,
                    showPriority:false,
                    showClosed:true,
                    showClaimed:false,
                    showPinned:false,
                    showCreator:false,
                    showParticipants:false
                }

                if (!generalConfig.data["system"].permissions) throw new api.ODSystemError("Couldn't find general.json 'system.permissions' category.")
                generalConfig.data["system"].permissions.transfer = "admin"
                generalConfig.data["system"].permissions.topic = "admin"
                generalConfig.data["system"].permissions.priority = "admin"

                if (!generalConfig.data["system"].messages) throw new api.ODSystemError("Couldn't find general.json 'system.messages' category.")
                generalConfig.data["system"].messages.transferring = {dm:false,logs:true}
                generalConfig.data["system"].messages.topicChange = {dm:false,logs:true}
                generalConfig.data["system"].messages.priorityChange = {dm:false,logs:true}
                generalConfig.data["system"].messages.reactionRole = generalConfig.data["system"].messages["roleAdding"] ?? {dm:false,logs:true}
                delete generalConfig.data["system"].messages["roleAdding"]
                delete generalConfig.data["system"].messages["roleRemoving"]
                
                for (const option of optionConfig.data){
                    if (option.type != "ticket") continue
                    option.channel.topic = option.channel["description"] ?? ""
                    delete option.channel["description"]
                    
                    option.slowMode = {
                        enabled:false,
                        slowModeSeconds:20
                    }
                }

                //save without formatter because it doesn't match the most recent config scheme anymore.
                await generalConfig.save(true)
                await optionConfig.save(true)
            }

            //migrate database
            const optionDatabase = opendiscord.databases.get("opendiscord:options")
            const ticketDatabase = opendiscord.databases.get("opendiscord:tickets")

            for (const option of (await optionDatabase.getCategory("opendiscord:used-option") ?? [])){
                const optionData = option.value
                
                const topicData = optionData.data.find((d) => d.id == "opendiscord:channel-description")
                if (topicData) topicData.id = "opendiscord:channel-topic"
                if (!optionData.data.find((d) => d.id == "opendiscord:slowmode-enabled")) optionData.data.push({id:"opendiscord:slowmode-enabled",value:false})
                if (!optionData.data.find((d) => d.id == "opendiscord:slowmode-seconds")) optionData.data.push({id:"opendiscord:slowmode-seconds",value:20})

                optionDatabase.set("opendiscord:used-option",option.key,optionData)
            }

            for (const ticket of (await ticketDatabase.getCategory("opendiscord:ticket") ?? [])){
                const ticketData = ticket.value
                
                if (!ticketData.data.find((d) => d.id == "opendiscord:previous-creators")) ticketData.data.push({id:"opendiscord:previous-creators",value:[]})
                if (!ticketData.data.find((d) => d.id == "opendiscord:reopened")) ticketData.data.push({id:"opendiscord:reopened",value:false})
                if (!ticketData.data.find((d) => d.id == "opendiscord:reopened-by")) ticketData.data.push({id:"opendiscord:reopened-by",value:null})
                if (!ticketData.data.find((d) => d.id == "opendiscord:reopened-on")) ticketData.data.push({id:"opendiscord:reopened-on",value:null})
                if (!ticketData.data.find((d) => d.id == "opendiscord:priority")) ticketData.data.push({id:"opendiscord:priority",value:-1})
                if (!ticketData.data.find((d) => d.id == "opendiscord:topic")) ticketData.data.push({id:"opendiscord:topic",value:""})
                if (!ticketData.data.find((d) => d.id == "opendiscord:message-sent")) ticketData.data.push({id:"opendiscord:message-sent",value:true})
                if (!ticketData.data.find((d) => d.id == "opendiscord:admin-message-sent")) ticketData.data.push({id:"opendiscord:admin-message-sent",value:true})

                ticketDatabase.set("opendiscord:ticket",ticket.key,ticketData)
            }
        }
    }),

    //MIGRATE TO v4.1.1
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.1"),{}),

    //MIGRATE TO v4.1.2
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.2"),{}),

    //MIGRATE TO v4.1.3
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.1.3"),{}),

    //MIGRATE TO v4.2.0
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.2.0"),{
        beforeStartupMigrate:async () => {
            const isDevconfig = (process.argv.includes("--dev-config") || process.argv.includes("-dc"))
            
            //transfer config files to .jsonc
            const configDir = path.join(process.cwd(),(isDevconfig) ? "./devconfig/" : "./config/")
            for (const file of fs.readdirSync(configDir).filter((f) => f.endsWith(".json"))){
                try{
                    fs.copyFileSync(path.join(configDir,file),path.join(configDir,file.replace(".json",".jsonc")))
                    fs.rmSync(path.join(configDir,file))
                }catch(err){
                    process.emit("uncaughtException",err)
                }
            }
        },
        afterStartupMigrate:async () => {
            //migrate config
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            const questionConfig = opendiscord.configs.get("opendiscord:questions")
            const optionConfig = opendiscord.configs.get("opendiscord:options")
            const panelConfig = opendiscord.configs.get("opendiscord:panels")
            const transcriptConfig = opendiscord.configs.get("opendiscord:transcripts")

            if (!generalConfig.data.ticketSystem){
                //only migrate config when it hasn't been done manually by the user.

                if (!generalConfig.data["_INFO"]) throw new api.ODSystemError("Couldn't find general.jsonc '_INFO' category.")
                delete generalConfig.data["_INFO"]
                generalConfig.data._CONFIG_VERSION = "open-ticket-v4.2.0"

                if (!generalConfig.data["system"]) throw new api.ODSystemError("Couldn't find general.jsonc 'system' category.")
                generalConfig.data.ticketSystem = generalConfig.data["system"]
                generalConfig.data.ticketSystem.closeEmoji = ""
                generalConfig.data.ticketSystem.askPriorityOnTicketCreation = true
                generalConfig.data.ticketSystem.enableCreateTicketForOtherUser = true
                delete generalConfig.data["system"]
                generalConfig.data.logs = generalConfig.data.ticketSystem["logs"]
                delete generalConfig.data.ticketSystem["logs"]
                generalConfig.data.logs.logMessages = generalConfig.data.ticketSystem["messages"]
                delete generalConfig.data.ticketSystem["messages"]
                generalConfig.data.permissions = generalConfig.data.ticketSystem["permissions"]
                delete generalConfig.data.ticketSystem["permissions"]
                generalConfig.data.permissions.transcripts = "admin"

                //closed category
                const closedCategory = {enabled:false,categoryId:"DISCORD_CATEGORY_ID"}
                for (const option of optionConfig.data){
                    if (option.type != "ticket") continue
                    if (option.channel["closedCategory"] && /^\d+$/.test(option.channel["closedCategory"])){
                        closedCategory.enabled = true
                        closedCategory.categoryId = option.channel["closedCategory"]
                    }
                }
                generalConfig.data.ticketSystem.closedCategory = closedCategory

                //backup category
                const backupCategory = {enabled:false,categoryId:"DISCORD_CATEGORY_ID"}
                for (const option of optionConfig.data){
                    if (option.type != "ticket") continue
                    if (option.channel["backupCategory"] && /^\d+$/.test(option.channel["backupCategory"])){
                        backupCategory.enabled = true
                        backupCategory.categoryId = option.channel["backupCategory"]
                    }
                }
                generalConfig.data.ticketSystem.backupCategory = backupCategory

                //claimed categories
                const claimedCategories: {user:string,category:string}[] = []
                for (const option of optionConfig.data){
                    if (option.type != "ticket" || !Array.isArray(option.channel["claimedCategory"])) continue
                    for (const {user,category} of option.channel["claimedCategory"]){
                        if (typeof user == "string" && typeof category == "string" && /^\d+$/.test(user) && /^\d+$/.test(category) && !claimedCategories.find((c) => c.user == user)){
                            claimedCategories.push({user,category})
                        }
                    }
                }
                generalConfig.data.ticketSystem.claimedCategories = claimedCategories


                //delete properties from options.jsonc
                for (const option of optionConfig.data){
                    if (option.type != "ticket") continue
                    delete option.channel["closedCategory"]
                    delete option.channel["backupCategory"]
                    delete option.channel["claimedCategory"]
                }

                //update panels config:
                for (const panel of panelConfig.data){
                    panel.settings.maximumButtonsPerRow = 5
                }

                //update questions config:
                for (const question of questionConfig.data){
                    if (question.type !== "paragraph" && question.type !== "short") continue
                    question.description = ""
                }

                //add new sub-panel option example (for users to try)
                optionConfig.data.push({
                    id:"example-sub-panel",
                    name:"Example Sub-Panel",
                    description:"This is an example of how to implement a sub-panel in Open Ticket.",
                    type:"sub-panel",
                    
                    button:{
                        color:"gray",
                        label:"Sub-Panel Example",
                        emoji:"📋"
                    },
                    subPanelId:panelConfig.data[0]?.id ?? "example-panel"
                })

                //add new question examples (for users to try)
                questionConfig.data.push(
                    {
                        id:"example-dropdown-question",
                        name:"Example Dropdown Question",
                        description:"This is a dropdown question.",
                        type:"dropdown",
                        required:false,

                        placeholder:"Choose your answer...",
                        choices:[
                            {title:"Choice A",description:"Apple",emoji:"🍎"},
                            {title:"Choice B",description:"Banana",emoji:"🍌"},
                            {title:"Choice C",description:"Orange",emoji:"🍊"},
                            {title:"Choice D",description:"Kiwi",emoji:"🥝"}
                        ]
                    },
                    {
                        id:"example-radio-question",
                        name:"Example Radio Question",
                        description:"This is a radio select question.",
                        type:"radio-select",
                        required:true,

                        choices:[
                            {title:"Choice A",description:"Up",selectedByDefault:false},
                            {title:"Choice B",description:"Down",selectedByDefault:false},
                            {title:"Choice C",description:"Left",selectedByDefault:false},
                            {title:"Choice D",description:"Right",selectedByDefault:false}
                        ]
                    },
                    {
                        id:"example-checkbox-question",
                        name:"Example Checkbox Question",
                        description:"This is a checkbox select question.",
                        type:"checkbox-select",
                        required:true,

                        limits:{
                            enabled:false,
                            min:0,
                            max:10
                        },
                        choices:[
                            {title:"Choice A",description:"Happiness",selectedByDefault:false},
                            {title:"Choice B",description:"Anger",selectedByDefault:false},
                            {title:"Choice C",description:"Sadness",selectedByDefault:false},
                            {title:"Choice D",description:"Fear",selectedByDefault:false}
                        ]
                    },
                    {
                        id:"example-file-upload",
                        name:"Example File Upload",
                        description:"With this question type, users can upload one or multiple files.",
                        type:"file-upload",
                        required:true,

                        limits:{
                            enabled:false,
                            min:0,
                            max:1
                        }
                    },
                    {
                        id:"example-text-display-question",
                        type:"text-display",
                        textContents:"This is a text display. It isn't a question, but allows you to display a text, explaination or details."
                    }
                )

                await generalConfig.save(true)
                await questionConfig.save(true)
                await optionConfig.save(true)
                await panelConfig.save(true)
                await transcriptConfig.save(true)
            }

            //migrate database
            const globalDatabase = opendiscord.databases.get("opendiscord:global")
            const optionDatabase = opendiscord.databases.get("opendiscord:options")
            const ticketDatabase = opendiscord.databases.get("opendiscord:tickets")
            const stateDatabase = opendiscord.databases.get("opendiscord:message-states")
            
            for (const option of (await optionDatabase.getCategory("opendiscord:used-option") ?? [])){
                const optionData = option.value
                optionData.data = optionData.data.filter((data) => (
                    data.id !== "opendiscord:channel-category-closed" && 
                    data.id !== "pendiscord:channel-category-backup" && 
                    data.id !== "opendiscord:channel-categories-claimed"
                ))

                optionDatabase.set("opendiscord:used-option",option.key,optionData)
            }

            for (const ticket of (await ticketDatabase.getCategory("opendiscord:ticket") ?? [])){
                const ticketData = ticket.value
                if (!ticketData.data.find((d) => d.id == "opendiscord:channel-renamed")) ticketData.data.push({id:"opendiscord:channel-renamed",value:null})
                
                ticketDatabase.set("opendiscord:ticket",ticket.key,ticketData)
            }

            //migrate old panel messages from global.json to the new message states
            const migratedPanelStates: {channelId:string,messageId:string,panelId:string,autoUpdate:boolean}[] = []
            opendiscord.events.get("afterClientReady").listen(async () => {
                for (const panelMessage of (await globalDatabase.getCategory("opendiscord:panel-message") ?? [])){
                    const splittedId = panelMessage.key.split("_")
                    const channelId = splittedId[0]
                    const messageId = splittedId[1]
                    const message = await opendiscord.client.fetchChannelMessage(channelId,messageId)
                    const autoUpdate = typeof (await globalDatabase.get("opendiscord:panel-update",panelMessage.key)) == "string"
                    //if message still exists
                    if (message) migratedPanelStates.push({channelId,messageId,panelId:panelMessage.value as string,autoUpdate})

                    await globalDatabase.delete("opendiscord:panel-message",panelMessage.key)
                    await globalDatabase.delete("opendiscord:panel-update",panelMessage.key)
                }
            })
            opendiscord.events.get("beforeReadyForUsage").listen(async () => {
                const panelMsgState = opendiscord.states.get("opendiscord:panel-message")
                for (const {channelId,messageId,panelId,autoUpdate} of migratedPanelStates){
                    await panelMsgState.setMsgState({channel:channelId,message:messageId},{
                        messageOrigin:"auto-update",
                        panelId,
                        panelOptionIds:[],
                        panelAutoUpdate:autoUpdate,
                        isSubPanel:false
                    },false)

                    if (!autoUpdate){
                        //auto update ALL non auto-update panels once to update button changes from v4.1 -> v4.2
                        const panel = opendiscord.panels.get(panelId)
                        if (!panel) continue
                        
                        //fetch panel message
                        const mainServer = opendiscord.client.mainServer
                        const message = await opendiscord.client.fetchChannelMessage(channelId,messageId)
                        if (!message || !mainServer || !message.editable || message.flags.has("Ephemeral")) continue
                        
                        const panelMessage = await message.edit((await opendiscord.builders.messages.getSafe("opendiscord:panel").build("auto-update",{guild:mainServer,channel:message.channel,user:opendiscord.client.client.user,panel,isSubPanel:false})).message)
                        if (panelMessage) await panelMsgState.setMsgState({channel:message.channel,message:panelMessage},{
                            messageOrigin:"auto-update",
                            panelId:panel.id.value,
                            panelOptionIds:panel.get("opendiscord:options").value,
                            panelAutoUpdate:false,
                            isSubPanel:false
                        },panelMessage.flags.has("Ephemeral"))
        
                        opendiscord.log("Panel in server got updated to v4.2!","info",[
                            {key:"channelid",value:channelId},
                            {key:"messageid",value:messageId},
                            {key:"panel",value:panel.id.value}
                        ])
                    }
                }
            })
        }
    }),

    //MIGRATE TO v4.2.1
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.2.1"),{
        afterStartupMigrate:async () => {
            //migrate config version
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            
            if (!generalConfig.data["_CONFIG_VERSION"]) throw new api.ODSystemError("Couldn't find general.jsonc '_CONFIG_VERSION' property.")
            generalConfig.data["_CONFIG_VERSION"] = "open-ticket-v4.2.1"
            await generalConfig.save(true)
        },
    }),

    //MIGRATE TO v4.2.2
    new api.ODVersionMigration(api.ODVersion.fromString("opendiscord:version","v4.2.2"),{
        afterStartupMigrate:async () => {
            //migrate config version
            const generalConfig = opendiscord.configs.get("opendiscord:general")
            
            if (!generalConfig.data["_CONFIG_VERSION"]) throw new api.ODSystemError("Couldn't find general.jsonc '_CONFIG_VERSION' property.")
            generalConfig.data["_CONFIG_VERSION"] = "open-ticket-v4.2.2"
            await generalConfig.save()
        },
    }),



    /** =========== WARNING! ===========
     * When a new version contains config changes/migrations,
     * ALL previous versions should be saved 'withoutFormatter'.
     * 
     * --> Otherwise migration might crash on multi-version migrations
     * --> because it doesn't match the most recent config scheme anymore.
     * 
     * EXAMPLE: await generalConfig.save(true)
     */
]