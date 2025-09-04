const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quizzes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 1000]
    }
  },
  type: {
    type: DataTypes.ENUM('single-choice', 'multiple-choice', 'short-answer', 'true-false'),
    allowNull: false,
    defaultValue: 'single-choice'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'questions',
  timestamps: true
});

// Instance methods
Question.prototype.getCorrectOptions = async function() {
  const Option = require('./Option');
  return await Option.findAll({
    where: { 
      questionId: this.id,
      isCorrect: true
    }
  });
};

Question.prototype.getAllOptions = async function() {
  const Option = require('./Option');
  return await Option.findAll({
    where: { questionId: this.id },
    order: [['id', 'ASC']]
  });
};

Question.prototype.validateAnswer = async function(selectedOptionIds) {
  const correctOptions = await this.getCorrectOptions();
  const correctIds = correctOptions.map(opt => opt.id).sort();
  const selectedIds = Array.isArray(selectedOptionIds) ? selectedOptionIds.sort() : [selectedOptionIds].sort();
  
  return JSON.stringify(correctIds) === JSON.stringify(selectedIds);
};

module.exports = Question;
