const express = require('express');
const router = express.Router();
const { authenticateToken, requireTeacher, requireAdmin } = require('../middleware/auth');
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

// Teacher & Admin: Create quiz
router.post('/', authenticateToken, requireTeacher, createQuiz);

// Teacher & Admin: Add question to quiz
router.post('/:quizId/questions', authenticateToken, requireTeacher, addQuestionToQuiz);

// Teacher & Admin: Get quiz confirmation
router.get('/:quizId/confirmation', authenticateToken, requireTeacher, getQuizConfirmation);

// Teacher & Admin: Update quiz status
router.patch('/:quizId/status', authenticateToken, requireTeacher, updateQuizStatus);

// Teacher & Admin: Delete draft quiz
router.delete('/:quizId', authenticateToken, requireTeacher, deleteQuiz);

// Admin only: Get all quizzes
router.get('/', authenticateToken, requireAdmin, getAllQuizzes);

// Admin only: Get quiz by id
router.get('/:quizId', authenticateToken, requireAdmin, getQuizById);

// Admin only: Update quiz by id
router.put('/:quizId', authenticateToken, requireAdmin, updateQuiz);

module.exports = router;
