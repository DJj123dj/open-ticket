//PLEASE COMPILE USING "npm run build" BEFORE STARTING THE BOT!
//OR USE "npm start" TO INSTANTLY COMPILE & START THE BOT!

const fs = require("fs")
const child = require("child_process")

console.log("Removing prebuilds...")
fs.rmSync("./dist",{recursive:true,force:true})

console.log("Compiling the bot...")
//exit when only compilation is required
if (process.argv.includes("-%-compile")) process.exit(0)

//start the bot
require("./dist/src/index")