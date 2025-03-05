const {verifyToken} = require('../helpers/jwtHelper');

function adminMiddleware(req,res,next) {
    if (req.user.role_id !== 1) {
        return res.status(403).json({error: 'Forbidden'})
    }
    next();
}

module.exports = adminMiddleware;