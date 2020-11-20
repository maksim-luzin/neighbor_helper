module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint(
      'Locations',
      {
        fields: ['telegramId', 'localName'],
        type: 'unique',
        name: 'telegramIdAndLocalnameUnique',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Locations',
      'telegramIdAndLocalnameUnique',
    );
  },
};
