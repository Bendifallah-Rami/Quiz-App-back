'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add new values to the existing enum type for questions.type
    await queryInterface.sequelize.query(`ALTER TYPE "enum_questions_type" ADD VALUE IF NOT EXISTS 'short-answer';`);
    await queryInterface.sequelize.query(`ALTER TYPE "enum_questions_type" ADD VALUE IF NOT EXISTS 'true-false';`);
  },

  async down (queryInterface, Sequelize) {
    // Cannot remove enum values in Postgres, so document this limitation
    // You may need to recreate the enum type manually if you want to remove values
  }
};
