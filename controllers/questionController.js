const { Question, Quiz } = require('../models');

// Step 2: Add question to quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.status !== 'draft') {
      return res.status(400).json({ error: 'Can only add questions to draft quizzes' });
    }
    const { text, type, options, answer, points, explanation } = req.body;
    const question = await Question.create({
      quizId: quiz.id,
      text,
      type,
      options,
      answer,
      points,
      explanation
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
