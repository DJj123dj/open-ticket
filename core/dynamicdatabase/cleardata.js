const fs = require('fs')

const dataPaths = ["./storage/tickets","./storage/transcripts","./storage/userTickets"]

var index = 0

dataPaths.forEach((path) => {
    try {
    fs.rmdirSync(path,{recursive:true,force:true})
    }catch{
        console.log(path,"doesn't exist")
    }
    setTimeout(() => {
        try{
        fs.mkdirSync(path)
        }catch{
            console.log(path,"already exists")
        }
        index++
    },500)
})

setInterval(() => {
    if (index >= 3){
        console.log("All local data is cleared!")
        process.exit(1)
    }
},500)