const jwt = require('jsonwebtoken');
const {jwt_token_key} = require('../../env');

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({message: "Unauthorized"});
    }
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(400).json({message: "No token found"});
    try{
        const decode = jwt.verify(token, jwt_token_key);
        req.user = decode;
        next();
    } catch(err) {
        throw new Error(err);
    }
};

const jwtToken = (payload) => {
    const token = jwt.sign(payload, jwt_token_key);
    return token;
}

module.exports = {jwtToken, jwtAuthMiddleware};
