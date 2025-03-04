const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'SuperSecretKey123';

/**
 * Generate a JWT token
 * @param   {object} payload - The payload to encode
 * @returns {string} - The generated token
 */

function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

/**
 * Verify a JWT token
 * @param   {string} token - The token to verify
 * @returns {object|null} - Decoded payload or null if invalid
 */

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };