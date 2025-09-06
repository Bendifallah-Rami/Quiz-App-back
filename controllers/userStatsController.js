const { UserStats } = require('../models');

// Get stats for a user
exports.getUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ where: { userId: req.params.userId } });
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update stats for a user
exports.updateUserStats = async (req, res) => {
  try {
    const stats = await UserStats.findOne({ where: { userId: req.params.userId } });
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    await stats.update(req.body);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create stats for a user (if needed)
exports.createUserStats = async (req, res) => {
  try {
    const { userId, quizzesTaken, quizzesPassed, totalScore } = req.body;
    const stats = await UserStats.create({ userId, quizzesTaken, quizzesPassed, totalScore });
    res.status(201).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
