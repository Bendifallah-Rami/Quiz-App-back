const express = require('express');
const router = express.Router();
const adminAnalyticsController = require('../controllers/adminAnalyticsController');
const { requireAdmin } = require('../middleware/auth');

// Get overall statistics
router.get('/overview', requireAdmin, adminAnalyticsController.getOverviewStats);

// Get top users by streak
router.get('/top-streaks', requireAdmin, adminAnalyticsController.getTopStreaks);

// Get top users by score
router.get('/top-scores', requireAdmin, adminAnalyticsController.getTopScores);

// Get quiz pass rates
router.get('/quiz-pass-rates', requireAdmin, adminAnalyticsController.getQuizPassRates);

// Get daily activity
router.get('/daily-activity', requireAdmin, adminAnalyticsController.getDailyActivity);

module.exports = router; 
