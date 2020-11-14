module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assignment', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      authorTelegramId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'telegramId'
        }
      },
      title: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      description: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      reward: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      link: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Location",
          key: 'id'
        }
      },
      status: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      category: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      spamScore: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pictureUrl: {
        type: Sequelize.VARCHAR,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assignment');
  }
};
