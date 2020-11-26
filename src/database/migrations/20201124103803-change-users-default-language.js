module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE ONLY "Users" ALTER COLUMN locale SET DEFAULT \'en\';');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE ONLY "Users" ALTER COLUMN locale SET DEFAULT \'ua\';');
  },
};
