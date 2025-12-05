const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy ;
const User = require('../models/User');

passport.use(new LocalStrategy(async(username, password, done)=>{
    try{
        const UserExists = await User.findOne({username});
        if(!UserExists) {
            return done(null, false, {message: "User not found"})
        }
        const access = UserExists.comparePassword(password);
        if(access) return done(null, UserExists)
        return done(null, false, {message: "password not matched"});
    } catch(err) {
        return done(err);
    }
}));

module.exports = passport;