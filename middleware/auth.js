// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }

  // TODO: Implement JWT verification
  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({
  //       error: 'Invalid token',
  //       message: 'Token verification failed'
  //     });
  //   }
  //   req.user = user;
  //   next();
  // });

  // Temporary placeholder - remove when implementing JWT
  req.user = { id: 1, email: 'user@example.com', role: 'user' };
  next();
};

// Authorization middleware for admin routes
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }

  next();
};

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = parseInt(req.params.id);
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (currentUserId === resourceUserId || isAdmin) {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied',
      message: 'You can only access your own resources'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin
};
