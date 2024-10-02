const fs = require("fs")
const ts = require("typescript")
const nodepath = require('path')

/////////////// STARTUP FLAGS ///////////////
const flags = [
    //add startup flags here (e.g. "--no-compile")
]
process.argv.push(...flags)
/////////////// STARTUP FLAGS ///////////////

if (!process.argv.includes("--no-compile")){
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

    if (emitResult.emitSkipped || allDiagnostics.find((d) => d.category == ts.DiagnosticCategory.Error || d.category == ts.DiagnosticCategory.Warning)){
        console.log("OT: Compilation Failed!")
        process.exit(1)
    }
}

//START BOT
console.log("OT: Compilation Succeeded!")
if (process.argv.includes("--compile-only")) process.exit(0) //exit when only compile is required!
console.log("OT: Starting Bot!")
require("./dist/src/index.js")