const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { jwtToken, jwtAuthMiddleware } = require('../middleware/Jwt');

router.post('/register', async(req, res, next) => {
    try{
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        if(response) {
            const payload = {
                id : newUser.id,
                username : newUser.username
            }

            const token = jwtToken(payload);

            return res.status(200).json({
                sucess: true,
                UserDetails: {
                    username: newUser.username,
                    email: newUser.email,
                    token: token
                }
            });
        }
        res.status(500).json({message: "Internal server error"});
    }catch(err) {
        next(err);
    }
})

router.post('/profile', jwtAuthMiddleware, async(req, res, next) => {
    try{
        const response = req.user;
        if(!response) return res.status(400).json({message: "Unauthorized"});

        const username = response.username;
        const findData = await User.findOne({username});

        const data = {
            username: findData.username,
            email: findData.email
        }
        res.status(200).json(data);
    } catch(err) {
        next(err);
    }
})

module.exports = router;