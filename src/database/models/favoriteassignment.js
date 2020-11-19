'use strict';

const { FAVORITE_ASSIGNMENT_MODEL_NAME } = require('../../constants').enums.dataBaseModel;

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoriteAssignment extends Model {
    static associate(models) {
      FavoriteAssignment.belongsTo(models.User, {foreignKey: 'telegramId'});
      FavoriteAssignment.belongsTo(models.Assignment, {foreignKey: 'assignmentId'});
    }
  };
  FavoriteAssignment.init({
    telegramId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'telegramId',
      }
    },
    assignmentId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Assignments',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: FAVORITE_ASSIGNMENT_MODEL_NAME,
  });
  return FavoriteAssignment;
};
