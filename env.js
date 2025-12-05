require('dotenv').config();
// const port = process.env.PORT || 3000;

const config = {
    port : process.env.PORT || 4000,
    jwt_token_key : process.env.JWT_TOKEN_KEY
}

module.exports = config;