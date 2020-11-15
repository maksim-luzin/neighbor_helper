const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Location extends Model {
        static associate(models) {
            Location.belongsTo(models.User, {foreignKey: 'telegramId'});
        }
    }
    Location.init({
        localName: DataTypes.STRING,
        globalName: DataTypes.STRING,
        coordinates: DataTypes.STRING,
        telegramId: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Location',
    });
    return Location;
};

