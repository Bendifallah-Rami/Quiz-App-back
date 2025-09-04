const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    defaultValue: 'medium'
  },
  passingScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft'
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

// Instance methods
Quiz.prototype.getQuestionCount = async function() {
  const Question = require('./Question');
  return await Question.count({ where: { quizId: this.id } });
};

Quiz.prototype.getAverageScore = async function() {
  const QuizAttempt = require('./QuizAttempt');
  const attempts = await QuizAttempt.findAll({
    where: { quizId: this.id },
    attributes: ['score']
  });
  
  if (attempts.length === 0) return 0;
  
  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round(totalScore / attempts.length);
};

Quiz.prototype.getTotalAttempts = async function() {
  const QuizAttempt = require('./QuizAttempt');
  return await QuizAttempt.count({ where: { quizId: this.id } });
};

module.exports = Quiz;
