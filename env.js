require('dotenv').config();

const config = {
    port : process.env.PORT || 4000,
    jwt_token_key : process.env.JWT_TOKEN_KEY,
    mongoUrl : process.env.MONGOURL
}

module.exports = config;