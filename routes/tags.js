const express = require('express');
const router = express.Router();
const { 
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  TagById
} = require('../controllers/tagController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
// GET /api/tags - Get all tags
router.get('/', getAllTags);

// GET /api/tags/quiz/:id - Get specific tag with quizzes
router.get('/quiz/:id', getTagById);

// GET /api/tags/:id - Get specific tag
router.get('/:id', TagById);

// Admin only routes (require authentication and admin role)
// POST /api/tags - Create new tag
router.post('/',  authenticateToken, requireAdmin, createTag);

// PUT /api/tags/:id - Update tag
router.put('/:id', authenticateToken, requireAdmin, updateTag);

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', authenticateToken, requireAdmin, deleteTag);

module.exports = router;

module.exports = router;
