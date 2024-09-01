//PLEASE COMPILE USING "npm run build" BEFORE STARTING THE BOT!
//OR USE "npm start" TO INSTANTLY COMPILE & START THE BOT!

const fs = require("fs")
if (process.argv.includes("-%-compile")){
    console.log("Removing prebuilds...")
    fs.rmSync("./dist",{recursive:true,force:true})
    console.log("Compiling the bot...")
    //exit on compilation
    process.exit(0)
}

//start the bot
console.log("Finished compilation!")
import("./dist/src/index.js")