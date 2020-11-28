require('dotenv').config();

module.exports = {
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT,

  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN, // for local development
};
