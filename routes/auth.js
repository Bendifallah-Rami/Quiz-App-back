const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { 
  registerUser, 
  loginUser, 
  confirmEmail, 
  resendConfirmationEmail, 
  getUserProfile, 
  logoutUser,
  googleCallback,
  registerAdmin
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/confirm-email/:token
router.get('/confirm-email/:token', confirmEmail);

// POST /api/auth/resend-confirmation
router.post('/resend-confirmation', resendConfirmationEmail);

// POST /api/auth/logout
router.post('/logout', authenticateToken, logoutUser);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getUserProfile);

// Google OAuth Routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    prompt: 'select_account'
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false
  }),
  googleCallback
); 

// POST /api/auth/register-admin
router.post('/register-admin', registerAdmin);

module.exports = router;
