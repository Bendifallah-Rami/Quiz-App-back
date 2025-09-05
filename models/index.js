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

// Associations
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// Quiz belongs to User (creator)
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Quiz, { foreignKey: 'createdBy', as: 'quizzes' });

// Quiz belongs to Category
Quiz.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Quiz, { foreignKey: 'categoryId', as: 'quizzes' });

// Quiz belongsToMany Tag (many-to-many)
Quiz.belongsToMany(Tag, { through: 'QuizTag', as: 'tags', foreignKey: 'quizId' });
Tag.belongsToMany(Quiz, { through: 'QuizTag', as: 'quizzes', foreignKey: 'tagId' });

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
