const { Sequelize } = require('sequelize');

const {
    DATABASE_DIALECT,
    DATABASE_USER,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD
} = require('./global.config');

module.exports = new Sequelize(
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    {
        dialect: DATABASE_DIALECT,
        host: DATABASE_HOST
    }
)
