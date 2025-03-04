const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

/**
 * Generate a JWT token
 * @param   {object} payload - The payload to encode
 * @returns {string} - The generated token
 */
function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
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
        console.error('JWT verification error:', error.message);
        return null;
    }
}

/**
 * Decode a JWT token without verifying its signature
 * @param   {string} token - The token to decode
 * @returns {object|null} - Decoded payload or null if invalid
 */
function decodeJWT(token) {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('JWT decoding error:', error.message);
        return null;
    }
}

module.exports = { generateToken, verifyToken, decodeJWT };
