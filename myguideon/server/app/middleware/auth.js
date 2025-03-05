const { verifyToken }  = require('../helpers/jwtHelper');
const { extractToken } = require('../helpers/splitToken'); // Adjust path as needed

/**
 * Middleware to check authentication
 */
function authMiddleware(req, res, next) {
    const token = extractToken(req);
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied: No token provided or invalid format' });
    }
    
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware;