'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      // Add googleId column
      queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }),
      
      // Add googleProfilePicture column
      queryInterface.addColumn('users', 'googleProfilePicture', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      
      // Add authProvider column
      queryInterface.addColumn('users', 'authProvider', {
        type: Sequelize.ENUM('local', 'google'),
        defaultValue: 'local',
        allowNull: false
      }),
      
      // Modify passwordHash to allow NULL for Google users
      queryInterface.changeColumn('users', 'passwordHash', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'googleId'),
      queryInterface.removeColumn('users', 'googleProfilePicture'),
      queryInterface.removeColumn('users', 'authProvider'),
      
      // Revert passwordHash to NOT NULL
      queryInterface.changeColumn('users', 'passwordHash', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]);
  }
};
