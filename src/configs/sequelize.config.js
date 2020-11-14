const {
    DATABASE_PASSWORD,
    DATABASE_USER,
    DATABASE_HOST,
    DATABASE_DIALECT,
    DATABASE_NAME
} = require('../configs/global.config');
module.exports = {
    "development": {
        "username": DATABASE_USER,
        "password": DATABASE_PASSWORD,
        "database": DATABASE_NAME,
        "host": DATABASE_HOST,
        "dialect": DATABASE_DIALECT
    },
    "production": {
        "username": "root",
        "password": "HomeHome20012018",
        "database": "chatBot",
        "host": "127.0.0.1",
        "dialect": "postgres"
    }
}
