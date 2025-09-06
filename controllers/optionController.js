const { Option } = require('../models');

// Create an option for a question
exports.createOption = async (req, res) => {
  try {
    const { questionId, text, isCorrect } = req.body;
    const option = await Option.create({ questionId, text, isCorrect });
    res.status(201).json(option);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all options for a question
exports.getOptionsByQuestion = async (req, res) => {
  try {
    const options = await Option.findAll({ where: { questionId: req.params.questionId } });
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get option by id
exports.getOptionById = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Option not found' });
    res.json(option);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update option by id
exports.updateOption = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Option not found' });
    await option.update(req.body);
    res.json(option);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete option by id
exports.deleteOption = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Option not found' });
    await option.destroy();
    res.json({ message: 'Option deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
