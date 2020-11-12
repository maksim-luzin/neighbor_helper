const {Model, DataTypes} = require('sequelize');

const {sequelize} = require('../../configs');
const {
    enums: {
        dataBaseModel: {
            FAVORITE_ASSIGNMENT_MODEL_NAME
        }
    }
} = require('../../constants');

class FavoriteAssignmentModel extends Model {
}

module.exports = new FavoriteAssignmentModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    },
    {
        sequelize,
        modelName: FAVORITE_ASSIGNMENT_MODEL_NAME,
        tableName: FAVORITE_ASSIGNMENT_MODEL_NAME
    })

module.exports = FavoriteAssignmentModel;
