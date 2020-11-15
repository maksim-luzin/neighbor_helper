module.exports = {
    PORT: process.env.PORT || '5000',
    HOST: process.env.HOST || 'http://localhost',
    DATABASE_USER: process.env.DATABASE_USER || 'dashaonishchenko',

    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'HomeHome20012018',
    DATABASE_NAME: process.env.DATABASE_NAME || 'chatBot',
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'postgres',

    // SEQUELIZE_SYNC_OPTIONS: {
    //     alter: false
    // }
}
