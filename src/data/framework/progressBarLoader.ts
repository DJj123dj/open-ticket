import {opendiscord, api, utilities} from "../../index"

export const loadAllProgressBarRenderers = async () => {
    const defaultSettings: api.ODProgressBarRenderer_DefaultSettings = {
        borderColor:"gray",
        filledBarColor:"openticket",
        emptyBarColor:"gray",
        prefixColor:"white",
        suffixColor:"white",
        labelColor:"white",

        leftBorderChar:"[",
        rightBorderChar:"]",
        filledBarChar:"█",
        emptyBarChar:"▒",
        labelType:"value",
        labelPosition:"end",
        barWidth:50,

        showBar:true,
        showLabel:true,
        showBorder:true,
    }

    //VALUE RENDERER
    const valueRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    valueRendererSettings.labelType = "value"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:value-renderer",valueRendererSettings))

    //FRACTION RENDERER
    const fractionRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    fractionRendererSettings.labelType = "fraction"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:fraction-renderer",fractionRendererSettings))

    //PERCENTAGE RENDERER
    const percentageRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    percentageRendererSettings.labelType = "percentage"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:percentage-renderer",percentageRendererSettings))

    //TIME MS RENDERER
    const timeMsRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    timeMsRendererSettings.labelType = "time-ms"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:time-ms-renderer",timeMsRendererSettings))

    //TIME SEC RENDERER
    const timeSecRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    timeSecRendererSettings.labelType = "time-sec"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:time-sec-renderer",timeSecRendererSettings))

    //TIME MIN RENDERER
    const timeMinRendererSettings: api.ODProgressBarRenderer_DefaultSettings = {...defaultSettings}
    timeMinRendererSettings.labelType = "time-min"
    opendiscord.progressbars.renderers.add(new api.ODProgressBarRenderer_Default("opendiscord:time-min-renderer",timeMinRendererSettings))
}

export const loadAllProgressBars = async () => {
    const fractRenderer = opendiscord.progressbars.renderers.get("opendiscord:fraction-renderer")

    //SLASH COMMAND REMOVE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-remove",fractRenderer.withAdditionalSettings({filledBarColor:"red"}),0,"max",null,"Commands Removed"))

    //SLASH COMMAND CREATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-create",fractRenderer.withAdditionalSettings({filledBarColor:"green"}),0,"max",null,"Commands Created"))

    //SLASH COMMAND UPDATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-update",fractRenderer.withAdditionalSettings({filledBarColor:"openticket"}),0,"max",null,"Commands Updated"))
}