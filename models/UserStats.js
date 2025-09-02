const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const UserStats = sequelize.define('UserStats', {
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
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  quizzesTaken: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  streak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastActiveDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'user_stats',
  timestamps: true
});

// Instance methods
UserStats.prototype.updateStats = async function(quizScore) {
  this.totalScore += quizScore;
  this.quizzesTaken += 1;
  
  // Update streak logic
  const today = new Date().toISOString().split('T')[0];
  const lastActive = this.lastActiveDate ? this.lastActiveDate.toISOString().split('T')[0] : null;
  
  if (lastActive) {
    const daysDiff = Math.floor((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      this.streak += 1;
    } else if (daysDiff > 1) {
      this.streak = 1;
    }
  } else {
    this.streak = 1;
  }
  
  this.lastActiveDate = today;
  await this.save();
};

UserStats.prototype.getAverageScore = function() {
  return this.quizzesTaken > 0 ? Math.round(this.totalScore / this.quizzesTaken) : 0;
};

module.exports = UserStats;
