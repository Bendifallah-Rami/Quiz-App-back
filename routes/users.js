const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//simple get all users route
router.get('/', userController.getAllUsers);

//add the get with id
router.get('/:id', userController.getUserById); 

// PUT /api/users/:id - Update a user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
