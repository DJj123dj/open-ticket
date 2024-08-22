//PLEASE COMPILE USING "npm run build" BEFORE STARTING THE BOT!
//OR USE "npm start" TO INSTANTLY COMPILE & START THE BOT!

const fs = require("fs")
const child = require("child_process")
if (!fs.existsSync("./dist/src/index.js")){
    console.log("Compiling the bot...")
    child.execSync("npm run build")
    console.log("\n\nFinished compilation!")
}
require("./dist/src/index")