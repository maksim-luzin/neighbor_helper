const {
  Model,
} = require('sequelize');

const { SPAM_MODEL_NAME } = require('../../constants').enums.databaseModel;

module.exports = (sequelize, DataTypes) => {
  class Spam extends Model {
    static associate(models) {
      Spam.belongsTo(models.User, { foreignKey: 'telegramId' });
      Spam.belongsTo(models.Assignment, { foreignKey: 'assignmentId' });
    }
  }
  Spam.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    telegramId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'telegramId',
      },
    },
    assignmentId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Assignments',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: SPAM_MODEL_NAME,
  });
  return Spam;
};
