const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a user
 * @param {number} userId - User ID to encode in the token
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */
const generateToken = (userId, expiresIn = '24h') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn
  });
};

/**
 * Verifies a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
