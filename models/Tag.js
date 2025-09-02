const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 30]
    }
  }
}, {
  tableName: 'tags',
  timestamps: true
});

module.exports = Tag;
