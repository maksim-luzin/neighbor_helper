module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Users',
      'username',
      {
        allowNull: false,
        type: Sequelize.STRING,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'username',
    );
  },
};
