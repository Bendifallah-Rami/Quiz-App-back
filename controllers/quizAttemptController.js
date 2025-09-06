const { QuizAttempt, AttemptAnswer, Quiz, Question, Option } = require('../models');

// Create a quiz attempt
exports.createQuizAttempt = async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    // Create the attempt
    const attempt = await QuizAttempt.create({ userId, quizId });
    let totalScore = 0;
    // Save answers and calculate score
    for (const ans of answers) {
      const question = await Question.findByPk(ans.questionId);
      if (!question) continue;
      let isCorrect = false;
      if (question.type === 'short-answer') {
        isCorrect = ans.answer.trim().toLowerCase() === question.answer.trim().toLowerCase();
      } else {
        // For choice questions, check selected option(s)
        const correctOptions = await Option.findAll({ where: { questionId: question.id, isCorrect: true } });
        const correctIds = correctOptions.map(o => o.id).sort();
        const selectedIds = Array.isArray(ans.selectedOptionIds) ? ans.selectedOptionIds.sort() : [ans.selectedOptionIds].sort();
        isCorrect = JSON.stringify(correctIds) === JSON.stringify(selectedIds);
      }
      if (isCorrect) totalScore += question.points;
      await AttemptAnswer.create({
        quizAttemptId: attempt.id,
        questionId: question.id,
        selectedOptionIds: ans.selectedOptionIds,
        answer: ans.answer,
        isCorrect
      });
    }
    attempt.score = totalScore;
    await attempt.save();
    // Update UserStats streak logic
    const userStats = await require('../models').UserStats.findOne({ where: { userId } });
    const quiz = await Quiz.findByPk(quizId);
    const passed = totalScore >= quiz.passingScore;
    const today = new Date();
    let update = {};
    if (userStats) {
      // Calculate streak
      const lastDate = userStats.lastActivityDate ? new Date(userStats.lastActivityDate) : null;
      const isConsecutive = lastDate &&
        lastDate.getFullYear() === today.getFullYear() &&
        lastDate.getMonth() === today.getMonth() &&
        (today.getDate() - lastDate.getDate() === 1);
      if (passed) {
        update.quizzesPassed = userStats.quizzesPassed + 1;
        if (isConsecutive) {
          update.currentStreak = userStats.currentStreak + 1;
        } else {
          update.currentStreak = 1;
        }
        update.longestStreak = Math.max(userStats.longestStreak, update.currentStreak);
      } else {
        update.currentStreak = 0;
      }
      update.quizzesTaken = userStats.quizzesTaken + 1;
      update.totalScore = userStats.totalScore + totalScore;
      update.lastActivityDate = today;
      await userStats.update(update);
    } else {
      await require('../models').UserStats.create({
        userId,
        quizzesTaken: 1,
        quizzesPassed: passed ? 1 : 0,
        totalScore,
        currentStreak: passed ? 1 : 0,
        longestStreak: passed ? 1 : 0,
        lastActivityDate: today
      });
    }
    res.status(201).json({ attemptId: attempt.id, score: totalScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attempts for a quiz
exports.getAttemptsByQuiz = async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({ where: { quizId: req.params.quizId } });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attempts for a user
exports.getAttemptsByUser = async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({ where: { userId: req.params.userId } });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attempt details
exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.id, { include: [AttemptAnswer] });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
