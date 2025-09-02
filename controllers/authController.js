const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/tokenUtils');
const { generateRandomToken } = require('../utils/cryptoUtils');
const { sendConfirmationEmail } = require('../services/emailService');

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password (no need to hash here as the model hook will do it)
    // const saltRounds = 12;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email confirmation token
    const verificationToken = generateRandomToken();

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Just set the plain password, the model hook will hash it
      verificationToken,
      isEmailVerified: false
    });

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail registration if email sending fails
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to confirm your account.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last login - using try/catch to prevent failure if this fails
    try {
      await user.updateLastLogin();
    } catch (loginUpdateError) {
      console.error('Failed to update last login time:', loginUpdateError);
      // Don't fail login if updating last login fails
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};

// Confirm Email
const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this confirmation token
    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid confirmation token'
      });
    }

    // Update user as confirmed
    await user.update({
      isEmailVerified: true,
      verifiedAt: new Date(),
      verificationToken: null
    });

    res.status(200).json({
      message: 'Email confirmed successfully! You can now use all features of the app.'
    });

  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({
      error: 'Email confirmation failed',
      message: error.message
    });
  }
};

// Resend Confirmation Email
const resendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        error: 'Email is already confirmed'
      });
    }

    // Generate new confirmation token
    const verificationToken = generateRandomToken();

    await user.update({
      verificationToken
    });

    // Send confirmation email
    await sendConfirmationEmail(email, verificationToken);

    res.status(200).json({
      message: 'Confirmation email sent successfully'
    });

  } catch (error) {
    console.error('Resend confirmation error:', error);
    res.status(500).json({
      error: 'Failed to resend confirmation email',
      message: error.message
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['passwordHash', 'verificationToken'] }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      message: error.message
    });
  }
};

// Logout User (if using token blacklisting)
const logoutUser = async (req, res) => {
  try {
    // For now, just send success response
    // In a production app, you might want to implement token blacklisting
    res.status(200).json({
      message: 'User logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  confirmEmail,
  resendConfirmationEmail,
  getUserProfile,
  logoutUser
};
