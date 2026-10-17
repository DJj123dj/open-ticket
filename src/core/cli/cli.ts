import { opendiscord, api, utilities } from "../../index.js"
import * as cli from "@open-discord-bots/framework/cli"

export const logo = [
    "   ██████╗ ██████╗ ███████╗███╗   ██╗    ████████╗██╗ ██████╗██╗  ██╗███████╗████████╗  ",
    "  ██╔═══██╗██╔══██╗██╔════╝████╗  ██║    ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝  ",
    "  ██║   ██║██████╔╝█████╗  ██╔██╗ ██║       ██║   ██║██║     █████╔╝ █████╗     ██║     ",
    "  ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║       ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║     ",
    "  ╚██████╔╝██║     ███████╗██║ ╚████║       ██║   ██║╚██████╗██║  ██╗███████╗   ██║     ",
    "   ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝     "
]
export const headerOpts: cli.ODCliHeaderOpts = {
    logo,
    projectColor:"#f8ba00",
    projectName:"Open Ticket",
    projectVersion:opendiscord.versions.get("opendiscord:version")
}

export async function execute() {
    const editConfig = new cli.ODCliEditConfigInstance(headerOpts, opendiscord)
    const renderQuickSetup = (await import("./quickSetup.js")).renderQuickSetup

    await cli.execute(headerOpts, async (backFn) => {return editConfig.renderEditConfig(backFn)}, renderQuickSetup)
}