const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
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
};

exports.getUserById = async (req, res) => {
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
};

exports.updateUser = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
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
};
