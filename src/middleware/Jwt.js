const jwt = require('jsonwebtoken');
const {jwt_token_key, jwt_refresh_key} = require('../../env');

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
        next(err);
    }
};

const isAdmin = (req, res, next) => {
    try{
        const role = req.user.role;
        if(role !== 'admin') {
            return res.status(401).json({message: 'Admins only'});
        }
        next();
    } catch(err) {
        next(err);
    }
}

const jwtToken = (payload) => {
    const token = jwt.sign(payload, jwt_token_key);
    return token;
}

const refreshToken = (payload) => {
    const token = jwt.sign(payload, jwt_refresh_key, {expiresIn: "15m"});
    return token;
}

const accessToken = (payload) => {
    const token = jwt.sign(payload, jwt_token_key, {expiresIn: "7d"});
    return token;
}

const decodeToken = (token) => {
    const decode = jwt.verify(token, jwt_refresh_key);
    return decode;
}

module.exports = {jwtToken, jwtAuthMiddleware, isAdmin, refreshToken, accessToken, decodeToken};
