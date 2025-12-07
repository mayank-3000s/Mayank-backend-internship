const mongoose = require('mongoose');
const {mongoUrl} = require('./env') ;

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