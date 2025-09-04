const { Quiz, Question, Option, Category, Tag } = require('../models');

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      message: 'Quizzes retrieved successfully',
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get quizzes',
      message: error.message
    });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'] },
        {
          model: Question,
          include: [{ model: Option, attributes: ['id', 'text', 'isCorrect'] }]
        }
      ]
    });
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found',
        message: `Quiz with ID ${id} does not exist`
      });
    }
    res.status(200).json({
      message: 'Quiz retrieved successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get quiz',
      message: error.message
    });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, tags, questions } = req.body;
    if (!title || !categoryId || !difficulty || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title, category, difficulty, and questions are required'
      });
    }
    const quiz = await Quiz.create({ title, description, categoryId, difficulty });
    // Add tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
      await quiz.setTags(tags);
    }
    // Add questions and options
    for (const q of questions) {
      const question = await Question.create({
        quizId: quiz.id,
        text: q.text,
        type: q.type || 'multiple-choice'
      });
      if (Array.isArray(q.options)) {
        for (const opt of q.options) {
          await Option.create({
            questionId: question.id,
            text: opt.text,
            isCorrect: !!opt.isCorrect
          });
        }
      }
    }
    const createdQuiz = await Quiz.findByPk(quiz.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Tag, attributes: ['id', 'name'] },
        {
          model: Question,
          include: [{ model: Option, attributes: ['id', 'text', 'isCorrect'] }]
        }
      ]
    });
    res.status(201).json({
      message: 'Quiz created successfully',
      data: createdQuiz
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create quiz',
      message: error.message
    });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found',
        message: `Quiz with ID ${id} does not exist`
      });
    }
    await quiz.update(updateData);
    res.status(200).json({
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update quiz',
      message: error.message
    });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({
        error: 'Quiz not found',
        message: `Quiz with ID ${id} does not exist`
      });
    }
    await quiz.destroy();
    res.status(200).json({
      message: 'Quiz deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete quiz',
      message: error.message
    });
  }
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    // TODO: Implement quiz scoring logic
    res.status(200).json({
      message: 'Quiz submission endpoint',
      data: { quizId: id, submittedAnswers: answers?.length || 0 },
      note: 'Implementation pending - add scoring logic'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit quiz',
      message: error.message
    });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
};
