module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'FavoriteAssignments',
      'FavoriteAssignments_assignmentId_fkey',
    );

    await queryInterface.addConstraint(
      'FavoriteAssignments',
      {
        fields: ['assignmentId'],
        type: 'foreign key',
        references: {
          table: 'Assignments',
          field: 'id',
        },
        onDelete: 'CASCADE',
        name: 'FavoriteAssignments_assignmentId_fkey',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'FavoriteAssignments',
      'FavoriteAssignments_assignmentId_fkey',
    );

    await queryInterface.addConstraint(
      'FavoriteAssignments',
      {
        fields: ['assignmentId'],
        type: 'foreign key',
        references: {
          table: 'Assignments',
          field: 'id',
        },
        onDelete: 'NO ACTION',
        name: 'FavoriteAssignments_assignmentId_fkey',
      },
    );
  },
};
