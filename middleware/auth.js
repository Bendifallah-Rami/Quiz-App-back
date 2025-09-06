const { verifyToken } = require('../utils/tokenUtils');


// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token =  req.cookies['token'];
  // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
  
  // Set userId from the token
  req.userId = decoded.userId;
  next();
};

// Authorization middleware for admin routes
const { User } = require('../models');

const requireAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  try {
    // Get the user from database
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The authenticated user no longer exists'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }
    
    // Add user to request for potential use in controllers
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({
      error: 'Authorization failed',
      message: error.message
    });
  }
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    const resourceUserId = parseInt(req.params.userId);
    
    if (!req.userId) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }
    
    // Get the current user
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The authenticated user no longer exists'
      });
    }
    
    const isAdmin = user.role === 'admin';
    
    if (req.userId === resourceUserId || isAdmin) {
      // Add user to request for potential use in controllers
      req.user = user;
      next();
    } else {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own resources'
      });
    }
  } catch (error) {
    console.error('Ownership authorization error:', error);
    return res.status(500).json({
      error: 'Authorization failed',
      message: error.message
    });
  }
};

// Authorization middleware for teacher routes
const requireTeacher = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The authenticated user no longer exists'
      });
    }
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Teacher privileges required'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Teacher authorization error:', error);
    return res.status(500).json({
      error: 'Authorization failed',
      message: error.message
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
  requireTeacher
};
