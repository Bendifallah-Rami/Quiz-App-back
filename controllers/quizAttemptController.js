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
