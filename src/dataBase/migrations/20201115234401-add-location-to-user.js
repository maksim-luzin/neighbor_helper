'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'Locations',
        'telegramId',
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
        'Locations',
        'telegramId',
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
