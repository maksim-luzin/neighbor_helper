'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      telegramId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      score: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      range: {
        allowNull: false,
        defaultValue: 3,
        type: Sequelize.INTEGER
      },
      locale: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['ua', 'ru', 'en'],
        defaultValue: 'ua',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
