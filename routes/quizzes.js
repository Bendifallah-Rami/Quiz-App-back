const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizConfirmation, 
  updateQuizStatus, 
  deleteQuiz 
} = require('../controllers/quizController');
const { addQuestionToQuiz } = require('../controllers/questionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Step 1: Create quiz
router.post('/', authenticateToken, requireAdmin, createQuiz);

// Step 2: Add question to quiz
router.post('/:quizId/questions', authenticateToken, requireAdmin, addQuestionToQuiz);

// Step 3: Confirmation & Final Actions
router.get('/:quizId/confirmation', authenticateToken, requireAdmin, getQuizConfirmation);
router.patch('/:quizId/status', authenticateToken, requireAdmin, updateQuizStatus);
router.delete('/:quizId', authenticateToken, requireAdmin, deleteQuiz);

module.exports = router;
