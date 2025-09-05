const { Quiz, Question, User, Category, Tag, QuizTag } = require('../models');

// Step 1: Create quiz
const createQuiz = async (req, res) => {
  try {
    const { createdBy, title, description, difficulty, passingScore, categoryId, tags } = req.body;
    // Create the quiz
    const quiz = await Quiz.create({
      title,
      description,
      difficulty,
      passingScore,
      categoryId,
      status: 'draft',
      createdBy: createdBy // assuming req.user is set by auth middleware
    });
    // Associate tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagId of tags) {
        await QuizTag.create({ quizId: quiz.id, tagId });
      }
    }
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 3a: Get quiz details for confirmation
const getQuizConfirmation = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId, {
      include: [
        { model: Question, as: 'questions' },
        { model: User, as: 'creator', attributes: ['name', 'email'] },
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Tag, as: 'tags', attributes: ['name'], through: { attributes: [] } }
      ]
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    // Remove id fields from main quiz object
    const quizObj = quiz.toJSON();
    delete quizObj.id;
    delete quizObj.categoryId;
    delete quizObj.createdBy;
    // Remove id fields from nested objects
    if (quizObj.creator) delete quizObj.creator.id;
    if (quizObj.category) delete quizObj.category.id;
    if (Array.isArray(quizObj.questions)) {
      quizObj.questions = quizObj.questions.map(q => {
        const { id, quizId, ...rest } = q;
        return rest;
      });
    }
    if (Array.isArray(quizObj.tags)) {
      quizObj.tags = quizObj.tags.map(t => {
        const { id, ...rest } = t;
        return rest;
      });
    }
    res.json(quizObj);
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

// Get all quizzes with details
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        { model: Question, as: 'questions' },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get quiz by id with details
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId, {
      include: [
        { model: Question, as: 'questions' },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quiz by id
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    await quiz.update(req.body);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createQuiz,
  getQuizConfirmation,
  updateQuizStatus,
  deleteQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz
};
