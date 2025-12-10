const User = require('../models/User');

const isVendor = async(req, res, next)=>{
    try{
        const role = req.user.role;
        if(role !== 'vendor') {
            return res.status(401).json({
                success: false,
                message: "Access denied, only vendors are allowed"});
        } 
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = isVendor;