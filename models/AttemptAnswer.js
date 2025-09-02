const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const AttemptAnswer = sequelize.define('AttemptAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quiz_attempts',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  selectedOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'options',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'attempt_answers',
  timestamps: true
});

module.exports = AttemptAnswer;
