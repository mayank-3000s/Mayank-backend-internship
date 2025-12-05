const express = require('express');
const db = require('./db');
const User = require('./src/models/User');
const passport = require('./src/middleware/Auth');
const acc_router = require('./src/routers/AccountRouters');

const app = express();
app.use(express.json());

app.use(passport.initialize());

const LocalAuthMiddleware = passport.authenticate('local', {session : false});

app.get('/', LocalAuthMiddleware,(req, res) => {
    res.status(200).json({
        message: "Welcome to Backend-internship-plan...", 
        time:new Date().toLocaleTimeString()
    });
})

app.use('/account', acc_router);

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