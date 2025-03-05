const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET || 'supersecretkey';



if (!SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

/**
 * Generate a JWT token for authentication
 * @param {object} payload - The payload to encode
 * @returns {string} - The generated token
 */
function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The token to verify
 * @returns {object|null} - Decoded payload or null if invalid
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        console.error('JWT verification error:', error.message);
        return null;
    }
}

module.exports = { generateToken, verifyToken };
