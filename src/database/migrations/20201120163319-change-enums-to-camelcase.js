'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'status',
      defaultValue: 'notDone',
      newValues: ['notDone', 'done'],
      enumName: 'enum_Assignments_status'
    });

    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'category',
      defaultValue: 'other',
      newValues: ['help', 'barter', 'repair', 'education', 'other'],
      enumName: 'enum_Assignments_category'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'status',
      defaultValue: 'Not done',
      newValues: ['Not done', 'Done'],
      enumName: 'enum_Assignments_status'
    });

    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'category',
      defaultValue: 'Other',
      newValues: ['Help', 'Barter', 'Repair', 'Education', 'Other'],
      enumName: 'enum_Assignments_category'
    });
  }
};
