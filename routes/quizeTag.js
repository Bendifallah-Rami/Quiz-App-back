const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const quizTagController = require('../controllers/quizTagController');

// Create a QuizTag
router.post('/', authenticateToken, requireAdmin, quizTagController.createQuizTag);

// Get all QuizTags
router.get('/', authenticateToken, requireAdmin, quizTagController.getAllQuizTags);

// Get a QuizTag by id
router.get('/:id', authenticateToken, requireAdmin, quizTagController.getQuizTagById);

// Update a QuizTag by id
router.put('/:id', authenticateToken, requireAdmin, quizTagController.updateQuizTag);

// Delete a QuizTag by id
router.delete('/:id', authenticateToken, requireAdmin, quizTagController.deleteQuizTag);

module.exports = router;
