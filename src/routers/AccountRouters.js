const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { jwtToken, jwtAuthMiddleware, isAdmin, refreshToken, accessToken, decodeToken } = require('../middleware/Jwt');
const passport = require('../middleware/Auth');
const { getAllProducts, 
        getProduct, 
        createProduct, 
        updateProduct, 
        deleteProduct} = require('../controller/productController');

router.use(passport.initialize());
const LocalAuthMiddleware = passport.authenticate('local', {session: false});
const multer = require('multer');
const isVendor = require('../middleware/isVendor');
const generateOTP = require('../function/OTPgenerator');
const SendEmail = require('../email/OTPSender');
const passwordResetOTP = require('../email/passwordResetOTP');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only images allowed"), false);
    },
    limits: {fileSize: 1024 * 1024}
})

// sign in/up

router.post('/register', async(req, res, next) => {
    try{
        const data = req.body;
        const otp = generateOTP();
        const newData = {
            ...data,
            otp: otp,
            otpexpiry: Date.now() + 2 * 60 * 1000
        }
        const newUser = new User(newData);
        const response = await newUser.save();
        await SendEmail(data.email, otp);
        if(response) {
            return res.status(200).json({
                sucess: true,
                message: "Otp has been send"
            });
        }
        res.status(500).json({message: "Internal server error"});
    }catch(err) {
        next(err);
    }
})

router.post('/verify-email', async(req, res, next) => {
    try{
        const {email, otp} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json('No User Found');
        
        if(user.otp !== otp || user.otpexpiry < Date.now()) {
            return res.status(400).json('otp is Invalid or expired');
        }
        user.emailverified = true;
        user.otp = undefined;
        user.otpexpiry = undefined;
        await user.save();

        res.json({ message: "Email verified successfully" });
    } catch(err) {
        next(err);
    }
})

router.post('/login',LocalAuthMiddleware ,async(req, res) => {
    const {username} = req.body;
    const UserDetails = await User.findOne({username});
    const payload = {
        _id: UserDetails._id,
        username: username,
        role: UserDetails.role
    }
    const refreshtoken = refreshToken(payload);
    const accesstoken = accessToken(payload);
    await User.findOneAndUpdate({username}, {refreshtoken: refreshtoken}); 
    res.status(200).json({
        success: true, 
        message: 'Welcome User', 
        refreshtoken: refreshtoken,
        accesstoken: accesstoken});
         
})

router.post('/refresh', async(req, res, next) => {
    try{
        const {refreshtoken} = req.body;
        if(!refreshtoken) return res.status(400).json('No Token Found...');
        const user = await User.findOne({refreshtoken});
        if(!user) return res.status(400).json('Token in Invalid..');

        const decode = decodeToken(refreshtoken);
        
        const newAccessToken = accessToken({
            _id: user._id,
            username: user.username,
            role: user.role
        })

        res.status(200).json({
            success: true,
            accesstoken: newAccessToken
        })

    } catch(err) {
        next(err);
    }
})

router.post('/logout', jwtAuthMiddleware, async(req, res, next)=> {
    try{
        const _id = req.user._id;
        const response = await User.findByIdAndUpdate({_id}, {refreshtoken: null});
        res.status(200).json({
            success: true,
            message: "successfully logout.."
        })
    } catch(err) {
        next(err);
    }
})

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

// RBAC

router.get('/admin/users', jwtAuthMiddleware, isAdmin, async(req, res, next)=> {
    try{
        console.log(req.query); 
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 3;
        let skip = (page-1) * limit;  

        const response = await User.find()
        .skip(skip)
        .limit(limit)
        .select("username email role");

        res.status(200).json({response,nbHits: response.length});
    } catch(err) {
        next(err);
    }
})

// users CRUD

router.get('/users/me', jwtAuthMiddleware, async(req, res, next) =>{
    try{
        const {username} = req.user;
        const data = await User.find({username}).select("-password");
        return res.status(200).json(data); 
    } catch(err) {
        next(err);
    }
})

router.put('/users/update', jwtAuthMiddleware, async(req, res, next)=> {
    try{
        const {username} = req.user;
        const data = req.body;
        const payload = {
            id: response._id,
            username: username,
            role: response.role
        }
        const token = jwtToken(payload);
        const response = await User.findOneAndUpdate({username}, data, {new: true});
        if(response) return res.status(200).json({response, token});
        res.status(400).json("Internal server error");
    } catch(err) {
        next(err);
    }
})

router.delete('/users/delete', jwtAuthMiddleware, async(req, res, next)=> {
    try{
        const {username} = req.user;
        const response = await User.findOneAndDelete({username});
        if(response) return res.status(200).json({message: "I loved our time together... :( sayonara ⛩️"});
        res.status(400).json("Internal server error");
    } catch(err) {
        next(err);
    }
})

// product management

router.get('/products/all', getAllProducts);
router.get('/product/:id', getProduct);

router.post('/product/create', upload.single('image'),jwtAuthMiddleware, isVendor, createProduct);
router.put('/product/update/:id', jwtAuthMiddleware, isVendor, updateProduct);
router.delete('/product/delete/:id', jwtAuthMiddleware, isVendor, deleteProduct);

router.get('/reset/request', jwtAuthMiddleware, async(req, res, next)=> {
    try{
        const {username} = req.user;
        const userInfo = await User.findOne({username});
        if(!userInfo.emailverified) {
            return res.status(200).json({success: false, message: "Please verify your email first"});
        }

        const otp = generateOTP();
        userInfo.otp = otp;
        userInfo.otpexpiry = Date.now() + 2*60*1000;
        await userInfo.save();

        passwordResetOTP(userInfo.email, otp);
        res.json({message: 'OTP send to your email'})

    }catch(err) {
        next(err);
    }
})

router.post('/reset/password', async(req, res, next) => {
    try{
        const {email, otp, newPassword} = req.body;
        const userInfo = await User.findOne({email});

        if(otp !== userInfo.otp || userInfo.otpexpiry < Date.now()) {
            return res.status(401).json({success: false, message: 'OTP invalid or expired'})
        }

        userInfo.password = newPassword;
        userInfo.otp = null;
        userInfo.otpexpiry = null;

        await userInfo.save();
        res.json({ message: "Password reset successfully" });
    } catch(err) {
        console.log(err);
        next(err);
    }
})

module.exports = router;