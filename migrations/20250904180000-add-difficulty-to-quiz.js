'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('quizzes', 'difficulty', {
      type: Sequelize.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'medium'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('quizzes', 'difficulty');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quizzes_difficulty";');
  }
};
