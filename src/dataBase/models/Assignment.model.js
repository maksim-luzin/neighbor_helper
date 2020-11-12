const {Model, DataTypes} = require('sequelize');

const {sequelize} = require('../../configs');
const {
    enums: {
        dataBaseModel: {
            ASSIGNMENT_MODEL_NAME
        }
    }
} = require('../../constants');

class AssignmentModel extends Model {
}

module.exports = new AssignmentModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        // authorTelegramId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        title: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        description: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        reward: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        link: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        status: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        category: {
            type: DataTypes.VARCHAR,
            allowNull: false
        },
        spamScore: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pictureUrl: {
            type: DataTypes.VARCHAR,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: ASSIGNMENT_MODEL_NAME,
        tableName: ASSIGNMENT_MODEL_NAME
    })

module.exports = AssignmentModel;
