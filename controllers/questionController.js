const { Question, Quiz, Option } = require('../models');

// Step 2: Add question to quiz (with options)
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.status !== 'draft') {
      return res.status(400).json({ error: 'Can only add questions to draft quizzes' });
    }
    const { text, type, options, points, explanation } = req.body;
    // Create the question
    const question = await Question.create({
      quizId: quiz.id,
      text,
      type,
      points,
      explanation
    });
    // Add options
    let createdOptions = [];
    if (type === 'true-false') {
      // Default options for true/false
      createdOptions.push(await Option.create({ questionId: question.id, text: 'True', isCorrect: !!(options && options[0] && options[0].isCorrect) }));
      createdOptions.push(await Option.create({ questionId: question.id, text: 'False', isCorrect: !!(options && options[1] && options[1].isCorrect) }));
    } else if (Array.isArray(options) && options.length > 0) {
      for (const opt of options) {
        const option = await Option.create({
          questionId: question.id,
          text: opt.text,
          isCorrect: !!opt.isCorrect
        });
        createdOptions.push(option);
      }
    }
    // Return question with its options
    const result = question.toJSON();
    result.options = createdOptions.map(o => o.toJSON());
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
