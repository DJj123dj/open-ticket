import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllProgressBarRenderers() {
    const defaultSettings: api.ODDefaultProgressBarRendererSettings = {
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
        showBorder:true
    }

    //VALUE RENDERER
    const valueRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    valueRendererSettings.labelType = "value"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:value-renderer", valueRendererSettings))

    //FRACTION RENDERER
    const fractionRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    fractionRendererSettings.labelType = "fraction"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:fraction-renderer", fractionRendererSettings))

    //PERCENTAGE RENDERER
    const percentageRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    percentageRendererSettings.labelType = "percentage"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:percentage-renderer", percentageRendererSettings))

    //TIME MS RENDERER
    const timeMsRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    timeMsRendererSettings.labelType = "time-ms"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:time-ms-renderer", timeMsRendererSettings))

    //TIME SEC RENDERER
    const timeSecRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    timeSecRendererSettings.labelType = "time-sec"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:time-sec-renderer", timeSecRendererSettings))

    //TIME MIN RENDERER
    const timeMinRendererSettings: api.ODDefaultProgressBarRendererSettings = {...defaultSettings}
    timeMinRendererSettings.labelType = "time-min"
    opendiscord.progressbars.renderers.add(new api.ODDefaultProgressBarRenderer("opendiscord:time-min-renderer", timeMinRendererSettings))
}

export async function loadAllProgressBars() {
    const fractRenderer = opendiscord.progressbars.renderers.get("opendiscord:fraction-renderer")

    //SLASH COMMAND REMOVE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-remove", fractRenderer.withAdditionalSettings({filledBarColor:"red"}), 0, "max", null, "Commands Removed"))

    //SLASH COMMAND CREATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-create", fractRenderer.withAdditionalSettings({filledBarColor:"green"}), 0, "max", null, "Commands Created"))

    //SLASH COMMAND UPDATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:slash-command-update", fractRenderer.withAdditionalSettings({filledBarColor:"openticket"}), 0, "max", null, "Commands Updated"))

    //CONTEXT MENU REMOVE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:context-menu-remove", fractRenderer.withAdditionalSettings({filledBarColor:"red"}), 0, "max", null, "Context Menus Removed"))

    //CONTEXT MENU CREATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:context-menu-create", fractRenderer.withAdditionalSettings({filledBarColor:"green"}), 0, "max", null, "Context Menus Created"))

    //CONTEXT MENU UPDATE (doesn't have correct amount yet)
    opendiscord.progressbars.add(new api.ODManualProgressBar("opendiscord:context-menu-update", fractRenderer.withAdditionalSettings({filledBarColor:"openticket"}), 0, "max", null, "Context Menus Updated"))
}