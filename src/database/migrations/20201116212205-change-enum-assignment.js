const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'status',
      defaultValue: 'Not done',
      newValues: ['Not done', 'Done'],
      enumName: 'enum_Assignments_status',
    });

    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'category',
      defaultValue: 'Other',
      newValues: ['Help', 'Barter', 'Repair', 'Education', 'Other'],
      enumName: 'enum_Assignments_category',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'status',
      defaultValue: 'Не выполнено',
      newValues: ['Не выполнено', 'Выполнено'],
      enumName: 'enum_Assignments_status',
    });

    await replaceEnum({
      queryInterface,
      tableName: 'Assignments',
      columnName: 'category',
      defaultValue: 'Другое',
      newValues: ['Помощь', 'Обмен', 'Ремонт', 'Обучение', 'Другое'],
      enumName: 'enum_Assignments_category',
    });
  },
};
