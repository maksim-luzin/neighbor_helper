const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FavoriteAssignment extends Model {
        static associate(models) {

        }
    }
    FavoriteAssignment.init({
        telegramId: DataTypes.INTEGER,
        assignmentId: DataTypes.INTEGER

    }, {
        sequelize,
        modelName: 'FavoriteAssignment',
    });
    return FavoriteAssignment;
};

