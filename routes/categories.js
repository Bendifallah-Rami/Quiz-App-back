const express = require('express');
const router = express.Router();
const { 
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryById
} = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/:id - Get specific category with assoiated quiz
router.get('/quiz/:id', getCategoryById);

//get by id categorie
router.get('/:id', CategoryById);

// Admin only routes (require authentication and admin role)
// POST /api/categories - Create new category
router.post('/', authenticateToken, requireAdmin, createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', authenticateToken, requireAdmin, updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
