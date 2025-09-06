'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_stats', 'currentStreak', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('user_stats', 'longestStreak', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    await queryInterface.addColumn('user_stats', 'lastActivityDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_stats', 'currentStreak');
    await queryInterface.removeColumn('user_stats', 'longestStreak');
    await queryInterface.removeColumn('user_stats', 'lastActivityDate');
  }
};
