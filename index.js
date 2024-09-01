//@ts-check
const fs = require("fs")
const ts = require("typescript")
const nodepath = require('path')

//REMOVE EXISTING BUILDS
console.log("OT: Removing Prebuilds...")
fs.rmSync("./dist",{recursive:true,force:true})

//COMPILE TYPESCRIPT
console.log("OT: Compiling Typescript...")
const configPath = nodepath.resolve('./tsconfig.json')
const configFile = ts.readConfigFile(configPath,ts.sys.readFile)

//check for tsconfig errors
if (configFile.error){
    const message = ts.formatDiagnosticsWithColorAndContext([configFile.error],ts.createCompilerHost({}))
    console.error(message)
    process.exit(1)
}

//parse tsconfig file
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config,ts.sys,nodepath.dirname(configPath))

//create program/compiler
const program = ts.createProgram({
    rootNames:parsedConfig.fileNames,
    options:parsedConfig.options
})

//emit all compiled files
const emitResult = program.emit()

//print emit errors/warnings (type errors)
const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(allDiagnostics, ts.createCompilerHost(parsedConfig.options))
console.log(formattedDiagnostics)

//run with code
if (emitResult.emitSkipped){
    console.log("OT: Compilation Failed!")
    process.exit(1)
}else{
    console.log("OT: Compilation Succeeded!")
    if (process.argv.includes("-%-compile")) process.exit(0) //exit when only compile is required!
    
    //START THE BOT
    console.log("OT: Starting Bot!")
    require("./dist/src/index.js")
}