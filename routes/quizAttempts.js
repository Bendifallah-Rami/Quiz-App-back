const express = require('express');
const router = express.Router();
const quizAttemptController = require('../controllers/quizAttemptController');
const { authenticateToken } = require('../middleware/auth');

// Create a quiz attempt
router.post('/', authenticateToken, quizAttemptController.createQuizAttempt);

// Get all attempts for a quiz
router.get('/quiz/:quizId', authenticateToken, quizAttemptController.getAttemptsByQuiz);

// Get all attempts for a user
router.get('/user/:userId', authenticateToken, quizAttemptController.getAttemptsByUser);

// Get attempt details
router.get('/:id', authenticateToken, quizAttemptController.getAttemptById);

module.exports = router;
