const { verifyToken } = require('../helpers/jwtHelper');

/**
 * Middleware to check authentication
 */

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });
    
    req.user = decoded;
    next();
}

module.exports = authMiddleware;
