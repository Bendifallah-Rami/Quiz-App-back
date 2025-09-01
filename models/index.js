// Import sequelize connection
const { sequelize } = require('../config/connection');

// Import all models
const User = require('./User');
const UserStats = require('./UserStats');
const Category = require('./Category');
const Quiz = require('./Quiz');
const Tag = require('./Tag');
const QuizTag = require('./QuizTag');
const Question = require('./Question');
const Option = require('./Option');
const QuizAttempt = require('./QuizAttempt');
const AttemptAnswer = require('./AttemptAnswer');

// Export all models
module.exports = {
  sequelize,
  User,
  UserStats,
  Category,
  Quiz,
  Tag,
  QuizTag,
  Question,
  Option,
  QuizAttempt,
  AttemptAnswer
};
