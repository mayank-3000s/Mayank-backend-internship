const mongoose = require('mongoose');
const mongoUrl = "mongodb://127.0.0.1:27017/UserRegister";

mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("database is connected");
})

db.on('disconnected', ()=>{
    console.log("database is disconnected");
})

db.on('error', ()=>{
    console.log("Internal server error");
})

module.exports = db ;