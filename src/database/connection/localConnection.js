const Sequelize = require('sequelize');
const developConfig = require('../../configs/global.config');

const sequelize = new Sequelize(
  developConfig.DATABASE_NAME,
  developConfig.DATABASE_USER,
  developConfig.DATABASE_PASSWORD,
  {
    host: developConfig.DATABASE_HOST,
    dialect: developConfig.DATABASE_DIALECT,
  },
);

module.exports = sequelize;
