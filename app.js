const express = require('express');
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to Backend-internship-plan...", time:new Date().toLocaleTimeString()});
})

app.get('/error-test', (req, res, next) => {
    const err = new Error("Something went wrong!");
    err.status = 404;
    next(err);  
});

const errorHandler = require('./src/middleware/errorHandler');

app.use(errorHandler);
const {port} = require('./env');
app.listen(port, ()=>{
    console.log(`Server is live on ${port}`);
})