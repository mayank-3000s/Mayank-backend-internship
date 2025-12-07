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

module.exports = {jwtToken, jwtAuthMiddleware, isAdmin};
