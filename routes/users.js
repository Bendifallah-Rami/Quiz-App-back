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

module.exports = router;
