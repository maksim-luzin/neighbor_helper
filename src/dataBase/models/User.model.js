const {Model, DataTypes} = require('sequelize');

const {sequelize} = require('../../configs');
const {
    enums: {
        dataBaseModel: {
            USER_MODEL_NAME
        }
    }
} = require('../../constants');

class UserModel extends Model {
}

module.exports = new UserModel.init({
    telegramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    range: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    },
    {
        sequelize,
        modelName: USER_MODEL_NAME,
        tableName: USER_MODEL_NAME
    })

module.exports = UserModel;
