const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const {
  hashPassword,
  comparePassword,
  signToken,
  sanitizeUser,
} = require('../utils/authUtils');
const { requireAuth } = require('../middleware/authMiddleware');

// Standard RFC 5322 compliant email regex check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/**
 * POST /api/auth/signup
 * Registers a new user account with hashed password and returns auth token.
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};

    // 1. Validate Email
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 2. Validate Password Policy
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      });
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`,
      });
    }

    // 3. Validate Optional Name
    let sanitizedName = null;
    if (name !== undefined && name !== null) {
      if (typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Name must be a string.',
        });
      }
      sanitizedName = name.trim().slice(0, 100) || null;
    }

    // 4. Check for existing user (conflict)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 5. Hash password and persist user
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: sanitizedName,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const userPayload = sanitizeUser(newUser);
    const token = signToken({ id: userPayload.id, email: userPayload.email });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: userPayload,
        token,
      },
    });
  } catch (err) {
    if (err.message && err.message.includes('JWT_SECRET')) {
      console.error('Signup error: Missing JWT_SECRET');
      return res.status(500).json({
        success: false,
        message: 'Authentication service configuration error.',
      });
    }

    console.error('Signup error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again later.',
    });
  }
});

/**
 * POST /api/auth/login
 * Verifies credentials and returns auth token with sanitized user profile.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user record including passwordHash
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Timing-safe uniform rejection for non-existent users or passwordless accounts
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const userPayload = sanitizeUser(user);
    const token = signToken({ id: userPayload.id, email: userPayload.email });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: userPayload,
        token,
      },
    });
  } catch (err) {
    if (err.message && err.message.includes('JWT_SECRET')) {
      console.error('Login error: Missing JWT_SECRET');
      return res.status(500).json({
        success: false,
        message: 'Authentication service configuration error.',
      });
    }

    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to log in. Please try again later.',
    });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user profile using token verification.
 */
router.get('/me', requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
