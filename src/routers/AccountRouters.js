const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { jwtToken, jwtAuthMiddleware, isAdmin } = require('../middleware/Jwt');
const passport = require('../middleware/Auth');
router.use(passport.initialize());
const LocalAuthMiddleware = passport.authenticate('local', {session: false});

router.post('/register', async(req, res, next) => {
    try{
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        if(response) {
            const payload = {
                id : newUser._id,
                username : newUser.username,
                role : newUser.role
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

router.post('/login',LocalAuthMiddleware ,async(req, res) => {
    const {username} = req.body;
    const UserDetails = User.findOne({username});
    const payload = {
        id: UserDetails._id,
        username: username,
        role: UserDetails.role
    }
    const token = jwtToken(payload);
    res.status(200).json({success: true, message: 'Welcome User', token: token});
} )

router.get('/profile', jwtAuthMiddleware, async(req, res, next) => {
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

router.get('/admin/users', jwtAuthMiddleware, isAdmin, async(req, res, next)=> {
    try{
        const response = await User.find().select("username email role");
        res.status(200).json(response);
    } catch(err) {
        next(err);
    }
})

module.exports = router;