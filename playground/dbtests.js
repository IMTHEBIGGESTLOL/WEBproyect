const mongoose = require("mongoose");

const dbURL =  "mongodb+srv://danyzapopan12:LDan200404@dasw.vruf9nc.mongodb.net/DBProyect?retryWrites=true&w=majority&appName=dasw"

mongoose.connect(dbURL,{
    useNewUrlParser: true
})
.then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log("Not connected to DB", error))