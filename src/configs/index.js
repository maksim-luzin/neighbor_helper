require('dotenv').config();

module.exports.global = require('./global.config');
module.exports.sequelize = require('./sequelize.config');
module.exports.winstonOptions = require('./winston.config');
