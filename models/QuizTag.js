const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const QuizTag = sequelize.define('QuizTag', {
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
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'quiz_tags',
  timestamps: false
});

module.exports = QuizTag;
