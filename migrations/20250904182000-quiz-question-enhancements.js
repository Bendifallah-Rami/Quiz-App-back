'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Quiz model changes

    // Question model changes
    await queryInterface.addColumn('questions', 'points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
    await queryInterface.addColumn('questions', 'explanation', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('questions', 'points');
    await queryInterface.removeColumn('questions', 'explanation');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quizzes_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_questions_type";');
  }
};
