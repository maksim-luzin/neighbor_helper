const {Model, DataTypes} = require('sequelize');

const {sequelize} = require('../../configs');
const {
    enums: {
        dataBaseModel: {
            LOCATION_MODEL_NAME
        }
    }
} = require('../../constants');

class LocationModel extends Model {
}

module.exports = new LocationModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.VARCHAR,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: LOCATION_MODEL_NAME,
        tableName: LOCATION_MODEL_NAME
    })

module.exports = UserModel;
