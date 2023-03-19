module.exports = () => {
    require("./firstmsg")()
    require("./verifyBars")()

    //accepted
    require("./accepted/closing")()
    require("./accepted/reopening")()
    require("./accepted/deleting")()
    require("./accepted/closingReason")()
    require("./accepted/claiming")()
}