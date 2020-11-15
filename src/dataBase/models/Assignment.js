const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Assignment extends Model {
        static associate(models) {
           Assignment.belongsTo(models.User, {foreignKey: ''})
        }
    }
    Assignment.init({
        authorTelegramId: DataTypes.INTEGER,
        locationId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Assignment',
    });
    return Assignment;
};
