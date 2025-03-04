const argon2 = require('argon2');

/**
 * Hash a password using Argon2 with secure options
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
async function hashPassword(password) {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id, 
            memoryCost: 2 ** 16, 
            timeCost: 3,
            parallelism: 1
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}

/**
 * Verify a password against a hash
 * @param {string} hash - The hashed password
 * @param {string} password - The plain text password
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
async function verifyPassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}

module.exports = { hashPassword, verifyPassword };
