import express from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /auth/login
 * Login with email and password
 * Body: { email, password }
 * Returns: { token, refreshToken, user }
 */
router.post('/login', authController.login.bind(authController));

/**
 * POST /auth/signup
 * Register a new user
 * Body: { email, password, confirmPassword, fullName? }
 * Returns: { user }
 */
router.post('/signup', authController.signup.bind(authController));

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken }
 * Returns: { token, refreshToken, user }
 */
router.post('/refresh', authController.refreshToken.bind(authController));

/**
 * POST /auth/logout
 * Logout user (requires authentication)
 * Returns: { success: true }
 */
router.post('/logout', authMiddleware, authController.logout.bind(authController));

/**
 * GET /auth/me
 * Get current user info (requires authentication)
 * Returns: { id, email, user_metadata }
 */
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

export default router;
