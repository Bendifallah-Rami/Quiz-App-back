const crypto = require('crypto');

/**
 * Generates a random token for email verification or password reset
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {string} Hex-encoded random token
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Generates a token with expiration date
 * @param {number} expiryHours - Hours until token expires (default: 24)
 * @returns {object} Object containing token and expiry date
 */
const generateTokenWithExpiry = (expiryHours = 24) => {
  const token = generateRandomToken();
  const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
  
  return {
    token,
    expiryDate
  };
};

/**
 * Checks if a token has expired
 * @param {Date} expiryDate - Token expiration date
 * @returns {boolean} True if token has expired, false otherwise
 */
const isTokenExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  generateRandomToken,
  generateTokenWithExpiry,
  isTokenExpired
};
