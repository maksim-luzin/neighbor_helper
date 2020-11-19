'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'Assignments',
        'authorTelegramId',
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'telegramId'
          }
        }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'Assignments',
        'authorTelegramId',
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'telegramId'
          }
        }
    )
  }
};
