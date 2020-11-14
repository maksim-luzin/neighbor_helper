module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Location', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
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
                type: Sequelize.VARCHAR,
                allowNull: false
            },
            globalName: {
                type: Sequelize.VARCHAR,
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
