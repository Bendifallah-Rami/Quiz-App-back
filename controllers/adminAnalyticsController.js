const { UserStats, User, Quiz, QuizAttempt } = require('../models');
const { Op } = require('sequelize');

exports.getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalQuizzes = await Quiz.count();
    const totalAttempts = await QuizAttempt.count();
    const avgScore = await UserStats.sum('totalScore') / (await UserStats.count());
    res.json({ totalUsers, totalQuizzes, totalAttempts, avgScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopStreaks = async (req, res) => {
  try {
    const topStreaks = await UserStats.findAll({
      order: [['longestStreak', 'DESC']],
      limit: 10,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(topStreaks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopScores = async (req, res) => {
  try {
    const topScores = await UserStats.findAll({
      order: [['totalScore', 'DESC']],
      limit: 10,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    res.json(topScores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizPassRates = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    const rates = [];
    for (const quiz of quizzes) {
      const attempts = await QuizAttempt.count({ where: { quizId: quiz.id } });
      const passed = await QuizAttempt.count({ where: { quizId: quiz.id, score: { [Op.gte]: quiz.passingScore } } });
      rates.push({ quizId: quiz.id, title: quiz.title, passRate: attempts ? (passed / attempts) * 100 : 0 });
    }
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDailyActivity = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const activity = await QuizAttempt.findAll({
      attributes: ['createdAt'],
      where: {
        createdAt: {
          [Op.between]: [sevenDaysAgo, today]
        }
      }
    });
    // Aggregate by day
    const daily = {};
    for (const a of activity) {
      const day = a.createdAt.toISOString().slice(0, 10);
      daily[day] = (daily[day] || 0) + 1;
    }
    res.json(daily);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
