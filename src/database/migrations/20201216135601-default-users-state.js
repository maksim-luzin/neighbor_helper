module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE ONLY "Users" ALTER COLUMN state SET DEFAULT \'{}\';');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE ONLY "Users" ALTER COLUMN state SET DEFAULT \'null\';');
  },
};
