const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FavoriteAssignment extends Model {
        static associate(models) {
            FavoriteAssignment.belongsToMany(models.User, {through: 'UserFavoriteAssignment', foreignKey: 'telegramId'});
            FavoriteAssignment.belongsTo(models.Assignment, {foreignKey: 'assignmentId'});
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

