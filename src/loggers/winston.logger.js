const winston = require('winston');

const {winstonOptions} = require('../configs');

module.exports = winston.createLogger({
    transports: [
        new (winston.transports.File)(winstonOptions.errorFile)
    ],
    exitOnError: false
})
