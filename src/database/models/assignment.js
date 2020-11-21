'use strict';

const { ASSIGNMENT_MODEL_NAME } = require('../../constants').enums.databaseModel;

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Location, {foreignKey: 'locationId'});
      Assignment.belongsTo(models.User, {foreignKey: 'authorTelegramId', as: 'author'});

      Assignment.belongsToMany(models.User, {through: 'FavoriteAssignments', foreignKey: 'assignmentId', as: 'favoriteUsers'});
    }
  };
  Assignment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    authorTelegramId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'telegramId'
      }
    },
    locationId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Locations',
        key: 'id'
      }
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    reward: {
      allowNull: true,
      type: DataTypes.STRING
    },
    link: {
      allowNull: true,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['notDone', 'done'],
      defaultValue: 'notDone'
    },
    pictureUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    spamScore: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    category: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['help', 'barter', 'repair', 'education', 'other'],
      defaultValue: 'other'
    }
  }, {
    sequelize,
    modelName: ASSIGNMENT_MODEL_NAME,
  });
  return Assignment;
};
