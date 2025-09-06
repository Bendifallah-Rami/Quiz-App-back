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
  quizzesPassed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastActivityDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_stats',
  timestamps: false
});

// Instance methods
UserStats.prototype.updateStats = async function(quizScore, passed) {
  this.totalScore += quizScore;
  this.quizzesTaken += 1;
  if (passed) this.quizzesPassed += 1;
  
  // Update streak logic
  const today = new Date().toISOString().split('T')[0];
  const lastActive = this.lastActivityDate ? this.lastActivityDate.toISOString().split('T')[0] : null;
  
  if (lastActive) {
    const daysDiff = Math.floor((new Date(today) - new Date(lastActive)) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      this.currentStreak += 1;
    } else if (daysDiff > 1) {
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
  }
  
  // Update longest streak if current streak is greater
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.lastActivityDate = today;
  await this.save();
};

UserStats.prototype.getAverageScore = function() {
  return this.quizzesTaken > 0 ? Math.round(this.totalScore / this.quizzesTaken) : 0;
};

module.exports = UserStats;
