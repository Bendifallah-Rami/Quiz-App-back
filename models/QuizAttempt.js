const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'quiz_attempts',
  timestamps: true
});

// Instance methods
QuizAttempt.prototype.calculateScore = async function() {
  const AttemptAnswer = require('./AttemptAnswer');
  const answers = await AttemptAnswer.findAll({
    where: { attemptId: this.id }
  });
  
  const correctAnswers = answers.filter(answer => answer.isCorrect);
  const totalQuestions = answers.length;
  
  if (totalQuestions === 0) return 0;
  
  // Calculate percentage score
  this.score = Math.round((correctAnswers.length / totalQuestions) * 100);
  await this.save();
  
  return this.score;
};

QuizAttempt.prototype.complete = async function() {
  this.completedAt = new Date();
  await this.calculateScore();
  await this.save();
  
  // Update user stats
  const UserStats = require('./UserStats');
  let userStats = await UserStats.findOne({ where: { userId: this.userId } });
  
  if (!userStats) {
    userStats = await UserStats.create({ userId: this.userId });
  }
  
  await userStats.updateStats(this.score);
  
  return this;
};

QuizAttempt.prototype.getDuration = function() {
  if (!this.completedAt) return null;
  return Math.round((this.completedAt - this.startedAt) / 1000); // Duration in seconds
};

QuizAttempt.prototype.getAnswers = async function() {
  const AttemptAnswer = require('./AttemptAnswer');
  return await AttemptAnswer.findAll({
    where: { attemptId: this.id },
    include: ['Question', 'SelectedOption']
  });
};

module.exports = QuizAttempt;
