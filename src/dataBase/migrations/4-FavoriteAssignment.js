module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('FavoriteAssignment', {
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
            assignmentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Assignment',
                    key: 'id'
                }
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
        await queryInterface.dropTable('FavoriteAssignment');
    }
};
