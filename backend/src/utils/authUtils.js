const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;

/**
 * Validates and retrieves the JWT secret from environment variables.
 * Fails safely if the secret is missing without falling back to a hardcoded string.
 * @returns {string}
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    throw new Error('JWT_SECRET is not configured in the server environment.');
  }
  return secret.trim();
}

/**
 * Hashes a plaintext password using bcryptjs.
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a candidate plaintext password with a hashed password.
 * @param {string} candidatePassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
async function comparePassword(candidatePassword, hashedPassword) {
  if (!candidatePassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(candidatePassword, hashedPassword);
}

/**
 * Signs a JWT token containing user identity claims.
 * @param {Object} payload - User claims to embed (e.g., { id, email })
 * @param {string|number} [expiresIn='7d'] - Expiration duration
 * @returns {string} Signed JWT string
 */
function signToken(payload, expiresIn = '7d') {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verifies and decodes a JWT token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token - Bearer JWT string
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
}

/**
 * Sanitizes a user record to prevent exposing sensitive fields.
 * Returns only id, name, and email.
 * @param {Object} user
 * @returns {{ id: string, name: string|null, email: string }}
 */
function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || null,
    email: user.email,
  };
}

module.exports = {
  getJwtSecret,
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  sanitizeUser,
};
