const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizConfirmation, 
  updateQuizStatus, 
  deleteQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz
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

// Get all quizzes with details
router.get('/', authenticateToken, requireAdmin, getAllQuizzes);

// Get quiz by id with details
router.get('/:quizId', authenticateToken, requireAdmin, getQuizById);

// Update quiz by id
router.put('/:quizId', authenticateToken, requireAdmin, updateQuiz);

module.exports = router;
