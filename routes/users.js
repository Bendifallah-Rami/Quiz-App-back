const express = require('express');
const router = express.Router();
const User = require('../models/User');

//simple get all users route
router.get('/', async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.status(200).json({
      message: 'Get all users',
      data: allUsers
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get users",
      error: err.message
    });
  }
});

//add the get with id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(200).json({
      message: 'Get user by ID',
      data: user
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get user",
      error: err.message
    });
  }
}); 

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create user",
      error: err.message
    });
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update user",
      error: err.message
    });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    res.status(204).json({
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete user",
      error: err.message
    });
  }
});

module.exports = router;
