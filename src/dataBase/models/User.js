const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.FavoriteAssignment, {through:'UserFavoriteAssignment', foreignKey:'assignmentId'});
        }
    }
    User.init({
        score: DataTypes.INTEGER,
        range: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};

