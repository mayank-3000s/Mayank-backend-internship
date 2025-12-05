const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async(req, res, next) => {
    try{
        const data = req.body;
        const newUser = User(data);
        const response = await newUser.save();
        if(response) {
            return res.status(200).json({
                sucess: true,
                UserDetails: {
                    username: newUser.username,
                    email: newUser.email
                }
            });
        }
        res.status(500).json({message: "Internal server error"});
    }catch(err) {
        next(err);
    }
})


const errorHandler = require('../middleware/errorHandler');
router.use(errorHandler);

module.exports = router;