const { Quiz, Question } = require('../models');

// Step 1: Create quiz
const createQuiz = async (req, res) => {
  try {
    const { title, description, difficulty, passingScore ,categoryId} = req.body;
    // console.log(`This is the user id: ${req.user.id}`);
    const quiz = await Quiz.create({
      title,
      description,
      difficulty,
      passingScore,
      categoryId,
      status: 'draft',
      createdBy: 11 // assuming req.user is set by auth middleware
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 3a: Get quiz details for confirmation
const getQuizConfirmation = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId, {
      include: [Question]
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 3b: Update quiz status (draft/publish)
const updateQuizStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    quiz.status = status;
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 3c: Delete quiz (cancel process)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft quizzes can be deleted' });
    }
    await Question.destroy({ where: { quizId: quiz.id } });
    await quiz.destroy();
    res.json({ message: 'Quiz and its questions deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createQuiz,
  getQuizConfirmation,
  updateQuizStatus,
  deleteQuiz
};
