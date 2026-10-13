const { verifyToken, sanitizeUser } = require('../utils/authUtils');
const prisma = require('../lib/prisma');

/**
 * Authentication middleware that requires a valid Bearer JWT.
 * Validates token, looks up the corresponding active user, and attaches
 * the sanitized user object to req.user.
 * Fails safely with generic 401 Unauthorized messages without exposing internal errors.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No authorization header provided.',
    });
  }

  const parts = authHeader.trim().split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Format must be "Bearer <token>".',
    });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or malformed authentication token.',
      });
    }

    // Verify user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or has been deactivated.',
      });
    }

    req.user = sanitizeUser(user);
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }

    // Handle configuration errors (e.g. missing JWT_SECRET) safely
    if (err.message && err.message.includes('JWT_SECRET')) {
      console.error('Auth configuration error:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Server authentication service is temporarily unavailable.',
      });
    }

    console.error('requireAuth unexpected error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
}

module.exports = {
  requireAuth,
};
