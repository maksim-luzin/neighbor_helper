module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Users',
      'state',
      {
        type: Sequelize.JSONB,
        defaultValue: {
          data: '',
          step: '',
          cache: '',
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'state',
    );
  },
};
