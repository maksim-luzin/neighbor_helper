module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint(
      'Spams',
      {
        fields: ['telegramId', 'assignmentId'],
        type: 'unique',
        name: 'telegramIdAndAssignmentIdUnique',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Spams',
      'telegramIdAndAssignmentIdUnique',
    );
  },
};
