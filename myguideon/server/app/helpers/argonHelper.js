const argon2 = require('argon2');

/**
 * Hash a password using Argon2
 * @param {string} password -    The plain text password
 * @returns {Promise<string>} -  The hashed password
 */
async function hashPassword(password) {
    return await argon2.hash(password);
}

/**
 * Verify a password against a hash
 * @param {string} hash - The hashed password
 * @param {string} password - The plain text password
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
async function verifyPassword(hash, password) {
    return await argon2.verify(hash, password);
}


module.exports = { hashPassword, verifyPassword };
