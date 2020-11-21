'use strict';

const { USER_MODEL_NAME } = require('../../constants').enums.databaseModel;

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Location, {foreignKey: 'telegramId'});
      User.hasMany(models.Assignment, { foreignKey: 'authorTelegramId', as: 'createdAssignments'});

      User.belongsToMany(models.Assignment, { through: 'FavoriteAssignments', foreignKey: 'telegramId', as: 'favoriteAssignments'});
    }
  }
  User.init({
    telegramId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    score: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    range: {
      allowNull: false,
      defaultValue: 3,
      type: DataTypes.INTEGER
    },
    locale: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['ua', 'ru', 'en'],
      defaultValue: 'ua',
    }
  }, {
    sequelize,
    modelName: USER_MODEL_NAME,
  });
  return User;
};
