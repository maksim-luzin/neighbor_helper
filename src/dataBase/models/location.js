'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.belongsTo(models.User, {foreignKey: 'telegramId'});
      Location.hasOne(models.Assignment, { foreignKey: 'locationId'});
    }
  };
  Location.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    telegramId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'telegramId'
      }
    },
    coordinates: {
      allowNull: false,
      type: DataTypes.GEOGRAPHY
    },
    localName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    globalName: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};
