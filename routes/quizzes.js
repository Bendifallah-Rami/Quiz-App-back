const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
} = require('../controllers/quizController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/quizzes - Get all quizzes
router.get('/', getAllQuizzes);

// GET /api/quizzes/:id - Get specific quiz
router.get('/:id', getQuizById);

// POST /api/quizzes - Create new quiz (admin only)
router.post('/', authenticateToken, requireAdmin, createQuiz);

// PUT /api/quizzes/:id - Update quiz (admin only)
router.put('/:id', authenticateToken, requireAdmin, updateQuiz);

// DELETE /api/quizzes/:id - Delete quiz (admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteQuiz);

// POST /api/quizzes/:id/submit - Submit quiz answers
router.post('/:id/submit', authenticateToken, submitQuiz);

module.exports = router;
