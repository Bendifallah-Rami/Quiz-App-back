const { QuizTag } = require('../models');

// Create a QuizTag
exports.createQuizTag = async (req, res) => {
  try {
    const { quizId, tagId } = req.body;
    const quizTag = await QuizTag.create({ quizId, tagId });
    res.status(201).json(quizTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all QuizTags
exports.getAllQuizTags = async (req, res) => {
  try {
    const quizTags = await QuizTag.findAll();
    res.json(quizTags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a QuizTag by id
exports.getQuizTagById = async (req, res) => {
  try {
    const quizTag = await QuizTag.findByPk(req.params.id);
    if (!quizTag) return res.status(404).json({ error: 'QuizTag not found' });
    res.json(quizTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a QuizTag by id
exports.updateQuizTag = async (req, res) => {
  try {
    const quizTag = await QuizTag.findByPk(req.params.id);
    if (!quizTag) return res.status(404).json({ error: 'QuizTag not found' });
    await quizTag.update(req.body);
    res.json(quizTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a QuizTag by id
exports.deleteQuizTag = async (req, res) => {
  try {
    const quizTag = await QuizTag.findByPk(req.params.id);
    if (!quizTag) return res.status(404).json({ error: 'QuizTag not found' });
    await quizTag.destroy();
    res.json({ message: 'QuizTag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
