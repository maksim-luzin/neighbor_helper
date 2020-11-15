module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Location', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            telegramId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'telegramId'
                }
            },
            localName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            globalName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            coordinates: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Location');
    }
};
