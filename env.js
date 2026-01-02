require('dotenv').config();

const config = {
    port : process.env.PORT || 4000,
    jwt_token_key : process.env.JWT_TOKEN_KEY,
    mongoUrl : process.env.MONGOURL,
    jwt_refresh_key : process.env.JWT_REFRESH_KEY,
    pass : process.env.PASS,
    user : process.env.USER
}

module.exports = config;