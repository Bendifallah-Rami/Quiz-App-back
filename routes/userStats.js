const express = require('express');
const router = express.Router();
const userStatsController = require('../controllers/userStatsController');
const { authenticateToken } = require('../middleware/auth');

// Get stats for a user
router.get('/:userId', authenticateToken, userStatsController.getUserStats);

// Update stats for a user
router.put('/:userId', authenticateToken, userStatsController.updateUserStats);

// Create stats for a user
router.post('/', authenticateToken, userStatsController.createUserStats);

module.exports = router;
