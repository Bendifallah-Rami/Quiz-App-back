const express = require('express');
const router = express.Router();
const optionController = require('../controllers/optionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Create an option
router.post('/', authenticateToken, requireAdmin, optionController.createOption);

// Get all options for a question
router.get('/question/:questionId', authenticateToken, requireAdmin, optionController.getOptionsByQuestion);

// Get option by id
router.get('/:id', authenticateToken, requireAdmin, optionController.getOptionById);

// Update option by id
router.put('/:id', authenticateToken, requireAdmin, optionController.updateOption);

// Delete option by id
router.delete('/:id', authenticateToken, requireAdmin, optionController.deleteOption);

module.exports = router;
 