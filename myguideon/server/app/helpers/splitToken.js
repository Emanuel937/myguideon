/**
 * Extracts the JWT token from the request headers
 * @param {object} req - Express request object
 * @returns {string|null} - Extracted token or null if not found
 */
function extractToken(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');

    // Ensure the token follows the "Bearer <token>" format
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
    }

    return null;
}

module.exports = { extractToken };