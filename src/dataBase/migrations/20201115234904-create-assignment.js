'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      reward: {
        allowNull: true,
        type: Sequelize.STRING
      },
      link: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Не выполнено', 'Выполнено'],
        defaultValue: 'Не выполнено'
      },
      pictureUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      spamScore: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      category: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Помощь', 'Обмен', 'Ремонт', 'Обучение', 'Другое'],
        defaultValue: 'Другое'
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
    await queryInterface.dropTable('Assignments');
  }
};
